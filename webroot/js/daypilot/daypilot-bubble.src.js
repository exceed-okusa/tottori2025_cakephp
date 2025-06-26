/* Copyright 2005 - 2018 Annpoint, s.r.o.
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
    

    if (typeof DayPilot.Bubble !== 'undefined') {
        return;
    }

    var DayPilotBubble = {};

    DayPilotBubble.mouseMove = function(ev) {
        if (typeof(DayPilotBubble) === 'undefined') {
            return;
        }
        DayPilotBubble.mouse = DayPilotBubble.mousePosition(ev);
        
        var b = DayPilotBubble.active;
        if (b && b._state.showPosition) {
            var pos1 = b._state.showPosition;
            var pos2 = DayPilotBubble.mouse;
            if (pos1.clientX !== pos2.clientX || pos1.clientY !== pos2.clientY) {
                // b.delayedHide();
            }
        }
    };

    DayPilotBubble.touchPosition = function(ev) {
        if (!ev || !ev.touches) {
            return null;
        }
        var touch = ev.touches[0];
        var mouse = {};
        mouse.x = touch.pageX;
        mouse.y = touch.pageY;
        mouse.clientX = touch.clientX;
        mouse.clientY = touch.clientY;
        return mouse;

    };

    DayPilotBubble.mousePosition = function(e) {
        // var result = DayPilot.mo3(document.body, e);
        var result = DayPilot.mo3(null, e);
        if (e) {
            result.clientY = e.clientY;
            result.clientX = e.clientX;
        }
        return result;
    };

    DayPilot.Bubble = function(options) {
        this.v = '2018.2.3297';

        var bubble = this;
        var elements = {};
        //this.object = document.getElementById(id);
        
        // default property values

        // disabled, only applicable in the cssOnly = false mode (it's now disabled)

        //this.backgroundColor = "#ffffff";
        //this.border = "1px solid #000000";
        //this.corners = 'Rounded';
        //this.useShadow = true;

        this.cssOnly = true;
        this.hideAfter = 500;
        this.loadingText = "Loading...";
        this.animated = true;
        this.animation = "fast";
        this.position = "EventTop";
        this.hideOnClick = true;
        this.showAfter = 500;
        this.showLoadingLabel = true;
        this.zIndex = 10;
        this.theme = "bubble_default";
        
        //this.elements = {};

        // hiding for angular
        this._state = function() {};
        
        this.callBack = function(args) {
            if (this.aspnet()) {
                WebForm_DoCallback(this.uniqueID, JSON.stringify(args), this.updateView, this, this.callbackError, true);
            }
            else {
                if (args.calendar.internal.bubbleCallBack) {
                    args.calendar.internal.bubbleCallBack(args, this);
                }
                else {
                    args.calendar.bubbleCallBack(args, this);
                }
            }
        };
        
        this.callbackError = function (result, context) { 
            alert(result); 
        };

        this.updateView = function(result, context) {
            // context should equal to bubble
            if (bubble !== context) {
                throw "Callback object mismatch (internal error)";
            }
            if (!result) {
                bubble.removeDiv();
                bubble.removeShadow();
                return;
            }
            DayPilotBubble.active = bubble;
            if (bubble) {
                /*
                if (bubble.elements.inner) {
                    bubble.elements.inner.innerHTML = result;
                }
                */
                /*
                if (bubble.elements.div) {
                    bubble.elements.div.firstChild.innerHTML = result;
                }
                */
                if (elements.div) {
                    elements.div.firstChild.innerHTML = result;
                }
                bubble.adjustPosition();
                if (!bubble.animated) {
                    bubble.addShadow();
                }
            } 
        };
        
        this.init = function() {
            // moved to global init code
            //DayPilot.re(document.body, 'mousemove', DayPilotBubble.mouseMove);
        };
        
        this.aspnet = function() {
            return (typeof WebForm_DoCallback !== 'undefined');
        };
        
        this.rounded = function() {
            return this.corners === 'Rounded';
        };
        
        this.showEvent = function(e, now) {
            //document.title = "e.root:" + e.root;
            var a = new DayPilotBubble.CallBackArgs(e.calendar || e.root, 'Event', e, e.bubbleHtml ? e.bubbleHtml() : null);
            if (now) {
                this.show(a);
            }
            else {
                this.showOnMouseOver(a);
            }
        };
        
        this.showCell = function(cell) {
            DayPilotBubble.cancelShowing();
            var a = new DayPilotBubble.CallBackArgs(cell.calendar || cell.root, 'Cell', cell, cell.staticBubbleHTML ? cell.staticBubbleHTML() : null);
            this.showOnMouseOver(a);
        };
        
        this.showTime = function(time) {
            var a = new DayPilotBubble.CallBackArgs(time.calendar || time.root, 'Time', time, time.staticBubbleHTML ? time.staticBubbleHTML() : null);
            this.showOnMouseOver(a);
        };
        
        this.showResource = function(row, now) {
           /* var isRow = DayPilot.Row && row instanceof DayPilot.Row;
            var isColumn = DayPilot.Column && row instanceof DayPilot.Column;
            var rowOrCol = isRow || isColumn;

            if (!rowOrCol) {
                throw new DayPilot.Exception("DayPilot.Row or DayPilot.Column object expected");
            }*/

            var res = {};
            res.calendar = row.calendar;
            res.id = row.id;
            if (row.bubbleHtml) {
                res.bubbleHtml = function() {
                    return row.bubbleHtml;
                };
            }
            else if (row.data && row.data.bubbleHtml) {
                res.bubbleHtml = function() {
                    return row.data.bubbleHtml;
                };
            }
            res.toJSON = function() {
                var json = {};
                json.id = this.id;
                return json;
            };

            var a = new DayPilotBubble.CallBackArgs(res.calendar || res.root, 'Resource', res, res.bubbleHtml ? res.bubbleHtml() : null);
            a.div = row.div;

            if (now) {
                this.show(a);
            }
            else {
                this.showOnMouseOver(a);
            }
        };

        this._createResourceBubbleParam = function(row) {
            var res = {};

            return res;
        };
        
        this.showHtml = function(html, div) {
            var a = new DayPilotBubble.CallBackArgs(null, 'Html', null, html);
            a.div = div;
            this.show(a);
        };
        
        this.show = function(callbackArgument) {
            var pop = this.animated;
            
            this._state.showPosition = DayPilotBubble.mouse;

            if (!DayPilotBubble.mouse) {
                // wait a bit
                setTimeout(function() {
                    bubble.show(callbackArgument);
                }, 100);
                return;
            }

            var ref = this.getDiv(callbackArgument);
            if (this.position === "EventTop" && ref) {
                var margin = 2;
                var abs = DayPilot.abs(ref, true);
                if (!abs) {
                    return;
                }

                this._state.mouse = DayPilotBubble.mouse;
                this._state.mouse.x = abs.x;
                this._state.mouse.y = abs.y;
                this._state.mouse.h = abs.h + margin;
                this._state.mouse.w = abs.w;
            }
            else {
                // fix the position to the original location (don't move it in adjustPosition after callback)
                this._state.mouse = DayPilotBubble.mouse;
            }

            var id;
            try {
                id = JSON.stringify(callbackArgument.object);
            }
            catch (e) {
                return; // unable to serialize, it's an invalid event (might have been cleared already)
            }

            if (DayPilotBubble.active === this && this._state.sourceId === id) { // don't show, it's already visible
                return;
            }    
            if (typeof DayPilot.Menu !== 'undefined' && DayPilot.Menu.active) { // don't show the bubble if a menu is active
                return;
            }

            if (!bubble.cssOnly) {
                bubble.cssOnly = true;
                DayPilot.Util.log("DayPilot: cssOnly = false mode is not supported since DayPilot Pro 8.0.");
            }

            // hide whatever might be visible (we are going to show another one)
            DayPilotBubble.hideActive();

            DayPilotBubble.active = this;
            this._state.sourceId = id;

            var div = document.createElement("div");
            div.setAttribute("unselectable", "on");
            div.style.position = 'absolute';

            //if (!this.showLoadingLabel && !pop) {
            if (!this.showLoadingLabel) {
                div.style.display = 'none';
            }

            if (!this.cssOnly) {
                if (this.width) {
                    div.style.width = this.width;
                }
                
                div.style.cursor = 'default';
            }
            else {
                div.className = this._prefixCssClass("_main");
            }
            
            div.style.top = '0px';
            div.style.left = '0px';
            div.style.zIndex = this.zIndex + 1;  
            
            if (pop) {
                div.style.visibility = 'hidden';
            }

            if (this.hideOnClick) {
                div.onclick = function() {
                    DayPilotBubble.hideActive();
                };
            }

            div.onmousemove = function(e) {
                DayPilotBubble.cancelHiding();
                var e = e || window.event;
                e.cancelBubble = true;
            };
            div.oncontextmenu = function() { return false; };
            div.onmouseout = function() { bubble.delayedHide(); };

            var inner = document.createElement("div");
            div.appendChild(inner);

            if (this.cssOnly) {
                inner.className = this._prefixCssClass("_main_inner");
            }
            else {
                inner.style.padding = '4px';
                if (this.border) {
                    inner.style.border = this.border;
                }
                if (this.rounded()) {
                    inner.style.MozBorderRadius = "5px";
                    inner.style.webkitBorderRadius = "5px";
                    inner.style.borderRadius = "5px";
                }
                inner.style.backgroundColor = this.backgroundColor;
            }

            inner.innerHTML = this.loadingText;

            document.body.appendChild(div);

            elements.div = div;
            
            if (this.showLoadingLabel && !pop) {
                this.adjustPosition();
                this.addShadow();
            }

            if (callbackArgument.staticHTML  && typeof this.onLoad !== 'function') {
                this.updateView(callbackArgument.staticHTML, this);
            }
            else if (typeof this.onLoad === 'function') {
                var args = {};
                args.source = callbackArgument.object;
                args.async = false;
                args.html = callbackArgument.staticHTML;
                args.loaded = function() {
                    // make sure it's marked as async
                    if (this.async) {
                        bubble.updateView(args.html, bubble);
                    }
                };
                this.onLoad(args);
                
                // not async, show now
                if (!args.async) {
                    bubble.updateView(args.html, bubble);
                }
            }
            else if (this._serverBased(callbackArgument)) {
                this.callBack(callbackArgument);
            }
        };
        
        this.getDiv = function(callbackArgument) {
            if (callbackArgument.div) {
                return callbackArgument.div;
            }
            if (callbackArgument.type === 'Event' && callbackArgument.calendar && callbackArgument.calendar.internal.findEventDiv) {
                return callbackArgument.calendar.internal.findEventDiv(callbackArgument.object);
            }
            
        };
                
        this._prefixCssClass = function(part) {
            var prefix = this.theme || this.cssClassPrefix;
            if (prefix) {
                return prefix + part;
            }
            else {
                return "";
            }
        };
        
        this.loadingElement = null;
        
        this.loadingStart = function(abs) {
        
        };
        
        this.loadingStop = function() {
        
        };
        
        this.adjustPosition = function() {
            var pop = this.animated;
            
            var position = this.position;
            
            var windowPadding = 10; // used for both horizontal and vertical padding if the bubble

            if (!elements.div) {
                return;
            }

            /*
            if (!this.elements.div) {
                return;
            }
            */
            
            if (!this._state.mouse) {  // don't ajdust the position
                return;
            }
            
            // invalid coordinates
            if (!this._state.mouse.x || !this._state.mouse.y) {
                DayPilotBubble.hideActive();   
                return;         
            }

            var div = elements.div;
            
            div.style.display = '';
            var height = div.offsetHeight;
            var width = div.offsetWidth;
            div.style.display = 'none';
            
            var wd = DayPilot.wd();

            var windowWidth = wd.width;
            var windowHeight = wd.height;

            if (position === 'Mouse') {
                var pixelsBelowCursor = 22;
                var pixelsAboveCursor = 10;

                var top = 0;
                if (this._state.mouse.clientY > windowHeight - height + windowPadding) {
                    var offsetY = this._state.mouse.clientY - (windowHeight - height) + windowPadding;
                    top = (this._state.mouse.y - height - pixelsAboveCursor);
                }
                else {
                    top = this._state.mouse.y + pixelsBelowCursor;
                }
                
                if (typeof top === 'number') {
                    div.style.top = Math.max(top, 0) + "px";
                }
                
                if (this._state.mouse.clientX > windowWidth - width + windowPadding) {
                    var offsetX = this._state.mouse.clientX - (windowWidth - width) + windowPadding;
                    div.style.left = (this._state.mouse.x - offsetX) + 'px';
                }
                else {
                    div.style.left = this._state.mouse.x + 'px';
                }
            }
            else if (position === 'EventTop') {
                var space = 2;
                
                // 1 try to show it above the event
                var top = this._state.mouse.y - height - space;
                var scrollTop = wd.scrollTop;
                
                // 2 doesn't fit there, try to show it below the event
                if (top < scrollTop) {
                    top = this._state.mouse.y + this._state.mouse.h + space;
                }
                
                if (typeof top === 'number') {
                    div.style.top = Math.max(top, 0) + 'px';
                }
                
                var left = this._state.mouse.x;

                // does it have any effect here? gets updated later                
                if (this._state.mouse.x + width + windowPadding > windowWidth) {
                    //var offsetX = this.mouse.x - (windowWidth - width) + windowPadding;
                    //left = this.mouse.x - offsetX;
                    left = windowWidth - width - windowPadding;
                }
                
                div.style.left = left + 'px';
                
            }
            
            div.style.display = '';

            if (pop) {
                div.style.display = '';
                
                var original = {};
                original.color = div.firstChild.style.color;
                original.overflow = div.style.overflow;
                
                div.firstChild.style.color = "transparent";
                div.style.overflow = 'hidden';
                
                this.removeShadow();
                
                DayPilot.pop(div, {
                    "finished": function() {
                        div.firstChild.style.color = original.color;
                        div.style.overflow = original.overflow;
                        bubble.addShadow();
                    },
                    "vertical": "bottom",
                    "horizontal": "left",
                    "animation" : bubble.animation
                });
            }
        
        };
        
        this.delayedHide = function() {
            // turned off, might not be desired
            // DayPilotBubble.cancelHiding();

            if (DayPilotBubble.showing == this) {
                DayPilotBubble.cancelShowing();
            }

            var active = DayPilotBubble.active;
            if (active === this) {
                DayPilotBubble.cancelHiding();
                if (active.hideAfter > 0) {
                    var hideAfter = active.hideAfter;
                    DayPilotBubble.timeoutHide = window.setTimeout(DayPilotBubble.hideActive, hideAfter);
                }
            }
        };

        this.showOnMouseOver = function (callbackArgument) {
            // DayPilotBubble.cancelTimeout();
            
            var delayedShow = function(arg) {
                return function() {
                    bubble.show(arg);
                };
            };

            clearTimeout(DayPilotBubble.timeoutShow);
            DayPilotBubble.timeoutShow = window.setTimeout(delayedShow(callbackArgument), this.showAfter);
            DayPilotBubble.showing = this;
            //DayPilotBubble.timeout = window.setTimeout(this.clientObjectName + ".show('" + callbackArgument + "')", this.showAfter);
        };

        this.hideOnMouseOut = function() {
            this.delayedHide();
        };
        
        this._serverBased = function(args) {
            if (args.calendar.backendUrl) {  // ASP.NET MVC, Java
                return true;
            }
            if (typeof WebForm_DoCallback === 'function' && this.uniqueID) {  // ASP.NET WebForms
                return true;
            }
            return false;
        };

        
        this.addShadow = function() {
            if (!this.useShadow) {  // shadow is disabled
                return;
            }
            if (this.cssOnly) {
                return;
            }
            if (!elements.div) {
                return;
            }
            var div = elements.div;
            if (this.shadows && this.shadows.length > 0) {
                this.removeShadow();
            }
            this.shadows = [];
            
            for (var i = 0; i < 5; i++) {
                var shadow = document.createElement('div');
                shadow.setAttribute("unselectable", "on");
                
                shadow.style.position = 'absolute';
                shadow.style.width = div.offsetWidth + 'px';
                shadow.style.height = div.offsetHeight + 'px';
                
                shadow.style.top = div.offsetTop + i + 'px';
                shadow.style.left = div.offsetLeft + i + 'px';
                shadow.style.zIndex = this.zIndex;
                
                shadow.style.filter = 'alpha(opacity:10)';
                shadow.style.opacity = 0.1;
                shadow.style.backgroundColor = '#000000';
                
                if (this.rounded()) {
                    shadow.style.MozBorderRadius = "5px";
                    shadow.style.webkitBorderRadius = "5px";
                    shadow.style.borderRadius = "5px";
                }

                document.body.appendChild(shadow);
                this.shadows.push(shadow);
            }
        };
        
        this.removeShadow = function() {
            if (!this.shadows) {
                return;
            }

            for (var i = 0; i < this.shadows.length; i++) {
                document.body.removeChild(this.shadows[i]);
            }
            this.shadows = [];
        };   
        
        this.removeDiv = function() {
            if (!elements.div) {
                return;
            }
            document.body.removeChild(elements.div);
            elements.div = null;
        }; 
        
        if (options) {
            for (var name in options) {
                this[name] = options[name];
            }
        }
        
        this.init();
        
    };

    DayPilot.Bubble.touchPosition = function(ev) {
        if (ev.touches) {
            DayPilotBubble.mouse = DayPilotBubble.touchPosition(ev);
        }
    };

    DayPilotBubble.cancelShowing = function() {
        if (DayPilotBubble.timeoutShow) {
            window.clearTimeout(DayPilotBubble.timeoutShow);
            DayPilotBubble.timeoutShow = null;
            DayPilotBubble.showing = null;
        }
    };

    DayPilotBubble.cancelHiding = function() {
        if (DayPilotBubble.timeoutHide) {
            window.clearTimeout(DayPilotBubble.timeoutHide);
        }
    };

    DayPilotBubble.hideActive = function() {
        DayPilotBubble.cancelHiding();
        // don't cancel showing here (it prevents showing bubble of another type right away)
        // DayPilotBubble.cancelShowing();
        var bubble = DayPilotBubble.active;
        if (bubble) {
            //bubble.object.style.display = 'none';
            bubble.removeDiv();
            bubble.removeShadow();
        }
        DayPilotBubble.active = null;
    };
    
    DayPilotBubble.CallBackArgs = function(calendar, type, object, staticHTML) {
        this.calendar = calendar;
        this.type = type;
        this.object = object;
        this.staticHTML = staticHTML;
        
        this.toJSON = function() {
            var json = {};
            json.uid = this.calendar.uniqueID;
            //json.v = this.calendar.v;
            json.type = this.type;
            json.object = object;
            //json.staticHTML = staticHTML;
            return json;
        };
    };

    // register global events
    DayPilot.re(document, 'mousemove', DayPilotBubble.mouseMove);

    // publish the API 
    
    // (backwards compatibility)
    /*
    DayPilot.BubbleVisible.Bubble = DayPilotBubble.Bubble;
    DayPilot.BubbleVisible.hideActive = DayPilotBubble.hideActive;
    DayPilot.BubbleVisible.cancelTimeout = DayPilotBubble.cancelTimeout;
    */
    
    // current
    DayPilot.Bubble.hideActive = DayPilotBubble.hideActive;
    DayPilot.Bubble.cancelShowing = DayPilotBubble.cancelShowing;

    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded){
       Sys.Application.notifyScriptLoaded();
    }
     
})();