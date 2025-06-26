<?php
    /**
     * Ternary Operator in Smarty Templates
     * @param $flag Boolean Input true or false as a value is compared within the template
     * @param $yes_value String Print this value when the comparision is true
     * @param $no_value String Print this value when the comparision is NOT true.
     */
    function smarty_modifier_ternary($original_value='', $compare_to_value='', $yes_value='', $no_value='')
    {
        return ($original_value==$compare_to_value)?$yes_value:$no_value;
    }