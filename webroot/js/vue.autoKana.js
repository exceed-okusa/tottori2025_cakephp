// Copyright (c) 2013 Keith Perhac @ DelfiNet (http://delfi-net.com)
//
// Based on the AutoRuby library created by:
// Copyright (c) 2005-2008 spinelz.org (http://script.spinelz.org/)
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function ($) {

    $.fn.vueAutoKana = function (passedOptions) {

        let elName,
            active = false,
            timer = [],
            flagConvert = true,
            input,
            values,
            ignoreString,
            baseKana;

        let options = $.extend(
            {
                'vueObj': null,
                'targetItem': '',
                'katakana': false
            }, passedOptions);

        let methods = {
            change : function() {
                input = eval('options.vueObj.' + options.targetItem);
            }
        };

        // vueObj, targetItem, passedOptions
        // メソッド呼び出し部分
        if ( methods[passedOptions] ) {
            return methods[passedOptions].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }

        let kana_extraction_pattern = new RegExp('[^ 　ぁあ-んー]', 'g');
        let kana_compacting_pattern = new RegExp('[ぁぃぅぇぉっゃゅょ]', 'g');

        elName = this;
        active = true;
        _stateClear();

        elName.blur(_eventBlur);
        elName.focus(_eventFocus);
        elName.keydown(_eventKeyDown);

        $.fn.vueAutoKana.start = function() {
            active = true;
        };

        $.fn.vueAutoKana.stop = function() {
            input = elName.val();
            baseKana =  ''; //eval('options.vueObj.' + options.targetItem);
            values = splitByLength(eval('options.vueObj.' + options.targetItem), 1);
            ignoreString = '';
        };

        function splitByLength(str, length) {
            let resultArr = [];
            if (!str || !length || length < 1) {
                return resultArr;
            }
            let index = 0;
            let start = index;
            let end = start + length;
            while (start < str.length) {
                resultArr[index] = str.substring(start, end);
                index++;
                start = end;
                end = start + length;
            }
            return resultArr;
        }

        function start() {
            active = true;
        }

        function stop() {
            baseKana = '';
            active = false;
        }

        function toggle(event) {
            let ev = event || window.event;
            if (event) {
                let el = Event.element(event);
                if (el.checked) {
                    active = true;
                } else {
                    active = false;
                }
            } else {
                active = !active;
            }
        }

        function _checkConvert(new_values) {
            if (!flagConvert) {
                if (Math.abs(values.length - new_values.length) > 1) {
                    let tmp_values = new_values.join('').replace(kana_compacting_pattern, '').split('');
                    if (Math.abs(values.length - tmp_values.length) > 1) {
                        _stateConvert();
                    }
                } else {
                    if (values.length == input.length && values.join('') != input) {
                        if (input.match(kana_extraction_pattern)) {
                            _stateConvert();
                        }
                    }
                }
            }
        }

        var _checkValue = function() {
            var new_input, new_values;
            new_input = elName.val();
            if (new_input == '') {
                _stateClear();
                _setKana();
            } else {
                new_input = _removeString(new_input);
                if (input == new_input) {
                    return;
                } else {
                    input = new_input;
                    if (!flagConvert) {
                        new_values = new_input.replace(kana_extraction_pattern, '').split('');
                        _checkConvert(new_values);
                        _setKana(new_values);
                    }
                }
            }
        };

        function _clearInterval() {
            clearInterval(timer);
        }

        function _eventBlur(event) {
            _clearInterval();
        }
        function _eventFocus(event) {
            _stateInput();
            _setInterval();
        }
        function _eventKeyDown(event) {
            if (flagConvert) {
                _stateInput();
            }
        }
        function _isHiragana(chara) {
            return ((chara >= 12353 && chara <= 12435) || chara == 12445 || chara == 12446);
        }
        function _removeString(new_input) {
            if (new_input.indexOf(ignoreString) !== -1) {
                return new_input.replace(ignoreString, '');
            } else {
                let i, ignoreArray, inputArray;
                ignoreArray = ignoreString.split('');
                inputArray = new_input.split('');
                for (i = 0; i < ignoreArray.length; i++) {
                    if (ignoreArray[i] == inputArray[i]) {
                        inputArray[i] = '';
                    }
                }
                return inputArray.join('');
            }
        }
        function _setInterval() {
            var self = this;
            timer = setInterval(_checkValue, 30);
        };
        function _setKana(new_values) {
            if (!flagConvert) {
                if (new_values) {
                    values = new_values;
                }
                if (active) {
                    let _val = _toKatakana(baseKana + values.join(''));
                    eval('options.vueObj.' + options.targetItem + '= _val');
                }
            }
        }
        function _stateClear() {
            baseKana = '';
            flagConvert = false;
            ignoreString = '';
            input = '';
            values = [];
        }
        function _stateInput() {
            baseKana = eval('options.vueObj.' + options.targetItem);
            flagConvert = false;
            ignoreString = elName.val();
        }
        function _stateConvert() {
            baseKana = baseKana + values.join('');
            flagConvert = true;
            values = [];
        }
        function _toKatakana(src) {
            if (options.katakana) {
                var c, i, str;
                str = '';
                for (i = 0; i < src.length; i++) {
                    c = src.charCodeAt(i);
                    if (_isHiragana(c)) {
                        str += String.fromCharCode(c + 96);
                    } else {
                        str += src.charAt(i);
                    }
                }
                return str;
            } else {
                return src;
            }
        }
        // function _toHiragana(src) {
        //     if (options.katakana) {
        //         var c, i, str;
        //         str = '';
        //         for (i = 0; i < src.length; i++) {
        //             c = src.charCodeAt(i);
        //             if (_isHiragana(c)) {    // _isKanakana がいるよ！
        //                 str += String.fromCharCode(c - 96);
        //             } else {
        //                 str += src.charAt(i);
        //             }
        //         }
        //         return str;
        //     } else {
        //         return src;
        //     }
        // }
    };
})(jQuery);

(function ($) {

    $.fn.vueAutoKana2 = function (passedOptions) {

        let elName,
            active = false,
            timer = [],
            flagConvert = true,
            input,
            values,
            ignoreString,
            baseKana;

        let options = $.extend(
            {
                'vueObj': null,
                'targetItem': '',
                'katakana': false
            }, passedOptions);

        let methods = {
            change : function() {
                input = eval('options.vueObj.' + options.targetItem);
            }
        };

        // vueObj, targetItem, passedOptions
        // メソッド呼び出し部分
        if ( methods[passedOptions] ) {
            return methods[passedOptions].apply( this, Array.prototype.slice.call( arguments, 1 ));
        }

        let kana_extraction_pattern = new RegExp('[^ 　ぁあ-んー]', 'g');
        let kana_compacting_pattern = new RegExp('[ぁぃぅぇぉっゃゅょ]', 'g');

        elName = this;
        active = true;
        _stateClear();

        elName.blur(_eventBlur);
        elName.focus(_eventFocus);
        elName.keydown(_eventKeyDown);

        $.fn.vueAutoKana2.start = function() {
            active = true;
        };

        $.fn.vueAutoKana2.stop = function() {
            input = elName.val();
            baseKana =  ''; //eval('options.vueObj.' + options.targetItem);
            values = splitByLength(eval('options.vueObj.' + options.targetItem), 1);
            ignoreString = '';
        };

        function splitByLength(str, length) {
            let resultArr = [];
            if (!str || !length || length < 1) {
                return resultArr;
            }
            let index = 0;
            let start = index;
            let end = start + length;
            while (start < str.length) {
                resultArr[index] = str.substring(start, end);
                index++;
                start = end;
                end = start + length;
            }
            return resultArr;
        }

        function start() {
            active = true;
        }

        function stop() {
            baseKana = '';
            active = false;
        }

        function toggle(event) {
            let ev = event || window.event;
            if (event) {
                let el = Event.element(event);
                if (el.checked) {
                    active = true;
                } else {
                    active = false;
                }
            } else {
                active = !active;
            }
        }

        function _checkConvert(new_values) {
            if (!flagConvert) {
                if (Math.abs(values.length - new_values.length) > 1) {
                    let tmp_values = new_values.join('').replace(kana_compacting_pattern, '').split('');
                    if (Math.abs(values.length - tmp_values.length) > 1) {
                        _stateConvert();
                    }
                } else {
                    if (values.length == input.length && values.join('') != input) {
                        if (input.match(kana_extraction_pattern)) {
                            _stateConvert();
                        }
                    }
                }
            }
        }

        var _checkValue = function() {
            var new_input, new_values;
            new_input = elName.val();
            if (new_input == '') {
                _stateClear();
                _setKana();
            } else {
                new_input = _removeString(new_input);
                if (input == new_input) {
                    return;
                } else {
                    input = new_input;
                    if (!flagConvert) {
                        new_values = new_input.replace(kana_extraction_pattern, '').split('');
                        _checkConvert(new_values);
                        _setKana(new_values);
                    }
                }
            }
        };

        function _clearInterval() {
            clearInterval(timer);
        }

        function _eventBlur(event) {
            _clearInterval();
        }
        function _eventFocus(event) {
            _stateInput();
            _setInterval();
        }
        function _eventKeyDown(event) {
            if (flagConvert) {
                _stateInput();
            }
        }
        function _isHiragana(chara) {
            return ((chara >= 12353 && chara <= 12435) || chara == 12445 || chara == 12446);
        }
        function _removeString(new_input) {
            if (new_input.indexOf(ignoreString) !== -1) {
                return new_input.replace(ignoreString, '');
            } else {
                let i, ignoreArray, inputArray;
                ignoreArray = ignoreString.split('');
                inputArray = new_input.split('');
                for (i = 0; i < ignoreArray.length; i++) {
                    if (ignoreArray[i] == inputArray[i]) {
                        inputArray[i] = '';
                    }
                }
                return inputArray.join('');
            }
        }
        function _setInterval() {
            var self = this;
            timer = setInterval(_checkValue, 30);
        };
        function _setKana(new_values) {
            if (!flagConvert) {
                if (new_values) {
                    values = new_values;
                }
                if (active) {
                    let _val = _toKatakana(baseKana + values.join(''));
                    eval('options.vueObj.' + options.targetItem + '= _val');
                }
            }
        }
        function _stateClear() {
            baseKana = '';
            flagConvert = false;
            ignoreString = '';
            input = '';
            values = [];
        }
        function _stateInput() {
            baseKana = eval('options.vueObj.' + options.targetItem);
            flagConvert = false;
            ignoreString = elName.val();
        }
        function _stateConvert() {
            baseKana = baseKana + values.join('');
            flagConvert = true;
            values = [];
        }
        function _toKatakana(src) {
            if (options.katakana) {
                var c, i, str;
                str = '';
                for (i = 0; i < src.length; i++) {
                    c = src.charCodeAt(i);
                    if (_isHiragana(c)) {
                        str += String.fromCharCode(c + 96);
                    } else {
                        str += src.charAt(i);
                    }
                }
                return str;
            } else {
                return src;
            }
        }
        // function _toHiragana(src) {
        //     if (options.katakana) {
        //         var c, i, str;
        //         str = '';
        //         for (i = 0; i < src.length; i++) {
        //             c = src.charCodeAt(i);
        //             if (_isHiragana(c)) {    // _isKanakana がいるよ！
        //                 str += String.fromCharCode(c - 96);
        //             } else {
        //                 str += src.charAt(i);
        //             }
        //         }
        //         return str;
        //     } else {
        //         return src;
        //     }
        // }
    };
})(jQuery);
