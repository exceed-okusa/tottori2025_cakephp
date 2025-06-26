<?php

namespace App\Shell;

use Cake\Datasource\ConnectionManager;

class DevelopBakeShell extends BaseShell
{
    private $finalLog = [];

    public function outFinalLog()
    {
        $this->out(file_get_contents(LOGS. 'final.log'));
        $this->out('complete successful !!');
    }

    /**
     * @throws \Exception
     */
    public function main()
    {
        $tableConditions = $this->getTableConditions();

        $this->out('complete: getTableConditions');

        foreach ($tableConditions as $tableCondition) {
            $fileNameTable = ROOT. '/src/Model/Table/'. $tableCondition['tableNameCamel']. 'Table.php';
            $fileNameEntity = ROOT. '/src/Model/Entity/'. $tableCondition['entityNameCamel']. '.php';

            if ( file_exists($fileNameTable)) {
                $classTable = file_get_contents($fileNameTable);
            } else {
                $classTable = $this->makeNewTableClass($tableCondition);
            }

            if ( file_exists($fileNameEntity)) {
                $classEntity = file_get_contents($fileNameEntity);
            } else {
                $classEntity = $this->makeNewEntityClass($tableCondition);
            }

            $phpDocTable = $this->makePhpDocTableClass($tableCondition);
            $classTable = $this->replacePhpDoc($classTable, $phpDocTable);
            file_put_contents($fileNameTable, $classTable);

            $phpDocEntity = $this->makePhpDocEntityClass($tableCondition);
            $classEntity = $this->replacePhpDoc($classEntity, $phpDocEntity);
            file_put_contents($fileNameEntity, $classEntity);
        }

        $this->out('complete: developBake');

        file_put_contents(LOGS. 'final.log', print_r($this->finalLog, true));
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function getTableConditions()
    {
        $dbName = $this->connection->config()['database'];

        $tableConditions = [];
        
        foreach($this->connection->query('show tables from '. $dbName)->fetchAll() as $rowShowTables) {
            $tableNameSnake = $rowShowTables[0];
            $tableNameCamel = $this->Common->toCamel($tableNameSnake);
            $entityNameSnake = $this->Common->toSingular($tableNameSnake);
            $entityNameCamel = $this->Common->toSingular($tableNameCamel);
            if ($tableNameCamel === $entityNameCamel) {
                throw new \Exception('テーブル名が単数形です  '. $tableNameSnake);
            }

            $columnConditions = [];
            foreach($this->connection->query('show columns from '. $dbName. '.'. $tableNameSnake)->fetchAll('assoc') as $rowShowColumns) {
                switch (substr($rowShowColumns['Type'], 0, 4)) {
                    case 'int(':
                    case 'bigi':
                        $columnType = 'int';
                        break;
                    case 'char':
                    case 'varc':
                    case 'text':
                    case 'long':
                        $columnType = 'string';
                        break;
                    case 'date':
                    case 'time':
                        $columnType = '\Cake\I18n\Time';
                        break;
                    case 'deci':
                        $columnType = 'float';
                        break;
                    case 'medi':
                        $columnType = 'string|resource';
                        break;
                    default:
                        throw new \Exception($rowShowColumns['Type']. '  '. $tableNameSnake. '  '. $rowShowColumns['Field']);
                }
                $columnConditions[] = [
                    'columnType' => $columnType,
                    'name' => $rowShowColumns['Field'],
                ];
            }

            $associationConditions = [];

            $phpDocVirtualProperties = [];
            $entityFileName = ROOT. '/src/Model/Entity/'. $entityNameCamel. '.php';
            if (file_exists($entityFileName)) {
                /** @var \App\Model\Entity\Customer $entity */
                $entity = $this->$tableNameCamel->newEntity();
                $virtualProperties = $entity->virtualProperties();
                if (!empty($virtualProperties)) {
                    $entityClass = file_get_contents($entityFileName);
                    foreach ($virtualProperties as $virtualProperty) {
                        $end = strpos($entityClass, ' $'. $virtualProperty);
                        if ($end === false) continue;

                        $end += strlen(' $'. $virtualProperty);

                        $start = $current = 0;
                        while ($current = strpos($entityClass, ' * @property', $current +1)) {
                            if ($current > $end) break;
                            $start = $current;
                        }

                        $phpDocVirtualProperties[] = substr($entityClass, $start, $end - $start);
                    }
                }
            }

            $tableConditions[$tableNameCamel] = compact('tableNameCamel', 'tableNameSnake', 'entityNameSnake', 'entityNameCamel', 'columnConditions', 'associationConditions', 'phpDocVirtualProperties');
        }

        $delete = [];
        $invalidAssociation = [];
        foreach (glob(ROOT. '/src/Model/Table/*') as $file) {
            if ($file === ROOT. '/src/Model/Table/BaseTable.php') continue;
            if ($file === ROOT. '/src/Model/Table/_SampleTable.php') continue;

            $tableNameCamel = str_replace('Table.php', '', basename($file));

            if (empty($tableConditions[$tableNameCamel])) {
                // 削除されたテーブル
                $delete[] = $tableNameCamel;
                continue;
            }

            $associationConditions = [];
            /** @var \Cake\ORM\Association $association */
            foreach ($this->{$tableNameCamel}->associations()->getIterator() as $association) {
                $associationAlias = $association->alias();
                $associationClassName = $association->className();

                $associationTable = empty($associationClassName) ? $associationAlias : $associationClassName ;

                if (empty($tableConditions[$associationTable])) {
                    $label = $tableNameCamel. '  '. $associationTable;
                    if ($label !== 'MenuSettings  TmpMenuFunctions') {
                        $invalidAssociation[] = $label;
                    }
                    continue;
                }

                $associationConditions[] = [
                    'entityNameCamel' => $tableConditions[$associationTable]['entityNameCamel'],
                    'hasMany' => (get_class($association) === 'Cake\ORM\Association\HasMany') ? '[]' : '',
                    'property' => $association->property(),
                ];
            }

            $tableConditions[$tableNameCamel]['associationConditions'] = $associationConditions;
        }

        $this->finalLog['delete'] = $delete;
        $this->finalLog['invalidAssociation'] = $invalidAssociation;

        return $tableConditions;
    }

    private function makePhpDocTableClass($tableCondition)
    {
        $phpDoc = '';

        $phpDoc .= '/**'. "\r\n";

        $phpDoc .= ' * '. $tableCondition['tableNameCamel']. ' Model'. "\r\n";
        $phpDoc .= ' *'. "\r\n";
        $phpDoc .= ' * @method \App\Model\Entity\\'. $tableCondition['entityNameCamel']. ' get($primaryKey, $options = [])'. "\r\n";
        $phpDoc .= ' * @method \App\Model\Entity\\'. $tableCondition['entityNameCamel']. ' newEntity($data = null, array $options = [])'. "\r\n";
        $phpDoc .= ' * @method \App\Model\Entity\\'. $tableCondition['entityNameCamel']. '[] newEntities(array $data, array $options = [])'. "\r\n";
        $phpDoc .= ' * @method \App\Model\Entity\\'. $tableCondition['entityNameCamel']. '|bool save(\Cake\Datasource\EntityInterface $entity, $options = [])'. "\r\n";
        $phpDoc .= ' * @method \App\Model\Entity\\'. $tableCondition['entityNameCamel']. ' patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])'. "\r\n";
        $phpDoc .= ' * @method \App\Model\Entity\\'. $tableCondition['entityNameCamel']. '[] patchEntities($entities, array $data, array $options = [])'. "\r\n";
        $phpDoc .= ' * @method \App\Model\Entity\\'. $tableCondition['entityNameCamel']. ' findOrCreate($search, callable $callback = null)'. "\r\n";

        $phpDoc .= ' */';

        return $phpDoc;
    }

    private function makePhpDocEntityClass($tableCondition)
    {
        $phpDoc = '';

        $phpDoc .= '/**'. "\r\n";

        $phpDoc .= ' * '. $tableCondition['entityNameCamel']. ' Entity'. "\r\n";
        $phpDoc .= ' *'. "\r\n";

        foreach ($tableCondition['columnConditions'] as $condition) {
            $phpDoc .= ' * @property '. $condition['columnType']. ' $'. $condition['name']. "\r\n";
        }

        $phpDoc .= ' *'. "\r\n";

        foreach ($tableCondition['associationConditions'] as $condition) {
            $phpDoc .= ' * @property \App\Model\Entity\\'. $condition['entityNameCamel']. $condition['hasMany']. ' $'. $condition['property']. "\r\n";
        }

        if (!empty($tableCondition['phpDocVirtualProperties'])) {
            $phpDoc .= ' *'. "\r\n";

            foreach ($tableCondition['phpDocVirtualProperties'] as $phpDocVirtualProperty) {
                $phpDoc .= $phpDocVirtualProperty. "\r\n";
            }
        }

        $phpDoc .= ' */';

        return $phpDoc;
    }

    /**
     * @param $class
     * @param $newPhpDoc
     * @return mixed
     * @throws \Exception
     */
    private function replacePhpDoc($class, $newPhpDoc)
    {
        $start = strpos($class, '/**');
        $end = strpos($class, '*/');
        if ($start === false || $end === false || $start > $end) {
            throw new \Exception($newPhpDoc);
        }

        $exceedDefinedMark = ' ***** exceed defined';
        $exceedDefinedDocs = '';
        $current = 0;
        while (true) {
            $posExceedDefined = strpos($class, $exceedDefinedMark, $current);
            if ($posExceedDefined === false) {
                break;
            }

            $nextRowStart = strpos($class, ' * ', $current +1);
            if ($nextRowStart !== false && $nextRowStart < $posExceedDefined) {
                $current = $nextRowStart;
                continue;
            }

            $exceedDefinedDocs .= substr($class, $current, $posExceedDefined - $current). $exceedDefinedMark. "\r\n";

            if ($nextRowStart === false || $nextRowStart > $end) {
                break;
            }

            $current = $nextRowStart;
        }

        $length = $end - $start + strlen('*/');

        $class = substr_replace($class, $newPhpDoc, $start, $length);

        if (!empty($exceedDefinedDocs)) {
            $end = strpos($class, ' */');
            $class = substr_replace($class, ' *'. "\r\n". $exceedDefinedDocs, $end, 0);
        }

        return $class;
    }

    private function makeNewTableClass($tableCondition)
    {
        $newTableClass = '';

        $newTableClass .= '<?php'. "\r\n";
        $newTableClass .= 'namespace App\Model\Table;'. "\r\n";
        $newTableClass .= ''. "\r\n";
        $newTableClass .= 'use Cake\Validation\Validator;'. "\r\n";
        $newTableClass .= ''. "\r\n";
        $newTableClass .= '/** */'. "\r\n";
        $newTableClass .= 'class '. $tableCondition['tableNameCamel']. 'Table extends BaseTable'. "\r\n";
        $newTableClass .= '{'. "\r\n";
        $newTableClass .= '    /**'. "\r\n";
        $newTableClass .= '     * @param array $config'. "\r\n";
        $newTableClass .= '     * @throws \Exception'. "\r\n";
        $newTableClass .= '     */'. "\r\n";
        $newTableClass .= '    public function initialize(array $config)'. "\r\n";
        $newTableClass .= '    {'. "\r\n";
        $newTableClass .= '        parent::initialize($config);'. "\r\n";
        $newTableClass .= ''. "\r\n";
        $newTableClass .= '        $this->tableName = \''. $tableCondition['tableNameSnake']. '\';'. "\r\n";
        $newTableClass .= ''. "\r\n";
        $newTableClass .= '        $this->displayField(\'id\');'. "\r\n";
        $newTableClass .= '        $this->primaryKey(\'id\');'. "\r\n";
        $newTableClass .= '    }'. "\r\n";
        $newTableClass .= '}'. "\r\n";

        return $newTableClass;
    }

    private function makeNewEntityClass($tableCondition)
    {
        $newEntityClass = '';

        $newEntityClass .= '<?php'. "\r\n";
        $newEntityClass .= 'namespace App\Model\Entity;'. "\r\n";
        $newEntityClass .= ''. "\r\n";
        $newEntityClass .= 'use Cake\ORM\Entity;'. "\r\n";
        $newEntityClass .= ''. "\r\n";
        $newEntityClass .= '/** */'. "\r\n";
        $newEntityClass .= 'class '. $tableCondition['entityNameCamel']. ' extends Entity'. "\r\n";
        $newEntityClass .= '{'. "\r\n";
        $newEntityClass .= '    protected $_accessible = ['. "\r\n";
        $newEntityClass .= '        \'*\' => true,'. "\r\n";
        $newEntityClass .= '        \'id\' => false'. "\r\n";
        $newEntityClass .= '    ];'. "\r\n";
        $newEntityClass .= '}'. "\r\n";

        return $newEntityClass;
    }
}
