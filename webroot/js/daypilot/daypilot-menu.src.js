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
    

    if (typeof DayPilot.Menu !== 'undefined') {
        return;
    }

    var doNothing = function() {};

    var DayPilotMenu = {};

    DayPilotMenu.mouse = null;
    DayPilotMenu.menu = null;
    DayPilotMenu.handlersRegistered = false;
    DayPilotMenu.hideTimeout = null;
    DayPilotMenu.waitingSubmenu = null;

    DayPilot.Menu = function(items) {
        var menu = this;
        var initiatorAreaDiv = null;
        
        this.v = '2018.2.3297';
        this.zIndex = 120;  // more than 10,001 used by ModalPopupExtender
        //this.useShadow = true;
        this.cssClassPrefix = "menu_default";
        this.cssOnly = true;
        this.menuTitle = null;
        this.showMenuTitle = false;
        this.hideOnMouseOut = false;
        this.theme = null;

        this.onShow = null;

        // hiding internal properties for angular
        this._state = function() {};
        //this._state.ref = null; // ref object, used for position

        if (items && DayPilot.isArray(items)) {
            this.items = items;
        }

        this.show = function(e, options) {
            var options = options || {};

            var value = null;
            if (!e) {
                value = null;
            }
            else if (typeof e.id === 'string' || typeof e.id === 'number') {
                value = e.id;
            }
            else if (typeof e.id === 'function') {
                value = e.id();
            }
            else if (typeof e.value === 'function') {
                value = e.value();
            }

            if (typeof(DayPilot.Bubble) !== 'undefined') { // hide any bubble if active
                DayPilot.Bubble.hideActive();
            }

            if (!options.submenu) {
                DayPilotMenu.menuClean();
            }

            // clear old data
            this._state.submenu = null;

            if (DayPilotMenu.mouse === null) { // not possible to execute before mouse move (TODO)
                return;
            }

            if (!menu.cssOnly) {
                menu.cssOnly = true;
                DayPilot.Util.log("DayPilot: cssOnly = false mode is not supported since DayPilot Pro 8.0.");
            }

            var source = null;
            if (e && e.isRow && e.$.row.task) {
                source = new DayPilot.Task(e.$.row.task, e.calendar);
                source.menuType = "resource";
            }
            else if (e && e.isEvent && e.data.task) {
                source = new DayPilot.Task(e, e.calendar);
            }
            else {
                source = e;
            }

            if (typeof menu.onShow === "function") {
                var args = {};
                args.source = source;
                args.menu = menu;
                args.preventDefault = function () {
                    args.preventDefault.value = true;
                };
                menu.onShow(args);
                if (args.preventDefault.value) {
                    return;
                }
            }

            var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.top = "0px";
            div.style.left = "0px";
            div.style.display = 'none';
            div.style.overflow = 'hidden';
            div.style.zIndex = this.zIndex + 1;
            div.className = this.applyCssClass('main');
            div.onclick = function(ev) {
                ev.cancelBubble = true;
                this.parentNode.removeChild(this);
            };
            
            if (this.hideOnMouseOut) {
                div.onmousemove = function(ev) {
                    clearTimeout(DayPilotMenu.hideTimeout);
                };
                div.onmouseout = function(ev) {
                    menu.delayedHide();
                };
            }

            if (!this.items || this.items.length === 0) {
                throw "No menu items defined.";
            }

            if (this.showMenuTitle) {
                var title = document.createElement("div");
                title.innerHTML = this.menuTitle;
                title.className = this.applyCssClass("title");
                div.appendChild(title);
            }

            for (var i = 0; i < this.items.length; i++) {
                var mi = this.items[i];
                var item = document.createElement("div");
                DayPilot.Util.addClass(item, this.applyCssClass("item"));
                if (mi.items) {
                    DayPilot.Util.addClass(item, this.applyCssClass("item_haschildren"));
                }
                //item.style.position = 'relative';

                if (typeof mi === 'undefined') {
                    continue;
                }

                if (mi.hidden) {
                    continue;
                }


                if (mi.text === '-') {
                    var separator = document.createElement("div");
                    item.appendChild(separator);
                }
                else {
                    var link = document.createElement("a");
                    link.style.position = 'relative';
                    link.style.display = "block";

                    if (mi.cssClass) {
                        DayPilot.Util.addClass(link, mi.cssClass);
                    }

                    if (mi.disabled) {
                        DayPilot.Util.addClass(link, menu.applyCssClass("item_disabled"));
                    }
                    else {
                        if (mi.onclick || mi.onClick) {
                            link.item = mi;
                            link.onclick = (function(mi, link) {
                                return function (e) {
                                    if (typeof mi.onClick === "function") {
                                        var args = {};
                                        args.item = mi;
                                        args.source = link.source;
                                        args.originalEvent = e;
                                        args.preventDefault = function () {
                                            args.preventDefault.value = true;
                                        };
                                        mi.onClick(args);
                                        if (args.preventDefault.value) {
                                            return;
                                        }
                                    }
                                    if (mi.onclick) {
                                        mi.onclick.call(link, e);
                                    }
                                };
                            })(mi, link);

                            var assignTouchEnd = function(mi, link) {
                                return function(e) {
                                    e.stopPropagation();
                                    e.preventDefault();

                                    var cleanup = function() {
                                        window.setTimeout(function() {
                                            link.source.calendar.internal.touch.active = false;
                                        }, 500);
                                    };

                                    if (typeof mi.onClick === "function") {
                                        var args = {};
                                        args.item = mi;
                                        args.originalEvent = e;
                                        args.preventDefault = function() {
                                            args.preventDefault.value = true;
                                        };
                                        mi.onClick(args);
                                        if (args.preventDefault.value) {
                                            cleanup();
                                            return;
                                        }
                                    }

                                    if (mi.onclick) {
                                        mi.onclick.call(link, e);
                                    }

                                    DayPilotMenu.menuClean();
                                    cleanup();
                                };
                            };

                            link.ontouchstart = function(ev) {
                                ev.stopPropagation();
                                ev.preventDefault();

                                link.source.calendar.internal.touch.active = true;
                            };

                            link.ontouchend = assignTouchEnd(mi, link);
                        }

                        if (mi.onclick) {
                            doNothing();
                        }
                        else if (mi.href) {
                            link.href = mi.href.replace(/\x7B0\x7D/gim, value); // for NavigateUrl actions, only for backwards compatibility
                            if (mi.target) {
                                link.setAttribute("target", mi.target);
                            }
                        }
                        else if (mi.command) {
                            var assign = function(mi, link) {
                                return function(e) {
                                    var source = link.source;
                                    var item = mi;
                                    item.action = item.action ? item.action : 'CallBack';
                                    var cal = source.calendar || source.root;

                                    if (source instanceof DayPilot.Link) {
                                        cal.internal.linkMenuClick(item.command, source, item.action);
                                        return;
                                    }
                                    else if (source instanceof DayPilot.Selection) {
                                        cal.internal.timeRangeMenuClick(item.command, source, item.action);
                                        return;
                                    }
                                    else if (source instanceof DayPilot.Event) {
                                        cal.internal.eventMenuClick(item.command, source, item.action);
                                        return;
                                    }
                                    else if (source instanceof DayPilot.Selection) {
                                        cal.internal.timeRangeMenuClick(item.command, source, item.action);
                                        return;
                                    }
                                    else if (source instanceof DayPilot.Task) {
                                        if (source.menuType === "resource") {
                                            cal.internal.resourceHeaderMenuClick(item.command, link.menuSource, item.action);
                                        }
                                        else {
                                            cal.internal.eventMenuClick(item.command, link.menuSource, item.action);
                                        }
                                        return;
                                    }
                                    else {
                                        switch (source.menuType) {  // TODO legacy, remove
                                            case 'resource':
                                                cal.internal.resourceHeaderMenuClick(item.command, source, item.action);
                                                return;
                                            case 'selection':  // fully replaced
                                                cal.internal.timeRangeMenuClick(item.command, source, item.action);
                                                return;
                                            default:  //  fully replaced
                                                cal.internal.eventMenuClick(item.command, source, item.action);
                                                return;
                                        }
                                    }

                                    e.preventDefault();
                                };
                            };
                            link.onclick = assign(mi, link);
                            link.ontouchend = assign(mi, link);
                        }

                    }

                    link.source = source;
                    link.menuSource = e;

                    var span = document.createElement("span");
                    span.className = menu.applyCssClass("item_text");
                    span.innerHTML = mi.text;
                    link.appendChild(span);

                    if (mi.image) {
                        var image = document.createElement("img");
                        image.src = mi.image;
                        image.style.position = 'absolute';
                        image.style.top = '0px';
                        image.style.left = '0px';

                        link.appendChild(image);
                    }

                    if (mi.icon) {
                        var icon = document.createElement("span");
                        icon.className = menu.applyCssClass("item_icon");

                        var iel = document.createElement("i");
                        iel.className = mi.icon;
                        icon.appendChild(iel);

                        link.appendChild(icon);
                    }
                    
                    var assignOnMouseOver = function(mi, link) {
                        return function() {
                            var source = link.source;
                            var item = mi;

                            var ws = DayPilotMenu.waitingSubmenu;
                            if (ws) {
                                if (ws.parent === item) {
                                    return;
                                }
                                else {
                                    clearTimeout(ws.timeout);
                                    DayPilotMenu.waitingSubmenu = null;
                                }
                            }

                            DayPilotMenu.waitingSubmenu = {};
                            DayPilotMenu.waitingSubmenu.parent = item;
                            DayPilotMenu.waitingSubmenu.timeout = setTimeout(function() {

                                DayPilotMenu.waitingSubmenu = null;

                                if (menu._state.submenu && menu._state.submenu.item === item) {  // already visible
                                    return;
                                }
                                
                                if (menu._state.submenu && menu._state.submenu.item !== item) {  // hide submenus of other items
                                    DayPilot.Util.removeClass(menu._state.submenu.link.parentNode, menu.applyCssClass("item_haschildren_active"));
                                    menu._state.submenu.menu.hide();
                                    menu._state.submenu = null;
                                }

                                if (!item.items) {  // no submenu for this item
                                    return;
                                }
                                
                                var options = menu.cloneOptions();
                                options.items = item.items;
                                
                                menu._state.submenu = {};
                                menu._state.submenu.menu = new DayPilot.Menu(options);
                                menu._state.submenu.menu.show(source, {"submenu": true, "parentLink": link, "parentItem": mi});
                                menu._state.submenu.item = item;
                                menu._state.submenu.link = link;
                                DayPilot.Util.addClass(link.parentNode, menu.applyCssClass("item_haschildren_active"));
                            }, 300);
                        };
                    };
                        
                    //if (mi.items) {
                        link.onmouseover = assignOnMouseOver(mi, link);
                    //}

                    item.appendChild(link);
                }

                div.appendChild(item);

            }
            
            var delayedDismiss = function(e) {
                //console.log('delayed dismiss');
                window.setTimeout(function() {
                    DayPilotMenu.menuClean();
                    DayPilot.MenuBar.deactivate();
                }, 100);
            };

            div.onclick = delayedDismiss;
            div.ontouchend = delayedDismiss;
            
            div.onmousedown = function(e) {
                e = e || window.event;
                e.cancelBubble = true;
                if (e.stopPropagation)
                    e.stopPropagation();
            };
            div.oncontextmenu = function() {
                return false;
            };

            document.body.appendChild(div);
            menu._state.visible = true;
            menu._state.source = e;

            div.style.display = '';
            var height = div.offsetHeight;
            var width = div.offsetWidth;
            div.style.display = 'none';

            // don't show the menu outside of the visible window
            var windowHeight = document.documentElement.clientHeight;
            var windowWidth = document.documentElement.clientWidth;

            var windowMargin = (typeof options.windowMargin == "number") ? options.windowMargin : 5;

            (function showInitiator() {
                var initiator = options.initiator;
                // initiator = options.initiator;
                if (!initiator) {
                    return;
                }
                var div = initiator.div;
                var e = initiator.e;
                var area = initiator.area;
                //var options = {};
                // make sure the source area is visible
                var a = DayPilot.Areas.createArea(div, e, area);
                //div.areaInitiator = a;
                //div.areas.push(a);
                div.appendChild(a);

                // menu._initiator = a;
                initiatorAreaDiv = a;

                var abs = DayPilot.abs(a);
                options.x = abs.x;
                options.y = abs.y + abs.h + 2;
            })();


            (function adjustPosition() {

                // don't show it exactly under the cursor
                var x = (typeof options.x === "number") ? options.x : DayPilotMenu.mouse.x + 1;
                var y = (typeof options.y === "number") ? options.y : DayPilotMenu.mouse.y + 1;

                var topOffset = document.body.scrollTop || document.documentElement.scrollTop;
                var leftOffset = document.body.scrollLeft || document.documentElement.scrollLeft;

                if (y - topOffset > windowHeight - height && windowHeight !== 0) {
                    var offsetY = y - topOffset - (windowHeight - height) + windowMargin;
                    div.style.top = (y - offsetY) + 'px';
                }
                else {
                    div.style.top = y + 'px';
                }

                if (options.align === "right") {
                    x -= width;
                }

                if (x - leftOffset > windowWidth - width && windowWidth !== 0) {
                    var offsetX = x - leftOffset - (windowWidth - width) + windowMargin;
                    div.style.left = (x - offsetX) + 'px';
                }
                else {
                    div.style.left = x + 'px';
                }
/*
                if (DayPilotMenu.mouse.clientY > windowHeight - height && windowHeight !== 0) {
                    var offsetY = DayPilotMenu.mouse.clientY - (windowHeight - height) + 5;
                    div.style.top = (y - offsetY) + 'px';
                }
                else {
                    div.style.top = y + 'px';
                }

                if (DayPilotMenu.mouse.clientX > windowWidth - width && windowWidth !== 0) {
                    var offsetX = DayPilotMenu.mouse.clientX - (windowWidth - width) + 5;
                    div.style.left = (x - offsetX) + 'px';
                }
                else {
                    div.style.left = x + 'px';
                }
*/
            })();

            if (options.parentLink) {

                var parent = options.parentLink;

                var verticalOffset = parseInt(new DayPilot.StyleReader(div).get("border-top-width"));

                var pos = DayPilot.abs(options.parentLink.parentNode);
                var x = pos.x + parent.offsetWidth;
                var y = pos.y - verticalOffset;

                if (x + width > windowWidth) {
                    x = Math.max(0, pos.x - width);
                }

                var docScrollTop = document.body.scrollTop + document.documentElement.scrollTop;
                if (y + height - docScrollTop > windowHeight) {
                    y = Math.max(0, windowHeight - height + docScrollTop);
                }

                div.style.left = x + "px";
                div.style.top = y + "px";
                
            }
            div.style.display = '';

            this.addShadow(div);
            this._state.div = div;

            if (!options.submenu) {
                DayPilot.Menu.active = this;
            }

            //this._initiator = null;

        };

        this.applyCssClass = function(part) {
            var prefix = this.theme || this.cssClassPrefix;
            var sep = (this.cssOnly ? "_" : "");
            if (prefix) {
                return prefix + sep + part;
            }
            else {
                return "";
            }
        };
        
        this.cloneOptions = function() {
            var options = {};
            var properties = ['cssOnly', 'cssClassPrefix', 'useShadow', 'zIndex'];
            
            for(var i = 0; i < properties.length; i++) {
                var p = properties[i];
                options[p] = this[p];
            }
            
            return options;
        };

        this.hide = function() {
            if (this._state.submenu) {
                this._state.submenu.menu.hide();
            }
            
            this.removeShadow();
            if (this._state.div && this._state.div.parentNode === document.body) {
                document.body.removeChild(this._state.div);
            }

/*
            if (this._initiator) {
                DayPilot.de(this._initiator);
                this._initiator = null;
            }
*/

            if (initiatorAreaDiv) {
                DayPilot.de(initiatorAreaDiv);
                initiatorAreaDiv = null;
            }
            
            menu._state.visible = false;
            menu._state.source = null;
        };
        
        this.delayedHide = function() {
            DayPilotMenu.hideTimeout = setTimeout(function() {
                menu.hide();
            }, 200);
        };
        
        this.cancelHideTimeout = function() {
            clearTimeout(DayPilotMenu.hideTimeout);
        };
        
        // detects the mouse position, use when creating menu right before opening (.show)
        this.init = function(ev) {
            DayPilotMenu.mouseMove(ev);
            return this;
        };
        
        this.addShadow = function(object) {
            return; // disabled
            /*
            if (!this.useShadow || this.cssOnly) {  // shadow is disabled
                return;
            }
            if (!object) {
                return;
            }
            if (this._state.shadows && this._state.shadows.length > 0) {
                this.removeShadow();
            }
            this._state.shadows = [];

            for (var i = 0; i < 5; i++) {
                var shadow = document.createElement('div');

                shadow.style.position = 'absolute';
                shadow.style.width = object.offsetWidth + 'px';
                shadow.style.height = object.offsetHeight + 'px';

                shadow.style.top = object.offsetTop + i + 'px';
                shadow.style.left = object.offsetLeft + i + 'px';
                shadow.style.zIndex = this.zIndex;

                shadow.style.filter = 'alpha(opacity:10)';
                shadow.style.opacity = 0.1;
                shadow.style.backgroundColor = '#000000';

                document.body.appendChild(shadow);
                this._state.shadows.push(shadow);
            }
            */
        };

        this.removeShadow = function() {
            if (!this._state.shadows) {
                return;
            }

            for (var i = 0; i < this._state.shadows.length; i++) {
                document.body.removeChild(this._state.shadows[i]);
            }
            this._state.shadows = [];
        };

        var options = DayPilot.isArray(items) ? null : items;
        if (options) {
            for (var name in options) {
                this[name] = options[name];
            }
        }
        
    };

    DayPilot.MenuBar = function(id, options) {
        var menubar = this;

        var options = options || {};

        this.items = [];
        this.theme = "menubar_default";
        this.windowMargin = 0;

        this.nav = {};
        this.elements = {};
        this.elements.items = DayPilot.list();

        this._active = null;

        for (var name in options) {
            this[name] = options[name];
        }

        this._cssClass = function(cl) {
            return this.theme + "_" + cl;
        };

        this._show = function() {
            this.nav.top = document.getElementById(id);

            var top = this.nav.top;
            top.className = this._cssClass("main");

            DayPilot.list(menubar.items).each(function(item) {
                var div = document.createElement("span");
                div.innerHTML = item.text;
                div.className = menubar._cssClass("item");
                div.data = item;
                div.onclick = function() {
                    if (menubar.active && menubar.active.item === item) {
                        menubar._hideActive();
                        return;
                    }
                    if (item.children) {
                        menubar._activate(div);
                    }
                };
                div.onmousedown = function(ev) {
                    ev.stopPropagation();
                };
                div.onmouseover = function() {
                    if (menubar.active && menubar.active.item !== item) {
                        menubar._activate(div);
                    }
                };

                top.appendChild(div);
                menubar.elements.items.push(div);
            });
        };

        this._hideActive = function() {
            var activeCss = menubar._cssClass("item_active");
            menubar.elements.items.each(function(div) {
                DayPilot.Util.removeClass(div, activeCss);
            });

            if (menubar.active && menubar.active.menu) {
                menubar.active.menu.hide();
            }
            menubar.active = null;
        };

        this._isActive = function(div) {
            if (!menubar.active) {
                return false;
            }
            return menubar.active.item === div.data;
        };

        this._activate = function(div) {
            if (menubar._isActive(div)) {
                return;
            }

            menubar._hideActive();

            var item = div.data;
            var a = menubar.active = {};
            a.item = item;
            a.div = div;

            var activeCss = menubar._cssClass("item_active");
            DayPilot.Util.addClass(div, activeCss);

            var abs = DayPilot.abs(div);

            if (item.children) {
                a.menu = new DayPilot.Menu({"items": item.children});
                a.menu.show(null, { "x": abs.x + abs.w, "y": abs.y + abs.h, "align": item.align, "windowMargin": menubar.windowMargin});
            }

            DayPilot.MenuBar.active = menubar;
        };

        this.init = function() {
            this._show();
            return this;
        };
    };

    DayPilot.MenuBar.deactivate = function() {
        if (DayPilot.MenuBar.active) {
            DayPilot.MenuBar.active._hideActive();
            DayPilot.MenuBar.active = null;
        }
    };

    DayPilotMenu.menuClean = function() {
        if (typeof(DayPilot.Menu.active) === 'undefined')
            return;

        if (DayPilot.Menu.active) {
            DayPilot.Menu.active.hide();
            DayPilot.Menu.active = null;
        }

    };

    DayPilotMenu.mouseDown = function(ev) {
        if (typeof(DayPilotMenu) === 'undefined') {
            return;
        }
        DayPilotMenu.menuClean();

        DayPilot.MenuBar.deactivate();
    };
    
    DayPilotMenu.mouseMove = function(ev) {
        if (typeof(DayPilotMenu) === 'undefined') {
            return;
        }
        DayPilotMenu.mouse = DayPilotMenu.mousePosition(ev);
    };
    
    DayPilotMenu.touchMove = function(ev) {
        if (typeof(DayPilotMenu) === 'undefined') {
            return;
        }
        DayPilotMenu.mouse = DayPilotMenu.touchPosition(ev);
    };
    
    DayPilotMenu.touchStart = function(ev) {
        if (typeof(DayPilotMenu) === 'undefined') {
            return;
        }
        //DayPilotMenu.menuClean();
        DayPilotMenu.mouse = DayPilotMenu.touchPosition(ev);
    };
    
    DayPilotMenu.touchEnd = function(ev) {
        // do not call menuClean() here, it doesn't work with eventTapAndHoldHandling="ContextMenu"
        // DayPilotMenu.menuClean();
    };
    
    DayPilotMenu.touchPosition = function(ev) {
        if (!ev || !ev.touches) {
            return null;
        }
        var touch = ev.touches[0];
        var mouse = {};
        mouse.x = touch.pageX;
        mouse.y = touch.pageY;
        // mouse.clientX = touch.clientX;
        // mouse.clientY = touch.clientY;
        return mouse;
    };
    
    DayPilotMenu.mousePosition = function(e) {
        return DayPilot.mo3(document.body, e);

       /* var posx = 0;
        var posy = 0;
        var e = e || window.event;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        var result = {};
        result.x = posx;
        result.y = posy;
        result.clientY = e.clientY;
        result.clientX = e.clientX;
        return result;*/
    };

    DayPilot.Menu.touchPosition = function(ev) {
        if (ev.touches) {
            DayPilotMenu.mouse = DayPilotMenu.touchPosition(ev);
        }
    };
    // publish the API


    // (backwards compatibility)    
    //DayPilot.MonthVisible.dragStart = DayPilotMonth.dragStart;
    /*
    DayPilot.MenuVisible.Menu = DayPilotMenu.Menu;
    */

    // current
    //DayPilot.Menu = DayPilotMenu.Menu;
    if (!DayPilotMenu.handlersRegistered) {
        DayPilot.re(document, 'mousemove', DayPilotMenu.mouseMove);
        DayPilot.re(document, 'mousedown', DayPilotMenu.mouseDown);
        DayPilot.re(document, 'touchmove', DayPilotMenu.touchMove);
        DayPilot.re(document, 'touchstart', DayPilotMenu.touchStart);
        DayPilot.re(document, 'touchend', DayPilotMenu.touchEnd);
        DayPilotMenu.handlersRegistered = true;
    }

    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }


})();
