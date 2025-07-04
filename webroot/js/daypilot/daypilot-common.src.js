﻿/* Copyright 2005 - 2018 Annpoint, s.r.o.
 Use of this software is subject to license terms.
 http://www.daypilot.org/
 */

if (typeof DayPilot === 'undefined') {
    var DayPilot = {};
}

if (typeof DayPilot.Global === 'undefined') {
    DayPilot.Global = {};
}

(function() {
    

    if (typeof DayPilot.$ !== 'undefined') {
        return;
    }

    DayPilot.$ = function(id) {
        return document.getElementById(id);
    };

    DayPilot.isKhtml = (navigator && navigator.userAgent && navigator.userAgent.indexOf("KHTML") !== -1);
    DayPilot.isIE = (navigator && navigator.userAgent && (navigator.userAgent.indexOf("MSIE") !== -1 || navigator.userAgent.indexOf("Trident") !== -1));
    DayPilot.isIEQuirks = DayPilot.isIE && (document.compatMode && document.compatMode === "BackCompat");
    
    DayPilot.browser = {};
    //DayPilot.browser.ie9 = (navigator && navigator.userAgent && navigator.userAgent.indexOf("MSIE 9") !== -1);  // IE
    DayPilot.browser.ie8 = (function() {
        var div = document.createElement("div");
        div.innerHTML = "<!--[if IE 8]><i></i><![endif]-->";
        var result = (div.getElementsByTagName("i").length === 1);
        return result;
    })();
    DayPilot.browser.ie9 = (function() {
        var div = document.createElement("div");
        div.innerHTML = "<!--[if IE 9]><i></i><![endif]-->";
        var result = (div.getElementsByTagName("i").length === 1);
        return result;
    })();
    DayPilot.browser.ielt9 = (function() {
        var div = document.createElement("div");
        div.innerHTML = "<!--[if lt IE 9]><i></i><![endif]-->";
        var result = (div.getElementsByTagName("i").length === 1);
        return result;
    })();
    DayPilot.browser.ff = (navigator && navigator.userAgent && navigator.userAgent.indexOf("Firefox") !== -1);
    DayPilot.browser.chrome = (navigator && navigator.userAgent && navigator.userAgent.indexOf("Chrome") !== -1);
    DayPilot.browser.ie = DayPilot.isIE;
    DayPilot.browser.webkit = (navigator && navigator.userAgent && navigator.userAgent.indexOf("WebKit") !== -1);

    DayPilot.browser.passiveEvents = false;
    (function() {
        try {
            window.addEventListener("test", null, Object.defineProperty({}, 'passive', { "get": function() { DayPilot.browser.passiveEvents = true; } }));
        } catch (e) {}
    })();

    DayPilot.libs = {};
    DayPilot.libs.angularjs = typeof angularjs === "object";

    DayPilot.touch = {};
    DayPilot.touch.start = window.navigator.msPointerEnabled ? "MSPointerDown" : "touchstart";
    DayPilot.touch.move = window.navigator.msPointerEnabled ? "MSPointerMove" : "touchmove";
    DayPilot.touch.end = window.navigator.msPointerEnabled ? "MSPointerUp" : "touchend";
    
    DayPilot.mo2 = function(target, ev) {
        ev = ev || window.event;

        // IE
        if (typeof (ev.offsetX) !== 'undefined') {

            var coords = {x: ev.offsetX + 1, y: ev.offsetY + 1};

            if (!target) {
                return coords;
            }

            var current = ev.srcElement;
            while (current && current !== target) {
                if (current.tagName !== 'SPAN') { // hack for DayPilotMonth/IE, hour info on the right side of an event
                    coords.x += current.offsetLeft;
                    if (current.offsetTop > 0) {  // hack for http://forums.daypilot.org/Topic.aspx/879/move_event_bug
                        coords.y += current.offsetTop - current.scrollTop;
                    }
                }

                current = current.offsetParent;
            }

            if (current) {
                return coords;
            }
            return null;
        }

        // FF
        if (typeof (ev.layerX) !== 'undefined') {

            var coords = {x: ev.layerX, y: ev.layerY, src: ev.target};

            if (!target) {
                return coords;
            }
            var current = ev.target;

            // find the positioned offsetParent, the layerX reference
            while (current && current.style.position !== 'absolute' && current.style.position !== 'relative') {
                current = current.parentNode;
                if (DayPilot.isKhtml) { // hack for KHTML (Safari and Google Chrome), used in DPC/event moving
                    coords.y += current.scrollTop;
                }
            }

            while (current && current !== target) {
                coords.x += current.offsetLeft;
                coords.y += current.offsetTop - current.scrollTop;
                current = current.offsetParent;
            }
            if (current) {
                return coords;
            }

            return null;
        }

        return null;
    };

    // mouse offset relative to the specified target
    DayPilot.mo3 = function(target, ev) {
        ev = ev || window.event;

        var coords;
        var page = DayPilot.page(ev);
        if (page) {
            coords = {x: page.x, y: page.y};
            if (target) {
                var abs = DayPilot.abs(target);
                if ( abs ) {
                    coords = {x: page.x - abs.x, y: page.y - abs.y};
                } else {
                    console.log('abs is not defined !!!!');
                }
            }
        }
        else {
            coords = DayPilot.mo2(target, ev);
        }

        coords.shift = ev.shiftKey;
        coords.meta = ev.metaKey;
        coords.ctrl = ev.ctrlKey;
        coords.alt = ev.altKey;

        return coords;
    };

    // mouse coords
    DayPilot.mc = function(ev) {
        if (ev.pageX || ev.pageY) {
            return {x: ev.pageX, y: ev.pageY};
        }
        return {
            x: ev.clientX + document.documentElement.scrollLeft,
            y: ev.clientY + document.documentElement.scrollTop
        };
    };

    DayPilot.Stats = {};
    DayPilot.Stats.eventObjects = 0;
    DayPilot.Stats.dateObjects = 0;
    DayPilot.Stats.cacheHitsCtor = 0;
    DayPilot.Stats.cacheHitsParsing = 0;
    DayPilot.Stats.cacheHitsTicks = 0;
    DayPilot.Stats.print = function() {
        console.log("DayPilot.Stats.eventObjects: " + DayPilot.Stats.eventObjects);
        console.log("DayPilot.Stats.dateObjects: " + DayPilot.Stats.dateObjects);
        console.log("DayPilot.Stats.cacheHitsCtor: " + DayPilot.Stats.cacheHitsCtor);
        console.log("DayPilot.Stats.cacheHitsParsing: " + DayPilot.Stats.cacheHitsParsing);
        console.log("DayPilot.Stats.cacheHitsTicks: " + DayPilot.Stats.cacheHitsTicks);
        console.log("DayPilot.Date.Cache.Ctor keys: " + Object.keys(DayPilot.Date.Cache.Ctor).length);
        console.log("DayPilot.Date.Cache.Parsing keys: " + Object.keys(DayPilot.Date.Cache.Parsing).length);
    };

    DayPilot.list = function(array, enforceCopy) {

        if (array && array.isDayPilotList && !enforceCopy) {  // no need to copy unless requested explicitly
            return array;
        }

        var isArray = DayPilot.isArray(array) || Object.prototype.toString.call(array) === "[object NodeList]";
        var isItem = !isArray && !DayPilot.Util.isNullOrUndefined(array);

        //var list = new Array(isArray ? array.length : (isItem ? 1 : 0));
        var list = [];
        list.isDayPilotList = true;

        list.clone = function() {
            var result = DayPilot.list();
            list.each(function(item) {
                result.push(item);
            });
            return result;
        };

        list.each = function(f) {
            if (!f) {
                return;
            }
            if (list.forEach) {
                list.forEach(f);
                return;
            }
            for (var i = 0; i < this.length; i++) {
                f(list[i], i, list);
            }
        };

        // creates a copy, adds properties
        list.addProps = function(fields) {
            var result = list.clone();
            if (fields) {
                for (var name in fields) {
                    result[name] = fields[name];
                }
            }
            return result;
        };

        list.last = function() {
            if (list.length === 0) {
                return null;
            }
            return list[list.length - 1];
        };

        list.first = function() {
            if (list.length === 0) {
                return null;
            }
            return list[0];
        };

        // creates a copy with old items plus new item
        list.add = function(item) {
            var result = list.clone();
            result.push(item);
            return result;
        };

        // override, returns DayPilot.list()
        list.map = function(f) {
            if (typeof f !== "function") {
                throw "DayPilot.list().map(f): Function expected";
            }
            var result = DayPilot.list();
            list.each(function(item, i, array) {
                result.push(f(item, i, array));
            });

            return result;
        };

        list.filter = function(f) {
            var result = DayPilot.list();
            if (typeof f !== "function") {
                throw "DayPilot.list().filter(f): Function expected";
            }
            list.each(function(item) {
                if (f(item)) {
                    result.push(item);
                }
            });
            return result;
        };

        // override, returns DayPilot.list()
        list.concat = function(another) {
            if (!another) {
                return list;
            }
            var result = list.clone();
            for (var i = 0; i < another.length; i++) {
                result.push(another[i]);
            }
            /*
            DayPilot.list(another).each(function(item) {
                result.push(item);
            });*/
            return result;
        };

        if (!list.find) {
            list.find = function(f) {
                if (typeof f !== "function") {
                    throw "DayPilot.list().find(f): Function expected";
                }
                for (var i = 0; i < this.length; i++) {
                    if (f(list[i])) {
                        return list[i];
                    }
                }
                return undefined;
            };
        }

        if (!list.findIndex) {
            list.findIndex = function(f) {
                if (typeof f !== "function") {
                    throw "DayPilot.list().findIndex(f): Function expected";
                }
                for (var i = 0; i < this.length; i++) {
                    if (f(list[i])) {
                        return i;
                    }
                }
                return -1;
            };
        }
        // reuse if available
        if (!list.some) {
            list.some = function(f) {
                if (typeof f !== "function") {
                    throw "DayPilot.list().some(f): Function expected";
                }
                for (var i = 0; i < this.length; i++) {
                    if (f(list[i])) {
                        return true;
                    }
                }
                return false;
            };
        }

        // reuse if available
        if (!list.reduce) {
            list.reduce = function(f, initial) {
                if (typeof f !== "function") {
                    throw "DayPilot.list().reduce(f): Function expected";
                }
                var result;
                var start = 0;
                if (typeof initial !== 'undefined') {
                    result = initial;
                }
                else {
                    start = 1;
                    if (list.length === 0) {
                        throw "DayPilot.list().reduce(f): No initial value and empty list";
                    }
                    result = list[0];
                }
                for (var i = start; i < this.length; i++) {
                    result = f(result, list[i], i, this);
                }
                return result;
            };
        }

        list.isEmpty = function() {
            return list.length === 0;
        };


        if (isArray) {
            for (var i = 0; i < array.length; i++) {
                //list.push(array[i]);
                list[i] = array[i];
            }
        }
        else if (isItem) {
            list[0] = array;
        }

        return list;
    };

    DayPilot.list.for = function(count, initializer) {
        var result = DayPilot.list();
        for (var i = 0; i < count; i++) {
            if (typeof initializer === "function") {
                result.push(initializer(i));
            }
            else {
                result.push(i);
            }
        }
        return result;
    };

    DayPilot.line = function (x1, y1, x2, y2, arrow) {
        var source = { "x": x1, "y": y1 };
        var target = { "x": x2, "y": y2, "deg": DayPilot.deg(x1, y1, x2, y2)};

        var switched = false;
        if (y1 < y2){
            var pom = y1;
            y1 = y2;
            y2 = pom;
            pom = x1;
            x1 = x2;
            x2 = pom;

            switched = true;
        }

        var deg = DayPilot.deg(x1, y1, x2, y2);

        var from = {"x": x1, "y": y1};
        var to = {"x": x2, "y": y2};

        var x = (function() {
            var a = Math.abs(x1-x2);
            var b = Math.abs(y1-y2);
            var sx = (x1+x2)/2 ;
            var sy = (y1+y2)/2 ;
            var w = Math.sqrt(a*a + b*b ) ;
            return sx - w/2;
        })();

        var y = (function() {
            return (y1+y2)/2 ;
        })();

        // var toLeft = !switched && deg < 90 || switched && deg > 90;

        var width = DayPilot.distance(from, to);

        var div = document.createElement("div");
        div.setAttribute('style','border:1px solid black;width:'+width+'px;height:0px;-moz-transform:rotate('+deg+'deg);-webkit-transform:rotate('+deg+'deg);-ms-transform:rotate('+deg+'deg);transform:rotate('+deg+'deg);position:absolute;top:'+y+'px;left:'+x+'px;');

        var wrapper = document.createElement("div");
        // wrapper.innerHTML = deg + " " + switched + " " + toLeft;
        wrapper.appendChild(div);

        var symbol = "circle";

        if (arrow && symbol === "arrow") {
            var arrowWidth = 6;
            var top = target.y - arrowWidth*0;
            var left = target.x - arrowWidth*0;
            // if (toLeft) {
            //     left -= arrowWidth;
            // }
            //if (target.x < source.x) { left -= width; }
            var deg = deg;
            if (target.y > source.y) { deg -= 180; }
            var a = document.createElement("div");
            a.style.borderColor = "transparent black transparent transparent";
            a.style.borderWidth = arrowWidth + "px";
            a.style.borderStyle = "solid";
            a.style.position = "absolute";
            a.style.left = left + "px";
            a.style.top = top + "px";
            a.style.transform = "rotate(" + deg + "deg)";
            wrapper.appendChild(a);
        }
        else if (arrow && symbol === "circle") {
            var diameter = 10;
            var top = target.y - diameter/2;
            var left = target.x - diameter/2;
            var deg = deg;
            if (target.y > source.y) { deg -= 180; }
            var a = document.createElement("div");
            a.style.borderColor = "black";
            a.style.width = diameter + "px";
            a.style.height = diameter + "px";
            a.style.borderRadius = diameter + "px";
            // a.style.borderWidth = "1px";
            // a.style.borderStyle = "solid";
            a.style.backgroundColor = "black";
            a.style.position = "absolute";
            a.style.left = left + "px";
            a.style.top = top + "px";
            // a.style.transform = "rotate(" + deg + "deg)";
            wrapper.appendChild(a);
        }

        return wrapper;

    };

    DayPilot.deg = function(x1, y1, x2, y2) {
        var a = Math.abs(x1-x2);
        var b = Math.abs(y1-y2);
        var c;
        var sx = (x1+x2)/2 ;
        var sy = (y1+y2)/2 ;
        var width = Math.sqrt(a*a + b*b ) ;
        var x = sx - width/2;
        var y = sy;

        a = width / 2;

        c = Math.abs(sx-x);

        b = Math.sqrt(Math.abs(x1-x)*Math.abs(x1-x)+Math.abs(y1-y)*Math.abs(y1-y) );

        var cosb = (b*b - a*a - c*c) / (2*a*c);
        var rad = Math.acos(cosb);
        var deg = (rad*180)/Math.PI;

        return deg;
    };

    DayPilot.complete = function(f) {
        if (document.readyState === "complete") {
            f();
            return;
        }
        if (!DayPilot.complete.list) {
            DayPilot.complete.list = [];
            DayPilot.re(document, "readystatechange", function() {
                if (document.readyState === "complete") {
                    for (var i = 0; i < DayPilot.complete.list.length; i++) {
                        var d = DayPilot.complete.list[i];
                        d();
                    }
                    DayPilot.complete.list = [];
                }
            });
        }
        DayPilot.complete.list.push(f);
    };

    // returns pageX, pageY (calculated from clientX if pageX is not available)
    DayPilot.page = function(ev) {
        ev = ev || window.event;

        // hack, in IE 11 pageX returns value inconsistent with other browsers (margin on html)
        if (typeof ev.pageX !== 'undefined' && !DayPilot.browser.ie) {
            return {x: ev.pageX, y: ev.pageY};
        }
        if (typeof ev.clientX !== 'undefined') {
            return {
                x: ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                y: ev.clientY + document.body.scrollTop + document.documentElement.scrollTop
            };
        }
        // shouldn't happen
        return null;
    };


    // position of the element, relative to the reference object
    DayPilot.rel = function(element, ref) {
        var elPos = DayPilot.abs(element);
        var refPos = DayPilot.abs(ref);

        return {
            "x": elPos.x - refPos.x,
            "y": elPos.y - refPos.y,
            "w": element.offsetWidth,
            "h": element.offsetHeight
        };
    };

    // absolute element position on page
    DayPilot.abs = function(element, visible) {
        if (!element) {
            return null;
        }

        if (!document.body.contains(element)) {
            return null;
        }

        /*var r = {
            x: element.offsetLeft,
            y: element.offsetTop,
            w: element.clientWidth,
            h: element.clientHeight,
            toString: function() {
                return "x:" + this.x + " y:" + this.y + " w:" + this.w + " h:" + this.h;
            }
        };*/

        if (element.getBoundingClientRect) {
            // var b = element.getBoundingClientRect();
            /*var b = null;
            try {
                b = element.getBoundingClientRect();
            } catch (e) {
                b = {top: element.offsetTop, left: element.offsetLeft};
            }

            r.x = b.left;
            r.y = b.top;

            var d = DayPilot.doc();
            r.x -= d.clientLeft || 0;
            r.y -= d.clientTop || 0;

            // this must not be added; worked incorrectly on Android/Chrome
            var pageOffset = DayPilot.pageOffset();
            r.x += pageOffset.x;
            r.y += pageOffset.y;*/

            var r = DayPilot.absBoundingClientBased(element);

            if (visible) {
                // use diff, absOffsetBased is not as accurate
                var full = DayPilot.absOffsetBased(element, false);
                var visible = DayPilot.absOffsetBased(element, true);

                r.x += visible.x - full.x;
                r.y += visible.y - full.y;
                r.w = visible.w;
                r.h = visible.h;
            }

            return r;
        }
        else {
            return DayPilot.absOffsetBased(element, visible);
        }

    };

    DayPilot.absBoundingClientBased = function(element) {
        var elemRect = element.getBoundingClientRect();

        return {
            // x: elemRect.left + window.scrollX,   // IE11 doesn't support this
            x: elemRect.left + window.pageXOffset,
            // y: elemRect.top + window.scrollY,   // IE11 doesn't support this
            y: elemRect.top + window.pageYOffset,
            w: element.clientWidth,
            h: element.clientHeight,
            toString: function() {
                return "x:" + this.x + " y:" + this.y + " w:" + this.w + " h:" + this.h;
            }
        };
/*
        // didn't work for body with margin
        var bodyRect = document.body.getBoundingClientRect();

        return {
            x: elemRect.left - bodyRect.left,
            y: elemRect.top - bodyRect.top,
            w: element.clientWidth,
            h: element.clientHeight,
            toString: function() {
                return "x:" + this.x + " y:" + this.y + " w:" + this.w + " h:" + this.h;
            }
        };
*/

    };

    DayPilot.isArray = function(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    };

    // old implementation of absolute position
    // problems with adjacent float and margin-left in IE7
    // still the best way to calculate the visible part of the element
    DayPilot.absOffsetBased = function(element, visible) {
        var r = {
            x: element.offsetLeft,
            y: element.offsetTop,
            w: element.clientWidth,
            h: element.clientHeight,
            toString: function() {
                return "x:" + this.x + " y:" + this.y + " w:" + this.w + " h:" + this.h;
            }
        };

        while (DayPilot.op(element)) {
            element = DayPilot.op(element);

            r.x -= element.scrollLeft;
            r.y -= element.scrollTop;

            if (visible) {  // calculates the visible part
                if (r.x < 0) {
                    r.w += r.x; // decrease width
                    r.x = 0;
                }

                if (r.y < 0) {
                    r.h += r.y; // decrease height
                    r.y = 0;
                }

                if (element.scrollLeft > 0 && r.x + r.w > element.clientWidth) {
                    r.w -= r.x + r.w - element.clientWidth;
                }

                if (element.scrollTop && r.y + r.h > element.clientHeight) {
                    r.h -= r.y + r.h - element.clientHeight;
                }
            }

            r.x += element.offsetLeft;
            r.y += element.offsetTop;

        }

        var pageOffset = DayPilot.pageOffset();
        r.x += pageOffset.x;
        r.y += pageOffset.y;

        return r;
    };
    
    // window dimensions
    DayPilot.wd = function() {
        var ieQuirks = DayPilot.isIEQuirks;
        
        // don't show the bubble outside of the visible window
        var windowHeight = document.documentElement.clientHeight;
        // fixing http://forums.daypilot.org/Topic.aspx/519/issue_with_bubble_in_ie
        if (ieQuirks) {
            windowHeight = document.body.clientHeight;
        }

        var windowWidth = document.documentElement.clientWidth;
        // fixing http://forums.daypilot.org/Topic.aspx/519/issue_with_bubble_in_ie
        if (ieQuirks) {
            windowWidth = document.body.clientWidth;
        }
        
        var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        var scrollLeft = (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft;
        
        var result = {};
        result.width = windowWidth;
        result.height = windowHeight;
        result.scrollTop = scrollTop;
        result.scrollLeft = scrollLeft;
        
        return result;
    };

    // offsetParent, safe access to prevent "Unspecified Error" in IE
    DayPilot.op = function(element) {
        try {
            return element.offsetParent;
        }
        catch (e) {
            return document.body;
        }
    };

    // distance of two points, works with x and y
    DayPilot.distance = function(point1, point2) {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    };

    // document element
    DayPilot.doc = function() {
        var de = document.documentElement;
        return (de && de.clientHeight) ? de : document.body;
    };

    DayPilot.pageOffset = function() {
        if (typeof window.pageXOffset !== 'undefined') {
            return {x: window.pageXOffset, y: window.pageYOffset};
        }
        //return { x: 0, y: 0};
        var d = DayPilot.doc();
        return {x: d.scrollLeft, y: d.scrollTop};
    };

    // all children
    DayPilot.ac = function(e, children) {
        if (!children) {
            var children = [];
        }
        for (var i = 0; e.children && i < e.children.length; i++) {
            children.push(e.children[i]);
            DayPilot.ac(e.children[i], children);
        }

        return children;
    };

    DayPilot.indexOf = function(array, object, equalsFunction) {
        if (!array || !array.length) {
            return -1;
        }
        for (var i = 0; i < array.length; i++) {
            if (equalsFunction) {
                if (equalsFunction(array[i], object)) {
                    return i;
                }
            }
            else if (array[i] === object) {
                return i;
            }
        }
        return -1;
    };

    DayPilot.contains = function(array, object) {
        if (!array) {
            return false;
        }

        if (array === object && !DayPilot.isArray(array)) {
            return true;
        }
        return DayPilot.indexOf(array, object) !== -1;
    };

    // remove from array
    DayPilot.rfa = function(array, object) {
        var i = DayPilot.indexOf(array, object);
        if (i === -1) {
            return;
        }
        array.splice(i, 1);
    };
    
    DayPilot.sheet = function(document) {
        document = document || window.document;

        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        if (!style.styleSheet) {   // ie
            style.appendChild(document.createTextNode(""));
        }

        var h = document.head || document.getElementsByTagName('head')[0];
        h.appendChild(style);

        var oldStyle = !! style.styleSheet; // old ie

        var sheet = {};
        sheet.rules = [];
        sheet.commit = function() {
            try {
                if (oldStyle) {
                    style.styleSheet.cssText = this.rules.join("\n");
                }
            }
            catch (e) {
                //alert("Error registering the built-in stylesheet (IE stylesheet limit reached). Stylesheet count: " + document.styleSheets.length);
            }
        };

        sheet.add = function(selector, rules, index) {
            if (oldStyle) {
                this.rules.push(selector + "{" + rules + "\u007d");
                return;
            }
            if(style.sheet.insertRule) {  // normal browsers, ie9+
                if (typeof index === "undefined") {
                    index = style.sheet.cssRules.length;
                }
                style.sheet.insertRule(selector + "{" + rules + "\u007d", index);
            }
            else if (style.sheet.addRule) {
                style.sheet.addRule(selector, rules, index);
            }
            else {
                throw "No CSS registration method found";
            }
        };
        return sheet;
    };

    DayPilot.Args = function(wrap) {
        var args = this;

        this.isArgs = true;
        this.preventDefault = function() {
            if (wrap) {
                wrap.preventDefault();
            }
            args.preventDefault.value = true;
        };

        /*
        this.getWrappedArgs = function() {
            return wrap;
        };
        */
    };

    DayPilot.Debug = function(calendar) {
        var debug = this;
        
        this.printToBrowserConsole = false;
        this.enabled = false;
        this.messages = [];
        this._div = null;
        this.clear = function() {
            this.messages = [];
            if (debug._div) {
                debug._div.innerHTML = '';
            }
        };
        
        this.hide = function() {
            DayPilot.de(debug._div);
            debug._div = null;
        };
        
        this.show = function() {
            if (debug._div) {
                debug.hide();
            }
            
            var ref = calendar.nav.top;

            var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.top = "0px";
            div.style.bottom = "0px";
            div.style.left = "0px";
            div.style.right = "0px";
            div.style.backgroundColor = "black";
            div.style.color = "#ccc";
            div.style.overflow = "auto";
            div.style.webkitUserSelect = 'auto';
            div.style.MozUserSelect = 'all';
            div.onclick = function() {
                debug.hide();
            };
            
            for(var i = 0; i < this.messages.length; i++) {
                var msg = debug.messages[i];
                
                var line = msg._toElement();
                div.appendChild(line);
            }
            
            this._div = div;
            ref.appendChild(div);
        };
        
        this.message = function(text, level) {  // levels: info, warning, error
            if (!this.enabled) {
                return;
            }
            var msg = {};
            msg.time = new DayPilot.Date();
            msg.level = level || "debug";
            msg.text = text;
            msg._toElement = function() {
                var line = document.createElement("div");
                line.innerHTML =  msg.time + " (" + msg.level + "): " + msg.text;
                switch (msg.level) {
                    case "error":
                        line.style.color = "red";
                        break;
                    case "warning":
                        line.style.color = "orange";
                        break;
                    case "info":
                        line.style.color = "white";
                        break;
                    case "debug":
                        break;
                }
                return line;
            };
            
            this.messages.push(msg);
            
            if (this.printToBrowserConsole && typeof console !== 'undefined') {
                console.log(msg);
            }
        };
    };

    // register event
    DayPilot.re = function(el, ev, func) {
        if (!func) {
            return;
        }
        if (!el) {
            return;
        }
        if (el.addEventListener) {  // standard, IE9+
            el.addEventListener(ev, func, false);
        } else if (el.attachEvent) {
            var f = function(ev) {
                func.call(el, ev);
            };
            el.attachEvent("on" + ev, f);
        }
    };
    // unregister event
    DayPilot.ue = function(el, ev, func) {
        if (el.removeEventListener) {
            el.removeEventListener(ev, func, false);
        } else if (el.detachEvent) {
            el.detachEvent("on" + ev, func);
        }
    };
    // trim
    DayPilot.tr = function(stringToTrim) {
        if (!stringToTrim)
            return '';
        if (typeof stringToTrim === "string") {
            return stringToTrim.replace(/^\s+|\s+$/g, "");
        }
        return stringToTrim;
    };
    // date sortable (DateTime.ToString("s"))
    DayPilot.ds = function(d) {
        return DayPilot.Date.toStringSortable(d);
    };
    // get style
    DayPilot.gs = function(el, styleProp) {
        var x = el;
        if (x.currentStyle)
            var y = x.currentStyle[styleProp];
        else if (window.getComputedStyle)
            var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
        if (typeof (y) === 'undefined')
            y = '';
        return y;
    };

    DayPilot.StyleReader = function(element) {

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        this.get = function(property) {
            var words = DayPilot.list(property.split("-"));
            var camel = words.reduce(function(previous, current, i) {
                current = capitalizeFirstLetter(current);
                return previous + current;
            });
            if (!element) {
                return null;
            }
            return DayPilot.gs(element, camel) || DayPilot.gs(element, property);
        };

        this.getPx = function(property) {
            var val = this.get(property);
            if (val.indexOf("px") === -1) {
                return undefined;
            }
            else {
                return parseInt(val, 10);
            }
        };

        this.getFont = function() {
            var bold = this.get("font-weight") === "bold" ? "bold" : "";
            var italic = this.get("font-style") === "italic" ? "italic" : "";
            return {
                "family": this.get("font-family"),
                "size": this.get("font-size"),
                "style": italic + " " + bold
            };
        };

        this.getBackColor = function(defaultValue) {
            if (typeof defaultValue === "undefined") {
                defaultValue = "white";
            }
            var backColor = this.get("background-color");
            return DayPilot.Util.isTransparentColor(backColor) ? defaultValue : backColor;
        };

    };

    // html encode
    DayPilot.he = function(str) {
        var result = str.replace(/&/g, "&amp;");
        result = result.replace(/</g, "&lt;");
        result = result.replace(/>/g, "&gt;");
        result = result.replace(/"/g, "&quot;");
        return result;
    };

    DayPilot.he2 = function(str) {
        var text = document.createTextNode(str);
        var div = document.createElement("div");
        div.appendChild(text);
        return div.innerHTML;
    };

    // make unselectable
    DayPilot.us = function(element) {
        if (element) {
            element.setAttribute("unselectable", "on");
            element.style.userSelect = 'none';
            element.style.MozUserSelect = 'none'; 
            element.style.KhtmlUserSelect = 'none';
            element.style.webkitUserSelect = 'none';
            for (var i = 0; i < element.childNodes.length; i++) {
                if (element.childNodes[i].nodeType === 1) {
                    DayPilot.us(element.childNodes[i]);
                }
            }
        }
    };

    // purge
    // thanks to http://javascript.crockford.com/memory/leak.html
    DayPilot.pu = function(d) {
        //var removed = [];
        //var start = new Date();
        var a = d.attributes, i, l, n;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                if (!a[i]) {
                    continue;
                }
                n = a[i].name;
                if (typeof d[n] === 'function') {
                    //DayPilot.log.push(d.tagName + "." + n);
                    //removed.push(n);
                    d[n] = null;
                }
            }
        }
        a = d.childNodes;
        if (a) {
            l = a.length;
            for (i = 0; i < l; i += 1) {
                var children = DayPilot.pu(d.childNodes[i]);
                //removed = removed.concat(children);
            }
        }
        //return removed;
    };

    // purge children
    DayPilot.puc = function(d) {
        var a = d.childNodes, i, l;
        if (a) {
            var l = a.length;
            for (i = 0; i < l; i += 1) {
                DayPilot.pu(d.childNodes[i]);
            }
        }
    };

    // delete element
    DayPilot.de = function(e) {
        if (!e) {
            return;
        }
        if (DayPilot.isArray(e)) {
            for (var i = 0; i < e.length; i++) {
                DayPilot.de(e[i]);
            }
            return;
        }
        e.parentNode && e.parentNode.removeChild(e);
    };

    DayPilot.fade = function(element, step, end) {
        if (!element) {
            return;
        }

        clearTimeout(element.messageTimeout);

        var delay = 50;
        var visible = element.style.display !== 'none';
        var fadeIn = step > 0;
        var fadeOut = step < 0;

        if (step === 0) {
            return;
        }

        if (fadeIn) {
            element.status = "in";
        }
        else if (fadeOut) {
            element.status = "out";
        }

        if (fadeIn && !visible) {
            element.target = parseFloat(element.style.opacity);
            element.opacity = 0; // current, for IE
            element.style.opacity = 0;
            element.style.filter = "alpha(opacity=0)";
            element.style.display = '';
        }
        else if (fadeOut && !element.target) {
            element.target = element.style.opacity;
        }
        else {
            //var current = parseFloat(element.style.opacity);
            var current = element.opacity;
            var updated = Math.floor(10 * (current + step)) / 10;
            if (fadeIn && updated > element.target) {
                updated = element.target;
            }
            if (fadeOut && updated < 0) {
                updated = 0;
            }
            var ie = updated * 100;
            element.opacity = updated;
            element.style.opacity = updated;
            element.style.filter = "alpha(opacity=" + ie + ")";
        }
        if ((fadeIn && (element.opacity >= element.target || element.opacity >= 1)) || (fadeOut && element.opacity <= 0)) {
            element.target = null;
            if (fadeOut) {
                element.style.opacity = element.target;
                element.opacity = element.target;
                var filter = element.target ? "alpha(opacity=" + (element.target * 100) + ")" : null;
                element.style.filter = filter;
                element.style.display = 'none';
            }
            if (end && typeof end === 'function') {
                element.status = null;
                end();
            }
        }
        else {
            element.messageTimeout = setTimeout(function() {
                DayPilot.fade(element, step, end);
            }, delay);
        }
    };


    // vertical scrollbar width
    DayPilot.sw = function(element) {
        if (!element) {
            return 0;
        }
        return element.offsetWidth - element.clientWidth;
    };
    
    DayPilot.swa = function() {
        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.top = "-2000px";
        div.style.left = "-2000px";
        div.style.width = '200px';
        div.style.height = '100px';
        div.style.overflow = 'auto';
        
        var inner = document.createElement("div");
        inner.style.width = '300px';
        inner.style.height = '300px';
        div.appendChild(inner);

        document.body.appendChild(div);
        var sw = DayPilot.sw(div);
        document.body.removeChild(div);

        return sw;
    };

    // horizontal scrollbar height
    DayPilot.sh = function(element) {
        if (!element) {
            return 0;
        }
        return element.offsetHeight - element.clientHeight;
    };

    DayPilot.guid = function() {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return ("" + S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    // unique array members
    // works for strings and numbers only
    DayPilot.ua = function(array) {
        if (typeof array === "string" || typeof array === "number") {
            return [array];
        }
        var u = {}, a = [];
        for (var i = 0, l = array.length; i < l; ++i) {
            if (array[i] in u) {
                continue;
            }
            a.push(array[i]);
            u[array[i]] = 1;
        }
        return a;
    };

    // angular module
    DayPilot.am = function() {
        if (typeof angular === "undefined") {
            return null;
        }
        if (!DayPilot.am.cached) {
            DayPilot.am.cached = angular.module("daypilot", []);
        }
        return DayPilot.am.cached;
    };
    
    (function () {
        DayPilot.pop = wave;

        function wave(div, options) {
            var target = {
                w: div.offsetWidth,
                h: div.offsetHeight,
                x: parseInt(div.style.left),
                y: parseInt(div.style.top)
            };
            target.height = div.style.height;
            target.width = div.style.width;
            target.top = div.style.top;
            target.left = div.style.left;
            target.toString = function () { return "w: " + this.w + " h:" + this.h; };
            
            var config = {};
            config.finished = null;
            config.vertical = 'center';
            config.horizontal = 'center';
            
            if (options) {
                for (var name in options) {
                    config[name] = options[name];
                }
            }

            div.style.visibility = 'hidden';
            div.style.display = '';

            var animation = options.animation || "fast";

            var plan = createPlan(animation);

            plan.div = div;
            plan.i = 0;
            plan.target = target;
            plan.config = config;

            doStep(plan);
        }
        
        function createPlan(type) {

            var jump = function() {
                var plan = [];
                plan.time = 10;
                var last;

                var step = 0.08;
                last = 0.1;

                for (var i = last; i < 1.2; i += step) {
                    plan.push(i);
                    last = i;
                }

                step = 0.03;

                for (var i = last; i > 0.8; i -= step) {
                    plan.push(i);
                    last = i;
                }

                for (var i = last; i <= 1; i += step) {
                    plan.push(i);
                    last = i;
                }

                return plan;
            };

            var slow = function() {
                var plan = [];
                plan.time = 10;
                var last;

                var step = 0.04;
                last = 0.1;

                for (var i = last; i <= 1; i += step) {
                    plan.push(i);
                    last = i;
                }
                return plan;
            };

            var fast = function() {
                var plan = [];
                plan.time = 10;
                var last;

                var step = 0.08;
                last = 0.1;

                for (var i = last; i <= 1; i += step) {
                    plan.push(i);
                    last = i;
                }
                return plan;
            };
            
            var types = {
                "fast": fast,
                "slow": slow,
                "jump": jump
            };
            
            if (!types[type]) {
                type = "fast";
            }

            return types[type]();
        }

        function doStep(plan) {
            var div = plan.div;

            var pct = plan[plan.i];

            var height = pct * plan.target.h;
            var top;
            switch (plan.config.vertical) {
                case "center":
                    top = plan.target.y - (height - plan.target.h) / 2;
                    break;
                case "top":
                    top = plan.target.y;
                    break;
                case "bottom":
                    top = plan.target.y - (height - plan.target.h);
                    break;
                default:
                    throw "Unexpected 'vertical' value.";
            }

            var width = pct * plan.target.w;
            var left;
            
            switch (plan.config.horizontal) {
                case "left":
                    left = plan.target.x;
                    break;
                case "center":
                    left = plan.target.x - (width - plan.target.w) / 2;
                    break;
                case "right":
                    left = plan.target.x - (width - plan.target.w);
                    break;
                default:
                    throw "Unexpected 'horizontal' value.";
            }
            
            // TODO add scrollLeft
            var wd = DayPilot.wd();
            var bottom = (wd.height + wd.scrollTop) - (top + height);
            if (bottom < 0) {
                top += bottom;
            }
            
            var right = (wd.width) - (left + width);
            if (right < 0) {
                left += right;
            }

            div.style.height = height + "px";
            div.style.top = top + "px";

            div.style.width = width + "px";
            div.style.left = left + "px";

            //div.style.display = '';
            div.style.visibility = 'visible';

            plan.i++;

            if (plan.i < plan.length - 1) {
                setTimeout((function (plan) {
                    return function () {
                        doStep(plan);
                    };
                })(plan), plan.time);
            }
            else {
                // set the original dimensions
                div.style.width = plan.target.width;
                div.style.height = plan.target.height;
                // and position
                div.style.top = plan.target.top;
                div.style.left = plan.target.left;
                
                // callback
                if (typeof plan.config.finished === 'function') {
                    plan.config.finished();
                }
            }
        }


    })();

    DayPilot.Util = {};

    // object - DOM element or array of DOM elements
    DayPilot.Util.addClass = function(object, name) {
        if (!name) {
            return;
        }
        if (!object) {
            return;
        }
        if (DayPilot.isArray(object)) {
            for (var i = 0; i < object.length; i++) {
                DayPilot.Util.addClass(object[i], name);
            }
            return;
        }
        if (!object.className) {
            object.className = name;
            return;
        }
        var already = new RegExp("(^|\\s)" + name + "($|\\s)");
        if (!already.test(object.className)) {
            object.className = object.className + ' ' + name;
        }
    };

    DayPilot.Util.normalizeColor = function (input) {
        if (input.indexOf("rgb") === 0) {
            return rgbToHex(input);
        }
        return input;

        function rgbToHex(a){
            a = a.replace(/[^\d,]/g,"").split(",");
            return "#"+((1<<24)+(+a[0]<<16)+(+a[1]<<8)+ (+a[2])).toString(16).slice(1);
        }
    };

    DayPilot.Util.addClassToString = function(str, name) {
        if (!str) {
            return name;
        }
        var already = new RegExp("(^|\\s)" + name + "($|\\s)");
        if (!already.test(str)) {
            return str + ' ' + name;
        }
        else {
            return str;
        }
    };

    DayPilot.Util.removeClassFromString = function(str, name) {
        if (!str) {
            return "";
        }
        var already = new RegExp("(^|\\s)" + name + "($|\\s)");
        return str.replace(already, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');  // trim spaces
    };

    DayPilot.Util.removeClass = function(object, name) {
        if (!object) {
            return;
        }
        if (DayPilot.isArray(object)) {
            for (var i = 0; i < object.length; i++) {
                DayPilot.Util.removeClass(object[i], name);
            }
            return;
        }
        if (!object.className) {
            return;
        }
        var already = new RegExp("(^|\\s)" + name + "($|\\s)");
        object.className = object.className.replace(already, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');  // trim spaces
    };

    DayPilot.Util.props = function(o) {
        var t = [];
        for (var a in o) {
            t.push(a);
            t.push(o[a]);
        }
        return t.join("-");
    };
    
    
    DayPilot.Util.propArray = function(props, name, defaultValue) {
        return DayPilot.list(props).map(function(item) {
            return item[name] ? item[name] : defaultValue;
        });

        /*
        var result = [];
        if (!props || !props.length) {
            return result;
        }

        for (var i = 0; i < props.length; i++) {
            result.push(props[i][name]);
        }
        return result;
        */
    };
    
    DayPilot.Util.updatePropsFromArray = function(props, name, array) {
        for (var i = 0; i < array.length; i++) {
            props[i][name] = array[i];
        }
    };    
    
    DayPilot.Util.copyProps = function(source, target, props) {
        if (!source) {
            return;
        }
        if (!target) {
            target = {};
        }
        if (typeof props === 'undefined') {
            for (var name in source) {
                if (source.hasOwnProperty(name) && typeof source[name] !== 'undefined') {
                    target[name] = source[name];
                }
            }
        }
        else {
            for (var i = 0; i < props.length; i++) {
                var name = props[i];
                if (typeof source[name] !== 'undefined') {
                    target[name] = source[name];
                }
            }
        }
        return target;
    };

    DayPilot.Util.firstPropValue = function(object) {
        for (var name in object) {
            return object[name];
        }
    };

    DayPilot.Util.isOnlyProperty = function(obj, propertyName) {
        if (!obj) {
            return false;
        }
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                if (name !== propertyName) {
                    return false;
                }
            }
        }
        return true;
    };

    DayPilot.Util.createArrayCopy = function(source, itemProps) {
        if (!DayPilot.isArray(source)) {
            return [];
        }
        var list = [];
        for (var i = 0; i < source.length; i++) {
            var item = {};
            DayPilot.Util.copyProps(source[i], item, itemProps);
            list.push(item);
        }
        return list;
    };

    DayPilot.Util.avg = function(a, b) {
        return (a + b) / 2;
    };

    DayPilot.Util.div = function(parent, left, top, width, height) {
        var div = document.createElement("div");
        if (left || top || width || height) {
            if (width < 0) {
                left += width;
                width *= -1;
            }
            if (height < 0) {
                top += height;
                height *= -1;
            }
            div.style.position = "absolute";
            if (typeof left === "number") {
                div.style.left = left + "px";
            }
            else if (typeof left === "string") {
                div.style.left = left;
            }
            if (typeof top === "number") {
                div.style.top = top + "px";
            }
            else if (typeof top === "string") {
                div.style.top = top;
            }
            if (typeof width === "number") {
                div.style.width = width + "px";
            }
            else if (typeof width === "string") {
                div.style.width = width;
            }
            if (typeof height === "number") {
                div.style.height = height + "px";
            }
            else if (typeof height === "string") {
                div.style.height = height;
            }
        }
        if (parent) {
            parent.appendChild(div);
        }
        return div;
    };

    DayPilot.Util.overlaps = function(start1, end1, start2, end2) {
        return !(end1 <= start2 || start1 >= end2);
    };

    DayPilot.Util.isMouseEvent = function(ev) {
        if (!navigator.msPointerEnabled) {
            return false;
        }
        if (!ev.pointerType) {
            return false;
        }
        if (ev.pointerType === "mouse") {  // Windows 8.1
            return true;
        }
        if (ev.pointerType === 4) {  // Windows 7 - 8
            return true;
        }
        return false;
    };

    DayPilot.Util.mouseButton = function(ev) {
        var result = {};

        ev = ev || window.event;

        if (typeof ev.which === 'undefined') {
            switch (ev.button) {
                case 1:
                    result.left = true;
                    break;
                case 4:
                    result.middle = true;
                    break;
                case 2:
                    result.right = true;
                    break;
                case 0:
                    result.unknown = true;
                    break;
            }
        }
        else {
            switch (ev.which) {
                case 1:
                    result.left = true;
                    break;
                case 2:
                    result.middle = true;
                    break;
                case 3:
                    result.right = true;
                    break;
            }
        }
        return result;
    };

    DayPilot.Util.membersPlain = function(obj) {
        var members = DayPilot.Util.members(obj, 2);

        var transformArray = function(array) {
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                var name = item.name;
                if (item.obsolete) {
                    name += " (obsolete)";
                }
                if (item.noCssOnly) {
                    name += " (!cssOnly)";
                }
                if (item.aspnet) {
                    name += " (ASP.NET)";
                }
                if (item.mvc) {
                    name += "(MVC)";
                }
                array[i] = name;
            }
        };

        transformArray(members.events);
        transformArray(members.methods);
        transformArray(members.properties);

        return members;
    };

    DayPilot.Util.shouldApply = function (name) {
        if (!name) {
            return false;
        }
        var lower = name.toLowerCase();
        if (lower.indexOf("before") >= 0) {
            return false;
        }
        if (lower.indexOf("after") >= 0) {
            return false;
        }
        if (lower === "onrowfilter") {
            return false;
        }
        if (lower === "oneventfilter") {
            return false;
        }
        return true;
    };

    DayPilot.Util.safeApply = function(scope, f) {
        var phase = scope["$root"]["$$phase"];
        if (phase === "$apply" || phase === "$digest") {
            scope["$eval"](f);

        } else {
            scope["$apply"](f);
        }
    };

    DayPilot.Util.members = function(obj, maxLevel) {
        var events = DayPilot.list();
        var methods = DayPilot.list();
        var properties = DayPilot.list();

        var obsolete = (obj && obj.members) ? obj.members.obsolete : [];
        var noCssOnly = (obj && obj.members) ? obj.members.noCssOnly : [];
        var ignore = (obj && obj.members) ? obj.members.ignore : [];
        var ignoreFilter = (obj && obj.members && obj.members.ignoreFilter) ? obj.members.ignoreFilter : function() { return false; };

        for (var name in obj) {
            //var start = name.substring(0, 1);
            if (name.indexOf("$") === 0) {
                continue;
            }
            if (name.indexOf("_") === 0) {
                continue;
            }
            if (name.indexOf("number") === 0) {
                continue;
            }
            if (name.indexOf("is") === 0) {
                continue;
            }
            if (name === "v") {
                continue;
            }
            if (DayPilot.contains(ignore, name)) {
                continue;
            }
            if (ignoreFilter(name)) {
                continue;
            }
            if (name.indexOf("on") === 0) {
                events.push(name);
                continue;
            }
            if (typeof obj[name] === 'function') {
                methods.push(name);
                continue;
            }
            if (typeof obj[name] === 'object') {
                var o = obj[name];
                if (maxLevel === 0) {
                    properties.push(name);
                    continue;
                }
                if (o && o.nodeType > 0) {
                    properties.push(name);
                    continue;
                }
                if (o instanceof DayPilot.Bubble) {
                    properties.push(name);
                    continue;
                }
                if (o instanceof DayPilot.Date) {
                    properties.push(name);
                    continue;
                }
                if (o instanceof DayPilot.Menu) {
                    properties.push(name);
                    continue;
                }
                if (o instanceof DayPilot.Scheduler) {
                    properties.push(name);
                    continue;
                }
                if (DayPilot.isArray(o)) {
                    properties.push(name);
                    continue;
                }
                if (o === null) {
                    properties.push(name);
                }
                var ml = null;
                if (typeof maxLevel === "number") {
                    ml = maxLevel - 1;
                }
                var members = DayPilot.Util.members(o, ml);
                for (var i = 0; i < members.events.length; i++) {
                    events.push(name + "." + members.events[i].name);
                }
                for (var i = 0; i < members.methods.length; i++) {
                    methods.push(name + "." + members.methods[i].name);
                }
                for (var i = 0; i < members.properties.length; i++) {
                    properties.push(name + "." + members.properties[i].name);
                }
                continue;
            }
            properties.push(name);
        }

        events.sort();
        methods.sort();
        properties.sort();

        var transformArray = function(array) {
            for (var i = 0; i < array.length; i++) {
                var name = array[i];
                var item = {};
                item.name = name;
                array[i] = item;
                if (DayPilot.contains(obsolete, name)) {
                    item.obsolete = true;
                }
                if (DayPilot.contains(noCssOnly, name)) {
                    item.noCssOnly = true;
                }
                if (name.indexOf("CallBack") !== -1) {
                    item.aspnet = true;
                    item.mvc = true;
                }
                if (name.indexOf("PostBack") !== -1) {
                    item.aspnet = true;
                }
                if (name.indexOf("Notify") !== -1) {
                    item.aspnet = true;
                    item.mvc = true;
                }

            }
        };
        transformArray(events);
        transformArray(methods);
        transformArray(properties);

        return {
            "events": events,
            "methods": methods,
            "properties": properties
        };
    };

    DayPilot.Util.replaceCharAt = function(str, index, character) {
        return str.substr(0, index) + character + str.substr(index + character.length);
    };

    DayPilot.Util.evalVariable = function(str, allowed) {
        allowed = allowed || ['object']; //  'function'

        if (str === null || typeof str === 'undefined') {
            return null;
        }

        if (DayPilot.indexOf(allowed, typeof str) !== -1) {
            return str;
        }
        if (typeof str !== "string") {
            throw "Unable to resolve a variable name (not a string).";
        }
        if (!/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(str)) {
            throw "Invalid variable name: " + str;
        }
        return eval(str);
    };

    DayPilot.Util.evalFunction = function(str) {
        if (str === null) {
            return null;
        }
        if (typeof str === "function") {
            return str;
        }
        if (typeof str !== "string") {
            throw "Unable to resolve a function (not a string).";
        }
        if (!/^\(?function/.test(str)) {
            throw "Invalid function string";
        }
        return eval("(" + str + ")");
    };

    DayPilot.Util.isNullOrUndefined = function(val) {
        return val === null || typeof val === "undefined";
    };

    DayPilot.Util.log = function(message) {
        window.console && window.console.log && window.console.log(message);
    };

    DayPilot.Util.adiff = function(a, b, f) {
        var result = {};
        result.add = [];
        result.remove = [];

        //for (var i = 0)

        return result;
    };

    DayPilot.Util.workerFrom = function(f) {
        var text = f.toString();
        var body = text.slice(text.indexOf("{") + 1, text.lastIndexOf("}"));
        var blob = new Blob([body]);
        //var blob = new Blob(['('+f.toString() + ')()'], {type: 'text/javascript'});
        var blobURL = window.URL.createObjectURL(blob);
        return new Worker(blobURL);
    };

    DayPilot.Util.dataUriToBlob = function(dataUri) {
        if (typeof dataUri !== "string") {
            throw "DayPilot.Util.dataUriToBlob(): dataURI string expected";
        }
        var split = dataUri.split(",");
        var header = split[0];
        var body = split[1];
        var isBase64 = header.indexOf("base64") !== -1;
        var decode = isBase64 ? atob : decodeURI;  // atob requires IE10+, unsecape is deprecated
        var mime = header.split(":")[1].split(";")[0];

        var raw = decode(body);
        var array = new window.Uint8Array(raw.length);

        for (var i = 0; i < raw.length; i++) {
            array[i] = raw.charCodeAt(i);
        }

        return new Blob([array], {"type": mime});
    };

    DayPilot.Util.downloadDataUri = function(dataUri, name) {
        var blob = DayPilot.Util.dataUriToBlob(dataUri);
        DayPilot.Util.downloadBlob(blob, name);
    };

    DayPilot.Util.downloadBlob = function(blob, name) {
        var name = name || "download";

        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, name);
        }
        else {
            var url = window.URL.createObjectURL(blob);     // required instead of data uri for big objects ( > 2097100 characters)

            var link = document.createElement("a");
            link.download = name;
            link.href = url;
            link.style = "display:none";
            document.body.appendChild(link);  // required by ff
            link.click();
            setTimeout(function() {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            });
        }
    };

    DayPilot.Util.monitor = function(obj, name, inject) {
        //var id = "f" + DayPilot.guid();
        //obj[id] = obj[name];
        var original = obj[name];

        obj[name] = function() {
            inject.apply(obj, arguments);
            original.apply(obj, arguments);
        };
    };

    DayPilot.Util.isTransparentColor = function(color) {
        if (color === "transparent") {
            return true;
        }
        if (color === "rgba(0, 0, 0, 0)") {
            return true;
        }
        return false;
    };

    DayPilot.Util.stripTags = function(html) {
        if (DayPilot.Util.isNullOrUndefined(html)) {
            return html;
        }
        if (typeof html === "string") {
            return html.replace(/<(?:.|\n)*?>/gm, '');
        }
        throw new DayPilot.Exception("Unable to strip tags from a non-string");
    };

    DayPilot.Areas = {};

    /**
     * Attach active areas to a target div.
     * Works with "Visible" and "Hover" visibility
     */
    DayPilot.Areas.attach = function (div, e, options) {
        var options = options || {};
        var areas = options.areas;
        var allowed = options.allowed || function() { return true; };
        var offsetX = options.offsetX || 0;

        // permanently visible active areas
        areas = areasExtract(e, areas);

        if (!areas) {
            return;
        }

        if (!DayPilot.isArray(areas)) {
            return;
        }

        if (areas.length === 0) {
            return;
        }

        DayPilot.re(div, "mousemove", function(ev) {
            if (!div.active && !div.areasDisabled && allowed()) {
                DayPilot.Areas.showAreas(div, e, ev, areas, { "offsetX": offsetX, "eventDiv": options.eventDiv});
            }
        });
        DayPilot.re(div, "mouseout", function(ev) {
            DayPilot.Areas.hideAreas(div, ev);
        });

        DayPilot.list(areas).each(function(area) {
            var v = area.visibility || area.v || "Visible";
            if (v !== "Visible") {
                return;
            }
            var a = DayPilot.Areas.createArea(div, e, area, { "offsetX": offsetX, "eventDiv": options.eventDiv});
            div.appendChild(a);
        });
    };

    DayPilot.Areas.disable = function(div) {
        div.areasDisabled = true;
        DayPilot.list(div.childNodes).filter(function(item) { return item.isActiveArea && !item.area.start; }).each(function(item) {
            item.style.display = "none";
        });
    };

    DayPilot.Areas.enable = function(div) {
        div.areasDisabled = false;
        DayPilot.list(div.childNodes).filter(function(item) { return item.isActiveArea && !item.area.start; }).each(function(item) {
            item.style.display = "";
        });
    };

    DayPilot.Areas.remove = function(div) {
        var divs = DayPilot.list(div.childNodes).filter(function(item) { return item.isActiveArea; });

        DayPilot.de(divs);
    };

    /**
     * Extracts areas array from the source object, giving priority to a standalone areas object.
     * @param e
     * @param areas
     */
    var areasExtract = function(e, areas) {
        if (!DayPilot.isArray(areas)) {
            areas = e.areas;
            if (!areas) {
                if (e.cache) {
                    areas = e.cache.areas;
                }
                else if (e.data) {
                    areas = e.data.areas;
                }
            }
        }
        return areas;
    };


    DayPilot.Areas.showAreas = function(div, e, ev, areas, options) {
        if (DayPilot.Global.resizing) {
            return;
        }

        if (DayPilot.Global.moving) {
            return;
        }

        if (DayPilot.Areas.all && DayPilot.Areas.all.length > 0) {
            for (var i = 0; i < DayPilot.Areas.all.length; i++) {
                var d = DayPilot.Areas.all[i];
                if (d !== div) {
                    DayPilot.Areas.hideAreas(d, ev);
                }
            }
        }

        if (div.active) {
            return;
        }
        div.active = {};

        //var areas;
        if (!DayPilot.isArray(areas)) {
            areas = e.areas;
            if (!areas) {
                if (e.cache) {
                    areas = e.cache.areas;
                }
                else if (e.data) {
                    areas = e.data.areas;
                }
            }
        }
        
        /*
        if (!areas && e.cache && e.cache.areas) {
            areas = e.cache.areas;
        }
        
        if (!areas && e.data && e.data.areas) {
            areas = e.data.areas;
        }
        */
       
        if (!areas || areas.length === 0) {
            return;
        }

        if (div.areas && div.areas.length > 0) {
            return;
        }
        //if (typeof div.areas == 'undefined') {
        div.areas = [];
        //}

        for (var i = 0; i < areas.length; i++) {
            var area = areas[i];
            var v = area.visibility || area.v || "Visible";
            if (v !== 'Hover') {
                continue;
            }

            var a = DayPilot.Areas.createArea(div, e, area, options);

            div.areas.push(a);
            div.appendChild(a);

            DayPilot.Areas.all.push(div);
        }
        div.active.children = DayPilot.ac(div);
    };

    /**
     *
     * @param div Target div element
     * @param e Source data object
     * @param area Area definition
     * @returns {Element}
     */
    DayPilot.Areas.createArea = function(div, e, area, options) {

        var options = options || {};
        var offsetX = options.offsetX || 0;
        var ediv = options.eventDiv || div;

        var a = document.createElement("div");
        a.isActiveArea = true;
        a.area = area;
        a.setAttribute("unselectable", "on");
        var w = area.w || area.width;
        var h = area.h || area.height;
        var css = area.cssClass || area.css || area.className;
        if (typeof area.style !== "undefined") {
            a.setAttribute("style", area.style);
        }
        a.style.position = "absolute";
        if (typeof w !== 'undefined') {
            a.style.width = w + "px";
        }
        if (typeof h !== 'undefined') {
            a.style.height = h + "px";
        }
        if (typeof area.right !== 'undefined') {
            a.style.right = area.right + "px";
        }
        if (typeof area.top !== 'undefined') {
            a.style.top = area.top + "px";
        }
        if (typeof area.left !== 'undefined') {
            a.style.left = (area.left + offsetX) + "px";
        }
        if (typeof area.bottom !== 'undefined') {
            a.style.bottom = area.bottom + "px";
        }
        if (typeof area.html !== 'undefined' && area.html) {
            a.innerHTML = area.html;
        }
        else if (area.icon) {
            var iel = document.createElement("i");
            iel.className = area.icon;
            a.appendChild(iel);
        }
        else if (area.image) {
            var img = document.createElement("img");
            img.src = area.image;
            a.appendChild(img);
        }
        if (css) {
            a.className = css;
        }
        if (area.toolTip) {
            a.setAttribute("title", area.toolTip);
        }
        if (area.backColor) {
            a.style.background = area.backColor;
        }
        if (area.background) {  // alias
            a.style.background = area.background;
        }
        if (area.fontColor) {
            a.style.color = area.fontColor;
        }
        if (area.padding) {
            a.style.padding = area.padding + "px";
            a.style.boxSizing = "border-box";
        }
        if (area.action === "ResizeEnd" || area.action === "ResizeStart" || area.action === "Move") {
            if (e.calendar.isCalendar) {
                switch (area.action) {
                    case "ResizeEnd":
                        area.cursor = "s-resize";
                        area.dpBorder = "bottom";
                        break;
                    case "ResizeStart":
                        area.cursor = "n-resize";
                        area.dpBorder = "top";
                        break;
                    case "Move":
                        area.cursor = "move";
                        break;
                }
            }
            if (e.calendar.isScheduler || e.calendar.isMonth) {
                switch (area.action) {
                    case "ResizeEnd":
                        area.cursor = "e-resize";
                        area.dpBorder = "right";
                        break;
                    case "ResizeStart":
                        area.cursor = "w-resize";
                        area.dpBorder = "left";
                        break;
                    case "Move":
                        area.cursor = "move";
                        break;
                }
            }
            a.onmousemove = (function(div, e, area) {
                return function(ev) {
                    var ev = ev || window.event;
                    ev.cancelBubble = true;
                    if (e.calendar.internal && e.calendar.internal.dragInProgress && e.calendar.internal.dragInProgress()) {  // resizing in progress
                        return;
                    }
                    div.style.cursor = area.cursor;
                    if (area.dpBorder) {
                        div.dpBorder = area.dpBorder;
                    }
                };
            })(ediv, e, area);
            a.onmouseout = (function(div, e, area) {
                return function(ev) {
                    div.style.cursor = '';
                };
            })(ediv, e, area);
        }
        if ((area.action === "ResizeEnd" || area.action === "ResizeStart") && e.isEvent) {
            if (e.calendar.internal.touch) {
                var touchstart = (function(div, e, area) {
                    return function(ev) {
                        ev.cancelBubble = true;
                        var touch = e.calendar.internal.touch;
                        var t = ev.touches ? ev.touches[0] : ev;
                        var coords = {x: t.pageX, y: t.pageY };
                        // immediately
                        e.calendar.coords = touch.relativeCoords(ev);
                        touch.preventEventTap = true;
                        if (e.calendar.isScheduler) {
                            touch.startResizing(div, area.action === "ResizeEnd" ? "right" : "left");
                        }
                        else if (e.calendar.isCalendar) {
                            touch.startResizing(div, area.action === "ResizeEnd" ? "bottom" : "top", coords);
                        }

                    };
                })(ediv, e, area);
                DayPilot.re(a, DayPilot.touch.start, touchstart);
            }
        }
        if (area.action === "ContextMenu" && e.isEvent) {
            if (e.calendar.internal.touch) {
                var touchstart = (function(div, e, area) {
                    return function(ev) {
                        ev.cancelBubble = true;
                        ev.preventDefault();

                        showContextMenu(div, e, area, ev);
                        var touch = e.calendar.internal.touch;
                        touch.preventEventTap = true;
                    };
                })(ediv, e, area);
                var touchend = (function(div, e, area) {
                    return function(ev) {
                        ev.cancelBubble = true;
                        ev.preventDefault();
                    };
                })(ediv, e, area);
                DayPilot.re(a, DayPilot.touch.start, touchstart);
                DayPilot.re(a, DayPilot.touch.end, touchend);
            }
        }
        if (area.action === "Bubble" && e.isEvent) {
            if (e.calendar.internal.touch) {
                var touchstart = (function(div, e, area) {
                    return function(ev) {
                        ev.cancelBubble = true;
                        ev.preventDefault();

                        showBubble(e, area, ev);
                        var touch = e.calendar.internal.touch;
                        touch.preventEventTap = true;
                    };
                })(ediv, e, area);
                var touchend = (function(div, e, area) {
                    return function(ev) {
                        ev.cancelBubble = true;
                        ev.preventDefault();
                    };
                })(ediv, e, area);
                DayPilot.re(a, DayPilot.touch.start, touchstart);
                DayPilot.re(a, DayPilot.touch.end, touchend);
            }
        }
        if (area.action === "Move" && e.isEvent) {
            if (e.calendar.internal.touch) {
                var touchstart = (function(div, e, area) {
                    return function(ev) {
                        ev.cancelBubble = true;
                        var touch = e.calendar.internal.touch;
                        var t = ev.touches ? ev.touches[0] : ev;
                        var coords = {x: t.pageX, y: t.pageY }; 
                        // immediately
                        e.calendar.coords = touch.relativeCoords(ev);
                        touch.preventEventTap = true;
                        touch.startMoving(div, coords);
                    };
                })(ediv, e, area);
                DayPilot.re(a, DayPilot.touch.start, touchstart);
            }
        }
        if (area.action === "Move" && e.isRow) {
            if (e.calendar.internal.touch) {
                // TODO
            }
            /*
            a.onmousedown = (function(div, e, area) {
                return function(ev) {
                    rowmoving.row = row;
                    rowtools.createOverlay(row);
                };
            })(div, e, area);
            */
        }
        if (area.action === "Bubble" && e.isEvent) {
            a.onmousemove = (function(div, e, area) {
                return function(ev) {
                    if (area.bubble) {
                        area.bubble.showEvent(e, true);
                    }
                    else if (e.calendar.bubble) {
                        e.calendar.bubble.showEvent(e, true);
                    }
                };
            })(div, e, area);
            a.onmouseout = (function(div, e, area) {
                return function(ev) {
                    if (typeof DayPilot.Bubble !== "undefined") {
                        //DayPilot.Bubble.hideActive();
                        if (area.bubble) {
                            area.bubble.hideOnMouseOut();
                        }
                        else if (e.calendar.bubble) {
                            e.calendar.bubble.hideOnMouseOut();
                        }
                    }

                };
            })(div, e, area);
        }
        if (area.action === "Bubble" && e.isRow) {
            a.onmousemove = (function(div, e, area) {
                return function(ev) {
                    if (area.bubble) {
                        area.bubble.showResource(e, true);
                    }
                    else if (e.calendar.resourceBubble) {
                        e.calendar.resourceBubble.showResource(e, true);
                    }
                };
            })(div, e, area);
            a.onmouseout = (function(div, e, area) {
                return function(ev) {
                    if (typeof DayPilot.Bubble !== "undefined") {
                        //DayPilot.Bubble.hideActive();
                        if (area.bubble) {
                            area.bubble.hideOnMouseOut();
                        }
                        else if (e.calendar.resourceBubble) {
                            e.calendar.resourceBubble.hideOnMouseOut();
                        }
                    }

                };
            })(div, e, area);
        }
        if (area.action === "HoverMenu") {
            a.onmousemove = (function(div, e, area) {
                return function(ev) {
                    var m = area.menu;
                    if (typeof m === 'string') {
                        m = DayPilot.Util.evalVariable(m);
                    }
                    if (m && m.show) {
                        if (!m.visible) {
                            m.show(e);
                        }
                        else if (m.source && typeof m.source.id !== 'undefined' && m.source.id !== e.id) {
                            m.show(e);
                        }
                        m.cancelHideTimeout();
                    }
                };
            })(div, e, area);
            a.onmouseout = (function(div, e, area) {
                return function(ev) {
                    var m = area.menu;
                    if (typeof m === 'string') {
                        m = DayPilot.Util.evalVariable(m);
                    }
                    if (!m) {
                        return;
                    }
                    if (m.hideOnMouseOver) {
                        m.delayedHide();
                    }
                };
            })(div, e, area);
        }
        if (area.action === "JavaScript") {
            var touchstart = (function(div, e, area) {
                return function(ev) {
                    if (DayPilot.Util.isMouseEvent(ev)) {
                        return;
                    }

                    //alert("touchstart");
                    ev.cancelBubble = true;
                    ev.preventDefault();

                    //showBubble(e, area, ev);
                    var touch = e.calendar.internal.touch;
                    touch.start = true;

                };
            })(ediv, e, area);
            var touchend = (function(div, e, area) {
                return function(ev) {
                    if (DayPilot.Util.isMouseEvent(ev)) {
                        return;
                    }

                    ev.cancelBubble = true;
                    ev.preventDefault();

                    var touch = e.calendar.internal.touch;
                    touch.start = false;

                    var f = area.js;
                    if (typeof f === 'string') {
                        f = DayPilot.Util.evalFunction(area.js);
                    }
                    if (typeof f === 'function') {
                        var target = area.target || e;
                        f.call(this, target);
                    }

                };
            })(ediv, e, area);
            DayPilot.re(a, DayPilot.touch.start, touchstart);
            DayPilot.re(a, DayPilot.touch.end, touchend);
        }
        // prevent event moving
        a.onmousedown = (function(div, e, area) {
            return function(ev) {
                if (typeof area.onmousedown === 'function') { // obsolete, remove
                    area.onmousedown(ev);
                }

                if (typeof area.mousedown === 'function') { // internal
                    var args = {};
                    args.area = area;
                    args.div = div;
                    args.originalEvent = ev;
                    args.source = e;
                    area.mousedown(args);
                }

                if (area.action === "Move" && e.isRow) {
                    var row = e.$.row;
                    var rowtools = e.calendar.internal.rowtools;

                    rowtools.startMoving(row);
                }

                // cancel any bubble
                if (typeof DayPilot.Bubble !== "undefined") {
                    DayPilot.Bubble.hideActive();
                }

                if (area.action === "Move") {
                    DayPilot.Global.movingAreaData = area.data;
                }

                var cancel = true;

                if (cancel) {
                    if (area.action === "Move" || area.action === "ResizeEnd" || area.action === "ResizeStart" || !area.action) {
                        return;
                    }
                    ev = ev || window.event;
                    ev.preventDefault(); // prevents text selection on dragging
                    ev.cancelBubble = true;
                }
            };
        })(div, e, area);
        a.onclick = (function(div, e, area) {
            return function(ev) {
                var ev = ev || window.event;

                /*
                if (!area.action) {  // do not cancel bubble
                    return;
                }
                */

                var args = {};
                args.area = area;
                args.source = e;
                args.originalEvent = ev;
                args.preventDefault = function() {
                    args.preventDefault.value = true;
                };

                if (typeof area.onClick === "function") {
                    area.onClick(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }

                switch (area.action) {
                    case "JavaScript":
                        var f = area.js;
                        if (typeof f === 'string') {
                            f = DayPilot.Util.evalFunction(area.js);
                        }
                        if (typeof f === 'function') {
                            var target = area.target || e;
                            f.call(this, target);
                        }
                        ev.cancelBubble = true;
                        break;
                    case "ContextMenu":
                        showContextMenu(div, e, area, ev);
                        ev.cancelBubble = true;
                        break;
                    case "CallBack":
                        alert("callback not implemented yet, id: " + area.id);
                        ev.cancelBubble = true;
                        break;
                }

                if (typeof area.onClicked === "function") {
                    area.onClicked(args);
                }
            };
        })(div, e, area);

        function showBubble(e, area, ev) {
            if (DayPilot.Bubble) {
                DayPilot.Bubble.touchPosition(ev);
            }

            if (e.calendar.bubble) {
                e.calendar.bubble.showEvent(e, true);
            }
        }

        function showContextMenu(div, e, area, ev) {
            if (DayPilot.Menu) {
                DayPilot.Menu.touchPosition(ev);
            }

            var m = area.menu;
            if (typeof m === 'string') {
                m = DayPilot.Util.evalVariable(m);
            }
            else if (e.isEvent && e.calendar.contextMenu) {
                m = DayPilot.Util.evalVariable(e.calendar.contextMenu);
            }
            else if (e.isRow && e.calendar.contextMenuResource) {
                m = DayPilot.Util.evalVariable(e.calendar.contextMenuResource);
            }
            if (m && m.show) {
                var initiator = { "type": "area", "div": div, "e": e, "area": area};
                m.show(e, { "initiator": initiator});
            }
        }


        return a;
    };

    DayPilot.Areas.all = [];

    DayPilot.Areas.hideAreas = function(div, ev) {
        if (!div) {
            return;
        }

        if (!div || !div.active) {
            return;
        }

        var active = div.active;
        var areas = div.areas;

        if (active && active.children) {
            var ev = ev || window.event;
            if (ev) {
                var target = ev.toElement || ev.relatedTarget;
                if (~DayPilot.indexOf(active.children, target)) {
                    return;
                }
            }
        }

        if (!areas || areas.length === 0) {
            div.active = null;
            return;
        }

        DayPilot.de(areas);
        /*
        for (var i = 0; i < areas.length; i++) {
            var a = areas[i];
            div.removeChild(a);
        }*/

        div.active = null;
        div.areas = [];

        DayPilot.rfa(DayPilot.Areas.all, div);

        active.children = null;
    };

    DayPilot.Areas.hideAll = function(ev) {
        if (!DayPilot.Areas.all || DayPilot.Areas.all.length === 0) {
            return;
        }
        for (var i = 0; i < DayPilot.Areas.all.length; i++) {
            DayPilot.Areas.hideAreas(DayPilot.Areas.all[i], ev);
        }

    };
    
    DayPilot.Action = function(calendar, name, params, data) {
        var action = this;
        this.calendar = calendar;
        this.isAction = true;
        this.action = name;
        this.params = params;
        this.data = data;

        this.notify = function() {
            action.calendar.internal.invokeEvent("Immediate", this.action, this.params, this.data);
        };

        this.auto = function() {
            action.calendar.internal.invokeEvent("Notify", this.action, this.params, this.data);
        };

        this.queue = function() {
            action.calendar.queue.add(this);
        };

        this.toJSON = function() {
            var json = {};
            json.name = this.action;
            json.params = this.params;
            json.data = this.data;

            return json;
        };

    };

    DayPilot.Selection = function(start, end, resource, root) {
        this.menuType = 'selection';  // for menu
        this.start = new DayPilot.Date(start);
        this.end = new DayPilot.Date(end);
        this.resource = resource;
        this.root = root;
        this.calendar = root;

        this.toJSON = function(key) {
            var json = {};
            json.start = this.start;
            json.end = this.end;
            json.resource = this.resource;

            return json;
        };
    };

    DayPilot.Link = function(data, calendar) {
        this.isLink = true;
        this.data = data;
        this.calendar = calendar;

        this.to = function() {
            return this.data.to;
        };

        this.from = function() {
            return this.data.from;
        };

        this.type = function() {
            return this.data.type;
        };

        this.id = function() {
            return this.data.id;
        };

        this.toJSON = function() {
            var json = {};
            json.from = this.data.from;
            json.to = this.data.to;
            json.id = this.data.id;
            json.type = this.data.type;
            return json;
        };
    };

/*
    DayPilot.Args = function() {
        this.isArgs = true;
        this.preventDefault = function () {
            this.preventDefault.value = true;
        };
    };
*/

    DayPilot.Event = function(data, calendar, part) {
        var e = this;
        this.calendar = calendar;
        this.data = data ? data : {};
        this.part = part ? part : {};

        // backwards compatibility, still accepts id in "value" 
        if (typeof this.data.id === 'undefined') {
            this.data.id = this.data.value;
        }

        var copy = {};
        var synced = ["id", "text", "start", "end", "resource"];

        this.isEvent = true;

        DayPilot.Stats.eventObjects += 1;

        // internal
        this.temp = function() {
            if (copy.dirty) {
                return copy;
            }
            for (var i = 0; i < synced.length; i++) {
                copy[synced[i]] = e.data[synced[i]];
            }
            copy.dirty = true;
            return copy;

        };

        // internal
        // copies data object
        // used when the original state of the data is needed (notified EventMove etc.)
        this.copy = function() {
            var result = {};
            DayPilot.Util.copyProps(e.data, result);
            return result;
            /*
            for (var i = 0; i < synced.length; i++) {
                result[synced[i]] = e.data[synced[i]];
            }
            return result;
            */
        };

        this.commit = function() {
            if (!copy.dirty) {
                return;
            }

            for (var i = 0; i < synced.length; i++) {
                e.data[synced[i]] = copy[synced[i]];
            }

            copy.dirty = false;
        };

        this.dirty = function() {
            return copy.dirty;
        };

        this.id = function(val) {
            if (typeof val === 'undefined') {
                return e.data.id;
            }
            else {
                this.temp().id = val;
            }
        };
        // obsolete, use id() instead
        this.value = function(val) {
            if (typeof val === 'undefined') {
                return e.id();
            }
            else {
                e.id(val);
            }
        };

        this.text = function(val) {
            if (typeof val === 'undefined') {
                return e.data.text;
            }
            else {
                this.temp().text = val;
                this.client.innerHTML(val); // update the HTML automatically
            }
        };
        this.start = function(val) {
            if (typeof val === 'undefined') {
                return new DayPilot.Date(e.data.start);
            }
            else {
                this.temp().start = new DayPilot.Date(val);
            }
        };
        this.end = function(val) {
            if (typeof val === 'undefined') {
                if (calendar && calendar.internal.adjustEndNormalize) {
                    return calendar.internal.adjustEndNormalize(new DayPilot.Date(e.data.end));
                }
                return new DayPilot.Date(e.data.end);
            }
            else {
                this.temp().end = new DayPilot.Date(val);
            }
        };
        this.duration = function() {
            return new DayPilot.Duration(this.start(), this.end());
        };
        this.rawend = function() {
            if (typeof val === 'undefined') {
                if (calendar && calendar.internal.adjustEndIn) {
                    return calendar.internal.adjustEndIn(new DayPilot.Date(e.data.end));
                }
                return new DayPilot.Date(e.data.end);
            }
            else {
                this.temp().end = new DayPilot.Date(val);
            }
        };
        this.partStart = function() {
            return new DayPilot.Date(this.part.start);
        };
        this.partEnd = function() {
            return new DayPilot.Date(this.part.end);
        };
        this.row = function() {
            return this.resource();
        };
        
        this.allday = function() {
            if (typeof val === 'undefined') {
                return e.data.allday;
            }
            else {
                this.temp().allday = val;
            }            
        };
        
        // backwards compatibility, 7.3
        this.isAllDay = this.allday;

        this.resource = function(val) {
            if (typeof val === 'undefined') {
                return e.data.resource;
            }
            else { // it's a resource id
                this.temp().resource = val;
            }
        };

        this.recurrent = function() {
            return e.data.recurrent;
        };
        this.recurrentMasterId = function() {
            return e.data.recurrentMasterId;
        };
        this.useBox = function() {
            return this.part.box;
        };
        this.staticBubbleHTML = function() {
            return this.bubbleHtml();
        };
        this.bubbleHtml = function() {
            if (e.cache) {
                return e.cache.bubbleHtml || e.data.bubbleHtml;
            }
            return e.data.bubbleHtml;
        };
        this.tag = function(field) {
            if (e.data.tags) {
                return e.data.tags[field];
            }
            else {
                var values = e.data.tag;
                if (!values) {
                    return null;
                }
                if (typeof field === 'undefined') {
                    return e.data.tag;
                }
                var fields = e.calendar.tagFields;
                var index = -1;
                for (var i = 0; i < fields.length; i++) {
                    if (field === fields[i])
                        index = i;
                }
                if (index === -1) {
                    throw "Field name not found.";
                }
                return values[index];
            }
        };

        this.client = {};
        this.client.innerHTML = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.html !== "undefined") {
                    return e.cache.html;
                }
                if (typeof e.data.html !== "undefined") {
                    return e.data.html;
                }
                return e.data.text;
            }
            else {
                e.data.html = val;
                if (e.cache) {
                    e.cache.html = val;
                }
            }
        };
        
        this.client.html = this.client.innerHTML;
        
        this.client.header = function(val) {
            if (typeof val === 'undefined') {
                return e.data.header;
            }
            else {
                e.data.header = val;
            }
        };
        
        this.client.cssClass = function(val) {
            if (typeof val === 'undefined') {
                return e.data.cssClass;
            }
            else {
                e.data.cssClass = val;
            }
        };
        this.client.toolTip = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.toolTip !== "undefined") {
                    return e.cache.toolTip;
                }
                return typeof e.data.toolTip !== 'undefined' ? e.data.toolTip : e.data.text;
            }
            else {
                e.data.toolTip = val;
            }
        };

        // toberemoved
        this.client.backColor = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.backColor !== "undefined") {
                    return e.cache.backColor;
                }
                return typeof e.data.backColor !== "undefined" ? e.data.backColor : e.calendar.eventBackColor;
            }
            else {
                e.data.backColor = val;
            }
        };

        this.client.borderColor = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.borderColor !== "undefined") {
                    return e.cache.borderColor;
                }
                return typeof e.data.borderColor !== "undefined" ? e.data.borderColor : e.calendar.eventBorderColor;
            }
            else {
                e.data.borderColor = val;
            }
        };

        // toberemoved
        this.client.barColor = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.barColor !== "undefined") {
                    return e.cache.barColor;
                }
                return typeof e.data.barColor !== "undefined" ? e.data.barColor : e.calendar.durationBarColor;
            }
            else {
                e.data.barColor = val;
            }
        };

        this.client.barVisible = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.barHidden !== "undefined") {
                    return !e.cache.barHidden;
                }
                return e.calendar.durationBarVisible && !e.data.barHidden;
            }
            else {
                e.data.barHidden = !val;
            }
        };

        this.client.contextMenu = function(val) {
            if (typeof val === 'undefined') {
                if (e.oContextMenu) {
                    return e.oContextMenu;
                }
                var cm = e.cache ? e.cache.contextMenu : e.data.contextMenu;
                return (cm) ? DayPilot.Util.evalVariable(cm) : null;  // might want to return the default context menu in the future
            }
            else {
                e.oContextMenu = val;
            }
        };

        this.client.moveEnabled = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.moveDisabled !== "undefined") {
                    return !e.cache.moveDisabled;
                }
                return e.calendar.eventMoveHandling !== 'Disabled' && !e.data.moveDisabled;
            }
            else {
                e.data.moveDisabled = !val;
            }
        };

        this.client.resizeEnabled = function(val) {
            if (typeof val === 'undefined') {
                if (e.data.type === "Milestone") {
                    return false;
                }
                if (e.cache && typeof e.cache.resizeDisabled !== "undefined") {
                    return !e.cache.resizeDisabled;
                }
                return e.calendar.eventResizeHandling !== 'Disabled' && !e.data.resizeDisabled;
            }
            else {
                e.data.resizeDisabled = !val;
            }
        };

        this.client.rightClickEnabled = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.rightClickDisabled !== "undefined") {
                    return !e.cache.rightClickDisabled;
                }
                return e.calendar.rightClickHandling !== 'Disabled' && !e.data.rightClickDisabled;
            }
            else {
                e.data.rightClickDisabled = !val;
            }
        };

        this.client.clickEnabled = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.clickDisabled !== "undefined") {
                    return !e.cache.clickDisabled;
                }
                return e.calendar.clickHandling !== 'Disabled' && !e.data.clickDisabled;
            }
            else {
                e.data.clickDisabled = !val;
            }
        };

        this.client.deleteEnabled = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.deleteDisabled !== "undefined") {
                    return !e.cache.deleteDisabled;
                }
                return e.calendar.eventDeleteHandling !== 'Disabled' && !e.data.deleteDisabled;
            }
            else {
                e.data.deleteDisabled = !val;
            }
        };
        
        this.client.doubleClickEnabled = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.doubleClickDisabled !== "undefined") {
                    return !e.cache.doubleClickDisabled;
                }
                return e.calendar.eventDoubleClickHandling !== 'Disabled' && !e.data.doubleClickDisabled;
            }
            else {
                e.data.doubleClickDisabled = !val;
            }
        };

        this.client.deleteClickEnabled = function(val) {
            if (typeof val === 'undefined') {
                if (e.cache && typeof e.cache.deleteDisabled !== "undefined") {
                    return !e.cache.deleteDisabled;
                }
                return e.calendar.eventDeleteHandling !== 'Disabled' && !e.data.deleteDisabled;
            }
            else {
                e.data.deleteDisabled = !val;
            }
        };

        this.toJSON = function(key) {
            var json = {};
            json.value = this.id(); // still sending it with the old name
            json.id = this.id();
            json.text = this.text();
            json.start = this.start().toJSON();
            json.end = this.end().toJSON();
            json.resource = this.resource();
            json.isAllDay = false;
            json.recurrentMasterId = this.recurrentMasterId();
            json.join = this.data.join;
            json.tag = {};

            if (e.data.tags) {
                for (var name in e.data.tags) {
                    if (e.data.tags.hasOwnProperty(name)) {
                        json.tag[name] = "" + e.data.tags[name];
                    }
                }
            }
            else {
                if (e.calendar && e.calendar.tagFields) {
                    var fields = e.calendar.tagFields;
                    for (var i = 0; i < fields.length; i++) {
                        json.tag[fields[i]] = this.tag(fields[i]);
                    }
                }
            }

            return json;
        };
    };

    /**
     * A simple wrapper around task data.
     * @param data
     * @constructor
     */
    DayPilot.Task = function(data, calendar) {
        if (!data) {
            throw "Trying to initialize DayPilot.Task with null data parameter";
        }

        var e = this;

        var event = null; // reference to DayPilot.Event received from the Scheduler

        if (data instanceof DayPilot.Event) {
            event = data;
            this.data = data.data.task;
        }
        else if (data instanceof DayPilot.Task) {
            return data; // don't create a new object
        }
        else if (data.isTaskWrapper) {
            this.data = data.data;
        }
        else {
            this.data = data;
        }

        var copy = {};
        var synced = ["id", "text", "start", "end", "complete", "type"];

        this.isTask = true;
        this.calendar = calendar;

        // internal
        this.temp = function() {
            if (copy.dirty) {
                return copy;
            }
            for (var i = 0; i < synced.length; i++) {
                copy[synced[i]] = e.data[synced[i]];
            }
            copy.dirty = true;
            return copy;

        };

        // internal
        // copies data object
        // used when the original state of the data is needed (notified EventMove etc.)
        this.copy = function() {
            var result = {};
            DayPilot.Util.copyProps(e.data, result);
            return result;
        };

        this.commit = function() {
            if (!copy.dirty) {
                return;
            }

            for (var i = 0; i < synced.length; i++) {
                e.data[synced[i]] = copy[synced[i]];
            }

            copy.dirty = false;
        };

        this.dirty = function() {
            return copy.dirty;
        };

        this.id = function(val) {
            if (typeof val === 'undefined') {
                return e.data.id;
            }
            else {
                this.temp().id = val;
            }
        };
        this.text = function(val) {
            if (typeof val === 'undefined') {
                return e.data.text;
            }
            else {
                this.temp().text = val;
                this.client.innerHTML(val); // update the HTML automatically
            }
        };
        this.start = function(val) {
            if (typeof val === 'undefined') {
                return new DayPilot.Date(e.data.start);
            }
            else {
                this.temp().start = new DayPilot.Date(val);
            }
        };
        this.duration = function() {
            return new DayPilot.Duration(this.start(), this.end());
        };
        this.end = function(val) {
            if (typeof val === 'undefined') {
                if (calendar && calendar.eventEndSpec === "Date") {
                    return new DayPilot.Date(e.data.end).getDatePart().addDays(1);
                }
                return new DayPilot.Date(e.data.end);
            }
            else {
                this.temp().end = new DayPilot.Date(val);
            }
        };
        this.type = function(val) {
            if (typeof val === 'undefined') {
                if (event) {
                    return event.data.type;
                }
                return e.data.type;
            }
            else {
                this.temp().type = val;
            }
        };
        this.complete = function(val) {
            if (typeof val === 'undefined') {
                if (!e.data.complete) {
                    return 0;
                }
                return e.data.complete;
            }
            else {
                this.temp().complete = val;
            }
        };
        this.children = function() {
            var list = [];
            list.add = function(data) {
                var task = new DayPilot.Task(data);
                if (!this.data.children) {
                    this.data.children = [];
                }
                this.children.push(task.data);
            };
            for(var i = 0; this.data.children && i < this.data.children.length; i++) {
                list.push(new DayPilot.Task(this.data.children[i], calendar));
            }

            return list;
        };

        this.toJSON = function(key) {
            var json = {};
            json.id = this.id();
            json.text = this.text();
            json.start = this.start().toJSON();
            json.end = this.end().toJSON();
            json.type = this.type();
            json.tags = {};

            DayPilot.Util.copyProps(this.data.tags, json.tags);

            return json;
        };

        this.row = {};
        var row = this.row;

        row.expanded = function(val) {
            if (typeof val === 'undefined') {
                if (!e.data.row) {
                    return true;
                }
                return !e.data.row.collapsed;
            }
            else {
                if (!e.data.row) {
                    e.data.row = {};
                }
                if (!!e.data.row.collapsed  !== !val) {
                    calendar.internal.rowObjectForTaskData(e.data).toggle();
                }
                e.data.row.collapsed = !val;

                /*
                if (calendar) {
                    calendar.update();
                }
                */
            }
        };

        row.expand = function() {
            row.expanded(true);
        };

        row.collapse = function() {
            row.expanded(false);
        };

        row.toggle = function() {
            row.expanded(!row.expanded());
        };

    };

    /* XMLHttpRequest */
    
    DayPilot.request = function(url, callback, postData, errorCallback) {
        var req = DayPilot.createXmlHttp();
        if (!req) {
            return;
        }

        req.open("POST", url, true);
        req.setRequestHeader('Content-type', 'text/plain');
        req.onreadystatechange = function() {
            if (req.readyState !== 4)
                return;
            if (req.status !== 200 && req.status !== 304) {
                if (errorCallback) {
                    errorCallback(req);
                }
                else {
                    if (window.console) { console.log('HTTP error ' + req.status); }
                }
                return;
            }
            callback(req);
        };
        if (req.readyState === 4) {
            return;
        }
        if (typeof postData === 'object') {
            postData = JSON.stringify(postData);
        }
        req.send(postData);
    };

    DayPilot.ajax = function(params) {
        if (!params) {
            throw new DayPilot.Exception("Parameter object required.");
        }

        if (typeof params.url !== "string") {
            throw new DayPilot.Exception("The parameter object must have 'url' property.")
        }

        var req = DayPilot.createXmlHttp();
        if (!req) {
            throw new DayPilot.Exception("Unable to create XMLHttpRequest object");
        }

        var dataIsObject = typeof params.data === "object";

        var data = params.data;
        var method = params.method || "GET";
        var success = params.success || function() {};
        var error = params.error || function() {};
        var url = params.url;
        var contentType = params.contentType || (dataIsObject ? "application/json" : "text/plain");

        req.open(method, url, true);
        req.setRequestHeader('Content-type', contentType);
        req.onreadystatechange = function() {
            if (req.readyState !== 4) {
                return;
            }
            if (req.status !== 200 && req.status !== 304) {
                if (error) {
                    var args = {};
                    args.request = req;
                    error(args);
                }
                else {
                    if (window.console) { console.log('HTTP error ' + req.status); }
                }
                return;
            }
            var args = {};
            args.request = req;
            args.data = JSON.parse(req.responseText);
            success(args);
        };
        if (req.readyState === 4) {
            return;
        }
        if (dataIsObject) {
            data = JSON.stringify(data);
        }
        req.send(data);
    };

    DayPilot.createXmlHttp = function() {
        return new XMLHttpRequest();
    };

    DayPilot.Http = {};

    DayPilot.Http.ajax = function(params) {
        DayPilot.ajax(params);
    };

/*    DayPilot.Http.post = function(object) {
        var params = DayPilot.Util.copyProps(object, {}, ["success", "error", "data", "url", "contentType"]);
        params.method = "POST";
        DayPilot.ajax(params);
    };

    DayPilot.Http.get = function(object) {
        var params = DayPilot.Util.copyProps(object, {}, ["success", "error", "data", "url"]);
        params.method = "GET";
        DayPilot.ajax(params);
    };*/

    DayPilot.Duration = function(ticks) {
        var d = this;

        var day = 1000*60*60*24;
        var hour = 1000*60*60;
        var minute = 1000*60;
        var second = 1000;

        if (arguments.length === 2) {
            var start = arguments[0];
            var end = arguments[1];

            if (!(start instanceof DayPilot.Date) && (typeof start !== "string")) {
                throw "DayPilot.Duration(): Invalid start argument, DayPilot.Date expected";
            }
            if (!(end instanceof DayPilot.Date) && (typeof end !== "string")) {
                throw "DayPilot.Duration(): Invalid end argument, DayPilot.Date expected";
            }
            if (typeof start === "string") {
                start = new DayPilot.Date(start);
            }
            if (typeof end === "string") {
                end = new DayPilot.Date(end);
            }
            ticks = end.getTime() - start.getTime();
        }

        this.ticks = ticks;

        // caching, allows direct comparison
        if (DayPilot.Date.Cache.DurationCtor["" + ticks]) {
            return DayPilot.Date.Cache.DurationCtor["" + ticks];
        }
        DayPilot.Date.Cache.DurationCtor["" + ticks] = this;

        this.toString = function(pattern) {
            if (!pattern) {
                return d.days() + "." + d.hours() + ":" + d.minutes() + ":" + d.seconds() + "." + d.milliseconds();
            }

            var minutes = d.minutes();
            minutes = (minutes < 10 ? "0" : "") + minutes;

            // dumb replacement
            var result = pattern;
            result = result.replace("mm", minutes);
            result = result.replace("m", d.minutes());
            result = result.replace("H", d.hours());
            result = result.replace("h", d.hours());
            result = result.replace("d", d.days());
            result = result.replace("s", d.seconds());
            return result;
        };

        this.totalHours = function() {
            return d.ticks / hour;
        };

        this.totalDays = function() {
            return d.ticks / day;
        };

        this.totalMinutes = function() {
            return d.ticks / minute;
        };

        this.totalSeconds = function() {
            return d.ticks / second;
        };

        this.days = function() {
            return Math.floor(d.totalDays());
        };

        this.hours = function() {
            var hourPartTicks = d.ticks - d.days()*day;
            return Math.floor(hourPartTicks/hour);
        };

        this.minutes = function() {
            var minutePartTicks = d.ticks - Math.floor(d.totalHours()) * hour;
            return Math.floor(minutePartTicks/minute);
        };

        this.seconds = function() {
            var secondPartTicks = d.ticks - Math.floor(d.totalMinutes()) * minute;
            return Math.floor(secondPartTicks/second);
        };

        this.milliseconds = function() {
            return d.ticks % second;
        };

    };

    DayPilot.Duration.weeks = function(i) {
        return new DayPilot.Duration(i * 1000*60*60*24*7);
    };

    DayPilot.Duration.days = function(i) {
        return new DayPilot.Duration(i * 1000*60*60*24);
    };

    DayPilot.Duration.hours = function(i) {
        return new DayPilot.Duration(i * 1000*60*60);
    };

    DayPilot.Duration.minutes = function(i) {
        return new DayPilot.Duration(i * 1000*60);
    };

    DayPilot.Duration.seconds = function(i) {
        return new DayPilot.Duration(i * 1000);
    };

    // alias to DayPilot.Duration
    // disabled, doesn't work with caching
    DayPilot.TimeSpan = function() {

        throw "Please use DayPilot.Duration class instead of DayPilot.TimeSpan.";
        // DayPilot.Duration.apply(this, arguments);
    };
    try {
        DayPilot.TimeSpan.prototype = Object.create(DayPilot.Duration.prototype);  // make instanceof work
    }
    catch (e) {}  // doesn't work in IE8

    // DayPilot.TimeSpan.prototype.constructor = DayPilot.TimeSpan;  // not necessary, it's an alias, not an inherited class

    /* Date utils */

    // DayPilot.Date class
    /* Constructor signatures:
     
     -- new DayPilot.Date(date, isLocal)
     date - JavaScript Date object
     isLocal - true if the local time should be taken from date, otherwise GMT base is used
     
     -- new DayPilot.Date() - returns now, using local date
     
     -- new DayPilot.Date(string)
     string - date in ISO 8601 format, e.g. 2009-01-01T00:00:00
     
     */
    DayPilot.Date = function(date, readLocal) {

        if (date instanceof DayPilot.Date) { // it's already a DayPilot.Date object, return it (no copy)
            return date;
        }

        var ticks;

        if (DayPilot.Util.isNullOrUndefined(date)) {  // date not set, use NOW
            ticks = DayPilot.DateUtil.fromLocal().getTime();
            date = ticks;
        }

        var cache = DayPilot.Date.Cache.Ctor;
        if (cache[date]) {
            DayPilot.Stats.cacheHitsCtor += 1;
            return cache[date];
        }

        var isString = false;

        if (typeof date === "string") {
            ticks = DayPilot.DateUtil.fromStringSortable(date, readLocal).getTime();
            isString = true;
        }
        else if (typeof date === "number") {
            if (isNaN(date)) {
                throw "Cannot create DayPilot.Date from NaN";
            }
            ticks = date;
        }
        else if (date instanceof Date) {
            if (readLocal) {
                ticks = DayPilot.DateUtil.fromLocal(date).getTime();
            }
            else {
                ticks = date.getTime();
            }
        }
        else {
            throw "Unrecognized parameter: use Date, number or string in ISO 8601 format";
        }

        var value = ticksToSortable(ticks); // normalized value

        if (cache[value]) {
            return cache[value];
        }

        cache[value] = this;
        cache[ticks] = this;
        if (isString && value !== date  && DayPilot.DateUtil.hasTzSpec(date)) {  // don't cache strings with TZ spec
            cache[date] = this;
        }

        if (Object.defineProperty && !DayPilot.browser.ielt9) {
            Object.defineProperty(this, "ticks", {
                get: function() { return ticks; }
            });
            Object.defineProperty(this, "value", {
                "value": value,
                "writable": false,
                "enumerable": true
            });
        }
        else {
            this.ticks = ticks;
            this.value = value;
        }

        if (DayPilot.Date.Config.legacyShowD) {
            this.d = new Date(ticks);
        }

        DayPilot.Stats.dateObjects += 1;
    };

    DayPilot.Date.Config = {};
    DayPilot.Date.Config.legacyShowD = false;

    DayPilot.Date.Cache = {};
    DayPilot.Date.Cache.Parsing = {};
    DayPilot.Date.Cache.Ctor = {};
    DayPilot.Date.Cache.Ticks = {};
    DayPilot.Date.Cache.DurationCtor = {};

    DayPilot.Date.Cache.clear = function() {
        DayPilot.Date.Cache.Parsing = {};
        DayPilot.Date.Cache.Ctor = {};
        DayPilot.Date.Cache.Ticks = {};
        DayPilot.Date.Cache.DurationCtor = {};
    };


    DayPilot.Date.prototype.addDays = function(days) {
        return new DayPilot.Date(this.ticks + days * 24 * 60 * 60 * 1000);
    };

    DayPilot.Date.prototype.addHours = function(hours) {
        return this.addTime(hours * 60 * 60 * 1000);
    };

    DayPilot.Date.prototype.addMilliseconds = function(millis) {
        return this.addTime(millis);
    };

    DayPilot.Date.prototype.addMinutes = function(minutes) {
        return this.addTime(minutes * 60 * 1000);
    };

    DayPilot.Date.prototype.addMonths = function(months) {

        var date = new Date(this.ticks);
        if (months === 0)
            return this;

        var y = date.getUTCFullYear();
        var m = date.getUTCMonth() + 1;

        if (months > 0) {
            while (months >= 12) {
                months -= 12;
                y++;
            }
            if (months > 12 - m) {
                y++;
                m = months - (12 - m);
            }
            else {
                m += months;
            }
        }
        else {
            while (months <= -12) {
                months += 12;
                y--;
            }
            if (m + months <= 0) {  //
                y--;
                m = 12 + m + months;
            }
            else {
                m = m + months;
            }
        }

        var d = new Date(date.getTime());
        d.setUTCDate(1);
        d.setUTCFullYear(y);
        d.setUTCMonth(m - 1);

        //var max = DayPilot.Date.daysInMonth(y, m);
        var max = new DayPilot.Date(d).daysInMonth();
        d.setUTCDate(Math.min(max, date.getUTCDate()));

        return new DayPilot.Date(d);
    };

    DayPilot.Date.prototype.addSeconds = function(seconds) {
        return this.addTime(seconds * 1000);
    };

    DayPilot.Date.prototype.addTime = function(ticks) {
        if (ticks instanceof DayPilot.Duration) {
            ticks = ticks.ticks;
        }
        return new DayPilot.Date(this.ticks + ticks);
    };

    DayPilot.Date.prototype.addYears = function(years) {
        var original = new Date(this.ticks);
        var d = new Date(this.ticks);
        var y = this.getYear() + years;
        var m = this.getMonth();

        d.setUTCDate(1);
        d.setUTCFullYear(y);
        d.setUTCMonth(m);

        //var max = DayPilot.Date.daysInMonth(y, m + 1);
        var max = new DayPilot.Date(d).daysInMonth();
        d.setUTCDate(Math.min(max, original.getUTCDate()));

        return new DayPilot.Date(d);
    };

    DayPilot.Date.prototype.dayOfWeek = function() {
        return new Date(this.ticks).getUTCDay();
    };
    
    DayPilot.Date.prototype.getDayOfWeek = function() {
        return new Date(this.ticks).getUTCDay();
    };

    DayPilot.Date.prototype.daysInMonth = function() {
        var date = new Date(this.ticks);
        var month = date.getUTCMonth() + 1;
        var year = date.getUTCFullYear();


        var m = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month !== 2)
            return m[month - 1];
        if (year % 4 !== 0)
            return m[1];
        if (year % 100 === 0 && year % 400 !== 0)
            return m[1];
        return m[1] + 1;

    };

    DayPilot.Date.prototype.daysInYear = function() {
        var year = this.getYear();
        if (year % 4 !== 0) {
            return 365;
        }
        if (year % 100 === 0 && year % 400 !== 0) {
            return 365;
        }
        return 366;
    };

    DayPilot.Date.prototype.dayOfYear = function() {
        return Math.ceil((this.getDatePart().getTime() - this.firstDayOfYear().getTime()) / 86400000) + 1;
    };

    // not required, direct comparison can be used
    DayPilot.Date.prototype.equals = function(another) {
        if (another === null) {
            return false;
        }
        if (another instanceof DayPilot.Date) {
            return this === another;
        }
        else {
            throw "The parameter must be a DayPilot.Date object (DayPilot.Date.equals())";
        }
    };

    DayPilot.Date.prototype.firstDayOfMonth = function() {
        //var utc = DayPilot.Date.firstDayOfMonth(this.getYear(), this.getMonth() + 1);
        //return new DayPilot.Date(utc);

        var d = new Date();
        d.setUTCFullYear(this.getYear(), this.getMonth(), 1);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        return new DayPilot.Date(d);

    };

    DayPilot.Date.prototype.firstDayOfYear = function() {
        var year = this.getYear();
        var d = new Date();
        d.setUTCFullYear(year, 0, 1);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        return new DayPilot.Date(d);
    };

    DayPilot.Date.prototype.firstDayOfWeek = function(weekStarts) {
        var d = this;
        if (weekStarts instanceof DayPilot.Locale) {
            weekStarts = weekStarts.weekStarts;
        }
        else if (typeof weekStarts === "string" && DayPilot.Locale.find(weekStarts)) {
            var locale = DayPilot.Locale.find(weekStarts);
            weekStarts = locale.weekStarts;
        }
        else {
            weekStarts = weekStarts || 0;
        }

        var day = d.dayOfWeek();
        while (day !== weekStarts) {
            d = d.addDays(-1);
            day = d.dayOfWeek();
        }
        return new DayPilot.Date(d);
    };

    DayPilot.Date.prototype.getDay = function() {
        return new Date(this.ticks).getUTCDate();
    };

    DayPilot.Date.prototype.getDatePart = function() {
        var d = new Date(this.ticks);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        return new DayPilot.Date(d);
    };

    DayPilot.Date.prototype.getYear = function() {
        return new Date(this.ticks).getUTCFullYear();
    };

    DayPilot.Date.prototype.getHours = function() {
        return new Date(this.ticks).getUTCHours();
    };

    DayPilot.Date.prototype.getMilliseconds = function() {
        return new Date(this.ticks).getUTCMilliseconds();
    };

    DayPilot.Date.prototype.getMinutes = function() {
        return new Date(this.ticks).getUTCMinutes();
    };

    DayPilot.Date.prototype.getMonth = function() {
        return new Date(this.ticks).getUTCMonth();
    };

    DayPilot.Date.prototype.getSeconds = function() {
        return new Date(this.ticks).getUTCSeconds();
    };

    DayPilot.Date.prototype.getTotalTicks = function() {
        return this.getTime();
    };

    // undocumented
    DayPilot.Date.prototype.getTime = function() {
        return this.ticks;
    };

    DayPilot.Date.prototype.getTimePart = function() {
        var datePart = this.getDatePart();
        return DayPilot.DateUtil.diff(this, datePart);
    };

    DayPilot.Date.prototype.lastDayOfMonth = function() {
        //var utc = DayPilot.Date.lastDayOfMonth(this.getYear(), this.getMonth() + 1);
        //return new DayPilot.Date(utc);
        var d = new Date(this.firstDayOfMonth().getTime());
        var length = this.daysInMonth();
        d.setUTCDate(length);
        return new DayPilot.Date(d);
    };

    DayPilot.Date.prototype.weekNumber = function() {
        var first = this.firstDayOfYear();
        var days = (this.getTime() - first.getTime()) / 86400000;
        return Math.ceil((days + first.dayOfWeek() + 1) / 7);
    };

    // ISO 8601
    DayPilot.Date.prototype.weekNumberISO = function() {
        var thursdayFlag = false;
        var dayOfYear = this.dayOfYear();

        var startWeekDayOfYear = this.firstDayOfYear().dayOfWeek();
        var endWeekDayOfYear = this.firstDayOfYear().addYears(1).addDays(-1).dayOfWeek();
        //int startWeekDayOfYear = new DateTime(date.getYear(), 1, 1).getDayOfWeekOrdinal();
        //int endWeekDayOfYear = new DateTime(date.getYear(), 12, 31).getDayOfWeekOrdinal();

        if (startWeekDayOfYear === 0) {
            startWeekDayOfYear = 7;
        }
        if (endWeekDayOfYear === 0) {
            endWeekDayOfYear = 7;
        }

        var daysInFirstWeek = 8 - (startWeekDayOfYear);

        if (startWeekDayOfYear === 4 || endWeekDayOfYear === 4) {
            thursdayFlag = true;
        }

        var fullWeeks = Math.ceil((dayOfYear - (daysInFirstWeek)) / 7.0);

        var weekNumber = fullWeeks;

        if (daysInFirstWeek >= 4) {
            weekNumber = weekNumber + 1;
        }

        if (weekNumber > 52 && !thursdayFlag) {
            weekNumber = 1;
        }

        if (weekNumber === 0) {
            weekNumber = this.firstDayOfYear().addDays(-1).weekNumberISO(); //weekNrISO8601(new DateTime(date.getYear() - 1, 12, 31));
        }

        return weekNumber;

    };

    DayPilot.Date.prototype.toDateLocal = function() {
        var date = new Date(this.ticks);

        var d = new Date();
        d.setFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        d.setHours(date.getUTCHours());
        d.setMinutes(date.getUTCMinutes());
        d.setSeconds(date.getUTCSeconds());
        d.setMilliseconds(date.getUTCMilliseconds());
        return d;

    };

    DayPilot.Date.prototype.toDate = function() {
        return new Date(this.ticks);
    };

    DayPilot.Date.prototype.toJSON = function() {
        return this.value;
    };

    // formatting and languages needed here
    DayPilot.Date.prototype.toString = function(pattern, locale) {
        if (!pattern) {
            return this.toStringSortable();
        }
        return new Pattern(pattern, locale).print(this);
    };

    DayPilot.Date.prototype.toStringSortable = function() {
        return ticksToSortable(this.ticks);
    };

    function ticksToSortable(ticks) {

        var cache = DayPilot.Date.Cache.Ticks;
        if (cache[ticks]) {
            DayPilot.Stats.cacheHitsTicks += 1;
            return cache[ticks];
        }

        var d = new Date(ticks);

        var millisecond;
        var ms = d.getUTCMilliseconds();

        if (ms === 0) {
            millisecond = "";
        }
        else if (ms < 10) {
            millisecond = ".00" + ms;
        }
        else if (ms < 100) {
            millisecond = ".0" + ms;
        }
        else {
            millisecond = "." + ms
        }

        var second = d.getUTCSeconds();
        if (second < 10)
            second = "0" + second;
        var minute = d.getUTCMinutes();
        if (minute < 10)
            minute = "0" + minute;
        var hour = d.getUTCHours();
        if (hour < 10)
            hour = "0" + hour;
        var day = d.getUTCDate();
        if (day < 10)
            day = "0" + day;
        var month = d.getUTCMonth() + 1;
        if (month < 10)
            month = "0" + month;
        var year = d.getUTCFullYear();

        if (year <= 0) {
            throw "The minimum year supported is 1.";
        }
        if (year < 10) {
            year = "000" + year;
        }
        else if (year < 100) {
            year = "00" + year;
        }
        else if (year < 1000) {
            year = "0" + year;
        }

        var result = year + "-" + month + "-" + day + 'T' + hour + ":" + minute + ":" + second + millisecond;
        cache[ticks] = result;
        return result;
    }

    /* static functions, return DayPilot.Date object */

    // returns null if parsing was not successful
    DayPilot.Date.parse = function(str, pattern, locale) {
        var p = new Pattern(pattern, locale);
        return p.parse(str);
    };

    var todayCount = 0;

    DayPilot.Date.today = function() {
        //return new DayPilot.Date().getDatePart();
        return new DayPilot.Date(DayPilot.DateUtil.localToday());
    };

    DayPilot.Date.fromYearMonthDay = function(year, month, day) {
        month = month || 1;
        day = day || 1;

        var d = new Date(0);
        d.setUTCFullYear(year);
        d.setUTCMonth(month - 1);
        d.setUTCDate(day);
        return new DayPilot.Date(d);
    };

    DayPilot.DateUtil = {};

    /* internal functions, all operate with GMT base of the date object
     (except of DayPilot.DateUtil.fromLocal()) */

    DayPilot.DateUtil.fromStringSortable = function(string, readLocal) {
        /*
        Supported formats:
        2015-01-01
        2015-01-01T00:00:00
        2015-01-01T00:00:00.000
        2015-01-01T00:00:00Z
        2015-01-01T00:00:00.000Z
        2015-01-01T00:00:00+01:00
        2015-01-01T00:00:00.000+01:00

         */

        if (!string) {
            throw "Can't create DayPilot.Date from an empty string";
        }

        var len = string.length;
        var date = len === 10;
        var datetime = len === 19;
        var long = len > 19;

        if (!date && !datetime && !long) {
            throw "Invalid string format (use '2010-01-01' or '2010-01-01T00:00:00'): " + string;
        }

        if (DayPilot.Date.Cache.Parsing[string] && !readLocal) {
            DayPilot.Stats.cacheHitsParsing += 1;
            return DayPilot.Date.Cache.Parsing[string];
        }

        var year = string.substring(0, 4);
        var month = string.substring(5, 7);
        var day = string.substring(8, 10);

        var d = new Date(0);
        d.setUTCFullYear(year, month - 1, day);

        if (date) {
            /*
            d.setUTCHours(0);
            d.setUTCMinutes(0);
            d.setUTCSeconds(0);
            d.setUTCMilliseconds(0);
            */
            //result = d;
            DayPilot.Date.Cache.Parsing[string] = d;
            return d;
        }

        var hours = string.substring(11, 13);
        var minutes = string.substring(14, 16);
        var seconds = string.substring(17, 19);

        d.setUTCHours(hours);
        d.setUTCMinutes(minutes);
        d.setUTCSeconds(seconds);
        //d.setUTCMilliseconds(0);
        //result = d;

        if (datetime) {
            DayPilot.Date.Cache.Parsing[string] = d;
            return d;
        }

        var tzdir = string[19];

        var tzoffset = 0;

        if (tzdir === ".") {
            var ms = parseInt(string.substring(20, 23)); /// .000
            d.setUTCMilliseconds(ms);
            tzoffset = DayPilot.DateUtil.getTzOffsetMinutes(string.substring(23));
        }
        else {
            tzoffset = DayPilot.DateUtil.getTzOffsetMinutes(string.substring(19));
        }

        var dd = new DayPilot.Date(d);
        if (!readLocal) {
            dd = dd.addMinutes(-tzoffset);
        }

        d = dd.toDate(); // get UTC base

        DayPilot.Date.Cache.Parsing[string] = d;
        return d;
    };

    DayPilot.DateUtil.getTzOffsetMinutes = function(string) {
        if (DayPilot.Util.isNullOrUndefined(string) || string === "") {
            return 0;
        }
        if (string === "Z") {
            return 0;
        }

        var tzdir = string[0];

        var tzhours = parseInt(string.substring(1, 3));
        var tzminutes = parseInt(string.substring(4));
        var tzoffset = tzhours * 60 + tzminutes;

        if (tzdir === "-") {
            return -tzoffset;
        }
        else if (tzdir === "+") {
            return tzoffset;
        }
        else {
            throw "Invalid timezone spec: " + string;
        }
    };

    DayPilot.DateUtil.hasTzSpec = function(string) {
        if (string.indexOf("+")) {
            return true;
        }
        if (string.indexOf("-")) {
            return true;
        }
        return false;
    };


    // rename candidate: diffDays
    DayPilot.DateUtil.daysDiff = function(first, second) {
        (first && second) || (function() { throw "two parameters required"; })();

        first = new DayPilot.Date(first);
        second = new DayPilot.Date(second);

        if (first.getTime() > second.getTime()) {
            return null;
        }

        var i = 0;
        var fDay = first.getDatePart();
        var sDay = second.getDatePart();

        while (fDay < sDay) {
            fDay = fDay.addDays(1);
            i++;
        }

        return i;
    };

    DayPilot.DateUtil.daysSpan = function(first, second) {
        (first && second) || (function() { throw "two parameters required"; })();

        first = new DayPilot.Date(first);
        second = new DayPilot.Date(second);

        if (first === second) {
            return 0;
        }

        var diff = DayPilot.DateUtil.daysDiff(first, second);

        if (second == second.getDatePart()) {
            diff--;
        }

        return diff;
    };

    DayPilot.DateUtil.diff = function(first, second) { // = first - second
        if (!(first && second && first.getTime && second.getTime)) {
            throw "Both compared objects must be Date objects (DayPilot.Date.diff).";
        }

        return first.getTime() - second.getTime();
    };

    // returns Date object
    DayPilot.DateUtil.fromLocal = function(localDate) {
        if (!localDate) {
            localDate = new Date();
        }

        var d = new Date();
        d.setUTCFullYear(localDate.getFullYear(), localDate.getMonth(), localDate.getDate());
        d.setUTCHours(localDate.getHours());
        d.setUTCMinutes(localDate.getMinutes());
        d.setUTCSeconds(localDate.getSeconds());
        d.setUTCMilliseconds(localDate.getMilliseconds());
        return d;
    };

    DayPilot.DateUtil.localToday = function() {
        var d = new Date();
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        return d;
    };

    // rename candidate: toHourString
    DayPilot.DateUtil.hours = function(date, use12) {

        var minute = date.getUTCMinutes();
        if (minute < 10)
            minute = "0" + minute;


        var hour = date.getUTCHours();
        //if (hour < 10) hour = "0" + hour;

        if (use12) {
            var am = hour < 12;
            var hour = hour % 12;
            if (hour === 0) {
                hour = 12;
            }
            var suffix = am ? "AM" : "PM";
            return hour + ':' + minute + ' ' + suffix;
        }
        else {
            return hour + ':' + minute;
        }
    };

    DayPilot.DateUtil.max = function(first, second) {
        if (first.getTime() > second.getTime()) {
            return first;
        }
        else {
            return second;
        }
    };

    DayPilot.DateUtil.min = function(first, second) {
        if (first.getTime() < second.getTime()) {
            return first;
        }
        else {
            return second;
        }
    };

    var Pattern = function(pattern, locale) {
        if (typeof locale === "string") {
            locale = DayPilot.Locale.find(locale);
        }
        var locale = locale || DayPilot.Locale.US;
        var all = [
            {"seq": "yyyy", "expr": "[0-9]{4,4\u007d", "str": function(d) {
                    return d.getYear();
                }},
            {"seq": "yy", "expr": "[0-9]{2,2\u007d", "str": function(d) {
                return d.getYear() % 100;
            }},
            {"seq": "mm", "expr": "[0-9]{2,2\u007d", "str": function(d) {
                var r = d.getMinutes();
                return r < 10 ? "0" + r : r;
            }},
            {"seq": "m", "expr": "[0-9]{1,2\u007d", "str": function(d) {
                    var r = d.getMinutes();
                    return r;
                }},
            {"seq": "HH", "expr": "[0-9]{2,2\u007d", "str": function(d) {
                var r = d.getHours();
                return r < 10 ? "0" + r : r;
            }},
            {"seq": "H", "expr": "[0-9]{1,2\u007d", "str": function(d) {
                    var r = d.getHours();
                    return r;
                }},
            {"seq": "hh", "expr": "[0-9]{2,2\u007d", "str": function(d) {
                var hour = d.getHours();
                var hour = hour % 12;
                if (hour === 0) {
                    hour = 12;
                }
                var r = hour;
                return r < 10 ? "0" + r : r;
            }},
            {"seq": "h", "expr": "[0-9]{1,2\u007d", "str": function(d) {
                    var hour = d.getHours();
                    var hour = hour % 12;
                    if (hour === 0) {
                        hour = 12;
                    }
                    return hour;
                }},
            {"seq": "ss", "expr": "[0-9]{2,2\u007d", "str": function(d) {
                var r = d.getSeconds();
                return r < 10 ? "0" + r : r;
                }},
            {"seq": "s", "expr": "[0-9]{1,2\u007d", "str": function(d) {
                    var r = d.getSeconds();
                    return r;
                }},
            {"seq": "MMMM", "expr": "[^\\s0-9]*", "str": function(d) {
                var r = locale.monthNames[d.getMonth()];
                return r;
            }, "transform" : function(input) {
                var index = DayPilot.indexOf(locale.monthNames, input, equalsIgnoreCase);
                if (index < 0) {
                    return null;
                }
                return index + 1;
            }},
            {"seq": "MMM", "expr": "[^\\s0-9]*", "str": function(d) {  // \u0073 = 's'
                var r = locale.monthNamesShort[d.getMonth()];
                return r;
            }, "transform" : function(input) {
                var index = DayPilot.indexOf(locale.monthNamesShort, input, equalsIgnoreCase);
                if (index < 0) {
                    return null;
                }
                return index + 1;
            }},
            {"seq": "MM", "expr": "[0-9]{2,2\u007d", "str": function(d) {
                var r = d.getMonth() + 1;
                return r < 10 ? "0" + r : r;
            }},
            {"seq": "M", "expr": "[0-9]{1,2\u007d", "str": function(d) {
                var r = d.getMonth() + 1;
                return r;
            }},
            {"seq": "dddd", "expr": "[^\\s0-9]*", "str": function(d) {
                var r = locale.dayNames[d.getDayOfWeek()];
                return r;
            }},
            {"seq": "ddd", "expr": "[^\\s0-9]*", "str": function(d) {
                var r = locale.dayNamesShort[d.getDayOfWeek()];
                return r;
            }},
            {"seq": "dd", "expr": "[0-9]{2,2\u007d", "str": function(d) {
                var r = d.getDay();
                return r < 10 ? "0" + r : r;
            }},
            {"seq": "%d", "expr": "[0-9]{1,2\u007d", "str": function(d) {
                var r = d.getDay();
                return r;
            }},
            {"seq": "d", "expr": "[0-9]{1,2\u007d", "str": function(d) {
                var r = d.getDay();
                return r;
            }},
            {"seq": "tt", "expr": "(AM|PM|am|pm)", "str": function(d) {
                var hour = d.getHours();
                var am = hour < 12;
                return am ? "AM" : "PM";
            }, "transform" : function(input) {
                return input.toUpperCase();
            }},
        ];

        var escapeRegex = function(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };

        this.init = function() {
            this.year = this.findSequence("yyyy");
            this.month = this.findSequence("MMMM") || this.findSequence("MMM") || this.findSequence("MM") || this.findSequence("M");
            this.day = this.findSequence("dd") || this.findSequence("d");

            this.hours = this.findSequence("HH") || this.findSequence("H");
            this.minutes = this.findSequence("mm") || this.findSequence("m");
            this.seconds = this.findSequence("ss") || this.findSequence("s");

            this.ampm = this.findSequence("tt");
            this.hours12 = this.findSequence("hh") || this.findSequence("h");

            /*if (this.hours && this.ampm) {
                throw new DayPilot.Exception("'HH' and 'H' specifiers cannot be used in combination with 'tt'. Use 12-hour clock specifiers: 'hh' or 'h'.");
            }*/
        };

        this.findSequence = function(seq) {

            function defaultTransform(value) {
                return parseInt(value);
            }

            var index = pattern.indexOf(seq);
            if (index === -1) {
                return null;
            }
            return {
                "findValue": function(input) {
                    var prepared = escapeRegex(pattern);
                    var transform = null;
                    for (var i = 0; i < all.length; i++) {
                        var len = all[i].length;
                        var pick = (seq === all[i].seq);
                        //var expr = "";
                        var expr = all[i].expr;
                        if (pick) {
                            expr = "(" + expr + ")";
                            transform = all[i].transform;
                        }
                        prepared = prepared.replace(all[i].seq, expr);
                    }

                    prepared = "^" + prepared + "$";

                    try {
                        var r = new RegExp(prepared);
                        var array = r.exec(input);
                        if (!array) {
                            return null;
                        }
                        transform = transform || defaultTransform;  // parseInt is the default transform/parse function
                        return transform(array[1]);
                    }
                    catch (e) {
                        throw "unable to create regex from: " + prepared;
                    }
                }
            };
        };

        this.print = function(date) {
            // always recompiles the pattern

            var find = function(t) {
                for (var i = 0; i < all.length; i++) {
                    if (all[i] && all[i].seq === t) {
                        return all[i];
                    }
                }
                return null;
            };

            var eos = pattern.length <= 0;
            var pos = 0;
            var components = [];

            while (!eos) {
                var rem = pattern.substring(pos);
                var matches = /%?(.)\1*/.exec(rem);  // matches a sequence of identical characters, with an optional '%' preceding char
                if (matches && matches.length > 0) {
                    var match = matches[0];
                    var q = find(match);
                    if (q) {
                        components.push(q);
                    }
                    else {
                        components.push(match);
                    }
                    pos += match.length;
                    eos = pattern.length <= pos;
                }
                else {
                    eos = true;
                }
            }

            // resolve placeholders
            for (var i = 0; i < components.length; i++) {
                var c = components[i];
                if (typeof c !== 'string') {
                    components[i] = c.str(date);
                }
            }

            return components.join("");
        };



        this.parse = function(input) {

            var year = this.year.findValue(input);
            if (!year) {
                return null; // unparseable
            }

            var month = this.month.findValue(input);
            if (DayPilot.Util.isNullOrUndefined(month)) {
                return null;
            }
            if (month > 12 || month < 1) {
                return null;
            }
            var day = this.day.findValue(input);

            var daysInMonth = DayPilot.Date.fromYearMonthDay(year, month).daysInMonth();
            if (day < 1 || day > daysInMonth) {
                return null;
            }

            var hours = this.hours ? this.hours.findValue(input) : 0;
            var minutes = this.minutes ? this.minutes.findValue(input) : 0;
            var seconds = this.seconds ? this.seconds.findValue(input) : 0;

            var ampm = this.ampm ? this.ampm.findValue(input): null;

            if (this.ampm && this.hours12) {

                var hours12 = this.hours12.findValue(input);

                if (hours12 < 1 || hours12 > 12) {
                    return null;
                }

                if (ampm === "PM") {
                    if (hours12 === 12) {
                        hours = 12;
                    }
                    else {
                        hours = hours12 + 12;
                    }
                }
                else {
                    if (hours12 === 12) {
                        hours = 0;
                    }
                    else {
                        hours = hours12;
                    }
                }

            }

            if (hours < 0 || hours > 23) {
                return null;
            }

            if (minutes < 0 || minutes > 59) {
                return null;
            }

            if (seconds < 0 || seconds > 59) {
                return null;
            }

            var d = new Date();
            d.setUTCFullYear(year, month - 1, day);
            d.setUTCHours(hours);
            d.setUTCMinutes(minutes);
            d.setUTCSeconds(seconds);
            d.setUTCMilliseconds(0);

            return new DayPilot.Date(d);
        };

        this.init();

    };

    function equalsIgnoreCase(str1, str2) {
        if (DayPilot.Util.isNullOrUndefined(str1)) {
            return false;
        }
        if (DayPilot.Util.isNullOrUndefined(str2)) {
            return false;
        }
        return str1.toLocaleLowerCase() === str2.toLocaleLowerCase();
    }

    DayPilot.Canvas = function(width, height, format, scale, jpegQuality) {
        var scale = scale || 1;

        var canvas = document.createElement("canvas");
        canvas.width = width*scale;
        canvas.height = height*scale;

        var ctx = canvas.getContext("2d");
        ctx.scale(scale, scale);

        this.defaultFileName = "image.png";

        if (format === "image/jpeg") {
            this.defaultFileName = "image.jpg";
            jpegQuality = jpegQuality || 0.92;
        }

        this.fillRect = function(rect, color) {
            ctx.save();

            ctx.strokeStyle = "rgb(0,0,0,0)";
            ctx.fillStyle = color;
            ctx.fillRect(rect.x +.5, rect.y +.5, rect.w - .5, rect.h - .5);
            //ctx.fill();

            ctx.restore();
        };

        this.rect = function(rect, color) {
            ctx.save();

            ctx.strokeStyle = color;
            ctx.beginPath();  // clear the previous path
            ctx.rect(rect.x +.5, rect.y +.5, rect.w - 1, rect.h - 1);
            ctx.stroke();

            ctx.restore();
        };

        this.text = function(rect, text, font, color, halign, padding) {

            if (!text) {
                return;
            }
            if (typeof text === "number") {
                text = "" + text;
            }
            if (typeof text !== "string") {
                throw "String expected, supplied: " + typeof text;
            }

            halign = halign || "left";
            padding = padding || 0;
            color = color || "#000";

            ctx.save();

            var fontHeight = parseInt(font.size);

            // TODO firefox textBaseline bug; guess value that works for small font sizes; try to calculate it using 1.1 em
            var topOffset = DayPilot.browser.ff ? 3 : 0;
            topOffset += fontHeight * 0.2;
            topOffset += DayPilot.browser.chrome ? 1 : 0;
            topOffset += DayPilot.browser.ie ? 1 : 0;

            ctx.rect(rect.x +.5 + padding, rect.y +.5 + padding, rect.w - 1 - padding, rect.h - 1 - padding);
            ctx.clip();

            ctx.fillStyle = color;
            ctx.font = font.style + " " + font.size + " " + font.family;
            ctx.textBaseline = "top";
            //ctx.textBaseline = "bottom";
            //ctx.textBaseline = "alphabetic";
            ctx.textAlign = halign;

            var x = rect.x;
            switch (halign) {
                case "center":
                    x += rect.w/2;
                    break;
                case "right":
                    x += rect.w;
                    break;
            }

            var shift = 0;
            x += shift;

            var lineHeight = parseInt(font.size) * 1.2;
            var hardLines = text.split("\n");

            var lines = [];
            DayPilot.list(hardLines).each(function(text) {
                var autoLines = getLines(ctx, text, rect.w);
                DayPilot.list(autoLines).each(function(al) {
                    lines.push(al);
                });
            });

            var top = rect.y + shift + padding + topOffset;
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                //console.log(line + " at " + top);
                ctx.fillText(line, x + padding, top);
                top += lineHeight;
            }

            ctx.restore();
        };

        function getLines(ctx, text, maxWidth) {
            var words = text.split(" ");
            var lines = [];
            var currentLine = words[0];

            for (var i = 1; i < words.length; i++) {
                var word = words[i];
                var width = ctx.measureText(currentLine + " " + word).width;
                if (width < maxWidth) {
                    currentLine += " " + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        }


        this.line = function(x1, y1, x2, y2, color) {
            ctx.save();

            ctx.lineWidth = 1;
            ctx.strokeStyle = color;

            ctx.beginPath();
            ctx.moveTo(x1 +.5, y1 +.5);
            ctx.lineTo(x2 +.5, y2 +.5);
            ctx.stroke();

            ctx.restore();
        };

        this.image = function(rect, img) {
            if (!img) {
                return;
            }

            if (typeof img === "string") {
                var href = img;
                var img = document.createElement("img");

                if (href.indexOf("data:") !== 0) {
                    img.onload = function() {
                        ctx.save();
                        ctx.drawImage(img, rect.x, rect.y);
                        ctx.restore();
                    };
                    img.src = href;
                    return;
                }
                img.src = href;
            }

            ctx.save();
            ctx.drawImage(img, rect.x, rect.y);
            ctx.restore();

        };

        this.getWidth = function() {
            return canvas.width;
        };

        this.getHeight = function() {
            return canvas.height;
        };

        this.getElement = function() {
            return canvas;
        };

        this.getSource = function() {
            return "<img src='" + canvas.toDataURL(format, jpegQuality) + "' />";
        };

        this.getDataUri = function() {
            //return 'data:application/octet-stream,' + encodeURIComponent(this.getSource());
            return canvas.toDataURL(format, jpegQuality);
        };

        this.getDefaultFileName = function() {
            return this.defaultFileName;
        };

        this.getBlob = function() {
            if (canvas.msToBlob) {
                return canvas.msToBlob();
            }
            //return new Blob([this.getSource(format, jpegQuality)]);
            return DayPilot.Util.dataUriToBlob(this.getDataUri());
        };


    };

    DayPilot.Svg = function(width, height) {
        var ns = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(ns, "svg");

        if (svg.outerHTML) {  // other than ie
            svg.setAttribute("xmlns", ns);
        }

        svg.setAttribute("viewBox", "0 0 " + width + " " + height); // allows auto scaling

/*
        if (width) {
            svg.setAttribute("width", width);
        }
        if (height) {
            svg.setAttribute("height", height);
        }*/


        this.defaultFileName = "image.svg";

        this.fillRect = function(rect, color) {
            var r = document.createElementNS(ns, "rect");
            r.setAttribute('x', rect.x + 0.5);
            r.setAttribute('y', rect.y + 0.5);
            r.setAttribute('width', rect.w - 1);
            r.setAttribute('height', rect.h - 1);
            r.setAttribute('fill', color);
            svg.appendChild(r);
        };

        this.rect = function(rect, color) {
            var r = document.createElementNS(ns, "rect");
            r.setAttribute('x', rect.x + 0.5);
            r.setAttribute('y', rect.y + 0.5);
            r.setAttribute('width', rect.w - 1);
            r.setAttribute('height', rect.h - 1);
            r.setAttribute('stroke', color);
            r.setAttribute("stroke-width", "1");
            r.setAttribute("fill", "transparent");
            svg.appendChild(r);
        };

        this.text = function(rect, text, font, color, halign, padding) {
            if (typeof text === "number") {
                text = "" + text;
            }
            if (typeof text !== "string") {
                throw "String expected";
            }

            var halign = halign || "left";
            var padding = padding || 0;

            var topOffset = 3;  // hardcoded

            var x = rect.x;
            var anchor = "start";
            switch (halign) {
                case "center":
                    x += rect.w/2;
                    anchor = "middle";
                    break;
                case "right":
                    x += rect.w;
                    anchor = "end";
                    break;
            }

            var clip = document.createElementNS(ns, "clipPath");
            clip.id = "clip" + DayPilot.guid();
            var r = document.createElementNS(ns, "rect");
            r.setAttribute('x', rect.x);
            r.setAttribute('y', rect.y);
            r.setAttribute('width', rect.w);
            r.setAttribute('height', rect.h);
            clip.appendChild(r);
            svg.appendChild(clip);

            var lineHeight = parseInt(font.size) * 1.2;
            var lines = text.split("\n");

            var top = rect.y + padding + topOffset;
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                printLine(line, x + padding, top);
                top += lineHeight;
            }

            function printLine(text, x, y) {
                var txt = document.createElementNS(ns, "text");
                txt.setAttribute("fill", color);
                txt.setAttribute("font-family", font.family);
                txt.setAttribute("font-size", font.size);
                txt.setAttribute("font-style", font.style);
                txt.setAttribute("x", x);
                txt.setAttribute("y", y);
                txt.setAttribute("dy", "1em");
                txt.setAttribute("text-anchor", anchor);
                txt.setAttribute("clip-path", "url(#" + clip.id + ")");
                var inner = document.createTextNode(text);
                txt.appendChild(inner);

                svg.appendChild(txt);
            }

        };

        this.line = function(x1, y1, x2, y2, color) {
            var line = document.createElementNS(ns, "line");
            line.setAttribute("x1", x1 + 0.5);
            line.setAttribute("y1", y1 + 0.5);
            line.setAttribute("x2", x2 + 0.5);
            line.setAttribute("y2", y2 + 0.5);
            line.setAttribute("stroke", color);
            svg.appendChild(line);

        };

        // careful, it's asynchronous
        this.image = function(rect, img) {

            function doit(args) {
                var xlink = 'http://www.w3.org/1999/xlink';

                var image = document.createElementNS(ns, "image");
                image.setAttributeNS(xlink, "href", args.dataUri);
/*
                image.setAttribute("x", rect.x + 0.5);
                image.setAttribute("y", rect.y + 0.5);
*/
                image.setAttribute("x", rect.x);
                image.setAttribute("y", rect.y);
                image.setAttribute("width", rect.w);
                image.setAttribute("height", rect.h);
                svg.appendChild(image);
            }

            getDataUri(img, doit);
        };

        function getDataUri(img, finished) {
            var href = null;
            if (!img) {  // no image specified
                return;
            }
            if (typeof img === "string") {
                if (img.indexOf("data:") === 0) {
                    var args = {};
                    args.dataUri = img;
                    finished(args);
                }
                href = img;
            }
            else {
                href = img.src;
            }
            var img = document.createElement("img");
            img.onload = function() {
                var canvas = document.createElement("canvas");
                canvas.width = this.naturalWidth;
                canvas.height = this.naturalHeight;
                canvas.getContext("2d").drawImage(this, 0, 0);

                var args = {};
                args.dataUri = canvas.toDataURL('image/png');
                finished(args);
            };
            img.src = href;
            /*
            if (img.complete || img.readyState === 4 ) {
                console.log("complete");
            }*/
        }

        this.getWidth = function() {
            return width;
        };

        this.getHeight = function() {
            return height;
        };

        this.getElement = function() {
            return svg;
        };

        this.getSource = function() {
            if (svg.outerHTML) {
                return svg.outerHTML;
            }
            else {
                var div = document.createElement('div');
                var clone = svg.cloneNode(true);
                div.appendChild(clone);
                return div.innerHTML;
            }
        };

        this.getDataUri = function() {
            return 'data:application/octet-stream,' + encodeURIComponent(this.getSource());
        };

        this.getDefaultFileName = function() {
            return this.defaultFileName;
        };

        this.getBlob = function() {
            return new Blob([this.getSource()]);
        };

    };

    DayPilot.Excel = function() {
        var excel = this;

        var doc = null;
        var styles = null;
        var styleDefault = null;

        var ns = {};
        ns.xmlns = 'urn:schemas-microsoft-com:office:spreadsheet';
        ns.o = "urn:schemas-microsoft-com:office:office";
        ns.x = "urn:schemas-microsoft-com:office:excel";
        ns.ss = "urn:schemas-microsoft-com:office:spreadsheet";
        ns.html = "http://www.w3.org/TR/REC-html40";

        this.init = function() {
            doc = document.implementation.createDocument (ns.xmlns, 'Workbook', null);
            doc.documentElement.setAttribute("xmlns:o", ns.o);
            doc.documentElement.setAttribute("xmlns:x", ns.x);
            doc.documentElement.setAttribute("xmlns:ss", ns.ss);
            doc.documentElement.setAttribute("xmlns:html", ns.html);

            var excelWorkbook = doc.createElement("x:ExcelWorkbook");
            doc.documentElement.appendChild(excelWorkbook);

            styles = doc.createElement("ss:Styles");
            doc.documentElement.appendChild(styles);

            styleDefault = excel.styles.create();
            styleDefault.setId("Default");
            styleDefault.setName("Normal");

        };

        this.worksheets = [];
        this.worksheets.create = function(name) {
            var element = excel.el(ns.ss, "Worksheet");
            var ws = new Worksheet(element);
            ws.setName(name);
            this.push(ws);
            return ws;
        };

        this.styles = [];
        this.styles.create = function(options) {
            var style = doc.createElement("ss:Style");
            styles.appendChild(style);
            var s = new Style(style);
            this.push(s);
            return s;
        };

        this.styles.getDefault = function() {
            return styleDefault;
        };

        this.el = function(ns, element) {
            var e = doc.createElementNS(ns, element);
            doc.documentElement.appendChild(e);
            return e;
        };

        this.getSource = function() {
            var serializer = new XMLSerializer();
            var xmlString = serializer.serializeToString(doc);

            return "<?xml version=\"1.0\"?>" + xmlString;
        };

        this.getDataUri = function() {
            return 'data:application/vnd.ms-excel,' + encodeURIComponent(this.getSource());
        };

        this.getElement = function() {
            return doc;
        };

        this.getDefaultFileName = function() {
            return "spreadsheet.xls";
        };

        this.getBlob = function() {
            return new Blob([this.getSource()]);
        };

        var Worksheet = function(element) {

            var table = doc.createElement("Table");
            element.appendChild(table);

            var options = doc.createElement("x:WorksheetOptions");
            element.appendChild(options);

            this.rows = [];

            this.setName = function(name) {
                element.setAttribute("ss:Name", name);
            };

            this.cell = function(x, y) {
                // make sure it exists
                while (y >= this.rows.length) {
                    var row = doc.createElement("Row");
                    table.appendChild(row);
                    this.rows.push(new Row(row));
                }

                var r = this.rows[y];
                return r.cell(x);

            };

            this.enableGridlines = function(value) {

                var existing = DayPilot.list(options.childNodes).find(function(node) {
                    return node.tagName === "x:DoNotDisplayGridlines";
                });

                if (!existing && !value) {
                    var donot = doc.createElement("x:DoNotDisplayGridlines");
                    options.appendChild(donot);
                }

                if (existing && value) {
                    options.removeChild(existing);
                }
            };


            var Row = function(element) {

                this.cells = [];

                this.getElement = function() {
                    return element;
                };

                this.cell = function(x) {
                    while (x >= this.cells.length) {
                        var cell = doc.createElement("Cell");
                        element.appendChild(cell);
                        this.cells.push(new Cell(cell));
                    }

                    return this.cells[x];
                };

                var Cell = function(element) {
                    this.setText = function(text) {
                        var data = doc.createElement("Data");
                        data.setAttribute("ss:Type", "String");
                        var inner = doc.createTextNode(text);
                        data.appendChild(inner);
                        while (element.firstChild) {
                            element.removeChild(element.firstChild);
                        }
                        element.appendChild(data);
                        return this;
                    };

                    this.setColspan = function(i) {
                        //  ss:MergeAcross="1"
                        if (i > 1) {
                            element.setAttribute("ss:MergeAcross", i - 1);
                        }
                        else {
                            element.removeAttribute("ss:MergeAcross");
                        }

                        return this;
                    };

                    this.setRowspan = function(i) {
                        if (i > 1) {
                            element.setAttribute("ss:MergeDown", i - 1);
                        }
                        else {
                            element.removeAttribute("ss:MergeDown");
                        }

                        return this;
                    };

                    this.setStyle = function(style) {
                        if (!(style instanceof Style)) {
                            throw "Invalid argument, Style expected";
                        }
                        element.setAttribute("ss:StyleID", style.getId());
                        return this;
                    }
                };
            };
        };

        var Style = function(element) {

            var id = DayPilot.guid();
            element.setAttribute("ss:ID", id);

            var alignment = doc.createElement("ss:Alignment");
            element.appendChild(alignment);

            var interior = doc.createElement("ss:Interior");
            element.appendChild(interior);

            var borders = doc.createElement("ss:Borders");
            element.appendChild(borders);

            /***
             * Horizontal alignment
             * @param value "Automatic" | "Left" | "Center" | "Right"
             */
            this.setHorizontalAlignment = function(value) {
                alignment.setAttribute("ss:Horizontal", value);
            };

            /**
             * Vertical alignment
             * @param value "Automatic" | "Top" | "Bottom" | "Center"
             */
            this.setVerticalAlignment = function(value) {
                alignment.setAttribute("ss:Vertical", value);
            };

            this.setBackColor = function(value) {
                var normalized = DayPilot.Util.normalizeColor(value);
                interior.setAttribute("ss:Color", normalized);
                interior.setAttribute("ss:Pattern", "Solid");
            };

            this.setBorderColor = function(color) {

                this.clearBorders();

                var borderLeft = createBorder("Left", color);
                borders.appendChild(borderLeft);

                var borderRight = createBorder("Right", color);
                borders.appendChild(borderRight);

                var borderTop = createBorder("Top", color);
                borders.appendChild(borderTop);

                var borderBottom = createBorder("Bottom", color);
                borders.appendChild(borderBottom);

                function createBorder(position, color) {
                    var border = doc.createElement("ss:Border");
                    border.setAttribute("ss:Position", position);
                    border.setAttribute("ss:LineStyle", "Continuous");
                    border.setAttribute("ss:Color", DayPilot.Util.normalizeColor(color));
                    return border;
                }
            };

            this.clearBorders = function() {
                while(borders.firstChild) {
                    borders.removeChild(borders.firstChild);
                }
            };

            this.getId = function() {
                return id;
            };

            this.setId = function(value) {
                id = value;
                element.setAttribute("ss:ID", id);
            };

            this.setName = function(value) {
                element.setAttribute("ss:Name", value);
            };
        };

        this.init();

    };

    DayPilot.Export = function(board) {
        this.toElement = function() {
            return board.getElement();
        };

        this.dimensions = function() {
            return {
                "width": board.getWidth(),
                "height": board.getHeight()
            };
        };

        this.toHtml = function() {
            return board.getSource();
        };

        this.toDataUri = function() {
            return board.getDataUri();
        };

        this.toBlob = function() {
            return board.getBlob();
        };

        this.print = function(options) {
            options = options || {};
            options.orientation = options.orientation || "portrait";

            var iframe = document.createElement("iframe");
            iframe.setAttribute("width", 0);
            iframe.setAttribute("height", 0);
            iframe.setAttribute("frameborder", 0);
            iframe.setAttribute("src", "about:blank");

            //var ibody = doc.compatMode === 'BackCompat' ? doc.body : doc.documentElement;

            iframe.onload = function() {

                var doc = iframe.contentWindow.document;
                doc.body.appendChild(board.getElement());

                if (options.orientation === "landscape") {
                    var sheet = DayPilot.sheet(doc);
                    sheet.add("@page", "size: landscape;");
                    // sheet.add("body", "width: 276mm; height: 190mm; margin: 0; padding: 0; transform: rotate(270deg) translate(-276mm, 0); transform-origin: 0 0;");
                    sheet.commit();
                }

                var result = iframe.contentWindow.document.execCommand('print', false, null);

                if (!result) {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                }

                setTimeout(function() {
                    document.body.removeChild(iframe);
                }, 10);

            };

            document.body.appendChild(iframe);

            // ibody.innerHTML = board.getSource();
            // console.log(ibody.innerHTML);
//            ibody.appendChild(board.getElement());


        };

        // ie only 10+
        this.download = function(name) {
            var name = name || board.getDefaultFileName();
            var blob = board.getBlob();
            DayPilot.Util.downloadBlob(blob, name);

        };
    };


    DayPilot.Exception = function(msg) {
        return new Error(msg);
    };

    DayPilot.Locale = function(id, config) {
        this.id = id;
        this.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        this.dayNamesShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.monthNamesShort  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        this.datePattern = "M/d/yyyy";
        this.timePattern = "H:mm";
        this.dateTimePattern = "M/d/yyyy H:mm";
        this.timeFormat = "Clock12Hours";
        this.weekStarts = 0; // Sunday

        if (config) {
            for (var name in config) {
                this[name] = config[name];
            }
        }
    };

    DayPilot.Locale.all = {};

    DayPilot.Locale.find = function(id) {
        if (!id) {
            return null;
        }
        var normalized = id.toLowerCase();
        if (normalized.length > 2) {
            normalized = DayPilot.Util.replaceCharAt(normalized, 2, '-');
        }
        return DayPilot.Locale.all[normalized];
    };
    
    DayPilot.Locale.register = function(locale) {
        DayPilot.Locale.all[locale.id] = locale;
    };

    DayPilot.Locale.register(new DayPilot.Locale('ca-es', {'dayNames':['diumenge','dilluns','dimarts','dimecres','dijous','divendres','dissabte'],'dayNamesShort':['dg','dl','dt','dc','dj','dv','ds'],'monthNames':['gener','febrer','març','abril','maig','juny','juliol','agost','setembre','octubre','novembre','desembre',''],'monthNamesShort':['gen.','febr.','març','abr.','maig','juny','jul.','ag.','set.','oct.','nov.','des.',''],'timePattern':'H:mm','datePattern':'dd/MM/yyyy','dateTimePattern':'dd/MM/yyyy H:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('cs-cz', {'dayNames':['neděle','pondělí','úterý','středa','čtvrtek','pátek','sobota'],'dayNamesShort':['ne','po','út','st','čt','pá','so'],'monthNames':['leden','únor','březen','duben','květen','červen','červenec','srpen','září','říjen','listopad','prosinec',''],'monthNamesShort':['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII',''],'timePattern':'H:mm','datePattern':'d. M. yyyy','dateTimePattern':'d. M. yyyy H:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('da-dk', {'dayNames':['søndag','mandag','tirsdag','onsdag','torsdag','fredag','lørdag'],'dayNamesShort':['sø','ma','ti','on','to','fr','lø'],'monthNames':['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december',''],'monthNamesShort':['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec',''],'timePattern':'HH:mm','datePattern':'dd-MM-yyyy','dateTimePattern':'dd-MM-yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('de-at', {'dayNames':['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],'dayNamesShort':['So','Mo','Di','Mi','Do','Fr','Sa'],'monthNames':['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember',''],'monthNamesShort':['Jän','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez',''],'timePattern':'HH:mm','datePattern':'dd.MM.yyyy','dateTimePattern':'dd.MM.yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('de-ch', {'dayNames':['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],'dayNamesShort':['So','Mo','Di','Mi','Do','Fr','Sa'],'monthNames':['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember',''],'monthNamesShort':['Jan','Feb','Mrz','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez',''],'timePattern':'HH:mm','datePattern':'dd.MM.yyyy','dateTimePattern':'dd.MM.yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('de-de', {'dayNames':['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],'dayNamesShort':['So','Mo','Di','Mi','Do','Fr','Sa'],'monthNames':['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember',''],'monthNamesShort':['Jan','Feb','Mrz','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez',''],'timePattern':'HH:mm','datePattern':'dd.MM.yyyy','dateTimePattern':'dd.MM.yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('de-lu', {'dayNames':['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],'dayNamesShort':['So','Mo','Di','Mi','Do','Fr','Sa'],'monthNames':['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember',''],'monthNamesShort':['Jan','Feb','Mrz','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez',''],'timePattern':'HH:mm','datePattern':'dd.MM.yyyy','dateTimePattern':'dd.MM.yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('en-au', {'dayNames':['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],'dayNamesShort':['Su','Mo','Tu','We','Th','Fr','Sa'],'monthNames':['January','February','March','April','May','June','July','August','September','October','November','December',''],'monthNamesShort':['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',''],'timePattern':'h:mm tt','datePattern':'d/MM/yyyy','dateTimePattern':'d/MM/yyyy h:mm tt','timeFormat':'Clock12Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('en-ca', {'dayNames':['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],'dayNamesShort':['Su','Mo','Tu','We','Th','Fr','Sa'],'monthNames':['January','February','March','April','May','June','July','August','September','October','November','December',''],'monthNamesShort':['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',''],'timePattern':'h:mm tt','datePattern':'yyyy-MM-dd','dateTimePattern':'yyyy-MM-dd h:mm tt','timeFormat':'Clock12Hours','weekStarts':0}));
    DayPilot.Locale.register(new DayPilot.Locale('en-gb', {'dayNames':['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],'dayNamesShort':['Su','Mo','Tu','We','Th','Fr','Sa'],'monthNames':['January','February','March','April','May','June','July','August','September','October','November','December',''],'monthNamesShort':['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',''],'timePattern':'HH:mm','datePattern':'dd/MM/yyyy','dateTimePattern':'dd/MM/yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('en-us', {'dayNames':['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],'dayNamesShort':['Su','Mo','Tu','We','Th','Fr','Sa'],'monthNames':['January','February','March','April','May','June','July','August','September','October','November','December',''],'monthNamesShort':['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',''],'timePattern':'h:mm tt','datePattern':'M/d/yyyy','dateTimePattern':'M/d/yyyy h:mm tt','timeFormat':'Clock12Hours','weekStarts':0}));
    DayPilot.Locale.register(new DayPilot.Locale('es-es', {'dayNames':['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],'dayNamesShort':['D','L','M','X','J','V','S'],'monthNames':['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre',''],'monthNamesShort':['ene.','feb.','mar.','abr.','may.','jun.','jul.','ago.','sep.','oct.','nov.','dic.',''],'timePattern':'H:mm','datePattern':'dd/MM/yyyy','dateTimePattern':'dd/MM/yyyy H:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('es-mx', {'dayNames':['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],'dayNamesShort':['do.','lu.','ma.','mi.','ju.','vi.','sá.'],'monthNames':['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre',''],'monthNamesShort':['ene.','feb.','mar.','abr.','may.','jun.','jul.','ago.','sep.','oct.','nov.','dic.',''],'timePattern':'hh:mm tt','datePattern':'dd/MM/yyyy','dateTimePattern':'dd/MM/yyyy hh:mm tt','timeFormat':'Clock12Hours','weekStarts':0}));
    DayPilot.Locale.register(new DayPilot.Locale('eu-es', {'dayNames':['igandea','astelehena','asteartea','asteazkena','osteguna','ostirala','larunbata'],'dayNamesShort':['ig','al','as','az','og','or','lr'],'monthNames':['urtarrila','otsaila','martxoa','apirila','maiatza','ekaina','uztaila','abuztua','iraila','urria','azaroa','abendua',''],'monthNamesShort':['urt.','ots.','mar.','api.','mai.','eka.','uzt.','abu.','ira.','urr.','aza.','abe.',''],'timePattern':'H:mm','datePattern':'yyyy/MM/dd','dateTimePattern':'yyyy/MM/dd H:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('fi-fi', {'dayNames':['sunnuntai','maanantai','tiistai','keskiviikko','torstai','perjantai','lauantai'],'dayNamesShort':['su','ma','ti','ke','to','pe','la'],'monthNames':['tammikuu','helmikuu','maaliskuu','huhtikuu','toukokuu','kesäkuu','heinäkuu','elokuu','syyskuu','lokakuu','marraskuu','joulukuu',''],'monthNamesShort':['tammi','helmi','maalis','huhti','touko','kesä','heinä','elo','syys','loka','marras','joulu',''],'timePattern':'H:mm','datePattern':'d.M.yyyy','dateTimePattern':'d.M.yyyy H:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('fr-be', {'dayNames':['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],'dayNamesShort':['di','lu','ma','me','je','ve','sa'],'monthNames':['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre',''],'monthNamesShort':['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.',''],'timePattern':'HH:mm','datePattern':'dd-MM-yy','dateTimePattern':'dd-MM-yy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('fr-ca', {'dayNames':['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],'dayNamesShort':['di','lu','ma','me','je','ve','sa'],'monthNames':['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre',''],'monthNamesShort':['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.',''],'timePattern':'HH:mm','datePattern':'yyyy-MM-dd','dateTimePattern':'yyyy-MM-dd HH:mm','timeFormat':'Clock24Hours','weekStarts':0}));
    DayPilot.Locale.register(new DayPilot.Locale('fr-ch', {'dayNames':['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],'dayNamesShort':['di','lu','ma','me','je','ve','sa'],'monthNames':['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre',''],'monthNamesShort':['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.',''],'timePattern':'HH:mm','datePattern':'dd.MM.yyyy','dateTimePattern':'dd.MM.yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('fr-fr', {'dayNames':['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],'dayNamesShort':['di','lu','ma','me','je','ve','sa'],'monthNames':['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre',''],'monthNamesShort':['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.',''],'timePattern':'HH:mm','datePattern':'dd/MM/yyyy','dateTimePattern':'dd/MM/yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('fr-lu', {'dayNames':['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],'dayNamesShort':['di','lu','ma','me','je','ve','sa'],'monthNames':['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre',''],'monthNamesShort':['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.',''],'timePattern':'HH:mm','datePattern':'dd/MM/yyyy','dateTimePattern':'dd/MM/yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('gl-es', {'dayNames':['domingo','luns','martes','mércores','xoves','venres','sábado'],'dayNamesShort':['do','lu','ma','mé','xo','ve','sá'],'monthNames':['xaneiro','febreiro','marzo','abril','maio','xuño','xullo','agosto','setembro','outubro','novembro','decembro',''],'monthNamesShort':['xan','feb','mar','abr','maio','xuño','xul','ago','set','out','nov','dec',''],'timePattern':'H:mm','datePattern':'dd/MM/yyyy','dateTimePattern':'dd/MM/yyyy H:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('it-it', {'dayNames':['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'],'dayNamesShort':['do','lu','ma','me','gi','ve','sa'],'monthNames':['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre',''],'monthNamesShort':['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic',''],'timePattern':'HH:mm','datePattern':'dd/MM/yyyy','dateTimePattern':'dd/MM/yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('it-ch', {'dayNames':['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'],'dayNamesShort':['do','lu','ma','me','gi','ve','sa'],'monthNames':['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre',''],'monthNamesShort':['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic',''],'timePattern':'HH:mm','datePattern':'dd.MM.yyyy','dateTimePattern':'dd.MM.yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('ja-jp', {'dayNames':['日曜日','月曜日','火曜日','水曜日','木曜日','金曜日','土曜日'],'dayNamesShort':['日','月','火','水','木','金','土'],'monthNames':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月',''],'monthNamesShort':['1','2','3','4','5','6','7','8','9','10','11','12',''],'timePattern':'H:mm','datePattern':'yyyy/MM/dd','dateTimePattern':'yyyy/MM/dd H:mm','timeFormat':'Clock24Hours','weekStarts':0}));
    DayPilot.Locale.register(new DayPilot.Locale('nb-no', {'dayNames':['søndag','mandag','tirsdag','onsdag','torsdag','fredag','lørdag'],'dayNamesShort':['sø','ma','ti','on','to','fr','lø'],'monthNames':['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember',''],'monthNamesShort':['jan','feb','mar','apr','mai','jun','jul','aug','sep','okt','nov','des',''],'timePattern':'HH:mm','datePattern':'dd.MM.yyyy','dateTimePattern':'dd.MM.yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('nl-nl', {'dayNames':['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'],'dayNamesShort':['zo','ma','di','wo','do','vr','za'],'monthNames':['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december',''],'monthNamesShort':['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec',''],'timePattern':'HH:mm','datePattern':'d-M-yyyy','dateTimePattern':'d-M-yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('nl-be', {'dayNames':['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'],'dayNamesShort':['zo','ma','di','wo','do','vr','za'],'monthNames':['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december',''],'monthNamesShort':['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec',''],'timePattern':'H:mm','datePattern':'d/MM/yyyy','dateTimePattern':'d/MM/yyyy H:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('nn-no', {'dayNames':['søndag','måndag','tysdag','onsdag','torsdag','fredag','laurdag'],'dayNamesShort':['sø','må','ty','on','to','fr','la'],'monthNames':['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember',''],'monthNamesShort':['jan','feb','mar','apr','mai','jun','jul','aug','sep','okt','nov','des',''],'timePattern':'HH:mm','datePattern':'dd.MM.yyyy','dateTimePattern':'dd.MM.yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('pt-br', {'dayNames':['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'],'dayNamesShort':['D','S','T','Q','Q','S','S'],'monthNames':['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro',''],'monthNamesShort':['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez',''],'timePattern':'HH:mm','datePattern':'dd/MM/yyyy','dateTimePattern':'dd/MM/yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':0}));
    DayPilot.Locale.register(new DayPilot.Locale('pl-pl', {'dayNames':['niedziela','poniedziałek','wtorek','środa','czwartek','piątek','sobota'],'dayNamesShort':['N','Pn','Wt','Śr','Cz','Pt','So'],'monthNames':['styczeń','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpień','wrzesień','październik','listopad','grudzień',''],'monthNamesShort':['sty','lut','mar','kwi','maj','cze','lip','sie','wrz','paź','lis','gru',''],'timePattern':'HH:mm','datePattern':'yyyy-MM-dd','dateTimePattern':'yyyy-MM-dd HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('pt-pt', {'dayNames':['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'],'dayNamesShort':['D','S','T','Q','Q','S','S'],'monthNames':['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro',''],'monthNamesShort':['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez',''],'timePattern':'HH:mm','datePattern':'dd/MM/yyyy','dateTimePattern':'dd/MM/yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':0}));
    DayPilot.Locale.register(new DayPilot.Locale('ro-ro', {'dayNames':['duminică','luni','marți','miercuri','joi','vineri','sâmbătă'],'dayNamesShort':['D','L','Ma','Mi','J','V','S'],'monthNames':['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie',''],'monthNamesShort':['ian.','feb.','mar.','apr.','mai.','iun.','iul.','aug.','sep.','oct.','nov.','dec.',''],'timePattern':'H:mm','datePattern':'dd.MM.yyyy','dateTimePattern':'dd.MM.yyyy H:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('ru-ru', {'dayNames':['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],'dayNamesShort':['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],'monthNames':['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',''],'monthNamesShort':['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек',''],'timePattern':'H:mm','datePattern':'dd.MM.yyyy','dateTimePattern':'dd.MM.yyyy H:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('sk-sk', {'dayNames':['nedeľa','pondelok','utorok','streda','štvrtok','piatok','sobota'],'dayNamesShort':['ne','po','ut','st','št','pi','so'],'monthNames':['január','február','marec','apríl','máj','jún','júl','august','september','október','november','december',''],'monthNamesShort':['1','2','3','4','5','6','7','8','9','10','11','12',''],'timePattern':'H:mm','datePattern':'d.M.yyyy','dateTimePattern':'d.M.yyyy H:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('sv-se', {'dayNames':['söndag','måndag','tisdag','onsdag','torsdag','fredag','lördag'],'dayNamesShort':['sö','må','ti','on','to','fr','lö'],'monthNames':['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december',''],'monthNamesShort':['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec',''],'timePattern':'HH:mm','datePattern':'yyyy-MM-dd','dateTimePattern':'yyyy-MM-dd HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('tr-tr', {'dayNames':['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],'dayNamesShort':['Pz','Pt','Sa','Ça','Pe','Cu','Ct'],'monthNames':['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık',''],'monthNamesShort':['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara',''],'timePattern':'HH:mm','datePattern':'d.M.yyyy','dateTimePattern':'d.M.yyyy HH:mm','timeFormat':'Clock24Hours','weekStarts':1}));
    DayPilot.Locale.register(new DayPilot.Locale('zh-cn', {'dayNames':['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],'dayNamesShort':['日','一','二','三','四','五','六'],'monthNames':['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月',''],'monthNamesShort':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月',''],'timePattern':'H:mm','datePattern':'yyyy/M/d','dateTimePattern':'yyyy/M/d H:mm','timeFormat':'Clock24Hours','weekStarts':1}));

    DayPilot.Locale.US = DayPilot.Locale.find("en-us");

    DayPilot.Switcher = function(options) {

        var This = this;

        this.views = [];
        this.triggers = [];
        this.navigator = {};
        
        this.selectedClass = null;

        this.active = null;

        this.day = DayPilot.Date.today();

        this.onChange = null;
        this.onChanged = null;

        this.navigator.updateMode = function (mode) {
            var control = This.navigator.control;
            if (!control) {
                return;
            }
            control.selectMode = mode;
            control.select(This.day);
        };

        this.addView = function (spec, options) {
            var element;
            if (typeof spec === 'string') {
                element = document.getElementById(spec);
                if (!element) {
                	throw "Element not found: " + spec;
                }
            }
            else {  // DayPilot object, DOM element
                element = spec;
            }
            
            var control = element;

            var view = {};
            view.isView = true;
            view.id = control.id;
            view.control = control;
            view.options = options || {};
            view.hide = function () {
                if (control.hide) {
                    control.hide();
                }
                else if (control.nav && control.nav.top) {
                    control.nav.top.style.display = 'none';
                }
                else {
                    control.style.display = 'none';
                }
            };
            view.sendNavigate = function(date) {
                var serverBased = (function() {
                    if (control.backendUrl) {  // ASP.NET MVC, Java
                        return true;
                    }
                    if (typeof WebForm_DoCallback === 'function' && control.uniqueID) {  // ASP.NET WebForms
                        return true;
                    }
                    return false;
                })();
                if (serverBased) {
                    if (control.commandCallBack) {
                        control.commandCallBack("navigate", { "day": date });
                    }
                }
                else {
                    control.startDate = date;
                    control.update();
                }
            };
            view.show = function () {
                This._hideViews();
                if (control.show) {
                    control.show();
                }
                else if (control.nav && control.nav.top) {
                    control.nav.top.style.display = '';
                }
                else {
                    control.style.display = '';
                }
            };
            view.selectMode = function () { // for navigator
                if (view.options.navigatorSelectMode) {
                    return view.options.navigatorSelectMode;
                }
                    
                if (control.isCalendar) {
                    switch (control.viewType) {
                        case "Day":
                            return "day";
                        case "Week":
                            return "week";
                        case "WorkWeek":
                            return "week";
                        default:
                            return "day";
                    }
                }
                else if (control.isMonth) {
                    switch (control.viewType) {
                        case "Month":
                            return "month";
                        case "Weeks":
                            return "week";
                        default:
                            return "day";
                    }
                }
                return "day";
            };

            this.views.push(view);
            
            return view;
        };

        this.addTrigger = function (id, control) {
            var element;
            if (typeof id === 'string') {
                element = document.getElementById(id);
                if (!element) {
                	throw "Element not found: " + id;
                }
            }
            else {
                element = id;
            }

            var view = this._findViewByControl(control);
            if (!view) {
                view = this.addView(control);
            }

            var trigger = {};
            trigger.isTrigger = true;
            trigger.element = element;
            trigger.id = element.id;
            trigger.view = view;
            trigger.onClick = function (ev) {

                This.show(trigger);
                This._select(trigger);

                ev = ev || window.event;
                if (ev) {
                    ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                }
                
            };

            DayPilot.re(element, 'click', trigger.onClick);
            
            this.triggers.push(trigger);
            
            return trigger;
        };

        // backwards compatibility
        this.addButton = this.addTrigger;

        this.select = function(id) {
            var trigger = this._findTriggerById(id);
            if (trigger) {
                trigger.onClick();
            }
            else if (this.triggers.length > 0) {
                this.triggers[0].onClick();
            }
        };
        
        this._findTriggerById = function(id) {
            for (var i = 0; i < this.triggers.length; i++) {
                var trigger = this.triggers[i];
                if (trigger.id === id) {
                    return trigger;
                }
            }
            return null;
        };
        
        this._select = function(trigger) {
            if (!this.selectedClass) {
                return;
            }
            
            for (var i = 0; i < this.triggers.length; i++) {
                var s = this.triggers[i];
                DayPilot.Util.removeClass(s.element, this.selectedClass);
            }
            DayPilot.Util.addClass(trigger.element, this.selectedClass);
        };

        this.addNavigator = function (control) {
            //this.navigator = {};
            This.navigator.control = control;

            control.timeRangeSelectedHandling = "JavaScript";
            control.onTimeRangeSelected = function() {
                var start, end, day;
                if (control.api === 1) {
                    start = arguments[0];
                    end = arguments[1];
                    day = arguments[2];
                }
                else {
                    var args = arguments[0];
                    start = args.start;
                    end = args.end;
                    day = args.day;
                }
                This.day = day;

                navigate(start, end, day);

            };
        };

        this.show = function (el) {
            var view, trigger;
            if (el.isTrigger) {
                trigger = el;
                view = trigger.view;
            }
            else {
                view = el.isView ? el : this._findViewByControl(el);
                if (this.active === view) {
                    return;
                }
            }
            
            if (This.onSelect) {
                var args = {};
                args.source = trigger ? trigger.element : null;
                args.target = view.control;
                
                This.onSelect(args);
                // TODO add preventDefault
            }
            
            this.active = view;
            view.show();

            var mode = view.selectMode();
            This.navigator.updateMode(mode);

            //This.navigator.select(This.day);

            //This.active.sendNavigate(this.day);
            /*
            var start = This.navigator.selectionStart;
            var end = This.navigator.selectionEnd;
            var day = This.navigator.selectionDay;
            navigate(start, end, day);
            */
        };

        this._findViewByControl = function (control) {
            for (var i = 0; i < this.views.length; i++) {
                if (this.views[i].control === control) {
                    return this.views[i];
                }
            }
            return null;
        };

        this._hideViews = function () {
            //var controls = [dp_day, dp_week, dp_month];
            for (var i = 0; i < this.views.length; i++) {
                this.views[i].hide();
            }
        };

        this.events = {};

        this.events.load = function(url, success, error) {
            if (This.active && This.active.control) {
                This.active.control.events.load(url, success, error);
            }
            else {
                throw "DayPilot.Switcher.events.load(): Active view not found";
            }
        };

        this._previousArgs = null;

        this._init = function() {
            if (!options) {
                return;
            }

            for (var name in options) {
                if (name === "triggers") {
                    DayPilot.list(options.triggers).each(function(item) {
                        This.addTrigger(item.id, item.view);
                    });
                }
                else if (name === "navigator") {
                    This.addNavigator(options.navigator);
                }
                else {
                    This[name] = options[name];
                }
            }

        };

        this._init();

        function navigate(start, end, day) {
            var args = {};
            args.start = start;
            args.end = end;
            args.day = day;
            args.target = This.active.control;
            args.preventDefault = function() {
                this.preventDefault.value = true;
            };

            var previous = This._previousArgs;
            if (previous) {
                if (previous.start === args.start && previous.end === args.end && previous.day === args.day && previous.target === args.target) {
                    return;  // duplicate, no change
                }
            }

            This._previousArgs = args;

            if (typeof This.onChange === "function") {
                This.onChange(args);
                if (args.preventDefault.value) {
                    return;
                }
            }

            // backwards compatibility
            if (typeof This.onTimeRangeSelect === "function") {
                This.onTimeRangeSelect(args);
                if (args.preventDefault.value) {
                    return;
                }
            }

            This.active.sendNavigate(This.day);

            if (typeof This.onChanged === "function") {
                This.onChanged(args);
            }

            if (typeof This.onTimeRangeSelected === "function") {
                This.onTimeRangeSelected(args);
            }
        }
    };

    // register the default theme
    (function() {
        if (DayPilot.Global.defaultCss) {
            return;
        }

        var sheet = DayPilot.sheet();

        // bubble
        sheet.add(".bubble_default_main", "cursor: default;");
        sheet.add(".bubble_default_main_inner", 'border-radius: 5px;font-size: 12px;padding: 4px;color: #666;background: #eeeeee; background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");border: 1px solid #ccc;-moz-border-radius: 5px;-webkit-border-radius: 5px;border-radius: 5px;-moz-box-shadow:0px 2px 3px rgba(000,000,000,0.3),inset 0px 0px 2px rgba(255,255,255,0.8);-webkit-box-shadow:0px 2px 3px rgba(000,000,000,0.3),inset 0px 0px 2px rgba(255,255,255,0.8);box-shadow:0px 2px 3px rgba(000,000,000,0.3),inset 0px 0px 2px rgba(255,255,255,0.8);');

        // calendar
        // sheet.add(".calendar_default_main", "border: 1px solid #999; font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 12px;");
        sheet.add(".calendar_default_main", "border: 1px solid #c0c0c0; font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 12px;");
        sheet.add(".calendar_default_main *, .calendar_default_main *:before, .calendar_default_main *:after", "box-sizing: content-box;");  // bootstrap
        // sheet.add(".calendar_default_rowheader_inner,.calendar_default_cornerright_inner,.calendar_default_corner_inner,.calendar_default_colheader_inner,.calendar_default_alldayheader_inner", "color: #666;background: #eee;");
        sheet.add(".calendar_default_rowheader_inner,.calendar_default_cornerright_inner,.calendar_default_corner_inner,.calendar_default_colheader_inner,.calendar_default_alldayheader_inner", "color: #333;background: #f3f3f3;");
        // sheet.add(".calendar_default_cornerright_inner", "position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;	border-bottom: 1px solid #999;");
        sheet.add(".calendar_default_cornerright_inner", "position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;	border-bottom: 1px solid #c0c0c0;");
        //sheet.add(".calendar_default_rowheader_inner", "font-size: 16pt;text-align: right; position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #999;border-bottom: 1px solid #999;");
        sheet.add(".calendar_default_rowheader_inner", "font-size: 16pt;text-align: right; position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #c0c0c0;border-bottom: 1px solid #c0c0c0;");
        // sheet.add(".calendar_default_corner_inner", "position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #999;border-bottom: 1px solid #999;");
        sheet.add(".calendar_default_corner_inner", "position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #c0c0c0;border-bottom: 1px solid #c0c0c0;");
        sheet.add(".calendar_default_rowheader_minutes", "font-size:10px;vertical-align: super;padding-left: 2px;padding-right: 2px;");
        // sheet.add(".calendar_default_colheader_inner", "text-align: center; position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #999;border-bottom: 1px solid #999;");
        sheet.add(".calendar_default_colheader_inner", "text-align: center; position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #c0c0c0;border-bottom: 1px solid #c0c0c0;");
        sheet.add(".calendar_default_cell_inner", "position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #ddd;border-bottom: 1px solid #ddd; background: #f9f9f9;");
        sheet.add(".calendar_default_cell_business .calendar_default_cell_inner", "background: #fff");
        sheet.add(".calendar_default_alldayheader_inner", "text-align: center;position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #c0c0c0;border-bottom: 1px solid #c0c0c0;");
        sheet.add(".calendar_default_message", "opacity: 0.9;filter: alpha(opacity=90);	padding: 10px; color: #ffffff;background: #ffa216;");
        sheet.add(".calendar_default_alldayevent_inner,.calendar_default_event_inner", 'color: #666; border: 1px solid #999;'); // border-top: 4px solid #1066a8;
        sheet.add(".calendar_default_event_bar", "top: 0px;bottom: 0px;left: 0px;width: 4px;background-color: #9dc8e8;");
        sheet.add(".calendar_default_event_bar_inner", "position: absolute;width: 4px;background-color: #1066a8;");
        sheet.add(".calendar_default_alldayevent_inner,.calendar_default_event_inner", 'background: #fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        sheet.add(".calendar_default_selected .calendar_default_event_inner", "background: #ddd;");
        sheet.add(".calendar_default_alldayevent_inner", "position: absolute;top: 2px;bottom: 2px;left: 2px;right: 2px;padding: 2px;margin-right: 1px;font-size: 12px;");
        sheet.add(".calendar_default_event_withheader .calendar_default_event_inner", "padding-top: 15px;");
        sheet.add(".calendar_default_event", "cursor: default;");
        sheet.add(".calendar_default_event_inner", "position: absolute;overflow: hidden;top: 0px;bottom: 0px;left: 0px;right: 0px;padding: 2px 2px 2px 6px;font-size: 12px;");
        sheet.add(".calendar_default_shadow_inner", "position:absolute;top:0px;left:0px;right:0px;bottom:0px;background-color: #666666; opacity: 0.5;filter: alpha(opacity=50);");
        sheet.add(".calendar_default_event_delete", "background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAI5JREFUKFNtkLERgCAMRbmzdK8s4gAUlhYOYEHJEJYOYOEwDmGBPxC4kOPfvePy84MGR0RJ2N1A8H3N6DATwSQ57m2ql8NBG+AEM7D+UW+wjdfUPgerYNgB5gOLRHqhcasg84C2QxPMtrUhSqQIhg7ypy9VM2EUZPI/4rQ7rGxqo9sadTegw+UdjeDLAKUfhbaQUVPIfJYAAAAASUVORK5CYII=) center center no-repeat; opacity: 0.6; -ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=60)'; cursor: pointer;");
        sheet.add(".calendar_default_event_delete:hover", "opacity: 1;-ms-filter: none;");
        sheet.add(".calendar_default_scroll_up", "background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAB3RJTUUH2wESDiYcrhwCiQAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAARnQU1BAACxjwv8YQUAAACcSURBVHjaY2AgF9wWsTW6yGMlhi7OhC7AyMDQzMnBXIpFHAFuCtuaMTP+P8nA8P/b1x//FfW/HHuF1UQmxv+NUP1c3OxMVVhNvCVi683E8H8LXOY/w9+fTH81tF8fv4NiIpBRj+YoZtZ/LDUoJmKYhsVUpv0MDiyMDP96sIYV0FS2/8z9ICaLlOhvS4b/jC//MzC8xBG0vJeF7GQBlK0xdiUzCtsAAAAASUVORK5CYII=);");
        sheet.add(".calendar_default_scroll_down", "background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAALiMAAC4jAXilP3YAAACqSURBVChTY7wpam3L9J+xmQEP+PGPKZZxP4MDi4zI78uMDIwa2NT+Z2DYovrmiC+TI8OBP/8ZmEqwGvif4e8vxr+FIDkmEKH25vBWBgbG0+iK/zEwLtF+ffwOXCGI8Y+BoRFFIdC030x/WmBiYBNhpgLdswNJ8RSYaSgmgk39z1gPUfj/29ef/9rwhQTDHRHbrbdEbLvRFcGthkkAra/9/uMvhkK8piNLAgCRpTnNn4AEmAAAAABJRU5ErkJggg==);");

        sheet.add(".calendar_default_now", "background-color: red;");
        sheet.add(".calendar_default_now:before", "content: ''; top: -5px; border-width: 5px; border-color: transparent transparent transparent red; border-style: solid; width: 0px; height:0px; position: absolute; -moz-transform: scale(.9999);");

        // 2017-09-12
        sheet.add(".calendar_default_shadow_forbidden .calendar_default_shadow_inner", "background-color: red;");
        sheet.add(".calendar_default_shadow_top", 'box-sizing: border-box; padding:2px;border:1px solid #ccc;background:#fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        sheet.add(".calendar_default_shadow_bottom", 'box-sizing: border-box; padding:2px;border:1px solid #ccc;background:#fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');

        // 2018-03-12
        sheet.add(".calendar_default_crosshair_vertical, .calendar_default_crosshair_horizontal, .calendar_default_crosshair_left, .calendar_default_crosshair_top", "background-color: gray; opacity: 0.2; filter: alpha(opacity=20)");
        sheet.add(".calendar_default_loading", "background-color: orange; color: white; padding: 2px;");

        // 2018-03-20
        sheet.add(".calendar_default_scroll", "background-color: #f3f3f3;");

        // bootstrap

        // menu
        sheet.add(".menu_default_main", "font-family: Tahoma, Arial, Helvetica, Sans-Serif;font-size: 12px;border: 1px solid #dddddd;background-color: white;padding: 0px;cursor: default;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAABCAIAAABG0om7AAAAKXRFWHRDcmVhdGlvbiBUaW1lAHBvIDEwIDUgMjAxMCAyMjozMzo1OSArMDEwMGzy7+IAAAAHdElNRQfaBQoUJAesj4VUAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAABGdBTUEAALGPC/xhBQAAABVJREFUeNpj/P//PwO1weMnT2RlZAAYuwX/4oA3BgAAAABJRU5ErkJggg==);background-repeat: repeat-y;xborder-radius: 5px;-moz-box-shadow:0px 2px 3px rgba(000,000,000,0.3),inset 0px 0px 2px rgba(255,255,255,0.8);-webkit-box-shadow:0px 2px 3px rgba(000,000,000,0.3),inset 0px 0px 2px rgba(255,255,255,0.8);box-shadow:0px 2px 3px rgba(000,000,000,0.3),inset 0px 0px 2px rgba(255,255,255,0.8);");
        sheet.add(".menu_default_main, .menu_default_main *, .menu_default_main *:before, .menu_default_main *:after", "box-sizing: content-box;");
        sheet.add(".menu_default_title", "background-color: #f2f2f2;border-bottom: 1px solid gray;padding: 4px 4px 4px 37px;");
        sheet.add(".menu_default_main a", "padding: 2px 2px 2px 35px;color: black;text-decoration: none;cursor: default;");
        sheet.add(".menu_default_main a img", "margin-left: 6px;margin-top: 2px;");
        sheet.add(".menu_default_item_text", "display: block;height: 20px;line-height: 20px; overflow:hidden;padding-left: 2px;padding-right: 20px;");
        sheet.add(".menu_default_main a:hover", "background-color: #f3f3f3;");
        sheet.add(".menu_default_main div div", "border-top: 1px solid #dddddd;margin-top: 2px;margin-bottom: 2px;margin-left: 28px;");

        sheet.add(".menu_default_main a.menu_default_item_disabled", "color: #ccc");

        sheet.add(".menu_default_item_haschildren.menu_default_item_haschildren_active", 'background: #eeeeee;background: -webkit-gradient(linear, left top, left bottom, from(#efefef), to(#e6e6e6));background: -webkit-linear-gradient(top, #efefef 0%, #e6e6e6);background: -moz-linear-gradient(top, #efefef 0%, #e6e6e6);background: -ms-linear-gradient(top, #efefef 0%, #e6e6e6);background: -o-linear-gradient(top, #efefef 0%, #e6e6e6);background: linear-gradient(top, #efefef 0%, #e6e6e6);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#efefef", endColorStr="#e6e6e6");');
        sheet.add(".menu_default_item_haschildren a:before", "content: ''; border-width: 6px; border-color: transparent transparent transparent black; border-style: solid; width: 0px; height:0px; position: absolute; right: 5px; margin-top: 4px;");

        sheet.add(".menu_default_item_icon", "position: absolute; top:0px; left: 0px; padding: 2px 2px 2px 8px;");
        sheet.add(".menu_default_item a i", "height: 20px;line-height: 20px;");

        // menubar
        sheet.add(".menubar_default_main", "border-bottom: 1px solid #ccc; font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 12px;");
        sheet.add(".menubar_default_item", "display: inline-block;  padding: 6px 10px; cursor: default;");
        sheet.add(".menubar_default_item:hover", "background-color: #f2f2f2;");
        sheet.add(".menubar_default_item_active", "background-color: #f2f2f2;");

        // bootstrap

        // month
        // sheet.add(".month_default_main", "border: 1px solid #aaa;font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 12px;color: #666;");
        sheet.add(".month_default_main", "border: 1px solid #c0c0c0;font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 12px;color: #333;");
        sheet.add(".month_default_main *, .month_default_main *:before, .month_default_main *:after", "box-sizing: content-box;");
        sheet.add(".month_default_cell_inner", "border-right: 1px solid #ddd;border-bottom: 1px solid #ddd;position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;background-color: #f9f9f9;");
        sheet.add(".month_default_cell_business .month_default_cell_inner", "background-color: #fff;");
        sheet.add(".month_default_cell_header", "text-align: right;padding-right: 2px;");
        // sheet.add(".month_default_header_inner", 'text-align: center; vertical-align: middle;position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #999;border-bottom: 1px solid #999;cursor: default;color: #666;background: #eee;');
        sheet.add(".month_default_header_inner", 'text-align: center; vertical-align: middle;position: absolute;top: 0px;left: 0px;bottom: 0px;right: 0px;border-right: 1px solid #c0c0c0;border-bottom: 1px solid #c0c0c0;cursor: default;color: #333;background: #f3f3f3;');
        sheet.add(".month_default_message", 'padding: 10px;opacity: 0.9;filter: alpha(opacity=90);color: #ffffff;background: #ffa216;background: -webkit-gradient(linear, left top, left bottom, from(#ffa216), to(#ff8400));background: -webkit-linear-gradient(top, #ffa216 0%, #ff8400);background: -moz-linear-gradient(top, #ffa216 0%, #ff8400);background: -ms-linear-gradient(top, #ffa216 0%, #ff8400);background: -o-linear-gradient(top, #ffa216 0%, #ff8400);background: linear-gradient(top, #ffa216 0%, #ff8400);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffa216", endColorStr="#ff8400");');
        // sheet.add(".month_default_event_inner", 'position: absolute;top: 0px;bottom: 0px;left: 1px;right: 1px;overflow:hidden;padding: 2px;padding-left: 5px;font-size: 12px;color: #666;background: #fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");border: 1px solid #999;border-radius: 0px;');
        //sheet.add(".month_default_event", "box-shadow: 2px 2px 10px 2px rgba(128,128,128,0.1);");
        sheet.add(".month_default_event_inner", 'position: absolute;top: 0px;bottom: 0px;left: 1px;right: 1px;overflow:hidden;padding: 2px;padding-left: 5px;font-size: 12px;color: #333;background: #fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");border: 1px solid #999;border-radius: 0px;');
        sheet.add(".month_default_event_continueright .month_default_event_inner", "border-top-right-radius: 0px;border-bottom-right-radius: 0px;border-right-style: dotted;");
        sheet.add(".month_default_event_continueleft .month_default_event_inner", "border-top-left-radius: 0px;border-bottom-left-radius: 0px;border-left-style: dotted;");
        sheet.add(".month_default_event_hover .month_default_event_inner", 'background: #fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#e8e8e8));background: -webkit-linear-gradient(top, #ffffff 0%, #e8e8e8);background: -moz-linear-gradient(top, #ffffff 0%, #e8e8e8);background: -ms-linear-gradient(top, #ffffff 0%, #e8e8e8);background: -o-linear-gradient(top, #ffffff 0%, #e8e8e8);background: linear-gradient(top, #ffffff 0%, #e8e8e8);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#e8e8e8");');
        sheet.add(".month_default_selected .month_default_event_inner, .month_default_event_hover.month_default_selected .month_default_event_inner", "background: #ddd;");
        sheet.add(".month_default_shadow_inner", "background-color: #666666;opacity: 0.5;filter: alpha(opacity=50);height: 100%;");
        sheet.add(".month_default_event_delete", "background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAI5JREFUKFNtkLERgCAMRbmzdK8s4gAUlhYOYEHJEJYOYOEwDmGBPxC4kOPfvePy84MGR0RJ2N1A8H3N6DATwSQ57m2ql8NBG+AEM7D+UW+wjdfUPgerYNgB5gOLRHqhcasg84C2QxPMtrUhSqQIhg7ypy9VM2EUZPI/4rQ7rGxqo9sadTegw+UdjeDLAKUfhbaQUVPIfJYAAAAASUVORK5CYII=) center center no-repeat; opacity: 0.6; -ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=60)';cursor: pointer;");
        sheet.add(".month_default_event_delete:hover", "opacity: 1;-ms-filter: none;");

        sheet.add(".month_default_event_timeleft", "color: #ccc; font-size: 8pt");
        sheet.add(".month_default_event_timeright", "color: #ccc; font-size: 8pt; text-align: right;");

        // 2018-04-25
        sheet.add(".month_default_loading", "background-color: orange; color: white; padding: 2px;");

        // bootstrap

        // navigator
        //sheet.add(".navigator_default_main", "border-left: 1px solid #A0A0A0;border-right: 1px solid #A0A0A0;border-bottom: 1px solid #A0A0A0;background-color: white;color: #000000;");
        sheet.add(".navigator_default_main", "border-left: 1px solid #c0c0c0;border-right: 1px solid #c0c0c0;border-bottom: 1px solid #c0c0c0;background-color: white;color: #000000; box-sizing: content-box;");
        sheet.add(".navigator_default_main *, .navigator_default_main *:before, .navigator_default_main *:after", "box-sizing: content-box;");
        sheet.add(".navigator_default_month", "font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 11px;");
        sheet.add(".navigator_default_day", "color: black;");
        sheet.add(".navigator_default_weekend", "background-color: #f0f0f0;");
        sheet.add(".navigator_default_dayheader", "color: black;");
        //sheet.add(".navigator_default_line", "border-bottom: 1px solid #A0A0A0;");
        sheet.add(".navigator_default_line", "border-bottom: 1px solid #c0c0c0;");
        sheet.add(".navigator_default_dayother", "color: gray;");
        sheet.add(".navigator_default_todaybox", "border: 1px solid red;");
        //sheet.add(".navigator_default_title, .navigator_default_titleleft, .navigator_default_titleright", 'border-top: 1px solid #A0A0A0;color: #666;background: #eee;background: -webkit-gradient(linear, left top, left bottom, from(#eeeeee), to(#dddddd));background: -webkit-linear-gradient(top, #eeeeee 0%, #dddddd);background: -moz-linear-gradient(top, #eeeeee 0%, #dddddd);background: -ms-linear-gradient(top, #eeeeee 0%, #dddddd);background: -o-linear-gradient(top, #eeeeee 0%, #dddddd);background: linear-gradient(top, #eeeeee 0%, #dddddd);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#eeeeee", endColorStr="#dddddd");');
        sheet.add(".navigator_default_title, .navigator_default_titleleft, .navigator_default_titleright", 'border-top: 1px solid #c0c0c0;border-bottom: 1px solid #c0c0c0;color: #333;background: #f3f3f3;');
        sheet.add(".navigator_default_busy", "font-weight: bold;");

        // bootstrap

        // 2015-05-19
        // new classes: _cell, _cell_box, _cell_text
        sheet.add(".navigator_default_cell", "text-align: center;");
        sheet.add(".navigator_default_select .navigator_default_cell_box", "background-color: #FFE794; opacity: 0.5;");
        // sheet.add(".navigator_default_select .navigator_default_cell_box", "background-color: rgba(255,231,148,0.5);");

        // 2015-10-08
        sheet.add(".navigator_default_title", "text-align: center;");
        sheet.add(".navigator_default_titleleft, .navigator_default_titleright", "text-align: center;");
        sheet.add(".navigator_default_dayheader", "text-align: center;");
        sheet.add(".navigator_default_weeknumber", "text-align: center;");

        // scheduler

        // updated theme 2016-05-06
        sheet.add(".scheduler_default_main *, .scheduler_default_main *:before, .scheduler_default_main *:after", "box-sizing: content-box;");
        sheet.add(".scheduler_default_main", "box-sizing: content-box; border: 1px solid #c0c0c0;font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 12px;");
        sheet.add(".scheduler_default_selected .scheduler_default_event_inner", "background: #ddd;");
        sheet.add(".scheduler_default_timeheader", "cursor: default;color: #333;");
        sheet.add(".scheduler_default_message", "opacity: 0.9;filter: alpha(opacity=90);padding: 10px; color: #ffffff;background: #ffa216;");
        sheet.add(".scheduler_default_timeheadergroup,.scheduler_default_timeheadercol", "color: #333;background: #f3f3f3;");
        sheet.add(".scheduler_default_rowheader,.scheduler_default_corner", "color: #333;background: #f3f3f3;");
        sheet.add(".scheduler_default_rowheader.scheduler_default_rowheader_selected", "background-color: #aaa;background-image: -webkit-gradient(linear, 0 100%, 100% 0,color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, transparent),	color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, transparent), to(transparent));background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -moz-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -ms-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);-webkit-background-size: 20px 20px;-moz-background-size: 20px 20px;background-size: 20px 20px;");
        sheet.add(".scheduler_default_rowheader_inner", "position: absolute;left: 0px;right: 0px;top: 0px;bottom: 0px;border-right: 1px solid #e0e0e0;padding: 2px;");
        sheet.add(".scheduler_default_timeheadergroup, .scheduler_default_timeheadercol", "text-align: center;");
        sheet.add(".scheduler_default_timeheadergroup_inner", "position: absolute;left: 0px;right: 0px;top: 0px;bottom: 0px;border-right: 1px solid #c0c0c0;border-bottom: 1px solid #c0c0c0;");
        sheet.add(".scheduler_default_timeheadercol_inner", "position: absolute;left: 0px;right: 0px;top: 0px;bottom: 0px;border-right: 1px solid #c0c0c0;");
        sheet.add(".scheduler_default_divider, .scheduler_default_splitter", "background-color: #c0c0c0;");
        sheet.add(".scheduler_default_divider_horizontal", "background-color: #c0c0c0;");
        sheet.add(".scheduler_default_matrix_vertical_line", "background-color: #eee;");
        sheet.add(".scheduler_default_matrix_vertical_break", "background-color: #999;");
        sheet.add(".scheduler_default_matrix_horizontal_line", "background-color: #eee;");
        sheet.add(".scheduler_default_resourcedivider", "background-color: #c0c0c0;");
        sheet.add(".scheduler_default_shadow_inner", "background-color: #666666;opacity: 0.5;filter: alpha(opacity=50);height: 100%;");
        // sheet.add(".scheduler_default_shadow_inner", "background-color: rgba(102,102,102,0.5);height: 100%;");
        sheet.add(".scheduler_default_event", "font-size:12px;color:#333;");
        sheet.add(".scheduler_default_event_inner", "position:absolute;top:0px;left:0px;right:0px;bottom:0px;padding:5px 2px 2px 2px;overflow:hidden;border:1px solid #ccc;");
        sheet.add(".scheduler_default_event_bar", "top:0px;left:0px;right:0px;height:4px;background-color:#9dc8e8;");
        sheet.add(".scheduler_default_event_bar_inner", "position:absolute;height:4px;background-color:#1066a8;");
        sheet.add(".scheduler_default_event_inner", 'background:#fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        sheet.add(".scheduler_default_event_float_inner", "padding:6px 2px 2px 8px;"); // space for arrow
        sheet.add(".scheduler_default_event_float_inner:after", 'content:"";border-color: transparent #666 transparent transparent;border-style:solid;border-width:5px;width:0;height:0;position:absolute;top:8px;left:-4px;');
        sheet.add(".scheduler_default_columnheader_inner", "font-weight: bold;");
        sheet.add(".scheduler_default_columnheader_splitter", "box-sizing: border-box; border-right: 1px solid #c0c0c0;");
        sheet.add(".scheduler_default_columnheader_splitter:hover", "background-color: #c0c0c0;");
        sheet.add(".scheduler_default_columnheader_cell_inner", "padding: 2px;");
        sheet.add(".scheduler_default_cell", "background-color: #f9f9f9;");
        sheet.add(".scheduler_default_cell.scheduler_default_cell_business", "background-color: #fff;");
        sheet.add(".scheduler_default_cell.scheduler_default_cell_business.scheduler_default_cell_selected,.scheduler_default_cell.scheduler_default_cell_selected", "background-color: #ccc;background-image: -webkit-gradient(linear, 0 100%, 100% 0,	color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, transparent),	color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, transparent), to(transparent));background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -moz-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -ms-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);-webkit-background-size: 20px 20px;-moz-background-size: 20px 20px;background-size: 20px 20px;");
        sheet.add(".scheduler_default_tree_image_no_children", "background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAAKXRFWHRDcmVhdGlvbiBUaW1lAHDhIDMwIEkgMjAwOSAwODo0NjozMSArMDEwMClDkt4AAAAHdElNRQfZAR4HLzEyzsCJAAAACXBIWXMAAA7CAAAOwgEVKEqAAAAABGdBTUEAALGPC/xhBQAAADBJREFUeNpjrK6s5uTl/P75OybJ0NLW8h8bAIozgeSxAaA4E1A7VjmgOL31MeLxHwCeXUT0WkFMKAAAAABJRU5ErkJggg==);");
        sheet.add(".scheduler_default_tree_image_expand", "background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAAKXRFWHRDcmVhdGlvbiBUaW1lAHDhIDMwIEkgMjAwOSAwODo0NjozMSArMDEwMClDkt4AAAAHdElNRQfZAR4HLyUoFBT0AAAACXBIWXMAAA7CAAAOwgEVKEqAAAAABGdBTUEAALGPC/xhBQAAAFJJREFUeNpjrK6s5uTl/P75OybJ0NLW8h8bAIozgeRhgJGREc4GijMBtTNgA0BxFog+uA4IA2gmUJwFog/IgUhAGBB9KPYhA3T74Jog+hjx+A8A1KRQ+AN5vcwAAAAASUVORK5CYII=);");
        sheet.add(".scheduler_default_tree_image_collapse", "background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAAKXRFWHRDcmVhdGlvbiBUaW1lAHDhIDMwIEkgMjAwOSAwODo0NjozMSArMDEwMClDkt4AAAAHdElNRQfZAR4HLxB+p9DXAAAACXBIWXMAAA7CAAAOwgEVKEqAAAAABGdBTUEAALGPC/xhBQAAAENJREFUeNpjrK6s5uTl/P75OybJ0NLW8h8bAIozgeSxAaA4E1A7VjmgOAtEHyMjI7IE0EygOAtEH5CDqY9c+xjx+A8ANndK9WaZlP4AAAAASUVORK5CYII=);");
        sheet.add(".scheduler_default_event_move_left", 'box-sizing: border-box; padding:2px;border:1px solid #ccc;background:#fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        sheet.add(".scheduler_default_event_move_right", 'box-sizing: border-box; padding:2px;border:1px solid #ccc;background:#fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        sheet.add(".scheduler_default_event_delete", "background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAI5JREFUKFNtkLERgCAMRbmzdK8s4gAUlhYOYEHJEJYOYOEwDmGBPxC4kOPfvePy84MGR0RJ2N1A8H3N6DATwSQ57m2ql8NBG+AEM7D+UW+wjdfUPgerYNgB5gOLRHqhcasg84C2QxPMtrUhSqQIhg7ypy9VM2EUZPI/4rQ7rGxqo9sadTegw+UdjeDLAKUfhbaQUVPIfJYAAAAASUVORK5CYII=) center center no-repeat; opacity: 0.6; -ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=60)';cursor: pointer;");
        sheet.add(".scheduler_default_event_delete:hover", "opacity: 1;-ms-filter: none;");
        sheet.add(".scheduler_default_rowmove_handle", "background-repeat: no-repeat; background-position: center center; background-color: #ccc; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAKCAYAAACT+/8OAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAClJREFUGFdj+P//P4O9vX2Bg4NDP4gNFgBytgPxebgAMsYuQGMz/jMAAFsTZDPYJlDHAAAAAElFTkSuQmCC); cursor: move;");
        sheet.add(".scheduler_default_rowmove_source", "background-color: black; opacity: 0.2;");
        sheet.add(".scheduler_default_rowmove_position_before, .scheduler_default_rowmove_position_after", "background-color: #999; height: 2px;");
        sheet.add(".scheduler_default_rowmove_position_child", "margin-left: 10px; background-color: #999; height: 2px;");
        sheet.add(".scheduler_default_rowmove_position_child:before", "content: '+'; color: #999; position: absolute; top: -8px; left: -10px;");
        sheet.add(".scheduler_default_rowmove_position_forbidden", "background-color: red; height: 2px; margin-left: 10px;");
        sheet.add(".scheduler_default_rowmove_position_forbidden:before", "content: 'x'; color: red; position: absolute; top: -8px; left: -10px;");
        sheet.add(".scheduler_default_link_horizontal", "border-bottom-style: solid; border-bottom-color: red");
        sheet.add(".scheduler_default_link_vertical", "border-right-style: solid; border-right-color: red");
        sheet.add(".scheduler_default_link_arrow_right:before", "content: ''; border-width: 6px; border-color: transparent transparent transparent red; border-style: solid; width: 0px; height:0px; position: absolute;");
        sheet.add(".scheduler_default_link_arrow_left:before", "content: ''; border-width: 6px; border-color: transparent red transparent transparent; border-style: solid; width: 0px; height:0px; position: absolute;");
        sheet.add(".scheduler_default_link_arrow_down:before", "content: ''; border-width: 6px; border-color: red transparent transparent transparent; border-style: solid; width: 0px; height:0px; position: absolute;");
        // 2015-06-01
        sheet.add(".scheduler_default_link_arrow_up:before", "content: ''; border-width: 6px; border-color: transparent transparent red transparent; border-style: solid; width: 0px; height:0px; position: absolute;");
        sheet.add(".scheduler_default_shadow_overlap .scheduler_default_shadow_inner", "background-color: red;");
        sheet.add(".scheduler_default_block", "background-color: gray; opacity: 0.5; filter: alpha(opacity=50);");
        sheet.add(".scheduler_default_main .scheduler_default_event_group", "box-sizing: border-box; font-size:12px; color:#666; padding:4px 2px 2px 2px; overflow:hidden; border:1px solid #ccc; background-color: #fff;");
        sheet.add(".scheduler_default_main .scheduler_default_header_icon", "box-sizing: border-box; border: 1px solid #c0c0c0; background-color: #f5f5f5; color: #000;");
        sheet.add(".scheduler_default_header_icon:hover", "background-color: #ccc;");
        sheet.add(".scheduler_default_header_icon_hide:before", "content: '\\00AB';");
        sheet.add(".scheduler_default_header_icon_show:before", "content: '\\00BB';");
        sheet.add(".scheduler_default_row_new .scheduler_default_rowheader_inner", "padding-left: 10px; color: #666; cursor: text; background-position: 0px 5px; background-repeat: no-repeat; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABUSURBVChTY0ACslAaK2CC0iCQDMSlECYmQFYIAl1AjFUxukIQwKoYm0IQwFCMSyEIaEJpMMClcD4Qp0CYEIBNIUzRPzAPCtAVYlWEDgyAGIdTGBgAbqEJYyjqa3oAAAAASUVORK5CYII=);");
        sheet.add(".scheduler_default_row_new .scheduler_default_rowheader_inner:hover", "background: white; color: white;");
        sheet.add(".scheduler_default_rowheader textarea", "padding: 3px;");
        sheet.add(".scheduler_default_rowheader_scroll", "cursor: default;");
        sheet.add(".scheduler_default_shadow_forbidden .scheduler_default_shadow_inner", "background-color: red;");
        sheet.add(".scheduler_default_event_moving_source", "opacity: 0.5; filter: alpha(opacity=50);");
        sheet.add(".scheduler_default_linkpoint", "background-color: white; border: 1px solid gray; border-radius: 5px;");
        sheet.add(".scheduler_default_linkpoint.scheduler_default_linkpoint_hover", "background-color: black;");
        sheet.add(".scheduler_default_event.scheduler_default_event_version .scheduler_default_event_inner", "background-color: #cfdde8;background-image: -webkit-gradient(linear, 0 100%, 100% 0,	color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, transparent),	color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, transparent), to(transparent));background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -moz-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -ms-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);-webkit-background-size: 20px 20px;-moz-background-size: 20px 20px;background-size: 20px 20px;");
        // 2016-10-18 crosshair
        sheet.add(".scheduler_default_crosshair_vertical, .scheduler_default_crosshair_horizontal, .scheduler_default_crosshair_left, .scheduler_default_crosshair_top", "background-color: gray; opacity: 0.2; filter: alpha(opacity=20)");
        // 2017-09-20 modified
        // sheet.add(".scheduler_default_matrix_vertical_break", "background-color: #999;");
        // 2017-09-20
        sheet.add(".scheduler_default_link_dot", "border-radius: 10px; background-color: red");
        sheet.add(".scheduler_default_task_milestone .scheduler_default_event_inner", "position:absolute;top:16%;left:16%;right:16%;bottom:16%; background: #38761d; border: 0px none; -webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);-ms-transform: rotate(45deg);-o-transform: rotate(45deg); transform: rotate(45deg); filter: none;");

        // 2018-03-08
        sheet.add(".scheduler_default_event_left", "white-space: nowrap; padding-top: 5px; color: #666; cursor: default;");
        sheet.add(".scheduler_default_event_right", "white-space: nowrap; padding-top: 5px; color: #666; cursor: default;");

        // bootstrap:
        // icon qualified (box-sizing)
        // groups (box-sizing)
        // box-sizing master (first 2 lines)

        // gantt
        sheet.add(".gantt_default_selected .gantt_default_event_inner", "background: #ddd;");
        //sheet.add(".gantt_default_main", "border: 1px solid #aaa;font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 12px;");
        sheet.add(".gantt_default_main", "border: 1px solid #c0c0c0;font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 12px;");
        sheet.add(".gantt_default_main *, .gantt_default_main *:before, .gantt_default_main *:after", "box-sizing: content-box;");
        sheet.add(".gantt_default_timeheader", "cursor: default;color: #666;");
        sheet.add(".gantt_default_message", "opacity: 0.9;filter: alpha(opacity=90);padding: 10px; color: #ffffff;background: #ffa216;");
        // sheet.add(".gantt_default_timeheadergroup,.gantt_default_timeheadercol", "color: #666;background: #eee;");
        sheet.add(".gantt_default_timeheadergroup,.gantt_default_timeheadercol", "color: #333;background: #f3f3f3;");
        //sheet.add(".gantt_default_rowheader,.gantt_default_corner", "color: #666;background: #eee;");
        sheet.add(".gantt_default_rowheader,.gantt_default_corner", "color: #333;background: #f3f3f3;");
        sheet.add(".gantt_default_rowheader.gantt_default_rowheader_selected", "background-color: #aaa;background-image: -webkit-gradient(linear, 0 100%, 100% 0,color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, transparent),	color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, transparent), to(transparent));background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -moz-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -ms-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);-webkit-background-size: 20px 20px;-moz-background-size: 20px 20px;background-size: 20px 20px;");
        // sheet.add(".gantt_default_rowheader_inner", "position: absolute;left: 0px;right: 0px;top: 0px;bottom: 0px;border-right: 1px solid #eee;padding: 2px;");
        sheet.add(".gantt_default_rowheader_inner", "position: absolute;left: 0px;right: 0px;top: 0px;bottom: 0px;border-right: 1px solid #c0c0c0;padding: 2px;");
        sheet.add(".gantt_default_timeheadergroup, .gantt_default_timeheadercol", "text-align: center;");
        sheet.add(".gantt_default_timeheadergroup_inner", "position: absolute;left: 0px;right: 0px;top: 0px;bottom: 0px;border-right: 1px solid #aaa;border-bottom: 1px solid #aaa;");
        sheet.add(".gantt_default_timeheadercol_inner", "position: absolute;left: 0px;right: 0px;top: 0px;bottom: 0px;border-right: 1px solid #aaa;");
        sheet.add(".gantt_default_divider, .gantt_default_splitter", "background-color: #aaa;");
        sheet.add(".gantt_default_divider_horizontal", "background-color: #aaa;");
        sheet.add(".gantt_default_matrix_vertical_line", "background-color: #eee;");
        sheet.add(".gantt_default_matrix_vertical_break", "background-color: #000;");
        sheet.add(".gantt_default_matrix_horizontal_line", "background-color: #eee;");
        sheet.add(".gantt_default_resourcedivider", "background-color: #aaa;");
        sheet.add(".gantt_default_shadow_inner", "background-color: #666666;opacity: 0.5;filter: alpha(opacity=50);height: 100%;");
        sheet.add(".gantt_default_event", "font-size:12px;color:#666;");
        sheet.add(".gantt_default_event_inner", "position:absolute;top:0px;left:0px;right:0px;bottom:0px;padding:5px 2px 2px 2px;overflow:hidden;border:1px solid #ccc;");
        sheet.add(".gantt_default_event_bar", "top:0px;left:0px;right:0px;height:4px;background-color:#9dc8e8;");
        sheet.add(".gantt_default_event_bar_inner", "position:absolute;height:4px;background-color:#1066a8;");
        sheet.add(".gantt_default_event_inner", 'background:#fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        sheet.add(".gantt_default_event_float_inner", "padding:6px 2px 2px 8px;"); // space for arrow
        sheet.add(".gantt_default_event_float_inner:after", 'content:"";border-color: transparent #666 transparent transparent;border-style:solid;border-width:5px;width:0;height:0;position:absolute;top:8px;left:-4px;');
        sheet.add(".gantt_default_columnheader_inner", "font-weight: bold;");
        sheet.add(".gantt_default_columnheader_splitter", "background-color: #666;opacity: 0.5;filter: alpha(opacity=50);");
        sheet.add(".gantt_default_columnheader_cell_inner", "padding: 2px;");
        sheet.add(".gantt_default_cell", "background-color: #f9f9f9;");
        sheet.add(".gantt_default_cell.gantt_default_cell_business", "background-color: #fff;");
        sheet.add(".gantt_default_cell.gantt_default_cell_business.gantt_default_cell_selected,.gantt_default_cell.gantt_default_cell_selected", "background-color: #ccc;background-image: -webkit-gradient(linear, 0 100%, 100% 0,	color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, transparent),	color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, transparent), to(transparent));background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -moz-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -ms-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);-webkit-background-size: 20px 20px;-moz-background-size: 20px 20px;background-size: 20px 20px;");
        sheet.add(".gantt_default_tree_image_no_children", "background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAAKXRFWHRDcmVhdGlvbiBUaW1lAHDhIDMwIEkgMjAwOSAwODo0NjozMSArMDEwMClDkt4AAAAHdElNRQfZAR4HLzEyzsCJAAAACXBIWXMAAA7CAAAOwgEVKEqAAAAABGdBTUEAALGPC/xhBQAAADBJREFUeNpjrK6s5uTl/P75OybJ0NLW8h8bAIozgeSxAaA4E1A7VjmgOL31MeLxHwCeXUT0WkFMKAAAAABJRU5ErkJggg==);");
        sheet.add(".gantt_default_tree_image_expand", "background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAAKXRFWHRDcmVhdGlvbiBUaW1lAHDhIDMwIEkgMjAwOSAwODo0NjozMSArMDEwMClDkt4AAAAHdElNRQfZAR4HLyUoFBT0AAAACXBIWXMAAA7CAAAOwgEVKEqAAAAABGdBTUEAALGPC/xhBQAAAFJJREFUeNpjrK6s5uTl/P75OybJ0NLW8h8bAIozgeRhgJGREc4GijMBtTNgA0BxFog+uA4IA2gmUJwFog/IgUhAGBB9KPYhA3T74Jog+hjx+A8A1KRQ+AN5vcwAAAAASUVORK5CYII=);");
        sheet.add(".gantt_default_tree_image_collapse", "background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAAKXRFWHRDcmVhdGlvbiBUaW1lAHDhIDMwIEkgMjAwOSAwODo0NjozMSArMDEwMClDkt4AAAAHdElNRQfZAR4HLxB+p9DXAAAACXBIWXMAAA7CAAAOwgEVKEqAAAAABGdBTUEAALGPC/xhBQAAAENJREFUeNpjrK6s5uTl/P75OybJ0NLW8h8bAIozgeSxAaA4E1A7VjmgOAtEHyMjI7IE0EygOAtEH5CDqY9c+xjx+A8ANndK9WaZlP4AAAAASUVORK5CYII=);");
        sheet.add(".gantt_default_event_move_left", 'box-sizing: border-box; padding:2px;border:1px solid #ccc;background:#fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        sheet.add(".gantt_default_event_move_right", 'box-sizing: border-box; padding:2px;border:1px solid #ccc;background:#fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        sheet.add(".gantt_default_event_delete", "background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAI5JREFUKFNtkLERgCAMRbmzdK8s4gAUlhYOYEHJEJYOYOEwDmGBPxC4kOPfvePy84MGR0RJ2N1A8H3N6DATwSQ57m2ql8NBG+AEM7D+UW+wjdfUPgerYNgB5gOLRHqhcasg84C2QxPMtrUhSqQIhg7ypy9VM2EUZPI/4rQ7rGxqo9sadTegw+UdjeDLAKUfhbaQUVPIfJYAAAAASUVORK5CYII=) center center no-repeat; opacity: 0.6; -ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=60)';cursor: pointer;");
        sheet.add(".gantt_default_event_delete:hover", "opacity: 1;-ms-filter: none;");

        sheet.add(".gantt_default_rowmove_handle", "background-repeat: no-repeat; background-position: center center; background-color: #ccc; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAKCAYAAACT+/8OAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAClJREFUGFdj+P//P4O9vX2Bg4NDP4gNFgBytgPxebgAMsYuQGMz/jMAAFsTZDPYJlDHAAAAAElFTkSuQmCC); cursor: move;");
        sheet.add(".gantt_default_rowmove_source", "background-color: black; opacity: 0.2;");
        sheet.add(".gantt_default_rowmove_position_before, .gantt_default_rowmove_position_after", "background-color: #999; height: 2px;");
        sheet.add(".gantt_default_rowmove_position_child", "margin-left: 10px; background-color: #999; height: 2px;");
        sheet.add(".gantt_default_rowmove_position_child:before", "content: '+'; color: #999; position: absolute; top: -8px; left: -10px;");
        sheet.add(".gantt_default_rowmove_position_forbidden", "background-color: red; height: 2px; margin-left: 10px;");
        sheet.add(".gantt_default_rowmove_position_forbidden:before", "content: 'x'; color: red; position: absolute; top: -8px; left: -10px;");

        sheet.add(".gantt_default_task_group .gantt_default_event_inner", "position:absolute;top:5px;left:0px;right:0px;bottom:6px;overflow:hidden; background: #1155cc; filter: none; border: 0px none;");
        sheet.add(".gantt_default_task_group.gantt_default_event:before", "content:''; border-color: transparent transparent transparent #1155cc; border-style: solid; border-width: 6px; position: absolute; bottom: 0px;");
        sheet.add(".gantt_default_task_group.gantt_default_event:after", "content:''; border-color: transparent #1155cc transparent transparent; border-style: solid; border-width: 6px; position: absolute; bottom: 0px; right: 0px;");

        sheet.add(".gantt_default_task_milestone .gantt_default_event_inner", "position:absolute;top:16%;left:16%;right:16%;bottom:16%; background: #38761d; border: 0px none; -webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);-ms-transform: rotate(45deg);-o-transform: rotate(45deg); transform: rotate(45deg); filter: none;");
        sheet.add(".gantt_default_browser_ie8 .gantt_default_task_milestone .gantt_default_event_inner", "-ms-filter: \"progid:DXImageTransform.Microsoft.Matrix(SizingMethod='auto expand', M11=0.7071067811865476, M12=-0.7071067811865475, M21=0.7071067811865475, M22=0.7071067811865476);\"");

        sheet.add(".gantt_default_event_left", "white-space: nowrap; padding-top: 5px; color: #666; cursor: default;");
        sheet.add(".gantt_default_event_right", "white-space: nowrap; padding-top: 5px; color: #666; cursor: default;");

        sheet.add(".gantt_default_link_horizontal", "border-bottom-style: solid; border-bottom-color: red;");
        sheet.add(".gantt_default_link_vertical", "border-right-style: solid; border-right-color: red;");
        sheet.add(".gantt_default_link_arrow_right:before", "content: ''; border-width: 6px; border-color: transparent transparent transparent red; border-style: solid; width: 0px; height:0px; position: absolute;");
        sheet.add(".gantt_default_link_arrow_left:before", "content: ''; border-width: 6px; border-color: transparent red transparent transparent; border-style: solid; width: 0px; height:0px; position: absolute;");
        sheet.add(".gantt_default_link_arrow_down:before", "content: ''; border-width: 6px; border-color: red transparent transparent transparent; border-style: solid; width: 0px; height:0px; position: absolute;");
        // 2015-06-01
        sheet.add(".gantt_default_link_arrow_up:before", "content: ''; border-width: 6px; border-color: transparent transparent red transparent; border-style: solid; width: 0px; height:0px; position: absolute;");

        sheet.add(".gantt_default_shadow_overlap .gantt_default_shadow_inner", "background-color: red;");
        sheet.add(".gantt_default_block", "background-color: gray; opacity: 0.5; filter: alpha(opacity=50);");

        sheet.add(".gantt_default_link_hover", "box-shadow: 0px 0px 2px 2px rgba(255, 0, 0, 0.3)");

        sheet.add(".gantt_default_main .gantt_default_header_icon", "box-sizing: border-box; border: 1px solid #aaa; background-color: #f5f5f5; color: #000;");
        sheet.add(".gantt_default_header_icon:hover", "background-color: #ccc;");
        sheet.add(".gantt_default_header_icon_hide:before", "content: '\\00AB';");
        sheet.add(".gantt_default_header_icon_show:before", "content: '\\00BB';");

        sheet.add(".gantt_default_row_new .gantt_default_rowheader_inner", "cursor: text; background-position: 0 50%; background-repeat: no-repeat; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABUSURBVChTY0ACslAaK2CC0iCQDMSlECYmQFYIAl1AjFUxukIQwKoYm0IQwFCMSyEIaEJpMMClcD4Qp0CYEIBNIUzRPzAPCtAVYlWEDgyAGIdTGBgAbqEJYyjqa3oAAAAASUVORK5CYII=);");
        sheet.add(".gantt_default_row_new .gantt_default_rowheader_inner:hover", "background: white;");
        sheet.add(".gantt_default_rowheader textarea", "padding: 5px;");
        sheet.add(".gantt_default_rowheader_scroll", "cursor: default;");

        sheet.add(".gantt_default_shadow_forbidden .gantt_default_shadow_inner", "background-color: red;");
        sheet.add(".gantt_default_event_moving_source", "opacity: 0.5; filter: alpha(opacity=50);");

        //sheet.add(".gantt_default_event.gantt_default_event_original .gantt_default_event_inner", "background-color: #9dc8e8;background-image: -webkit-gradient(linear, 0 100%, 100% 0,	color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, transparent),	color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, transparent), to(transparent));background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -moz-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -ms-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);-webkit-background-size: 20px 20px;-moz-background-size: 20px 20px;background-size: 20px 20px;");
        sheet.add(".gantt_default_event.gantt_default_event_version .gantt_default_event_inner", "background-color: #cfdde8;background-image: -webkit-gradient(linear, 0 100%, 100% 0,	color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, transparent),	color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, transparent), to(transparent));background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -moz-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -ms-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);-webkit-background-size: 20px 20px;-moz-background-size: 20px 20px;background-size: 20px 20px;");

        sheet.add(".gantt_default_task_group.gantt_default_event_continueleft.gantt_default_event:before", "border:0;");
        sheet.add(".gantt_default_task_group.gantt_default_event_continueleft.gantt_default_event .gantt_default_event_inner:before", 'content:"";border-color: transparent #fff transparent transparent;border-style:solid;border-width:5px;width:0;height:0;position:absolute;top:2px;left:-4px;');
        sheet.add(".gantt_default_event_continueleft.gantt_default_event .gantt_default_event_inner", "padding-left: 8px;");
        sheet.add(".gantt_default_event_continueleft.gantt_default_event .gantt_default_event_inner:before", 'content:"";border-color: transparent #000 transparent transparent;border-style:solid;border-width:5px;width:0;height:0;position:absolute;top:7px;left:-4px;');
        // 2018-03-25
        // sheet.add(".gantt_default_task_milestone.gantt_default_event_continueleft.gantt_default_event .gantt_default_event_inner", "padding-left: 0px;");
        // sheet.add(".gantt_default_task_milestone.gantt_default_event_continueleft.gantt_default_event .gantt_default_event_inner:before", 'content:"";border: none;');

        sheet.add(".gantt_default_task_group.gantt_default_event_continueright.gantt_default_event:after", "border:0;");
        sheet.add(".gantt_default_task_group.gantt_default_event_continueright.gantt_default_event .gantt_default_event_inner:after", 'content:"";border-color: transparent transparent transparent #fff;border-style:solid;border-width:5px;width:0;height:0;position:absolute;top:2px;right:-2px;');
        sheet.add(".gantt_default_event_continueright.gantt_default_event .gantt_default_event_inner", "padding-right: 8px;");
        sheet.add(".gantt_default_event_continueright.gantt_default_event .gantt_default_event_inner:after", 'content:"";border-color: transparent transparent transparent #000;border-style:solid;border-width:5px;width:0;height:0;position:absolute;top:7px;right:-2px;');
        // 2018-03-25
        // sheet.add(".gantt_default_task_milestone.gantt_default_event_continueright.gantt_default_event .gantt_default_event_inner", "padding-left: 0px;");
        // sheet.add(".gantt_default_task_milestone.gantt_default_event_continueright.gantt_default_event .gantt_default_event_inner:after", 'content:"";border: none;');

        sheet.add(".gantt_default_linkpoint", "background-color: white; border: 1px solid gray; border-radius: 5px;");
        sheet.add(".gantt_default_linkpoint.gantt_default_linkpoint_hover", "background-color: black;");

        // 2016-10-28
        sheet.add(".gantt_default_crosshair_vertical, .gantt_default_crosshair_horizontal, .gantt_default_crosshair_left, .gantt_default_crosshair_top", "background-color: gray; opacity: 0.2; filter: alpha(opacity=20)");
        // bootstrap:
        // icon qualified (box-sizing)
        // box-sizing master (first 2 lines)

        // kanban
        // scheduler
        sheet.add(".kanban_default_main *, .kanban_default_main *:before, .kanban_default_main *:after", "box-sizing: content-box;");
        sheet.add(".kanban_default_main", "box-sizing: content-box; border: 1px solid #c0c0c0;font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 12px;");
        sheet.add(".kanban_default_selected .kanban_default_event_inner", "background: #ddd;");
        sheet.add(".kanban_default_timeheader", "cursor: default;color: #333;");
        sheet.add(".kanban_default_message", "opacity: 0.9;filter: alpha(opacity=90);padding: 10px; color: #ffffff;background: #ffa216;");
        sheet.add(".kanban_default_colheadercell", "color: #333;background: #f3f3f3;");
        sheet.add(".kanban_default_rowheader,.kanban_default_corner", "color: #333;background: #f3f3f3;");
        sheet.add(".kanban_default_rowheader.kanban_default_rowheader_selected", "background-color: #aaa;background-image: -webkit-gradient(linear, 0 100%, 100% 0,color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, transparent),	color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, transparent), to(transparent));background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -moz-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -ms-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);-webkit-background-size: 20px 20px;-moz-background-size: 20px 20px;background-size: 20px 20px;");
        sheet.add(".kanban_default_rowheader_inner", "position: absolute;left: 0px;right: 0px;top: 0px;bottom: 0px;border-right: 1px solid #f3f3f3;padding: 2px;");
        sheet.add(".kanban_default_colheadercell", "text-align: center;");
        sheet.add(".kanban_default_colheadercell_inner", "position: absolute;left: 0px;right: 0px;top: 0px;bottom: 0px;border-right: 1px solid #c0c0c0;");
        sheet.add(".kanban_default_divider, .kanban_default_splitter", "background-color: #c0c0c0;");
        sheet.add(".kanban_default_divider_horizontal", "background-color: #c0c0c0;");
        sheet.add(".kanban_default_matrix_vertical_line", "background-color: #eee;");
        sheet.add(".kanban_default_matrix_vertical_break", "background-color: #000;");
        sheet.add(".kanban_default_matrix_horizontal_line", "background-color: #eee;");
        sheet.add(".kanban_default_rowheaderdivider", "background-color: #c0c0c0;");
        sheet.add(".kanban_default_shadow_inner", "background-color: #666666;opacity: 0.5;filter: alpha(opacity=50);height: 100%;");
        sheet.add(".kanban_default_card", "font-size:12px;color:#333;");
        sheet.add(".kanban_default_card_inner", "position:absolute;top:0px;left:0px;right:0px;bottom:0px;padding:5px 2px 2px 2px;overflow:hidden;border:1px solid #ccc;");
        //sheet.add(".kanban_default_event_bar", "top:0px;left:0px;right:0px;height:4px;background-color:#9dc8e8;");
        //sheet.add(".kanban_default_event_bar_inner", "position:absolute;height:4px;background-color:#1066a8;");
        sheet.add(".kanban_default_card_inner", 'background:#fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        //sheet.add(".kanban_default_event_float_inner", "padding:6px 2px 2px 8px;"); // space for arrow
        //sheet.add(".kanban_default_event_float_inner:after", 'content:"";border-color: transparent #333 transparent transparent;border-style:solid;border-width:5px;width:0;height:0;position:absolute;top:8px;left:-4px;');
        //sheet.add(".kanban_default_columnheader_inner", "font-weight: bold;");
        //sheet.add(".kanban_default_columnheader_splitter", "background-color: #666;opacity: 0.5;filter: alpha(opacity=50);");
        //sheet.add(".kanban_default_columnheader_cell_inner", "padding: 2px;");
        sheet.add(".kanban_default_cell", "background-color: #fff;");
        sheet.add(".kanban_default_cell.kanban_default_cell_selected", "background-color: #ccc;background-image: -webkit-gradient(linear, 0 100%, 100% 0,	color-stop(.25, rgba(255, 255, 255, .2)), color-stop(.25, transparent),	color-stop(.5, transparent), color-stop(.5, rgba(255, 255, 255, .2)), color-stop(.75, rgba(255, 255, 255, .2)), color-stop(.75, transparent), to(transparent));background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -moz-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -ms-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);background-image: linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);-webkit-background-size: 20px 20px;-moz-background-size: 20px 20px;background-size: 20px 20px;");
        sheet.add(".kanban_default_tree_image_no_children", "background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAAKXRFWHRDcmVhdGlvbiBUaW1lAHDhIDMwIEkgMjAwOSAwODo0NjozMSArMDEwMClDkt4AAAAHdElNRQfZAR4HLzEyzsCJAAAACXBIWXMAAA7CAAAOwgEVKEqAAAAABGdBTUEAALGPC/xhBQAAADBJREFUeNpjrK6s5uTl/P75OybJ0NLW8h8bAIozgeSxAaA4E1A7VjmgOL31MeLxHwCeXUT0WkFMKAAAAABJRU5ErkJggg==);");
        sheet.add(".kanban_default_tree_image_expand", "background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAAKXRFWHRDcmVhdGlvbiBUaW1lAHDhIDMwIEkgMjAwOSAwODo0NjozMSArMDEwMClDkt4AAAAHdElNRQfZAR4HLyUoFBT0AAAACXBIWXMAAA7CAAAOwgEVKEqAAAAABGdBTUEAALGPC/xhBQAAAFJJREFUeNpjrK6s5uTl/P75OybJ0NLW8h8bAIozgeRhgJGREc4GijMBtTNgA0BxFog+uA4IA2gmUJwFog/IgUhAGBB9KPYhA3T74Jog+hjx+A8A1KRQ+AN5vcwAAAAASUVORK5CYII=);");
        sheet.add(".kanban_default_tree_image_collapse", "background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAIAAABv85FHAAAAKXRFWHRDcmVhdGlvbiBUaW1lAHDhIDMwIEkgMjAwOSAwODo0NjozMSArMDEwMClDkt4AAAAHdElNRQfZAR4HLxB+p9DXAAAACXBIWXMAAA7CAAAOwgEVKEqAAAAABGdBTUEAALGPC/xhBQAAAENJREFUeNpjrK6s5uTl/P75OybJ0NLW8h8bAIozgeSxAaA4E1A7VjmgOAtEHyMjI7IE0EygOAtEH5CDqY9c+xjx+A8ANndK9WaZlP4AAAAASUVORK5CYII=);");
        //sheet.add(".kanban_default_event_move_left", 'box-sizing: border-box; padding:2px;border:1px solid #ccc;background:#fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        //sheet.add(".kanban_default_event_move_right", 'box-sizing: border-box; padding:2px;border:1px solid #ccc;background:#fff;background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#eeeeee));background: -webkit-linear-gradient(top, #ffffff 0%, #eeeeee);background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee);background: -ms-linear-gradient(top, #ffffff 0%, #eeeeee);background: -o-linear-gradient(top, #ffffff 0%, #eeeeee);background: linear-gradient(top, #ffffff 0%, #eeeeee);filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#ffffff", endColorStr="#eeeeee");');
        sheet.add(".kanban_default_card_delete", "background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAI5JREFUKFNtkLERgCAMRbmzdK8s4gAUlhYOYEHJEJYOYOEwDmGBPxC4kOPfvePy84MGR0RJ2N1A8H3N6DATwSQ57m2ql8NBG+AEM7D+UW+wjdfUPgerYNgB5gOLRHqhcasg84C2QxPMtrUhSqQIhg7ypy9VM2EUZPI/4rQ7rGxqo9sadTegw+UdjeDLAKUfhbaQUVPIfJYAAAAASUVORK5CYII=) center center no-repeat; opacity: 0.6; -ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=60)';cursor: pointer;");
        sheet.add(".kanban_default_card_delete:hover", "opacity: 1;-ms-filter: none;");

        sheet.add(".kanban_default_rowmove_source", "background-color: black; opacity: 0.2;");
        sheet.add(".kanban_default_rowmove_position_before, .kanban_default_rowmove_position_after", "background-color: #999; height: 2px;");
        //sheet.add(".kanban_default_rowmove_position_child", "margin-left: 10px; background-color: #999; height: 2px;");
        //sheet.add(".kanban_default_rowmove_position_child:before", "content: '+'; color: #999; position: absolute; top: -8px; left: -10px;");
        sheet.add(".kanban_default_rowmove_position_forbidden", "background-color: red; height: 2px; margin-left: 10px;");
        sheet.add(".kanban_default_rowmove_position_forbidden:before", "content: 'x'; color: red; position: absolute; top: -8px; left: -10px;");

        //sheet.add(".kanban_default_shadow_overlap .kanban_default_shadow_inner", "background-color: red;");
        sheet.add(".kanban_default_block", "background-color: gray; opacity: 0.5; filter: alpha(opacity=50);");

        sheet.add(".kanban_default_main .kanban_default_header_icon", "box-sizing: border-box; border: 1px solid #aaa; background-color: #f5f5f5; color: #000;");
        sheet.add(".kanban_default_header_icon:hover", "background-color: #ccc;");
        sheet.add(".kanban_default_header_icon_hide:before", "content: '\\00AB';");
        sheet.add(".kanban_default_header_icon_show:before", "content: '\\00BB';");

        sheet.add(".kanban_default_row_new .kanban_default_rowheader_inner", "cursor: text; background-position: 0px 5px; background-repeat: no-repeat; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABUSURBVChTY0ACslAaK2CC0iCQDMSlECYmQFYIAl1AjFUxukIQwKoYm0IQwFCMSyEIaEJpMMClcD4Qp0CYEIBNIUzRPzAPCtAVYlWEDgyAGIdTGBgAbqEJYyjqa3oAAAAASUVORK5CYII=);");
        sheet.add(".kanban_default_row_new .kanban_default_rowheader_inner:hover", "background: white;");
        sheet.add(".kanban_default_rowheader textarea", "padding: 3px;");
        sheet.add(".kanban_default_rowheader_scroll", "cursor: default;");

        //sheet.add(".kanban_default_shadow_forbidden .kanban_default_shadow_inner", "background-color: red;");

        sheet.add(".kanban_default_card_moving_source", "opacity: 0.5; filter: alpha(opacity=50);");

        // diff
        sheet.add(".kanban_default_card .kanban_default_card_inner", "padding: 5px 5px 5px 10px;");
        sheet.add(".kanban_default_cell", "background-color: #fff;");
        sheet.add(".kanban_default_rowmove_handle", "opacity: 0.5; background-repeat: no-repeat; background-position: center center; background-color: #ccc; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAKCAYAAACT+/8OAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAClJREFUGFdj+P//P4O9vX2Bg4NDP4gNFgBytgPxebgAMsYuQGMz/jMAAFsTZDPYJlDHAAAAAElFTkSuQmCC); cursor: move;");

        // add
        sheet.add(".kanban_default_card_header", "font-size: 120%; font-weight: bold;");
        sheet.add(".kanban_default_card_bar", "background-color: #cc0000; cursor:move;");
        sheet.add(".kanban_default_cell.kanban_default_collapsed", "background-color: #eee;");
        sheet.add(".kanban_default_swimlane_collapse", "cursor:pointer; border: 1px solid #ccc; text-align:center;");
        sheet.add(".kanban_default_swimlane_collapse:before", "content: '^';");
        sheet.add(".kanban_default_swimlane_expand", "cursor:pointer; border: 1px solid #ccc; text-align:center;");
        sheet.add(".kanban_default_swimlane_expand:before", "content: '>';");
        sheet.add(".kanban_default_columnmove_handle", "opacity: 0.5; background-repeat: no-repeat; background-position: center center; background-color: #ccc; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAKCAYAAACT+/8OAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAClJREFUGFdj+P//P4O9vX2Bg4NDP4gNFgBytgPxebgAMsYuQGMz/jMAAFsTZDPYJlDHAAAAAElFTkSuQmCC); cursor: move;");
        sheet.add(".kanban_default_columnmove_position", "background-color: #333;");

        // 2016-10-18
        sheet.add(".kanban_default_crosshair_vertical, .kanban_default_crosshair_horizontal, .kanban_default_crosshair_left, .kanban_default_crosshair_top", "background-color: gray; opacity: 0.2; filter: alpha(opacity=20)");

        sheet.commit();

        DayPilot.Global.defaultCss = true;
    })();


    var Splitter = function(id) {
        var This = this;

        this.id = id;
        this.widths = [];
        this.titles = [];
        this.height = null;
        this.splitterWidth = 3;
        this.css = {};
        this.css.title = null;
        this.css.titleInner = null;
        this.css.splitter = null;

        // internal
        this.blocks = [];
        this.drag = {};

        // callback
        this.updated = function() {};
        this.updating = function() {};

        this.init = function() {
            var div;

            if (!id) {
                throw "error: id not provided";
            }
            else if (typeof id === 'string') {
                div = document.getElementById(id);
            }
            else if (id.appendChild) {
                div = id;
            }
            else {
                throw "error: invalid object provided";
            }

            this.div = div;
            this.blocks = [];

            for (var i = 0; i < this.widths.length; i++) {
                var s = document.createElement("div");
                s.style.display = "inline-block";
                if (This.height !== null) {
                    s.style.height = This.height + "px";
                }
                else {
                    s.style.height = "100%";
                }
                s.style.width = (this.widths[i] - this.splitterWidth) + "px";
                s.style.overflow = 'hidden';
                s.style.verticalAlign = "top";
                s.style.position = "relative";
                s.setAttribute("unselectable", "on");
                s.className = this.css.title;
                div.appendChild(s);

                var inner = document.createElement("div");
                inner.innerHTML = this.titles[i];
                inner.setAttribute("unselectable", "on");
                inner.className = this.css.titleInner;
                s.appendChild(inner);
                
                var handle = document.createElement("div");
                handle.style.display = "inline-block";
                
                if (This.height !== null) {
                    handle.style.height = This.height + "px";
                }
                else {
                    handle.style.height = "100%";
                }
                handle.style.width = this.splitterWidth + "px";
                handle.style.position = "relative";

                handle.appendChild(document.createElement("div"));
                /*
                handle.style.backgroundColor = this.color;
                if (this.opacity >= 0 && this.opacity <= 100) {
                    handle.style.opacity = this.opacity / 100;
                    handle.style.filter = "alpha(opacity=" + this.opacity + ")";
                }*/
                handle.style.cursor = "col-resize";
                handle.setAttribute("unselectable", "on");
                handle.className = this.css.splitter;

                var data = {};
                data.index = i;
                data.width = this.widths[i];

                handle.data = data;

                handle.onmousedown = function(ev) {
                    This.drag.start = DayPilot.page(ev);
                    This.drag.data = this.data;
                    This.div.style.cursor = "col-resize";
                    //document.body.style.cursor = "col-resize";
                    ev = ev || window.event;
                    ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
                };

                div.appendChild(handle);

                var block = {};
                block.section = s;
                block.handle = handle;
                this.blocks.push(block);
            }

            this.registerGlobalHandlers();
        }; // Init

        // resets the initial value
        this.updateWidths = function() {
            for (var i = 0; i < this.blocks.length; i++) {
                var block = this.blocks[i];
                var width = this.widths[i];
                block.handle.data.width = width;

                this._updateWidth(i);
            }
        };

        this._updateWidth = function(i) {
            var block = this.blocks[i];
            var width = this.widths[i];
            block.section.style.width = (width - this.splitterWidth) + "px";
        };

        this.totalWidth = function() {
            var t = 0;
            for (var i = 0; i < this.widths.length; i++) {
                t += this.widths[i];
            }
            return t;
        };

        this.gMouseMove = function(ev) {
            if (!This.drag.start) {
                return;
            }

            var data = This.drag.data;

            var now = DayPilot.page(ev);
            var delta = now.x - This.drag.start.x;
            var i = data.index;

            This.widths[i] = Math.max(5, data.width + delta);
            This._updateWidth(i);

            // callback
            var params = {};
            params.widths = this.widths;
            params.index = data.index;

            This.updating(params);
        };

        this.gMouseUp = function(ev) {
            if (!This.drag.start) {
                return;
            }
            This.drag.start = null;
            document.body.style.cursor = "";
            This.div.style.cursor = "";

            var data = This.drag.data;
            data.width = This.widths[data.index];

            // callback
            var params = {};
            params.widths = this.widths;
            params.index = data.index;

            This.updated(params);
        };

        this.dispose = function() {
            DayPilot.list(this.blocks).each(function(block) {
                block.handle.onmousedown = null;
                DayPilot.de(block.section);
                DayPilot.de(block.handle);
            });
            this.unregisterGlobalHandlers();
        };

        this.registerGlobalHandlers = function() {
            DayPilot.re(document, 'mousemove', this.gMouseMove);
            DayPilot.re(document, 'mouseup', this.gMouseUp);
        };

        this.unregisterGlobalHandlers = function() {
            DayPilot.ue(document, 'mousemove', this.gMouseMove);
            DayPilot.ue(document, 'mouseup', this.gMouseUp);
        };
    };

    DayPilot.Splitter = Splitter;    
    
})();

(function() {

    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }

})();
