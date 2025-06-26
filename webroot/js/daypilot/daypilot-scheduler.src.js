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
    

    if (typeof DayPilot.Scheduler !== 'undefined') {
        return;
    }
    
    // temp hack
    var android = (function() {
        var nua = navigator.userAgent;
        return ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));
    })();

    //var safari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

    var DayPilotScheduler = {};

    var doNothing = function() { };

    var debug = false;

    var log = function(msg) {
        if (!debug) {
            return;
        }
        window.console && window.console.log(msg);
    };

    var qlog = function(msg) {
        if (typeof QUnit === "undefined") {
            return;
        }
        log(msg);
    };

    var console = {
        "log": log
    };

    DayPilot.Scheduler = function(id, options) {
        this.v = '2018.2.3297';

        var calendar = this;
        this.id = id; // referenced
        this.isScheduler = true;


        // default values
        this.allowDefaultContextMenu = false;
        this.allowEventOverlap = true;
        this.allowMultiMove = false;
        this.allowMultiRange = false;
        this.allowMultiResize = false;
        this.allowMultiSelect = true;
        this.api = 2;
        this.multiSelectRectangle = "Disabled";  // "Free", "Row", "Disabled"
        this.autoRefreshCommand = 'refresh';
        this.autoRefreshEnabled = false;
        this.autoRefreshInterval = 60;
        this.autoRefreshMaxCount = 20;
        this.autoScroll = "Drag";
        this.blockOnCallBack = false;
        this.navigatorBackSync = null;
        this.backendUrl = null;
        this.beforeCellRenderCaching = true;
        this.businessBeginsHour = 9;
        this.businessEndsHour = 18;
        this.businessWeekends = false;
        this.cellDuration = 60;
        this.cellGroupBy = 'Day';
        this.cellSweeping = true;
        this.cellSweepingCacheSize = 1000;
        this.cellWidth = 40;
        this.cellWidthMin = 1;
        this.cellWidthSpec = "Fixed";
        this.cellsMarkBusiness = true;
        this.cornerHtml = '';
        this.crosshairType = 'Header';
        this.cssClassPrefix = "scheduler_default";
        this.days = 1;
        this.doubleClickTimeout = 300;
        this.dragOutAllowed = false;
        this.drawBlankCells = true;
        this.durationBarHeight = 3;
        this.durationBarVisible = true;
        this.durationBarMode = "Duration";  // "Duration" | "PercentComplete"
        this.dynamicEventRendering = 'Progressive';
        this.dynamicEventRenderingMargin = 50;
        this.dynamicEventRenderingMarginX = null;
        this.dynamicEventRenderingMarginY = null;
        this.dynamicEventRenderingCacheSweeping = false;
        this.dynamicEventRenderingCacheSize = 200;
        this.dynamicLoading = false;
        this.dynamicLoadingDelayedCellRendering = false;
        this.eventEditMinWidth = 100;
        this.eventEndSpec = "DateTime";
        this.eventHeight = 25;
        this.eventHtmlLeftMargin = 10;
        this.eventHtmlRightMargin = 10;
        this.eventMarginLeft = 0;
        this.eventMarginRight = 0;
        this.eventMarginBottom = 0;
        this.eventMinWidth = 1;
        this.eventMoveMargin = 5;
        this.eventMoveToPosition = false;
        this.eventMoveSkipNonBusiness = false;
        this.eventResizeMargin = 5;
        this.eventStackingLineHeight = 100;
        this.eventTapAndHoldHandling = "Move";  // or "ContextMenu"
        this.eventTextWrappingEnabled = false;
        this.eventUpdateInplaceOptimization = false;
        this.eventsLoadMethod = "GET";
        this.eventVersionsEnabled = false;
        this.eventVersionHeight = 25;
        this.eventVersionMargin = 2;
        this.eventVersionPosition = "Above";
        this.floatingEvents = false;
        this.floatingTimeHeaders = false;
        this.groupConcurrentEvents = false;
        this.groupConcurrentEventsLimit = 1;
        this.headerHeight = 20;
        this.heightSpec = 'Auto';
        this.height = 300;
        this.hideBorderFor100PctHeight = false;
        this.hideUntilInit = true;
        this.infiniteScrollingEnabled = false;
        this.infiniteScrollingMargin = 50;
        this.infiniteScrollingStepDays = 30;
        this.initEventEnabled = true;
        this.jointEventsResize = true;
        this.jointEventsMove = true;
        this.layout = 'Auto';
        this.linkCreateHandling = "Disabled";
        this.linkBottomMargin = 10;
        this.linkPointSize = 10;
        this.linksLoadMethod = "GET";
        this.locale = "en-us";
        this.loadingLabelText = "Loading...";
        this.loadingLabelVisible = true;
        this.overrideWheelScrolling = false;
        this.messageBarPosition = "Top";
        this.messageHideAfter = 5000;
        this.messageHideOnMouseOut = true;
        this.multiMoveVerticalMode = "Disabled"; // options: "Disabled", "Master", "All"
        this.moveBy = 'Full';
        this.notifyCommit = 'Immediate'; // or 'Queue'
        this.progressiveRowRendering = false;
        this.progressiveRowRenderingPreload = 25;
        this.rowCreateHeight = null;
        this.rowCreateHtml = "New row...";
        this.rowHeaderColumnDefaultWidth = 80;
        this.rowHeaderHideIconEnabled = false;
        this.rowHeaderScrolling = false;
        this.rowHeaderSplitterWidth = 3;
        this.rowHeaderWidthAutoFit = true;
        this.rowHeaderWidthMarginRight = 0;
        this.rowHeaderCols = null;
        this.rowHeaderWidth = 80;
        this.rowMarginBottom = 0;
        this.rowMarginTop = 0;
        this.rowMinHeight = 0;
        this.rowsLoadMethod = "GET";
        this.scale = "CellDuration";
        this.scrollDelayDynamic = 500;
        this.scrollDelayEvents = 200;
        this.scrollDelayCells = 50;
        this.scrollDelayFloats = 100;
        this.scrollStep = null;
        this.scrollX = 0;
        this.scrollY = 0;
        this.selectedRows = [];
        this.separators = [];
        this.showNonBusiness = true;
        this.showToolTip = true;
        this.snapToGrid = true;
        this.startDate = DayPilot.Date.today();
        this.syncResourceTree = false;
        this.tapAndHoldTimeout = 300;
        this.timeHeaders = [ {"groupBy": "Default"}, {"groupBy": "Cell"} ];
        this.timeHeaderTextWrappingEnabled = false;
        this.treeAutoExpand = true;
        this.treeEnabled = false;
        this.treeIndent = 20;
        this.treeImageMarginLeft = 5;
        this.treeImageMarginTop = 5;
        this.treePreventParentUsage = false;
        this.timeFormat = "Auto";
        this.timeline = null;
        this.useEventBoxes = 'Always';
        this.viewType = 'Resources';
        this.visible = true;
        this.watchWidthChanges = true;
        this.weekStarts = 'Auto'; // 0 = Sunday, 1 = Monday, ... 'Auto' = use .locale
        this.width = null;

        this.eventClickHandling = 'Enabled';
        this.eventDeleteHandling = "Disabled";
        this.eventHoverHandling = 'Bubble';
        this.eventDoubleClickHandling = 'Disabled';
        this.eventEditHandling = 'Update';
        this.eventMoveHandling = 'Update';
        this.eventResizeHandling = 'Update';
        this.eventRightClickHandling = 'ContextMenu';
        this.eventSelectHandling = 'Update';
        this.resourceCollapseHandling = "Enabled";
        this.resourceExpandHandling = "Enabled";
        this.rowClickHandling = 'Enabled';
        this.rowDoubleClickHandling = "Disabled";
        this.rowCreateHandling = "Disabled";
        this.rowEditHandling = 'Update';
        this.rowHeaderColumnResizedHandling = "Update";
        this.rowSelectHandling = 'Update';
        this.rowMoveHandling = "Disabled";
        this.timeHeaderClickHandling = "Enabled";
        this.timeRangeClickHandling = "Enabled";
        this.timeRangeDoubleClickHandling = 'Disabled';
        this.timeRangeSelectedHandling = 'Enabled';
        this.timeRangeRightClickHandling = "ContextMenu";  // "ContextMenu", "Enabled", "Disabled"

        this.timeRangeSelectingStartEndEnabled = false;
        this.timeRangeSelectingStartEndFormat = "MMMM d, yyyy";
        this.eventMovingStartEndEnabled = false;
        this.eventMovingStartEndFormat = "MMMM d, yyyy";
        this.eventResizingStartEndEnabled = false;
        this.eventResizingStartEndFormat = "MMMM d, yyyy";

        if (typeof DayPilot.Bubble === "function") {
            this.bubble = new DayPilot.Bubble();
            this.cellBubble = new DayPilot.Bubble();
            this.resourceBubble = new DayPilot.Bubble();
        } else {
            this.bubble = null;
            this.cellBubble = null;
            this.resourceBubble = null;
        }

        // IE-specific default values
        if (DayPilot.browser.ie) {
            this.scrollDelayCells = 100;
            this.scrollDelayFloats = 100;
        }

        if (calendar.api === 1) {
            this.onEventMove = function() { };
            this.onEventResize = function() { };
            this.onResourceExpand = function() { };
            this.onResourceCollapse = function() { };
        }

        this.onEventClick = null;
        this.onEventClicked = null;
        this.onEventMove = null;
        this.onEventMoved = null;
        this.onEventMoving = null;
        this.onEventResize = null;
        this.onEventResized = null;
        this.onEventResizing = null;
        this.onEventRightClick = null;
        this.onEventRightClicked = null;
        this.onEventMouseOver = null;  // TODO rename to onEventMouseEnter?
        this.onEventMouseOut = null;  // TODO rename to onEventMouseLeave?
        this.onRowClick = null;
        this.onRowClicked = null;
        this.onTimeRangeClick = null;
        this.onTimeRangeClicked = null;
        this.onTimeRangeDoubleClick = null;
        this.onTimeRangeDoubleClicked = null;
        this.onTimeRangeSelect = null;
        this.onTimeRangeSelected = null;
        this.onTimeRangeSelecting = null;
        this.onTimeRangeRightClick = null;
        this.onTimeRangeRightClicked = null;
        this.onRowHeaderResized = null;
        this.onCellMouseOver = null;  // TODO rename to onCellMouseEnter?
        this.onCellMouseOut = null;  // TODO rename to onCellMouseLeave?
        this.onGridMouseDown = null;

        this.onBeforeCellRender = null;
        this.onBeforeEventRender = null;
        this.onBeforeTimeHeaderRender = null;
        this.onBeforeResHeaderRender = null;
        this.onBeforeRowHeaderRender = null;

        this.onBeforeCellExport = null;
        this.onBeforeEventExport = null;
        this.onBeforeTimeHeaderExport = null;
        this.onBeforeRowHeaderExport = null;

        this.onEventFilter = null;
        this.onRowFilter = null;

        this.onRectangleEventSelecting = null;
        this.onRectangleEventSelect = null;
        this.onRectangleEventSelected = null;

        //this.onHeightChanged = null;  // do not expose it on the object - use onDimensionsChanged
        this.onDimensionsChanged = null;
        this.onAfterUpdate = null;

        // internal
        this._autoRefreshCount = 0;
        this._cellPropertiesLazyLoading = true; // server-based only
        this._cellPropertiesExpanded = false;
        this._cellStacking = false;
        this._cellStackingAutoHeight = false;
        this._crosshairLastY = -1;
        this._crosshairLastX = -1;
        this._disposed = false;
        this._innerHeightTree = -1;
        this._ganttAppendToResources = false;
        this._previousVisible = true;

        // internal, name kept non-minified for debugging purposes
        this.rowlist = DayPilot.list();
        this.itline = DayPilot.list();

        this.events = {};
        this.cells = {};

        // store the element references
        this.elements = {};
        this.elements.events = [];
        this.elements.bars = [];
        this.elements.text = [];
        this.elements.cells = [];
        this.elements.linesVertical = [];  // required for height updating
        this.elements.separators = [];
        this.elements.range = [];
        this.elements.breaks = [];
        this.elements.links = [];
        this.elements.linkpoints = [];
        this.elements.rectangle = [];
        this.elements.hover = [];

        this._cache = {};
        this._cache.cells = [];
        this._cache.linesVertical = {};
        this._cache.linesHorizontal = {};
        this._cache.timeHeaderGroups = [];
        this._cache.timeHeader = {};
        this._cache.pixels = [];
        this._cache.breaks = [];
        this._cache.events = []; // processed using client-side beforeEventRender
        
        this.clientState = {};

        this.members = {};
        this.members.obsolete = [
            "Init",
            "cleanSelection",
            "cssClassPrefix",
            "getHScrollPosition",
            "setHScrollPosition",
            "getVScrollPosition",
            "setVScrollPosition",
            "showBaseTimeHeader"
        ];
        this.members.ignoreFilter = function(name) {
            if (name.indexOf("div") === 0) {
                return true;
            }
            return false;
        };
        this.members.ignore = [
            "internal",
            "nav",
            "debug",
            "temp",
            "elements",
            "members",
            "cellProperties",
            "itline",
            "rowlist",
            "timeHeader",
            "timeouts",
            "rowHeaderCols"
        ];
        this.members.noCssOnly = [];

        this._productCode = 'javasc';

        this.nav = {};

        this._updateView = function(result, context) {
            var result = JSON.parse(result);

            calendar.onScrollCalled = false;

            if (result.CallBackRedirect) {
                document.location.href = result.CallBackRedirect;
                return;
            }

            if (typeof calendar.onCallBackResult === "function") { // internal API
                var args = {};
                args.result = result;
                args.preventDefault = function() {
                    args.preventDefault.value = true;
                };
                calendar.onCallBackResult(args);

                if (args.preventDefault.value) {

                    //calendar._updateFloats();
                    calendar._deleteDragSource();
                    calendar._loadingStop();
                    calendar._startAutoRefresh();

                    if (result.Message) {
                        if (calendar.message) { // condition can be removed as soon as message() is implemented properly
                            calendar.message(result.Message);
                        }
                    }

                    calendar._fireAfterRenderDetached(result.CallBackData, true);
                    calendar._doCallBackEnd();
                    calendar._clearCachedValues();

                    return;
                }
            }

            if (result.BubbleGuid) {
                var guid = result.BubbleGuid;
                var bubble = this.bubbles[guid];
                delete this.bubbles[guid];

                calendar._loadingStop();
                if (typeof result.Result.BubbleHTML !== 'undefined' && bubble) {
                    bubble.updateView(result.Result.BubbleHTML, bubble);
                }
                calendar._doCallBackEnd();
                return;
            }
            
            if (typeof DayPilot.Bubble !== "undefined") {
                DayPilot.Bubble.hideActive();
            }

            if (typeof result.ClientState !== 'undefined') {
                if (result.ClientState === null) {
                    calendar.clientState = {};
                }
                else {
                    calendar.clientState = result.ClientState;
                }
            }

            if (result.UpdateType === "None") {
                calendar._loadingStop();
                calendar._doCallBackEnd();

                //calendar.afterRender(result.CallBackData, true);

                if (result.Message) {
                    calendar.message(result.Message);
                }

                calendar._fireAfterRenderDetached(result.CallBackData, true);

                return;
            }

            // update config
            if (result.VsUpdate) {
                var vsph = document.createElement("input");
                vsph.type = 'hidden';
                vsph.name = calendar.id + "_vsupdate";
                vsph.id = vsph.name;
                vsph.value = result.VsUpdate;
                calendar._vsph.innerHTML = '';
                calendar._vsph.appendChild(vsph);
            }

            if (typeof result.TagFields !== 'undefined') {
                calendar.tagFields = result.TagFields;
            }

            if (typeof result.SortDirections !== 'undefined') {
                calendar.sortDirections = result.SortDirections;
            }
            
            calendar._cache.drawArea = null;

            if (result.UpdateType === "Full") {
                // generated
                calendar.resources = result.Resources;
                calendar.colors = result.Colors;
                calendar.palette = result.Palette;
                calendar.dirtyColors = result.DirtyColors;
                calendar.cellProperties = result.CellProperties;
                calendar.cellConfig = result.CellConfig;
                calendar.separators = result.Separators;
                calendar.timeline = result.Timeline;
                calendar.timeHeader = result.TimeHeader;
                calendar.timeHeaders = result.TimeHeaders;
                if (typeof result.Links !== "undefined") { calendar.links.list = result.Links; }
                if (typeof result.RowHeaderColumns !== 'undefined') calendar.rowHeaderColumns = result.RowHeaderColumns;

                // properties
                calendar.startDate = result.StartDate ? new DayPilot.Date(result.StartDate) : calendar.startDate;
                calendar.days = result.Days ? result.Days : calendar.days;
                calendar.cellDuration = result.CellDuration ? result.CellDuration : calendar.cellDuration;
                calendar.cellGroupBy = result.CellGroupBy ? result.CellGroupBy : calendar.cellGroupBy;
                calendar.cellWidth = result.CellWidth ? result.CellWidth : calendar.cellWidth;
                if (typeof result.Scale !== 'undefined') calendar.scale = result.Scale;
                // scrollX
                // scrollY
                calendar.viewType = result.ViewType ? result.ViewType : calendar.viewType;
                // calendar.hourNameBackColor = result.HourNameBackColor ? result.HourNameBackColor : calendar.hourNameBackColor;
                if (typeof result.ShowNonBusiness !== 'undefined') calendar.showNonBusiness = result.ShowNonBusiness;
                calendar.businessBeginsHour = result.BusinessBeginsHour ? result.BusinessBeginsHour : calendar.businessBeginsHour;
                calendar.businessEndsHour = result.BusinessEndsHour ? result.BusinessEndsHour : calendar.businessEndsHour;
                if (typeof result.DynamicLoading !== 'undefined') calendar.dynamicLoading = result.DynamicLoading;
                if (typeof result.TreeEnabled !== 'undefined') calendar.treeEnabled = result.TreeEnabled;
                // calendar.backColor = result.BackColor ? result.BackColor : calendar.backColor;
                // calendar.nonBusinessBackColor = result.NonBusinessBackColor ? result.NonBusinessBackColor : calendar.nonBusinessBackColor;
                calendar.locale = result.Locale ? result.Locale : calendar.locale;
                if (typeof result.TimeZone !== 'undefined') calendar.timeZone = result.TimeZone;
                calendar.timeFormat = result.TimeFormat ? result.TimeFormat : calendar.timeFormat;
                calendar.rowHeaderCols = result.RowHeaderCols ? result.RowHeaderCols : calendar.rowHeaderCols;
                if (typeof result.DurationBarMode !== "undefined") calendar.durationBarMode = result.DurationBarMode;
                //if (typeof result.ShowBaseTimeHeader !== "undefined") calendar.showBaseTimeHeader = result.ShowBaseTimeHeader;

                // calendar.cornerBackColor = result.CornerBackColor ? result.CornerBackColor : calendar.cornerBackColor;
                if (typeof result.CornerHTML !== 'undefined') { calendar.cornerHtml = result.CornerHTML; }

                calendar.hashes = result.Hashes;

                calendar._calculateCellWidth();
                calendar._prepareItline();

                calendar._loadResources();
                calendar._expandCellProperties();

            }
            if (result.Action !== "Scroll") {
                calendar._loadEvents(result.Events);
            }

            if (result.UpdateType === 'Full') {
                calendar._drawResHeader();
                calendar._drawTimeHeader();
            }

            calendar._prepareRowTops();
            calendar._show();
            //calendar._updateHeight(); // test
            calendar._resize();

            calendar._cache.drawArea = null;

            if (result.Action !== "Scroll") {
                calendar._updateRowHeaderHeights();
                calendar._updateHeaderHeight();

                if (calendar.heightSpec === 'Auto' || calendar.heightSpec === 'Max') {
                    calendar._updateHeight();
                }

                calendar._deleteCells();
                calendar._deleteEvents();
                calendar._deleteSeparators();

                calendar.multiselect.clear(true);
                calendar.multiselect._loadList(result.SelectedEvents);

                calendar._drawCells();
                calendar._drawSeparators();
                calendar._drawEvents();
            }
            else {
                calendar.multiselect.clear(true);
                calendar.multiselect._loadList(result.SelectedEvents);

                //calendar._updateRowsNoLoad(updatedRows, true);

                // draw events not called here because it's now called in loadEventsDynamic
                //calendar._drawCells();

                calendar._loadEventsDynamic(result.Events);
            }

            if (calendar.timeRangeSelectedHandling !== "HoldForever") {
                calendar._deleteRange();
            }

            if (result.UpdateType === "Full") {
                calendar.setScroll(result.ScrollX, result.ScrollY);
                calendar._saveState();
            }
            
            calendar._updateFloats();
            
            calendar._deleteDragSource();

            if (result.SelectedRows) {
                calendar._loadSelectedRows(result.SelectedRows);
            }

            calendar._loadingStop();
            
            if (result.UpdateType === 'Full' && navigator.appVersion.indexOf("MSIE 7.") !== -1) { // ugly bug, ugly fix - the time header disappears after expanding a dynamically loaded tree node
                window.setTimeout(function() {
                    calendar._drawResHeader();
                    calendar._updateHeight();
                }, 0);
            }

            calendar._startAutoRefresh();

            if (result.Message) {
                if (calendar.message) { // condition can be removed as soon as message() is implemented properly
                    calendar.message(result.Message);
                }
            }

            calendar._fireAfterRenderDetached(result.CallBackData, true);

            calendar._doCallBackEnd();

            calendar._clearCachedValues();

            if (result.UpdateType === 'Full' && result.Action !== "Scroll" && !calendar.onScrollCalled) {
                setTimeout(function() {
                    calendar._onScroll();
                }, 0);
            }
        };
        
        this._deleteDragSource = function() {
            if (calendar.todo) {
                if (calendar.todo.del) {
                    var del = calendar.todo.del;
                    del.parentNode.removeChild(del);
                    calendar.todo.del = null;
                }
            }
        };

        this._fireAfterRenderDetached = function(data, isCallBack) {
            var afterRenderDelayed = function(data, isc) {
                return function() {
                    if (calendar._api2()) {
                        if (typeof calendar.onAfterRender === 'function') {
                            var args = {};
                            args.isCallBack = isc;
                            args.isScroll = false;
                            args.data = data;
                            
                            calendar.onAfterRender(args);
                        }
                    }
                    else {
                        if (calendar.afterRender) {
                            calendar.afterRender(data, isc);
                        }
                    }
                };
            };

            window.setTimeout(afterRenderDelayed(data, isCallBack), 0);
        };

        this.scrollTo = function(date, animated, position) {
            if (calendar._angular2.enabled) {
                calendar._angular2.scrollToRequested = date;
                setTimeout(function() {
                    var date = calendar._angular2.scrollToRequested;
                    if (date) {
                        calendar._scrollTo(date, animated, position);
                    }
                }, 0);
            }
            else {
                calendar._scrollTo(date, animated, position);
            }
        };

        this._scrollTo = function(date, animated, position) {
            if (!date) {
                return;
            }

            if (!calendar._initialized) {
                calendar._scrollToAfterInit = {date: date, animated: animated, position: position};
                return;
            }

            if (calendar.viewType === "Days") {
                var row = calendar._findRowInDaysView(new DayPilot.Date(date));
                if (!row) {
                    return;
                }
                setTimeout(function() {
                    var scrollY = row.top;
                    calendar.nav.scroll.scrollTop = scrollY;
                }, 100);

                return;
            }

            var pixels;
            if (date instanceof DayPilot.Date) {
                pixels = this.getPixels(date).left;
            }
            else if (typeof date === "string") {
                pixels = this.getPixels(new DayPilot.Date(date)).left;
            }
            else if (typeof date === "number") {
                pixels = date;
            }
            else {
                throw "Invalid scrollTo() parameter. Accepted parameters: string (ISO date), number (pixels), DayPilot.Date object";
            }

            var max = this._maind.clientWidth;
            var width = this.nav.scroll.clientWidth;

            position = position || "left";
            switch(position.toLowerCase()) {
                case "left":
                    break;
                case "middle":
                    pixels -= width/2;
                    break;
                case "right":
                    pixels -= width;
                    break;
            }

            if (pixels < 0) {
                pixels = 0;
            }

            if (pixels > max - width) {
                pixels = max - width;
            }

            if (!animated) {
                calendar._setScrollX(pixels);
                return;
            }

            var distance = Math.abs(calendar.nav.scroll.scrollLeft - pixels);
            var percentage = distance / max;

            var steps = 50;


            if (typeof animated === "number") {
                steps = animated;
            }
            else if (typeof animated === "string") {
                switch (animated) {
                    case "fast":
                        steps = 30;
                        break;
                    case "normal":
                        steps = 50;
                        break;
                    case "slow":
                        steps = 100;
                        break;
                    case "linear":
                        steps = Math.floor(100 * percentage);
                        break;
                }
            }

            if (percentage > .6) {  //
                steps = Math.min(steps, 80);
            }

            this._scrollToAnimated(pixels, steps);
        };

        this._scrollToAnimated = function(pixels, steps) {
            var plan = {};
            plan.steps = [];
            plan.index = 0;
            plan.delay = 10;
            plan.next = function() {
                var step = plan.steps[plan.index];
                plan.index += 1;
                return step;
            };
            plan.finished = function() {
                calendar._onScroll();
            };

            var pos = calendar.getScrollX();
            var steps = steps || 100;
            var diff = pixels - pos;

            for (var i = 0; i < steps; i++) {
                var x = i/steps;
                var pct = ((x-.5)*2)/(Math.pow(((x-0.5)*2),2)+1)+.5;
                plan.steps.push(pos + diff*pct);
            }

            plan.steps.push(pixels);

            scrollStep(plan);

            function scrollStep(plan) {
                var step = plan.next();
                if (typeof step === "undefined") {
                    plan.finished && plan.finished();
                    return;
                }
                calendar.setScrollX(step);
                window.clearTimeout(calendar.refreshTimeout);
                setTimeout(function() {
                    scrollStep(plan);
                }, plan.delay);
            }

        };

        this.scrollToResource = function(id) {
            DayPilot.complete(function() {
                var row = calendar._findRowByResourceId(id);
                if (!row) {
                    return;
                }
                setTimeout(function() {
                    var scrollY = row.top;
                    calendar.nav.scroll.scrollTop = scrollY;
                }, 100);

            });
        };
        
        this._findHeadersInViewPort = function() {
            
            if (!this.floatingTimeHeaders) {
                return;
            }
            
            if (!this.timeHeader) {
                return;
            }

            var area = this._getDrawArea();
            if (!area) {
                return;
            }

            this._deleteHeaderSections();

            var start = area.pixels.left + infitools.shiftX;
            var end = area.pixels.right + infitools.shiftX;
            
            var cells = [];
            
            for (var y = 0; y < this.timeHeader.length; y++) {
                for (var x = 0; x < this.timeHeader[y].length; x++) {
                    var h = this.timeHeader[y][x];
                    var left = h.left;
                    var right = h.left + h.width;
                    
                    var cell = null;
                    
                    if (left < start && start < right) {
                        cell = {};
                        cell.x = x;
                        cell.y = y;
                        cell.marginLeft = start - left;
                        cell.marginRight = 0;
                        cell.div = this._cache.timeHeader[x + "_" + y];
                        cells.push(cell);
                    }
                    if (left < end && end < right) {
                        if (!cell) {
                            cell = {};
                            cell.x = x;
                            cell.y = y;
                            cell.marginLeft = 0;
                            cell.div = this._cache.timeHeader[x + "_" + y];
                            cells.push(cell);
                        }
                        cell.marginRight = right - end;
    
                        break; // end of this line
                    }
                }
            }
            
            for (var i = 0; i < cells.length; i++) {
                var cell = cells[i];
                this._createHeaderSection(cell.div, cell.marginLeft, cell.marginRight);
            }
            
        };
        
        this._updateFloats = function() {
            this._findHeadersInViewPort();
            this._findEventsInViewPort();
        };

        this._viewport = {};

        var viewport = this._viewport;

        viewport.eventsInRectangle = function(x, y, width, height) {
            var startX = x;
            var endX = x + width;

            var startY = y;
            var endY = y + height;

            return DayPilot.list(calendar.elements.events).filter(function(e) {
                var data = e.event;
                var left = data.part.left;
                var right = data.part.left + data.part.width;

                var row = calendar.rowlist[data.part.dayIndex];
                var top = row.top + data.part.top;
                var bottom = top + data.part.height;

                if (DayPilot.Util.overlaps(left, right, startX, endX) && DayPilot.Util.overlaps(top, bottom, startY, endY)) {
                    return true;
                }
            });
        };

        viewport.events = function(type) {
            var list = [];
            var type = type || "All";

            var area = calendar._getDrawArea();
            if (!area) {
                return DayPilot.list(list);
            }

            var start = area.pixels.left;
            var end = area.pixels.right;


            for(var i = 0; i < calendar.elements.events.length; i++) {
                var e = calendar.elements.events[i];
                var data = e.event;
                var left = data.part.left;
                var right = data.part.left + data.part.width;

                switch (type) {
                    case "Left":
                        if (left < start && start < right) {
                            list.push(e);
                        }
                        break;
                    case "All":
                        if (DayPilot.Util.overlaps(left, right, start, end)) {
                            list.push(e);
                        }
                        break;
                }
            }
            return DayPilot.list(list).addProps({ "area": area});
        };
        
        this._findEventsInViewPort = function() {

            if (!this.floatingEvents) {
                return;
            }

            var events = viewport.events("Left");

            this._deleteEventSections();

            events.filter(function(item) {
                return item.event.data.type !== "Milestone";
            }).forEach(function(item) {
                var e = item.event;
                var left = events.area.pixels.left;
                var start = e.part.left;
                var marginLeft = left - start;
                calendar._createEventSection(item, marginLeft, 0);
            });

        };
        
        this.elements.sections = [];
        this.elements.hsections = [];
        
        this._createHeaderSection = function(div, marginLeft, marginRight) {
            var section = document.createElement("div");
            section.setAttribute("unselectable", "on");
            section.className = this._prefixCssClass("_timeheader_float");
            section.style.position = "absolute";
            section.style.left = marginLeft + "px";
            section.style.right = marginRight + "px";
            section.style.top = "0px";
            section.style.bottom = "0px";
            //section.style.backgroundColor = "red";
            //section.style.color = "white";
            section.style.overflow = "hidden";
            
            var inner = document.createElement("div");
            inner.className = this._prefixCssClass("_timeheader_float_inner");
            inner.setAttribute("unselectable", "on");

            var props = div.cell.th;
            if (props.innerHTML) {
                inner.innerHTML = props.innerHTML;
            }
            if (props.fontColor) {
                inner.style.color = props.fontColor;
            }
            section.appendChild(inner);
            
            div.section = section;

            //div.appendChild(section);
            div.insertBefore(section, div.firstChild.nextSibling); // after inner
            div.firstChild.innerHTML = ''; // hide the content of inner temporarily
            
            this.elements.hsections.push(div);
        };
        
        this._deleteHeaderSections = function() {
            for (var i = 0; i < this.elements.hsections.length; i++) {
                var e = this.elements.hsections[i];
                
                // restore HTML in inner
                var data = e.cell;
                if (data && e.firstChild) { // might be deleted already
                    e.firstChild.innerHTML = data.th.innerHTML;  
                }
                
                DayPilot.de(e.section);
                e.section = null;
            }
            this.elements.hsections = [];
        };

        this._createEventSection = function(div, marginLeft, marginRight) {

            var section = document.createElement("div");
            section.setAttribute("unselectable", "on");
            section.className = this._prefixCssClass(cssNames.eventFloat);
            section.style.position = "absolute";
            section.style.left = marginLeft + "px";
            section.style.right = marginRight + "px";
            section.style.top = "0px";
            section.style.bottom = "0px";
            section.style.overflow = "hidden";

            var inner = document.createElement("div");
            inner.className = this._prefixCssClass(cssNames.eventFloatInner);
            inner.setAttribute("unselectable", "on");
            inner.innerHTML = div.event.client.html();
            if (div.event.data.fontColor) {
                inner.style.color = div.event.data.fontColor;
            }
            section.appendChild(inner);

            div.section = section;

            div.insertBefore(section, div.firstChild.nextSibling); // after inner
            div.firstChild.innerHTML = ''; // hide the content of inner temporarily

            var e = div.event;
            var areas = e.cache ? e.cache.areas : e.data.areas;
            areas = areas || [];

            var options = {
                "offsetX": calendar._cachedSegmentOffsetX(inner),
                "eventDiv": div,
                "areas": areas.filter(function(a) { return !(a.start || e.end); })  // only fixed-position areas
            };

            // DayPilot.Areas.remove(section);
            DayPilot.Areas.attach(section, div.event, options);
            DayPilot.Areas.disable(div);

            this.elements.sections.push(div);
        };

        this._cachedSegmentOffsetXValue = null;
        this._cachedSegmentOffsetX = function(inner) {
            if (calendar._cachedSegmentOffsetXValue === null) {
                calendar._cachedSegmentOffsetXValue = parseInt(new DayPilot.StyleReader(inner).get("padding-left"));
            }
            return calendar._cachedSegmentOffsetXValue;
        };
        
        this._deleteEventSections = function() {
            for (var i = 0; i < this.elements.sections.length; i++) {
                var e = this.elements.sections[i];
                
                // restore HTML in inner
                var data = e.event;
                if (data) { // might be deleted already
                    e.firstChild.innerHTML = data.client.html();  
                }
                
                DayPilot.de(e.section);
                DayPilot.Areas.enable(e);

                e.section = null;
            }
            this.elements.sections = [];
        };
        
        this.setScrollX = function(scrollX) {
            if (!calendar._angular2.enabled) {
                calendar._setScrollX(scrollX);
            }
            else {
                calendar._angular2.scrollXRequested = scrollX;
                setTimeout(function() {
                    var scrollX = calendar._angular2.scrollXRequested;
                    if (typeof scrollX === "number") {
                        calendar._setScrollX(scrollX);
                    }
                }, 0);
            }
        };

        this._setScrollX = function(scrollX) {
            var scroll = calendar.nav.scroll;
            var maxWidth = calendar._getGridWidth();

            if (scroll.clientWidth + scrollX > maxWidth) {
                scrollX = maxWidth - scroll.clientWidth;
            }

            calendar.divTimeScroll.scrollLeft = scrollX;
            scroll.scrollLeft = scrollX;

        };
        
        this.setScrollY = function(scrollY) {
            var options = options || {};

            if (!calendar._angular2.enabled) {
                calendar._setScrollY(scrollY);
            }
            else {
                calendar._angular2.scrollYRequested = scrollY;
                setTimeout(function() {
                    var scrollY = calendar._angular2.scrollYRequested;
                    if (typeof scrollY === "number") {
                        calendar._setScrollY(scrollY);
                    }
                }, 0);
            }
        };

        this._setScrollY = function(scrollY) {
            var scroll = calendar.nav.scroll;
            var maxHeight = calendar._innerHeightTree;

            if (scroll.clientHeight + scrollY > maxHeight) {
                scrollY = maxHeight - scroll.clientHeight;
            }

            calendar.divResScroll.scrollTop = scrollY;
            scroll.scrollTop = scrollY;
        };

        this.setScroll = function(scrollX, scrollY) {
            calendar.setScrollX(scrollX);
            calendar.setScrollY(scrollY);
        };
        
        this.message = function(html, delay) {
            if (html === null) {
                return;
            }

            var options = {};
            if (typeof arguments[1] === "object") {
                options = arguments[1];
                delay = options.delay;
            }

            var delay = delay || this.messageHideAfter || 2000;

            var top = this._getTotalHeaderHeight() + 1;
            var left = this._getOuterRowHeaderWidth() + resolved.splitterWidth();
            var right = DayPilot.sw(calendar.nav.scroll) + 1;
            var bottom = DayPilot.sh(calendar.nav.scroll) + 1;

            var div;
            
            if (!this.nav.message) {
                div = document.createElement("div");
                div.style.position = "absolute";
                //div.style.width = "100%";
                div.style.left = left + "px";
                div.style.right = right + "px";
                //div.style.height = "0px";
                //div.style.paddingLeft = left + "px";
                //div.style.paddingRight = right + "px";
                
                //div.style.opacity = 1;  
                //div.style.filter = "alpha(opacity=100)"; // enable fading in IE8
                div.style.display = 'none';

                DayPilot.re(div, DayPilot.touch.start, function(e) {
                    calendar.nav.message.style.display = 'none';
                    e.preventDefault();
                    e.stopPropagation();
                });
                
                div.onmousemove = function() {
                    if (!calendar.messageHideOnMouseOut) {
                        return;
                    }
                    if (div.messageTimeout && !div.status) {
                        clearTimeout(div.messageTimeout);
                    }
                };
                
                div.onmouseout = function() {
                    if (!calendar.messageHideOnMouseOut) {
                        return;
                    }
                    if (calendar.nav.message.style.display !== 'none') {
                        div.messageTimeout = setTimeout(calendar._hideMessage, 500);
                    }
                };

                var inner = document.createElement("div");
                inner.onclick = function() { calendar.nav.message.style.display = 'none'; };
                inner.className = this._prefixCssClass("_message");
                div.appendChild(inner);

                var close = document.createElement("div");
                close.style.position = "absolute";
                close.className = this._prefixCssClass("_message_close");
                close.onclick = function() { calendar.nav.message.style.display = 'none'; };
                div.appendChild(close);

                this.nav.top.appendChild(div);
                this.nav.message = div;

            }
            else {
                div = calendar.nav.message;
            }

            var showNow = function() {

                var div = calendar.nav.message;
                //div.className = calendar._prefixCssClass("_message");
                div.firstChild.className = calendar._prefixCssClass("_message"); // clear any custom css thay may have been set

                if (options.cssClass) {
                    DayPilot.Util.addClass(div.firstChild, options.cssClass);
                }

                var inner = calendar.nav.message.firstChild;
                inner.innerHTML = html;

                // update the right margin (scrollbar width)
                var right = DayPilot.sw(calendar.nav.scroll) + 1;
                calendar.nav.message.style.right = right + "px";
                
                // always update the position
                var position = calendar.messageBarPosition || "Top";
                if (position === "Bottom") {
                    calendar.nav.message.style.bottom = bottom + "px";
                    calendar.nav.message.style.top = "";
                }
                else if (position === "Top") {
                    calendar.nav.message.style.bottom = "";
                    calendar.nav.message.style.top = top + "px";
                }

                var end = function() { div.messageTimeout = setTimeout(calendar._hideMessage, delay); };
                DayPilot.fade(calendar.nav.message, 0.2, end);
            };

            clearTimeout(div.messageTimeout);

            // another message was visible
            if (this.nav.message.style.display !== 'none') {
                DayPilot.fade(calendar.nav.message, -0.2, showNow);
            }
            else {
                showNow();
            }
        };

        this._hideMessage = function() {
            if (!calendar.nav) {
                return;
            }
            if (!calendar.nav.message) {
                return;
            }

            var end = function() { 
                calendar.nav.message.style.display = 'none'; 
            };
            DayPilot.fade(calendar.nav.message, -0.2, end);
        };

        this._hideMessageNow = function() {
            if (!calendar.nav) {
                return;
            }
            if (!calendar.nav.message) {
                return;
            }
            calendar.nav.message.style.display = 'none';
        };

        this.message.show = function(html) {
            calendar.message(html);
        };
        
        this.message.hide = function() {
            calendar._hideMessage();
        };

        this._originalBorder = null;

        // updates the height after a resize
        this._updateHeight = function() {

            // only if the control is not disposed already
            if (!this.nav.scroll) {
                return;
            }

            (function fromDrawCells() {
                var width = calendar._getGridWidth();

                calendar._maind.style.height = calendar._innerHeightTree + "px";
                calendar._maind.style.width = width + "px";

                if (calendar.cellWidthSpec === "Auto" && !calendar._minCellWidthApplied) {
                    calendar.nav.scroll.style.overflowX = "hidden";
                    calendar.nav.scroll.scrollLeft  = 0;
                }
                else {
                    if (width > calendar.nav.scroll.clientWidth) {
                        calendar.nav.scroll.style.overflowX = "auto";
                    }
                    else {
                        calendar.nav.scroll.style.overflowX = "hidden";
                    }
                }
            })();


            var dividerHeight = 1;

            if (this._originalBorder !== null) {
                this.nav.top.style.border = this._originalBorder;
                this._originalBorder = null;
            }

            if (this.heightSpec === 'Parent100Pct' || this.heightSpec === "Max100Pct") {
                // similar to setHeight()
                this.nav.top.style.height = "100%";
                if (this.hideBorderFor100PctHeight) {
                    this._originalBorder = this.nav.top.style.border;
                    this.nav.top.style.border = "0 none";
                }
                this.height = parseInt(this.nav.top.clientHeight, 10) - (this._getTotalHeaderHeight()) - dividerHeight;
            }

            /*if (this.heightSpec === 'Max100Pct') {
                this.nav.top.style.height = '';
            }*/

            // getting ready for the scrollbar
            // keep it here, firefox requires it to get the scrollbar height
            this.nav.scroll.style.height = '30px';

            var height = this._getScrollableHeight();
            //height = Math.max(1, height); // make sure it's not negative

            var total = height + this._getTotalHeaderHeight() + dividerHeight;
            if (height >= 0) {
                this.nav.scroll.style.height = (height) + 'px';
                this._scrollRes.style.height = (height) + 'px';
            }
            if (this.nav.divider) {
                if (!total || isNaN(total) || total < 0) {
                    total = 0;
                }
                this.nav.divider.style.height = (total) + "px";
            }

            // required for table-based mode
            if (this.heightSpec !== "Parent100Pct") {
                this.nav.top.style.height = (total) + "px";
            }

            //calendar.nav.resScrollSpace.style.height = (calendar.divResScroll.clientHeight + 20) + "px";
            if (calendar.nav.resScrollSpace) {
                calendar.nav.resScrollSpace.style.height = (height + 20) + "px";
            }

            for (var i = 0; i < this.elements.separators.length; i++) {
                this.elements.separators[i].style.height = this._innerHeightTree + 'px';
            }
            for (var i = 0; i < this.elements.linesVertical.length; i++) {
                this.elements.linesVertical[i].style.height = this._innerHeightTree + 'px';
            }

            calendar._detectDimensionChange();

        };

        this._prepareItline = function() {

            this.startDate = new DayPilot.Date(this.startDate).getDatePart();

            this._cache.pixels = [];
            this.itline = DayPilot.list();
            
            var autoCellWidth = this.cellWidthSpec === "Auto";
            //var customWidth = false;


            var updateCellWidthForAuto = function() {
                if (!autoCellWidth) {
                    return;
                }
                var count = 0;
                /*
                if (calendar.timeHeader) {
                    if (calendar.timeline) {
                        count = calendar.timeline.length;
                    }
                    else {
                        //var row = calendar.timeHeader[calendar.timeHeader.length - 1];
                        //count = row.length;

                    }
                }
                */
                if (calendar._serverBased() && calendar.timeline) {
                    count = calendar.timeline.length;
                }
                else {
                    if (calendar.scale === "Manual") {
                        count = calendar.timeline.length;
                    }
                    else {
                        calendar._generateTimeline();  // hack
                        count = calendar.itline.length;
                        calendar.itline = DayPilot.list();
                    }
                }
                var width = calendar._getScrollableWidth();
                if (count > 0 && width > 0) {
                    // calendar.cellWidth = width / count;

                    var cell = width / count;
                    calendar.cellWidth = Math.max(cell, calendar.cellWidthMin);
                    calendar._minCellWidthApplied = cell < calendar.cellWidthMin;
                }
                //calendar.debug.message("updated cellWidth: " + calendar.cellWidth);

            };

            // required for event group calculation
            updateCellWidthForAuto();

            // set on the server, copy from there
            if (this._serverBased() && this.timeline) {  // timeline supplied from the server
                if (this.timeline) {  // TODO dissolve 
                    this.itline = DayPilot.list();
                    var lastEnd = null;
                    var left = 0;
                    for (var i = 0; i < this.timeline.length; i++) {

                        var src = this.timeline[i];
                        var cell = {};
                        cell.start = new DayPilot.Date(src.start);
                        cell.end =  src.end ? new DayPilot.Date(src.end) : cell.start.addMinutes(this.cellDuration);

                        if (!src.width) {
                            var right = Math.floor(left + this.cellWidth);
                            var width = right - Math.floor(left);

                            cell.left = Math.floor(left);
                            cell.width = width;
                            left += this.cellWidth;
                        }
                        else {
                            cell.left = src.left || left; // left is optional TODO remove original syntax
                            cell.width = src.width || this.cellWidth; // width is optional TODO remove original syntax
                            left += cell.width;
                        }

                        /*
                        if (autoCellWidth) {
                            cell.left = Math.floor(left);
                            cell.width = Math.floor(this.cellWidth); // width is optional
                        }
                        else {
                            cell.left = src.left || left; // left is optional
                            cell.width = src.width || this.cellWidth; // width is optional
                        }
                        */
                        

                        cell.breakBefore = lastEnd && lastEnd.ticks !== cell.start.ticks;
                        lastEnd = cell.end;
                        
                        this.itline.push(cell);
                    }
                }

                if (autoCellWidth) {
                    this._updateHeaderGroupDimensions();
                }
            }
            else {
                this.timeHeader = [];

                if (this.scale === "Manual") {
                    this.itline = DayPilot.list();
                    var left = 0;
                    var lastEnd = null;
                    for (var i = 0; i < this.timeline.length; i++) {
                        var src = this.timeline[i];

                        var cell = {};
                        cell.start = new DayPilot.Date(src.start);
                        cell.end =  src.end ? new DayPilot.Date(src.end) : cell.start.addMinutes(this.cellDuration);

                        if (lastEnd && cell.start.ticks < lastEnd.ticks) {
                            throw "The timeline must be sequential";
                        }
                        
                        var w = src.width || this.cellWidth;

                        var right = Math.floor(left + w);
                        var width = right - Math.floor(left);

                        cell.left = Math.floor(left);
                        cell.width = width;
                        left += w;
                        
                        // TODO custom width
                        
                        //cell.left = Math.floor(left);
                        //cell.width = Math.floor(src.width || this.cellWidth);
                        //cell.breakBefore = src.breakBefore;
                        
                        cell.breakBefore = lastEnd && lastEnd.ticks !== cell.start.ticks;
                        lastEnd = cell.end;

                        this.itline.push(cell);
                        
                        //left += cell.width;
                    }
                }
                else {
                    this._generateTimeline();
                }

                //updateItlineForAutoCellWidth();
                this._prepareHeaderGroups();
            }
        };

        // public API
        this.infinite = {};
        this.infinite.shiftStart = function(days) {
            infitools.shiftStart(days);
        };
        this.infinite.scrollTo = function(date) {
            infitools.shiftTo(date);
        };

        this._infitools = {};
        var infitools = this._infitools;

        infitools.shiftX = 0;
        infitools.active = false;

        infitools.updateRowStarts = function() {
            DayPilot.list(calendar.rowlist).each(function(row, i) {
                row.start = calendar._visibleStart();
                row.data = null;
                calendar._ensureRowData(i);
            });
        };

        infitools.isEnabled = function() {
            return calendar.infiniteScrollingEnabled && !calendar._serverBased();
        };

        infitools.shiftTo = function(day) {
            var day = new DayPilot.Date(day);
            var start = day.addDays(-calendar.infiniteScrollingStepDays).getDatePart();
            var diff = new DayPilot.Duration(start.getTime() - calendar.startDate.getDatePart().getTime()).totalDays();
            infitools.shiftStart(diff, day);
        };

        infitools.shiftStart = function(days, scrollTo) {
            var pixels;

            infitools.active = true;

            var original = calendar.startDate;
            var newStart = calendar.startDate.addDays(days);

            if (days > 0) {
                pixels = -calendar.getPixels(newStart).left;
            }

            calendar.startDate = calendar.startDate.addDays(days);

            calendar.itline = DayPilot.list();
            calendar._cache.pixels = [];
            calendar._bcrCache = {};
            calendar._generateTimeline();
            infitools.updateRowStarts();

            if (days < 0) {
                pixels = calendar.getPixels(original).left;
            }

            calendar.timeHeader = []; // force redraw
            calendar._prepareHeaderGroups();
            calendar._drawTimeHeader();


            calendar.cellProperties = {};

            calendar._deleteCells();
            calendar._deleteSeparators();

            calendar._loadEvents();
            calendar._deleteEvents();

            // make sure the scrollbar is visible
            calendar._updateHeight();

            // don't call drawCells here, it's called by onScroll
            if (typeof scrollTo !== 'undefined') {
                calendar.scrollTo(new DayPilot.Date(scrollTo));
                calendar._onScroll();
                //calendar.nav.scroll.scrollLeft = scrollX;
            }
            else {
                calendar.nav.scroll.scrollLeft += pixels;
            }

            calendar._drawSeparators();
            calendar._drawEvents();

            infitools.active = false;

            /*// debounce
            setTimeout(function() {
                infitools.active = false;
            }, 100);*/

        };

        this._generateTimeline = function() {

            var _endDate = (this.viewType !== 'Days') ? this.startDate.addDays(this.days) : this.startDate.addDays(1);

            var start = this.startDate;
            var end = this._addScaleSize(start); //
            var breakBefore = false;

            var left = 0;
            while (end.ticks <= _endDate.ticks && end.ticks > start.ticks) {
                if (this._includeCell(start, end, true)) {
                    
                    var right = Math.floor(left + this.cellWidth);
                    var width = right - Math.floor(left);
                    
                    var timeCell = {};
                    timeCell.start = start;
                    timeCell.end = end;
                    timeCell.left = Math.floor(left);
                    timeCell.width = width;
                    timeCell.breakBefore = breakBefore;

                    this.itline.push(timeCell);
                    
                    left += this.cellWidth;

                    breakBefore = false;
                }
                else {
                    breakBefore = true;
                }

                start = end;
                end = this._addScaleSize(start);

            }
        };

        this._updateHeaderGroupDimensions = function() {
            if (!this.timeHeader) {
                return;
            }
            for (var y = 0; y < this.timeHeader.length; y++) {
                var row = this.timeHeader[y];
                for (var x = 0; x < row.length; x++) {
                    var h = row[x];

                    h.left = this.getPixels(new DayPilot.Date(h.start)).left;
                    var right = this.getPixels(new DayPilot.Date(h.end)).left;
                    var width = right - h.left;
                    h.width = width;
                }
            }
        };
        
        this._prepareHeaderGroups = function() {
            var timeHeaders = this.timeHeaders;
            if (!timeHeaders) {
                timeHeaders = [
                    {"groupBy": this.cellGroupBy},
                    {"groupBy": "Cell"}
                ];
            }

            if (this.itline.isEmpty()) {
                this.timeHeader = [];
                for (var i = 0; i < timeHeaders.length; i++) {
                    this.timeHeader[i] = [];
                }
                return;
            }


            var endDate = calendar._visibleEnd();

            //var timeHeaders = this.timeHeaders;
            for (var i = 0; i < timeHeaders.length; i++) {
                var groupBy = timeHeaders[i].groupBy;
                var format = timeHeaders[i].format;
                
                if (groupBy === "Default") {
                    groupBy = this.cellGroupBy;
                }

                var line = [];

                //var cell = {};
                var start = this._visibleStart();


                while (start.ticks < endDate.ticks) {
                    var h = {};
                    h.start = start;
                    h.end = this._addGroupSize(h.start, groupBy);


                    if (h.start.ticks === h.end.ticks) {
                        break;
                    }
                    h.left = this.getPixels(h.start).left;
                    var right = this.getPixels(h.end).left;
                    var width = right - h.left;
                    h.width = width;
                    
                    h.colspan = Math.ceil(width / (1.0 * this.cellWidth));
                    if (typeof format === "string") {
                        h.innerHTML = h.start.toString(format, resolved.locale());
                    }
                    else {
                        h.innerHTML = this._getGroupName(h, groupBy);
                    }
                    h.text = h.innerHTML;

                    if (width > 0) {

                        if (typeof this.onBeforeTimeHeaderRender === 'function') {
                            var cell = {};
                            cell.start = h.start;
                            cell.end = h.end;
                            cell.text = h.innerHTML;
                            cell.html = h.innerHTML;
                            cell.toolTip = h.innerHTML;
                            //cell.color = null;
                            cell.backColor = null;
                            cell.fontColor = null;
                            cell.level = this.timeHeader.length;
                            cell.cssClass = null;

                            var args = {};
                            args.header = cell;

                            this.onBeforeTimeHeaderRender(args);

                            h.text = h.innerHTML; // original
                            h.innerHTML = cell.html;
                            h.backColor = cell.backColor;
                            h.fontColor = cell.fontColor;
                            h.toolTip = cell.toolTip;
                            h.areas = cell.areas;
                            h.cssClass = cell.cssClass;
                        }

                        line.push(h);
                    }
                    start = h.end;
                }
                this.timeHeader.push(line);
            }
        };

        this._includeCell = function(start, end) {

            if (typeof this.onIncludeTimeCell === 'function') {
                var cell = {};
                cell.start = start;
                cell.end = end;
                cell.visible = true;
                
                var args = {};
                args.cell = cell;
                
                this.onIncludeTimeCell(args);
                
                return cell.visible;
            }

            if (this.showNonBusiness) {
                return true;
            }

            var forceBusinessDay = calendar.viewType === "Days";
            return this.isBusiness({"start":start, "end":end}, forceBusinessDay);

        };


        // internal
        this.getPixels = function(date) {
            var ticks = date.ticks;

            var cache = this._cache.pixels[ticks];
            if (cache) {
                return cache;
            }
            
            var previous = null;
            var previousEndTicks = 221876841600000;  // December 31, 9000

            if (this.itline.length === 0 || ticks < this.itline[0].start.ticks) {
                var result = {};
                result.cut = false;
                result.left = 0;
                //result.left = -infinite.shiftX;
                result.boxLeft = result.left;
                result.boxRight = result.left;
                result.i = null; // not in range
                return result;
            }
            
            //var thisone = date.toString() === "2014-05-01T00:00:00";

            // quick hack
            var cursor = this._getItlineCellFromTimeBinary(date);
            //var startCell = cursor.previous || cursor.current;
            //var si = DayPilot.indexOf(startCell);
            var si = Math.max(cursor.i - 1, 0);

            for (var i = si; i < this.itline.length; i++) {
                //var found = false;
                var cell = this.itline[i];

                var cellStartTicks = cell.start.ticks;
                var cellEndTicks = cell.end.ticks;

                if (cellStartTicks < ticks && ticks < cellEndTicks) {  // inside
                    var offset = ticks - cellStartTicks;
                    
                    var result = {};
                    result.cut = false;
                    result.left = cell.left + this._ticksToPixels(cell, offset);
                    result.boxLeft = cell.left;
                    result.boxRight = cell.left + cell.width;
                    result.i = i;
                    break;
                }
                else if (cellStartTicks === ticks) {  // start

                    var result = {};
                    result.cut = false;
                    result.left = cell.left;
                    result.boxLeft = result.left;
                    result.boxRight = result.left + cell.width;
                    result.i = i;
                    break;
                }
                else if (cellEndTicks === ticks) {  // end
                    
                    var result = {};
                    result.cut = false;
                    result.left = cell.left + cell.width;
                    result.boxLeft = result.left;
                    result.boxRight = result.left;
                    result.i = i + 1;
                    break;
                }
                else if (ticks < cellStartTicks && ticks > previousEndTicks) {  // hidden
                    
                    var result = {};
                    result.cut = true;
                    result.left = cell.left;
                    result.boxLeft = result.left;
                    result.boxRight = result.left;
                    result.i = i;
                    break;
                }

                previousEndTicks = cellEndTicks;
            }

            if (!result) {
                var last = this.itline[this.itline.length - 1];
                
                var result = {};
                result.cut = true;
                result.left = last.left + last.width;
                result.boxLeft = result.left;
                result.boxRight = result.left;
                result.i = null; // not in range
            }

            this._cache.pixels[ticks] = result;
            return result;
        };

        // left - pixel offset from start
        // precise - true: calculates exact date from pixels, false: the it's the cell start
        // isEnd - returns the end of the previous cell
        // 
        // isEnd and precise can't be combined
        this.getDate = function(left, precise, isEnd) {
            //var x = Math.floor(left / this.cellWidth);
            var position = this._getItlineCellFromPixels(left, isEnd);
            
            if (!position) {
                return null;
            }
            
            var x = position.x;
            
            var itc = this.itline[x];

            if (!itc) {
                return null;
            }

            var start = (isEnd && !precise) ? itc.end : itc.start;

            if (!precise) {
                return start;
            }
            else {
                return start.addTime(this._pixelsToTicks(position.cell, position.offset));
            }

        };
        
        this._getItlineCellFromPixels = function(pixels, isEnd) {
            if (this.itline.length === 0) {
                return null;
            }

            var pos = 0;
            var previous = 0;
            for (var i = 0; i < this.itline.length; i++) {
                var cell = this.itline[i];
                var width = cell.width || this.cellWidth;
                pos += width;
                
                if ((pixels < pos) || (isEnd && pixels === pos)) {
                    var result = {};
                    result.x = i;
                    result.offset = pixels - previous;
                    result.cell = cell;
                    return result;
                }
                
                previous = pos;
            }
            var cell = calendar.itline.last();

            var result = {};
            result.x = this.itline.length - 1;
            result.offset = cell.width || this.cellWidth;
            result.cell = cell;
            return result;
        };

        this._getItlineCellFromTime = function(time) {
            //return this._getItlineCellFromTimeSequential(time);
            return this._getItlineCellFromTimeBinary(time);
        };

        this._getItlineCellFromTimeSequential = function(time) {
            var pos = new DayPilot.Date(time);
            for (var i = 0; i < this.itline.length; i++) {
                var cell = this.itline[i];

                if (cell.start.ticks <= pos.ticks && pos.ticks < cell.end.ticks) {   // match
                    var result = {};
                    result.hidden = false;
                    result.current = cell;
                    return result;
                }
                if (pos.ticks < cell.start.ticks)   // it's a hidden cell or before the itline
                {
                    var result = {};
                    result.hidden = true;
                    result.previous = i > 0 ? this.itline[i - 1] : null;
                    result.current = null;
                    result.next = this.itline[i];
                    return result;
                }
            }
            var result = {};   // not found at all, it's past the itline
            result.past = true;
            result.previous = this.itline[this.itline.length - 1];

            return result;

        };

        this._getItlineCellFromTimeBinary = function(time) {
            var pos = new DayPilot.Date(time);

            // before the itline
            var from = 0;
            var first = this.itline[0]; // || { "start": new DayPilot.Date(calendar.startDate)};
            if (pos.ticks < first.start.ticks) {
                var result = {};
                result.hidden = true;
                result.previous = null;
                result.current = null;
                result.next = this.itline[0];
                result.i = -1;
                return result;
            }

            var to = this.itline.length - 1;
            var last = this.itline[to]; // || { "end": new DayPilot.Date(calendar.startDate)};
            if (pos.ticks > last.end.ticks) {
                var result = {};   // not found at all, it's past the itline
                result.past = true;
                result.previous = this.itline[this.itline.length - 1];
                result.i = this.itline.length;
                return result;
            }

            if (pos.ticks === last.end.ticks) {
                var result = {};
                result.past = false;
                result.current = this.itline[this.itline.length - 1];
                result.i = this.itline.length - 1;
                return result;
            }

            var si = (function() {
                var itline = calendar.itline;
                var cur;
                while (from <= to) {
                    cur = Math.floor((from + to)/2);
                    if (itline[cur].start.ticks > pos.ticks) {
                        to = cur - 1;
                    }
                    else if (itline[cur].end.ticks < pos.ticks) {
                        from = cur + 1;
                    }
                    else {
                        return cur;
                    }
                }
                return from;
            })();

            for (var i = si; i < this.itline.length; i++) {
                var cell = this.itline[i];

                if (cell.start.ticks <= pos.ticks && pos.ticks < cell.end.ticks) {   // match
                // if (cell.start.ticks <= pos.ticks && pos.ticks <= cell.end.ticks) {   // match
                    var result = {};
                    result.hidden = false;
                    result.current = cell;
                    result.i = i;
                    return result;
                }
                if (pos.ticks < cell.start.ticks)   // it's a hidden cell or before the itline
                {
                    var result = {};
                    result.hidden = true;
                    result.previous = i > 0 ? this.itline[i - 1] : null;
                    result.current = null;
                    result.next = this.itline[i];
                    result.i = i;
                    return result;
                }
            }

            var result = {};   // not found at all, it's past the itline
            result.past = true;
            result.previous = this.itline[this.itline.length - 1];
            result.i = this.itline.length;
            return result;

        };

        this._ticksToPixels = function(cell, ticks) { // DEBUG check that it's not used improperly (timeline)
            var width = cell.width || this.cellWidth;
            var duration = cell.end.ticks - cell.start.ticks;
            return Math.floor((width * ticks) / (duration));
        };

        this._pixelsToTicks = function(cell, pixels) {
            var duration = cell.end.ticks - cell.start.ticks;
            var width = cell.width || this.cellWidth;
            return Math.floor(pixels / width * duration );
        };
        
        this._onEventClick = function(ev) {
            if (DayPilot.Global.touch.start) {
                return;
            }
            if (DayPilotScheduler.preventEventClick) {
                return;
            }
            moving = {}; // clear
            calendar._eventClickDispatch(this, ev);  
        };

        this.eventClickPostBack = function(e, data) {
            this._postBack2('EventClick', e, data);
        };
        this.eventClickCallBack = function(e, data) {
            this._callBack2('EventClick', e, data);
        };

        this._eventClickDispatch = function(div, ev) {
            var e = div.event;

            if (!e) {  // heavy dynamic loading fix
                return;
            }

            // div.focus();

            var ev = ev || window.event;

            if (typeof (DayPilot.Bubble) !== 'undefined') {
                DayPilot.Bubble.hideActive();
            }

            //if (calendar.eventDoubleClickHandling === 'Disabled') {
            if (!e.client.doubleClickEnabled()) {
                calendar._eventClickSingle(div, ev);
                return;
            }

            if (!calendar.timeouts.click) {
                calendar.timeouts.click = [];
            }

            var eventClickDelayed = function(div, ev) {
                return function() {
                    calendar._eventClickSingle(div, ev);
                };
            };

            calendar.timeouts.click.push(window.setTimeout(eventClickDelayed(div, ev), calendar.doubleClickTimeout));

        };

        this._getItline = function(x) {
            return calendar.itline[x];
        };

        this._eventClickSingle = function(div, ev) {
            if (typeof ev === "boolean") {
                throw "Invalid _eventClickSingle parameters";
            }
            var e = div.event;

            if (!e) {
                return;
            }

            var ctrlKey = ev.ctrlKey;
            var metaKey = ev.metaKey;

            if (!e.client.clickEnabled()) {
                return;
            }
            
            if (calendar._api2()) {
                
                var args = {};
                args.e = e;
                args.div = div;
                args.originalEvent = ev;
                args.ctrl = ctrlKey;
                args.meta = metaKey;
                args.shift = ev.shiftKey;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                args.control = calendar;
                args.toJSON = function() {
                    return DayPilot.Util.copyProps(args, {}, ["e", "ctrl", "meta", "shift"]);
                };

                if (typeof calendar.onEventClick === 'function') {
                    calendar.onEventClick(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }
                
                switch (calendar.eventClickHandling) {
                    case 'PostBack':
                        calendar.eventClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.eventClickCallBack(e);
                        break;
                    case 'Edit':
                        calendar._divEdit(div);
                        break;
                    case 'Select':
                        calendar._eventSelect(div, e, ctrlKey, metaKey);
                        break;
                    case 'ContextMenu':
                        var menu = e.client.contextMenu();
                        if (menu) {
                            menu.show(e);
                        }
                        else {
                            if (calendar.contextMenu) {
                                calendar.contextMenu.show(e);
                            }
                        }
                        break;
                    case 'Bubble':
                        if (calendar.bubble) {
                            calendar.bubble.showEvent(e);
                        }
                        break;
                    case "RectangleSelect":
                        if (calendar.multiSelectRectangle !== "Disabled") {
                            rectangle.start();
                            return false;
                        }
                        break;

                }
                
                if (typeof calendar.onEventClicked === 'function') {
                    calendar.onEventClicked(args);
                }                
                
            }
            else {
                switch (calendar.eventClickHandling) {
                    case 'PostBack':
                        calendar.eventClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.eventClickCallBack(e);
                        break;
                    case 'JavaScript':
                        calendar.onEventClick(e);
                        break;
                    case 'Edit':
                        calendar._divEdit(div);
                        break;
                    case 'Select':
                        calendar._eventSelect(div, e, ctrlKey, metaKey);
                        break;
                    case 'ContextMenu':
                        var menu = e.client.contextMenu();
                        if (menu) {
                            menu.show(e);
                        }
                        else {
                            if (calendar.contextMenu) {
                                calendar.contextMenu.show(e);
                            }
                        }
                        break;
                    case 'Bubble':
                        if (calendar.bubble) {
                            calendar.bubble.showEvent(e);
                        }
                        break;
                    case "RectangleSelect":
                        if (calendar.multiSelectRectangle !== "Disabled") {
                            rectangle.start();
                            return false;
                        }
                        break;

                }
                
            }

        };
        
        this._eventDeleteDispatch = function(e) {

            if (calendar._api2()) {

                var args = {};
                args.e = e;
                
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                args.control = calendar;
                args.toJSON = function() {
                    return DayPilot.Util.copyProps(args, {}, ["e"]);
                };

                if (typeof calendar.onEventDelete === 'function') {
                    calendar.onEventDelete(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }

                switch (calendar.eventDeleteHandling) {
                    case 'PostBack':
                        calendar.eventDeletePostBack(e);
                        break;
                    case 'CallBack':
                        calendar.eventDeleteCallBack(e);
                        break;
                    case 'Update':
                        calendar.events.remove(e);
                        break;
                }
                
                if (typeof calendar.onEventDeleted === 'function') {
                    calendar.onEventDeleted(args);
                }
            }
            else {
                switch (calendar.eventDeleteHandling) {
                    case 'PostBack':
                        calendar.eventDeletePostBack(e);
                        break;
                    case 'CallBack':
                        calendar.eventDeleteCallBack(e);
                        break;
                    case 'JavaScript':
                        calendar.onEventDelete(e);
                        break;
                }
            }

        };

        this.eventDeletePostBack = function(e, data) {
            this._postBack2('EventDelete', e, data);
        };
        this.eventDeleteCallBack = function(e, data) {
            this._callBack2('EventDelete', e, data);
        };

        // obsolete
        this.setHScrollPosition = function(pixels) {
            this.nav.scroll.scrollLeft = pixels;
        };

        this.getScrollX = function() {
            return this.nav.scroll.scrollLeft;
        };

        // obsolete
        this.getHScrollPosition = this.getScrollX;

        this.getScrollY = function() {
            return this.nav.scroll.scrollTop;
        };

        this._eventSelect = function(div, e, ctrlKey, metaKey) {
            calendar._eventSelectDispatch(div, e, ctrlKey, metaKey);
        };

        this.eventSelectPostBack = function(e, change, data) {
            var params = {};
            params.e = e;
            params.change = change;
            this._postBack2('EventSelect', params, data);
        };
        this.eventSelectCallBack = function(e, change, data) {
            var params = {};
            params.e = e;
            params.change = change;
            this._callBack2('EventSelect', params, data);
        };

        this._eventSelectDispatch = function(div, e, ctrlKey, metaKey) {
            //var e = this.selectedEvent();

            var m = calendar.multiselect;

            var allowDeselect = false;
            var isSelected = m.isSelected(e);
            var ctrlOrMeta = ctrlKey || metaKey;
            if (!ctrlOrMeta && isSelected && !allowDeselect && m._list.length === 1) {
                return;
            }

            if (calendar._api2()) {
                
                m._previous = m.events();

                var args = {};
                args.e = e;
                args.selected = isSelected;
                args.ctrl = ctrlKey;
                args.meta = metaKey;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onEventSelect === 'function') {
                    calendar.onEventSelect(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }

                switch (calendar.eventSelectHandling) {
                    case 'PostBack':
                        calendar.eventSelectPostBack(e, change);
                        break;
                    case 'CallBack':
                        if (typeof WebForm_InitCallback !== 'undefined') {
                            window.__theFormPostData = "";
                            window.__theFormPostCollection = [];
                            WebForm_InitCallback();
                        }
                        calendar.eventSelectCallBack(e, change);
                        break;
                    case 'Update':
                        m._toggleDiv(div, ctrlKey, metaKey);
                        break;
                }
                
                if (typeof calendar.onEventSelected === 'function') {
                    args.change = m.isSelected(e) ? "selected" : "deselected";
                    args.selected = m.isSelected(e);
                    calendar.onEventSelected(args);
                }                
                
            }
            else {
                m._previous = m.events();
                m._toggleDiv(div, ctrlKey, metaKey);
                var change = m.isSelected(e) ? "selected" : "deselected";

                switch (calendar.eventSelectHandling) {
                    case 'PostBack':
                        calendar.eventSelectPostBack(e, change);
                        break;
                    case 'CallBack':
                        if (typeof WebForm_InitCallback !== 'undefined') {
                            window.__theFormPostData = "";
                            window.__theFormPostCollection = [];
                            WebForm_InitCallback();
                        }
                        calendar.eventSelectCallBack(e, change);
                        break;
                    case 'JavaScript':
                        calendar.onEventSelect(e, change);
                        break;
                }
            }


        };

        this.eventRightClickPostBack = function(e, data) {
            this._postBack2('EventRightClick', e, data);
        };
        this.eventRightClickCallBack = function(e, data) {
            this._callBack2('EventRightClick', e, data);
        };

        this._eventRightClickDispatch = function(ev) {

            if (DayPilot.Global.touch.active || DayPilot.Global.touch.start) {
                return;
            }

            var e = this.event;

            ev = ev || window.event;
            ev.cancelBubble = true;

            if (!this.event.client.rightClickEnabled()) {
                return false;
            }
            
            if (calendar._api2()) {

                var args = {};
                args.e = e;
                args.div = this;
                args.originalEvent = ev;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onEventRightClick === 'function') {
                    calendar.onEventRightClick(args);
                    if (args.preventDefault.value) {
                        return false;
                    }
                }
                
                switch (calendar.eventRightClickHandling) {
                    case 'PostBack':
                        calendar.eventRightClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.eventRightClickCallBack(e);
                        break;
                    case 'ContextMenu':
                        var menu = e.client.contextMenu();
                        if (menu) {
                            menu.show(e);
                        }
                        else {
                            if (calendar.contextMenu) {
                                calendar.contextMenu.show(this.event);
                            }
                        }
                        break;
                    case 'Bubble':
                        if (calendar.bubble) {
                            calendar.bubble.showEvent(e);
                        }
                        break;                        
                }
                
                if (typeof calendar.onEventRightClicked === 'function') {
                    calendar.onEventRightClicked(args);
                }                
                
            }
            else {
                switch (calendar.eventRightClickHandling) {
                    case 'PostBack':
                        calendar.eventRightClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.eventRightClickCallBack(e);
                        break;
                    case 'JavaScript':
                        calendar.onEventRightClick(e);
                        break;
                    case 'ContextMenu':
                        var menu = e.client.contextMenu();
                        if (menu) {
                            menu.show(e);
                        }
                        else {
                            if (calendar.contextMenu) {
                                calendar.contextMenu.show(this.event);
                            }
                        }
                        break;
                    case 'Bubble':
                        if (calendar.bubble) {
                            calendar.bubble.showEvent(e);
                        }
                        break;                        
                }
            }


            return false;
        };

        this.eventDoubleClickPostBack = function(e, data) {
            this._postBack2('EventDoubleClick', e, data);
        };
        this.eventDoubleClickCallBack = function(e, data) {
            this._callBack2('EventDoubleClick', e, data);
        };

        this._eventDoubleClickDispatch = function(ev) {

            if (typeof (DayPilot.Bubble) !== 'undefined') {
                DayPilot.Bubble.hideActive();
            }


            if (calendar.timeouts.click) {
                for (var toid in calendar.timeouts.click) {
                    window.clearTimeout(calendar.timeouts.click[toid]);
                }
                calendar.timeouts.click = null;
            }

            var ev = ev || window.event;
            var e = this.event;

            ev.stopPropagation && ev.stopPropagation();
            ev.cancelBubble = true;

            if (calendar._api2()) {
                
                var args = {};
                args.e = e;
                args.originalEvent = ev;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onEventDoubleClick === 'function') {
                    calendar.onEventDoubleClick(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }

                switch (calendar.eventDoubleClickHandling) {
                    case 'PostBack':
                        calendar.eventDoubleClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.eventDoubleClickCallBack(e);
                        break;
                    case 'Edit':
                        calendar._divEdit(this);
                        break;
                    case 'Select':
                        calendar._eventSelect(div, e, ev.ctrlKey, ev.metaKey);
                        break;
                    case 'Bubble':
                        if (calendar.bubble) {
                            calendar.bubble.showEvent(e);
                        }
                        break;
                    case 'ContextMenu':
                        var menu = e.client.contextMenu();
                        if (menu) {
                            menu.show(e);
                        }
                        else {
                            if (calendar.contextMenu) {
                                calendar.contextMenu.show(e);
                            }
                        }
                        break;

                }
                
                if (typeof calendar.onEventDoubleClicked === 'function') {
                    calendar.onEventDoubleClicked(args);
                }

            }
            else {
                switch (calendar.eventDoubleClickHandling) {
                    case 'PostBack':
                        calendar.eventDoubleClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.eventDoubleClickCallBack(e);
                        break;
                    case 'JavaScript':
                        calendar.onEventDoubleClick(e);
                        break;
                    case 'Edit':
                        calendar._divEdit(this);
                        break;
                    case 'Select':
                        calendar._eventSelect(div, e, ev.ctrlKey, ev.metaKey);
                        break;
                    case 'Bubble':
                        if (calendar.bubble) {
                            calendar.bubble.showEvent(e);
                        }
                        break;
                    case 'ContextMenu':
                        var menu = e.client.contextMenu();
                        if (menu) {
                            menu.show(e);
                        }
                        else {
                            if (calendar.contextMenu) {
                                calendar.contextMenu.show(e);
                            }
                        }
                        break;
                }
                
            }

        };

        this.eventResizePostBack = function(e, newStart, newEnd, data) {
            this._invokeEventResize("PostBack", e, newStart, newEnd, data);

        };
        this.eventResizeCallBack = function(e, newStart, newEnd, data) {
            this._invokeEventResize("CallBack", e, newStart, newEnd, data);
        };

        this._invokeEventResize = function(type, e, newStart, newEnd, data) {
            var params = {};
            params.e = e;
            params.newStart = newStart;
            params.newEnd = newEnd;

            this._invokeEvent(type, "EventResize", params, data);
        };


        this._eventResizeDispatch = function(e, newStart, newEnd) {

            if (this.eventResizeHandling === 'Disabled') {
                return;
            }

            newEnd = calendar._adjustEndOut(newEnd);
            
            if (calendar._api2()) {
                // API v2
                var args = {};

                var doit = function() {
                    overlay.hide();

                    if (args.preventDefault.value) {
                        return;
                    }

                    newStart = args.newStart;
                    newEnd = args.newEnd;

                    switch (calendar.eventResizeHandling) {
                        case 'PostBack':
                            calendar.eventResizePostBack(e, newStart, newEnd);
                            break;
                        case 'CallBack':
                            calendar.eventResizeCallBack(e, newStart, newEnd);
                            break;
                        case 'Notify':
                            calendar.eventResizeNotify(e, newStart, newEnd);
                            break;
                        case 'Update':
                            calendar._doEventMoveUpdate(args);
                            break;
                    }

                    if (typeof calendar.onEventResized === 'function') {
                        calendar.onEventResized(args);
                    }
                };

                args.e = e;
                args.async = false;
                args.loaded = function() {
                    doit();
                };
                args.newStart = newStart;
                args.newEnd = newEnd;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };
                args.multiresize = DayPilot.list(mre.list);
                args.control = calendar;
                args.toJSON = function() {
                    return DayPilot.Util.copyProps(args, {}, ["e", "async", "newStart", "newEnd", "multiresize"]);
                };

                var info = {};
                info.event = e;
                info.start = newStart;
                info.end = newEnd;
                args.multiresize.splice(0, 0, info);

                if (typeof calendar.onEventResize === 'function') {
                    calendar.onEventResize(args);
                }

                if (!args.async) {
                    doit();
                }
                else {
                    if (calendar.blockOnCallBack) {
                        overlay.show();
                    }
                }

            }
            else {
                switch (calendar.eventResizeHandling) {
                    case 'PostBack':
                        //newEnd = calendar._adjustEndOut(newEnd);
                        calendar.eventResizePostBack(e, newStart, newEnd);
                        break;
                    case 'CallBack':
                        //newEnd = calendar._adjustEndOut(newEnd);
                        calendar.eventResizeCallBack(e, newStart, newEnd);
                        break;
                    case 'JavaScript':
                        //newEnd = calendar._adjustEndOut(newEnd);
                        calendar.onEventResize(e, newStart, newEnd);
                        break;
                    case 'Notify':
                        //newEnd = calendar._adjustEndOut(newEnd);
                        calendar.eventResizeNotify(e, newStart, newEnd);
                        break;
                    case 'Update':
                        calendar._doEventMoveUpdate(args);
                        break;
                }                
            }
          
        };

        this.eventMovePostBack = function(e, newStart, newEnd, newResource, data, line) {
            this._invokeEventMove("PostBack", e, newStart, newEnd, newResource, data, line);
        };

        this.eventMoveCallBack = function(e, newStart, newEnd, newResource, data, line) {
            this._invokeEventMove("CallBack", e, newStart, newEnd, newResource, data, line);
        };

        this._invokeEventMove = function(type, e, newStart, newEnd, newResource, data, line) {
            var usesArgs = e && !!e.preventDefault;

            var params = {};

            if (usesArgs) {
                var args = e;
                params.e = args.e;
                params.newStart = args.newStart;
                params.newEnd = args.newEnd;
                params.newResource = args.newResource;
                params.position = args.position;

                params.multimove = [];

                args.multimove.each(function(item) {
                    var mmp = {};
                    mmp.e = item.event;
                    mmp.newStart = item.start;
                    mmp.newEnd = item.end;
                    mmp.newResource = item.event.resource();
                    if (mmp.e === args.e || mmp.e.data.id == args.e.data.id) {
                        mmp.newResource = args.newResource;
                    }
                    else if (mm.rowoffset) {
                        var ri = item.event.part.dayIndex + mm.rowoffset;
                        mmp.newResource = calendar.rowlist[ri].id;
                    }
                    params.multimove.push(mmp);
                });
            }
            else {
                params.e = e;
                params.newStart = newStart;
                params.newEnd = newEnd;
                params.newResource = newResource;
                params.position = line;
            }

            this._invokeEvent(type, "EventMove", params, data);
        };

        this._invokeTimeRangeSelected = function(type, args, data) {
            var params = {};
            params.start = args.start;
            params.end = args.end;
            params.resource = args.resource;
            params.multirange = [];

            args.multirange.each(function(item) {
                var mrp = {};
                mrp.start = item.start;
                mrp.end = item.end;
                mrp.resource = item.resource;
                params.multirange.push(mrp);
            });

            this._invokeEvent(type, "TimeRangeSelected", params, data);
        };

        this._invokeEvent = function(type, action, params, data) {

            if (type === 'PostBack') {
                calendar._postBack2(action, params, data);
            }
            else if (type === 'CallBack') {
                calendar._callBack2(action, params, data, "CallBack");
            }
            else if (type === 'Immediate') {
                calendar._callBack2(action, params, data, "Notify");
            }
            else if (type === 'Queue') {
                calendar.queue.add(new DayPilot.Action(this, action, params, data));
            }
            else if (type === 'Notify') {
                if (resolved.notifyType() === 'Notify') {
                    calendar._callBack2(action, params, data, "Notify");
                }
                else {
                    calendar.queue.add(new DayPilot.Action(calendar, action, params, data));
                }
            }
            else {
                throw "Invalid event invocation type";
            }
        };

        this.eventMoveNotify = function(e, newStart, newEnd, newResource, data, line) {
            var usesArgs = e && !!e.preventDefault;
            if (usesArgs) {
                var args = e;
                args.old = new DayPilot.Event(args.e.copy(), calendar);
                args.multimove.each(function(item) {
                    item.old = new DayPilot.Event(item.event.copy(), calendar);
                });
                calendar._doEventMoveUpdate(args);

                args.e = args.old;
                delete args.old;

                args.multimove.each(function(item) {
                    item.event = item.old;
                    delete item.old;
                });
            }
            else {
                e = new DayPilot.Event(e.copy(), calendar);

                var rows = calendar.events._removeFromRows(e.data);

                e.start(newStart);
                e.end(newEnd);
                e.resource(newResource);
                e.commit();

                rows = rows.concat(calendar.events._addToRows(e.data));
                calendar._loadRows(rows);

                calendar._updateRowHeights();

                calendar._updateRowsNoLoad(rows);
            }

            this._invokeEventMove("Notify", e, newStart, newEnd, newResource, data, line);

        };

        this.eventResizeNotify = function(e, newStart, newEnd, data) {

            var old = new DayPilot.Event(e.copy(), this);

            var rows = calendar.events._removeFromRows(e.data);

            e.start(newStart);
            e.end(newEnd);
            e.commit();

            rows = rows.concat(calendar.events._addToRows(e.data));
            
            calendar._loadRows(rows);

            calendar._updateRowHeights();

            calendar._updateRowsNoLoad(rows);

            this._invokeEventResize("Notify", old, newStart, newEnd, data);

        };

        // internal methods for handling event selection
        this.multiselect = {};

        this.multiselect._list = [];
        this.multiselect._divs = [];
        this.multiselect._previous = [];

        this.multiselect._loadList = function(list) {
            calendar.multiselect._list = DayPilot.list(list).map(function(item) {
                return new DayPilot.Event(item, calendar);
            });
        };

        this.multiselect._serialize = function() {
            var m = calendar.multiselect;
            return JSON.stringify(m.events());
        };

        this.multiselect.events = function() {
            var m = calendar.multiselect;
            var events = DayPilot.list();
            events.ignoreToJSON = true;
            for (var i = 0; i < m._list.length; i++) {
                events.push(m._list[i]);
            }
            return events;
        };

        this.multiselect._updateHidden = function() {
            // not implemented
        };

        this.multiselect._toggleDiv = function(div, ctrl, meta) {
            var m = calendar.multiselect;

            if (m.isSelected(div.event)) {
                if (calendar.allowMultiSelect) {
                    if (ctrl || meta) {
                        m.remove(div.event, true);
                    }
                    else {
                        var count = m._list.length;
                        m.clear();
                        if (count > 1) {
                            m.add(div.event, true);
                        }
                    }
                }
                else { // clear all
                    m.clear();
                }
            }
            else {
                if (calendar.allowMultiSelect) {
                    if (ctrl || meta) {
                        m.add(div.event, true);
                    }
                    else {
                        m.clear();
                        m.add(div.event, true);
                    }
                }
                else {
                    m.clear();
                    m.add(div.event, true);
                }
            }
            //m.redraw();
            m._update(div);
            m._updateHidden();
        };

        // compare event with the init select list
        this.multiselect._shouldBeSelected = function(ev) {
            var m = calendar.multiselect;
            return m._isInList(ev, m.initList);
        };

        this.multiselect._alert = function() {
            var m = calendar.multiselect;
            var list = [];
            for (var i = 0; i < m._list.length; i++) {
                var event = m._list[i];
                list.push(event.value());
            }
            alert(list.join("\n"));
        };

        this.multiselect.add = function(ev, dontRedraw) {
            var m = calendar.multiselect;
            if (m.indexOf(ev) === -1) {
                m._list.push(ev);
            }
            
            if (dontRedraw) {
                return;
            }
            //m.redraw();
            m._updateEvent(ev);

        };

        this.multiselect.remove = function(ev, dontRedraw) {
            var m = calendar.multiselect;
            var i = m.indexOf(ev);
            if (i !== -1) {
                m._list.splice(i, 1);
            }

            if (dontRedraw) {
                return;
            }
            //m.redraw();
            m._updateEvent(ev);
        };

        this.multiselect.clear = function(dontRedraw) {
            var m = calendar.multiselect;
            m._list = [];

            if (dontRedraw) {
                return;
            }
            m.redraw();
        };

        this.multiselect.redraw = function() {
            var m = calendar.multiselect;
            m._divs = [];

            for (var i = 0; i < calendar.elements.events.length; i++) {
                var div = calendar.elements.events[i];
                if (!div.event) {
                    continue;
                }
                if (!div.event.isEvent) {
                    continue;
                }
                if (m.isSelected(div.event)) {
                    m._divSelect(div);
                }
                else {
                    m._divDeselect(div);
                }
            }
        };

        /*
        this.multiselect._redrawForRow = function(i) {

        };
        */

        /*
        // not used
        this.multiselect._updateEvent = function(ev) {
            var m = calendar.multiselect;
            var div = null;
            for (var i = 0; i < calendar.elements.events.length; i++) {
                if (m.isSelected(calendar.elements.events[i].event)) {
                    div = calendar.elements.events[i];
                    break;
                }
            }
            m._update(div);
        };
         */

        // used for faster redraw
        this.multiselect._update = function(div) {
            if (!div) {
                return;
            }

            var m = calendar.multiselect;

            if (m.isSelected(div.event)) {
                m._divSelect(div);
            }
            else {
                m._divDeselect(div);
            }
        };

        this.multiselect._updateEvent = function(e) {
            var m = calendar.multiselect;
            var div = calendar._findEventDiv(e);
            m._update(div);
            /*
            if (!div) {
                return;
            }
            if (m.isSelected(div.event)) {
                m._divSelect(div);
            }
            else {
                m._divDeselect(div);
            }*/
        };

        this.multiselect._divSelect = function(div) {
            var m = calendar.multiselect;
            var cn = calendar._prefixCssClass("_selected");
            var div = m._findContentDiv(div);
            DayPilot.Util.addClass(div, cn);
            m._divs.push(div);
        };

        
        this.multiselect._findContentDiv = function(div) {
            return div;
        };

        this.multiselect._divDeselectAll = function() {
            var m = calendar.multiselect;
            for (var i = 0; i < m._divs.length; i++) {
                var div = m._divs[i];
                m._divDeselect(div, true);
            }
            m._divs = [];
        };

        this.multiselect._divDeselect = function(div, dontRemoveFromCache) {
            var m = calendar.multiselect;
            var cn = calendar._prefixCssClass("_selected");
            DayPilot.Util.removeClass(div, cn);

            if (dontRemoveFromCache) {
                return;
            }
            var i = DayPilot.indexOf(m._divs, div);
            if (i !== -1) {
                m._divs.splice(i, 1);
            }

        };

        this.multiselect.isSelected = function(ev) {
            if (!ev) {
                return false;
            }
            if (!ev.isEvent) {
                return false;
            }
            return calendar.multiselect._isInList(ev, calendar.multiselect._list);
        };

        this.multiselect.indexOf = function(ev) {
            //return DayPilot.indexOf(calendar.multiselect.list, ev);
            var data = ev.data;
            for (var i = 0; i < calendar.multiselect._list.length; i++) {
                var item = calendar.multiselect._list[i];
                if (item.data === data) {
                    return i;
                }
            }
            return -1;
        };

        this.multiselect._isInList = function(e, list) {
            if (!list) {
                return false;
            }
            for (var i = 0; i < list.length; i++) {
                var ei = list[i];
                if (e === ei) {
                    return true;
                }
                if (typeof ei.id === 'function') {
                    if (ei.id() !== null && e.id() !== null && ei.id() === e.id()) {
                        return true;
                    }
                    if (ei.id() === null && e.id() === null && ei.recurrentMasterId() === e.recurrentMasterId() && e.start().toStringSortable() === ei.start().toStringSortable()) {
                        return true;
                    }
                }
                else {
                    if (ei.id !== null && e.id() !== null && ei.id === e.id()) {
                        return true;
                    }
                    if (ei.id === null && e.id() === null && ei.recurrentMasterId === e.recurrentMasterId() && e.start().toStringSortable() === ei.start) {
                        return true;
                    }
                }
            }

            return false;
        };

        this.multiselect.startRectangle = function() {
            rectangle.start();
        };

        this._updateSeparators = function() {
            this._deleteSeparators();
            this._drawSeparators();
        };

        this._updateRowHeaderColumns = function() {
            calendar._drawResHeader();
            calendar._updateRowHeaderHeights();
            calendar._updateRowHeaderWidth();

            if (calendar.progressiveRowRendering) {
                calendar._drawResHeadersProgressive();
            }

        };

        this._update = function(args) {
            var args = args || {};
            var full = !args.eventsOnly;

/*
            if (!calendar.cssOnly) {
                calendar.cssOnly = true;
                DayPilot.Util.log("DayPilot: cssOnly = false mode is not supported since DayPilot Pro 8.0.")
            }
*/

            if (full) {
                if (!this._serverBased()) {
                    calendar.timeHeader = null;
                    calendar.cellProperties = {};
                }
                calendar._bcrCache = {};
                calendar._calculateCellWidth();
                calendar._prepareItline();
                if (!args || !args.dontLoadResources) {
                    calendar._loadResources();
                }
                calendar.events._postponedClear();
                calendar._resolved.clearCache();
            }

            this._loadEvents();

            this._filterRows();

            // 2016-03-12: row headers are now always updated (because of onBeforeRowHeaderRender)
            calendar._drawResHeader();

            if (full) {
                calendar._updateTheme();
                calendar._updateCorner();
                calendar._drawTimeHeader();
                calendar._loadSelectedRows(calendar.selectedRows);
                calendar._updateRowHeaderHideIconVisibility();
            }

            calendar._prepareRowTops();
            calendar._updateRowHeaderHeights();
            calendar._updateRowHeaderWidth();
            calendar._updateHeaderHeight();

            linktools.hideLinkpoints();

            this._deleteEvents();
            this._deleteCells();

            this._clearCachedValues();
            this._expandCellProperties();

            this._drawCells();
            this._updateSeparators();

            calendar._updateHeight();

            if (args.immediateEvents || args.eventsOnly) {
                calendar._drawEvents();
            }
            else {
                setTimeout(function() { calendar._drawEvents(); }, 100);
            }

            // moved to drawEvents()
            /*
            if (!DayPilot.list(calendar.multiselect.list).isEmpty()) {
                this.multiselect.redraw();
            }
            */

            if (this.visible) {
                if (calendar._previousVisible != calendar.visible) {
                    this.show();
                }
                //this._show();
            }
            else {
                this.hide();
            }
            this._previousVisible = this.visible;

            this._updateFloats();


            var angular = calendar._angular.scope || calendar._angular2.enabled;

            if (!angular || calendar._initialized) {
                this._onScroll();
            }

            this._doAfterUpdate();

            //if (this.autoRefreshEnabled)
            this._startAutoRefresh();

        };

        this._doAfterUpdate = function() {
            if (typeof calendar.onAfterUpdate !== "function") {
                return;
            }
            var args = {};
            calendar.onAfterUpdate(args);
        };


        // full update
        this.update = function(options) {

            if (calendar._disposed) {
                throw new DayPilot.Exception("You are trying to update a DayPilot.Scheduler object that has been disposed already. Calling .dispose() destroys the object and makes it unusable.");
            }

            postponedUpdate.request(options);

        };

        var postponedUpdate = {};
        postponedUpdate.timeout = null;
        postponedUpdate.options = null;

        // if enabled, all update() calls within a single block are merged
        // - but the update itself is performed asynchronously and it's unexpectd behavior
        postponedUpdate.enabled = false;

        postponedUpdate.request = function(options) {
            if (postponedUpdate.enabled) {
                clearTimeout(postponedUpdate.timeout);
                postponedUpdate.mergeOptions(options);
                postponedUpdate.timeout = setTimeout(postponedUpdate.doit);
            }
            else {
                postponedUpdate.mergeOptions(options);
                postponedUpdate.doit();
            }
        };

        postponedUpdate.mergeOptions = function(options) {
            if (!options) {
                return;
            }

            if (!postponedUpdate.options) {
                postponedUpdate.options = {};
            }

            for (var name in options) {
                postponedUpdate.options[name] = options[name];
            }
        };

        postponedUpdate.doit = function() {

            var options = postponedUpdate.options;
            postponedUpdate.options = null;

            if (!calendar._initialized) {
                calendar._loadOptions(options);
                return;
            }

            // selected single-property updates are optimized

            if (DayPilot.Util.isOnlyProperty(options, "events")) {
                calendar.events.list = options.events;
                calendar._update({"eventsOnly": true});
                return;
            }

            if (DayPilot.Util.isOnlyProperty(options, "separators")) {
                calendar.separators = options.separators;
                calendar._updateSeparators();
                return;
            }

            if (DayPilot.Util.isOnlyProperty(options, "rowHeaderColumns")) {
                calendar.rowHeaderColumns = options.rowHeaderColumns;
                calendar._updateRowHeaderColumns();
                return;
            }

            // full update
            calendar._loadOptions(options);
            calendar._update({"immediateEvents":true});
            calendar._fireAfterRenderDetached(null, false);

        };

        this._updateRowsNoLoad = function(rows, appendOnlyIfPossible, finishedCallBack) {
            //var start, end;

            rows = DayPilot.ua(rows);

            for (var i = 0; i < rows.length; i++) {
                var ri = rows[i];
                calendar._drawRowForced(ri);
            }

            if (this._rowsDirty) {
                this._prepareRowTops();
                this._updateRowHeaderHeights();

                this._deleteCells();

                this._deleteSeparators();

                for (var i = 0; i < rows.length; i++) {
                    var ri = rows[i];
                    this._deleteEventsInRow(ri);
                }

                for (var i = 0; i < rows.length; i++) {
                    var ri = rows[i];
                    this._drawEventsInRow(ri);
                }

                this._drawCells();

                this._drawSeparators();
                this._updateEventTops();

            }
            else {
                // turned off because it doesn't work well with manual async event updates in onEventMove
                var batch = false;


                if (batch) {
                    var doRow = function(i) {
                        if (i >= rows.length) {
                            return;
                        }
                        var ri = rows[i];
                        if (!appendOnlyIfPossible) {
                            calendar._deleteEventsInRow(ri);
                        }
                        calendar._drawEventsInRow(ri);
                        if (i + 1 < rows.length) {
                            setTimeout(function() { doRow(i+1); }, 10);
                        }
                        else {
                            calendar._findEventsInViewPort();
                            linktools.load();
                            calendar.multiselect.redraw();
                            if (finishedCallBack) {
                                finishedCallBack();
                            }
                        }
                    };
                    doRow(0);
                }
                else {
                    for (var i = 0; i < rows.length; i++) {
                        var ri = rows[i];
                        if (!appendOnlyIfPossible) {
                            this._deleteEventsInRow(ri);
                        }
                        this._drawEventsInRow(ri);
                    }

                }

                DayPilot.list(rows).each(function(y) {
                    calendar._deleteCellsInRow(y);
                });
                calendar._drawCells();

            }
            
            calendar._findEventsInViewPort();
            linktools.load();
            calendar.multiselect.redraw();

            if (finishedCallBack) {
                finishedCallBack();
            }

            this._clearCachedValues();
            
        };

        this._adjustEndOut = function(date) {
            if (calendar.eventEndSpec === "DateTime") {
                return date;
            }
            if (date.getDatePart().ticks === date.ticks) {
                return date.addDays(-1);
            }
            return date.getDatePart();
        };

        this._adjustEndIn = function(date) {
            if (calendar.eventEndSpec === "DateTime") {
                return date;
            }
            return date.getDatePart().addDays(1);
        };

        this._adjustEndNormalize = function(date) {
            if (calendar.eventEndSpec === "DateTime") {
                return date;
            }
            return date.getDatePart();
        };

        this._eventMoveDispatch = function(e, newStart, newEnd, newResource, external, ev, line) {

            calendar._lastEventMoving = null;

            if (calendar.eventMoveHandling === 'Disabled') {
                return;
            }

            newEnd = calendar._adjustEndOut(newEnd);

            var args = {};

            args.e = e;
            args.newStart = newStart;
            args.newEnd = newEnd;
            args.newResource = newResource;
            args.external = external;
            args.ctrl = false;
            args.meta = false;
            args.shift = false;
            if (ev) {
                args.shift = ev.shiftKey;
                args.ctrl = ev.ctrlKey;
                args.meta = ev.metaKey;
            }
            args.multimove = DayPilot.list(mm.list);
            args.areaData = DayPilot.Global.movingAreaData;
            args.control = calendar;
            args.toJSON = function() {
                return DayPilot.Util.copyProps(args, {}, ["e", "newStart", "newEnd", "newResource", "external", "ctrl", "meta", "shift", "multimove", "areaData"]);
            };

            var info = {};
            info.event = e;
            info.start = newStart;
            info.end = newEnd;
            info.overlapping = false;
            info.resource = newResource;
            args.multimove.splice(0, 0, info);

            args.position = line;
            args.preventDefault = function() {
                this.preventDefault.value = true;
            };

            if (calendar._api2()) {
                // API v2

                var doit = function() {

                    overlay.hide();

                    if (args.preventDefault.value) {
                        calendar._clearMovingShadow();
                        return;
                    }

                    newStart = args.newStart;
                    newEnd = args.newEnd;

                    switch (calendar.eventMoveHandling) {
                        case 'PostBack':
                            calendar.eventMovePostBack(args);
                            break;
                        case 'CallBack':
                            calendar.eventMoveCallBack(args);  // e, newStart, newEnd, newResource, null, line
                            break;
                        case 'Notify':
                            calendar.eventMoveNotify(args);
                            break;
                        case 'Update':
                            //newEnd = calendar._adjustEndIn(newEnd);
                            calendar._doEventMoveUpdate(args);
                            break;
                    }

                    calendar._clearMovingShadow();

                    if (typeof calendar.onEventMoved === 'function') {
                        calendar.onEventMoved(args);
                    }

                };

                args.async = false;
                args.loaded = function() {
                    doit();
                };

                if (typeof calendar.onEventMove === 'function') {
                    calendar.onEventMove(args);
                }

                if (!args.async) {
                    doit();
                }
                else {
                    if (calendar.blockOnCallBack) {
                        overlay.show();
                    }
                }

            }
            else {
                switch (calendar.eventMoveHandling) {
                    case 'PostBack':
                        calendar.eventMovePostBack(args);
                        break;
                    case 'CallBack':
                        calendar.eventMoveCallBack(args);
                        break;
                    case 'JavaScript':
                        calendar.onEventMove(e, newStart, newEnd, newResource, external, ev ? ev.ctrlKey : false, ev ? ev.shiftKey : false, line);
                        break;
                    case 'Notify':
                        calendar.eventMoveNotify(args);
                        break;
                    case 'Update':
                        calendar._doEventMoveUpdate(args);
                        /*
                        e.start(newStart);
                        e.end(newEnd);
                        e.resource(newResource);
                        calendar.events.update(e);*/
                        break;
                }

                calendar._clearMovingShadow();
            }

        };

        this._doEventMoveUpdate = function(args) {
            /*
             e.start(newStart);
             e.end(newEnd);
             calendar.events.update(e);

             */

            var e = args.e;
            var newStart = args.newStart;
            var newEnd = args.newEnd;
            var newResource = args.newResource;
            var external = args.external;

            e.start(newStart);
            e.end(newEnd);
            e.resource(newResource);
            if (external) {
                e.commit();
                calendar.events.add(e);
            }
            else {
                calendar.events.update(e);
            }
            if (args.multimove && !args.multimove.isEmpty()) {
                args.multimove.each(function(item) {
                    if (item.event === e) { // skip the main event
                        return;
                    }

                    item.event.start(item.start);
                    item.event.end(item.end);

                    if (mm.rowoffset) {
                        var ri = item.event.part.dayIndex + mm.rowoffset;
                        var newResource = calendar.rowlist[ri].id;
                        item.event.resource(newResource);
                    }

                    item.event.commit();
                    calendar.events.update(item.event);
                });
            }
            if (args.multiresize && !args.multiresize.isEmpty()) {
                args.multiresize.each(function(item) {
                    if (item.event === e) { // skip the main event
                        return;
                    }

                    item.event.start(item.start);
                    item.event.end(item.end);
                    item.event.commit();
                    calendar.events.update(item.event);
                });

            }
            calendar.events.immediateRefresh();
            calendar._deleteDragSource();

        };


        this._bubbleCallBack = function(args, bubble) {
            var guid = calendar._recordBubbleCall(bubble);

            var params = {};
            params.args = args;
            params.guid = guid;

            calendar._callBack2("Bubble", params);
        };

        this._recordBubbleCall = function(bubble) {
            var guid = DayPilot.guid();
            if (!this.bubbles) {
                this.bubbles = [];
            }

            this.bubbles[guid] = bubble;
            return guid;
        };

        this.eventMenuClickPostBack = function(e, command, data) {
            var params = {};
            params.e = e;
            params.command = command;

            this._postBack2('EventMenuClick', params, data);
        };
        this.eventMenuClickCallBack = function(e, command, data) {

            var params = {};
            params.e = e;
            params.command = command;

            this._callBack2('EventMenuClick', params, data);
        };

        this._eventMenuClick = function(command, e, handling) {
            switch (handling) {
                case 'PostBack':
                    calendar.eventMenuClickPostBack(e, command);
                    break;
                case 'CallBack':
                    calendar.eventMenuClickCallBack(e, command);
                    break;
            }
        };

        this.timeRangeSelectedPostBack = function(start, end, resource, data) {
            var range = {};
            range.start = start;
            range.end = end;
            range.resource = resource;

            this._postBack2('TimeRangeSelected', range, data);
        };
        this.timeRangeSelectedCallBack = function(start, end, resource, data) {

            var range = {};
            range.start = start;
            range.end = end;
            range.resource = resource;

            this._callBack2('TimeRangeSelected', range, data);
        };

        this._timeRangeSelectedDispatchFromRange = function(range) {
            if (!range) {
                return;
            }
            if (range.disabled) {
                calendar.clearSelection();
                return;
            }
            var sel = calendar._getSelection(range);
            if (!sel) {
                return;
            }
            calendar._timeRangeSelectedDispatch(sel.start, sel.end, sel.resource);
        };

        this._timeRangeSelectedDispatch = function(start, end, resource) {

            if (calendar.timeRangeSelectedHandling === 'Disabled') {
                return;
            }

            var rawend = end;
            end = calendar._adjustEndOut(rawend);

            var args = {};
            args.control = calendar;
            args.start = start;
            args.end = end;
            args.resource = resource;
            args.preventDefault = function () {
                this.preventDefault.value = true;
            };
            args.multirange = DayPilot.list(mr.list).map(function (item) {
                return calendar._getSelection(item);
            });
            if (args.multirange.isEmpty()) {
                args.multirange.push({"start": args.start, "end": args.end, "resource": args.resource});
            }
            args.toJSON = function() {
                return DayPilot.Util.copyProps(args, {}, ["start", "end", "resource", "multirange"]);
            };

            if (calendar._api2()) {

                if (typeof calendar.onTimeRangeSelect === 'function') {
                    calendar.onTimeRangeSelect(args);
                    if (args.preventDefault.value) {
                        return;
                    }

                    start = args.start;
                    end = args.end;
                }

                calendar._updateRange(calendar.rangeHold, start, end, args.multirange);

                // this was corrupting the custom position indicators set using onTimeRangeSelecting
                //calendar._drawRange(DayPilotScheduler.rangeHold, true);

                calendar._drawRange(calendar.rangeHold);

                // now perform the default built-in action
                switch (calendar.timeRangeSelectedHandling) {
                    case 'PostBack':
                        calendar._invokeTimeRangeSelected("PostBack", args);
                        break;
                    case 'CallBack':
                        calendar._invokeTimeRangeSelected("CallBack", args);
                        break;
                }

                if (typeof calendar.onTimeRangeSelected === 'function') {
                    calendar.onTimeRangeSelected(args);
                }

            }
            else {
                switch (calendar.timeRangeSelectedHandling) {
                    case 'PostBack':
                        calendar._invokeTimeRangeSelected("PostBack", args);
                        break;
                    case 'CallBack':
                        calendar._invokeTimeRangeSelected("CallBack", args);
                        break;
                    case 'JavaScript':
                        calendar.onTimeRangeSelected(start, end, resource, args.multirange);
                        break;
                    case 'Hold':
                        break;
                }
            }

        };

        this._updateRange = function(range, start, end, multirange) {
            //var range = DayPilotScheduler.rangeHold;

            if (!range || (multirange && multirange.length > 1)) {
                return;
            }

            var rawend = calendar._adjustEndIn(end);

            var itc, cell;

            var rowOffset = 0;
            if (calendar.viewType === "Days") {
                var row = calendar._findRowInDaysView(start);
                rowOffset = row.start.getTime() - calendar._visibleStart().getTime();
            }

            // fix start
            if (start.getTime() < calendar.itline[0].start.getTime()) {
                range.start.x = 0;
            }
            else {
                itc = calendar._getItlineCellFromTime(start.addTime(-rowOffset));
                cell = itc.current || itc.previous;
                range.start.x = DayPilot.indexOf(calendar.itline, cell);
            }

            // fix end
            itc = calendar._getItlineCellFromTime(rawend.addSeconds(-1).addTime(-rowOffset));
            if (itc.past) {
                range.end.x = calendar.itline.length - 1;
            }
            else {
                cell = itc.current || itc.next;
                range.end.x = DayPilot.indexOf(calendar.itline, cell);
            }
        };

        this._findRowInDaysView = function(start) {
            /*
            // inefficient
            var day = start.getDatePart().getTime();
            for (var i = 0; i < calendar.rowlist.length; i++) {
                var row = calendar.rowlist[i];
                var rs = row.start.getTime();
                if (rs === day) {
                    return row;
                }
            }
            */
            var day = start.getDatePart();
            return DayPilot.list(calendar.rowlist).find(function(item) {
                return item.start.getDatePart() === day;
            });
        };

        this.timeRangeDoubleClickPostBack = function(start, end, resource, data) {
            var range = {};
            range.start = start;
            range.end = end;
            range.resource = resource;

            this._postBack2('TimeRangeDoubleClick', range, data);
        };
        this.timeRangeDoubleClickCallBack = function(start, end, resource, data) {

            var range = {};
            range.start = start;
            range.end = end;
            range.resource = resource;

            this._callBack2('TimeRangeDoubleClick', range, data);
        };


        this._timeRangeDoubleClickDispatch = function(start, end, resource) {

            end = calendar._adjustEndOut(end);

            if (calendar._api2()) {

                
                var args = {};
                args.start = start;
                args.end = end;
                args.resource = resource;
                
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onTimeRangeDoubleClick === 'function') {
                    calendar.onTimeRangeDoubleClick(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }

                switch (calendar.timeRangeDoubleClickHandling) {
                    case 'PostBack':
                        calendar.timeRangeDoubleClickPostBack(start, end, resource);
                        break;
                    case 'CallBack':
                        calendar.timeRangeDoubleClickCallBack(start, end, resource);
                        break;
                }
                
                if (typeof calendar.onTimeRangeDoubleClicked === 'function') {
                    calendar.onTimeRangeDoubleClicked(args);
                }
            }
            else {
                //end = calendar._adjustEndOut(end);
                switch (calendar.timeRangeDoubleClickHandling) {
                    case 'PostBack':
                        calendar.timeRangeDoubleClickPostBack(start, end, resource);
                        break;
                    case 'CallBack':
                        calendar.timeRangeDoubleClickCallBack(start, end, resource);
                        break;
                    case 'JavaScript':
                        calendar.onTimeRangeDoubleClick(start, end, resource);
                        break;
                }
                
            }

        };

        this.timeRangeMenuClickPostBack = function(e, command, data) {
            var params = {};
            params.selection = e;
            params.command = command;

            this._postBack2("TimeRangeMenuClick", params, data);
        };
        this.timeRangeMenuClickCallBack = function(e, command, data) {
            var params = {};
            params.selection = e;
            params.command = command;

            this._callBack2("TimeRangeMenuClick", params, data);
        };


        this._timeRangeMenuClick = function(command, e, handling) {
            switch (handling) {
                case 'PostBack':
                    calendar.timeRangeMenuClickPostBack(e, command);
                    break;
                case 'CallBack':
                    calendar.timeRangeMenuClickCallBack(e, command);
                    break;
            }
        };

        this.linkMenuClickPostBack = function(e, command, data) {
            var params = {};
            params.link = e;
            params.command = command;

            this._postBack2("LinkMenuClick", params, data);
        };

        this.linkMenuClickCallBack = function(e, command, data) {
            var params = {};
            params.link = e;
            params.command = command;

            this._callBack2("LinkMenuClick", params, data);
        };

        this._linkMenuClick = function(command, e, handling) {
            switch (handling) {
                case 'PostBack':
                    calendar.linkMenuClickPostBack(e, command);
                    break;
                case 'CallBack':
                    calendar.linkMenuClickCallBack(e, command);
                    break;
            }
        };

        this.rowMenuClickPostBack = function(e, command, data) {
            var params = {};
            params.resource = e;
            params.command = command;

            this._postBack2("RowMenuClick", params, data);
        };

        // backwards compatibility
        this.resourceHeaderMenuClickPostBack = this.rowMenuClickPostBack;
        
        this.rowMenuClickCallBack = function(e, command, data) {
            var params = {};
            params.resource = e;
            params.command = command;

            this._callBack2("RowMenuClick", params, data);
        };

        this.resourceHeaderMenuClickCallBack = this.rowMenuClickCallBack;

        this._rowMenuClick = function(command, e, handling) {
            switch (handling) {
                case 'PostBack':
                    calendar.rowMenuClickPostBack(e, command);
                    break;
                case 'CallBack':
                    calendar.rowMenuClickCallBack(e, command);
                    break;
            }
        };
        
        this._rowUpdateText = function (oldRow, newText) {

            var r = calendar._createRowObject(oldRow);
            r.data.name = newText;
            if (r.data.html) {
                r.data.html = newText;
            }

            calendar.rows.update(r);

        };

        this._rowCreateDispatch = function(row, newText) {
            if (!newText) {
                return;
            }

            var args = {};
            args.text = newText;
            args.preventDefault = function() {
                this.preventDefault.value = true;
            };

            if (typeof calendar.onRowCreate === "function") {
                calendar.onRowCreate(args);
                if (args.preventDefault.value) {
                    return;
                }
            }

            switch (calendar.rowCreateHandling) {
                case "CallBack":
                    calendar.rowCreateCallBack(args.text);
                    break;
                case "PostBack":
                    calendar.rowCreatePostBack(args.text);
                    break;

            }

            if (typeof calendar.onRowCreated === "function") {
                calendar.onRowCreated(args);
            }

        };
        
        this._rowEditDispatch = function(row, newText, canceled) {
            if (row.isNewRow) {
                if (!canceled) {
                    calendar._rowCreateDispatch(row, newText);
                }
                return;
            }

            var index = DayPilot.indexOf(calendar.rowlist, row);
            var e = calendar._createRowObject(row, index);
            
            if (calendar._api2()) {
                
                var args = {};
                args.resource = e;
                args.row = e;
                args.newText = newText;
                args.canceled = canceled;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onRowEdit === 'function') {
                    calendar.onRowEdit(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }

                if (!canceled) {
                    switch (calendar.rowEditHandling) {
                        case 'PostBack':
                            calendar.rowEditPostBack(e, newText);
                            break;
                        case 'CallBack':
                            calendar.rowEditCallBack(e, newText);
                            break;
                        case 'Update':
                            calendar._rowUpdateText(row, newText);
                            break;
                    }

                    if (typeof calendar.onRowEdited === 'function') {
                        calendar.onRowEdited(args);
                    }
                }
            }
            else {
                switch (calendar.rowEditHandling) {
                    case 'PostBack':
                        calendar.rowEditPostBack(e, newText);
                        break;
                    case 'CallBack':
                        calendar.rowEditCallBack(e, newText);
                        break;
                    case 'JavaScript':
                        calendar.onrowEdit(e, newText);
                        break;
                }
            }
        };

        this.rowCreatePostBack = function(newText, data) {
            var params = {};
            params.text = newText;

            this._postBack2("RowCreate", params, data);
        };

        this.rowCreateCallBack = function(newText, data) {
            var params = {};
            params.text = newText;

            this._callBack2("RowCreate", params, data);
        };
        
        this.rowEditPostBack = function(e, newText, data) {
            var params = {};
            params.resource = e;
            params.newText = newText;

            this._postBack2("RowEdit", params, data);
        };

        this.rowEditCallBack = function(e, newText, data) {
            var params = {};
            params.resource = e;
            params.newText = newText;

            this._callBack2("RowEdit", params, data);
        };

        this.rowMovePostBack = function(source, target, position, data) {
            var params = {};
            params.source = source;
            params.target = target;
            params.position = position;

            this._postBack2("RowMove", params, data);
        };

        this.rowMoveCallBack = function(source, target, position, data) {
            var params = {};
            params.source = source;
            params.target = target;
            params.position = position;

            this._callBack2("RowMove", params, data);
        };

        this.rowMoveNotify = function(source, target, position, data) {
            var params = {};
            params.source = source;
            params.target = target;
            params.position = position;

            this._callBack2("RowMove", params, data, "Notify");
        };

        this.rowClickPostBack = function(e, data) {
            var params = {};
            params.resource = e;

            this._postBack2("RowClick", params, data);
        };
        
        // backwards compatibility
        this.resourceHeaderClickPostBack = this.rowClickPostBack;
        
        this.rowClickCallBack = function(e, data) {
            var params = {};
            params.resource = e;

            this._callBack2("RowClick", params, data);
        };
        
        // backwards compatibility
        this.resourceHeaderClickCallBack = this.rowClickCallBack;
        
        this._rowClickDispatch = function(e, ctrl, shift, meta) {
            
            if (calendar.rowDoubleClickHandling === "Disabled") {
                calendar._rowClickSingle(e, ctrl, shift, meta);
                return;
            }

            if (!calendar.timeouts.resClick) {
                calendar.timeouts.resClick = [];
            }

            var resClickDelayed = function(e, ctrl, shift, meta) {
                return function() {
                    calendar._rowClickSingle(e, ctrl, shift, meta);
                };
            };

            calendar.timeouts.resClick.push(window.setTimeout(resClickDelayed(e, ctrl, shift, meta), calendar.doubleClickTimeout));
        };

        this._rowClickSingle = function(e, ctrl, shift, meta) {
            
            // backwards compatibility
            var rowClickHandling = calendar.resourceHeaderClickHandling || calendar.rowClickHandling;
            
            if (calendar._api2()) {
                
                var args = {};
                args.resource = e;
                args.row = e;
                args.ctrl = ctrl;
                args.shift = shift;
                args.meta = meta;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onRowClick === 'function') {
                    calendar.onRowClick(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }
                
                // backwards compatiblity
                if (typeof calendar.onResourceHeaderClick === 'function') {
                    calendar.onResourceHeaderClick(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }
                
                switch (rowClickHandling) {
                    case 'PostBack':
                        calendar.rowClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.rowClickCallBack(e);
                        break;
                    case 'Select':
                        calendar._rowSelectDispatch(e.$.row, ctrl, shift, meta);
                        break;
                    case 'Edit':
                        calendar._rowtools.edit(e.$.row);
                        break;
                }
                
                if (typeof calendar.onRowClicked === 'function') {
                    calendar.onRowClicked(args);
                }  
                
                if (typeof calendar.onResourceHeaderClicked === 'function') {
                    calendar.onResourceHeaderClicked(args);
                } 

            }
            else {
      
                switch (rowClickHandling) {
                    case 'PostBack':
                        calendar.rowClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.rowClickCallBack(e);
                        break;
                    case 'JavaScript':
                        calendar.onRowClick(e);
                        break;
                    case 'Select':
                        calendar._rowSelectDispatch(e.$.row, ctrl, shift);
                        break;
                    case 'Edit':
                        calendar._rowtools.edit(e.$.row);
                        break;
                }
            }
        };
        //

        this.timeHeaderClickPostBack = function(e, data) {
            var params = {};
            params.header = e;

            this._postBack2("TimeHeaderClick", params, data);
        };

        this.timeHeaderClickCallBack = function(e, data) {
            var params = {};
            params.header = e;

            this._callBack2("TimeHeaderClick", params, data);
        };

        this._timeHeaderClickDispatch = function(e) {
            if (calendar._api2()) {
                
                var args = {};
                args.header = e;
                /*
                 * start
                 * end
                 * level
                 * 
                 */
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onTimeHeaderClick === 'function') {
                    calendar.onTimeHeaderClick(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }
                
                switch (this.timeHeaderClickHandling) {
                    case 'PostBack':
                        calendar.timeHeaderClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.timeHeaderClickCallBack(e);
                        break;
                }     
                
                if (typeof calendar.onTimeHeaderClicked === 'function') {
                    calendar.onTimeHeaderClicked(args);
                }                
            }
            else {
                switch (this.timeHeaderClickHandling) {
                    case 'PostBack':
                        calendar.timeHeaderClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.timeHeaderClickCallBack(e);
                        break;
                    case 'JavaScript':
                        calendar.onTimeHeaderClick(e);
                        break;
                }
            }
        };

        //        
        this.resourceCollapsePostBack = function(e, data) {
            var params = {};
            params.resource = e;

            this._postBack2("ResourceCollapse", params, data);
        };
        this.resourceCollapseCallBack = function(e, data) {
            var params = {};
            params.resource = e;

            this._callBack2("ResourceCollapse", params, data);
        };

        this._resourceCollapseDispatch = function(e) {
            
            if (calendar._api2()) {
                
                var args = {};
                args.resource = e;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onResourceCollapse === 'function') {
                    calendar.onResourceCollapse(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }
                
                switch (this.resourceCollapseHandling) {
                    case 'PostBack':
                        calendar.resourceCollapsePostBack(e);
                        break;
                    case 'CallBack':
                        calendar.resourceCollapseCallBack(e);
                        break;
                }                
            }
            else {
                switch (this.resourceCollapseHandling) {
                    case 'PostBack':
                        calendar.resourceCollapsePostBack(e);
                        break;
                    case 'CallBack':
                        calendar.resourceCollapseCallBack(e);
                        break;
                    case 'JavaScript':
                        calendar.onResourceCollapse(e);
                        break;
                }
            }
            
        };

        // expand
        this.resourceExpandPostBack = function(e, data) {
            var params = {};
            params.resource = e;

            this._postBack2("ResourceExpand", params, data);
        };
        this.resourceExpandCallBack = function(e, data) {
            var params = {};
            params.resource = e;

            this._callBack2("ResourceExpand", params, data);
        };

        this._resourceExpandDispatch = function(e) {
            
            if (calendar._api2()) {

                var args = {};
                args.resource = e;
                args.row = e;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onResourceExpand === 'function') {
                    calendar.onResourceExpand(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }

                switch (this.resourceExpandHandling) {
                    case 'PostBack':
                        calendar.resourceExpandPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.resourceExpandCallBack(e);
                        break;
                }

            }
            else {
                switch (this.resourceExpandHandling) {
                    case 'PostBack':
                        calendar.resourceExpandPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.resourceExpandCallBack(e);
                        break;
                    case 'JavaScript':
                        calendar.onResourceExpand(e);
                        break;
                }
                
            }
            
        };

        this.eventEditPostBack = function(e, newText, data) {
            var params = {};
            params.e = e;
            params.newText = newText;

            this._postBack2("EventEdit", params, data);
        };
        this.eventEditCallBack = function(e, newText, data) {

            var params = {};
            params.e = e;
            params.newText = newText;

            this._callBack2("EventEdit", params, data);
        };

        this.eventEditNotify = function(e, newText, data, options) {

            var old = new DayPilot.Event(e.copy(), this);

            e.text(newText);
            calendar.events.update(e, null, options);

            var params = {};
            params.e = old;
            params.newText = newText;

            this._callBack2("EventEdit", params, data, "Notify");
        };
        this._eventEditDispatch = function(e, newText, canceled) {

            //var canceled = DayPilotScheduler.editing.canceling;

            if (calendar._api2()) {
                
                var args = {};
                args.e = e;
                args.newText = newText;
                args.canceled = canceled;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onEventEdit === 'function') {
                    calendar.onEventEdit(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }

                if (!canceled) {
                    switch (calendar.eventEditHandling) {
                        case 'PostBack':
                            calendar.eventEditPostBack(e, newText);
                            break;
                        case 'CallBack':
                            calendar.eventEditCallBack(e, newText);
                            break;
                        case 'Update':
                            e.text(newText);
                            calendar.events.update(e, null, {"inplace": true});
                            break;
                    }
                }

                if (typeof calendar.onEventEdited === 'function') {
                    calendar.onEventEdited(args);
                }
            }
            else {
                //if (!canceled) {
                    switch (calendar.eventEditHandling) {
                        case 'PostBack':
                            calendar.eventEditPostBack(e, newText);
                            break;
                        case 'CallBack':
                            calendar.eventEditCallBack(e, newText);
                            break;
                        case 'Notify':
                            calendar.eventEditNotify(e, newText, null, {"inplace": true});
                            break;
                        case 'JavaScript':
                            calendar.onEventEdit(e, newText);
                            break;
                    }
                //}
            }
        };

        this.commandCallBack = function(command, data) {
            this._invokeCommand("CallBack", command, data);
        };

        this.commandPostBack = function(command, data) {
            this._invokeCommand("PostBack", command, data);
        };

        this._invokeCommand = function(type, command, data) {
            var params = {};
            params.command = command;

            this._invokeEvent(type, "Command", params, data);
        };


        this._postBack2 = function(action, parameters, data) {
            var envelope = {};
            envelope.action = action;
            envelope.type = "PostBack";
            envelope.parameters = parameters;
            envelope.data = data;
            envelope.header = this._getCallBackHeader();

            var commandstring = "JSON" + JSON.stringify(envelope);
            __doPostBack(calendar.uniqueID, commandstring);
        };

        this._callBack2 = function(action, parameters, data, type) {
            
            if (!calendar._serverBased()) {
                calendar.debug.message("Callback invoked without the server-side backend specified. Callback canceled.", "warning");
                return;
            }

            if (typeof type === 'undefined') {
                type = "CallBack";
            }

            this._pauseAutoRefresh();

            calendar._loadingStart();

            var envelope = {};

            envelope.action = action;
            envelope.type = type;
            envelope.parameters = parameters;
            envelope.data = data;
            envelope.header = this._getCallBackHeader();

            var json = JSON.stringify(envelope);

            var commandstring;
            if (typeof Iuppiter !== 'undefined' && Iuppiter.compress) {
                commandstring = "LZJB" + Iuppiter.Base64.encode(Iuppiter.compress(json));
            }
            else {
                commandstring = "JSON" + json;
            }

            this._doCallBackStart(envelope);

            var context = null;
            if (this.backendUrl) {
                DayPilot.request(this.backendUrl, this._callBackResponse, commandstring, this._ajaxError);
            }
            else if (typeof WebForm_DoCallback === 'function') {
                WebForm_DoCallback(this.uniqueID, commandstring, this._updateView, context, this.callbackError, true);
            }
        };


        this._doCallBackStart = function(envelope) {
            var args = {};
            if (typeof calendar.onCallBackStart === 'function') {
                calendar.onCallBackStart(args);
            }
        };

        this._doCallBackEnd = function() {
            var args = {};
            if (typeof calendar.onCallBackEnd === 'function') {
                setTimeout(function() {
                    calendar.onCallBackEnd(args);
                }, 0);
            }
        };

        this._serverBased = function() {
            return (calendar._productCode !== "javasc" && calendar._productCode.indexOf("DCODE") === -1) || calendar.devsb;
        };

        this._isAspnetWebForms = function() {
            if (typeof WebForm_DoCallback === 'function' && this.uniqueID) {
                return true;
            }
            return false;
        };
        
        this._ajaxError = function(req) {
            if (typeof calendar.onAjaxError === 'function') {
                var args = {};
                args.request = req;
                calendar.onAjaxError(args);
            }
            else if (typeof calendar.ajaxError === 'function') { // backwards compatibility
                calendar.ajaxError(req);
            }
        };      

        this._callBackResponse = function(response) {
            calendar._updateView(response.responseText);
        };

        this._getCallBackHeader = function() {
            var h = {};

            h.v = this.v;
            h.control = "dps";
            h.id = this.id;

            // callback-changeable state
            h.startDate = calendar.startDate;
            h.days = calendar.days;
            h.cellDuration = calendar.cellDuration;
            h.cellGroupBy = calendar.cellGroupBy;
            h.cellWidth = calendar.cellWidth;
            h.cellWidthSpec = calendar.cellWidthSpec;

            // extra properties
            h.viewType = calendar.viewType; // serialize
            // h.hourNameBackColor = calendar.hourNameBackColor;
            h.showNonBusiness = calendar.showNonBusiness;
            h.businessBeginsHour = calendar.businessBeginsHour;
            h.businessEndsHour = calendar.businessEndsHour;
            h.weekStarts = calendar.weekStarts;
            h.treeEnabled = calendar.treeEnabled;
            //h.backColor = calendar.cellBackColor;
            //h.nonBusinessBackColor = calendar.cellBackColorNonBusiness;
            h.locale = calendar.locale;
            h.timeZone = calendar.timeZone;
            h.tagFields = calendar.tagFields;
            h.timeHeaders = calendar.timeHeaders;
            h.cssClassPrefix = calendar.cssClassPrefix;
            h.durationBarMode = calendar.durationBarMode;
            // h.showBaseTimeHeader = true; // to be removed
            h.rowHeaderColumns = calendar.rowHeaderColumns;
            h.rowMarginBottom = calendar.rowMarginBottom;
            h.rowMarginTop = calendar.rowMarginTop;
            h.rowMinHeight = calendar.rowMinHeight;
            h.scale = calendar.scale;

            // custom state
            h.clientState = calendar.clientState;

            // user-changeable state
            if (this.nav.scroll) {
                h.scrollX = Math.max(0, this.nav.scroll.scrollLeft);   // Safari can return a negative value
                h.scrollY = Math.max(0, this.nav.scroll.scrollTop);   // Safari can return a negative value
            }

            h.selected = calendar.multiselect.events();
            h.selectedRows = rowtools._getSelectedList();

            // special
            h.hashes = calendar.hashes;

            var area = calendar._getArea(h.scrollX, h.scrollY);
            var range = calendar._getAreaRange(area);
            var res = calendar._getAreaResources(area);

            //h.scrollX = calendar.scrollX;
            //h.scrollY = calendar.scrollY;

            h.rangeStart = range.start;
            h.rangeEnd = range.end;
            h.resources = res;
            h.dynamicLoading = calendar.dynamicLoading;

            h.separators = this.separators;

            if (this.syncResourceTree && this.viewType != "Days") {
                h.tree = this._getTreeState();
            }
            if (this.syncLinks) {
                h.links = this._getLinksState();
            }
            if (this.scale === "Manual") {
                h.timeline = this._getTimelineState();
            }

            if (typeof calendar.onCallBackHeader === "function") {
                var args = {};
                args.header = h;
                calendar.onCallBackHeader(args);
            }

            return h;
        };

        this._getTimelineState = function() {
            var list = [];

            DayPilot.list(calendar.timeline).each(function(item) {
                var json = {};
                json.start = item.start;
                json.end = item.end;
                json.width = item.width;

                list.push(json);
            });

            return list;
        };

        this._getLinksState = function() {
            var list = [];

            var getTags = function(link) {
                var result = {};
                if (link.tags) {
                    for (var name in link.tags) {
                        result[name] = "" + link.tags[name];
                    }
                }
                return result;
            };

            if (!DayPilot.isArray(calendar.links.list)) {
                return list;
            }

            for (var i = 0; i < calendar.links.list.length; i++) {
                var link = calendar.links.list[i];
                var json = {};
                json.id = link.id;
                json.from = link.from;
                json.to = link.to;
                json.type = link.type;
                json.tags = getTags(link);
                list.push(json);
            }
            return list;
        };
        
        this.getViewPort = function() {
            var scrollX = this.nav.scroll.scrollLeft - infitools.shiftX;
            var scrollY = this.nav.scroll.scrollTop;

            var viewport = {};

            if (calendar.viewType !== "Days") {
                var area = calendar._getArea(scrollX, scrollY);
                var range = calendar._getAreaRange(area);
                var res = calendar._getAreaResources(area);

                viewport.start = range.start;
                viewport.end = range.end;
                viewport.resources = res;
            }
            else {
                var area = calendar._getArea(scrollX, scrollY);
                var range = calendar._getAreaDaysView(area);

                viewport.start = range.start;
                viewport.end = range.end;
                viewport.resources = [];
            }

            return viewport;

            /*
            var scrollX = this.nav.scroll.scrollLeft - infinite.shiftX;
            var scrollY = this.nav.scroll.scrollTop;

            var result = {};

            if (calendar.viewType !== "Days") {
                var area = this._getArea(scrollX, scrollY);
                var range = this._getAreaRange(area);
                var resources = this._getAreaResources(area);

                result.start = range.start;
                result.end = range.end;
                result.resources = resources;
            }
            else {

            }

            return result;
            */
        };

        this._getArea = function(scrollX, scrollY) {
            var area = {};
            area.start = {};
            area.end = {};

            area.start.x = Math.floor(scrollX / calendar.cellWidth);
            area.end.x = Math.floor((scrollX + calendar.nav.scroll.clientWidth) / calendar.cellWidth);

            area.start.y = calendar._getRow(scrollY).i;
            area.end.y = calendar._getRow(scrollY + calendar.nav.scroll.clientHeight).i;

            area.start.x = Math.max(area.start.x, 0);

            var maxX = this.itline.length;
            if (area.end.x >= maxX) {
                area.end.x = maxX - 1;
            }

            return area;
        };

        this._getAreaRange = function(area) {
            var result = {};

            if (this.itline.length <= 0) {
                result.start = this.startDate;
                result.end = this.startDate;
                return result;
            }

            if (!this.itline[area.start.x]) {
                throw 'Internal error: area.start.x is null.';
            }
            result.start = this.itline[area.start.x].start;
            result.end = this.itline[area.end.x].end;

            return result;
        };

        this._getAreaResources = function(area) {
            // this might not be necessary, ported from DPSD
            if (!area) {
                var area = this._getArea(this.nav.scroll.scrollLeft, this.nav.scroll.scrollTop);
            }

            var res = [];
            res.ignoreToJSON = true;  // preventing Gaia and prototype to mess up with Array serialization

            for (var i = area.start.y; i <= area.end.y; i++) {
                var r = calendar.rowlist[i];
                if (r && !r.hidden) {
                    res.push(r.id);
                }
            }
            return res;
        };

        this._getAreaDaysView = function(area) {
            // this might not be necessary, ported from DPSD
            if (!area) {
                var area = this._getArea(this.nav.scroll.scrollLeft, this.nav.scroll.scrollTop);
            }

            var res = {};

            if (calendar.rowlist.length === 0) {
                return res;
            }

            var itlineDuration = calendar.itline[calendar.itline.length - 1].end.getTime() - calendar.itline[0].start.getTime();

            res.start = calendar.rowlist[area.start.y] && calendar.rowlist[area.start.y].start;
            res.end = calendar.rowlist[area.end.y] && calendar.rowlist[area.end.y].start.addTime(itlineDuration);

            return res;
        };


        this._getTreeState = function() {
            var tree = [];
            tree.ignoreToJSON = true; // preventing Gaia and prototype to mess up with Array serialization

            for (var i = 0; i < this.rowlist.length; i++) {
                var row = this.rowlist[i];
                if (row.level > 0) {
                    continue;
                }

                if (row.isNewRow) {
                    continue;
                }

                var node = this._getNodeState(i);
                tree.push(node);
            }
            return tree;
        };

        this._getNodeChildren = function(indices) {
            var children = [];
            children.ignoreToJSON = true; // preventing Gaia to mess up with Array serialization
            for (var i = 0; i < indices.length; i++) {
                var index = indices[i];
                var row = calendar.rowlist[index];
                if (row.isNewRow) {
                    continue;
                }
                children.push(calendar._getNodeState(index));
            }
            return children;
        };

        this._getNodeState = function(i) {
            var row = this.rowlist[i];

            if (typeof calendar.onGetNodeState === "function") {
                var args = {};
                args.row = row;
                args.preventDefault = function() {
                    args.preventDefault.value = true;
                };
                args.result = {};

                calendar.onGetNodeState(args);

                if (args.preventDefault.value) {
                    return args.result;
                }
            }

            var node = {};
            node.Value = row.id;
            node.BackColor = row.backColor;
            node.Name = row.name;
            node.InnerHTML = row.html;
            node.ToolTip = row.toolTip;
            node.Expanded = row.expanded;
            node.Children = this._getNodeChildren(row.children);
            node.Loaded = row.loaded;
            node.IsParent = row.isParent;
            node.Columns = this._getNodeColumns(row);

            if (row.start.getTime() !== calendar._visibleStart().getTime()) {
                node.Start = row.start;
            }

            if (row.minHeight !== calendar.rowMinHeight) {
                node.MinHeight = row.minHeight;
            }
            if (row.marginBottom !== calendar.rowMarginBottom) {
                node.MarginBottom = row.marginBottom;
            }
            if (row.marginTop !== calendar.rowMarginTop) {
                node.MarginTop = row.marginTop;
            }
            if (row.eventHeight !== calendar.eventHeight) {
                node.EventHeight = row.eventHeight;
            }

            return node;
        };

        this._getNodeColumns = function(row) {

            if (!row.columns || row.columns.length === 0) {
                return null;
            }

            var columns = [];
            columns.ignoreToJSON = true; // preventing Gaia to mess up with Array serialization

            for (var i = 0; i < row.columns.length; i++) {
                var c = {};
                c.InnerHTML = row.columns[i].html;

                columns.push(c);
            }

            return columns;
        };

/*
        this.$ = function(subid) {
            return document.getElementById(id + "_" + subid);
        };
*/
        this._prefixCssClass = function(part) {
            var prefix = this.theme || this.cssClassPrefix;
            if (prefix) {
                return prefix + part;
            }
            else {
                return "";
            }
        };

        this._updateTheme = function() {
            // manually update theme for elements that are not redrawn during update
            //return;

            var needsUpdate = calendar.nav.top.className !== calendar._prefixCssClass("_main");

            if (!needsUpdate) {
                return;
            }

            calendar.nav.top.className = calendar._prefixCssClass("_main");
            calendar.nav.dh1.className = calendar._prefixCssClass("_divider_horizontal");
            calendar.nav.dh2.className = calendar._prefixCssClass("_divider_horizontal");
            calendar.divResScroll.className = calendar._prefixCssClass("_rowheader_scroll");
            calendar.nav.divider.className  = calendar._prefixCssClass("_divider") + " " + calendar._prefixCssClass("_splitter");
            calendar.nav.scroll.className = calendar._prefixCssClass("_scrollable");
            calendar._maind.className = calendar._prefixCssClass("_matrix");
            calendar.nav.loading.className = calendar._prefixCssClass("_loading");

        };

        this._registerDispose = function() {
            //var root = document.getElementById(id);
            this.nav.top.dispose = this.dispose;
            this.nav.limit;
        };

        this.dispose = function() {

            var c = calendar;

            if (!c._canBeDisposed) {
                return;
            }

            if (c._disposed) {
                return;
            }

            c._disposed = true;


            c._pauseAutoRefresh();
            clearInterval(c._visibilityInterval);
            clearInterval(c._widthChangeDetectionInterval);

            for (var name in c.timeouts) {
                var item = c.timeouts[name];
                if (DayPilot.isArray(item)) {
                    DayPilot.list(item).each(function(t) {
                        clearTimeout(t);
                    });
                }
                else {
                    clearTimeout(item);
                }
            }

            c._deleteEvents();


            c.divBreaks = null;
            c.divCells = null;
            c.divCorner = null;
            c.divCrosshair = null;
            c.divEvents = null;
            if (c.divHeader) {
                c.divHeader.rows = null;
            }
            c.divHeader = null;
            c.divLines = null;
            c.divNorth = null;
            c.divRange = null;
            c.divResScroll = null;
            c.divSeparators = null;
            c.divSeparatorsAbove = null;
            c.divStretch = null;
            c.divTimeScroll = null;
            c._scrollRes = null;
            c._vsph = null;
            c._maind.calendar = null;
            c._maind = null;

            c.nav.loading = null;

            c.nav.top.onmousemove = null;
            c.nav.top.onmouseout = null;
            c.nav.top.dispose = null;
            c.nav.top.ontouchstart = null;
            c.nav.top.ontouchmove = null;
            c.nav.top.ontouchend = null;

            c.nav.top.removeAttribute('style');
            c.nav.top.removeAttribute('class');
            c.nav.top.innerHTML = "";
            c.nav.top.dp = null;
            c.nav.top = null;

            c.nav.scroll.onscroll = null;
            c.nav.scroll.root = null;
            c.nav.scroll = null;

            if (c._splitter) {
                c._splitter.dispose();
                c._splitter = null;
            }

            // jQuery
            if (c.daypilot) {
                delete c.daypilot;
            }

            DayPilot.ue(window, 'resize', c._onWindowResize);

            DayPilotScheduler.unregister(c);

            eventloading = null;

            (function clearProps() {
                // don't use, it's extremely slow
                return;
                for (var name in c) {
                    c[name] = null;
                }
            })();

        };


        /**
         * Creates a shadow from a given event. Formerly it only accepted the event div element but now it also accepts the DayPilot.Event. Eventually all calls will be updated to pass DayPilot.Event.
         * @param object
         * @returns {Element}
         * @private
         */
        this._createShadow = function(object) {
            var event = null;
            if (object.nodeType) {
                event = object.event;
            }
            else {
                event = object;
            }
            var maind = calendar._maind;
            var coords = calendar._getShadowCoords(event);
            var ev = event;

            if (calendar._isRowDisabled(coords.rowIndex)) {
                return;
            }

            var height = event.part.height || calendar._resolved.eventHeight();
            var top = (event.part && event.part.top && calendar.rowlist[event.part.dayIndex]) ? (event.part.top + calendar.rowlist[event.part.dayIndex].top) : coords.top;
            var left = coords.left;

            var verticalAllowed = (ev.cache && typeof ev.cache.moveVDisabled !== 'undefined') ? !ev.cache.moveVDisabled : !ev.data.moveVDisabled;
            var horizontalAllowed = (ev.cache && typeof ev.cache.moveHDisabled !== 'undefined') ? !ev.cache.moveHDisabled :!ev.data.moveHDisabled;

            if (!verticalAllowed && DayPilotScheduler.moving) {
                top = calendar.rowlist[ev.part.dayIndex].top;
            }
            if (!horizontalAllowed && DayPilotScheduler.moving) {
                left = event.part.left;
            }

            var shadow = document.createElement('div');
            shadow.setAttribute('unselectable', 'on');
            shadow.style.position = 'absolute';
            shadow.style.width = (coords.width) + 'px';
            shadow.style.height = height + 'px';
            shadow.style.left = left + 'px';
            shadow.style.top = top + 'px';
            shadow.style.zIndex = 101;
            shadow.style.overflow = 'hidden';

            var inner = document.createElement("div");
            shadow.appendChild(inner);
            shadow.className = this._prefixCssClass("_shadow");
            inner.className = this._prefixCssClass("_shadow_inner");

            // maind.appendChild(shadow);
            calendar.divShadow.appendChild(shadow);
            shadow.calendar = calendar;

            return shadow;
        };

        // y is in pixels, not row index
        this._getRow = function(y) {
            var result = {};
            var element;

            var top = 0;
            var rowEnd = 0;
            var iMax = this.rowlist.length; // maximum row index

            for (var i = 0; i < iMax; i++) {
                var row = this.rowlist[i];
                if (row.hidden) {
                    continue;
                }
                rowEnd += row.height;
                if (y < rowEnd || i === iMax - 1) {
                    top = rowEnd - row.height;
                    element = row;
                    break;
                }
            }

            result.top = top;
            result.bottom = rowEnd;
            result.i = i;  // visible row index
            result.element = element;

            return result;
        };

        this.links = {};
        this.links.list = [];
        this.links.addData = function(link) {
            calendar.links.list.push(link);
            linktools.load();
        };

        this.links.load = function(url, success, error, options) {

            if (!url) {
                throw new DayPilot.Exception("links.load(): 'url' parameter required");
            }

            options = options || {};

            var onError = function(args) {
                var largs = {};
                largs.exception = args.exception;
                largs.request = args.request;

                if (typeof error === 'function') {
                    error(largs);
                }
            };

            var onSuccess = function(args) {
                var r = args.request;
                var data;

                // it's supposed to be JSON
                try {
                    data = JSON.parse(r.responseText);
                }
                catch (e) {
                    var fargs = {};
                    fargs.exception = e;
                    onError(fargs);
                    return;
                }

                if (DayPilot.isArray(data)) {
                    var sargs = {};
                    sargs.preventDefault = function() {
                        this.preventDefault.value = true;
                    };
                    sargs.data = data;
                    if (typeof success === "function") {
                        success(sargs);
                    }

                    if (sargs.preventDefault.value) {
                        return;
                    }

                    calendar.links.list = data;
                    if (calendar._initialized) {
                        calendar.update();
                    }
                }
            };

            var usePost = calendar.linksLoadMethod && calendar.linksLoadMethod.toUpperCase() === "POST";

            if (usePost) {
                DayPilot.ajax({
                    "method": "POST",
                    "contentType": "application/json",
                    "data": { "start": calendar.visibleStart().toString(), "end": calendar.visibleEnd().toString()},
                    "url": url,
                    "success": onSuccess,
                    "error": onError
                });
            }
            else {
                var fullUrl = url;
                if (!options.dontAddStartEnd) {
                    var queryString = "start=" + calendar.visibleStart().toString() + "&end=" + calendar.visibleEnd().toString();
                    if (fullUrl.indexOf("?") > -1) {
                        fullUrl += "&" + queryString;
                    }
                    else {
                        fullUrl += "?" + queryString;
                    }
                }

                DayPilot.ajax({
                    "method": "GET",
                    "url": fullUrl,
                    "success": onSuccess,
                    "error": onError
                });
            }
        };


        var linktools = {};

        this._linktools = linktools;

        linktools.clear = function() {
            calendar.divLinksAbove.innerHTML = '';
            calendar.divLinksBelow.innerHTML = '';
            calendar.elements.links = [];
        };

        linktools.showLinkpoints = function() {
            var events = viewport.events();
            events.each(function(div) {
                linktools.showLinkpoint(div);
            });
        };

        linktools.showLinkpoint = function(div) {
            var width = calendar.linkPointSize;
            var mid = width/2;

            var left = div.event.part.left;
            var top = calendar.rowlist[div.event.part.dayIndex].top + div.event.part.top;
            var height = div.event.part.height;
            var right = div.event.part.right;

            var start = DayPilot.Util.div(calendar.divLinkpoints, left - mid, top - mid + height/2, width, width);
            start.className = calendar._prefixCssClass("_linkpoint");
            start.style.boxSizing = "border-box";
            start.coords = {x: left, y: top + height/2};
            start.type = "Start";
            start.event = div.event;
            linktools.activateLinkpoint(start);
            calendar.elements.linkpoints.push(start);

            var end = DayPilot.Util.div(calendar.divLinkpoints, right - mid, top - mid + height/2, width, width);
            end.className = calendar._prefixCssClass("_linkpoint");
            end.style.boxSizing = "border-box";
            end.coords = {x: right, y: top + height/2};
            end.type = "Finish";
            end.event = div.event;
            linktools.activateLinkpoint(end);
            calendar.elements.linkpoints.push(end);
        };

        linktools.activateLinkpoint = function(div) {

            //linktools.clearHideTimeout();

            div.onmousedown = function(ev) {
                var ev = ev || window.event;
                linking.source = div;
                linking.calendar = calendar;
                linktools.showLinkpoints();
                ev.preventDefault && ev.preventDefault(); // prevent text selection cursor in chrome
                ev.stopPropagation && ev.stopPropagation();
                return false;
            };
            div.onmousemove = function(ev) {
                DayPilot.Util.addClass(div, calendar._prefixCssClass("_linkpoint_hover"));
                //div.style.backgroundColor = "black";
                linktools.clearHideTimeout();
            };
            div.onmouseout = function(ev) {
                if (!linking.source || linking.source.event !== div.event) {
                    DayPilot.Util.removeClass(div, calendar._prefixCssClass("_linkpoint_hover"));
                }
            };
            div.onmouseup = function(ev) {
                if (linking.source) {
                    var type = linking.source.type + "To" + div.type;
                    var from = linking.source.event.id();
                    var to = div.event.id();

                    var args = {};
                    args.from = from;
                    args.to = to;
                    args.type = type;
                    args.id = null;
                    args.preventDefault = function() {
                        this.preventDefault.value = true;
                    };

                    if (typeof calendar.onLinkCreate === "function") {
                        calendar.onLinkCreate(args);
                        if (args.preventDefault.value) {
                            return;
                        }
                    }

                    var update = function() {
                        if (!DayPilot.isArray(calendar.links.list)) {
                            calendar.links.list = [];
                        }
                        calendar.links.list.push({"from": from, "to": to, "type": type, "id": args.id});
                        linktools.load();
                    };

                    switch (calendar.linkCreateHandling) {
                        case "Update":
                            update();
                            break;
                        case "CallBack":
                            calendar._linkCreateCallBack(args);
                            break;
                        case "PostBack":
                            calendar._linkCreatePostBack(args);
                            break;
                        case "Notify":
                            update();
                            calendar._linkCreateNotify(args);
                            break;
                    }

                    if (typeof calendar.onLinkCreated === "function") {
                        calendar.onLinkCreated(args);
                    }

                }
            };
        };

        linktools.hideLinkpoints = function() {
            calendar.divLinkpoints.innerHTML = '';
            calendar.elements.linkpoints = [];
        };

        linktools.hideTimeout = null;

        linktools.hideLinkpointsWithDelay = function() {
            linktools.hideTimeout = setTimeout(function() {
                linktools.hideLinkpoints();
            }, 100);
        };

        linktools.clearHideTimeout = function() {
            if (linktools.hideTimeout) {
                clearTimeout(linktools.hideTimeout);
                linktools.hideTimeout = null;
            }
        };

        linktools.load = function() {
            linktools.clear();
            if (!DayPilot.isArray(calendar.links.list)) {
                return;
            }
            for (var i = 0; i < calendar.links.list.length; i++) {
                var link = calendar.links.list[i];
                linktools.drawLinkId(link.from, link.to, link);
            }
        };

        linktools.drawLinkId = function(from, to, props) {
            var start = calendar.events.find(from);
            var end = calendar.events.find(to);
            linktools.drawLink(start, end, props);
        };

        linktools.drawLink = function(from, to, props) {
            var divFrom = null;
            if (from && from.tagName && from.tagName.toLowerCase() === "div") {
                divFrom = from;
            }
            else {
                divFrom = calendar._findEventDiv(from);
            }

            var divTo = null;
            if (to && to.tagName && to.tagName.toLowerCase() === "div") {
                divTo = to;
            }
            else {
                divTo = calendar._findEventDiv(to);
            }

/*
            var initialize = function(div) {
                if (div.event) {
                    return;
                }
                div.event = {
                    "part":
:                }
            };

            initialize(divFrom);
            initialize(divTo);
*/


            if (!divFrom) {
                return;
            }

            if (!divTo) {
                return;
            }

            var type = props.type || "FinishToStart";

            var start, end;
            // var fromRowTop = calendar.rowlist[divFrom.event.part.dayIndex].top;
            // var toRowTop = calendar.rowlist[divTo.event.part.dayIndex].top;

            // var fromTop = fromRowTop + divFrom.event.part.top;
            var fromTop = divFrom.offsetTop;
            // var toTop = toRowTop + divTo.event.part.top;
            var toTop = divTo.offsetTop;
            // var fromRight = divFrom.event.part.right;
            var fromRight = divFrom.offsetLeft + divFrom.offsetWidth;
            // var toRight = divTo.event.part.right;
            var toRight = divTo.offsetLeft + divTo.offsetWidth;
            // var toLeft = divTo.event.part.left;
            var toLeft = divTo.offsetLeft;
            // var fromLeft = divFrom.event.part.left;
            var fromLeft = divFrom.offsetLeft;
            // var toHeight = divTo.event.part.height;
            var toHeight = divTo.offsetHeight;

            switch (type) {
                case "FinishToStart":
                    start = {x: fromRight, y: fromTop};
                    end = {x: toLeft, y: toTop};

                    if (start.y > end.y) {
                        if (toTop + toHeight > fromTop) {  // can happen for shadow
                            end.y = start.y;
                        }
                        else if (start.x <= end.x) {
                            end.y += toHeight;
                            end.bottom = true;
                        }
                    }

                    break;
                case "StartToFinish":
                    start = {x: fromLeft, y: fromTop};
                    end = {x: toRight, y: toTop};
                    break;
                case "StartToStart":
                    start = {x: fromLeft, y: fromTop};
                    end = {x: toLeft, y: toTop};
                    break;
                case "FinishToFinish":
                    start = {x: fromRight, y: fromTop};
                    end = {x: toRight, y: toTop};
                    break;
            }
            return linktools.drawLinkXy(start, end, props);
        };

        linktools.clearShadow = function() {
            calendar.divLinkShadow.innerHTML = '';
            calendar.elements.linkshadow = [];
        };

        linktools.drawShadow = function(from, to) {
            linktools.clearShadow();

            if (DayPilot.browser.ielt9) {
                linktools.drawShadowOldStyle(from, to);
            }
            else {
                var parent = calendar.divLinkShadow;
                var line = DayPilot.line(from.x, from.y, to.x, to.y, true);
                parent.appendChild(line);
                calendar.elements.linkshadow.push(line);
            }
        };

        linktools.drawShadowOldStyle = function(from, to) {
            var nx = Math.min(from.x, to.x);
            var width = 2;
            var parent = calendar.divLinkShadow;

            var color = "black";

            var h1 = DayPilot.Util.div(parent, nx, from.y, from.x - nx, width);
            h1.style.backgroundColor = color;
            calendar.elements.linkshadow.push(h1);

            var v1 = DayPilot.Util.div(parent, nx, from.y, width, to.y - from.y);
            v1.style.backgroundColor = color;
            calendar.elements.linkshadow.push(v1);

            var h3 = DayPilot.Util.div(parent, nx, to.y, to.x - nx, width);
            h3.style.backgroundColor = color;
            calendar.elements.linkshadow.push(h3);

            var a = DayPilot.Util.div(parent, to.x - 6, to.y - 5, 0, 0);
            a.style.borderColor = "transparent transparent transparent " + color;
            a.style.borderStyle = "solid";
            a.style.borderWidth = "6px";
            calendar.elements.linkshadow.push(a);
        };

        linktools.drawLinkXy = function(from, to, props) {
            var result = {
                "divs": [],
                "props": props,
                "clear": function() {
                    var link = this;
                    DayPilot.de(link.divs);
                    link.divs.forEach(function(div) {
                        DayPilot.rfa(calendar.elements.links, div);
                    });

                }
            };
            var indent = calendar.eventHeight/2;

            var width = props.width || 1;
            var type = props.type || "FinishToStart";
            var color = props.color;
            var style = props.style;
            var layer = props.layer || "Above";
            var above = layer === "Above";
            var divLinks = above ? calendar.divLinksAbove : calendar.divLinksBelow;
            var height = calendar.eventHeight;
            var bottom = calendar.linkBottomMargin;
            //var border = width + "px " + style + " " + color;

            var applyBorder = function(div, which) {
                if (color) {
                    div.style["border" + which + "Color"] = color;
                }
                if (style) {
                    div.style["border" + which + "Style"] = style;
                }
            };

            var divs = [];

            var saveDiv = function(div, dontHover) {
                calendar.elements.links.push(div);
                activateHover(div);
                activateContextMenu(div);

                div.divs = divs;
                // required for hover
                if (!dontHover) {
                    divs.push(div);
                }
                result.divs.push(div); // always include
            };

            var activateContextMenu = function(div) {
                div.oncontextmenu = function(ev) {
                    ev = ev || window.event;

                    if (calendar.contextMenuLink) {
                        var link = new DayPilot.Link(props, calendar);
                        calendar.contextMenuLink.show(link);
                    }

                    ev.cancelBubble = true;
                    ev.preventDefault ? ev.preventDefault() : null;
                }
            };

            var activateHover = function(div) {
                div.onmouseenter = function() {
                    DayPilot.Util.addClass(div.divs, calendar._prefixCssClass("_link_hover"));
                };
                div.onmouseleave = function() {
                    DayPilot.Util.removeClass(div.divs, calendar._prefixCssClass("_link_hover"));
                };
            };

            if (type === "FinishToStart") {
                if (from.y === to.y && from.x === to.x) {
                    var w = 10;
                    var tox = from.x - w/2;
                    var toy = from.y + height - bottom - w/2;

                    var a;
                    if (color) {
                        a = DayPilot.Util.div(divLinks, tox, toy, w, w);
                        a.style.borderRadius = w + "px";
                        a.style.backgroundColor = color;
                    }
                    else {
                        a = DayPilot.Util.div(divLinks, tox, toy, w, w);
                        a.className = calendar._prefixCssClass("_link_dot");
                        DayPilot.Util.addClass(a, props.cssClass);
                    }
                    saveDiv(a, true);

                }
                else if (from.y > to.y || (from.y == to.y && to.bottom)) {
                    if (from.x <= to.x) {
                        var startx = from.x;
                        var starty = from.y + height - bottom;

                        var tox = to.x + indent;
                        var toy = to.y;

                        var h1 = DayPilot.Util.div(divLinks, startx, starty, tox - from.x, width);
                        h1.style.boxSizing = "border-box";
                        h1.style.borderBottomWidth = width + "px";
                        h1.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h1, props.cssClass);
                        applyBorder(h1, "Bottom");
                        saveDiv(h1);

                        var v1 = DayPilot.Util.div(divLinks, tox, starty, width, toy - starty);
                        v1.style.boxSizing = "border-box";
                        v1.style.borderRightWidth = width + "px";
                        v1.className = calendar._prefixCssClass("_link_vertical");
                        DayPilot.Util.addClass(v1, props.cssClass);
                        applyBorder(v1, "Right");
                        saveDiv(v1);

                        var a;
                        if (color) {
                            a = DayPilot.Util.div(divLinks, tox - 5 + Math.floor(width/2), toy - 5, 0, 0);
                            if (from.y < to.y) {
                                a.style.borderColor = color + " transparent transparent transparent";
                            }
                            else {
                                a.style.borderColor = "transparent transparent " + color + " transparent";
                            }
                            a.style.borderStyle = "solid";
                            a.style.borderWidth = "5px";
                        }
                        else {
                            a = DayPilot.Util.div(divLinks, tox - 6 + Math.floor(width/2), toy - 6, 6, 6);
                            if (from.y < to.y) {
                                a.className = calendar._prefixCssClass("_link_arrow_down");
                            }
                            else {
                                a.className = calendar._prefixCssClass("_link_arrow_up");
                            }

                            DayPilot.Util.addClass(a, props.cssClass);
                        }
                        saveDiv(a, true);
                    }
                    else {
                        var below = 5;
                        //var midy = to.y + above;
                        var midy = to.y + height + below;

                        var h1 = DayPilot.Util.div(divLinks, from.x, from.y + height - bottom, indent + width, width);
                        h1.style.boxSizing = "border-box";
                        h1.style.borderBottomWidth = width + "px";
                        h1.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h1, props.cssClass);
                        applyBorder(h1, "Bottom");
                        saveDiv(h1);

                        var v1 = DayPilot.Util.div(divLinks, from.x + indent, from.y + height - bottom, width, midy - (from.y + height - bottom));
                        v1.style.boxSizing = "border-box";
                        v1.style.borderRightWidth = width + "px";
                        v1.className = calendar._prefixCssClass("_link_vertical");
                        DayPilot.Util.addClass(v1, props.cssClass);
                        applyBorder(v1, "Right");
                        saveDiv(v1);

                        var h2 = DayPilot.Util.div(divLinks, to.x - indent, midy, from.x + 2*indent + width - to.x, width);
                        h2.style.boxSizing = "border-box";
                        h2.style.borderBottomWidth = width + "px";
                        h2.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h2, props.cssClass);
                        applyBorder(h2, "Bottom");
                        saveDiv(h2);

                        var v2 = DayPilot.Util.div(divLinks, to.x - indent, midy, width, to.y - midy + height - bottom);
                        v2.style.boxSizing = "border-box";
                        v2.style.borderRightWidth = width + "px";
                        v2.className = calendar._prefixCssClass("_link_vertical");
                        DayPilot.Util.addClass(v2, props.cssClass);
                        applyBorder(v2, "Right");
                        saveDiv(v2);

                        var h3 = DayPilot.Util.div(divLinks, to.x - indent, to.y + height - bottom, indent, width);
                        h3.style.boxSizing = "border-box";
                        h3.style.borderBottomWidth = width + "px";
                        h3.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h3, props.cssClass);
                        applyBorder(h3, "Bottom");
                        saveDiv(h3);

                        var a;
                        if (color) {
                            a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 0, 0);
                            a.style.borderWidth = "6px";
                            a.style.borderColor = "transparent transparent transparent " + color;
                            a.style.borderStyle = "solid";
                        }
                        else {
                            a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 6, 6);
                            a.className = calendar._prefixCssClass("_link_arrow_right");
                            DayPilot.Util.addClass(a, props.cssClass);
                        }
                        saveDiv(a, true);

                    }
                }
                else if (from.y === to.y) {  // same line
                    if (from.x < to.x) {
                        var startx = from.x;
                        var starty = from.y + height - bottom;

                        //var tox = to.x + indent;
                        var tox = to.x;
                        //var toy = start.y;

                        var h1 = DayPilot.Util.div(divLinks, startx, starty, tox - from.x, width);
                        h1.style.boxSizing = "border-box";
                        h1.style.borderBottomWidth = width + "px";
                        h1.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h1, props.cssClass);
                        applyBorder(h1, "Bottom");
                        saveDiv(h1);

                        var a;
                        if (color) {
                            a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 0, 0);
                            a.style.borderWidth = "6px";
                            a.style.borderColor = "transparent transparent transparent " + color;
                            a.style.borderStyle = "solid";
                        }
                        else {
                            a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 6, 6);
                            a.className = calendar._prefixCssClass("_link_arrow_right");
                            DayPilot.Util.addClass(a, props.cssClass);
                        }
                        saveDiv(a, true);
                    }
                    else {
                        var below = 5;
                        //var midy = to.y + above;
                        var midy = to.y + height + below;

                        var h1 = DayPilot.Util.div(divLinks, from.x, from.y + height - bottom, indent + width, width);
                        h1.style.boxSizing = "border-box";
                        h1.style.borderBottomWidth = width + "px";
                        h1.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h1, props.cssClass);
                        applyBorder(h1, "Bottom");
                        saveDiv(h1);

                        var v1 = DayPilot.Util.div(divLinks, from.x + indent, from.y + height - bottom, width, midy - (from.y + height - bottom));
                        v1.style.boxSizing = "border-box";
                        v1.style.borderRightWidth = width + "px";
                        v1.className = calendar._prefixCssClass("_link_vertical");
                        DayPilot.Util.addClass(v1, props.cssClass);
                        applyBorder(v1, "Right");
                        saveDiv(v1);

                        var h2 = DayPilot.Util.div(divLinks, to.x - indent, midy, from.x + 2*indent + width - to.x, width);
                        h2.style.boxSizing = "border-box";
                        h2.style.borderBottomWidth = width + "px";
                        h2.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h2, props.cssClass);
                        applyBorder(h2, "Bottom");
                        saveDiv(h2);

                        var v2 = DayPilot.Util.div(divLinks, to.x - indent, midy, width, to.y - midy + height - bottom);
                        v2.style.boxSizing = "border-box";
                        v2.style.borderRightWidth = width + "px";
                        v2.className = calendar._prefixCssClass("_link_vertical");
                        DayPilot.Util.addClass(v2, props.cssClass);
                        applyBorder(v2, "Right");
                        saveDiv(v2);

                        var h3 = DayPilot.Util.div(divLinks, to.x - indent, to.y + height - bottom, indent, width);
                        h3.style.boxSizing = "border-box";
                        h3.style.borderBottomWidth = width + "px";
                        h3.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h3, props.cssClass);
                        applyBorder(h3, "Bottom");
                        saveDiv(h3);

                        var a;
                        if (color) {
                            a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 0, 0);
                            a.style.borderWidth = "6px";
                            a.style.borderColor = "transparent transparent transparent " + color;
                            a.style.borderStyle = "solid";
                        }
                        else {
                            a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 6, 6);
                            a.className = calendar._prefixCssClass("_link_arrow_right");
                            DayPilot.Util.addClass(a, props.cssClass);
                        }
                        saveDiv(a, true);

                    }
                } else {
                    if (from.x > to.x) {
                        var above = 5;
                        var midy = to.y - above;

                        var h1 = DayPilot.Util.div(divLinks, from.x, from.y + height - bottom, indent + width, width);
                        h1.style.boxSizing = "border-box";
                        h1.style.borderBottomWidth = width + "px";
                        h1.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h1, props.cssClass);
                        applyBorder(h1, "Bottom");
                        saveDiv(h1);

                        var v1 = DayPilot.Util.div(divLinks, from.x + indent, from.y + height - bottom, width, midy - (from.y + height - bottom));
                        v1.style.boxSizing = "border-box";
                        v1.style.borderRightWidth = width + "px";
                        v1.className = calendar._prefixCssClass("_link_vertical");
                        DayPilot.Util.addClass(v1, props.cssClass);
                        applyBorder(v1, "Right");
                        saveDiv(v1);

                        var h2 = DayPilot.Util.div(divLinks, to.x - indent, midy, from.x + 2*indent + width - to.x, width);
                        h2.style.boxSizing = "border-box";
                        h2.style.borderBottomWidth = width + "px";
                        h2.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h2, props.cssClass);
                        applyBorder(h2, "Bottom");
                        saveDiv(h2);

                        var v2 = DayPilot.Util.div(divLinks, to.x - indent, midy, width, to.y - midy + height - bottom);
                        v2.style.boxSizing = "border-box";
                        v2.style.borderRightWidth = width + "px";
                        v2.className = calendar._prefixCssClass("_link_vertical");
                        DayPilot.Util.addClass(v2, props.cssClass);
                        applyBorder(v2, "Right");
                        saveDiv(v2);

                        var h3 = DayPilot.Util.div(divLinks, to.x - indent, to.y + height - bottom, indent, width);
                        h3.style.boxSizing = "border-box";
                        h3.style.borderBottomWidth = width + "px";
                        h3.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h3, props.cssClass);
                        applyBorder(h3, "Bottom");
                        saveDiv(h3);

                        var a;
                        if (color) {
                            a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 0, 0);
                            a.style.borderWidth = "6px";
                            a.style.borderColor = "transparent transparent transparent " + color;
                            a.style.borderStyle = "solid";
                        }
                        else {
                            a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 6, 6);
                            a.className = calendar._prefixCssClass("_link_arrow_right");
                            DayPilot.Util.addClass(a, props.cssClass);
                        }
                        saveDiv(a, true);
                    }
                    else {
                        var startx = from.x;
                        var starty = from.y + height - bottom;

                        var tox = to.x + indent;
                        var toy = to.y;

                        var h1 = DayPilot.Util.div(divLinks, startx, starty, tox - from.x, width);
                        h1.style.boxSizing = "border-box";
                        h1.style.borderBottomWidth = width + "px";
                        h1.className = calendar._prefixCssClass("_link_horizontal");
                        DayPilot.Util.addClass(h1, props.cssClass);
                        applyBorder(h1, "Bottom");
                        saveDiv(h1);

                        var v1 = DayPilot.Util.div(divLinks, tox, starty, width, toy - starty);
                        v1.style.boxSizing = "border-box";
                        v1.style.borderRightWidth = width + "px";
                        v1.className = calendar._prefixCssClass("_link_vertical");
                        DayPilot.Util.addClass(v1, props.cssClass);
                        applyBorder(v1, "Right");
                        saveDiv(v1);

                        var a;
                        if (color) {
                            a = DayPilot.Util.div(divLinks, tox - 5 + Math.floor(width/2), toy - 5, 0, 0);
                            if (from.y < to.y) {
                                a.style.borderColor = color + " transparent transparent transparent";
                            }
                            else {
                                a.style.borderColor = "transparent transparent " + color + "transparent";
                            }
                            a.style.borderStyle = "solid";
                            a.style.borderWidth = "5px";
                        }
                        else {
                            a = DayPilot.Util.div(divLinks, tox - 6 + Math.floor(width/2), toy - 6, 6, 6);
                            if (from.y < to.y) {
                                a.className = calendar._prefixCssClass("_link_arrow_down");
                            }
                            else {
                                a.className = calendar._prefixCssClass("_link_arrow_up");
                            }

                            DayPilot.Util.addClass(a, props.cssClass);
                        }
                        saveDiv(a, true);
                    }
                }
            }
            else if (type === "StartToFinish") {
                var above = 5;
                var midy = to.y - above;
                //var midy = DayPilot.Util.avg(from.y, to.y);

                var h1 = DayPilot.Util.div(divLinks, to.x, to.y + height - bottom, indent + width, width);
                h1.style.boxSizing = "border-box";
                h1.style.borderBottomWidth = width + "px";
                h1.className = calendar._prefixCssClass("_link_horizontal");
                DayPilot.Util.addClass(h1, props.cssClass);
                applyBorder(h1, "Bottom");
                saveDiv(h1);

                var v1 = DayPilot.Util.div(divLinks, to.x + indent, to.y + height - bottom, width, midy - (to.y + height - bottom) + 0);
                v1.style.boxSizing = "border-box";
                v1.style.borderRightWidth = width + "px";
                v1.className = calendar._prefixCssClass("_link_vertical");
                DayPilot.Util.addClass(v1, props.cssClass);
                applyBorder(v1, "Right");
                saveDiv(v1);

                var h2 = DayPilot.Util.div(divLinks, from.x - indent, midy, to.x + 2*indent + width - from.x, width);
                h2.style.boxSizing = "border-box";
                h2.style.borderBottomWidth = width + "px";
                h2.className = calendar._prefixCssClass("_link_horizontal");
                DayPilot.Util.addClass(h2, props.cssClass);
                applyBorder(h2, "Bottom");
                saveDiv(h2);

                var v2 = DayPilot.Util.div(divLinks, from.x - indent, midy, width, from.y + height - bottom - midy + 0);
                v2.style.boxSizing = "border-box";
                v2.style.borderRightWidth = width + "px";
                v2.className = calendar._prefixCssClass("_link_vertical");
                DayPilot.Util.addClass(v2, props.cssClass);
                applyBorder(v2, "Right");
                saveDiv(v2);

                var h3 = DayPilot.Util.div(divLinks, from.x - indent, from.y + height - bottom, indent, width);
                h3.style.boxSizing = "border-box";
                h3.style.borderBottomWidth = width + "px";
                h3.className = calendar._prefixCssClass("_link_horizontal");
                DayPilot.Util.addClass(h3, props.cssClass);
                applyBorder(h3, "Bottom");
                saveDiv(h3);

                var a;
                if (color) {
                    a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 0, 0);
                    a.style.borderColor = "transparent " + color + " transparent transparent";
                    a.style.borderStyle = "solid";
                    a.style.borderWidth = "6px";
                }
                else {
                    a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 6, 6);
                    a.className = calendar._prefixCssClass("_link_arrow_left");
                    DayPilot.Util.addClass(a, props.cssClass);
                }
                saveDiv(a, true);
            }
            else if (type === "StartToStart") {
                var nx = Math.min(from.x, to.x) - indent;

                var h1 = DayPilot.Util.div(divLinks, nx, from.y + height - bottom, from.x - nx, width);
                h1.style.boxSizing = "border-box";
                h1.style.borderBottomWidth = width + "px";
                h1.className = calendar._prefixCssClass("_link_horizontal");
                DayPilot.Util.addClass(h1, props.cssClass);
                applyBorder(h1, "Bottom");
                saveDiv(h1);

                var v1 = DayPilot.Util.div(divLinks, nx, from.y + height - bottom, width, to.y - from.y);
                v1.style.boxSizing = "border-box";
                v1.style.borderRightWidth = width + "px";
                v1.className = calendar._prefixCssClass("_link_vertical");
                DayPilot.Util.addClass(v1, props.cssClass);
                applyBorder(v1, "Right");
                saveDiv(v1);

                var h3 = DayPilot.Util.div(divLinks, nx, to.y + height - bottom, to.x - nx, width);
                h3.style.boxSizing = "border-box";
                h3.style.borderBottomWidth = width + "px";
                h3.className = calendar._prefixCssClass("_link_horizontal");
                DayPilot.Util.addClass(h3, props.cssClass);
                applyBorder(h3, "Bottom");
                saveDiv(h3);

                var a;
                if (color) {
                    a = DayPilot.Util.div(divLinks, to.x - 6, to.y  + height - bottom - 5, 0, 0);
                    a.style.borderColor = "transparent transparent transparent " + color;
                    a.style.borderStyle = "solid";
                    a.style.borderWidth = "6px";
                }
                else {
                    a = DayPilot.Util.div(divLinks, to.x - 6, to.y  + height - bottom - 5, 6, 6);
                    a.className = calendar._prefixCssClass("_link_arrow_right");
                    DayPilot.Util.addClass(a, props.cssClass);
                }
                saveDiv(a, true);

            }
            else if (type === "FinishToFinish") {
                //var midy = DayPilot.Util.avg(from.y, to.y);
                var fx = Math.max(to.x, from.x) + indent;

                var h1 = DayPilot.Util.div(divLinks, from.x, from.y + height - bottom, fx - from.x, width);
                h1.style.boxSizing = "border-box";
                h1.style.borderBottomWidth = width + "px";
                h1.className = calendar._prefixCssClass("_link_horizontal");
                DayPilot.Util.addClass(h1, props.cssClass);
                applyBorder(h1, "Bottom");
                saveDiv(h1);

                var v1 = DayPilot.Util.div(divLinks, fx, from.y + height - bottom, width, to.y - from.y);
                v1.style.boxSizing = "border-box";
                v1.style.borderRightWidth = width + "px";
                v1.className = calendar._prefixCssClass("_link_vertical");
                DayPilot.Util.addClass(v1, props.cssClass);
                applyBorder(v1, "Right");
                saveDiv(v1);

                var h3 = DayPilot.Util.div(divLinks, to.x, to.y + height - bottom, fx - to.x, width);
                h3.style.boxSizing = "border-box";
                h3.style.borderBottomWidth = width + "px";
                h3.className = calendar._prefixCssClass("_link_horizontal");
                DayPilot.Util.addClass(h3, props.cssClass);
                applyBorder(h3, "Bottom");
                saveDiv(h3);

                var a;
                if (color) {
                    a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 0, 0);
                    a.style.borderColor = "transparent " + color + " transparent transparent";
                    a.style.borderStyle = "solid";
                    a.style.borderWidth = "6px";
                }
                else {
                    a = DayPilot.Util.div(divLinks, to.x - 6, to.y + height - bottom - 5, 6, 6);
                    a.className = calendar._prefixCssClass("_link_arrow_left");
                    DayPilot.Util.addClass(a, props.cssClass);
                }
                saveDiv(a, true);
            }
            return result;
        };

        this._linkCreateCallBack = function(args, data) {
            var params = {};
            params.from = args.from;
            params.to = args.to;
            params.type = args.type;

            calendar._callBack2("LinkCreate", params, data);
        };

        this._linkCreateNotify = function(args, data) {
            var params = {};
            params.from = args.from;
            params.to = args.to;
            params.type = args.type;

            calendar._callBack2("LinkCreate", params, data, "Notify");
        };

        this._linkCreatePostBack = function(args, data) {
            var params = {};
            params.from = args.from;
            params.to = args.to;
            params.type = args.type;

            calendar._postBack2("LinkCreate", params, data);
        };

        this._getRowByIndex = function(i) {
            var top = 0;
            var bottom = 0;
            var index = 0; // visible index

            if (i > this.rowlist.length - 1) {
                throw "Row index too high (DayPilotScheduler._getRowByIndex)";
            }

            for (var j = 0; j <= i; j++) {
                var row = this.rowlist[j];

                if (row.hidden) {
                    continue;
                }

                bottom += row.height;
                index++;
            }

            top = bottom - row.height;

            var result = {};
            result.top = top;
            result.height = row.height;
            result.bottom = bottom;
            result.i = index - 1;
            result.data = row;

            return result;

        };

        this._isShortInit = function() {
            // make sure it has a place to ask
            if (this.backendUrl) {
                return (typeof calendar.events.list === 'undefined') || (!calendar.events.list);
            }
            else {
                return false;
            }
        };

        this.events.find = function(id) {
            if (!calendar.events.list || typeof calendar.events.list.length === 'undefined') {
                return null;
            }
            if (typeof id === "function") {
                return calendar._eventsFindByFunction(id);
            }
            var len = calendar.events.list.length;
            for (var i = 0; i < len; i++) {
                if (calendar.events.list[i].id === id) {
                    return new DayPilot.Event(calendar.events.list[i], calendar);
                }
            }
            return null;
        };

        this._eventsFindByFunction = function(f) {
            var len = calendar.events.list.length;
            for (var i = 0; i < len; i++) {
                var e = new DayPilot.Event(calendar.events.list[i], calendar);
                if (f(e)) {
                    return e;
                }
            }
            return null;
        };

        this.events.focus = function(e) {
            var div = calendar._findEventDivEnsureRendered(e);
            div && div.focus();
        };

        this.events.scrollIntoView = function(e) {
            var div = calendar._findEventDivEnsureRendered(e);
            //div && div.scrollIntoView();
            if (!div) {
                return;
            }

            var target = e.start();
            if (target < calendar._visibleStart() || calendar._visibleEnd() < target) {
                calendar.scrollTo(target, "fast", "middle");
            }

            var r = e.resource();
            if (calendar.getViewPort().resources.indexOf(r) === -1) {
                calendar.scrollToResource(r);
            }

        };

        this.events.all = function() {
            var list = [];
            for (var i = 0; i < calendar.events.list.length; i++) {
                var e = new DayPilot.Event(calendar.events.list[i], calendar);
                list.push(e);
            }
            return DayPilot.list(list);
        };

        this.events.filter = function(args) {
            calendar.events._filterParams = args;
            calendar._update({"eventsOnly":true});
        };

        this.events.edit = function(e) {
            var div = calendar._findEventDiv(e);
            if (!div && !DayPilot.list(calendar.events._postponedData.rows).isEmpty()) {
                setTimeout(function() {  // we will try again when .events.add() calls are rendered
                    calendar._divEdit(calendar._findEventDiv(e));
                });
                return;
            }
            calendar._divEdit(div);
        };
        
        this.events.load = function(url, success, error) {

            if (!url) {
                throw new DayPilot.Exception("events.load(): 'url' parameter required");
            }
            var onError = function(args) {
                var largs = {};
                largs.exception = args.exception;
                largs.request = args.request;

                if (typeof error === 'function') {
                    error(largs);
                }
            };

            var onSuccess = function(args) {
                var r = args.request;
                var data;

                // it's supposed to be JSON
                try {
                    data = JSON.parse(r.responseText);
                }
                catch (e) {
                    var fargs = {};
                    fargs.exception = e;
                    onError(fargs);
                    return;
                }

                if (DayPilot.isArray(data)) {
                    var sargs = {};
                    sargs.preventDefault = function() {
                        this.preventDefault.value = true;
                    };
                    sargs.data = data;
                    if (typeof success === "function") {
                        success(sargs);
                    }

                    if (sargs.preventDefault.value) {
                        return;
                    }

                    calendar.events.list = data;
                    if (calendar._initialized) {
                        calendar.update();
                    }
                }
            };

            var usePost = calendar.eventsLoadMethod && calendar.eventsLoadMethod.toUpperCase() === "POST";

            if (usePost) {
                DayPilot.ajax({
                    "method": "POST",
                    "contentType": "application/json",
                    "data": { "start": calendar.visibleStart().toString(), "end": calendar.visibleEnd().toString()},
                    "url": url,
                    "success": onSuccess,
                    "error": onError
                });
            }
            else {
                var fullUrl = url;
                var queryString = "start=" + calendar.visibleStart().toString() + "&end=" + calendar.visibleEnd().toString();
                if (fullUrl.indexOf("?") > -1) {
                    fullUrl += "&" + queryString;
                }
                else {
                    fullUrl += "?" + queryString;
                }

                DayPilot.ajax({
                    "method": "GET",
                    "url": fullUrl,
                    "success": onSuccess,
                    "error": onError
                });
            }

        };

        this.events.findRecurrent = function(masterId, time) {
            if (!calendar.events.list || typeof calendar.events.list.length === 'undefined') {
                return null;
            }

            var len = calendar.events.list.length;
            for (var i = 0; i < len; i++) {
                if (calendar.events.list[i].recurrentMasterId === masterId && calendar.events.list[i].start.getTime() === time.getTime()) {
                    return new DayPilot.Event(calendar.events.list[i], calendar);
                }
            }
            return null;
        };

        // internal
        this.events._removeFromRows = function(data) {
            var rows = [];
            for (var i = 0; i < calendar.rowlist.length; i++) {
                var row = calendar.rowlist[i];
                if (row.isNewRow) {
                    continue;
                }
                calendar._ensureRowData(i);
                for (var r = 0; r < row.events.length; r++) {
                    var rd = row.events[r].data;
                    if (calendar._isSameEvent(rd, data)) {
                        //data.rendered = false;
                        rows.push(i);
                        row.events.splice(r, 1);
                        break; // only once per row
                    }
/*
                    if (row.events[r].data === data || row.events[r].data.id == data.id) {
                        //data.rendered = false;
                        rows.push(i);
                        row.events.splice(r, 1);
                        break; // only once per row
                    }
*/
                }
            }
            return rows;
        };

        // internal
        this.events._findEventInRows = function(data) {
            //var rows = [];
            for (var i = 0; i < calendar.rowlist.length; i++) {
                var row = calendar.rowlist[i];
                if (row.isNewRow) {
                    continue;
                }
                calendar._ensureRowData(i);
                for (var r = 0; r < row.events.length; r++) {
                    var re = row.events[r];
                    if (calendar._isSameEvent(re.data, data)) {
                        return row.events[r];
                    }
/*
                    if (row.events[r].data === data) {
                        return row.events[r];
                    }
*/
                }
            }
            return null;
        };

        // internal
        // fast, use instead of full loadEvents()
        this.events._addToRows = function(data) {
            var rows = [];
            var testAll = calendar._containsDuplicateResources() || calendar.viewType === "Days";

            var index = DayPilot.indexOf(calendar.events.list, data);
            calendar._doBeforeEventRender(index);

            for (var i = 0; i < calendar.rowlist.length; i++) {
                var row = calendar.rowlist[i];
                if (row.isNewRow) {
                    continue;
                }
                calendar._ensureRowData(i);
                var ep = calendar._loadEvent(data, row);
                if (ep) {
                    if (typeof calendar.onBeforeEventRender === 'function') {
                        ep.cache = calendar._cache.events[index];
                    }

                    rows.push(i);
                    if (!testAll) {
                        break;
                    }
                }
            }
            return rows;
        };


        this._isSameEvent = function(data1, data2) {
            data1 = data1 instanceof DayPilot.Event ? data1.data : data1;
            data2 = data2 instanceof DayPilot.Event ? data2.data : data2;

            if (data1 === data2) {
                return true;
            }

            if (data1.id === data2.id) {
                return true;
            }

            // recurring event occurrences in server-based versions
            if (DayPilot.Util.isNullOrUndefined(data1.id) && !DayPilot.Util.isNullOrUndefined(data1.recurrentMasterId)) {
                return data1.recurrentMasterId === data2.recurrentMasterId && new DayPilot.Date(data1.start) === new DayPilot.Date(data2.start);
            }

            return false;
        };

        this.events.update = function(e, data, options) {
            var params = {};
            params.oldEvent = new DayPilot.Event(e.copy(), calendar);
            params.newEvent = new DayPilot.Event(e.temp(), calendar);

            var options = options || {};

            var action = new DayPilot.Action(calendar, "EventUpdate", params, data);

            // don't add it if it wasn't in the list
            var inList = DayPilot.list(calendar.events.list).find(function(item) {
                // var data = item instanceof DayPilot.Event ? item.data : item;
                // return data === e.data || data.id == e.data.id;
                return calendar._isSameEvent(item, e.data);
            });

            if (!inList) {
                return;
            }

            if (calendar._angular.scope) {
                calendar._angular.notify(function() {
                    e.commit();
                });
            }
            else {

                calendar._angular2.skip = true;

                var inplaceEnabled = calendar.eventUpdateInplaceOptimization || options.inplace;

                // optimization - don't redraw the whole row if the event arrangement didn't change
                if (inplaceEnabled && params.oldEvent.resource() === params.newEvent.resource() && params.oldEvent.start()  === params.newEvent.start() && params.oldEvent.end()  === params.newEvent.end()) {

                    e.commit();

                    var div = calendar._findEventDiv(e);
                    // doesn't have to be in rendered state
                    if (div) {
                        var oldPart = div.event.part;
                        calendar._deleteEvent(div);
                        DayPilot.rfa(calendar.elements.events, div);
                        e.part = oldPart;  // might not be necessary
                    }
                    else {
                        doNothing("Old div not found");
                    }

                    calendar.events._removeFromRows(e.data);
                    var rows = calendar.events._addToRows(e.data);
                    calendar._loadRows(rows);

                    var ue = calendar.events._findEventInRows(e.data);
                    ue && calendar._drawEvent(ue);
                }
                else {
                    var rows = calendar.events._removeFromRows(e.data);
                    e.commit();
                    rows = rows.concat(calendar.events._addToRows(e.data));
                    calendar.events._postponedUpdate(rows);
                }
            }

            return action;
        };

        this.events.remove = function(e, data) {

            var params = {};
            params.e = new DayPilot.Event(e.data, calendar);

            var action = new DayPilot.Action(calendar, "EventRemove", params, data);

            var index = DayPilot.indexOf(calendar.events.list, e.data);
            if (index >= 0) { // if found
                calendar.events.list.splice(index, 1);
            }

            if (calendar._angular.scope) {
                calendar._angular.notify();
            }
            else {
                calendar._angular2.skip = true;

                var rows = calendar.events._removeFromRows(e.data);
                //calendar.events._postponedUpdate(rows);

                var inplaceEnabled = calendar.eventUpdateInplaceOptimization;

                if (inplaceEnabled && rows.length === 1 && !calendar.events._overlaps(e)) {
                    // can be done manually if it's too slow (removing from lines)
                    calendar._loadRow(calendar.rowlist[rows[0]]);

                    var div = calendar._findEventDiv(e);
                    if (div) {
                        var index = calendar.elements.events.indexOf(div);
                        calendar.elements.events.splice(index, 1);
                        calendar._deleteEvent(div);
                    }
                }
                else {
                    calendar.events._postponedUpdate(rows);
                }

                /*
                calendar._loadRows(rows);
                calendar._updateRowHeights();

                if (calendar._initialized) {
                    if (calendar.viewType === "Gantt") {
                        calendar.update();
                    }
                    else {
                        calendar._updateRowsNoLoad(rows);
                        calendar._updateHeight();
                    }
                }
                */
            }

            return action;
        };

        this.events.add = function(e, data) {

/*
            if (!(e instanceof DayPilot.Event)) {
                throw new DayPilot.Exception("events.add(e) - e parameter must be DayPilot.Event object");
            }
*/

            if (!(e instanceof DayPilot.Event)) {
                e = new DayPilot.Event(e);
            }

            e.calendar = calendar;

            if (!calendar.events.list) {
                calendar.events.list = [];
            }

            var inList = DayPilot.list(calendar.events.list).find(function(item) {
                var data = item instanceof DayPilot.Event ? item.data : item;

                return data === e.data;

                //return data === e.data || data.id == e.data.id;
                /*
                id-based comparison not used because it prevents dragging the same event twice from an external source
                 */
            });

            if (!inList) {
                calendar.events.list.push(e.data);
            }

            var action = new DayPilot.Action(calendar, "EventAdd", params, data);

            if (!calendar._initialized) {
                return action;
            }

            if (calendar._angular.scope) {
                calendar._angular.notify();
            }
            else {
                calendar._angular2.skip = true;

                var params = {};
                params.e = e;

                var rows = calendar.events._addToRows(e.data);

                var height = e.data.height || calendar.eventHeight;

                var inplaceEnabled = calendar.eventUpdateInplaceOptimization;

                if (inplaceEnabled && rows.length === 1 && !calendar.events._overlaps(e) && height <= calendar.eventHeight && !calendar.eventVersionsEnabled) {

                    var row = calendar.rowlist[rows[0]];
                    calendar._loadRow(row);

                    var ep = row.events.find(function(item) {
                        return item.data === e.data;
                    });

                    ep.part.top = 0;
                    ep.part.height = height;
                    ep.part.line = 0;

                    calendar._drawEvent(ep);
                }
                else {
                    calendar.events._postponedUpdate(rows);
                }
            }

            return action;

        };

        this.events._overlaps = function(e) {
            var data = e instanceof DayPilot.Event ? e.data : e;
            var start = new DayPilot.Date(data.start);
            var end = new DayPilot.Date(data.end);

            var overlapping = DayPilot.list(calendar.events.list).find(function(item) {
                if (calendar._isSameEvent(data, item)) {
                     return false;
                }
/*
                if (data === item || data.id == item.id) {
                     return false;
                }
*/
                if (data.resource !== item.resource) {
                    return false;
                }
                var itemStart = new DayPilot.Date(item.start);
                var itemEnd = new DayPilot.Date(item.end);
                return DayPilot.Util.overlaps(start, end, itemStart, itemEnd);
            });
            return !!overlapping;
        };

        this.events.addByData = function(data) {
            calendar.events.add(new DayPilot.Event(data));
        };

        this.events.removeByData = function(data) {
            var e = calendar.events.find(data.id);
            if (!e) {
                throw new DayPilot.Exception("The event to be removed was not found");
            }
            calendar.events.remove(e);
        };

        this.events.updateByData = function(data) {
            var e = calendar.events.find(data.id);
            if (!e) {
                throw new DayPilot.Exception("The event to be updated was not found");
            }
            calendar.events.remove(e);
            calendar.events.add(new DayPilot.Event(data));
        };

        this.events.removeById = function(id) {
            var e = calendar.events.find(id);
            if (!e) {
                throw new DayPilot.Exception("The event to be removed was not found");
            }
            calendar.events.remove(e);
        };

        this.events._postponedData = { "rows": [] };
        this.events._postponedTimeout = null;
        this.events._postponedClear = function() {
            clearTimeout(calendar.events._postponedTimeout);
            calendar.events._postponedData.rows = [];
        };
        this.events._queueUpdateInterval = 0;
        this.events._postponedUpdate = function(rows) {

            //clearTimeout(calendar.events._postponedTimeout);

            var update = calendar.events._postponedData.rows;
            DayPilot.list(rows).each(function(row) {
                update.push(row);
            });

            calendar.events._postponedData.rows = DayPilot.ua(update); // merge

            var doit = calendar.events.immediateRefresh;

            if (!calendar.events._postponedTimeout) {
                calendar.events._postponedTimeout = setTimeout(doit, calendar.events._queueUpdateInterval);
            }
        };

        this.events.immediateRefresh = function() {
            clearTimeout(calendar.events._postponedTimeout);
            calendar.events._postponedTimeout = null;

            var rows = calendar.events._postponedData.rows;
            calendar.events._postponedData.rows = [];

            calendar._loadRows(rows);
            calendar._updateRowHeights();

            if (calendar._initialized) {
                if (calendar.viewType === "Gantt") {
                    calendar.update();
                }
                else {
                    calendar._updateRowsNoLoad(rows);
                    calendar._updateHeight();
                    calendar._redrawInvalidatedCells();
                }
            }
        };

        this._angular2 = {};
        this._angular2.enabled = false;
        this._angular2.skip = false;
        this._angular2.skipUpdate = function() {
            return calendar._angular2.skip;
        };
        this._angular2.skipped = function() {
            calendar._angular2.skip = false;
        };

        this.queue = {};
        this.queue.list = [];
        this.queue.list.ignoreToJSON = true;

        this.queue.add = function(action) {
            if (!action) {
                return;
            }
            if (action.isAction) {
                calendar.queue.list.push(action);
            }
            else {
                throw "DayPilot.Action object required for queue.add()";
            }
        };

        this.queue.notify = function(data) {
            var params = {};
            params.actions = calendar.queue.list;
            calendar._callBack2('Notify', params, data, "Notify");

            calendar.queue.list = [];
        };


        this.queue.clear = function() {
            calendar.queue.list = [];
        };

        this.queue.pop = function() {
            return calendar.queue.list.pop();
        };

        this.cells.find = function(start, resource) {
            var pixels = calendar.getPixels(new DayPilot.Date(start));
            if (!pixels) {
                return cellArray();
            }
            var x = pixels.i;
            
            var row = calendar._findRowByResourceId(resource);
            if (!row) {
                return cellArray();
            }
            //var top = row.top;
            //var y = calendar._getRow(top).i;
            var y = row.index;
            
            return this.findXy(x, y);
        };
        
        this.cells.findByPixels = function(x, y) {
            var itc = calendar._getItlineCellFromPixels(x);
            if (!itc) {
                return cellArray();
            }
            var x = itc.x;
            
            var row = calendar._getRow(y);
            if (!row) {
                return cellArray();
            }
            var y = row.i;
            return this.findXy(x, y);
        };
        
        this.cells.all = function() {
            var list = [];
            // may require optimization
            var maxX = calendar.itline.length;
            var maxY = calendar.rowlist.length;
            for(var x = 0; x < maxX; x++) {
                for (var y = 0; y < maxY; y++) {
                    var cell = calendar.cells.findXy(x, y);
                    list.push(cell[0]);
                }
            }
            return cellArray(list);
        };
        
        this.cells._cell = function(x, y) {
            //var itc = calendar.itline[x];
            var itc = calendar._getItline(x);
            var row = calendar.rowlist[y];

            var rowOffset = row.start.getTime() - calendar._visibleStart().getTime();
            var start = itc.start.addTime(rowOffset);
            var end = itc.end.addTime(rowOffset);

            var cell = {};
            cell.x = x;
            cell.y = y;
            cell.i = x + "_" + y;

            if (!row.id) {
                //debugger;
            }
            cell.resource = row.id;
            cell.start = start;
            cell.end = end;
            cell.calendar = calendar; // required for active areas
            cell.isParent = row.children && row.children.length;
            //cell.row = calendar._createRowObject(row);
            cell.update = function() { // if visible

                if (!calendar.rowlist[cell.y].hidden) {
                    // always delete, might have been already rendered
                    var old = calendar._cache.cells[cell.i];
                    calendar._deleteCell(old);

                    // draw the deleted cells in the visible area
                    var area = calendar._getDrawArea();
                    if (area.xStart <= cell.x && cell.x <= area.xEnd) {
                        if (area.yStart <= cell.y && cell.y <= area.yEnd) {
                            calendar._drawCell(cell.x, cell.y);
                        }
                    }
                }

            };
            cell.utilization = function(name) {
                if (!row.sections) {
                    row.calculateUtilization();
                }
                return row.sections.forRange(start, end).maxSum(name);
            };
            cell.events = function() {
                return row.events.forRange(start, end);
            };
            cell.div = calendar._cache.cells[cell.i];

            var p = calendar._getCellProperties(x, y);
            cell.properties = p;

            return cell;
        };
        
        /* accepts findXy(0,0) or findXy([{x:0, y:0}, {x:0, y:1}]) */
        this.cells.findXy = function(x, y) {
            
            if (DayPilot.isArray(x)) {
                var cells = [];
                for (var i = 0; i < x.length; i++) {
                    var o = x[i];
                    cells.push(calendar.cells._cell(o.x, o.y));
                }
                return cellArray(cells);
            } 
            else if (x === null || y === null) {
                return cellArray(); // empty
            }
            var cell = calendar.cells._cell(x, y);
            return cellArray(cell);
        };

        var rowArray = function(a) {
            var list = DayPilot.list();

            if (DayPilot.isArray(a)) {
                for (var i = 0; i < a.length; i++) {
                    list.push(a[i]);
                }
            }
            else if (typeof a === 'object') {
                list.push(a);
            }

            /*
            list.each = function(f) {
                if (!f) {
                    return;
                }
                for (var i = 0; i < list.length; i++) {
                    f(list[i]);
                }
            };*/

            return list;

        };


        this._cellArray = function(a) {
            var list = DayPilot.list();
            
            if (DayPilot.isArray(a)) {
                for (var i = 0; i < a.length; i++) {
                    list.push(a[i]);
                }
            }
            else if (typeof a === 'object') {
                list.push(a);
            }
            
            list.cssClass = function(css) {
                this.each(function(item) {
                    item.properties.cssClass = DayPilot.Util.addClassToString(item.properties.cssClass, css);
                    item.update();
                });
                return this;
            };
            
            list.removeClass = function(css) {
                this.each(function(item) {
                    item.properties.cssClass = DayPilot.Util.removeClassFromString(item.properties.cssClass, css);
                    item.update();
                });
                return this;
            };
            
            list.addClass = list.cssClass;
            
            list.html = function(html) {
                this.each(function(item) {
                    item.properties.html = html;
                    item.update();
                });
                return this;
            };

            list.invalidate = function() {
                this.each(function(item) {
                    delete calendar._bcrCache[item.i];
                });

                return this;
            };

            /*
            list.each = function(f) {
                if (!f) {
                    return;
                }
                for (var i = 0; i < this.length; i++) {
                    f(list[i]);
                }
            };*/

            return list;
        };

        var cellArray = this._cellArray;

        // AngularJS
        this._angular = {};
        this._angular.scope = null;
        this._angular.notify = function(f) {
            if (calendar._angular.scope) {
                DayPilot.Util.safeApply(calendar._angular.scope, f);
                //calendar._angular.scope["$apply"](f);
            }
        };

        this.debug = new DayPilot.Debug(this);
        
        this._getRowStartInDaysView = function(date) {
            if (calendar.viewType !== 'Days') {
                throw "Checking row start when viewType !== 'Days'";
            }
            for (var i = 0; i < calendar.rowlist.length; i++) {
                var row = calendar.rowlist[i];
                var data = row.element ? row.element.data : row.data;
                var start = data.start;
                if (date.getTime() >= start.getTime() && date.getTime() < start.addDays(1).getTime()) {
                    return start;
                }
            }
            return null;
        };
        
        this._getBoxStart = function(date) {

            var start = calendar._visibleStart();
            
            if (date.ticks === start.ticks) {
                return date;
            }

            var cursor = start;

            if (date.ticks < start.ticks) {
                var firstCellDuration = this.itline[0].end.ticks - this.itline[0].start.ticks;
                while (cursor.ticks > date.ticks) {
                    cursor = cursor.addTime(-firstCellDuration);
                }
                return cursor;
            }
            
            if (calendar.viewType === 'Days') {
                var rowStart = this._getRowStartInDaysView(date);
                var offset = rowStart.getTime() - calendar._visibleStart().getTime();

                var cell = this._getItlineCellFromTime(date.addTime(-offset));
                if (cell.current) {
                    return cell.current.start.addTime(offset);
                }
                if (cell.past) {
                    return cell.previous.end.addTime(offset);
                }
                throw "getBoxStart(): time not found";
                
            }
            else {
                var cell = this._getItlineCellFromTime(date);
                if (cell.current) {
                    return cell.current.start;
                }
                if (cell.past) {
                    return cell.previous.end;
                }
                if (cell.hidden) {
                    var diff = cell.next.start.getTime() - date.getTime();
                    var cellduration = cell.next.end.getTime() - cell.next.start.getTime();
                    var rounded = Math.ceil(diff / cellduration) * cellduration;
                    var result = cell.next.start.addTime(-rounded);
                    return result;
                }
                throw "getBoxStart(): time not found";
            }
        };

        this._getShadowCoords = function(e) {

            // get row
            var row = this._getRow(calendar.coords.y);

            //var object = DayPilotScheduler.moving;
            //var e = object.event;
            if (typeof e.end !== 'function') {
                throw "e.end function is not defined";
            }
            if (!e.end()) {
                throw "e.end() returns null";
            }
            var duration = DayPilot.DateUtil.diff(e.rawend(), e.start());
            duration = Math.max(duration, 1);

            var useBox = resolved.useBox(duration);

            var isMilestone = e.data && e.data.type === "Milestone";
            var milestoneWidth = calendar.eventHeight;

            //var day = e.start().getDatePart();
            var startOffsetTime = 0;

            var x = calendar.coords.x;
            if (isMilestone) {
                x += milestoneWidth/2;
            }

            if (calendar.scale === "Manual") {
                var minusDurationPx = (function() {
                    var end = calendar.getDate(calendar.coords.x, true, true);
                    var start = end.addTime(-duration);

                    var startPix = calendar.getPixels(start).boxLeft;
                    var endPix = calendar.getPixels(end).boxRight;

                    var end = Math.min(endPix, calendar.coords.x);

                    return end - startPix;
                })();

                var offset = Math.min(DayPilotScheduler.moveOffsetX ? DayPilotScheduler.moveOffsetX : 0, minusDurationPx);

                x = calendar.coords.x - offset;
            }

            var rowOffset = 0;
            //var useCustomRowStart = this.viewType === 'Days' || this._rowsWithCustomStart();
            var useCustomRowStart = this.viewType === 'Days' || this._rowsWithCustomStart();
            if (useCustomRowStart && !e.part.external) {
                rowOffset = this.rowlist[e.part.dayIndex].start.getTime() - this._visibleStart().getTime();
            }

            if (useBox && !isMilestone) {
                //startOffsetTime = e.start().getTime() - (day.getTime() + Math.floor((e.start().getHours() * 60 + e.start().getMinutes()) / calendar.cellDuration) * calendar.cellDuration * 60 * 1000);

                var cell = calendar._getItlineCellFromTime(e.start());
                var startInTimeline = !cell.hidden && !cell.past;

                startOffsetTime = e.start().getTime() - this._getBoxStart(e.start().addTime(-rowOffset)).addTime(rowOffset).getTime();

                if (startInTimeline) {
                    startOffsetTime = (function(originalTime, offset) {
                        var oticks = calendar._getCellTicks(calendar._getItlineCellFromTime(originalTime).current);
                        var nticks = calendar._getCellTicks(calendar._getItlineCellFromPixels(x).cell);

                        if (oticks > nticks * 1.2) { // normally one would be fine but avoid month issues when moving to shorter month (28 vs 31 days)
                            var sign = offset > 0 ? 1 : -1;
                            var offset = Math.abs(offset);
                            while (offset >= nticks) {
                                offset -= nticks;
                            }
                            offset *= sign;
                        }
                        return offset;
                    })(e.start(), startOffsetTime);
                }
            }

            // var srccal = DayPilotScheduler.moving ? DayPilotScheduler.moving.event.calendar : calendar;
            var srccal = DayPilotScheduler.movingEvent ? DayPilotScheduler.movingEvent.calendar : calendar;

            if (srccal !== calendar) {
                if (srccal._getCellDuration() !== calendar._getCellDuration()) {
                    startOffsetTime = 0;
                }
            }

            var dragOffsetTime = 0;

            // this keeps the cell offset the same after moving
            if (DayPilotScheduler.moveDragStart && calendar.scale !== "Manual" && srccal === calendar) {
                if (useBox) {
                    var estart = e.start().addTime(-rowOffset);
                    var boxStart = this._getBoxStart(estart);
                    dragOffsetTime = DayPilotScheduler.moveDragStart.getTime() - boxStart.getTime();
                    var cellDurationTicks = calendar._getCellDuration() * 60 * 1000;
                    dragOffsetTime = Math.floor(dragOffsetTime/cellDurationTicks) * cellDurationTicks;
                }
                else {
                    //dragOffsetTime = DayPilotScheduler.moveDragStart.getTime() - e.start().addTime(rowOffset).getTime();
                    dragOffsetTime = DayPilotScheduler.moveDragStart.getTime() - e.start().addTime(-rowOffset).getTime();
                }
            }
            else { // external drag
                //dragOffsetTime = this.cellDuration * 60000 / 2; // half cell duration
                dragOffsetTime = 0; // half cell duration
            }
            if (this.eventMoveToPosition) {
                dragOffsetTime = 0;
            }

            var start = this.getDate(x, true).addTime(-dragOffsetTime).addTime(rowOffset);

            if (DayPilotScheduler.resizing) {
                start = e.start();
            }

            if (this.snapToGrid) { // limitation: this blocks moving events before startDate
                start = this._getBoxStart(start.addTime(-rowOffset)).addTime(rowOffset);
            }

            start = start.addTime(startOffsetTime);
            var end = start.addTime(duration);

            var adjustedStart = start;
            var adjustedEnd = end;

            if (useCustomRowStart) {
                adjustedStart = start.addTime(-rowOffset);
                adjustedEnd = adjustedStart.addTime(duration);

                var currentRowOffset = row.element.data.start.getTime() - this._visibleStart().getTime();
                start = adjustedStart.addTime(currentRowOffset);
                end = start.addTime(duration);
            }

            if (DayPilotScheduler.moveDragStart && calendar.eventMoveSkipNonBusiness) {
                var y = row.i;
                var mid = DayPilotScheduler.moveDragStart.addTime(rowOffset);  // in row time
                if (this.snapToGrid) { // limitation: this blocks moving events before startDate
                    mid = this._getBoxStart(mid.addTime(-rowOffset)).addTime(rowOffset);
                }

                var isExternal = !e.part.dayIndex;
                var before = 0;

                if (!isExternal) {
                    before = calendar._getBusinessDuration(e.start(), mid, e.part.dayIndex);
                }

                var duration = calendar._getEventDurationWithoutNonBusiness(e);
                var mouseTime = calendar.getDate(x, true);
                if (calendar.snapToGrid) {
                    mouseTime = calendar.getDate(x);
                }
                var offset = calendar._adjustBackwardOffsetForBusiness(mouseTime, before, y);

                start = mouseTime.addTime(-offset).addTime(rowOffset);

                if (this.snapToGrid) { // limitation: this blocks moving events before startDate
                    start = this._getBoxStart(start.addTime(-rowOffset)).addTime(rowOffset);
                }

                if (!isExternal) {
                    startOffsetTime = calendar._getBusinessDuration(this._getBoxStart(e.start().addTime(-rowOffset)).addTime(rowOffset), e.start(), y);
                }
                else {
                    startOffsetTime = 0;
                }

                start = start.addTime(startOffsetTime);
                end = calendar._addBusinessDuration(start, duration, y);

                if (end >= calendar.visibleEnd()) {
                    end = calendar.visibleEnd();
                    start = end.addTime(-calendar._backwardOffsetInVisibleTimeline(end, duration));
                }

                adjustedStart = start.addTime(-rowOffset);
                adjustedEnd = end.addTime(-rowOffset);
            }


            var startPixels = this.getPixels(adjustedStart);
            var endPixels = this.getPixels(adjustedEnd);

            var left = (useBox) ? startPixels.boxLeft : startPixels.left;
            var width = (useBox) ? (endPixels.boxRight - left) : (endPixels.left - left);


            if (isMilestone) {
                width = milestoneWidth;
                left -= width/2;
            }

            var coords = {};
            coords.top = row.top;
            coords.left = left;
            coords.row = row.element;
            coords.rowIndex = row.i;
            coords.width = width;
            coords.start = start;
            coords.end = end;
            coords.relativeY = calendar.coords.y - row.top;

            return coords;
        };

        this._hiddenTimeBetween = function(start, end) {
            var startX = calendar._getItlineCellFromTime(start);
            var endX = calendar._getItlineCellFromTime(end);
            var previousEnd = null;
            var hiddenticks = 0;
            if (startX.hidden) {
                previousEnd = start;
            }
            for (var x = startX.i; x <= endX.i; x++) {
                var cell = calendar.itline[x];
                if (previousEnd && previousEnd < cell.start) {
                    hiddenticks += cell.start.getTime() - previousEnd.getTime();
                }
                previousEnd = cell.end;
            }
            return hiddenticks;
        };

        this._addBusinessDuration = function(start, duration, y) {
            var remains = duration;
            //var duration = remains;

            var row = calendar.rowlist[y];
            var rowOffset = row.data.start.getTime() - calendar._visibleStart().getTime();
            var adjustedStart = start.addTime(-rowOffset);

            var nextCell = calendar._getNextCell(adjustedStart, y);
            if (!nextCell) {
                throw new DayPilot.Exception("No next cell found");
            }

            var x = DayPilot.indexOf(calendar.itline, nextCell);
            if (nextCell.start > start) {
                //start = nextCell.start;
                //adjustedStart = start.addTime(-rowOffset);
            }
            else {
                remains -= nextCell.end.getTime() - adjustedStart.getTime();
                if (remains <= 0) {
                    return start.addTime(duration);
                }
                x += 1;
            }

            for (var i = x; i < calendar.itline.length; i++) {
                var cell = calendar._getCellProperties(i, y);
                if (cell.business) {
                    var itc = calendar.itline[i];
                    var cellStart = itc.start.addTime(rowOffset);
                    var cellEnd = itc.end.addTime(rowOffset);
                    var cellDuration = cellEnd.getTime() - cellStart.getTime();

                    if (remains <= cellDuration) {
                        return cellStart.addTime(remains);
                    }

                    remains -= cellDuration;
                }
            }

            if (!cellStart) {
                cellStart = calendar.itline[calendar.itline.length - 1].end;
            }

            // event stretches beyond itline, assume all time is working time
            return cellStart.addTime(remains);
        };

        this._getBusinessDuration = function(start, end, y) {

/*
            if (end === calendar.itline.last().end) {
                debugger;
            }
*/

            var row = calendar.rowlist[y];
            var rowOffset = row.data.start.getTime() - calendar._visibleStart().getTime();

            var cell = calendar._getItlineCellFromTime(start);

            var adjustedStart = start.addTime(-rowOffset);
            var adjustedEnd = end.addTime(-rowOffset);

            var nextCell = calendar._getNextCell(adjustedStart, y);
            if (!nextCell) {
                throw new DayPilot.Exception("No next cell found");
            }

            var duration = 0;

            var x = DayPilot.indexOf(calendar.itline, nextCell);
            if (nextCell.start <= adjustedEnd) {
                if (end < nextCell.end.addTime(rowOffset)) {
                    if (nextCell.start > adjustedStart) {
                        return end.getTime() - nextCell.start.addTime(rowOffset).getTime();
                    }
                    else {
                        return end.getTime() - start.getTime();
                    }
                }
                if (adjustedStart > nextCell.start) {
                    duration += nextCell.end.getTime() - adjustedStart.getTime();
                }
                else {
                    duration += nextCell.end.getTime() - nextCell.start.getTime();
                }
                x += 1;
            }

            for (var i = x; i < calendar.itline.length; i++) {
                var cell = calendar._getCellProperties(i, y);
                if (cell.business) {
                    var itc = calendar.itline[i];
                    var cellStart = itc.start.addTime(rowOffset);
                    var cellEnd = itc.end.addTime(rowOffset);
                    var cellDuration = cellEnd.getTime() - cellStart.getTime();

                    if (end < cellStart) {
                        return duration;
                    }
                    if (end < cellEnd) {
                        duration += end.getTime() - cellStart.getTime();
                        return duration;
                    }

                    duration += cellDuration;

                }
            }

            var remainder = end.getTime() - calendar.itline.last().end.addTime(rowOffset).getTime();
            duration += Math.min(0, remainder);

            return duration;

        };

        this._getEventDurationWithoutNonBusiness = function(e) {
            if (e.part.duration) {
                if (isNaN(e.part.duration)) {
                    throw new DayPilot.Exception("Unable to get calculated duration");
                }
                return e.part.duration;
            }
            var y = e.part.dayIndex;
            return calendar._getBusinessDuration(e.start(), e.rawend(), y);
        };

        this._backwardOffsetInVisibleTimeline = function(start, offset) {
            var result = 0;
            var remains = offset;

            var cell = calendar._getItlineCellFromTime(start);
            if (!cell.current) {
                throw new DayPilot.Exception("Current cell not found.");
            }

            if (start.addTime(-offset) > cell.current.start) {
                return offset;
            }

            result += start.getTime() - cell.current.start.getTime();
            remains -= start.getTime() - cell.current.start.getTime();

            var x = DayPilot.indexOf(calendar.itline, cell.current);
            x -= 1;

            var previousStart = cell.current.start;

            while (x >= 0) {
                var cell = calendar.itline[x];

                if (previousStart > cell.end) {
                    result += previousStart.getTime() - cell.end.getTime();
                }
                previousStart = cell.start;

                var cellDuration = cell.end.getTime() - cell.start.getTime();

                //if (calendar._getCellProperties(x, y).business) {
                    if (remains <= cellDuration) {
                        result += remains;
                        return result;
                    }

                    result += cellDuration;
                    remains -= cellDuration;
                // }
                // else {
                //     result += cellDuration;
                // }

                x -= 1;
            }

            throw new DayPilot.Exception("Unable to backward calculate offset in visible timeline");
        };

        this._adjustBackwardOffsetForBusiness = function(start, offset, y) {
            var result = 0;
            var remains = offset;

            var cell = calendar._getItlineCellFromTime(start);
            if (!cell.current) {
                throw new DayPilot.Exception("Current cell not found.");
            }
            var x = DayPilot.indexOf(calendar.itline, cell.current);

            if (calendar._getCellProperties(x, y).business) {
                if (start.addTime(-offset) >= cell.current.start) {
                    return offset;
                }
            }
            else {
                // first cell
                if (offset === 0 || start.addTime(-offset) >= cell.current.start) {
                    return start.getTime() - calendar._getNextCell(start, y).start.getTime();
                }
            }

            result += start.getTime() - cell.current.start.getTime();
            remains -= start.getTime() - cell.current.start.getTime();

            x -= 1;

            var previousStart = cell.current.start;

            while (x >= 0) {
                var cell = calendar.itline[x];

                if (previousStart > cell.end) {
                    result += previousStart.getTime() - cell.end.getTime();
                }
                previousStart = cell.start;

                var cellDuration = cell.end.getTime() - cell.start.getTime();

                if (calendar._getCellProperties(x, y).business) {
                    if (remains <= cellDuration) {
                        result += remains;
                        return result;
                    }

                    result += cellDuration;
                    remains -= cellDuration;
                }
                else {
                    result += cellDuration;
                }

                x -= 1;
            }

            return result + remains;
            //throw new DayPilot.Exception("Unable to calculate backward offset in visible timeline");
        };

        this._getNextCell = function(time, y) {
            var cell = calendar._getItlineCellFromTime(time);
            var i = 0;

            if (cell.past) {  // invalid
                return null;
            }

            if (cell.current) {
                i =  cell.i;
            }
            else if (cell.next) {
                i = DayPilot.indexOf(calendar.itline, cell.next);
            }
            else {
                return null; // invalid
            }

            // now we have at least one cell to test
            for (var x = i; x < calendar.itline.length; x++) {
                var isWorking = calendar._isWorkingCell(x, y);
                if (isWorking) {
                    return calendar.itline[x];
                }
            }

            return null;

        };


        this._isWorkingCell = function(x, y) {
            var props = calendar._getCellProperties(x, y);
            return props.business;
        };
        
        this._getCellDuration = function() {  // approximate, needs to be updated for a specific time (used only for rounding in getShadowCoords
            switch (this.scale) {
                case "CellDuration":
                    return this.cellDuration;
                case "Minute":
                    return 1;
                case "Hour":
                    return 60;
                case "Day":
                    return 60*24;
                case "Week":
                    return 60*24*7;
                case "Month":
                    return 60*24*30;
                case "Year":
                    return 60*24*365;
                case "Manual":
                    if (calendar.itline.length > 0) {
                        var cell = calendar.itline[0];
                        return (cell.end.getTime() - cell.start.getTime()) / (60 * 1000);
                    }
                    else {
                        return calendar.cellDuration;
                    }

            }
            throw "can't guess cellDuration value";
        };
        
        this._getCellTicks = function(itc) {
            return itc.end.ticks - itc.start.ticks;
        };

        this._isRowDisabled = function(y) {
            return this.treePreventParentUsage && this._isRowParent(y);
        };

        this._isRowParent = function(y) {
            var row = this.rowlist[y];
            if (row.isParent) {
                return true;
            }
            if (this.treeEnabled) {
                if (row.children && row.children.length > 0) {
                    return true;
                }
            }
            return false;
        };
        
        this._autoexpand = {};
        this._expandParent = function() {
            
            if (!calendar.treeAutoExpand) {
                return;
            }
            
            var coords = this._getShadowCoords(DayPilotScheduler.movingEvent);
            var y = coords.rowIndex;
            var isParent = this._isRowParent(y);
            
            var expand = this._autoexpand;
            if (expand.timeout && expand.y !== y) {
                clearTimeout(expand.timeout);
                expand.timeout = null;
            }
            
            if (isParent) {
                expand.y = y;
                var collapsed = !calendar.rowlist[expand.y].expanded;
                if (!expand.timeout && collapsed) {
                    expand.timeout = setTimeout(function() {
                        var collapsed = !calendar.rowlist[expand.y].expanded;
                        if (collapsed) {
                            calendar._toggle(expand.y);
                            calendar._moveShadow();
                        }
                        expand.timeout = null;
                    }, 500);
                }
            }
        };

        this._cancelAutoexpand = function() {
            clearTimeout(calendar._autoexpand.timeout);
        };

        
        this._updateResizingShadow = function() {
            // var shadowWidth = DayPilotScheduler.resizingShadow.clientWidth;
            // var shadowLeft = DayPilotScheduler.resizingShadow.offsetLeft;
            var shadowWidth = DayPilotScheduler.resizingShadow.width;
            var shadowLeft = DayPilotScheduler.resizingShadow.left;
            var e = DayPilotScheduler.resizingEvent;
            var border = DayPilotScheduler.resizing.dpBorder;

            // TODO involve rowStart for Days mode
            var row = calendar.rowlist[e.part.dayIndex];
            var rowOffset = 0;

            rowOffset = row.start.getTime() - calendar._visibleStart().getTime();

            var newStart = null;
            var newEnd = null;
            
            var exact = !calendar.snapToGrid;

            if (border === 'left') {
                newStart = calendar.getDate(shadowLeft, exact).addTime(rowOffset);
                newEnd = e.rawend();
            }
            else if (border === 'right') {
                newStart = e.start();
                newEnd = calendar.getDate(shadowLeft + shadowWidth, exact, true).addTime(rowOffset);
            }
            
            DayPilotScheduler.resizingShadow.start = newStart;
            DayPilotScheduler.resizingShadow.end = newEnd;

            mre.update();
            
        };

        this.exportAs = function(format, options) {
            var board = img.generate(format, options);
            return new DayPilot.Export(board);
        };

        this["export"] = this.exportAs;

        this._img = {};
        var img = this._img;

        img.getWidth = function() {
            var mode = img._mode;

            switch (mode) {
                case "viewport":
                    return calendar.nav.top.offsetWidth;
                case "full":
                    return calendar._getGridWidth() + img.getRowHeaderWidth();
                case "range":
                    return calendar.getPixels(img.getRangeEnd()).boxRight - calendar.getPixels(img.getRangeStart()).boxLeft + img.getRowHeaderWidth();
                default:
                    throw "Unsupported export mode: " + mode;
            }
        };

        img.getHeight = function() {
            var mode = img._mode;

            switch (mode) {
                case "viewport":
                    return calendar.nav.top.offsetHeight - DayPilot.sh(calendar.nav.scroll) - 1;
                case "full":
                    return calendar._getScrollableInnerHeight() + calendar._getTotalHeaderHeight() - DayPilot.sh(calendar.nav.scroll);
                case "range":
                    var rows = img.getRows();
                    if (rows.length === 0) {
                        return calendar._getTotalHeaderHeight();
                    }
                    else {
                        var from = rows.first();
                        var to = rows.last();
                        // return to.top - from.top + to.height + calendar._getTotalHeaderHeight();
                        return to.top - from.top + to.height + calendar._getTotalHeaderHeight();
                    }
                default:
                    throw "Unsupported export mode: " + mode;
            }
        };

        img.getRangeStart = function() {
            var from = img._options.dateFrom || calendar._visibleStart();
            return new DayPilot.Date(from);
        };

        img.getRangeEnd = function() {
            var to = img._options.dateTo || calendar._visibleEnd();
            return new DayPilot.Date(to);
        };

        img.getRangeResStart = function() {
            if (!img._options.resourceFrom) {
                return calendar.rowlist.find(function(row) { return !row.hidden});
                //return calendar.rowlist[0];
            }
            return calendar._findRowByResourceId(img._options.resourceFrom);
        };

        img.getRangeResEnd = function() {
            if (!img._options.resourceTo) {
                return calendar.rowlist.last();
            }
            return calendar._findRowByResourceId(img._options.resourceTo);
        };

        img.getRowHeaderWidth = function() {
            return calendar._getOuterRowHeaderWidth();
        };

        img.getTimeHeaderHeight = function() {
            return calendar._getTotalHeaderHeight();
        };

        img.getCanvas = function() {
            return img.canvas();
        };

        img.getRectangles = function() {
            var rowHeaderWidth = img.getRowHeaderWidth();
            var timeHeaderHeight = img.getTimeHeaderHeight();

            var rectangles = {};
            rectangles.main = {"x": 0, "y": 0, "w": img.getWidth(), "h": img.getHeight()};
            rectangles.corner = {"x": 0, "y": 0, "w": rowHeaderWidth, "h": timeHeaderHeight};
            rectangles.grid = {"x": rowHeaderWidth, "y": timeHeaderHeight, "w": img.getWidth() - rowHeaderWidth, "h": img.getHeight() - timeHeaderHeight};

            var width = rectangles.grid.w;
            var lastTimeHeader = calendar.itline.last();
            if (lastTimeHeader && (lastTimeHeader.left + lastTimeHeader.width) < rectangles.grid.w) {
                width = lastTimeHeader.left + lastTimeHeader.width;
            }

            var height = rectangles.grid.h;
            var lastRow = calendar.rowlist.last();
            if (lastRow && (lastRow.top + lastRow.height) < rectangles.grid.h) {
                height = lastRow.top + lastRow.height;
            }

            rectangles.gridContent = {"x": rowHeaderWidth, "y": timeHeaderHeight, "w": width, "h": height};

            return rectangles;
        };

        img.getRows = function() {
            var mode = img._mode;
            var result = DayPilot.list();

            var top, bottom, cellTop, cellBottom;

            switch (mode) {
                case "viewport":
                    top = calendar._scrollTop;
                    bottom = top + calendar.nav.scroll.offsetHeight;
                    cellTop = calendar._getRow(top).i;
                    cellBottom = calendar._getRow(bottom).i;
                    break;
                case "full":
                    top = 0;
                    cellTop = 0;
                    cellBottom = calendar.rowlist.length;
                    break;
                case "range":

                    var from = img.getRangeResStart();
                    var to = img.getRangeResEnd();
                    if (!from) {
                        throw "Resource specified using resourceFrom option not found during export.";
                    }
                    if (!to) {
                        throw "Resource specified using resourceTo option not found during export.";
                    }

                    cellTop = from.index;
                    cellBottom = to.index;
                    break;
            }

            if (cellBottom < calendar.rowlist.length) {
                cellBottom += 1;
            }

/*
            if (cellBottom === calendar.rowlist.length && calendar.rowCreateHandling !== "Disabled") {
                cellBottom -= 1;
            }
*/

            for (var y = cellTop; y < cellBottom; y++) {
                var row = calendar.rowlist[y];

                if (row.hidden) {
                    continue;
                }

                result.push(row);
            }

            result.offset = cellTop;

            return result;

        };

        img.getEvents = function() {
            var mode = img._mode;
            switch (mode) {
                case "full":
                    var all = DayPilot.list();
                    DayPilot.list(calendar.rowlist).each(function(row) {
                        if (row.hidden) {
                            return;
                        }
                        DayPilot.list(row.events).each(function(e) {
                            all.push(e);
                        });
                    });
                    return all;
                case "viewport":
                    return viewport.events().map(function(div) { return div.event; });
                case "range":
                    var all = DayPilot.list();
                    var start = img.getRangeStart();
                    var end = img.getRangeEnd();

                    img.getRows().each(function(row) {
                        DayPilot.list(row.events).filter(function(item) { return DayPilot.Util.overlaps(item.start(), item.end(), start, end) }).each(function(e) {
                            all.push(e);
                        });
                    });
                    return all;
                default:
                    throw "Unsupported export mode: " + mode;
            }
        };

        img.getTimeline = function() {
            var mode = img._mode;
            switch (mode) {
                case "full":
                    return DayPilot.list(calendar.itline).addProps({"offset":0});
                case "viewport":
                    return img.getViewportTimeline();
                case "range":
                    return img.getRangeTimeline();
                default:
                    throw "Unsupported export mode: " + mode;
            }
        };

        img.getRangeTimeline = function() {
            var result = DayPilot.list();
            if (calendar.itline && calendar.itline.length > 0) {

                var start = calendar._getItlineCellFromTime(img.getRangeStart()).i;
                var end = calendar._getItlineCellFromTime(img.getRangeEnd()).i;

                var totalWidth = calendar._cellCount();
                end = Math.min(end, totalWidth - 1); // make sure it's within the boundaries
                start = Math.max(start, 0); // check the left side

                for (var x = start; x <= end; x++) {
                    var cell = calendar.itline[x];
                    result.push(cell);
                }
                result.offset = start;
            }
            return result;
        };

        img.getViewportTimeline = function() {
            var result = DayPilot.list();
            if (calendar.itline && calendar.itline.length > 0) {
                var left = calendar._scrollPos;
                var right = left + calendar._scrollWidth;

                var start = calendar._getItlineCellFromPixels(left).x;
                var end = calendar._getItlineCellFromPixels(right, true).x;
                var totalWidth = calendar._cellCount();
                end = Math.min(end, totalWidth); // make sure it's within the boundaries
                start = Math.max(start, 0); // check the left side

                for (var x = start; x <= end; x++) {
                    var cell = calendar.itline[x];
                    result.push(cell);
                }
                result.offset = start;
            }
            return result;
        };

        img.getTimeHeader = function(y) {
            var mode = img._mode;

            if (mode === "full") {
                return DayPilot.list(calendar.timeHeader[y]);
            }
            else {
                var result = DayPilot.list();

                var viewportOffsetStart, viewportOffsetEnd;

                viewportOffsetStart = img.getViewportOffsetStart();
                viewportOffsetEnd = viewportOffsetStart + img.getViewportOffsetWidth();

                var startCell = calendar._getTimeHeaderCellForY(y, viewportOffsetStart);
                var endCell = calendar._getTimeHeaderCellForY(y, viewportOffsetEnd);
                if (!endCell) {
                    endCell = {"x": calendar.timeHeader[y].length - 1};
                }
                for (var x = startCell.x; x <= endCell.x; x++) {
                    var cell = calendar.timeHeader[y][x];

                    result.push(cell);
                }

                return result;
            }
        };

        img.fakeDurationBar = function() {
            var div = document.createElement("div");
            div.style.display = "none";
            div.className = calendar._prefixCssClass(cssNames.event);

            var bar = document.createElement("div");
            bar.className = calendar._prefixCssClass(cssNames.eventBar);

            var inner = document.createElement("div");
            inner.className = calendar._prefixCssClass(cssNames.eventBarInner);

            document.body.appendChild(div);

            bar.appendChild(inner);
            div.appendChild(bar);
            return div;
        };

        img.fakeCell = function() {
            var div = document.createElement("div");
            div.style.display = "none";
            div.className = calendar._prefixCssClass("_cell");

            div.style.position = "absolute";
            div.style.top = "-2000px";
            div.style.left = "-2000px";

            var inner = document.createElement("div");
            inner.className = calendar._prefixCssClass("_cell_inner");
            div.appendChild(inner);

            calendar.divCells.appendChild(div);
            //document.body.appendChild(div);

            return div;
        };

        img.fakeRowHeader = function() {
            var div = document.createElement("div");
            div.style.display = "none";
            div.className = calendar._prefixCssClass("_rowheader");

            div.style.position = "absolute";
            div.style.top = "-2000px";
            div.style.left = "-2000px";

            var inner = document.createElement("div");
            inner.className = calendar._prefixCssClass("_rowheader_inner");
            div.appendChild(inner);

            calendar.divResScroll.appendChild(div);

            return div;
        };

        img.fakeExpand = function() {
            var div = document.createElement("div");
            div.style.display = "none";
            div.className = calendar._prefixCssClass('_tree_image_expand');

            document.body.appendChild(div);
            return div;
        };

        img.extractUrl = function(str) {
            // both or no quotes: /url\((")?([^"].*[^"])\1\)/    read array[2]
            // quotes required: /url\("(.*)"\)/                  read array[1]
            var array = /url\((")?([^"].*[^"])\1\)/.exec(str);
            if (!array) {
                return null;
            }
            return array[2];
        };

        img.getImages = function() {
            var result = {};

            var node = img.fakeExpand();

            result.expand = img.extractUrl(new DayPilot.StyleReader(node).get("background-image"));

            node.className = calendar._prefixCssClass("_tree_image_collapse");
            result.collapse = img.extractUrl(new DayPilot.StyleReader(node).get("background-image"));

            node.className = calendar._prefixCssClass("_tree_image_no_children");
            result.nochildren = img.extractUrl(new DayPilot.StyleReader(node).get("background-image"));

            DayPilot.de(node);

            return result;
        };

        img.getFont = function(element) {
            return new DayPilot.StyleReader(element).getFont();
        };

        img.getViewportOffsetStart = function() {
            var mode = img._mode;
            switch (mode) {
                case "full":
                    return 0;
                case "viewport":
                    return calendar.nav.scroll.scrollLeft;
                case "range":
                    return calendar.getPixels(img.getRangeStart()).boxLeft;
            }
        };

        img.getViewportOffsetTop = function() {
            var mode = img._mode;
            switch (mode) {
                case "full":
                    return 0;
                case "viewport":
                    return calendar.nav.scroll.scrollTop;
                case "range":
                    return img.getRangeResStart().top;
            }
        };

        img.getViewportOffsetWidth = function() {
            var mode = img._mode;
            switch (mode) {
                case "full":
                    return calendar._getGridWidth();
                case "viewport":
                    return calendar.nav.scroll.offsetWidth;
                case "range":
                    return calendar.getPixels(img.getRangeEnd()).boxRight - img.getViewportOffsetStart();
            }
        };

        img.excelBoard = function() {
            var excel = new DayPilot.Excel();
            var sheet = excel.worksheets.create("Scheduler");

            // duplicate
            var cornerBackground = new DayPilot.StyleReader(calendar.nav.corner).get("background-color");
            var borderColor = new DayPilot.StyleReader(calendar.nav.top).get("border-top-color");

            // doesn't work if no event is rendered
            var divSampleEvent = DayPilot.list(calendar.elements.events).map(function(item) {return item.firstChild;}).last();
            var eventBorderColor = new DayPilot.StyleReader(divSampleEvent).get("border-right-color");

            excel.styles.getDefault().setBackColor("#ffaaaa");

            var styleTimeHeader = excel.styles.create();
            styleTimeHeader.setHorizontalAlignment("Center");
            styleTimeHeader.setBackColor(cornerBackground);
            styleTimeHeader.setBorderColor(borderColor);

            var styleRowHeader = excel.styles.create();
            styleRowHeader.setVerticalAlignment("Top");
            styleRowHeader.setBackColor(cornerBackground);
            styleRowHeader.setBorderColor(borderColor);

            var styleEvent = excel.styles.create();
            styleEvent.setVerticalAlignment("Top");
            styleEvent.setBackColor("#ff0000");
            styleEvent.setBorderColor(eventBorderColor);

            sheet.enableGridlines(false);

            // corner
            sheet.cell(0, 0).setRowspan(calendar.timeHeader.length).setStyle(styleTimeHeader);

            sheet.cell(10, 10).setText("hi there");

            // time header
            DayPilot.list(calendar.timeHeader).each(function(item, y) {
                var offset = {
                    "x": 1,
                    "y": 0
                };
                //var startX = 1;
                img.getTimeHeader(y, "full").each(function(cell, x) {
                    var colspan = cell.colspan;
                    sheet.cell(x + offset.x, y + offset.y).setText(cell.innerHTML).setColspan(colspan).setStyle(styleTimeHeader);
                    //startX += colspan;
                });
            });

            // resources
            DayPilot.list(calendar.rowlist).each(function(row, y) {
                var offset = {
                    "x": 0,
                    "y": 1  // corner is merged
                };
                var prefix = "";
                for (var i = 0; i < row.level; i++) {
                    prefix += "  ";
                }
                sheet.cell(offset.x, y + offset.y).setText(prefix + row.html).setRowspan(row.lines.length).setStyle(styleRowHeader);
            });

            // events
            var offset = {
                "x": 0,
                "y": calendar.timeHeader.length  // corner is merged
            };
            var offsetY = offset.y;
            DayPilot.list(calendar.rowlist).each(function(row, y) {
                DayPilot.list(row.lines).each(function(line, i) {
                    var offsetX = offset.x;
                    DayPilot.list(line).each(function(e) {
                        var start = calendar._getItlineCellFromTime(e.start()).i;
                        var end = calendar._getItlineCellFromTime(e.end()).i;
                        var colspan = 1 + end - start;

                        sheet.cell(start + offsetX, y + offsetY).setText(e.client.html()).setColspan(colspan).setStyle(styleEvent);

                        offsetX += colspan - 1;
                    });
                });
                offsetY += row.lines.length - 1;
            });

            return excel;
        };

        img._options = null;
        img._mode = null;

        // ff, ch, ie 9+
        img.generate = function(format, options) {

            if (typeof format === "object") {
                options = format;
                format = null;
            }

            var options = options || {};
            var format = format || options.format || "svg";
            var scale = options.scale || 1;

            if (format === "xls") {
                return img.excelBoard();
            }

            /*if (format === "config") {
                return
            }*/

            // backwards compatibility
            if (format.toLowerCase() === "jpg") {
                format = "jpeg";
            }

            var mode = options.area || "viewport";
            img._options = options;
            img._mode = mode;

            // make sure event positions are calculated
            img.getRows().each(function(row) {
                calendar._updateEventPositionsInRow(row);
            });

            var width = img.getWidth();
            var height = img.getHeight();

            var board;
            switch (format.toLowerCase()) {
                case "svg":
                    board = new DayPilot.Svg(width, height);
                    break;
                case "png":
                    board = new DayPilot.Canvas(width, height, "image/png", scale);
                    break;
                case "jpeg":
                    board = new DayPilot.Canvas(width, height, "image/jpeg", scale, options.quality);
                    break;
                default:
                    throw "Export format not supported: " + format;
            }

            var rectangles = img.getRectangles();
            var images = img.getImages();

            var backColor = new DayPilot.StyleReader(calendar.nav.top).get("background-color");

            var cornerBackground = new DayPilot.StyleReader(calendar.nav.corner).get("background-color");
            var borderColor = new DayPilot.StyleReader(calendar.nav.top).get("border-top-color");
            var dividerColor = new DayPilot.StyleReader(calendar.nav.divider).get("background-color");

            // event
            // TODO requires at least one event to be rendered
            var divSampleEvent = DayPilot.list(calendar.elements.events).map(function(item) {return item.firstChild;}).last();
            var eventBorderColor = new DayPilot.StyleReader(divSampleEvent).get("border-right-color");
            var eventFont = img.getFont(divSampleEvent);
            var eventColor = new DayPilot.StyleReader(divSampleEvent).get("color");
            var eventBackColor = new DayPilot.StyleReader(divSampleEvent).get("background-color");
            eventBackColor = DayPilot.Util.isTransparentColor(eventBackColor) ? "white" : eventBackColor;

            // duration bar
            var bar = img.fakeDurationBar();
            var eventBarBackColor = new DayPilot.StyleReader(bar.firstChild).get("background-color");
            var eventBarColor = new DayPilot.StyleReader(bar.firstChild.firstChild).get("background-color");
            DayPilot.de(bar);

            // grid cell
            // rendered progressively
            var cell = img.fakeCell();
            var nonBusinessBackColor = new DayPilot.StyleReader(cell).get("background-color");
            DayPilot.Util.addClass(cell, calendar._prefixCssClass("_cell_business"));
            var businessBackColor = new DayPilot.StyleReader(cell).get("background-color");
            var cellFont = img.getFont(cell);
            var cellColor = new DayPilot.StyleReader(cell).get("color");
            DayPilot.de(cell);

            var firstLine = DayPilot.Util.firstPropValue(calendar._cache.linesVertical);
            var gridLineColor = new DayPilot.StyleReader(firstLine).get("background-color");

            /// time header
            // it's always rendered in full, use the real object
            var timeHeader = calendar._cache.timeHeader["0_0"];
            var timeHeaderFont = img.getFont(timeHeader);
            var timeHeaderColor = new DayPilot.StyleReader(timeHeader).get("color");
            var timeHeaderBackground = new DayPilot.StyleReader(timeHeader).get("background-color");
            // var timeHeaderBackground = new DayPilot.StyleReader(timeHeader).get("background");

            // row header
            // rendered progressively
            var rowHeader = img.fakeRowHeader();
            var rowHeaderFont = img.getFont(rowHeader);
            var rowHeaderColor = new DayPilot.StyleReader(rowHeader).get("color");
            var rowHeaderBackground = new DayPilot.StyleReader(rowHeader).get("background-color");
            DayPilot.de(rowHeader);

            // row header cols
            if (calendar.rowHeaderColumns && calendar._splitter && calendar._splitter.blocks[0]) {
                var rowHeaderCol = calendar._splitter.blocks[0].section.firstChild;
                var rowHeaderColFont = new DayPilot.StyleReader(rowHeaderCol).getFont();
                var rowHeaderColColor = new DayPilot.StyleReader(rowHeaderCol).get("color");
            }

            var viewportOffsetStart = img.getViewportOffsetStart();
            var viewportOffsetTop = img.getViewportOffsetTop();

            board.fillRect(rectangles.main, "white");
            board.fillRect(rectangles.main, backColor);
            board.fillRect(rectangles.corner, cornerBackground);

            // row header columns
            var colLeft = rectangles.corner.x;
            DayPilot.list(calendar.rowHeaderColumns).each(function(col, i) {
                var width = calendar.rowHeaderCols[i];
                var rect = {};
                rect.x = colLeft;
                rect.w = width + 1;
                rect.y = rectangles.corner.h - calendar._splitter.height;
                rect.h = calendar._splitter.height + 1;

                var padding = 3;
                var rectText = DayPilot.Util.copyProps(rect);
                rectText.x += padding;
                rectText.w -= padding;

                var text = col.name || col.title || "";

                board.text(rectText, text, rowHeaderColFont, rowHeaderColColor);
                board.rect(rect, borderColor);

                colLeft += width;
            });

            var beforeTimeHeaderExport = typeof calendar.onBeforeTimeHeaderExport === "function";

            // time header
            DayPilot.list(calendar.timeHeader).each(function(item, y) {
                img.getTimeHeader(y, mode).each(function(cell) {
                    var left = rectangles.grid.x + cell.left - viewportOffsetStart;
                    var width = cell.width;

                    var headerDim = dim.timeHeader(y);
                    var top = headerDim.top;
                    var height = headerDim.height;
                    /*
                    var top = y * calendar.headerHeight;
                    var height = calendar.headerHeight;
                    */

                    var text = cell.innerHTML;
                    var backColor = cell.backColor;
                    if (beforeTimeHeaderExport) {
                        var args = {};
                        args.header = {};
                        args.header.start = cell.start;
                        args.header.end = cell.end;
                        args.header.level = y;
                        args.header.text = cell.text;
                        args.header.html = cell.innerHTML;
                        args.text = cell.innerHTML;
                        args.backColor = cell.backColor;
                        calendar.onBeforeTimeHeaderExport(args);
                        text = args.text;
                        backColor = args.backColor;
                    }


                    var shiftX = Math.max(0, rectangles.grid.x - left);
                    left += shiftX;
                    width -= shiftX;

                    var shiftX = Math.max(0, left + width - (rectangles.grid.x + rectangles.grid.w));
                    width -= shiftX;

                    var cellRect = {"x": left, "y": top, "w": width + 1, "h": height + 1};

                    backColor = backColor || timeHeaderBackground;

                    board.fillRect(cellRect, backColor);
                    board.rect(cellRect, borderColor);
                    board.text(cellRect, text, timeHeaderFont, timeHeaderColor, "center");
                });
            });

            // matrix vertical
            img.getTimeline().each(function(cell) {
                var left = rectangles.grid.x + cell.left - viewportOffsetStart;

                var shiftX = Math.max(0, rectangles.grid.x - left);
                left += shiftX;

                if (left === rectangles.grid.x) {
                    return;
                }

                board.line(left, rectangles.grid.y + 1, left, rectangles.grid.y + rectangles.grid.h - 2, gridLineColor);

            });

            var beforeCellExport = typeof calendar.onBeforeCellExport === "function";

            // cells
            img.getRows().each(function(row, y, rows) {
                // var y = rows.offset + y;
                var y = row.index;
                img.getTimeline().each(function(cell, x, timeline) {
                    var x = timeline.offset + x;
                    var props = calendar._getCellProperties(x, y);
                    var business = props.business;

                    var args = calendar._doBeforeCellRender(x, y);

                    // customizable
                    var text = props.html;
                    var halign = props.horizontalAlignment || "left";
                    var backColor = props.backColor || (business ? businessBackColor : nonBusinessBackColor);

                    if (beforeCellExport) {

                        if (!args) {  // reuse the args if available
                            args = {};
                            args.cell = calendar.cells.findXy(x, y)[0];
                        }
                        args.text = text;
                        args.horizontalAlignment = halign;
                        args.backColor = backColor;

                        calendar.onBeforeCellExport(args);

                        text = args.text;
                        halign = args.horizontalAlignment;
                        backColor = args.backColor;

                    }

                    var top = rectangles.grid.y + row.top - viewportOffsetTop;
                    var shiftY = Math.max(0, rectangles.grid.y - top);
                    top += shiftY;

                    var left = rectangles.grid.x + cell.left - viewportOffsetStart;
                    var shiftX = Math.max(0, rectangles.grid.x - left);
                    left += shiftX;


                    var rect = {"x": left, "y": top, "w": cell.width, "h":row.height};
                    board.fillRect(rect, backColor);

                    var textRect = {};
                    textRect.x = rect.x + 1;
                    textRect.y = rect.y + 1;
                    textRect.w = rect.w - 2;
                    textRect.h = rect.h - 2;

                    if (text) {
                        board.text(textRect, text, cellFont, cellColor, halign);
                    }

                });
            });

            // matrix horizontal
            img.getRows().each(function(row) {
                var top = rectangles.grid.y + row.top - viewportOffsetTop;
                var shiftY = Math.max(0, rectangles.grid.y - top);
                top += shiftY;

                if (top === rectangles.grid.y) {
                    return;
                }

                board.line(rectangles.gridContent.x + 1, top, rectangles.gridContent.x + rectangles.gridContent.w - 1, top, gridLineColor);
            });

            var beforeRowHeaderRender = typeof calendar.onBeforeRowHeaderRender === "function";
            var beforeRowHeaderExport = typeof calendar.onBeforeRowHeaderExport === "function";

            // row headers
            img.getRows().each(function(row) {
                var top = rectangles.grid.y + row.top - viewportOffsetTop;
                var shiftY = Math.max(0, rectangles.grid.y - top);
                top += shiftY;

                var showTreeIcon = calendar.treeEnabled && !row.isNewRow;

                var imageWidth = 10;
                var left = showTreeIcon ? row.level * calendar.treeIndent + calendar.treeImageMarginLeft : 3;

                var rect = {"x": 0, "y": top, "w": rectangles.grid.x + 1, "h": row.height + 1};
                //var text = row.html;

                var props = row;
                if (beforeRowHeaderRender) {
                    var brhra = calendar._doBeforeRowHeaderRender(row);
                    props = brhra.row;
                }

                var args = {};
                args.text = props.html;
                args.backColor = props.backColor || rowHeaderBackground;
                args.fontSize = rowHeaderFont.size;
                args.fontFamily = rowHeaderFont.family;
                args.fontStyle = rowHeaderFont.style;
                args.fontColor = props.fontColor || rowHeaderColor;
                args.borderColor = borderColor;
                args.horizontalAlignment = "left";

                args.row = calendar._createRowObject(row);
                args.row.columns = [];

                props.columns.forEach(function(c) {
                    var column = DayPilot.Util.copyProps(c, {}, ["html", "backColor", "horizontalAlignment"]);
                    column.text = c.html;
                    column.fontSize = args.fontSize;
                    column.fontFamily = args.fontFamily;
                    column.fontStyle = args.fontStyle;
                    column.fontColor = args.fontColor;
                    column.horizontalAlignment = column.horizontalAlignment || args.horizontalAlignment;
                    column.backColor = column.backColor || args.backColor;

                    args.row.columns.push(column);
                });

                if (row.isNewRow) {
                    args.text = calendar.rowCreateHtml;
                }

                if (beforeRowHeaderExport) {
                    calendar.onBeforeRowHeaderExport(args);
                }

                var rectImage = {"x": left, "y": top + calendar.treeImageMarginTop, "w": 10, "h": 10};
                var leftText = showTreeIcon ? left + imageWidth + 3 : left;
                var widthText = showTreeIcon ? rect.w - leftText : rect.w;
                var rectText = {"x": leftText, "y": top, "w": widthText, "h": row.height + 1};

                if (calendar.rowHeaderCols) {
                    rectText.w = calendar.rowHeaderCols[0] - leftText;
                }

                board.fillRect(rect, args.backColor);
                board.text(rectText, args.text, {"size": args.fontSize, "family": args.fontFamily, "style": args.fontStyle}, args.fontColor, args.horizontalAlignment);
                board.rect(rect, args.borderColor);

                if (showTreeIcon) {
                    var image = null;
                    if (DayPilot.list(row.children).isEmpty()) {
                        image = images.nochildren;
                    }
                    else if (row.expanded) {
                        image = images.collapse;
                    }
                    else {
                        image = images.expand;
                    }
                    board.image(rectImage, image);
                }


                // row header columns
                if (calendar.rowHeaderCols) {
                    var left = rect.x;

                    DayPilot.list(calendar.rowHeaderCols).each(function(w, i) {
                        var skip = (i === 0);

                        if (!skip) {
                            var col = args.row.columns[i - 1] || {};
                            var cellRect = DayPilot.Util.copyProps(rect);
                            cellRect.x = left;
                            cellRect.w = w + 1;

                            var padding = 3;
                            var cellTextRect = DayPilot.Util.copyProps(cellRect);
                            cellTextRect.x += padding;
                            cellTextRect.w -= padding;

                            // var text = col.text;
                            var backColor = col.backColor || args.backColor;

                            board.fillRect(cellRect, backColor);
                            if (col.text) {
                                board.text(cellTextRect, col.text, {"size": col.fontSize, "family": col.fontFamily, "style": col.fontStyle}, col.fontColor, col.horizontalAlignment);
                            }
                            board.rect(cellRect, args.borderColor);

                        }

                        left += w;
                    });
                }

            });

            // events
            img.getEvents().each(function(e) {

                //var e = div.event;
                var rowTop = calendar.rowlist[e.part.dayIndex].top;
                var width = e.part.width;
                var barWidth = e.part.barWidth;
                var barVisible = e.client && e.client.barVisible && e.client.barVisible();

                var top = rectangles.grid.y + rowTop + e.part.top - viewportOffsetTop;
                var shiftY = Math.max(0, rectangles.grid.y - top);
                top += shiftY;

                var left = rectangles.grid.x + e.part.left - viewportOffsetStart;
                var shiftX = Math.max(0, rectangles.grid.x - left);
                left += shiftX;
                width -= shiftX;
                barWidth -= shiftX;

                //barWidth = Math.max(0, barWidth);

                var cache = e.cache || e.data;

                var barColor = cache.barColor || eventBarColor;
                var barBackColor = cache.barBackColor || eventBarBackColor;
                var backColor = cache.backColor || eventBackColor;
                var fontColor = cache.fontColor || eventColor;

                var barHeight = 5;
                var paddingLeft = 2;
                var textPadding = 2;

                var args = {};
                args.e = e;
                args.text = e.text ? e.text() : e.client.html();
                args.fontSize = eventFont.size;
                args.fontFamily = eventFont.family;
                args.fontStyle = eventFont.style;
                args.fontColor = fontColor;
                args.backColor = backColor;
                args.borderColor = eventBorderColor;
                args.horizontalAlignment = "left";
                args.barHeight = barHeight;
                args.textPadding = textPadding;

                if (typeof calendar.onBeforeEventExport === "function") {
                    calendar.onBeforeEventExport(args);
                }

                var rect = {"x": left, "y": top, "w": width, "h": e.part.height};
                var barBackRect = {"x": left, "y": top, "w": width, "h": args.barHeight};
                var barRect = {"x": left + e.part.barLeft, "y": top, "w": barWidth, "h": args.barHeight};
                var rectInner = {"x": left + paddingLeft, "y": top + args.barHeight, "w": width - paddingLeft, "h": e.part.height - args.barHeight};
                board.fillRect(rect, args.backColor);
                board.text(rect, args.text, {"size": args.fontSize, "family": args.fontFamily, "style": args.fontStyle} , args.fontColor, args.horizontalAlignment, args.textPadding);
                board.rect(rect, args.borderColor);

                if (barVisible) {
                    board.fillRect(barBackRect, barBackColor);
                    if (barWidth > 0) {
                        board.fillRect(barRect, barColor);
                    }
                }

                DayPilot.list(cache.areas).each(function(area) {

                    var visibility = area.visibility || area.v;
                    if (visibility === "Hover") {
                        return;
                    }

                    var areaLeft = area.left;
                    if (area.start) {
                        areaLeft = calendar.getPixels(new DayPilot.Date(area.start)).left - e.part.left;
                    }

                    var width = area.width || area.w;
                    if (area.right) {
                        width = (e.part.width - area.right) - areaLeft;
                    }
                    else if (area.end) {
                        width = calendar.getPixels(new DayPilot.Date(area.end)).left - area.left - e.part.left + 1;
                    }
                    var areaTop = area.top;
                    var height = area.height || area.h;
                    if (typeof area.bottom === "number") {
                        height = (e.part.height - area.bottom) - areaTop;
                    }

                    var rect = {"x": left + areaLeft, "y": top + areaTop, "w": width, "h": height};

                    if (area.backColor) {
                        board.fillRect(rect, area.backColor);
                    }
                    if (area.image) {
                        var img = new Image();
                        img.src = area.image;
                        board.image(rect, img);
                    }
                    else if (area.html) {
                        board.text(rect, area.html, { "size": area.fontSize || args.fontSize, "family": area.fontFamily || args.fontFamily, "style": area.fontStyle || args.fontStyle} , area.fontColor || args.fontColor, null, area.padding);
                    }

                });


            });

            board.rect(rectangles.main, borderColor);
            board.line(rectangles.grid.x, 0, rectangles.grid.x, rectangles.main.h, dividerColor);
            board.line(0, rectangles.grid.y, rectangles.main.w, rectangles.grid.y, dividerColor);

            return board;

        };

        this._joint = {};
        var joint = this._joint;
        joint.findJointDivs = function (e) {
            var id = e.data.join;
            if (!id) {
                return DayPilot.list();
            }
            var divs = DayPilot.list(calendar.elements.events).filter(function(item) {
                return item.event.data.join === id && item.event !== e;
            });
            return divs;
        };

        this._multiresize = {};
        var mre = this._multiresize;
        mre.divs = [];
        mre.list = [];
        mre.forbidden = false;

        mre.additional = function() {
            var list = DayPilot.list();

            var draggingSelected = calendar.multiselect.isSelected(DayPilotScheduler.resizing.event);
            var enabled = calendar.allowMultiResize;

            var list = DayPilot.list();

            if (draggingSelected && enabled) {
                list = DayPilot.list(calendar.multiselect._divs).filter(function(item) {
                    //return item !== DayPilotScheduler.resizing && item !== moving.moving;
                    return item !== DayPilotScheduler.resizing;
                });
            }

            if (calendar.jointEventsResize) {
                var j = joint.findJointDivs(DayPilotScheduler.resizingEvent);
                list = list.concat(j);
            }

            return list;
        };

        mre.update = function() {
            mre.clear();
            mre.draw();
        };

        mre.clear = function() {
            DayPilot.de(mre.divs);
            mre.divs = [];
        };

        mre.draw = function() {

            if (!DayPilotScheduler.resizing) {
                return;
            }
            var e = DayPilotScheduler.resizingEvent;
            var shadow = DayPilotScheduler.resizingShadow;
            var startOffset = shadow.start.getTime() - e.start().getTime();
            var endOffset = shadow.end.getTime() - e.end().getTime();

            var rowoffset = 0;

            mre.list = [];
            mre.forbidden = false;
            mre.invalid = false;
            mre.rowoffset = rowoffset;

            mre.additional().each(function(item) {
                if (!item.event) {
                    return;
                }
                var event = item.event;
                var row = calendar.rowlist[event.part.dayIndex + rowoffset];
                if (!row) {  // don't draw it, it's out of the grid
                    mre.invalid = true;
                    return;
                }
                var top = event.part.top + row.top;
                var height = event.part.height;

                if (rowoffset) {
                    top = row.top;
                    height = row.height;
                }

                var adjustedStart = event.start().addTime(startOffset);
                var adjustedEnd = event.end().addTime(endOffset);

                var info = {};
                info.event = event;
                info.start = adjustedStart;
                info.end = adjustedEnd;
                //info.resource = row.id;
                info.overlapping = false;
                mre.list.push(info);

                var startPixels = calendar.getPixels(adjustedStart);
                var endPixels = calendar.getPixels(adjustedEnd);

                // TODO wrong, use adjustedStart, adjustedEnd
                var duration = DayPilot.DateUtil.diff(event.rawend(), event.start());
                duration = Math.max(duration, 1);

                var useBox = resolved.useBox(duration);

                var left = (useBox) ? startPixels.boxLeft : startPixels.left;
                var width = (useBox) ? (endPixels.boxRight - left) : (endPixels.left - left);

                var div = document.createElement("div");
                div.style.position = "absolute";
                div.style.left = left + "px";
                div.style.top = top + "px";
                div.style.height = height + "px";
                div.style.width = width + "px";
                div.style.zIndex = 101;
                div.style.overflow = "hidden";
                div.className = calendar._prefixCssClass("_shadow");
                //div.event = event;
                div.info = info;// store for overlap checking

                var inner = document.createElement("div");
                inner.className = calendar._prefixCssClass("_shadow_inner");
                div.appendChild(inner);

                calendar._maind.appendChild(div);
                mre.divs.push(div);

            });

            if (mre.invalid) {
                var cssClass = calendar._prefixCssClass("_shadow_overlap");
                DayPilot.list(mre.divs).each(function(item) {
                    DayPilot.Util.addClass(item, cssClass);
                });
                return;
            }

            // overlap checking must be separate, after all items are rendered
            DayPilot.list(mre.divs).each(function(item) {
                if (!item.info) {
                    return;
                }

                var div = item;
                var info = item.info;
                var event = item.info.event;
                var row = calendar.rowlist[event.part.dayIndex + rowoffset];


                var startPixels = calendar.getPixels(info.start);
                var endPixels = calendar.getPixels(info.end);

                var left = startPixels.left;
                var width = endPixels.left - left;

                var except = DayPilot.list(mre.list).map(function(item) { return item.event.data; }).add(DayPilotScheduler.resizing.event.data);
                calendar._overlappingShadow(div, row, left, width, except);
                calendar._checkDisabledCells(div, info.start, info.end, info.resource);

                if (div.overlapping) {
                    info.overlapping = true;
                    mre.forbidden = true;
                }

            });

        };

        this._config = {};
        var config = this._config;

        config.modifiedProps = function() {
            var clean = new DayPilot.Scheduler();

            var members = DayPilot.Util.members(calendar, 2);

            var result = [];

            result.push("<div id='dp'></div>");
            result.push("<script>");
            result.push("var dp = new DayPilot.Scheduler('dp');");

            members.properties.each(function(item) {
                var name = item.name;

                var path = name.split(".");
                var isPath = path.length > 1;

                var ref, instance;

                if (isPath) {
                    var path0 = path[0];
                    var path1 = path[1];
                    ref = JSON.stringify(clean[path0][path1]);
                    instance = JSON.stringify(calendar[path0][path1]);
                }
                else {
                    ref = JSON.stringify(clean[name]);
                    instance = JSON.stringify(calendar[name]);
                }

                if (ref !== instance) {
                    result.push("dp." + name + " = " + instance + ";");
                }
            });

            members.events.each(function(item) {
                var name = item.name;

                if (typeof calendar[name] === "function") {
                    result.push("dp." + name + " = " + calendar[name].toString() + ";");
                }
            });

            result.push("dp.init();");
            result.push("</script>");

            return result.join("\n");

        };

        this._multimove = {};
        var mm = this._multimove;
        mm.divs = [];
        mm.list = [];
        mm.forbidden = false;
        mm.verticalAll = function() {
            return calendar.multiMoveVerticalMode === "All";
        };

        mm.additional = function() {
            var list = DayPilot.list();

            var draggingSelected = calendar.multiselect.isSelected(DayPilotScheduler.movingEvent);
            var enabled = calendar.allowMultiMove;

            var list = DayPilot.list();

            if (draggingSelected && enabled) {
                list = DayPilot.list(calendar.multiselect._divs).filter(function(item) {
                     return item !== DayPilotScheduler.moving && item !== moving.moving;
                });
            }

            if (calendar.jointEventsMove) {
                var j = joint.findJointDivs(DayPilotScheduler.movingEvent);
                list = list.concat(j);
            }

            return list;
        };

        mm.update = function() {
            mm.clear();
            mm.draw();
        };

        mm.draw = function() {
            if (!DayPilotScheduler.moving) {
                return;
            }
            var e = DayPilotScheduler.movingEvent;
            var start = DayPilotScheduler.movingShadow.start;
            //var end = DayPilotScheduler.movingShadow.end;
            var offset = start.getTime() - e.start().getTime();

            var originalRow = e.part.dayIndex;
            var newRow = DayPilot.indexOf(calendar.rowlist, DayPilotScheduler.movingShadow.row);
            var rowoffset = newRow - originalRow;
            if (!mm.verticalAll()) {
                rowoffset = 0;
            }

            mm.list = [];
            mm.forbidden = false;
            mm.invalid = false;
            mm.rowoffset = rowoffset;

            mm.additional().each(function(item) {
                if (!item.event) {
                    return;
                }
                var event = item.event;
                var row = calendar.rowlist[event.part.dayIndex + rowoffset];
                if (!row) {  // don't draw it, it's out of the grid
                    mm.invalid = true;
                    return;
                }
                var top = event.part.top + row.top;
                var height = event.part.height;

                if (rowoffset) {
                    top = row.top;
                    height = row.height;
                }

                var adjustedStart = event.start().addTime(offset);
                var adjustedEnd = event.end().addTime(offset);

                var info = {};
                info.event = event;
                info.start = adjustedStart;
                info.end = adjustedEnd;
                info.resource = row.id;
                info.overlapping = false;
                mm.list.push(info);

                var startPixels = calendar.getPixels(adjustedStart);
                var endPixels = calendar.getPixels(adjustedEnd);

                var duration = DayPilot.DateUtil.diff(event.rawend(), event.start());
                duration = Math.max(duration, 1);

                var useBox = resolved.useBox(duration);

                var left = (useBox) ? startPixels.boxLeft : startPixels.left;
                var width = (useBox) ? (endPixels.boxRight - left) : (endPixels.left - left);

                var div = document.createElement("div");
                div.style.position = "absolute";
                div.style.left = left + "px";
                div.style.top = top + "px";
                div.style.height = height + "px";
                div.style.width = width + "px";
                div.style.zIndex = 101;
                div.style.overflow = "hidden";
                div.className = calendar._prefixCssClass("_shadow");
                //div.event = event;
                div.info = info;// store for overlap checking

                var inner = document.createElement("div");
                inner.className = calendar._prefixCssClass("_shadow_inner");
                div.appendChild(inner);

                calendar._maind.appendChild(div);
                mm.divs.push(div);

            });

            if (mm.invalid) {
                var cssClass = calendar._prefixCssClass("_shadow_overlap");
                DayPilot.list(mm.divs).each(function(item) {
                    DayPilot.Util.addClass(item, cssClass);
                });
                return;
            }

            // overlap checking must be separate, after all items are rendered
            DayPilot.list(mm.divs).each(function(item) {
                if (!item.info) {
                    return;
                }

                var div = item;
                var info = item.info;
                var event = item.info.event;
                var row = calendar.rowlist[event.part.dayIndex + rowoffset];

                /*
                // should never happen, checked above
                if (!row) {
                    mm.forbidden = true;
                    return;
                }
                */

                var startPixels = calendar.getPixels(info.start);
                var endPixels = calendar.getPixels(info.end);

                var left = startPixels.left;
                var width = endPixels.left - left;

                var except = DayPilot.list(mm.list).map(function(item) { return item.event.data; }).add(DayPilotScheduler.movingEvent.data);
                calendar._overlappingShadow(div, row, left, width, except);
                calendar._checkDisabledCells(div, info.start, info.end, info.resource);

                if (div.overlapping) {
                    info.overlapping = true;
                    mm.forbidden = true;
                }

            });

        };

        mm.clear = function() {
            DayPilot.de(mm.divs);
            mm.divs = [];
        };

        this._resizeShadow = function() {
            //var mousePos = DayPilotScheduler.resizing.mousePos;
            var coords = calendar.coords;

            var border = DayPilotScheduler.resizing.dpBorder;

            var e = DayPilotScheduler.resizing.event;

            var refX = e.part.left; // using x relative to maind
            if (border == "right") {
                refX += e.part.width;
            }

            var _step = DayPilotScheduler.resizing.event.calendar.cellWidth;
            var originalWidth = DayPilotScheduler.resizing.event.part.width;
            var originalLeft = DayPilotScheduler.resizing.event.part.left;
            var _startOffset = 0;
            var delta = (coords.x - refX);

            var newLeft, newWidth;

            if (border === 'right') {
                newLeft = originalLeft;
                if (calendar.snapToGrid) {
                    //newWidth = Math.ceil(((originalWidth + originalLeft + delta)) / _step) * _step - originalLeft;
                    var itc =  calendar._getItlineCellFromPixels(originalWidth + originalLeft + delta).cell;
                    var newRight = itc.left + itc.width;
                    newWidth = newRight - originalLeft;

                    if (newWidth < _step) {
                        newWidth = _step;
                    }

                }
                else {
                    newWidth = originalWidth + delta;
                }

                var max = calendar._getGridWidth();

                if (originalLeft + newWidth > max) {
                    newWidth = max - originalLeft;
                }

                //DayPilotScheduler.resizingShadow.style.width = (newWidth) + 'px';
                DayPilotScheduler.resizingShadow.left = originalLeft;
                DayPilotScheduler.resizingShadow.width = newWidth;
            }
            else if (border === 'left') {
                if (calendar.snapToGrid) {
                    if (delta >= originalWidth) {
                        delta = originalWidth;
                    }
                    newLeft = Math.floor(((originalLeft + delta) + 0) / _step) * _step;
                    if (newLeft < _startOffset) {
                        newLeft = _startOffset;
                    }
                }
                else {
                    newLeft = originalLeft + delta;
                }

                newWidth = originalWidth - (newLeft - originalLeft);
                var right = originalLeft + originalWidth;

                var min = _step;

                if (!calendar.snapToGrid) {
                    min = 1;
                }
                else if (calendar.useEventBoxes === "Never") {
                    if (originalWidth < _step) {
                        min = originalWidth;
                    }
                    else {
                        min = 1;
                    }
                }

                if (newWidth < min) {
                    newWidth = min;
                    newLeft = right - newWidth;
                }

                // DayPilotScheduler.resizingShadow.style.left = newLeft + 'px';
                // DayPilotScheduler.resizingShadow.style.width = (newWidth) + 'px';
                DayPilotScheduler.resizingShadow.left = newLeft;
                DayPilotScheduler.resizingShadow.width = newWidth;
            }
            else {
                throw "Invalid dpBorder.";
            }


            (function checkOverlap() {
                DayPilotScheduler.resizingShadow.overlapping = false;

                var ev = DayPilotScheduler.resizing.event;
                var row = calendar.rowlist[ev.part.dayIndex];
                //var shadow = DayPilotScheduler.resizingShadow;
                var left = newLeft;
                var width = newWidth;

                calendar._overlappingShadow(DayPilotScheduler.resizingShadow, row, left, width, ev.data);

                var shadow = DayPilotScheduler.resizingShadow;
                var position = {
                    "start": shadow.start,
                    "end": calendar._adjustEndOut(shadow.end)
                };
                calendar._checkDisabledCells(DayPilotScheduler.resizingShadow, position.start, position.end, row.id);
            })();

            calendar._doEventResizing();

        };

        this._moveShadow = function() {

            var scroll = this.nav.scroll;
            if (!calendar.coords) {
                return;
            }

            if (!DayPilotScheduler.movingEvent) {
                return;
            }

            calendar._hideMessageNow();

            var shadow = DayPilotScheduler.movingShadow;
            var coords = this._getShadowCoords(DayPilotScheduler.movingEvent);

            if (calendar._isRowDisabled(coords.rowIndex)) {
                return;
            }

            var ev = DayPilotScheduler.movingEvent;

            var linepos = 0;
            var relY = 0;
            (function calculatePosition() {

                if (calendar._cellStacking) {
                    var y = coords.relativeY;
                    var colindex = calendar._getItlineCellFromPixels(coords.left).x;
                    var row = coords.row;
                    var column = row.evColumns[colindex];
                    var e = column.events.find(function(e)  {
                        //return e.part.top <= y && y < e.part.top + e.part.height + calendar.eventMarginBottom;
                        return y < e.part.top + e.part.height + calendar.eventMarginBottom;
                    });
                    if (!e) {  // after last one
                        e = column.events.last();
                    }
                    if (e) {
                        relY = e.part.top;
                        linepos = DayPilot.indexOf(column.events, e);
                        if ((y - e.part.top) > e.part.height /2) {
                            relY = e.part.top + e.part.height + calendar.eventMarginBottom/2;
                            linepos += 1;
                        }
                    }
                }
                else {
                    var y = coords.relativeY;
                    var row = coords.row;
                    var top = 0;
                    var lh = calendar._resolved.eventHeight();
                    var max = row.lines.length;
                    for (var i = 0; i < row.lines.length; i++) {
                        var line = row.lines[i];
                        if (line.isFree(coords.left, calendar.cellWidth)) {
                            max = i;
                            break;
                        }
                    }

                    var pos = Math.floor((y - top + lh / 2) / lh);  // rounded position
                    var pos = Math.min(max, pos);  // no more than max
                    var pos = Math.max(0, pos);  // no less then 0

                    linepos = pos;
                    relY = calendar.rowMarginTop + linepos * (calendar._resolved.eventHeight() + calendar.eventMarginBottom) + calendar.eventMarginBottom/2;
                }
            })();

            if (relY > 0) {
                relY -= 3;
            }

            var verticalAllowed = (ev.cache && typeof ev.cache.moveVDisabled !== 'undefined') ? !ev.cache.moveVDisabled : !ev.data.moveVDisabled;
            var horizontalAllowed = (ev.cache && typeof ev.cache.moveHDisabled !== 'undefined') ? !ev.cache.moveHDisabled :!ev.data.moveHDisabled;

            var multimove = !mm.additional().isEmpty();

            if (multimove && calendar.multiMoveVerticalMode === "Disabled") {
                verticalAllowed = false;
            }

            if (verticalAllowed) {
                if (!this._isRowDisabled(coords.rowIndex)) {
                    shadow.row = coords.row;
                    shadow.style.height = Math.max(coords.row.height, 0) + 'px';
                    shadow.style.top = (coords.top) + 'px';
                    if (calendar.eventMoveToPosition) {
                        shadow.style.top = (coords.top + relY) + "px";
                        shadow.style.height = "3px";
                        shadow.line = linepos;
                    }
                }
                else {
                    var oldRow = shadow.row;
                    var dir = 1;
                    if (oldRow) {
                        dir = coords.rowIndex < oldRow.index ? 1 : -1;
                    }
                    else {
                        //oldRow = { "index": 0};
                        return;
                    }

                    for (var i = coords.rowIndex; i !== oldRow.index; i += dir) {
                        var row = this.rowlist[i];
                        if (!this._isRowDisabled(i) && !row.hidden) {
                            shadow.style.top = (row.top) + 'px';
                            shadow.style.height = Math.max(row.height, 0) + 'px';
                            shadow.row = row;

                            if (calendar.eventMoveToPosition) {
                                linepos = dir > 0 ? 0 : row.lines.length - 1;
                                shadow.style.top = (coords.top + relY) + "px";
                                shadow.style.height = "3px";
                                shadow.line = linepos;
                            }

                            break;
                        }
                    }
                }
            }
            else {
                var oldRow = calendar.rowlist[ev.part.dayIndex];
                //var oldRow = this.rowlist[this._getRow(parseInt(shadow.style.top)).i];

                var max = oldRow.lines.length;
                for (var i = 0; i < oldRow.lines.length; i++) {
                    var line = oldRow.lines[i];
                    if (line.isFree(coords.left, calendar.cellWidth)) {
                        max = i;
                        break;
                    }
                }

                if (!multimove) {
                    shadow.style.height = Math.max(oldRow.height, 0) + 'px';
                    shadow.style.top = (oldRow.top) + 'px';
                }
                shadow.row = oldRow;
                if (calendar.eventMoveToPosition && !multimove) {
                    if (coords.row === oldRow) {
                        shadow.style.top = (oldRow.top + relY) + "px";
                        shadow.style.height = "3px";
                        shadow.line = linepos;
                    }
                    else {
                        var pos = (coords.rowIndex > oldRow.index && max > 0) ? max * calendar._resolved.eventHeight() - 3 : 0;
                        shadow.style.top = (oldRow.top + pos) + "px";
                        shadow.style.height = "3px";
                        shadow.line = 0;
                    }
                }
            }

            if (horizontalAllowed) {
                shadow.style.left = coords.left + 'px';
                if (calendar.eventMoveToPosition) {
                    shadow.style.width = (calendar.cellWidth) + 'px';
                }
                else {
                    shadow.style.width = (coords.width) + 'px';
                }
                shadow.start = coords.start;
                shadow.end = coords.end;
            }
            else {
                shadow.style.left = ev.part.left + "px";
                shadow.start = ev.start();
                shadow.end = ev.rawend();

                coords.left = ev.part.left; // reset the value for overlap checking
            }


            (function checkOverlap() {
                shadow.overlapping = false;

                var row = shadow.row;
                var data = ev.data;
                var width = coords.width;
                var left = coords.left;

                var except = DayPilot.list(mm.list).map(function(item) {return item.event.data;}).add(data);
                calendar._overlappingShadow(shadow, row, left, width, except);

                calendar._checkDisabledCells(DayPilotScheduler.movingShadow, shadow.start, shadow.end, shadow.row.id);

                //calendar._overlappingShadow(shadow, row, left, width, data);
            })();


            /*
            (function findFreeSlot() {
                var except = DayPilot.list(mm.list).map(function(item) {return item.event.data;}).add(data);

            })();
            */


            (function() {

                var last = calendar._lastEventMoving;

                // don't fire the event if there is no change
                if (last && last.start.getTime() === shadow.start.getTime() && last.end.getTime() === shadow.end.getTime() && last.resource === shadow.row.id) {
                    return;
                }

                mm.update();

                var external = (DayPilotScheduler.drag ? true : false) && ev.part.external;

                var args = {};
                args.start = shadow.start;
                args.end = calendar._adjustEndOut(shadow.end);
                args.duration = new DayPilot.Duration(args.start, args.end);
                args.e = ev;
                args.external = external;
                //args.row = shadow.row;
                args.resource = shadow.row.id;
                args.html = null;
                args.row = calendar._createRowObject(shadow.row);
                args.position = shadow.line;
                args.overlapping = shadow.overlapping || mm.forbidden;
                args.allowed = true;
                args.left = {};
                args.left.html = args.start.toString(calendar.eventMovingStartEndFormat, resolved.locale());
                args.left.enabled = calendar.eventMovingStartEndEnabled;
                args.left.space = 5;
                args.left.width = null;
                args.right = {};
                args.right.html = args.end.toString(calendar.eventMovingStartEndFormat, resolved.locale());
                args.right.enabled = calendar.eventMovingStartEndEnabled;
                args.right.space = 5;
                args.right.width = null;
                args.multimove = DayPilot.list(mm.list);
                args.shift = calendar.coords.shift;
                args.ctrl = calendar.coords.ctrl;
                args.meta = calendar.coords.meta;
                args.alt = calendar.coords.alt;
                args.areaData = DayPilot.Global.movingAreaData;
                args.link = null;

                var info = {};
                info.event = ev;
                info.start = args.start;
                info.end = args.end;
                info.overlapping = args.overlapping;
                info.resource = args.resource;
                //info.overlapping = false;  // always false, this event is not fired if overlapping is forbidden
                args.multimove.splice(0, 0, info);

                calendar._lastEventMoving = args;

                var original = {
                    "start": args.start,
                    "end": args.end,
                    "resource": args.resource
                };

                if (typeof calendar.onEventMoving === 'function') {
                    calendar.onEventMoving(args);
                }

                shadow.allowed = args.allowed;

                if (args.start !== original.start || args.end !== original.end) {
                    // allow adjusting the start and end
                    var start = args.start;
                    var end = calendar._adjustEndIn(args.end);

                    shadow.start = start;
                    shadow.end = end;

                    var duration = DayPilot.DateUtil.diff(start, end);
                    duration = Math.max(duration, 1);

                    var useBox = resolved.useBox(duration);

                    var left = useBox ? calendar.getPixels(start).boxLeft : calendar.getPixels(start).left;
                    var right = useBox ? calendar.getPixels(end).boxRight : calendar.getPixels(end).left;
                    shadow.style.left = left + "px";
                    shadow.style.width = (right - left) + "px";
                }

                if (args.resource !== original.resource) {
                    var row = calendar._findRowByResourceId(args.resource);
                    if (row) {
                        shadow.row = row;
                        shadow.style.height = Math.max(row.height, 0) + 'px';
                        shadow.style.top = (row.top) + 'px';
                        if (calendar.eventMoveToPosition) {
                            shadow.style.top = (row.top + relY) + "px";
                            shadow.style.height = "3px";
                            shadow.line = linepos;
                        }
                    }
                }

                if (args.html) {
                    shadow.firstChild.innerHTML = args.html;
                }
                else {
                    shadow.firstChild.innerHTML = "";
                }

                calendar._disabledShadow(shadow, args);

                calendar._showShadowHover(DayPilotScheduler.movingShadow, args);

                if (args.link) {
                    /*var props = {
                        "color": "#ccc"
                    };*/
                    if (DayPilot.Global.movingLink) {
                        DayPilot.Global.movingLink.clear();
                    }

                    DayPilot.Global.movingLink = linktools.drawLink(args.link.from, shadow, args.link);
                }

            })();
        };

        this._overlappingShadow = function(shadow, row, left, width, data) {

            if (calendar.allowEventOverlap) {
                return;
            }

            (function calculate() {
                shadow.overlapping = false;
                for (var i = 0; i < row.lines.length; i++) {
                    var line = row.lines[i];
                    if (!line.isFree(left, width, data)) {
                        shadow.overlapping = true;
                        return;
                    }
                }

                if (!calendar.allowMultiRange) {
                    return;
                }

                var rowy = row.index;  // correct ?

                var overlaps = DayPilot.list(mr.list).some(function(item) {
                    var div = item.div;

                    var rleft = parseInt(div.style.left);
                    var rwidth = parseInt(div.style.width);
                    var ry = item.start.y;
                    if (shadow === div) {
                        return false;
                    }
                    if (ry !== rowy) {
                        return false;
                    }
                    return DayPilot.Util.overlaps(left, left + width, rleft, rleft + rwidth);
                });

                if (overlaps) {
                    shadow.overlapping = true;
                    return;
                }
            })();

            var overlapping = shadow.overlapping;

            var cssClass = calendar._prefixCssClass("_shadow_overlap");
            if (overlapping) {
                DayPilot.Util.addClass(shadow, cssClass);
            }
            else {
                DayPilot.Util.removeClass(shadow, cssClass);
            }
        };

        this._checkDisabledCells = function(shadow, start, end, resource) {

            var hasDisabled = (calendar.cellConfig && calendar.cellConfig.hasDisabled) || calendar._bcrCache._dirtyDisabled;
            if (!hasDisabled) {
                return;
            }

            var disabled = calendar._overDisabledCells(start, end, resource);

            // prevent clearing an already set value (event overlap)
            if (disabled) {
                shadow.overlapping = true;
            }


            var cssClass = calendar._prefixCssClass("_shadow_overlap");
            if (shadow.overlapping) {
                DayPilot.Util.addClass(shadow, cssClass);
            }
            else {
                DayPilot.Util.removeClass(shadow, cssClass);
            }

        };

        this._overDisabledCells = function(start, end, resource) {
            var cells = calendar.rows.find(resource).cells.forRange(start, end);
            if (!cells) {
                return false;
            }
            var disabled = cells.some(function(cell) {
                return cell.properties.disabled;
            });
            return disabled;
        };

        this._disabledShadow = function(shadow, args) {
            var cssClass = calendar._prefixCssClass("_shadow_forbidden");
            if (!args.allowed || mm.invalid) {
                DayPilot.Util.addClass(shadow, cssClass);
            }
            else {
                DayPilot.Util.removeClass(shadow, cssClass);
            }
        };
        
        this._showShadowHover = function(shadow, args) {
            
            /*
             * uses:
             * 
             * args.left.width (optional)
             * args.left.space
             * args.left.html
             * args.left.enabled
             * 
             * args.right.width (optional)
             * args.right.space
             * args.right.html
             * args.right.enabled
             * 
             */
            
            //var shadow = DayPilotScheduler.movingShadow;
            var space = 5;
            
            this._clearShadowHover();

            if (shadow.calendar !== calendar) {
                // touch moving between two schedulers
                return;
            }
            
            var pos = {};
            pos.left = parseInt(shadow.style.left);
            pos.top = parseInt(shadow.style.top);
            pos.right = pos.left + parseInt(shadow.style.width);
            
            var width = args.left.width || 10;
            
            var left = document.createElement("div");
            left.style.position = "absolute";
            left.style.left = (pos.left - width - args.left.space) + "px";
            left.style.top = pos.top + "px";
            left.style.height = calendar.eventHeight + "px";
            left.style.overflow = "hidden";
            left.style.boxSizing = "border-box";
            left.innerHTML = args.left.html;
            left.className = this._prefixCssClass("_event_move_left");
            left.onmousemove = calendar._onMaindMouseMove;

            if (args.left.enabled) {
                calendar.divHover.appendChild(left);

                if (args.left.width) {
                    left.style.width = width + "px";
                }
                else {
                    left.style.whiteSpace = "nowrap";
                    var nwidth = left.offsetWidth;
                    var nleft = pos.left - nwidth - args.left.space;
                    left.style.width = nwidth + "px";
                    left.style.left = nleft + "px";

                    var scrollPx = calendar.nav.scroll.scrollLeft;
                    if (nleft < scrollPx) {
                        calendar.divHover.removeChild(left);
                    }

                    var outleft = calendar._getTotalRowHeaderWidth() + (nleft - scrollPx);

                    if (outleft > 0) {
                        left.style.left = outleft + "px";
                        left.style.top = (pos.top - calendar.nav.scroll.scrollTop + calendar._getTotalHeaderHeight()) + "px";
                        calendar.nav.top.appendChild(left);
                        calendar.elements.hover.push(left);
                    }
                }
            }

            var width = args.right.width || 10;
            var right = document.createElement("div");
            right.style.position = "absolute";
            right.style.left = (pos.right + args.right.space) + "px";
            right.style.top = pos.top + "px";
            right.style.height = calendar.eventHeight + "px";
            right.style.overflow = "hidden";
            right.style.boxSizing = "border-box";
            if (args.right.width) {
                right.style.width = args.right.width + "px";
            }
            else {
                right.style.whiteSpace = "nowrap";
            }
            right.innerHTML = args.right.html;
            right.className = this._prefixCssClass("_event_move_right");
            right.onmousemove = calendar._onMaindMouseMove;
            
            if (args.right.enabled) {
                calendar.divHover.appendChild(right);
                var totalPx = calendar.nav.scroll.scrollWidth;
                var rightPx = pos.right + args.right.space + right.offsetWidth;
                if (rightPx >= totalPx) {
                    calendar.divHover.removeChild(right);
                }
            }

        };
        
        this._clearShadowHover = function() {
            calendar.divHover.innerHTML = ''; // clear
            DayPilot.de(calendar.elements.hover);
            calendar.elements.hover = [];
        };
        
        this._loadRowHeaderColumns = function() {
            var defaultWidth = calendar.rowHeaderColumnDefaultWidth;

            if (this.rowHeaderColumns) {
                this.rowHeaderCols = DayPilot.Util.propArray(this.rowHeaderColumns, "width", defaultWidth);
            }
            else {
                this.rowHeaderCols = null;
            }
        };

        this._getTotalRowHeaderWidth = function() {
            var totalWidth = 0;
            this._loadRowHeaderColumns();
            if (this.rowHeaderCols) {
                for (var i = 0; i < this.rowHeaderCols.length; i++) {
                    totalWidth += this.rowHeaderCols[i];
                }
            }
            else {
                totalWidth = this.rowHeaderWidth;
            }
            return totalWidth;
        };

        this._getAreaRowsWithMargin = function() {
            return this._getAreaRows(calendar.progressiveRowRenderingPreload);
        };

        this._getAreaRows = function(margin) {
            //var margin = calendar.progressiveRowRenderingPreload;
            var margin = margin || 0;

            var start = 0;
            var end = calendar.rowlist.length;
            var progressive = calendar.progressiveRowRendering;
            if (progressive) {
                var area = calendar._getDrawArea();
                start = area.yStart;
                end = area.yEnd + 1;

                start = Math.max(0, start - margin);
                end = Math.min(calendar.rowlist.length, end + margin);
            }

            return {
                "start": start,
                "end": end
            }
        };

        this._autoRowHeaderWidth = function() {
            if (!this._visible()) {   // not visible, doesn't make sense now
                return;
            }

            var needsUpdate = false;
            var maxAll = 0;


            if (this.rowHeaderWidthAutoFit) {
                var table = this.divHeader;

                if (!table) {
                    return;
                }

                if (!table.rows) {
                    return;
                }

                var max = [];

                var range = calendar._getAreaRowsWithMargin();

                for (var i = range.start; i < range.end; i++) {
                    var row = table.rows[i];

                    if (!row) {
                        continue;
                    }

                    if (row.hidden) {
                        continue;
                    }

                    if (row.autofitDone) {
                        continue;
                    }

                    row.autofitDone = true;

                    //var left = 0;
                    for (var j = 0; j < row.cells.length; j++) {
                        var inner = row.cells[j].firstChild.firstChild;
                        if (!inner || !inner.style) {
                            continue;
                        }
                        var oldWidth = inner.style.width;
                        var oldRight = inner.style.right;
                        inner.style.position = "absolute";
                        inner.style.width = "auto";
                        inner.style.right = "auto";
                        inner.style.whiteSpace = "nowrap";
                        var w = inner.offsetWidth + 2;
                        inner.style.position = "";
                        inner.style.width = oldWidth;
                        inner.style.right = oldRight;
                        inner.style.whiteSpace = "";
                        if (typeof max[j] === 'undefined') { max[j] = 0; }
                        max[j] = Math.max(max[j], w);
                    }
                }

                this._loadRowHeaderColumns();

                if (this.rowHeaderCols) {
                    for (var i = 0; i < max.length; i++) {
                        if (this.rowHeaderCols[i]) {
                            if (max[i] > this.rowHeaderCols[i]) {
                                this.rowHeaderCols[i] = max[i];
                                needsUpdate = true;
                            }
                            maxAll += this.rowHeaderCols[i];
                        }
                    }
                }
                else {
                    maxAll = this.rowHeaderWidth;
                    if (this.rowHeaderWidth < max[0] + calendar.rowHeaderWidthMarginRight) {
                        maxAll = max[0] + calendar.rowHeaderWidthMarginRight;
                        needsUpdate = true;
                    }
                }

            }

            if (needsUpdate) {
                if (this._splitter) {
                    // update header
                    this._splitter.widths = this.rowHeaderCols;
                    this._splitter.updateWidths();
                    // update cells
                    DayPilot.Util.updatePropsFromArray(this.rowHeaderColumns, "width", this.rowHeaderCols);
                }

                if (!this.rowHeaderScrolling) {
                    this.rowHeaderWidth = maxAll;
                }

                this._updateRowHeaderWidth();
                this._updateAutoCellWidth();
            }

        };

        this._drawResHeader = function() {

            this._resHeaderDivBased = true;

            //DayPilot.puc(parent);
            //parent.innerHTML = '';

            this._loadRowHeaderColumns();

            //var rowHeaderCols = this.rowHeaderCols;
            //var columns = rowHeaderCols ? this.rowHeaderCols.length : 0;
            var totalWidth = this._getTotalRowHeaderWidth();

            var wrap = this.divHeader;
            if (wrap) {
                if (DayPilot.browser.ie) {
                    for (var i = 0; i < wrap.childNodes.length; i++) {
                        DayPilot.de(wrap.childNodes[i]);
                    }
                }
                wrap.innerHTML = '';
                DayPilot.puc(wrap);
            }
            else {
                wrap = document.createElement("div");
                wrap.onmousemove = function() { calendar._out(); };
                this.divHeader = wrap;
            }

            wrap.style.width = totalWidth + "px";
            wrap.style.height = calendar._innerHeightTree + "px";
            wrap.rows = [];

            var progressive = calendar.progressiveRowRendering;
            if (progressive) {
                doNothing();
            }
            else {
                var m = this.rowlist.length;
                for (var i = 0; i < m; i++) {
                    calendar._drawRow(i);
                }
            }

            calendar._drawResScrollSpace();

            this.divResScroll.appendChild(wrap);

            if (this.rowHeaderWidthAutoFit) {
                this._autoRowHeaderWidth();
            }

        };

        this._drawResHeadersProgressive = function() {

            if (!calendar.progressiveRowRendering) {
                return;
            }

            var area = this._getAreaRowsWithMargin();

            for (var i = 0; i < calendar.rowlist.length; i++) {
                if (area.start <= i && i < area.end) {
                    calendar._drawRow(i);
                }
                else {
                    calendar._deleteRow(i);
                }
            }

            if (this.rowHeaderWidthAutoFit) {
                var originalWidth = calendar._getOuterRowHeaderWidth();
                this._autoRowHeaderWidth();
                var newWidth = calendar._getOuterRowHeaderWidth();
                if (newWidth !== originalWidth) {
                    var originalCellWidth = this.cellWidth;
                    this._calculateCellWidth();
                    var newCellWidth = this.cellWidth;
                    if (newCellWidth !== originalCellWidth) {
                        calendar._prepareItline();
                        calendar._drawTimeHeader();
                        calendar._updateHeight();
                        calendar._loadEvents();
                        calendar._deleteLines();
                    }
                }
            }

        };

        this._drawResScrollSpace = function() {

            //if (!calendar.nav.resScrollSpace) {
                var wrap = calendar.divHeader;
                //var rowHeaderCols = this.rowHeaderCols;
                //var columns = rowHeaderCols ? this.rowHeaderCols.length : 0;

                var c = document.createElement("div");
                c.style.position = "absolute";
                //c.colSpan = columns + 1;
                wrap.appendChild(c);

                calendar.nav.resScrollSpace = c;

                c.setAttribute("unselectable", "on");

                var div = document.createElement("div");
                div.style.position = "relative";
                div.style.height = "100%";
                div.className = this._prefixCssClass('_rowheader');
                c.appendChild(div);

            //}

            var totalWidth = this._getTotalRowHeaderWidth();

            var c = calendar.nav.resScrollSpace;
            c.style.width = totalWidth + "px";
            c.style.top = this._innerHeightTree + "px";
            c.style.height = (calendar.divResScroll.clientHeight + 20) + "px";

        };

        this._deleteRow = function(i) {
            var row = calendar.divHeader.rows[i];

            if (!row) {
                return;
            }

            DayPilot.de(row.cells);
            calendar.divHeader.rows[i] = null;
        };

        this._drawRowForced = function(i) {
            this._deleteRow(i);
            this._drawRow(i);
        };

        this._drawRow = function(i) {


            var wrap = calendar.divHeader;

            var divHeader = this.divHeader;

            if (divHeader.rows[i]) { // already rendered
                return;
            }

            var rowHeaderCols = this.rowHeaderCols;
            var columns = rowHeaderCols ? this.rowHeaderCols.length : 0;
            var totalWidth = this._getTotalRowHeaderWidth();

            var row = this.rowlist[i];

            if (!row) {  // not found
                return;
            }

            //var node = this.tree[i];
            if (row.hidden) {
                return;
            }

            var args = this._doBeforeRowHeaderRender(row);

            divHeader.rows[i] = {};
            divHeader.rows[i].cells = [];

            var c = document.createElement("div");
            c.style.position = "absolute";
            c.style.top = row.top + "px";

            c.row = row;
            c.index = i;

            var props = args.row;

            var width = rowHeaderCols ? rowHeaderCols[0] : this.rowHeaderWidth;
            c.style.width = (width) + "px";
            c.style.border = "0px none";

            if (props.toolTip) {
                c.title = props.toolTip;
            }
            c.setAttribute("unselectable", "on");

            if (typeof props.ariaLabel !== "undefined") {
                c.setAttribute("aria-label", props.ariaLabel);
            }
            else {
                c.setAttribute("aria-label", props.html);
            }
            //c.setAttribute('resource', row.id);

            c.onmousemove = calendar._onResMouseMove;
            c.onmouseout = calendar._onResMouseOut;
            c.onmouseup = calendar._onResMouseUp;
            c.oncontextmenu = calendar._onResRightClick;
            c.onclick = calendar._onResClick;
            c.ondblclick = calendar._onResDoubleClick;

            var div = document.createElement("div");
            div.style.width = (width) + "px";
            div.setAttribute("unselectable", "on");
            div.className = this._prefixCssClass('_rowheader');
            if (props.cssClass) {
                DayPilot.Util.addClass(div, props.cssClass);
            }
            if (props.backColor) {
                div.style.background = props.backColor;
            }
            if (props.fontColor) {
                div.style.color = props.fontColor;
            }
            if (props.horizontalAlignment) {
                div.style.textAlign = props.horizontalAlignment;
            }
            div.style.height = (row.height) + "px";
            div.style.overflow = 'hidden';
            div.style.position = 'relative';

            var inner = document.createElement("div");
            inner.setAttribute("unselectable", "on");
            inner.className = this._prefixCssClass('_rowheader_inner');
            div.appendChild(inner);

            var moving = this.rowMoveHandling !== "Disabled";
            var dragHandleWidth = 10;

            var areas = props.areas || [];

            if (moving && !props.moveDisabled) { // add moving handle
                areas.push({
                    "v": "Hover",
                    "w": dragHandleWidth,
                    "bottom": 0,
                    "top": 0,
                    "left": 0,
                    "css": calendar._prefixCssClass("_rowmove_handle"),
                    "action": "Move"
                });
            }

            var ro = calendar._createRowObject(row);
            DayPilot.Areas.attach(div, ro, {
                "areas": areas,
                "allowed": function() { return !rowmoving.row; }
            });

            var border = document.createElement("div");
            border.style.position = "absolute";
            border.style.bottom = "0px";
            border.style.width = "100%";
            border.style.height = "1px";
            border.className = this._prefixCssClass(cssNames.resourcedivider);
            div.appendChild(border);

            (function drawText() {

                if (calendar.treeEnabled  && !row.isNewRow) {

                    var left = row.level * calendar.treeIndent + calendar.treeImageMarginLeft;
                    if (moving) {
                        left += dragHandleWidth;
                    }
                    var width = 10;

                    var expand = document.createElement("div");

                    expand.style.width = "10px";
                    expand.style.height = width + "px";
                    expand.style.backgroundRepeat = "no-repeat";
                    expand.style.position = 'absolute';
                    expand.style.left = left + 'px';
                    expand.style.top = calendar.treeImageMarginTop + "px";


                    if (!row.loaded && row.children.length === 0) {
                        expand.className = calendar._prefixCssClass('_tree_image_expand');
                        expand.style.cursor = 'pointer';
                        expand.index = i;
                        expand.onclick = function(ev) { calendar._loadNode(this.index); ev = ev || window.event; ev.cancelBubble = true; };
                    }
                    else if (row.children.length > 0) {
                        if (row.expanded) {
                            expand.className = calendar._prefixCssClass('_tree_image_collapse');
                        }
                        else {
                            expand.className = calendar._prefixCssClass('_tree_image_expand');
                        }

                        expand.style.cursor = 'pointer';
                        expand.index = i;
                        expand.onclick = function(ev) { calendar._toggle(this.index); ev = ev || window.event; ev.cancelBubble = true; };
                    }
                    else {
                        expand.className = calendar._prefixCssClass('_tree_image_no_children');
                    }

                    inner.appendChild(expand);

                }

                var text = document.createElement("div");
                if (calendar.treeEnabled) {
                    text.style.marginLeft = (left + width) + "px";
                }
                text.innerHTML = props.html;
                c.textDiv = text;
                c.cellDiv = div;

                inner.appendChild(text);

            })();

            c.appendChild(div);

/*
            if (props.areas) {
                for (var j = 0; j < props.areas.length; j++) {
                    var area = props.areas[j];
                    var v = area.v || "Visible";
                    if (v !== "Visible") {
                        continue;
                    }
                    var r = calendar._createRowObject(row);
                    var a = DayPilot.Areas.createArea(div, r, area);
                    div.appendChild(a);
                }
            }
*/

            wrap.appendChild(c);
            divHeader.rows[i].cells.push(c);

            if (!row.columns || row.columns.length === 0) {
                c.colSpan = columns > 0 ? columns : 1;
                div.style.width = totalWidth + "px";
            }
            else {
                var left = width;
                for (var j = 1; j < columns; j++) {
                    var col = props.columns[j - 1] || {};

                    //var c = r.insertCell(-1);
                    var c = document.createElement("div");
                    c.style.position = "absolute";
                    c.style.top = row.top + "px";
                    c.style.left = left + "px";
                    wrap.appendChild(c);
                    divHeader.rows[i].cells.push(c);

                    c.row = row;
                    c.index = i;

                    if (props.toolTip) {
                        c.title = props.toolTip;
                    }
                    c.setAttribute("unselectable", "on");

                    c.onmousemove = calendar._onResMouseMove;
                    c.onmouseout = calendar._onResMouseOut;
                    c.onmouseup = calendar._onResMouseUp;
                    c.oncontextmenu = calendar._onResRightClick;
                    c.onclick = calendar._onResClick;
                    c.ondblclick = calendar._onResDoubleClick;

                    var div = document.createElement("div");
                    var w = rowHeaderCols[j];
                    left += w;

                    var backColor = col.backColor || props.backColor;

                    if (backColor) {
                        div.style.backgroundColor = backColor;
                    }

                    div.style.width = w + "px";
                    div.style.height = (row.height) + "px";
                    div.style.overflow = 'hidden';
                    div.style.position = 'relative';
                    div.setAttribute("unselectable", "on");
                    DayPilot.Util.addClass(div, this._prefixCssClass("_rowheader"));
                    DayPilot.Util.addClass(div, this._prefixCssClass("_rowheadercol"));
                    DayPilot.Util.addClass(div, this._prefixCssClass("_rowheadercol" + j));
                    if (props.cssClass) {
                        DayPilot.Util.addClass(div, props.cssClass);
                    }
                    if (col.cssClass) {
                        DayPilot.Util.addClass(div, col.cssClass);
                    }
                    if (col.horizontalAlignment) {
                        div.style.textAlign = col.horizontalAlignment;
                    }

                    var inner = document.createElement("div");
                    //inner.style.position = 'absolute';
                    inner.setAttribute("unselectable", "on");
                    inner.className = this._prefixCssClass("_rowheader_inner");
                    div.appendChild(inner);

                    var border = document.createElement("div");
                    border.style.position = "absolute";
                    border.style.bottom = "0px";
                    border.style.width = "100%";
                    border.style.height = "1px";
                    border.className = this._prefixCssClass("_resourcedivider");
                    div.appendChild(border);

                    var text = document.createElement("div");

                    var innerHTML = col.html || "";

                    text.innerHTML = innerHTML;
                    c.textDiv = text;
                    c.cellDiv = div;

                    inner.appendChild(text);

                    DayPilot.Areas.attach(div, ro, {
                        "areas": col.areas,
                        "allowed": function() { return !rowmoving.row; }
                    });

                    c.appendChild(div);
                }
            }
        };

        this._onResRightClick = function() {
            var row = this.row;

            if (row.contextMenu) {
                row.contextMenu.show(calendar._createRowObject(row));
            }
            return false;
        };

        this._onResClick = function(ev) {
            if (rowtools.cancelClick) {
                return;
            }

            var row = this.row;
            var r = calendar._createRowObject(row, this.index);

            if (row.isNewRow) {
                calendar._rowtools.edit(row);
                return;
            }

            calendar._rowClickDispatch(r, ev.ctrlKey, ev.shiftKey, ev.metaKey);
        };
        
        this._onResDoubleClick = function(ev) {
            
            if (calendar.timeouts.resClick) {
                for (var toid in calendar.timeouts.resClick) {
                    window.clearTimeout(calendar.timeouts.resClick[toid]);
                }
                calendar.timeouts.resClick = null;
            }

            var row = this.row;
            var e = calendar._createRowObject(row, this.index);

            if (calendar._api2()) {
                
                var args = {};
                args.resource = e;
                args.row = e;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onRowDoubleClick === 'function') {
                    calendar.onRowDoubleClick(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }
                
                switch (calendar.rowDoubleClickHandling) {
                    case 'PostBack':
                        calendar.rowDoubleClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.rowDoubleClickCallBack(e);
                        break;
                    case 'Select':
                        calendar._rowSelectDispatch(row, ev.ctrlKey, ev.shiftKey, ev.metaKey);
                        break;
                    case 'Edit':
                        calendar._rowtools.edit(row);
                        break;
                }
                
                if (typeof calendar.onRowDoubleClicked === 'function') {
                    calendar.onRowDoubleClicked(args);
                }                

            }
            else {
                switch (calendar.rowDoubleClickHandling) {
                    case 'PostBack':
                        calendar.rowDoubleClickPostBack(e);
                        break;
                    case 'CallBack':
                        calendar.rowDoubleClickCallBack(e);
                        break;
                    case 'JavaScript':
                        calendar.onRowDoubleClick(e);
                        break;
                    case 'Select':
                        calendar._rowSelectDispatch(row, ev.ctrlKey, ev.shiftKey, ev.metaKey);
                        break;
                    case 'Edit':
                        calendar._rowtools.edit(row);
                        break;
                }
            }
        };
        
        this.rowDoubleClickPostBack = function(e, data) {
            var params = {};
            params.resource = e;

            this._postBack2("RowDoubleClick", params, data);
        };
        this.rowDoubleClickCallBack = function(e, data) {
            var params = {};
            params.resource = e;

            this._callBack2("RowDoubleClick", params, data);
        };

        this._onTimeClick = function(ev) {

            if (calendar.timeHeaderClickHandling === "Disabled") {
                return;
            }

            var cell = {};
            
            cell.start = this.cell.start;
            cell.level = this.cell.level;
            cell.end = this.cell.end;
            if (!cell.end) {
                cell.end = new DayPilot.Date(cell.start).addMinutes(calendar.cellDuration);
            }

            calendar._timeHeaderClickDispatch(cell);
        };

        this._createRowObject = function(row) {
            return new DayPilot.Row(row, calendar);
        };

        this._ensureRowData = function(i) {
            var row = this.rowlist[i];
            
            if (!row.events) {
                row.resetEvents();
            }
            
            if (row.data) {
                return;
            }
            
            row.data = {};

            // to be used later during client-side operations
            // rowStart
            row.data.start = new DayPilot.Date(row.start);
            // rowStartTicks
            row.data.startTicks = row.data.start.getTime();
            // rowEnd
            var duration = this._visibleEnd().getTime() - this._visibleStart().getTime();
            row.data.end = resolved.isResourcesView() ? row.data.start.addTime(duration) : row.data.start.addDays(1);
            // rowEndTicks 
            row.data.endTicks = row.data.end.getTime();
            // rowOffset
            row.data.offset = row.start.getTime() - this._visibleStart().getTime();
            row.data.i = i;
        };

        this._loadEvents = function(events) {
            if (events) {
                this.events.list = events;
            }
            else if (!this.events.list) {
                this.events.list = [];
            }

            if (this.events.list != null && !DayPilot.isArray(this.events.list)) {
                throw "DayPilot.Scheduler.events.list expects an array object";
            }

            eventloading.prepareRows(true);

            var list = this.events.list;
            var listlength = list.length;

            var ober = typeof this.onBeforeEventRender === 'function';
            var rows;
            var isRes = calendar.viewType === "Resources";

            for (var j = 0; j < listlength; j++) {

                var edata = list[j];

                if (!edata) {
                    continue;
                }

                if (typeof edata !== "object") {
                    throw new DayPilot.Exception("Event data item must be an object");
                }
                if (!edata.start) {
                    throw new DayPilot.Exception("Event data item must specify 'start' property");
                }

                if (edata instanceof DayPilot.Event) {
                    throw "DayPilot.Scheduler: DayPilot.Event object detected in events.list array. Use raw event data instead.";
                    //edata = edata.data;
                }

                var validId = typeof edata.id === "string" || typeof edata.id === "number";
                if (!validId) {
                    var validRecurId = typeof edata.recurrentMasterId === "string" || typeof edata.recurrentMasterId === "number";
                    if (!validRecurId) {
                        throw new DayPilot.Exception("All events must have an id property (string or number)");
                    }
                }

                if (edata.type === "Milestone") {
                    edata.end = edata.start;
                }

                if (ober) {
                    this._doBeforeEventRender(j);
                }

                if (edata.resource === "*") {
                    rows = calendar.rowlist;
                }
                else if (isRes) {
                    rows = DayPilot.list(eventloading.rowcache[edata.resource]).concat(eventloading.rowcache["*"]);  // make sure wildcards resources are always there;
                    //rows = eventloading.rowcache[edata.resource].concat(eventloading.rowcache["*"]);  // make sure wildcards resources are always there;
                }
                else if (calendar.viewType === "Days") {
                    rows = calendar.rowlist;
                }
                else if (calendar.viewType === "Gantt") {
                    rows = eventloading.rowcache[edata.id];
                }


                for (var x = 0; rows && x < rows.length; x++) {
                    var row = rows[x];
                    var ep = this._loadEvent(edata, row);

                    if (!ep) {
                        continue;
                    }

                    if (ober) {
                        ep.cache = this._cache.events[j];
                    }
                }
            }

            // sort events inside rows
/*
            for (var i = 0; i < this.rowlist.length; i++) {
                var row = this.rowlist[i];
                this._loadRow(row);
            }
*/

            DayPilot.list(calendar.rowlist).each(function(row) {
                calendar._loadRow(row);
            });

            this._updateRowHeights();
        };

        // assumes rows collection is created
/*
        this._loadEventsOld = function(events) {
            var loadCache = [];

            var updatedRows = [];

            var append = null;
            if (events && add) {
                // append new events
                var supplied = events;

                var append = [];
                for (var i = 0; i < supplied.length; i++) {
                    var e = supplied[i];
                    var found = false;
                    for (var j = 0; j < this.events.list.length; j++) {
                        var ex = this.events.list[j];
                        // this causes changed events to be rendered again
                        if (ex.id === e.id && ex.start.toString() === e.start.toString() && ex.resource === e.resource) {
                        //if (ex.id === e.id) {
                            var rows = calendar.events._removeFromRows(ex);
                            updatedRows = updatedRows.concat(rows);
                            this.events.list[j] = e;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        append.push(e);
                    }
                }
                this.events.list = this.events.list.concat(append);
                //events = this.events; 
            }
            else if (events) {
                this.events.list = events;
            }
            else if (!this.events.list) {
                this.events.list = [];
            }

            var list = append || this.events.list;


            if (events) {
                this.events.list = events;
            }
            else if (!this.events.list) {
                this.events.list = [];
            }

            var list = this.events.list;
            var eventsLength = list.length;

            if (typeof this.onBeforeEventRender === 'function') {
                var start = append ? this.events.list.length - append.length : 0;
                //var start = 0;
                var end = this.events.list.length;
                for (var i = start; i < end; i++) {
                    this._doBeforeEventRender(i);
                }
            }

            var useLoadCache = !this._containsDuplicateResources();

            var optimizedLoading = true;

            if (optimizedLoading) {
                var resetEvents = !append || typeof row.events === "undefined";
                eventloading.prepareRows(resetEvents);

                for (var j = 0; list && j < eventsLength; j++) {
                    if (loadCache[j]) {
                        continue;
                    }
                    var edata = list[j];

                    if (!edata) {
                        continue;
                    }

                    var rows = [];

                    if (edata.resource === "*") {
                        rows = calendar.rowlist;
                    }
                    else if (calendar.viewType === "Days") {
                        rows = calendar.rowlist;
                    }
                    else if (calendar.viewType === "Gantt") {
                        rows = eventloading.rowcache[edata.id];
                    }
                    else {
                        rows = eventloading.rowcache[edata.resource];
                    }

                    for (var x = 0; rows && x < rows.length; x++) {
                        var row = rows[x];
                        var ep = this._loadEvent(edata, row);

                        if (!ep) {
                            continue;
                        }

                        if (typeof this.onBeforeEventRender === 'function') {
                            ep.cache = this._cache.events[j + start];
                        }
                        updatedRows.push(row.index);
                    }
                }
            }
            else {
                // first, load event parts into rows
                for (var i = 0; i < this.rowlist.length; i++) {
                    var row = this.rowlist[i];
                    if (!append || typeof row.events === "undefined") {
                        row.resetEvents();
                    }
                    //row.lines = [];

                    calendar._ensureRowData(i);

                    if (this._isRowDisabled(i)) {
                        continue;
                    }

                    for (var j = 0; list && j < eventsLength; j++) {
                        if (loadCache[j]) {
                            continue;
                        }
                        var e = list[j];

                        var ep = this._loadEvent(e, row);

                        if (!ep) {
                            continue;
                        }

                        if (typeof this.onBeforeEventRender === 'function') {
                            ep.cache = this._cache.events[j + start];
                        }

                        updatedRows.push(i);

                        // load cache is disabled to allow rows with duplicate ids
                        if (useLoadCache) {
                            if (ep.data.resource !== "*" && ep.part.start.getTime() === ep.start().getTime() && ep.part.end.getTime() === ep.rawend().getTime()) {
                                loadCache[j] = true;
                            }
                        }
                    }
                }
            }

            /!*
            DayPilot.dynlist(this.rowlist).each(function(item) {
                calendar._loadRow(item);
            });
            *!/

            // sort events inside rows
            for (var i = 0; i < this.rowlist.length; i++) {
                var row = this.rowlist[i];
                this._loadRow(row);
            }


            this._updateRowHeights();

            return DayPilot.ua(updatedRows);
        };
*/

        this._eventloading = {};
        var eventloading = this._eventloading;

        eventloading.rowCache = {};

        eventloading.prepareRows = function(resetEvents) {
            eventloading.rowcache = {};

            // initialize
            for (var i = 0; i < calendar.rowlist.length; i++) {
                var row = calendar.rowlist[i];
                if (resetEvents) {
                    row.resetEvents();
                }
                calendar._ensureRowData(i);

                if (!row.id) {
                    continue;
                }
                var key = row.id.toString();
                if (!eventloading.rowcache[key]) {
                    eventloading.rowcache[key] = DayPilot.list();
                }
                eventloading.rowcache[key].push(row);
            }
        };

        eventloading.loadEvent = function(edata) {

        };
        
        this._containsDuplicateResources = function() {
            var idlist = {};
            
            if (calendar.viewType !== "Resources") {
                return false;
            }
            for (var i = 0; i < calendar.rowlist.length; i++) {
                var row = calendar.rowlist[i];
                var id = row.id;
                if (idlist[id]) {
                    return true;
                }
                idlist[id] = true;
            }
            return false;
        };
        
        this._doBeforeEventRender = function(i) {
            var cache = this._cache.events;
            var data = this.events.list[i];
            var evc = {};

            if (data instanceof DayPilot.Event) {
                data = data.data;
            }

            // make a copy
            for (var name in data) {
                evc[name] = data[name];
            }
            
            if (typeof this.onBeforeEventRender === 'function') {
                var args = {};
                args.e = evc;
                args.data = evc;
                args.onElementCreate = null;
                args.onElementRemove = null;
                this.onBeforeEventRender(args);

                DayPilot.Util.copyProps(args, evc, ["onElementCreate", "onElementRemove"]);
            }
            
            cache[i] = evc;

        };

        // internal
        this._loadRow = function(row) {
            row.lines = [];
            row.sections = null;
            //row.blocks = [];

            if (row.isNewRow) {
                return;
            }

            if (this.sortDirections) {
                row.events.sort(this._eventComparerCustom);
            }
            else if (!calendar._cellStacking) {
                row.events.sort(this._eventComparer);
            }

            var stackingMode = calendar._cellStacking;
            if (stackingMode) {
                cellstacking.loadRow(row);
                return;
            }

            var collapsible = calendar.groupConcurrentEvents;

            if (collapsible) {
                for (var i = 0; i < row.blocks.length; i++) {
                    //row.blocks[i].events = [];
                    row.blocks[i].clear();
                }
            }

            // calculate event height
            DayPilot.list(row.events).each(function(e) {
                if (e.part.height) {
                    return;
                }
                if (row.eventHeight) {
                    e.part.height = row.eventHeight;
                    return;
                }
                e.part.height = resolved.eventHeight();
            });

            // put into lines
            for (var j = 0; j < row.events.length; j++) {
                var e = row.events[j];
                row.putIntoLine(e);
                if (collapsible) {
                    row.putIntoBlock(e);
                }
            }

            // calculate line tops
            var lineTop = 0;
            for (var i = 0; i < row.lines.length; i++) {
                var line = row.lines[i];
                line.top = lineTop;
                lineTop += (line.height || row.eventHeight) * row.eventStackingLineHeight/100;
            }

            if (collapsible) {
                for (var j = 0; j < row.blocks.length; j++) {
                    var block = row.blocks[j];
                    block.lines = [];
                    block.events.sort(this._eventComparerCustom);
                    for (var k = 0; k < block.events.length; k++) {
                        var e = block.events[k];
                        block.putIntoLine(e);
                    }
                    if (block.lines.length <= calendar.groupConcurrentEventsLimit) {
                        block.expanded = true;
                    }
                    var anyItemExpandedBefore = DayPilot.list(block.events).map(function(e) {return e.id();}).some(function(item) {
                        return DayPilot.contains(calendar._blockExpandedEvents, item);
                    });
                    if (anyItemExpandedBefore) {
                        block.expanded = true;
                    }

                    // calculate line tops
                    var lineTop = 0;
                    for (var i = 0; i < block.lines.length; i++) {
                        var line = block.lines[i];
                        line.top = lineTop;
                        lineTop += (line.height || row.eventHeight) * row.eventStackingLineHeight/100;
                    }

                }
            }

        };

        // internal
        this._loadRows = function(rows) {  // row indices
            rows = DayPilot.ua(rows); // unique

            for (var i = 0; i < rows.length; i++) {
                var ri = rows[i];
                calendar._loadRow(calendar.rowlist[ri]);
            }

            if (calendar._cellStacking) {
                cellstacking.calculateEventPositions();
            }
            else {
                for (var i = 0; i < rows.length; i++) {
                    var ri = rows[i];
                    var row = calendar.rowlist[ri];
                    calendar._updateEventPositionsInRow(row);
                }
            }
        };

        this._rowsWithCustomStart = function() {
            var start = calendar.scale === "Manual" ? calendar.itline[0].start : calendar.startDate;
            return DayPilot.list(calendar.rowlist).some(function(item) {
                if (!item.start) {
                    return false;
                }
                return item.start.getTime() !== new DayPilot.Date(start).getTime();
            });
        };

        // internal
        // returns ep if the event was added to this row, otherwise null
        this._loadEvent = function(e, row) {
            if (row.hideEvents) {
                return;
            }

            var start = new DayPilot.Date(e.start);
            var end = new DayPilot.Date(e.end);

            /*
            if (calendar.eventEndSpec === "Date") {
                end = end.getDatePart().addDays(1);
            }
            */
            end = calendar._adjustEndIn(end);

            var startTicks = start.ticks;
            var endTicks = end.ticks;

            if (endTicks < startTicks) {  // skip invalid events
                return null;
            }

            var cache = null;
            if (typeof calendar.onBeforeEventRender === 'function') {
                var index = DayPilot.indexOf(calendar.events.list, e);
                cache = calendar._cache.events[index];
            }

            if (cache) {
                if (cache.hidden) {
                    return null;
                }
            }
            else if (e.hidden) {
                return null;
            }

            // belongs here
            var belongsHere = false;
            switch (this.viewType) {
                case 'Days':
                    belongsHere = !(endTicks <= row.data.startTicks || startTicks >= row.data.endTicks) || (startTicks === endTicks && startTicks === row.data.startTicks);
                    break;
                case 'Resources':
                    belongsHere = (row.id === e.resource || row.id === "*" || e.resource === "*") && (!(endTicks <= row.data.startTicks || startTicks >= row.data.endTicks) || (startTicks === endTicks && startTicks === row.data.startTicks));
                    break;
                case 'Gantt':
                    belongsHere = (row.id === e.id) && !(endTicks <= row.data.startTicks || startTicks >= row.data.endTicks);
                    break;

            }
            
            if (!belongsHere) {
                return null;
            }
            
            var ep = new DayPilot.Event(e, calendar); // event part
            ep.part.dayIndex = row.data.i;
            //ep.part.start = row.data.startTicks < startTicks ? ep.start() : row.data.start;
            ep.part.start = row.data.startTicks < startTicks ? start : row.data.start;
            //ep.part.end = row.data.endTicks > endTicks ? ep.end() : row.data.end;
            ep.part.end = row.data.endTicks > endTicks ? end : row.data.end;

            var partStartPixels = this.getPixels(ep.part.start.addTime(-row.data.offset));
            var partEndPixels = this.getPixels(ep.part.end.addTime(-row.data.offset));

            if (ep.part.start === ep.part.end) {
                partEndPixels = this.getPixels(ep.part.end.addTime(-row.data.offset).addSeconds(1));
            }

            if (cache && cache.height) {  // custom height, from onBeforeEventRender
                ep.part.height = cache.height;
            }
            else if (e.height) {  // custom height from event data
                ep.part.height = e.height;
            }

            ep.part._getHeightWithVersions = function() {
                var pheight = this.height;
                if (calendar.eventVersionsEnabled && !DayPilot.list(ep.data.versions).isEmpty()) {
                    //var count = ep.data.versions.length;
                    var count = ep.versions.length;
                    pheight += count*calendar.eventVersionHeight;
                    pheight += count*calendar.eventVersionMargin;
                }
                return pheight + calendar.eventMarginBottom;
            };

            var left = partStartPixels.left;
            var right = partEndPixels.left;

            // DEBUG: remove
            ep.part.startPixels = partStartPixels;
            ep.part.endPixels = partEndPixels;

            // events in the hidden areas
            if (left === right) {
                if (partStartPixels.cut || partEndPixels.cut) {
                    return null;
                }
                // check if it's hidden because of hidden timeline cells vs. too big scale
                var mid = (ep.part.start.addTime(-row.data.offset).getTime() + ep.part.end.addTime(-row.data.offset).getTime()) / 2;
                var midPixels = calendar.getPixels(new DayPilot.Date(Math.floor(mid)));
                if (midPixels.cut) {
                    return null;
                }

            }

            ep.part.box = resolved.useBox(endTicks - startTicks);

            var milestoneWidth = calendar.eventHeight;


            if (e.type === "Milestone") {
                var width = e.width || milestoneWidth;
                ep.part.end = ep.part.start;
                ep.part.left = left - width /2;
                ep.part.width = width;
                ep.part.barLeft = 0;
                ep.part.barWidth = width;
            }
            else if (ep.part.box) {
                var boxLeft = partStartPixels.boxLeft;
                var boxRight = partEndPixels.boxRight;
                //var itc = this._getItlineCellFromPixels()

                //ep.part.left = Math.floor(left / this.cellWidth) * this.cellWidth;
                ep.part.left = boxLeft;
                ep.part.width = boxRight - boxLeft;
                ep.part.barLeft = Math.max(left - ep.part.left, 0);  // minimum 0
                ep.part.barWidth = Math.max(right - left, 1);  // minimum 1
            }
            else {
                ep.part.left = left;
                ep.part.width = Math.max(right - left, 1);
                ep.part.barLeft = 0;
                ep.part.barWidth = Math.max(right - left - 1, 1);
            }

            var minWidth = calendar.eventMinWidth;
            ep.part.width = Math.max(ep.part.width, minWidth);

            if (calendar.eventVersionsEnabled) {
                calendar._fillOriginalEventData(ep, row);
            }

            if (typeof calendar.onEventFilter === "function" && calendar.events._filterParams) {
                var args = {};
                args.filter = calendar.events._filterParams;
                args.visible = true;
                args.e = ep;

                calendar.onEventFilter(args);

                if (!args.visible) {
                    return null;
                }
            }

            row.events.push(ep);

            return ep;

        };

        this._fillOriginalEventData = function(ep, row) {
            ep.versions = [];

            var data = ep.data;

            var list = DayPilot.list(data.versions);

            if (list.isEmpty()) {
                return;
            }


            list.each(function(source) {
                var start = new DayPilot.Date(source.start);
                var end = new DayPilot.Date(source.end);

                var partStartPixels = calendar.getPixels(start.addTime(-row.data.offset));
                var partEndPixels = calendar.getPixels(end.addTime(-row.data.offset));

                if (start.ticks === end.ticks) {
                    partEndPixels = calendar.getPixels(end.addTime(-row.data.offset).addTime(1));
                }

                var left = partStartPixels.left;
                var right = partEndPixels.left;

                // events in the hidden areas
                if (left === right && (partStartPixels.cut || partEndPixels.cut)) {
                    return null;
                }

                var version = {};
                version.left = left;
                version.continueLeft = start < row.data.start;
                version.right = right;
                version.continueRight = end > row.data.end;
                version.width = right - left;

                ep.versions.push(version);

            });

        };

        this._eventComparer = function(a, b) {
            if (!a || !b || !a.start || !b.start) {
                return 0; // no sorting, invalid arguments
            }

            var byStart = a.start().ticks - b.start().ticks;
            if (byStart !== 0) {
                return byStart;
            }

            var byEnd = b.end().ticks - a.end().ticks; // desc
            return byEnd;
        };

        this._eventComparerCustom = function(a, b) {
            if (!a || !b) {
                return 0; // no sorting, invalid arguments
            }

            if (!a.data || !b.data || !a.data.sort || !b.data.sort || a.data.sort.length === 0 || b.data.sort.length === 0) { // no custom sorting, using default sorting (start asc, end asc);
                return calendar._eventComparer(a, b);
            }

            var result = 0;
            var i = 0;
            while (result === 0 && typeof a.data.sort[i] !== "undefined" && typeof b.data.sort[i] !== "undefined") {
                if (a.data.sort[i] === b.data.sort[i]) {
                    result = 0;
                }
                else if (typeof a.data.sort[i] === "number" && typeof b.data.sort[i] === "number") {
                    result = a.data.sort[i] - b.data.sort[i];
                }
                else {
                    result = calendar._stringComparer(a.data.sort[i], b.data.sort[i], calendar.sortDirections[i]);
                }
                i++;
            }

            return result;
        };

        this._stringComparer = function(a, b, direction) {
            var asc = (direction !== "desc");
            var aFirst = asc ? -1 : 1;
            var bFirst = -aFirst;

            if (a === null && b === null) {
                return 0;
            }
            // nulls first
            if (b === null) { // b is smaller
                return bFirst;
            }
            if (a === null) {
                return aFirst;
            }

            //return asc ? a.localeCompare(a, b) : -a.localeCompare(a, b);

            var ar = [];
            ar[0] = a;
            ar[1] = b;

            ar.sort();

            return a === ar[0] ? aFirst : bFirst;
        };

        this._rowSelectDispatch = function(row, ctrl, shift, meta) {

            if (calendar._api2()) {

                var index = DayPilot.indexOf(calendar.rowlist, row);
                var e = calendar._createRowObject(row, index);
                var selected = DayPilot.indexOf(rowtools.selected, row) !== -1;
                var change = selected ? "deselected" : "selected";

                var args = {};
                args.row = e;
                args.selected = selected;
                args.ctrl = ctrl;
                args.shift = shift;
                args.meta = meta;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onRowSelect === 'function') {
                    calendar.onRowSelect(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }

                var shiftAction = shift && !ctrl && !meta;

                if (!shift) {
                    rowtools._rowSelectLast = {"row": row, "index": index};
                }

                if (shiftAction) {
                    rowtools.fixRowSelectLast();

                    var startIndex = rowtools._rowSelectLast.index;
                    var endIndex = index;

                    rowtools.selectRange(startIndex, endIndex);
                }

                switch (calendar.rowSelectHandling) {
                    case 'PostBack':
                        calendar.rowSelectPostBack(e, change);
                        break;
                    case 'CallBack':
                        calendar.rowSelectCallBack(e, change);
                        break;
                    case "Notify":
                        !shiftAction && rowtools.select(row, ctrl, shift, meta);
                        calendar.rowSelectNotify(e, change);
                        break;
                    case 'Update':
                        !shiftAction && rowtools.select(row, ctrl, shift, meta);
                        break;
                }
                
                if (typeof calendar.onRowSelected === 'function') {
                    args.selected = DayPilot.indexOf(rowtools.selected, row) !== -1;
                    calendar.onRowSelected(args);
                }                
                
            }
            else {
                rowtools.select(row, ctrl, shift);

                var index = DayPilot.indexOf(calendar.rowlist, row);
                var e = calendar._createRowObject(row, index);
                var selected = DayPilot.indexOf(rowtools.selected, row) !== -1;
                var change = selected ? "deselected" : "selected";

                switch (calendar.rowSelectHandling) {
                    case 'PostBack':
                        calendar.rowSelectPostBack(e, change);
                        break;
                    case 'CallBack':
                        calendar.rowSelectCallBack(e, change);
                        break;
                    case "Notify":
                        calendar.rowSelectNotify(e, change);
                        break;
                    case 'JavaScript':
                        calendar.onRowSelect(e, change);
                        break;
                }
            }

        };
        
        this.rowSelectPostBack = function(r, change, data) {
            var params = {};
            params.resource = r;
            params.change = change;
            this._postBack2('RowSelect', params, data);
        };
        
        this.rowSelectCallBack = function(r, change, data) {
            var params = {};
            params.resource = r;
            params.change = change;
            this._callBack2('RowSelect', params, data);
        };

        this.rowSelectNotify = function(r, change, data) {
            var params = {};
            params.resource = r;
            params.change = change;
            this._callBack2('RowSelect', params, data, "Notify");
        };

        this.rows = {};
        this.rows.selection = {};

        var rowsel = this.rows.selection;

        rowsel.get = function() {
            var list = [];
            DayPilot.list(rowtools.selected).each(function(item) {
                list.push(calendar._createRowObject(item));
            });
            return list;
        };

        rowsel.clear = function() {
            rowtools.clearSelection();
        };

        rowsel.add = function(row) {
            if (!row || !row.isRow) {
                throw "DayPilot.Scheduler.rows.selection.add(): DayPilot.Row object expected";
            }
            var alreadyThere = DayPilot.list(rowtools.selected).some(function(item) {
                return item === row.$.row;
            });

            if (!alreadyThere) {
                rowtools.selected.push(row.$.row);
            }

            rowtools._updateHighlighting();
            rowsel._updateInitialList();
        };

        rowsel.remove = function(row) {
            if (!row || !row.isRow) {
                throw "DayPilot.Scheduler.rows.selection.remove(): DayPilot.Row object expected";
            }
            var selected = rowsel.isSelected(row);

            if (selected) {
                rowtools.unselect(row.$.row);
                DayPilot.rfa(rowtools.selected, row.$.row);
            }
            rowsel._updateInitialList();
        };

        rowsel.isSelected = function(row) {
            if (!row || !row.isRow) {
                throw "DayPilot.Scheduler.rows.selection.isSelected(): DayPilot.Row object expected";
            }

            var selected = DayPilot.indexOf(rowtools.selected, row.$.row) !== -1;
            return selected;
        };

        rowsel._updateInitialList = function() {
            calendar.selectedRows = DayPilot.list(rowtools.selected).map(function(item) {
                return item.id;
            });
        };

        this.rows.all = function() {
            var list = [];
            for(var i = 0; i < calendar.rowlist.length; i++) {
                var r = calendar._createRowObject(calendar.rowlist[i]);
                list.push(r);
            }
            return rowArray(list);

        };

        this.rows.visible = function() {
            var list = [];
            for(var i = 0; i < calendar.rowlist.length; i++) {
                var r = calendar.rowlist[i];
                if (!r.hidden) {
                    var r = calendar._createRowObject(calendar.rowlist[i]);
                    list.push(r);
                }
            }
            return rowArray(list);
        };

        this.rows.each = function(f) {
            calendar.rows.all().each(f);
        };

        this.rows.filter = function(param) {
            calendar.rows._filterParams = param;

            if (calendar._initialized) {
                calendar._update({"immediateEvents": true});
            }

        };

        this.rows.find = function(id, start) {
            var matchingRows = DayPilot.list(eventloading.rowcache[id]);  // wrap, can be empty

            var first = null;
            if (typeof start === "string") {
                first = matchingRows.find(function(item) {
                    return start === item.start.toString();
                });
            }
            else {
                first = matchingRows.first();
            }

            if (first) {
                return new DayPilot.Row(first, calendar);
            }
            return null;

            /*
            var rows = calendar.rows.all();
            for (var i = 0; i < rows.length; i++) {
                var item = rows[i];
                if (item.id === id) {
                    if (typeof start === "string") {
                        if (start === item.start.toString()) {
                            return item;
                        }
                    }
                    else {
                        return item;
                    }
                }
            }*/
        };

        this.rows.load = function(url, success, error) {

            if (!url) {
                throw new DayPilot.Exception("rows.load(): 'url' parameter required");
            }

            var onError = function(args) {
                var largs = {};
                largs.exception = args.exception;
                largs.request = args.request;

                if (typeof error === 'function') {
                    error(largs);
                }
            };

            var onSuccess = function(args) {
                var r = args.request;
                var data;

                // it's supposed to be JSON
                try {
                    data = JSON.parse(r.responseText);
                }
                catch (e) {
                    var fargs = {};
                    fargs.exception = e;
                    onError(fargs);
                    return;
                }

                if (DayPilot.isArray(data)) {
                    var sargs = {};
                    sargs.preventDefault = function() {
                        this.preventDefault.value = true;
                    };
                    sargs.data = data;
                    if (typeof success === "function") {
                        success(sargs);
                    }

                    if (sargs.preventDefault.value) {
                        return;
                    }

                    calendar.resources = data;
                    if (calendar._initialized) {
                        calendar.update();
                    }
                }
            };

            var usePost = calendar.rowsLoadMethod && calendar.rowsLoadMethod.toUpperCase() === "POST";

            if (usePost) {
                DayPilot.ajax({
                    "method": "POST",
                    "url": url,
                    "success": onSuccess,
                    "error": onError
                });
            }
            else {
                DayPilot.ajax({
                    "method": "GET",
                    "url": url,
                    "success": onSuccess,
                    "error": onError
                });
            }
        };

        this.rows.expand = function(levels) {
            var rows = [];
            var level = levels || 1;
            for (var i = 0; i < calendar.rowlist.length; i++) {
                var row = calendar.rowlist[i];
                var withinLevel = level === -1;
                if (row.level < level) {
                    withinLevel = true;
                }
                if (withinLevel && !row.expanded && row.children && row.children.length > 0) {
                    rows.push(row.index);
                }
            }
            if (rows.length === 0) {
                return;
            }
            if (rows.length === 1) {
                calendar._toggle(rows[0]);
            }
            else {
                for (var i = 0; i < rows.length; i++) {
                    var index = rows[i];
                    var res = calendar.rowlist[index].resource;
                    res.expanded = true;
                }
                calendar._update();
            }
        };

        this.rows.expandAll = function() {
            calendar.rows.expand(-1);
        };

        this.rows.collapseAll = function() {
            calendar.rowlist.each(function(row) {
                row.resource.expanded = false;
            });
            calendar._update();
        };

        this.rows.headerHide = function() {
            calendar._rowHeaderHidden = true;
            calendar._updateRowHeaderWidthOuter();
            calendar._updateAutoCellWidth();

            calendar._detectDimensionChange();
        };

        this.rows.headerShow = function() {
            calendar._rowHeaderHidden = false;
            calendar._updateRowHeaderWidthOuter();
            calendar._updateAutoCellWidth();

            calendar._detectDimensionChange();
        };

        this.rows.headerToggle = function() {
            if (calendar._rowHeaderHidden) {
                calendar.rows.headerShow();
            }
            else {
                calendar.rows.headerHide();
            }
        };

        this.rows.edit = function(row) {
            rowtools.edit(row.$.row);
        };

        // row - DayPilot.Row object
        this.rows.remove = function(row) {
            var data = row.$.row.resource;
            //var parent = restools.findParentArray(data);

            var sourceParent = restools.findParentArray(data);
            if (!sourceParent) {
                throw "Cannot find source node parent";
            }
            var sourceIndex = DayPilot.indexOf(sourceParent, data);
            sourceParent.splice(sourceIndex, 1);

            calendar.update();
        };

        // not supported to be changed: id, children
        this.rows.update = function(row) {
            if (!(row instanceof DayPilot.Row)) {
                throw new DayPilot.Exception("DayPilot.Scheduler.rows.update() expects a DayPilot.Row object.");
            }
            var index = row.index;

            var oldRow = calendar.rowlist[index];
            var res = row.data;

            var parent = row.parent() ? row.parent().$.row : null;

            var rcustomized = calendar._doBeforeResHeaderRender(res);

            var row = calendar._createRowFromResource(rcustomized, parent);
            row.hidden = oldRow.hidden;
            row.level = oldRow.level;
            row.children = oldRow.children;
            row.index = index;
            row.top = oldRow.top;
            row.height = oldRow.height;
            calendar.rowlist[index] = row;

            row.resetEvents();
            calendar._ensureRowData(index);

            calendar._loadEventsForRow(row);
            calendar._loadRow(row);
            calendar._drawRowForced(index);


            // trying to optimize the update
            // new DayPilot.Row(row, calendar).cells.all().invalidate();
            // calendar._redrawInvalidatedCells();

            calendar._deleteCells();
            calendar._drawCells();
        };

        /*
         calendar._loadRows(rows);
         calendar._updateRowHeights();

         if (calendar._initialized) {
         if (calendar.viewType === "Gantt") {
         calendar.update();
         }
         else {
         calendar._updateRowsNoLoad(rows);
         calendar._updateHeight();
         calendar._redrawInvalidatedCells();
         }
         }

         */

        this._loadEventsForRow = function(row) {
            var events = calendar.events.list;
            var listlength = events.length;
            var ober = typeof calendar.onBeforeEventRender  === "function";

            var rows;
            for (var j = 0; j < listlength; j++) {

                var edata = events[j];

                if (!edata) {
                    continue;
                }

                if (edata instanceof DayPilot.Event) {
                    throw new DayPilot.Exception("DayPilot.Scheduler: DayPilot.Event object detected in events.list array. Use raw event data instead.");
                    //edata = edata.data;
                }

                if (calendar.viewType === "Days") {
                    throw new DayPilot.Exception(".rows.update() not supported for viewType = 'Days'.");
                }
                else if (calendar.viewType === "Gantt") {
                    throw new DayPilot.Exception(".rows.update() not supported for viewType = 'Gantt'.");
                }

                var belongsHere = edata.resource === "*" || row.id === "*" || edata.resource === row.id;

                if (!belongsHere) {
                    continue;
                }

                if (ober) {
                    this._doBeforeEventRender(j);
                }

                var ep = this._loadEvent(edata, row);

                if (!ep) {
                    continue;
                }

                if (ober) {
                    ep.cache = this._cache.events[j];
                }
            }
        };

        this._rowMoveDispatch = function() {
            var source = rowmoving.source;
            var target = rowmoving.target;
            var position = rowmoving.position;

            var sourceCalendar = rowmoving.sourceCalendar;

            rowtools.resetMoving();

            if (calendar._api2()) {
                var args  = {};
                args.source = calendar._createRowObject(source);
                args.source.calendar = sourceCalendar;
                args.target = calendar._createRowObject(target);
                args.position = position;
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                if (typeof calendar.onRowMove === "function") {
                    calendar.onRowMove(args);
                    if (args.preventDefault.value) {
                        return;
                    }
                }

                switch (calendar.rowMoveHandling) {
                    case "Update":
                        rowtools.move(args);
                        break;
                    case "CallBack":
                        calendar.rowMoveCallBack(args.source, args.target, args.position);
                        break;
                    case "PostBack":
                        calendar.rowMovePostBack(args.source, args.target, args.position);
                        break;
                    case "Notify":
                        rowtools.move(args);
                        calendar.rowMoveNotify(args.source, args.target, args.position);
                        break;
                }

                if (typeof calendar.onRowMoved === "function") {
                    calendar.onRowMoved(args);
                }
            }
            else {
                //rowtools.move(args);

                var source = calendar._createRowObject(source);
                var target = calendar._createRowObject(target);
                var position = position;

                switch (calendar.rowMoveHandling) {
                    case "CallBack":
                        calendar.rowMoveCallBack(source, target, position);
                        break;
                    case "PostBack":
                        calendar.rowMovePostBack(source, target, position);
                        break;
                    case "JavaScript":
                        calendar.onRowMove(source, target, position);
                        break;
                }

            }

        };

        /**
         * @param rows Array of strings (row IDs)
         * @private
         */
        this._loadSelectedRows = function(rows) {
            var list = DayPilot.list(rows);
            rowtools.selected = [];

            if (!list.isEmpty()) {
                calendar._cellPropertiesLazyLoading = false;
                calendar._expandCellProperties();
            }

            list.each(function(item) {
                var row = calendar._findRowByResourceId(item);
                if (row) {
                    rowtools.selected.push(row);
                }
            });
            rowtools._updateHighlighting();
        };

        this._rowtools = {};
        var rowtools = this._rowtools;
        
        rowtools.edit = function(row) {
            var input = rowtools._textarea(row);
        };

        rowtools.rowSelectLastSetDefault = function() {
            rowtools._rowSelectLast = {"row": calendar.rowlist[0], "index": 0};
        };

        rowtools.rowSelectSetLast = function(row) {
            var index = DayPilot.indexOf(calendar.rowlist, row);
            if (index === -1) {
                throw "DayPilot.Scheduler: Row not found when selecting a range";
            }
            rowtools._rowSelectLast = {"row": row, "index": index};
        };

        rowtools.fixRowSelectLast = function() {
            // nothing
            if (!rowtools._rowSelectLast) {
                rowtools.rowSelectLastSetDefault();
            }

            // from previous state
            var index = DayPilot.indexOf(calendar.rowlist, rowtools._rowSelectLast.row);

            if (index > -1) {
                return;
            }

            // the row isn't in the list - ._update() was called, try to find it
            var row = calendar._findRowByResourceId(rowtools._rowSelectLast.row.id);
            if (row) {
                index = DayPilot.indexOf(calendar.rowlist, row);
                rowtools._rowSelectLast = {"row": row, "index": index};
            }
            else {
                rowtools.rowSelectLastSetDefault();
            }
        };

        rowtools.createOverlay = function(row) {

            var width = calendar._getTotalRowHeaderWidth();
            var css = calendar._prefixCssClass("_rowmove_source");

            var div = DayPilot.Util.div(calendar.divHeader, 0, row.top, width, row.height);
            div.className = css;

            row.moveOverlay = div;

        };

        rowtools.deleteOverlay = function(row) {
            if (!row) {
                return;
            }
            DayPilot.de(row.moveOverlay);
            row.moveOverlay = null;
        };

        rowtools._textarea = function(row) {
            var r = rowtools._findTableRow(row);
            var c = r.cells[0];
            
            if (c.input) {
                return c.input;
            }

            DayPilot.Areas.disable(c.firstChild);
            
            var width = c.clientWidth;
            if (row.isNewRow) {
                width = calendar._getOuterRowHeaderWidth();
            }

            var input = document.createElement("textarea");
            input.style.position = "absolute";
            input.style.top = "0px";
            input.style.left = "0px";
            input.style.width = width + "px";
            input.style.height = row.height + "px";
            input.style.border = "0px none";
            input.style.overflow = "hidden";
            input.style.boxSizing = "border-box";
            input.style.resize = "none";
            input.style.paddingLeft = (row.level * calendar.treeIndent) + "px";
            //input.style.lineHeight = row.height + "px";

            var object = c.textDiv;
            input.style.fontFamily = DayPilot.gs(object, 'fontFamily') || DayPilot.gs(object, 'font-family');
            input.style.fontSize = DayPilot.gs(object, 'fontSize') || DayPilot.gs(object, 'font-size');

            input.value = row.name || "";
            c.firstChild.appendChild(input);
            c.input = input;
            
            var remove = function() {
                try {
                    c.input.parentNode.removeChild(c.input);
                }
                catch(e) {
                    doNothing();
                }
                c.input = null;
            };

            input.focus();
            input.onblur = function() {
                input.onblur = null;
                var newText = input.value;
                //var index = DayPilot.indexOf(calendar.rowlist, row);
                remove();
                DayPilot.Areas.enable(c.firstChild);
                calendar._rowEditDispatch(row, newText, input.canceled);
                /*if (!input.canceled) {
                    calendar._rowEditDispatch(row, newText);
                }*/
            };
            input.onkeydown = function(e) {
                var keynum = (window.event) ? event.keyCode : e.keyCode;
                
                if (keynum === 27) {
                    input.canceled = true;
                    remove();
                }
                if (keynum === 13) {
                    input.onblur();
                    return false;
                }  
                return true;
            };
            
            if (input.setSelectionRange) {
                input.setSelectionRange(0, 9999); // using this instead of .select() that is not fully supported in mobile Safari
            }
            else {
                input.select();
            }

            return input;
        };

        rowtools.selected = [];
        rowtools.select = function(row, ctrl, shift, meta) {

            var selected = DayPilot.indexOf(rowtools.selected, row) !== -1;

            if (ctrl || meta) {
                if (selected) {
                    rowtools.unselect(row);
                    DayPilot.rfa(rowtools.selected, row);
                    return;
                }
            }
            else {
                selected = false;
                rowtools.clearSelection();
            }

            rowtools._highlight(row);
            
            // selected list
            if (!selected) {
                rowtools.selected.push(row);
            }

            rowsel._updateInitialList();
            
        };

        rowtools.selectRange = function(startIndex, endIndex) {
            rowtools.clearSelection();

            var min = Math.min(startIndex, endIndex);
            var max = Math.max(startIndex, endIndex);

            for (var i = min; i <= max; i++) {
                var row = calendar.rowlist[i];
                rowtools._highlight(row);
                rowtools.selected.push(row);
            }

            rowsel._updateInitialList();

        };
        
        rowtools._updateHighlighting = function() {
            for (var i = 0; i < rowtools.selected.length; i++) {
                var row = rowtools.selected[i];
                rowtools._highlight(row);
            }
        };
        
        rowtools._highlight = function(row) {
            // cells
            var y = DayPilot.indexOf(calendar.rowlist, row);
            if (y === -1) {  // not found, search using id
                var target = calendar._findRowByResourceId(row.id);
                if (target) {
                    y = target.index;
                }
                else {
                    return;
                }
            }

            var cl = calendar._prefixCssClass("_cell_selected");

            var cells = [];
            for(var i = 0; i < calendar.itline.length; i++) {
                var c = {};
                c.x = i;
                c.y = y;
                cells.push(c);
            }
            calendar.cells.findXy(cells).addClass(cl);
            
            // header
            var cl = calendar._prefixCssClass("_rowheader_selected");
            var table = calendar.divHeader;
            for (var y = 0; y < table.rows.length; y++) {
                var r = table.rows[y];
                if (r && r.cells[0] && r.cells[0].row === row) {
                    for (var x = 0; x < r.cells.length; x++) {
                        var c = r.cells[x];
                        var first = c.firstChild;
                        DayPilot.Util.addClass(first, cl);
                    }
                }
            }
        };

        rowtools._getSelectedList = function() {
            var list = [];
            if (!rowtools.selected) {
                return list;
            }
            for(var i = 0; i < rowtools.selected.length; i++) {
                var row = rowtools.selected[i];
                var index = DayPilot.indexOf(calendar.rowlist, row);
                var r = calendar._createRowObject(row, index);
                list.push(r.toJSON());
            }
            return list;
        };
        
        rowtools.unselect = function(row) {
            // cells
            var cl = calendar._prefixCssClass("_cell_selected");
            var y = DayPilot.indexOf(calendar.rowlist, row);
            var cells = [];
            for(var i = 0; i < calendar.itline.length; i++) {
                var c = {};
                c.x = i;
                c.y = y;
                cells.push(c);
            }
            calendar.cells.findXy(cells).removeClass(cl);

            // header
            var cl = calendar._prefixCssClass("_rowheader_selected");
            var table = calendar.divHeader;
            var r = rowtools._findTableRow(row);
            if (r) {
                for (var x = 0; x < r.cells.length; x++) {
                    var c = r.cells[x];
                    var first = c.firstChild;
                    DayPilot.Util.removeClass(first, cl);
                }
            }
        };

        rowtools._rowSelectLast = null;
        
        rowtools.clearSelection = function() {
            
            for(var j = 0; j < rowtools.selected.length; j++) {
                var row = rowtools.selected[j];
                rowtools.unselect(row);
            }
            
            // clear the list
            rowtools.selected = [];
            calendar.selectedRows = [];
            //rowtools._rowSelectLast = null;
        };
        
        rowtools._findTableRow = function(row) {
            var table = calendar.divHeader;
            for (var y = 0; y < table.rows.length; y++) {
                var r = table.rows[y];
                if (r && r.cells[0] && r.cells[0].row === row) {
                    return r;
                }
            }
            return null;
        };
        
        // helper
        rowtools.selectById = function(id) {
            var row = calendar._findRowByResourceId(id);
            if (row) {
                rowtools.select(row);
            }
        };

        rowtools.startMoving = function(row) {
            var rowmoving = DayPilot.Global.rowmoving;
            rowmoving.row = row;
            rowmoving.sourceCalendar = calendar;
            rowmoving.cursor = calendar.divResScroll.style.cursor;
            calendar.divResScroll.style.cursor = "move";

            rowtools.createOverlay(row);
        };

        rowtools.resetMoving = function() {
            calendar.divResScroll.style.cursor = rowmoving.cursor;
            DayPilot.de(rowmoving.div);
            rowtools.deleteOverlay(rowmoving.row);
            DayPilot.Global.rowmoving = rowmoving = {};
        };

        rowtools.move = function(args) {

            // modify .resources
            var source = args.source.$.row.resource;
            var target = args.target.$.row.resource;
            var position = args.position;

            if (position === "forbidden") {
                return;
            }

            //var rowmoving = DayPilot.Global.rowmoving;

            // remove from source
            var sourceParent = args.source.calendar._restools.findParentArray(source);
            if (!sourceParent) {
                throw "Cannot find source node parent";
            }
            var sourceIndex = DayPilot.indexOf(sourceParent, source);
            sourceParent.splice(sourceIndex, 1);

            // move to target
            var targetParent = restools.findParentArray(target);
            if (!targetParent) {
                throw "Cannot find target node parent";
            }
            var targetIndex = DayPilot.indexOf(targetParent, target);

            switch (position) {
                case "before":
                    targetParent.splice(targetIndex, 0, source);
                    break;
                case "after":
                    targetParent.splice(targetIndex + 1, 0, source);
                    break;
                case "child":
                    if (!target.children) {
                        target.children = [];
                        target.expanded = true;
                    }
                    target.children.push(source);
                    break;
            }

            calendar.update();
        };

        var restools = {};
        this._restools = restools;

        restools.findParentArray = function(res) {
            return restools.findInArray(calendar.resources, res);
        };

        restools.findInArray = function(array, res) {
            if (DayPilot.indexOf(array, res) !== -1) {
                return array;
            }
            for(var i = 0; i < array.length; i++) {
                var r = array[i];
                if (r.children && r.children.length > 0) {
                    var parent = restools.findInArray(r.children, res);
                    if (parent) {
                        return parent;
                    }
                }
            }
            return null;
        };


        this._loadResources = function() {
            this.rowlist = DayPilot.list();

            var resources = this.resources;

            var force = this._serverBased();
            if (!force) {
                if (this.viewType === "Gantt") {
                    resources = this._loadResourcesGantt();
                }
                else if (this.viewType === "Days") {
                    resources = this._loadResourcesDays();
                }
            }

            if (force && this.viewType === "Days" && (!resources || resources.length === 0)) {
                resources = this._loadResourcesDays();
            }

            // pass by reference
            var index = {};
            index.i = 0;

            if (resources != null && !DayPilot.isArray(resources)) {
                throw "DayPilot.Scheduler.resources expects an array object";
            }

            this._loadResourceChildren(resources, index, 0, null, this.treeEnabled, false);

            //this._ensureFilteredParents();

            var newResourceRow = calendar.rowCreateHandling !== "Disabled";
            if (newResourceRow) {
                this._createNewResourceRow();
            }
            
            //this._updateSelectedRows();
        };

        /*
        this._ensureFilteredParents = function() {

            for (var i = 0; i < calendar.rowlist.length; i++) {

            }
        };
        */

        this._createNewResourceRow = function() {
            var r = {};
            r.id = "NEW";
            r.isNewRow = true;
            r.html = "";
            r.index = calendar.rowlist.length;
            //r.moveEnabled = false;
            r.loaded = true;
            r.start = this.startDate;
            r.children = [];
            r.height = calendar.eventHeight;
            r.marginBottom = 0;
            r.marginTop = 0;
            r.getHeight = function() {
                if (calendar.rowCreateHeight) {
                    return calendar.rowCreateHeight;
                }
                return calendar.eventHeight + calendar.rowMarginBottom + calendar.rowMarginTop;
                //return Math.max(calendar.rowMinHeight, calendar.eventHeight + calendar.rowMarginBottom);
            };
            r.putIntoLine = function() {};
            r.resetEvents = function() {};

            this.rowlist.push(r);
        };

        /*
        this._updateSelectedRows = function() {
            var list = [];
            for (var i = 0; i < calendar.rowlist.length; i++) {
                var row = calendar.rowlist[i];
                var id = row.id;
                if (rowtools._isSelected(id)) {
                    list.push(row);
                }
            }
            rowtools.selected = list;
        };
        */
        
        this._loadResourcesGantt = function() {
            var list = [];
            
            if (this._ganttAppendToResources && this.resources) {
                for (var i = 0; i < this.resources.length; i++) {
                    list.push(this.resources[i]);
                }
            }
            
            if (!this.events.list) {
                return;
            }
            
            //this.resources = [];
            for (var i = 0; i < this.events.list.length; i++) {
                var e = this.events.list[i];
                var r = {};
                r.id = e.id;
                r.name = e.text;
                list.push(r);
            }
            
            return list;
        };

        this._loadResourcesDays = function() {
            var list = [];
            var start = calendar._visibleStart();
            var locale = this._resolved.locale();
            for (var i = 0; i < this.days; i++) {
                //var d = this.startDate.addDays(i);
                var d = start.addDays(i);

                if (!calendar.showNonBusiness && !calendar.businessWeekends) {
                    if (d.dayOfWeek() == 0 || d.dayOfWeek() == 6) {
                        continue;
                    }
                }

                var r = {};
                r.name = d.toString(locale.datePattern, locale);
                r.start = d;
                list.push(r);
            }
            return list;
        };
        
        this._visibleStart = function() {
            if (this.itline && this.itline.length > 0) {
                return this.itline[0].start;
            }
            return this.startDate;
        };
        
        this._visibleEnd = function() {
            if (this.itline && this.itline.length > 0) {
                var end = calendar.itline[this.itline.length - 1].end;
                if (calendar.viewType !== "Days") {
                    return end;
                }
                return end.addDays(calendar.days - 1);
            }
            return calendar.startDate.addDays(calendar.days);
        };

/*
        this._detachedRow = {};
        var detachedRow = this._detachedRow;
*/

        this.visibleStart = function() {
            return this._visibleStart();
        };

        this.visibleEnd = function() {
            return this._visibleEnd();
        };

        this._createRowFromResource = function(res, parent) {
            var row = {};

            // defined values
            row.backColor = res.backColor;
            row.fontColor = res.fontColor;
            row.cssClass = res.cssClass;
            row.expanded = res.expanded;
            row.name = res.name;
            row.html = res.html ? res.html : row.name;
            row.eventHeight = typeof res.eventHeight !== 'undefined' ? res.eventHeight : calendar._resolved.eventHeight();
            row.minHeight = typeof res.minHeight !== 'undefined' ? res.minHeight : calendar.rowMinHeight;
            row.marginBottom = typeof res.marginBottom !== 'undefined' ? res.marginBottom : calendar.rowMarginBottom;
            row.marginTop = typeof res.marginTop !== 'undefined' ? res.marginTop : calendar.rowMarginTop;
            row.eventStackingLineHeight = typeof res.eventStackingLineHeight !== 'undefined' ? res.eventStackingLineHeight : calendar.eventStackingLineHeight;
            row.loaded = !res.dynamicChildren;  // default is true
            row.id = res.id || res.value;  // accept both id and value
            row.toolTip = res.toolTip;
            row.children = [];
            row.columns = [];
            row.start = res.start ? new DayPilot.Date(res.start) : this._visibleStart();
            row.isParent = res.isParent;
            row.contextMenu = res.contextMenu ? DayPilot.Util.evalVariable(res.contextMenu) : this.contextMenuResource;
            row.areas = res.areas;
            row.moveDisabled = res.moveDisabled;
            row.bubbleHtml = res.bubbleHtml;

            // custom properties
            row.tags = res.tags;

            // gantt
            row.task = res.task;

            // kanban
            row.swimlane = res.swimlane;
            row.hideEvents = res.hideEvents;

            // calculated
            row.height = row.eventHeight;  // TODO might not be necessary

            // reference to resource
            row.resource = res._data;

            // event ordering
            row.lines = [];
            row.blocks = [];

            row.isRow = true;

            // functions
            row.getHeight = function() {
                var height = 0;
                if (calendar.groupConcurrentEvents) {
                    for (var i = 0; i < this.blocks.length; i++) {
                        var block = this.blocks[i];
                        height = Math.max(height, block.getHeight());
                    }
                }
                else {
                    if (this.lines.length > 0) {
                        var last = this.lines.length - 1;
                        var line = this.lines[last];
                        var lheight = line.height || this.eventHeight;
                        var top = line.top || 0;
                        height = top + lheight;
                    }
                }
                if (height === 0) {
                    height = this.eventHeight;
                }
                return (height > this.minHeight) ? height : this.minHeight;
            };

            row.resetEvents = function() {
                var r = this;
                r.events = DayPilot.list();
                r.events.forRange = function(start, end) {
                    start = new DayPilot.Date(start);
                    end = new DayPilot.Date(end);
                    var result = DayPilot.list();
                    for (var i = 0; i < r.events.length; i++) {
                        var ev = r.events[i];
                        if (DayPilot.Util.overlaps(ev.start(), ev.end(), start, end)) {
                            result.push(ev);
                        }
                    }
                    return result;
                };
            };

            row.calculateUtilization = function() {
                var r = this;

                var sections = r.sections = getSections();
                for (var i = 0; i < sections.length; i++) {
                    var section = sections[i];
                    section.events = DayPilot.list();
                    //var test = section.start.addTime(1);
                    for (var x = 0; x < r.events.length; x++) {
                        var e = r.events[x];
                        if (DayPilot.Util.overlaps(section.start, section.end, e.start(), e.rawend())) {
                            section.events.push(e);
                        }
                    }
                    section.sum = function(name) {
                        var sum = 0;
                        for (var i = 0; i < this.events.length; i++) {
                            var e = this.events[i];
                            var value = 0;
                            if (typeof name === "undefined") {
                                value = 1;
                            }
                            else if (e.tag(name)) {
                                value = e.tag(name);
                            }
                            else if (e.data[name]) {
                                value = e.data[name];
                            }

                            if (typeof value === 'number') {
                                sum += value;
                            }
                        }
                        return sum;
                    }
                }

                function getPoints() {
                    var points = [];
                    for (var i = 0; i < r.events.length; i++) {
                        var e = r.events[i];
                        if (!DayPilot.contains(points, e.start().toString())) {
                            points.push(e.start().toString());
                        }
                        if (!DayPilot.contains(points, e.rawend().toString())) {
                            points.push(e.rawend().toString());
                        }
                    }

                    points.sort();
                    return points;
                }

                function getSections() {
                    var points = getPoints();
                    var sections = [];

                    var section = { "start": r.data.start};
                    for (var i = 0; i < points.length; i++) {
                        section.end = new DayPilot.Date(points[i]);
                        sections.push(section);
                        section = { "start": new DayPilot.Date(points[i])};
                    }
                    section.end = r.data.end;
                    sections.push(section);

                    sections.forRange = function(start, end) {
                        var list = DayPilot.list();
                        for (var i = 0; i < this.length; i++) {
                            var section = this[i];
                            if (DayPilot.Util.overlaps(start, end, section.start, section.end)) {
                                list.push(section);
                            }
                        }
                        list.maxSum = function(name) {
                            var max = 0;
                            for (var i = 0; i < this.length; i++) {
                                var section = this[i];
                                var sum = section.sum(name);
                                if (sum > max) {
                                    max = sum;
                                }
                            }
                            return max;
                        };
                        return list;
                    };

                    return sections;
                }
            };

            row.putIntoLine = function(ep) {
                var thisRow = this;

                for (var i = 0; i < this.lines.length; i++) {
                    var line = this.lines[i];
                    if (line.isFree(ep.part.left, ep.part.width)) {
                        line.add(ep);
                        return i;
                    }
                }

                var line = [];
                line.height = 0;
                line.add = function(ep) {
                    this.push(ep);

                    var pheight = ep.part._getHeightWithVersions();

                    if (pheight > line.height) {
                        line.height = pheight;
                    }

                };
                line.isFree = function(colStart, colWidth, except) {
                    //var free = true;
                    var end = colStart + colWidth - 1;
                    var max = this.length;

                    for (var i = 0; i < max; i++) {
                        var e = this[i];
                        if (!(end < e.part.left || colStart > e.part.left + e.part.width - 1)) {
                            if (DayPilot.contains(except, e.data)) {
                                continue;
                            }
                            return false;
                        }
                    }

                    return true;
                };

                line.add(ep);

                this.lines.push(line);

                return this.lines.length - 1;
            };

            row.putIntoBlock = function(ep) {

                for (var i = 0; i < this.blocks.length; i++) {
                    var block = this.blocks[i];
                    if (DayPilot.indexOf(block.events, ep) !== -1) {
                        return;
                    }
                    if (block.overlapsWith(ep.part.left, ep.part.width)) {
                        //block.putIntoLine(ep);
                        block.events.push(ep);
                        ep.part.block = block;
                        block.min = Math.min(block.min, ep.part.left);
                        block.max = Math.max(block.max, ep.part.left + ep.part.width);
                        return i;
                    }
                }

                // no suitable block found, create a new one
                var block = {};
                block.expanded = false;
                block.row = this;
                block.events = DayPilot.list();
                block.lines = DayPilot.list();

                block.putIntoLine = function(ep) {
                    var thisCol = this;

                    for (var i = 0; i < this.lines.length; i++) {
                        var line = this.lines[i];
                        if (line.isFree(ep.part.left, ep.part.width)) {
                            line.add(ep);
                            return i;
                        }
                    }

                    var line = [];
                    line.height = 0;
                    line.add = function(ep) {
                        this.push(ep);
                        if (ep.part.height > line.height) {
                            line.height = ep.part.height;
                        }
                    };
                    line.isFree = function(start, width) {
                        //var free = true;
                        var end = start + width - 1;
                        var max = this.length;

                        for (var i = 0; i < max; i++) {
                            var e = this[i];
                            if (!(end < e.part.left || start > e.part.left + e.part.width - 1)) {
                                return false;
                            }
                        }

                        return true;
                    };

                    line.add(ep);

                    this.lines.push(line);

                    //return this.lines.length - 1;

                };

                block.overlapsWith = function(start, width) {
                    var end = start + width - 1;

                    if (!(end < this.min || start > this.max - 1)) {
                        return true;
                    }

                    return false;
                };

                block.getHeight = function() {
                    if (!this.expanded) {
                        return calendar.eventHeight;
                    }
                    if (this.lines.length > 0) {
                        var last = this.lines.length - 1;
                        var line = this.lines[last];
                        var lheight = line.height || calendar.eventHeight;
                        var top = line.top || 0;
                        return top + lheight;
                    }
                    else {
                        return calendar.eventHeight;
                    }
                };

                block.clear = function() {
                    block.events = DayPilot.list();
                    block.min = null;
                    block.max = null;
                };

                //block.putIntoLine(ep);
                block.events.push(ep);
                ep.part.block = block;
                block.min = ep.part.left;
                block.max = ep.part.left + ep.part.width;

                this.blocks.push(block);

                //return this.blocks.length - 1;
            };

            row._hiddenUsingFilter = false;
            row._makeVisibleParent = parent;
            row._makeVisibleOnFilter = function() {
                /*
                 if (this._makeVisibleDefaultHidden) {
                 return;
                 }
                 */
                this.hidden = !this._allParentsExpanded();
                this._hiddenUsingFilter = false;
                if (this._makeVisibleParent) {
                    this._makeVisibleParent._makeVisibleOnFilter();
                }
            };

            row._allParentsExpanded = function() {
                if (!this._makeVisibleParent) {  // top
                    return true;
                }
                return this._makeVisibleParent._allParentsExpanded() && this._makeVisibleParent.expanded;
            };

            if (res.columns) {
                for (var j = 0; j < res.columns.length; j++) {
                    row.columns.push(res.columns[j]); // plain copy, it's the same structure
                }
            }

            return row;

        };


        /*this._doRowFilter = function(row) {

        };*/

        this._filterRows = function() {

            calendar.rowlist.each(function(row) {
                if (typeof calendar.onRowFilter === "function" && calendar.rows._filterParams) {
                    var parent = row._makeVisibleParent;
                    var args = {};
                    //args.visible = !hidden;
                    args.visible = true;
                    args.row = calendar._createRowObject(row);
                    args.filter = calendar.rows._filterParams;

                    calendar.onRowFilter(args);

                    row._hiddenUsingFilter = !args.visible;
                    if (!args.visible) {
                        row.hidden = true;
                    }
                    else {
                        if (parent) {
                            parent._makeVisibleOnFilter();
                        }
                    }
                }
            });
        };

        this._loadResourceChildren = function(resources, index, level, parent, recursively, hidden) {
            if (!resources) {
                return;
            }

            for (var i = 0; i < resources.length; i++) {
                if (!resources[i]) {
                    continue;
                }
                var additional = {};
                additional.level = level;
                additional.hidden = hidden;
                additional.index = index.i;

                //var res = this._createBeforeResHeaderRenderArgs(resources[i], additional);

                if (resources[i].hidden) {
                    continue;
                }

                var res = this._doBeforeResHeaderRender(resources[i], additional);

                var row = calendar._createRowFromResource(res, parent);

                if (hidden) {
                    row.hidden = true;
                }

                row.level = level;
                row.index = index.i;

                if (parent !== null) {
                    parent.children.push(index.i);
                }

                this.rowlist.push(row);

                index.i++;

                if (recursively && res.children && res.children.length) {
                    //this.hasChildren = true;
                    //var hiddenChildren = row.hidden || !row.expanded;
                    var hiddenChildren = hidden || !row.expanded;
                    this._loadResourceChildren(res.children, index, level + 1, row, true, hiddenChildren);
                }
            }
        };

        this._columnProps = ['html', 'backColor', 'cssClass', 'areas', 'horizontalAlignment'];

        this._doBeforeRowHeaderRender = function(row) {
            if (row.isNewRow) {
                return {
                    "row": {
//                        "children": [],
                        "cssClass": calendar._prefixCssClass("_row_new"),
                        "moveDisabled": true,
                        "html": calendar.rowCreateHtml || ""
                    }
                };
            }


            var args = {};
            args.row = this._createRowObject(row);
            //args.client = {};

            DayPilot.Util.copyProps(row, args.row, ['html', 'backColor', 'fontColor', 'cssClass', 'toolTip', 'contextMenu', 'moveDisabled']);
            args.row.columns = DayPilot.Util.createArrayCopy(row.columns, calendar._columnProps);
            args.row.areas = DayPilot.Util.createArrayCopy(row.areas);

            if (typeof args.row.columns === 'undefined' && calendar.rowHeaderColumns && calendar.rowHeaderColumns.length > 0) {
                r.columns = [];
                for (var i = 0; i < calendar.rowHeaderColumns.length; i++) {
                    r.columns.push({});
                }
            }

            if (typeof this.onBeforeRowHeaderRender === "function") {
                this.onBeforeRowHeaderRender(args);
            }

            return args;
        };

        this._doBeforeResHeaderRender = function(res, additional) {
            var r = this._createBeforeResHeaderRenderArgs(res, additional);

            if (typeof this.onBeforeResHeaderRender === 'function') {
                var args = {};
                args.resource = r;
                this.onBeforeResHeaderRender(args);
            }
            return r;
        };
        
        this._createBeforeResHeaderRenderArgs = function(res, additional) {
            var r = {
                get data() { return this._data; }
            };

            // extra properties like level, index, hidden
            for (var name in additional) {
                r[name] = additional[name];
            }

            // shallow copy
            // TODO resolve children, columns
            for (var name in res) {
                r[name] = res[name];
            }

            if (typeof res.html === 'undefined') {
                r.html = res.name;
            }

            if (typeof r.columns === 'undefined' && calendar.rowHeaderColumns && calendar.rowHeaderColumns.length > 0) {
                r.columns = [];
                for (var i = 0; i < calendar.rowHeaderColumns.length; i++) {
                    r.columns.push({});
                }
            }

            r._data = res;

            return r;
        };


        this._initPrepareDiv = function() {
            this._loadTop();
            this.nav.top.dp = this;
            this.nav.top.innerHTML = "";  // TODO remove
            DayPilot.Util.addClass(this.nav.top, this._prefixCssClass("_main"));


            this.nav.top.setAttribute("role", "region");
            this.nav.top.setAttribute("aria-label", "scheduler");

            if (DayPilot.browser.ie9) {
                DayPilot.Util.addClass(this.nav.top, this._prefixCssClass("_browser_ie9"));
            }
            if (DayPilot.browser.ie8) {
                DayPilot.Util.addClass(this.nav.top, this._prefixCssClass("_browser_ie8"));
            }

            this.nav.top.style.MozUserSelect = 'none';
            this.nav.top.style.KhtmlUserSelect = 'none';
            this.nav.top.style.webkitUserSelect = 'none';

            this.nav.top.style.WebkitTapHighlightColor = "rgba(0,0,0,0)";
            this.nav.top.style.WebkitTouchCallout = "none";

            if (this.width) {
                this.nav.top.style.width = this.width;
            }
            if (this.heightSpec === "Parent100Pct") {
                this.nav.top.style.height = "100%";
            }
            //this.nav.top.style.boxSizing = "border-box";
            this.nav.top.style.lineHeight = "1.2";
            this.nav.top.style.position = "relative";

            if (!this.visible) {
                this.nav.top.style.display = "none";
            }

            this.nav.top.onmousemove = this._onTopMouseMove;
            this.nav.top.onmouseout = function() { calendar._cancelAutoexpand(); };

            this.nav.top.ontouchstart = touch.onMainTouchStart;
            this.nav.top.ontouchmove = touch.onMainTouchMove;
            this.nav.top.ontouchend = touch.onMainTouchEnd;

            if (this.hideUntilInit && this.backendUrl) {
                this.nav.top.style.visibility = 'hidden';
            }
            var rowHeaderWidth = this._getOuterRowHeaderWidth();

            var layout = this._resolved.layout();
            if (layout === 'DivBased') {
                // left
                var left = document.createElement("div");
                //left.style.cssFloat = "left";
                //left.style.styleFloat = "left";  // IE7
                left.style.position = "absolute";
                left.style.left = "0px";
                left.style.width = (rowHeaderWidth) + "px";

                left.appendChild(this._drawCorner());

                // divider horizontal
                var dh1 = document.createElement("div");
                dh1.style.height = "1px";
                dh1.className = this._prefixCssClass("_divider_horizontal");
                left.appendChild(dh1);
                this.nav.dh1 = dh1;

                left.appendChild(this._drawResScroll());
                this.nav.left = left;

                // divider                
                var divider = document.createElement("div");
                divider.style.position = "absolute";
                divider.style.left = (rowHeaderWidth) + "px";
                //divider.style.cssFloat = "left";
                //divider.style.styleFloat = "left";  // IE7
                divider.style.width = resolved.splitterWidth() + "px";
                divider.style.height = (this._getTotalHeaderHeight() + this._getScrollableHeight()) + "px";
                divider.className = this._prefixCssClass("_divider") + " " + this._prefixCssClass("_splitter");  // TODO _divider is obsolete
                divider.setAttribute("unselectable", "on");
                this.nav.divider = divider;

                // maybe not the best place
                if (this.rowHeaderScrolling) {
                    this._activateSplitter();
                }

                // right
                var right = document.createElement("div");
                right.style.marginLeft = (rowHeaderWidth + resolved.splitterWidth()) + "px";
                right.style.marginRight = '1px';
                right.style.position = 'relative';

                right.appendChild(this._drawTimeHeaderDiv());
                this.nav.right = right;

                // divider horizontal #2
                var dh2 = document.createElement("div");
                dh2.style.height = "1px";
                dh2.style.position = "absolute";
                dh2.style.top = this._getTotalHeaderHeight() + "px";
                dh2.style.width = "100%";
                dh2.className = this._prefixCssClass("_divider_horizontal");
                right.appendChild(dh2);
                this.nav.dh2 = dh2;

                right.appendChild(this._drawMainContent());

                // clear
                var clear = document.createElement("div");
                clear.style.clear = 'left';

                // add all at once
                this.nav.top.appendChild(left);
                this.nav.top.appendChild(divider);
                this.nav.top.appendChild(right);
                this.nav.top.appendChild(clear);
            }
            else {
                var table = document.createElement("table");
                table.cellPadding = 0;
                table.cellSpacing = 0;
                table.border = 0;

                // required for proper width measuring (onresize)
                table.style.position = 'absolute';

                var row1 = table.insertRow(-1);

                var td1 = row1.insertCell(-1);
                td1.appendChild(this._drawCorner());

                var td2 = row1.insertCell(-1);
                td2.appendChild(this._drawTimeHeaderDiv());

                var row2 = table.insertRow(-1);

                var td3 = row2.insertCell(-1);
                td3.appendChild(this._drawResScroll());

                var td4 = row2.insertCell(-1);
                td4.appendChild(this._drawMainContent());

                this.nav.top.appendChild(table);
            }

            // hidden fields
            this._vsph = document.createElement("div");
            //this.vsph.id = this.id + "_vsph";
            this._vsph.style.display = "none";
            this.nav.top.appendChild(this._vsph);

            if (this._isAspnetWebForms()) {
                var stateInput = document.createElement("input");
                stateInput.type = "hidden";
                stateInput.id = this.id + "_state";
                stateInput.name = this.id + "_state";
                this.nav.state = stateInput;
                this.nav.top.appendChild(stateInput);
            }

            var margin = 5;

            var loading = document.createElement("div");
            loading.style.position = 'absolute';
            loading.style.left = (this._getOuterRowHeaderWidth() + resolved.splitterWidth() + 5) + "px";
            loading.style.top = (this._getTotalHeaderHeight() + 5) + "px";
            loading.style.display = 'none';
            loading.innerHTML = this.loadingLabelText;

            DayPilot.Util.addClass(loading, this._prefixCssClass("_loading"));

            this.nav.loading = loading;
            this.nav.top.appendChild(loading);

            this._drawRowHeaderHideIcon();
        };

        this._onTopMouseMove = function(ev) {
            if (rowmoving.row) {
                var coords = DayPilot.mo3(calendar.divHeader, ev);
                var ri = calendar._getRow(coords.y);
                var row = calendar.rowlist[ri.i];
                if (!row) {
                    return;
                }
                if (row.isNewRow) {
                    return;
                }
                var relative = coords.y - ri.top;
                var rowheight = ri.bottom - ri.top;
                var third1 = rowheight/3;
                var third2 = third1*2;
                var mid = rowheight/2;
                var position = "before";
                var hasChildren = row.children && row.children.length > 0;
                var sourceInParents = (function() {
                    var i = ri.i;
                    var lastlevel = row.level;
                    while (i >= 0) {
                        var r = calendar.rowlist[i];
                        i--;

                        if (lastlevel <= r.level) {
                            continue;
                        }
                        if (r === rowmoving.row) {
                            return true;
                        }
                        if (r.level === 0) {
                            return false;
                        }
                        lastlevel = r.level;
                    }
                    return false;
                })();
                
                var childEnabled = calendar.treeEnabled;
                if (sourceInParents || ri.i === rowmoving.row.index) {
                    position = "forbidden";
                }
                else if (childEnabled) {
                    if (hasChildren) {
                        if (relative < mid) {
                            position = "before";
                        }
                        else {
                            position = "child";
                        }
                    }
                    else {
                        if (relative < third1) {
                            position = "before";
                        }
                        else if (relative < third2) {
                            position = "child";
                        }
                        else {
                            position = "after";
                        }
                    }
                }
                else {
                    if (hasChildren) {
                        position = "before";
                    }
                    else {
                        if (relative < mid) {
                            position = "before";
                        }
                        else {
                            position = "after";
                        }
                    }
                }

                if (rowmoving.row.moveDisabled) {
                    position = "forbidden";
                }

                rowmoving.calendar = calendar;
                rowmoving.source = rowmoving.row;
                rowmoving.target = calendar.rowlist[ri.i];
                rowmoving.position = position;

                var changed = (function() {
                    if (!rowmoving.last) {
                        return true;
                    }
                    if (rowmoving.last.target !== rowmoving.target) {
                       return true;
                    }
                    if (rowmoving.last.position !== rowmoving.position) {
                        return true;
                    }
                    return false;
                })();

                if (changed) {
                    if (typeof calendar.onRowMoving === 'function') {
                        var args = {};
                        args.source = calendar._createRowObject(rowmoving.source);
                        args.target = calendar._createRowObject(rowmoving.target);
                        args.position = position;

                        calendar.onRowMoving(args);

                        rowmoving.position = args.position;
                    }
                }
                else if (rowmoving.last) {
                    rowmoving.position = rowmoving.last.position;
                }

                rowmoving.last = {};
                rowmoving.last.target = rowmoving.target;
                rowmoving.last.position = rowmoving.position;

                (function drawRowPosition() {
                    if (rowmoving.div) {
                        DayPilot.de(rowmoving.div);
                    }
                    var top = ri.top;
                    var pos = rowmoving.position;
                    var ro = calendar.rowlist[ri.i];
                    var level = ro.level;
                    var left = level * calendar.treeIndent;

                    switch (pos) {
                        case "before":
                            top = ri.top;
                            break;
                        case "child":
                            top = ri.top + mid;
                            //left += calendar.treeIndent;
                            break;
                        case "after":
                            top = ri.bottom;
                            break;
                        case "forbidden":
                            top = ri.top + mid;
                            break;
                    }

                    var width = calendar._getTotalRowHeaderWidth() - left;

                    var position = document.createElement("div");
                    position.style.position = "absolute";
                    position.style.left = left + "px";
                    position.style.width = width + "px";
                    //position.style.height = "2px";
                    position.style.top = top + "px";
                    //position.style.backgroundColor = "#999";

                    position.className = calendar._prefixCssClass("_rowmove_position_" + pos);

                    rowmoving.div = position;
                    calendar.divResScroll.appendChild(position);

                    /*
                    if (pos === 'child') {
                        var plus = document.createElement("div");
                        plus.style.position = "absolute";
                        plus.style.left = left + "px";
                        plus.style.top = top + "px";
                        plus.style.color = "#999";
                        plus.innerHTML = "+";
                        calendar.divResScroll.appendChild(plus);

                        rowmoving.div = [];
                        rowmoving.div.push(position);
                        rowmoving.div.push(plus);
                    }
                    else if (pos === 'forbidden') {
                        var plus = document.createElement("div");
                        plus.style.position = "absolute";
                        plus.style.left = left + "px";
                        plus.style.top = top + "px";
                        plus.style.color = "red";
                        plus.innerHTML = "x";
                        calendar.divResScroll.appendChild(plus);

                        rowmoving.div = [];
                        rowmoving.div.push(position);
                        rowmoving.div.push(plus);
                    }
                    */
                })();
            }
            else if (DayPilotScheduler.splitting) {
                var width = DayPilot.mo3(calendar.nav.top, ev).x;
                var max = calendar._getTotalRowHeaderWidth();
                var newWidth = Math.min(max, width - 1);
                calendar.rowHeaderWidth = newWidth;
                calendar._rowHeaderHidden = false;
                calendar._updateRowHeaderWidthOuter();
            }
        };
        

        // update all positions that depend on header height
        this._updateHeaderHeight = function() {
            var height = this._getTotalHeaderHeight();

            this.nav.corner.style.height = (height) + "px";
            //this.divCorner.style.height = (height) + "px";

            this.divTimeScroll.style.height = height + "px";
            this.divNorth.style.height = height + "px";
            if (this.nav.dh1 && this.nav.dh2) {
                this.nav.dh1.style.top = height + "px";
                this.nav.dh2.style.top = height + "px";
            }

            this.nav.loading.style.top = (height + 5) + "px";
            this.nav.scroll.style.top = (height + 1) + "px";
        };


        this._getOuterRowHeaderWidth = function() {
            if (this._rowHeaderHidden) {
                return 0;
            }

            var result = 0;

            var fixed = this.rowHeaderScrolling;
            if (fixed) {
                result = this.rowHeaderWidth;
            }
            else {
                result = this._getTotalRowHeaderWidth();
            }

            return result;
        };

        this._activateSplitter = function() {
            var div = this.nav.divider;
            div.style.cursor = "col-resize";
            div.setAttribute("unselectable", "on");

            div.onmousedown = function(ev) {
                var splitting = DayPilotScheduler.splitting = {};
                splitting.cursor = calendar.nav.top.style.cursor;
                splitting.cleanup = function() {
                    calendar.nav.top.style.cursor = splitting.cursor;
                    if (typeof calendar.onRowHeaderResized === "function") {
                        var args = {};
                        calendar.onRowHeaderResized(args);
                    }
                };
                calendar.nav.top.style.cursor = "col-resize";
                return false;
            };
        };

        this._updateRowHeaderWidthOuter = function() {
            var dividerWidth = resolved.splitterWidth();

            var width = this._getOuterRowHeaderWidth();
            this.nav.corner.style.width = width + "px";
            this.divCorner.style.width = width + "px";
            this.divResScroll.style.width = width + "px";

            if (resolved.layout() === "DivBased") {
                this.nav.left.style.width = (width) + "px";
                this.nav.divider.style.left = (width - dividerWidth) + "px";
                this.nav.right.style.marginLeft = (width) + "px";
            }

            if (this.nav.message) {
                this.nav.message.style.left = (width + dividerWidth) + "px";
            }
            if (this.nav.loading) {
                this.nav.loading.style.left = (width + dividerWidth + 5) + "px";
            }
            if (this.nav.hideIcon) {
                var hi = this.nav.hideIcon;
                var showCss = calendar._prefixCssClass("_header_icon_show");
                var hideCss = calendar._prefixCssClass("_header_icon_hide");
                hi.style.left = (width - 1) + "px";
                if (calendar._rowHeaderHidden) {
                    DayPilot.Util.removeClass(hi, hideCss);
                    DayPilot.Util.addClass(hi, showCss);
                }
                else {
                    DayPilot.Util.removeClass(hi, showCss);
                    DayPilot.Util.addClass(hi, hideCss);
                }
            }
        };

        this._updateRowHeaderWidthInner = function() {
            this._loadRowHeaderColumns();
            var total = this._getTotalRowHeaderWidth();

            var updateCell = function(cell, width, left) {
                if (!cell || !cell.style) {
                    return;
                }
                var div = cell.firstChild;
                if (calendar._resHeaderDivBased) {
                    cell.style.width = width + "px";
                    div.style.width = width + "px";
                    if (typeof left === "number") {
                        cell.style.left = left + "px";
                    }
                }
                else {
                    div.style.width = width + "px";
                }
            };

            var table = this.divHeader;
            table.style.width = total + "px";

            var range = calendar._getAreaRowsWithMargin();

            for (var i = range.start; i < range.end; i++) {
                var row = table.rows[i];

                if (!row) {
                    continue;
                }

                var cell = row.cells[0];
                if (cell.colSpan > 1) {
                    var cell = row.cells[0];
                    updateCell(cell, total);
                }
                else {
                    if (this.rowHeaderCols) {
                        var left = 0;
                        for (var j = 0; j < row.cells.length; j++) {
                            var width = this.rowHeaderCols[j];
                            var cell = row.cells[j];
                            updateCell(cell, width, left);
                            left += width;
                        }
                    }
                    else {
                        var width = this.rowHeaderWidth;
                        var cell = row.cells[0];
                        updateCell(cell, width);
                    }
                }

            }

            if (calendar.nav.resScrollSpace) {
                calendar.nav.resScrollSpace.style.width = total + "px";
            }

            this._crosshairHide(); // update

        };

        this._updateRowHeaderWidth = function() {
            this._updateRowHeaderWidthOuter();
            this._updateRowHeaderWidthInner();
        };
        
        
        this._drawHeaderColumns = function() {
            var div = calendar.nav.corner;
            var props = this.rowHeaderColumns;

            var scroll = document.createElement("div");
            scroll.style.position = "absolute";
            scroll.style.bottom = "0px";
            scroll.style.left = "0px";
            scroll.style.width = "100%";
            scroll.style.height = resolved.headerHeight() + "px";
            scroll.style.overflow = "hidden";
            calendar.nav.columnScroll = scroll;

            var row = document.createElement("div");
            row.style.position = "absolute";
            row.style.bottom = "0px";
            row.style.left = "0px";
            row.style.width = "5000px";
            //row.style.width = "100%";
            row.style.height = resolved.headerHeight() + "px";
            row.style.overflow = "hidden";
            row.className = this._prefixCssClass("_columnheader");
            scroll.appendChild(row);

            var inner = document.createElement("div");
            inner.style.position = "absolute";
            inner.style.top = "0px";
            inner.style.bottom = "0px";
            inner.style.left = "0px";
            inner.style.right = "0px";
            inner.className = this._prefixCssClass("_columnheader_inner");
            row.appendChild(inner);

            if (calendar._splitter) {
                calendar._splitter.dispose();
                calendar._splitter = null;
            }

            var splitter = new DayPilot.Splitter(inner);
            splitter.widths = DayPilot.Util.propArray(props, "width", calendar.rowHeaderColumnDefaultWidth);
            splitter.height = resolved.headerHeight();
            splitter.css.title = this._prefixCssClass("_columnheader_cell");
            splitter.css.titleInner = this._prefixCssClass("_columnheader_cell_inner");
            splitter.css.splitter = this._prefixCssClass("_columnheader_splitter");

            // splitter.titles = DayPilot.Util.propArray(props, "title");
            splitter.titles = DayPilot.list(props).map(function(col) {
                return col.html || col.name || col.title || "";
            });

            splitter.updating = function(args) {
                //calendar.rowHeaderCols = this.widths;
                DayPilot.Util.updatePropsFromArray(calendar.rowHeaderColumns, "width", this.widths);
                calendar._updateRowHeaderWidth();
                if (calendar.cellWidthSpec === "Auto") {

                }
            };
            splitter.updated = function(rargs) {
                calendar._updateAutoCellWidth();

                if (calendar._api2()) {
                    if (typeof calendar.onRowHeaderColumnResized === "function") {
                        var args = {};
                        args.column = calendar.rowHeaderColumns[rargs.index];
                        calendar.onRowHeaderColumnResized(args);
                    }
                }
                else {
                    switch (calendar.rowHeaderColumnResizedHandling) {
                        case "CallBack":
                            break;
                        case "PostBack":
                            break;
                        case "JavaScript":
                            if (typeof calendar.onRowHeaderColumnResized === "function") {
                                var args = {};
                                args.column = calendar.rowHeaderColumns[rargs.index];
                                calendar.onRowHeaderColumnResized(args);
                            }
                            break;
                    }
                }
            };
            splitter.color = '#000000';
            splitter.opacity = 30;
            //splitter.height = 19;
            splitter.init();

            div.appendChild(scroll);
            this._splitter = splitter;
        };
        
        this._updateCorner = function() {
            var div = this.nav.corner;
            div.innerHTML = '';
            div.className = this._prefixCssClass('_corner');

            var inner = document.createElement("div");
            inner.style.position = "absolute";
            inner.style.top = "0px";
            inner.style.left = "0px";
            inner.style.right = "0px";
            inner.style.bottom = "0px";
            inner.className = this._prefixCssClass('_corner_inner');
            this.divCorner = inner;
            inner.innerHTML = '&nbsp;';
    
            if (this.rowHeaderColumns && this.rowHeaderColumns.length > 0) {
                var mini = document.createElement("div");
                mini.style.position = "absolute";
                mini.style.top = "0px";
                mini.style.left = "0px";
                mini.style.right = "0px";
                mini.style.bottom = (resolved.headerHeight() + 1) + "px";
                div.appendChild(mini);
                
                var divider = document.createElement("div");
                divider.style.position = "absolute";
                divider.style.left = "0px";
                divider.style.right = "0px";
                divider.style.height = "1px";
                divider.style.bottom = (resolved.headerHeight()) + "px";
                divider.className = this._prefixCssClass("_divider");
                div.appendChild(divider);
                
                mini.appendChild(inner);

                this._drawHeaderColumns();
            }
            else {
                div.appendChild(inner);
            }

            var inner2 = document.createElement("div");
            inner2.style.position = 'absolute';
            inner2.style.padding = '2px';
            inner2.style.top = '0px';
            inner2.style.left = '1px';
            inner2.style.backgroundColor = "#FF6600";
            inner2.style.color = "white";
            inner2.innerHTML = "\u0044\u0045\u004D\u004F";

            if (DayPilot.Util.isNullOrUndefined("K5woOes")) div.appendChild(inner2);
        };

        this._drawRowHeaderHideIcon = function() {

            /*if (!this.rowHeaderHideIconEnabled) {
                return;
            }*/

            var marginTop = 3;

            var left = this._getOuterRowHeaderWidth() + resolved.splitterWidth() - 1;
            var width = 10;
            var height = 20;
            var top = this._getTotalHeaderHeight() + marginTop;

            var div = DayPilot.Util.div(this.nav.top, left, top, width, height);
            //div.style.backgroundColor = "gray";
            div.style.cursor = "pointer";
            div.className = calendar._prefixCssClass("_header_icon");
            DayPilot.Util.addClass(div, calendar._prefixCssClass("_header_icon_hide"));
            div.onclick = function() {
                calendar.rows.headerToggle();
            };
            this.nav.hideIcon = div;
        };

        this._updateRowHeaderHideIconVisibility = function() {
            if (!calendar.nav.hideIcon) {
                return;
            }
            if (calendar.rowlist.length > 0  && calendar.rowHeaderHideIconEnabled) {
                calendar.nav.hideIcon.style.display = '';
            }
            else {
                calendar.nav.hideIcon.style.display = 'none';
            }
        };

        this._drawCorner = function() {
            var rowHeaderWidth = this._getOuterRowHeaderWidth();

            var div = document.createElement("div");
            calendar.nav.corner = div;
            div.style.width = rowHeaderWidth + "px";
            div.style.height = (this._getTotalHeaderHeight()) + "px";
            div.style.overflow = 'hidden';
            div.style.position = 'relative';
            div.setAttribute("unselectable", "on");
            div.onmousemove = function() { calendar._out(); };
            div.oncontextmenu = function() { return false; };
            
            this._updateCorner();

            return div;
        };

        this._getTotalHeaderHeight = function() {
            if (calendar.timeHeaders) {
                var last = dim.timeHeader(calendar.timeHeaders.length - 1);
                return last.top + last.height;
            }
            else if (this.timeHeader) {
                return calendar.timeHeader.length * resolved.headerHeight();
            }
            else {
                return 0;
            }
            //return 2 * resolved.headerHeight();
        };

        this._rowHeaderScrollSyncTimeout = null;

        this._resolveScrollStep = function() {
            return calendar.scrollStep || calendar.eventHeight;
        };

        this._drawResScroll = function() {
            var div = document.createElement("div");
            div.style.width = (this._getOuterRowHeaderWidth()) + "px";
            div.style.height = this._getScrollableHeight() + "px";
            div.style.overflow = 'hidden';
            div.style.position = 'relative';
            div.className = calendar._prefixCssClass("_rowheader_scroll"); // divResScroll

            var step = calendar._resolveScrollStep();

            var mobile = navigator.userAgent.indexOf("Mobile") !== -1;
            //var noscrollbar = calendar._noScrollbarBrowser();
            if (mobile) {
                div.style.overflowY = "auto";
            }

            div.onmousemove = function() {
                calendar._out();
            };
            div.onscroll = function() {
                if (calendar.nav.columnScroll && calendar.rowHeaderScrolling) {
                    calendar.nav.columnScroll.scrollLeft = div.scrollLeft;
                }
                if (calendar._rowHeaderScrollSyncTimeout) {
                    clearTimeout(calendar._rowHeaderScrollSyncTimeout);
                }

                if (mobile) {
                    var maxScrollY = calendar._getScrollableInnerHeight() - calendar.nav.scroll.offsetHeight;
                    div.scrollTop = Math.min(div.scrollTop, maxScrollY);
                    calendar.nav.scroll.scrollTop = div.scrollTop;
                }
                else {
                    calendar._rowHeaderScrollSyncTimeout = setTimeout(function() {
                        if (calendar && calendar.nav && calendar.nav.scroll && div) {
                            calendar.nav.scroll.scrollTop = div.scrollTop;
                        }
                    }, 500);
                }
            };
            div.addEventListener("wheel", function(ev) {
                var delta;
                if (calendar.overrideWheelScrolling) {
                    delta = ev.deltaY > 0 ? step : -step;
                }
                else {
                    delta = ev.deltaY;
                }
                calendar.nav.scroll.scrollTop = div.scrollTop + delta;
                ev.preventDefault && ev.preventDefault();
            }, false);

            // DayPilot.browser.passiveEvents ? { "passive": false} : false

            div.oncontextmenu = function() { return false; };

            div.onmouseenter = function() {
                if (calendar.rowHeaderScrolling) {
                    div.style.overflowX = "auto";
                }
            };

            div.onmouseleave = function() {
                if (calendar.rowHeaderScrolling) {
                    div.style.overflowX = "hidden";
                }
            };

            div.setAttribute("role", "region");
            div.setAttribute("aria-label", "scheduler rows");

            this.divResScroll = div;

            this._scrollRes = div;

            return div;
        };

        this._setRightColWidth = function(div) {
            if (resolved.layout() === 'TableBased') {
                var width = parseInt(this.width, 10);
                var isPercentage = isNaN(width) || (this.width.indexOf("%") !== -1);
                var isIE = /MSIE/i.test(navigator.userAgent);
                var rowHeaderWidth = this._getTotalRowHeaderWidth();

                if (isPercentage) {
                    if (this.nav.top && this.nav.top.offsetWidth > 0) {
                        div.style.width = (this.nav.top.offsetWidth - 6 - rowHeaderWidth) + "px";
                    }
                }
                else {  // fixed
                    div.style.width = (width - rowHeaderWidth) + "px";
                }
            }
        };

        this._onWindowResize = function(ev) {
            calendar._resize();
            calendar._onScroll();
        };

        this._resize = function() {

            if (calendar._resolved.layout() === 'TableBased') {
                calendar._setRightColWidth(calendar.nav.scroll);
                calendar._setRightColWidth(calendar.divTimeScroll);
            }

            calendar._updateHeight();
            calendar._updateAutoCellWidth();

            calendar._updateSelectionPosition();

            calendar._cache.drawArea = null;
        };

        this._wd = null;
        this._widthChangeDetectionInterval = null;
        this._watchWidthChanges = function() {
            if (!calendar.watchWidthChanges) {
                return;
            }
            if (calendar._widthChangeDetectionInterval) {
                return;
            }
            this._widthChangeDetectionInterval = setInterval(function() {
                if (!calendar.nav || !calendar.nav.top) {  // disposed object
                    clearInterval(calendar._widthChangeDetectionInterval);
                    return;
                }
                if (!calendar._wd) {
                    calendar._wd = {};
                    calendar._wd.counter = 0;
                    calendar._wd.changed = false;
                    calendar._wd.width = calendar.nav.top.offsetWidth;
                }
                if (calendar._wd.width !== calendar.nav.top.offsetWidth) {
                    calendar._wd.changed = true;
                    calendar._wd.counter = 0;
                    calendar._wd.width = calendar.nav.top.offsetWidth;
                }
                if (calendar._wd.changed) {
                    calendar._wd.counter += 1;
                }
                if (calendar._wd.changed && calendar._wd.counter > 2) {
                    calendar._wd.changed = false;
                    calendar._resize();
                    calendar._onScroll();
                }
            }, 20);
        };

        this._updateSelectionPosition = function() {
            var range = calendar.rangeHold;
            calendar.clearSelection();
            calendar.rangeHold = range;
            calendar._drawRange(range, true);
        };
        
        this._updateAutoCellWidth = function() {

            if (!calendar._initialized) {
                return;
            }
            if (calendar.cellWidthSpec !== 'Auto') {
                return;
            }

            // TODO detect a real dimension change
            calendar._calculateCellWidth();
            calendar._prepareItline();
            calendar._drawTimeHeader();
            calendar._deleteCells();
            calendar._drawCells();
            calendar._deleteSeparators();
            calendar._drawSeparators();
            calendar._deleteEvents();
            calendar._loadEvents();
            calendar._drawEvents();

            //
            calendar._updateHeight();

        };

        this._calculateCellWidth = function() {

            // only valid for automatic cell width
            if (this.cellWidthSpec !== 'Auto') {
                return;
            }
            var total = this.nav.top.clientWidth;
            var header = this._getOuterRowHeaderWidth();
            var vscrollbar = calendar._vScrollbarWidth();
            var full = total - header - vscrollbar;
            var cellCount = this._cellCount();
            if (!cellCount) {
                return;
            }
            var cell = full / this._cellCount();
            //this.cellWidth = Math.floor(cell);

            //this.cellWidth = cell;
            this.cellWidth = Math.max(cell, calendar.cellWidthMin);
            calendar._minCellWidthApplied = cell < calendar.cellWidthMin;
        };

        this._vScrollbarWidth = function() {
            if (calendar.heightSpec === "Auto") {
                return 0;
            }
            if (calendar.heightSpec === "Max" || calendar.heightSpec === "Fixed" || calendar.heightSpec === "Parent100Pct") {
                var inner = calendar._getScrollableInnerHeight();
                if (inner > calendar.height) {
                    return DayPilot.sw(calendar.nav.scroll);
                }
                else {
                    return 0;
                }

            }
            return DayPilot.sw(calendar.nav.scroll);
        };

        /*
        this._isNoScrollbarBrowser = null;
        this._noScrollbarBrowser = function() {
            if (calendar._isNoScrollbarBrowser === null) {

                var div = document.createElement("div");
                div.style.height = "200px";
                div.style.width = "100px";
                div.style.position = "absolute";
                div.style.left = "-1000px";

                var scroll = document.createElement("div");
                scroll.style.overflowY = "scroll";
                scroll.appendChild(div);

                var ref = this.nav.top;

                ref.appendChild(scroll);

                var width = DayPilot.sw(scroll);

                ref.removeChild(scroll);

                calendar._isNoScrollbarBrowser = (width === 0);
            }

            return calendar._isNoScrollbarBrowser;

        };
        */

        this._getScrollableWidth = function() {  // only the visible part
            /*
            if (this.nav.scroll) {
                this.debug.message("scrollableWidth/clientWidth: " + this.nav.scroll.clientWidth);
                return this.nav.scroll.clientWidth;
            }
            */
            
            //
            // TODO get directly from nav.scroll (but it may not be ready yet)
            var total = this.nav.top.clientWidth;
            //var total = this.nav.top.offsetWidth;
            var header = this._getOuterRowHeaderWidth();
            var manualAdjustment = 2;
            
            
            var height = this._getScrollableHeight();
            var innerHeight = this._getScrollableInnerHeight();
            var autoHeight = calendar.heightSpec === "Auto";
            var scrollBarWidth = 0;
            if (innerHeight > height  && !autoHeight) {
                scrollBarWidth = DayPilot.swa();
            }
            
            var full = total - header - manualAdjustment - scrollBarWidth;
            return full;
        };

        this._drawTimeHeaderDiv = function() {

            var div = document.createElement("div");
            div.style.overflow = 'hidden';
            div.style.position = 'absolute';
            div.style.display = 'block';
            div.style.top = "0px";
            div.style.width = "100%";
            div.style.height = this._getTotalHeaderHeight() + "px";
            div.style.overflow = "hidden";
            div.onmousemove = function() { calendar._out(); if (calendar.cellBubble) { calendar.cellBubble.delayedHide(); } };

            this._setRightColWidth(div);

            this.divTimeScroll = div;

            var inner = document.createElement("div");
            inner.style.width = (this._cellCount() * this.cellWidth + 5000) + "px";

            this.divNorth = inner;

            div.appendChild(inner);

            return div;
        };

        this._getScrollableHeight = function() {
            var height = 0;
            var spec = calendar.heightSpec;
            if (spec === 'Fixed' || spec === "Parent100Pct") {
                return this.height ? this.height : 0;
            }
            else {
                height = calendar._getScrollableInnerHeight();
            }

            var maxMode = spec === "Max" || spec === "Max100Pct";

            if (maxMode && height > calendar.height) {
                return calendar.height;
            }

            return height;

        };

        this._detectTimeout = null;
        this._detectLastHeight = 0;
        this._detectLastWidth = 0;
        this._detectLastRowHeaderWidth = 0;
        this._detectDimensionChange = function() {
            if (typeof calendar.onHeightChanged !== "function" && typeof calendar.onDimensionsChanged !== "function") {
                return;
            }

            // make sure it's performed after all changes and only once
            if (calendar._detectTimeout) {
                clearTimeout(calendar._detectTimeout);
            }

            var doit = function() {
                var newHeight = calendar.nav.top.offsetHeight;
                var originalHeight = calendar._detectLastHeight;
                calendar._detectLastHeight = newHeight;

                var newWidth = calendar.nav.top.offsetWidth;
                var originalWidth = calendar._detectLastWidth;
                calendar._detectLastWidth = newWidth;

                var newRowHeaderWidth = calendar._getOuterRowHeaderWidth();
                var originalRowHeaderWidth = calendar._detectLastRowHeaderWidth;
                calendar._detectLastRowHeaderWidth = newRowHeaderWidth;

                if (typeof calendar.onHeightChanged === "function") {
                    if (newHeight !== originalHeight) {
                        var args = {};
                        args.oldHeight = originalHeight;
                        args.newHeight = newHeight;
                        calendar.onHeightChanged(args);
                    }
                }

                if (typeof calendar.onDimensionsChanged === "function") {
                    if (newHeight !== originalHeight || newWidth !== originalWidth || newRowHeaderWidth !== originalRowHeaderWidth) {
                        var args = {};
                        args.oldHeight = originalHeight;
                        args.newHeight = newHeight;
                        args.oldWidth = originalWidth;
                        args.newWidth = newWidth;
                        args.oldRowHeaderWidth = originalRowHeaderWidth;
                        args.newRowHeaderWidth = newRowHeaderWidth;

                        calendar.onDimensionsChanged(args);
                    }
                }
            };

            calendar._detectTimeout = setTimeout(doit, 100);
        };

/*
        this._detectDimensionChange = function() {

        };*/

        this._getScrollableInnerHeight = function() {
            var height;
            if (this._innerHeightTree !== -1) {
                height = this._innerHeightTree;
                if (this._innerHeightTree > 0 && calendar.nav.scroll.style.overflowX === "auto") {
                    //debugger;
                    height += DayPilot.sh(calendar.nav.scroll);
                }
            }
            else {
                height = this.rowlist.length * this._resolved.eventHeight();
            }
            return height;
        };

        this._out = function() {
            this._crosshairHide();
            this._stopScroll();
            this._cellhoverout();
            this._clearShadowHover();
            this._cancelAutoexpand();

            calendar.cellBubble && calendar.cellBubble.hideOnMouseOut();
            calendar.bubble && calendar.bubble.hideOnMouseOut();
            /*if (typeof DayPilot.Bubble !== "undefined") {
                //DayPilot.Bubble.cancelShowing();
                calendar.cellBubble.hideOnMouseOut();
            }*/
        };

        this._drawMainContent = function() {

            var div = document.createElement("div");
            div.style.overflow = "auto";
            div.style.overflowX = "auto";
            div.style.overflowY = "auto";
            div.style.position = "absolute";
            div.style.height = (this._getScrollableHeight()) + "px";
            div.style.top = (this._getTotalHeaderHeight() + 1) + "px";
            div.style.width = "100%";
            div.className = this._prefixCssClass("_scrollable");
            div.oncontextmenu = function() { return false; };

            this._setRightColWidth(div);

            if (calendar.overrideWheelScrolling) {
                var scrollStep = calendar._resolveScrollStep();
                div.onwheel = function(ev) {
                    var delta = ev.deltaY > 0 ? scrollStep : -scrollStep;
                    calendar.nav.scroll.scrollTop = div.scrollTop + delta;
                    ev.preventDefault && ev.preventDefault();
                };
                div.onmousewheel = function(ev) {
                    ev = ev || window.event;
                    var delta = ev.wheelDelta < 0 ? scrollStep : -scrollStep;
                    calendar.nav.scroll.scrollTop = div.scrollTop + delta;
                    ev.preventDefault && ev.preventDefault();
                    ev.returnValue = false;
                };
            }

            this.nav.scroll = div;

            this._maind = document.createElement("div");
            this._maind.style.MozUserSelect = "none";
            this._maind.style.KhtmlUserSelect = "none";
            this._maind.style.webkitUserSelect = "none";
            this._maind.daypilotMainD = true;
            this._maind.calendar = this;  // used in DayPilotScheduler.gTouchMove

            // Android browser bug
            if (android) {
                this._maind.style.webkitTransform = "translateZ(0px)";
            }
            this._maind.style.position = 'absolute';
            //this._maind.style.overflow = "hidden";

            var gridwidth = this._getGridWidth();
            if (gridwidth > 0 && !isNaN(gridwidth)) {
                this._maind.style.width = (gridwidth) + "px";
            }
            this._maind.setAttribute("unselectable", "on");

            this._maind.onmousedown = this._onMaindMouseDown;
            this._maind.onmousemove = this._onMaindMouseMove;
            this._maind.onmouseup = this._onMaindMouseUp;  // there used to be a typo here
            this._maind.oncontextmenu = this._onMaindRightClick;
            this._maind.ondblclick = this._onMaindDblClick;

            this._maind.className = this._prefixCssClass("_matrix");

            this.divStretch = document.createElement("div");
            this.divStretch.style.position = 'absolute';
            this.divStretch.style.height = '1px';
            this._maind.appendChild(this.divStretch);

            this.divCells = document.createElement("div");
            this.divCells.style.position = 'absolute';
            this.divCells.oncontextmenu = this._onMaindRightClick;
            this._maind.appendChild(this.divCells);

            this.divLines = document.createElement("div");
            this.divLines.style.position = 'absolute';
            this.divLines.oncontextmenu = this._onMaindRightClick;
            this._maind.appendChild(this.divLines);

            this.divBreaks = document.createElement("div");
            this.divBreaks.style.position = 'absolute';
            this.divBreaks.oncontextmenu = this._onMaindRightClick;
            this._maind.appendChild(this.divBreaks);

            this.divSeparators = document.createElement("div");
            this.divSeparators.style.position = 'absolute';
            this.divSeparators.oncontextmenu = this._onMaindRightClick;
            this._maind.appendChild(this.divSeparators);

            this.divLinksBelow = document.createElement("div");
            this.divLinksBelow.style.position = "absolute";
            this._maind.appendChild(this.divLinksBelow);

            this.divCrosshair = document.createElement("div");
            this.divCrosshair.style.position = 'absolute';
            this.divCrosshair.ondblclick = this._onMaindDblClick;
            this._maind.appendChild(this.divCrosshair);

            this.divRange = document.createElement("div");
            this.divRange.style.position = 'absolute';
            this.divRange.oncontextmenu = this._onMaindRightClick;
            this._maind.appendChild(this.divRange);

            this.divEvents = document.createElement("div");
            this.divEvents.style.position = 'absolute';
            this._maind.appendChild(this.divEvents);

            this.divSeparatorsAbove = document.createElement("div");
            this.divSeparatorsAbove.style.position = 'absolute';
            this.divSeparatorsAbove.oncontextmenu = this._onMaindRightClick;
            this._maind.appendChild(this.divSeparatorsAbove);

            this.divLinksAbove = document.createElement("div");
            this.divLinksAbove.style.position = "absolute";
            this._maind.appendChild(this.divLinksAbove);

            this.divLinkShadow = document.createElement("div");
            this.divLinkShadow.style.position = "absolute";
            this._maind.appendChild(this.divLinkShadow);

            this.divLinkpoints = document.createElement("div");
            this.divLinkpoints.style.position = "absolute";
            this._maind.appendChild(this.divLinkpoints);

            this.divRectangle = document.createElement("div");
            this.divRectangle.style.position = "absolute";
            this._maind.appendChild(this.divRectangle);

            this.divHover = document.createElement("div");
            this.divHover.style.position = 'absolute';
            this._maind.appendChild(this.divHover);

            this.divShadow = document.createElement("div");
            this.divShadow.style.position = 'absolute';
            this._maind.appendChild(this.divShadow);

            // TODO add scroll labels

            div.appendChild(this._maind);

            return div;
        };

        this._overlay = {};
        var overlay = this._overlay;

        overlay.create = function() {
            if (calendar.nav.overlay) {
                return;
            }
            var div = document.createElement('div');
            div.style.position = "absolute";
            div.style.left = "0px";
            div.style.right = "0px";
            div.style.top = "0px";
            div.style.bottom = "0px";
            div.className = calendar._prefixCssClass("_block");
            calendar.nav.top.appendChild(div);
            calendar.nav.overlay = div;
        };

        overlay.show = function() {
            overlay.create();
            calendar.nav.overlay.style.display = '';
        };

        overlay.hide = function() {
            if (calendar.nav.overlay) {
                calendar.nav.overlay.style.display = 'none';
            }
        };

        this._loadingStart = function(immediately) {

            var delay = immediately ? 0 : 100;

            if (calendar.loadingTimeout) {
                window.clearTimeout(calendar.loadingTimeout);
            }

            calendar.loadingTimeout = window.setTimeout(function() {
                if (calendar.loadingLabelVisible) {
                    calendar.nav.loading.innerHTML = calendar.loadingLabelText;
                    calendar.nav.loading.style.display = '';
                }
                if (calendar.blockOnCallBack) {
                    overlay.show();
                }
            }, delay);
        };

        this._loadingStop = function() {
            //calendar.status.loadingEvents = false;
            if (this.loadingTimeout) {
                window.clearTimeout(this.loadingTimeout);
            }

            this.nav.loading.style.display = 'none';
            if (this.blockOnCallBack) {
                overlay.hide();
            }

        };

        this.loadingStart = function() {
            calendar._loadingStart();
        };

        this.loadingStop = function() {
            calendar._loadingStop();
        };

        this.uiBlock = function() {
            overlay.show();
        };

        this.uiUnblock = function() {
            overlay.hide();
        };

        this._prepareVariables = function() {
            this.startDate = new DayPilot.Date(this.startDate).getDatePart();
            //this._getEventHeightFromCss();
        };

        this._getDimensionsFromCss = function(className) {
            var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.top = "-2000px";
            div.style.left = "-2000px";
            div.className = this._prefixCssClass(className);

            document.body.appendChild(div);
            var height = div.offsetHeight;
            var width = div.offsetWidth;
            document.body.removeChild(div);

            var result = {};
            result.height = height;
            result.width = width;
            return result;
        };

        // interval defined in seconds, minimum 30 seconds
        this._startAutoRefresh = function(forceEnabled) {
            if (forceEnabled) {
                this.autoRefreshEnabled = true;
            }

            if (!this.autoRefreshEnabled) {
                return;
            }

            if (this._autoRefreshCount >= this.autoRefreshMaxCount) {
                return;
            }

            this._pauseAutoRefresh();

            var interval = this.autoRefreshInterval;
            if (!interval || interval < 10) {
                throw "The minimum autoRefreshInterval is 10 seconds";
            }
            //this.autoRefresh = interval * 1000;
            this.autoRefreshTimeout = window.setTimeout(function() { calendar._doRefresh(); }, this.autoRefreshInterval * 1000);
        };

        this._pauseAutoRefresh = function() {
            if (this.autoRefreshTimeout) {
                window.clearTimeout(this.autoRefreshTimeout);
                this.autoRefreshTimeout = null;
            }
        };

        this.autoRefreshStart = function(forceEnabled) {
            calendar._startAutoRefresh(forceEnabled);
        };

        this.autoRefreshPause = function() {
            calendar._pauseAutoRefresh();
        };

        this._noDragAndDropInProgress = function() {
            return !DayPilotScheduler.resizing && !DayPilotScheduler.moving && !DayPilotScheduler.drag && !DayPilotScheduler.range;
        };

        this._doRefresh = function() {
            // skip if an operation is active
            if (calendar._noDragAndDropInProgress()) {
                var skip = false;
                if (typeof this.onAutoRefresh === 'function') {
                    var args = {};
                    args.i = this._autoRefreshCount;
                    args.preventDefault = function() {
                        this.preventDefault.value = true;
                    };

                    calendar.onAutoRefresh(args);
                    if (args.preventDefault.value) {
                        skip = true;
                    }
                }
                if (!skip && this._serverBased()) {
                    this.commandCallBack(this.autoRefreshCommand);
                }
                this._autoRefreshCount++;
            }
            if (this._autoRefreshCount < this.autoRefreshMaxCount) {
                this.autoRefreshTimeout = window.setTimeout(function() { calendar._doRefresh(); }, this.autoRefreshInterval * 1000);
            }
        };

        this._registerGlobalHandlers = function() {
            if (!DayPilotScheduler.globalHandlers) {
                DayPilotScheduler.globalHandlers = true;
                DayPilot.re(document, 'mousemove', DayPilotScheduler.gMouseMove);
                DayPilot.re(document, 'mouseup', DayPilotScheduler.gMouseUp);
                DayPilot.re(document, 'mousedown', DayPilotScheduler.gMouseDown);
                DayPilot.re(document, 'touchmove', DayPilotScheduler.gTouchMove);
                DayPilot.re(document, 'touchend', DayPilotScheduler.gTouchEnd);

                DayPilot.re(window, 'keyup', DayPilotScheduler.gKeyUp);

                //DayPilot.re(window, 'unload', DayPilotScheduler.gUnload);
            }
            DayPilot.re(window, 'resize', this._onWindowResize);
        };

        this._registerOnScroll = function() {
            this.nav.scroll.root = this;  // might not be necessary
            this.nav.scroll.onscroll = this._onScroll;

            calendar._scrollPos = this.nav.scroll.scrollLeft;
            calendar._scrollTop = this.nav.scroll.scrollTop;
            calendar._scrollWidth = this.divNorth.clientWidth; // this is always available, divScroll might be not (if there are no resources)
        };

        this._saveState = function() {
            if (!this.nav.state) {
                return;
            }

            //var start = new Date();
            var state = {};
            state.scrollX = this.nav.scroll.scrollLeft;
            state.scrollY = this.nav.scroll.scrollTop;

            var area = calendar._getArea(state.scrollX, state.scrollY);
            var range = calendar._getAreaRange(area);
            var res = calendar._getAreaResources(area);

            state.rangeStart = range.start;
            state.rangeEnd = range.end;
            state.resources = res;

            if (this.syncResourceTree) {
                state.tree = this._getTreeState();
            }

            this.nav.state.value = DayPilot.he(JSON.stringify(state));
        };

        this._drawSeparators = function() {
            if (!this.separators) {
                return;
            }
            for (var i = 0; i < this.separators.length; i++) {
                this._drawSeparator(i);
            }
        };

        this._batch = {};
        this._batch.step = 300;
        this._batch.delay = 10;
        this._batch.mode = "display";
        this._batch.layers = false;

        this._updateEventPositionsInRow = function(row) {

            if (calendar._cellStacking) {
                cellstacking.calculateEventPositionsRow(row);
                return;
            }

            var alwaysRecalculate = true;
            // var eventMarginTop = this._durationBarDetached ? 10 : 0;

            var lineTop = 0;
            for (var j = 0; j < row.lines.length; j++) {
                var line = row.lines[j];

                line.height = 0;
                line.top = lineTop;

                for (var k = 0; k < line.length; k++) {
                    var e = line[k];

                    // do something faster instead, probably move it to another function
                    if (!e.part.top || alwaysRecalculate) {
                        e.part.line = j;
                        if (!e.part.height) {
                            e.part.height = row.eventHeight;
                        }

                        var pheight = e.part._getHeightWithVersions();
                        if (pheight > line.height) {
                            line.height = pheight;
                        }

                        //e.part.top = j * (e.part.height + eventMarginTop) + eventMarginTop;
                        e.part.top = lineTop + row.marginTop;

                        var above = calendar.eventVersionPosition === "Above";

                        if (calendar.eventVersionsEnabled && !DayPilot.list(e.data.versions).isEmpty()) {
                            var count = e.data.versions.length;
                            var top = e.part.top;

                            if (!above) {
                                top += e.part.height + calendar.eventVersionMargin;
                            }

                            DayPilot.list(e.data.versions).each(function(version, i) {
                                if (!e.versions[i]) {
                                    return;
                                }

                                var offset = i * (calendar.eventVersionHeight + calendar.eventVersionMargin);
                                e.versions[i].top = top + offset;

                                if (above) {
                                    e.part.top += calendar.eventVersionHeight;
                                    e.part.top += calendar.eventVersionMargin;
                                }
                            });
                        }
                        e.part.top += calendar.eventMarginBottom;

                        // e.part.detachedBarTop = e.part.top - eventMarginTop;
                        e.part.right = e.part.left + e.part.width;
                        e.part.fullTop = this.rowlist[e.part.dayIndex].top + e.part.top;
                        e.part.fullBottom = e.part.fullTop + e.part.height;
                    }
                }
                lineTop += (line.height || row.eventHeight) * row.eventStackingLineHeight/100;
            }
            //row.height = lineTop;
        };

        var cellstacking = {};

        cellstacking.loadRow = function(row) {
            row.evColumns = DayPilot.list(calendar.itline).map(function(cell, i) {
                return {"events":DayPilot.list()};
            });

            DayPilot.list(row.events).each(function(e) {
                var start = e.start();
                var cell = calendar._getItlineCellFromTime(start);
                row.evColumns[cell.i].events.push(e);
            });
        };

        cellstacking.calculateEventPositions = function() {
            var autoHeight = calendar._cellStackingAutoHeight;

            var rowTop = 0;
            DayPilot.list(calendar.rowlist).each(function(row) {
                var maxHeight = 0;
                row.evColumns.each(function(column, i) {
                    var cell = calendar.itline[i];
                    var top = calendar.rowMarginTop;
                    column.events.each(function(e) {
                        e.part.left = cell.left;
                        e.part.width = cell.width;
                        e.part.top = top;

                        if (!e.part.height) {
                            if (autoHeight) {
                                e.part.height = cellstacking.getEventAutoHeight(e) + calendar.durationBarHeight;
                            }
                            else {
                                e.part.height = row.eventHeight;
                            }
                        }

                        top += e.part.height + calendar.eventMarginBottom;
                    });
                    column.height = top;
                    if (column.height > maxHeight) {
                        maxHeight = column.height;
                    }
                });
                row.maxColumnHeight = maxHeight;
                row.top = rowTop;

                var oldHeight = row.height;
                row.height = row.getHeight();
                if (maxHeight > calendar.rowMarginTop) {
                    row.height = maxHeight + calendar.rowMarginBottom;
                }
                if (oldHeight !== row.height) {
                    calendar._rowsDirty = true;
                }

                rowTop += row.height;
            });

            calendar._innerHeightTree = rowTop;
        };

        cellstacking.getEventAutoHeight = function(e) {
            var html = e.client.html();

            var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.top = "-2000px";
            div.style.left = "-2000px";
            div.style.width = e.part.width + "px";
            div.className = calendar._prefixCssClass(cssNames.event);

            var inner = document.createElement("div");
            inner.className = calendar._prefixCssClass(cssNames.eventInner);
            inner.innerHTML = html;
            inner.style.position = 'static';
            inner.style.overflow = 'auto';

            div.appendChild(inner);

            var parent = calendar.divEvents;
            parent.appendChild(div);
            var height = div.offsetHeight;
            parent.removeChild(div);

            return height;
        };

        cellstacking.calculateEventPositionsRow = function(row) {
            // hack
            cellstacking.calculateEventPositions();
        };

        cellstacking.drawEventsWithoutCheckingOverflow = function() {
            DayPilot.list(calendar.rowlist).each(function(row) {
                cellstacking.drawEventsRow(row);
            });

        };

        cellstacking.drawEvents = function() {

            cellstacking.drawEventsWithoutCheckingOverflow();

            cellstacking.checkOverflow();

            calendar._updateRowHeaderHeights();
            calendar._updateHeight();
        };

        cellstacking.checkOverflow = function() {
            if (!calendar._cellStackingAutoHeight) {
                return;
            }

            var dirty = false;
            DayPilot.list(calendar.elements.events).each(function(div) {
                var inner = div.firstChild;
                // we are setting the full event height
                var plus = inner.offsetHeight - inner.clientHeight + div.offsetHeight - div.clientHeight;
                var realHeight = inner.scrollHeight + plus;

                var originalHeight = div.event.part.height;
                div.event.part.height = realHeight;

                if (originalHeight !== realHeight) {
                    dirty = true;
                }
                /*
                if (inner.scrollHeight > inner.clientHeight) {
                    dirty = true;
                }
                */
            });
            if (dirty) {
                calendar._deleteEvents();
                cellstacking.calculateEventPositions();
                cellstacking.drawEventsWithoutCheckingOverflow();

                calendar._deleteCells();
                calendar._drawCells();
            }
        };

        cellstacking.drawEventsRow = function(row) {
            row.evColumns.each(function(column, i) {
                column.events.each(function(e) {
                    calendar._drawEvent(e);
                });
            });
        };

        // batch rendering flushes events in 10-item batches
        this._drawEvents = function(batch) {

            if (calendar._disposed) {
                return;
            }

            if (calendar._cellStacking) {
                cellstacking.drawEvents();
                return;
            }

            //var start = new Date().getTime();

            var step = this._batch.step;  // batch size
            var layers = this._batch.layers;

            // experimental
            if (layers) {
                // create a new layer
                calendar.divEvents = document.createElement("div");
                calendar.divEvents.style.position = 'absolute';  // relative
//                calendar.maind.appendChild(this.divEvents);

                calendar._maind.insertBefore(this.divEvents, this.divSeparatorsAbove);

            }

            if (this._batch.mode === 'display') {
                this.divEvents.style.display = 'none';
            }
            else if (this._batch.mode === 'visibility') {
                this.divEvents.style.visibility = 'hidden';
            }

            this.divEvents.setAttribute("role", "region");
            this.divEvents.setAttribute("aria-label", "scheduler events");

            var dynamic = this.dynamicEventRendering === 'Progressive';
            var area = this._getDrawArea();
            var top = area.pixels.top;
            var bottom = area.pixels.bottom;

            var multiMoveOrResize = calendar.allowMultiMove || calendar.allowMultiResize;
            // var multiMoveOrResize = false;

            for (var i = 0; i < this.rowlist.length; i++) {

                var row = this.rowlist[i];

                var rowTop = row.top - this.dynamicEventRenderingMargin;
                var rowBottom = rowTop + row.height + 2 * this.dynamicEventRenderingMargin;
                //var isSelected =
                //var shouldBeSelected = calendar.multiselect._shouldBeSelected(div.event);
                if (dynamic && !multiMoveOrResize && (bottom <= rowTop || top >= rowBottom)) {
                    continue;
                }

                this._updateEventPositionsInRow(row);

                for (var j = 0; j < row.lines.length; j++) {
                    var line = row.lines[j];
                    for (var k = 0; k < line.length; k++) {
                        var e = line[k];
                        var rendered = this._drawEvent(e);

                        if (batch && rendered) {
                            step--;
                            // flush
                            if (step <= 0) {
                                this.divEvents.style.visibility = '';
                                this.divEvents.style.display = '';
                                window.setTimeout(function() { calendar._drawEvents(batch); }, calendar._batch.delay);
                                //var end = new Date().getTime();
                                return;
                            }
                        }
                    }
                }
            }

            this.divEvents.style.display = '';
            if (!DayPilot.list(calendar.multiselect._list).isEmpty()) {
                calendar.multiselect.redraw();
            }

            this._findEventsInViewPort();
            linktools.load();
            //this._loadingStop();
        };

        this._drawEventsInRow = function(rowIndex) {

            // not hiding and showing this.divEvents, caused flickering

            var row = this.rowlist[rowIndex];

            if (calendar._cellStacking) {
                cellstacking.drawEventsRow(row);
                return;
            }

            // create new layer
            this.divEvents = document.createElement("div");
            this.divEvents.style.position = 'absolute';  // relative
            this.divEvents.style.display = 'none';
            //this.maind.appendChild(this.divEvents);

            this._maind.insertBefore(this.divEvents, this.divSeparatorsAbove);

            // var eventMarginTop = this._durationBarDetached ? 10 : 0;

            this._updateEventPositionsInRow(row);

            //var lineTop = 0;
            for (var j = 0; j < row.lines.length; j++) {
                var line = row.lines[j];
                for (var k = 0; k < line.length; k++) {
                    var e = line[k];

                    /*
                    // this must always be perfomed during row redrawing
                    e.part.line = j;
                    if (!e.part.height) {
                        e.part.height = row.eventHeight;
                    }
                    //e.part.height = row.eventHeight;
                    e.part.top = line.top + row.marginTop;
                    //e.part.top = j * (e.part.height + eventMarginTop) + eventMarginTop;
                    e.part.detachedBarTop = e.part.top - eventMarginTop;

                    e.part.right = e.part.left + e.part.width;
                    e.part.fullTop = this.rowlist[e.part.dayIndex].top + e.part.top;
                    e.part.fullBottom = e.part.fullTop + e.part.height;
*/
                    // batch rendering not supported here
                    this._drawEvent(e);
                }
            }
            this.divEvents.style.display = '';

            //this._findEventsInViewPort();
            //this.multiselect.redraw();
        };

        this._deleteEvents = function() {
            if (this.elements.events) {
                var length = this.elements.events.length;

                for (var i = 0; i < length; i++) {
                    var div = this.elements.events[i];
                    this._deleteEvent(div);
                }
            }
            this.elements.events = [];
        };

        this._deleteEventsInRow = function(rowIndex) {
            //var count = 0;
            if (this.elements.events) {
                var length = this.elements.events.length;
                var removed = [];

                for (var i = 0; i < length; i++) {
                    var div = this.elements.events[i];
                    var e = div.event;
                    //if (div.row === rowIndex) {
                    if (e.part.dayIndex === rowIndex) {
                        this._deleteEvent(div);
                        removed.push(i);
                        //count += 1;
                    }
                }

                for (var i = removed.length - 1; i >= 0; i--) {
                    this.elements.events.splice(removed[i], 1);
                }
            }

        };

        this._deleteEvent = function(div) {

            var removeCallback = div.event && div.event.part && div.event.part.onElementRemove;

            if (removeCallback) {
                var args = div.event && div.event.part.elementCreateArgs;
                //var args = {};
                args.div = div;
                removeCallback(args);
            }

            if (div.parentNode) { div.parentNode.removeChild(div); }

            // direct event handlers
            div.onclick = null;
            div.oncontextmenu = null;
            div.onmouseover = null;
            div.onmouseout = null;
            div.onmousemove = null;
            div.onmousedown = null;
            div.ondblclick = null;

            if (div.event) {
                if (!div.isBar) {
                    div.event.rendered = null;
                }
                div.event = null;
            }

            if (div.related) {
                DayPilot.de(div.related);
            }

        };

        this._deleteBlock = function(div) {
            if (div.event) {
                div.event.rendered = false;
            }
            div.onclick = null;
            div.onmousedown = null;
            div.event = null;
            if (div.parentNode) {
                div.parentNode.removeChild(div);
            }
        };

        // deletes events that are out of the current view
        // keeps the last "keepPlus" number of events outside of the view
        this._deleteOldEvents = function() {
            if (this.dynamicEventRendering !== 'Progressive') {
                return;
            }

            var deleteOld = calendar.dynamicEventRenderingCacheSweeping;  // deletes old events (outside of the visible area)
            if (!deleteOld) {
                return;
            }

            var keepPlus = calendar.dynamicEventRenderingCacheSize || 0;  // how many old events should be kept visible (cached)

            this.divEvents.style.display = 'none';

            var updated = [];

            var deleted = 0;

            var length = this.elements.events.length;
            for (var i = length - 1; i >= 0; i--) {
                var div = this.elements.events[i];
                if (this._oldEvent(div.event)) {
                    if (keepPlus > 0) {
                        keepPlus--;
                        updated.unshift(div);
                    }
                    else {
                        this._deleteEvent(div);
                        deleted++;
                    }
                }
                else {
                    updated.unshift(div);
                }
            }

            this.elements.events = updated;

            this.divEvents.style.display = '';
        };

        this._deleteOldCells = function(keepPlus) {
            var updated = [];

            var deleted = 0;

            var area = this._getDrawArea();

            var length = this.elements.cells.length;
            for (var i = length - 1; i >= 0; i--) {
                var div = this.elements.cells[i];

                var visible = (area.xStart < div.coords.x && div.coords.x <= area.xEnd) && (area.yStart < div.coords.y && div.coords.y <= area.yEnd);

                if (!visible) {
                    if (keepPlus > 0) {
                        keepPlus--;
                        updated.unshift(div);
                    }
                    else {
                        this._deleteCell(div);
                        deleted++;
                    }
                }
                else {
                    updated.unshift(div);
                }
            }

        };

        this._deleteCell = function(div) {
            if (!div) {
                return;
            }
            if (!div.coords) {
                return;
            }
            var x = div.coords.x;
            var y = div.coords.y;

            // remove div
            DayPilot.rfa(calendar.elements.cells, div);
            DayPilot.de(div);

            //var index = DayPilot.indexOf(calendar.elements.cells, div);
            //calendar.elements.cells.splice(index, 1);
            //if (div.parentNode) { div.parentNode.removeChild(div); }

            // remove from cache
            calendar._cache.cells[x + "_" + y] = null;
        };

        this._deleteSeparators = function() {
            if (this.elements.separators) {
                for (var i = 0; i < this.elements.separators.length; i++) {
                    var div = this.elements.separators[i];
                    //DayPilot.pu(div); // not necessary
                    DayPilot.de(div);
                    //div.parentNode.removeChild(div);
                }
            }
            this.elements.separators = [];
        };


        this._hiddenEvents = function() {
            var dynamic = this.dynamicEventRendering === 'Progressive';

            if (!this.nav.scroll) {
                return false;
            }
            var top = this.nav.scroll.scrollTop;
            var bottom = top + this.nav.scroll.clientHeight;

            for (var i = 0; i < this.rowlist.length; i++) {

                var row = this.rowlist[i];

                var rowTop = row.top;
                var rowBottom = row.top + row.height;
                if (dynamic && (bottom <= rowTop || top >= rowBottom)) {
                    continue;
                }

                for (var j = 0; j < row.lines.length; j++) {
                    var line = row.lines[j];
                    for (var k = 0; k < line.length; k++) {
                        var e = line[k];
                        if (this._hiddenEvent(e)) {
                            return true;
                        }
                    }
                }

            }

            return false;
        };

        this._hiddenEvent = function(data) {
            if (data.rendered) {
                return false;
            }

            var dynamic = this.dynamicEventRendering === 'Progressive';
            var left = this.nav.scroll.scrollLeft;
            var right = left + this.nav.scroll.clientWidth;
            var eventLeft = data.part.left;
            var eventRight = data.part.left + data.part.width;
/*
            var eventLeft = data.Left;
            var eventRight = data.Left + data.Width;
*/
            if (dynamic && (right <= eventLeft || left >= eventRight)) {
                return false;
            }
            return true;
        };

        this._oldEvent = function(ev) {
            if (!ev.rendered) {  // just for the case, these events might not have Top defined
                return true;
            }

            var area = this._getDrawArea();

            var top = area.pixels.top;
            var bottom = area.pixels.bottom;
            var left = area.pixels.left - this.dynamicEventRenderingMargin;
            var right = area.pixels.right + this.dynamicEventRenderingMargin;

            var eventLeft = ev.part.left;
            var eventRight = ev.part.right;
            var eventTop = ev.part.fullTop;
            var eventBottom = ev.part.fullBottom;

            if (right <= eventLeft || left >= eventRight) {
                return true;
            }

            if (bottom <= eventTop || top >= eventBottom) {
                return true;
            }

            return false;
        };

        this._blockExpandedEvents = DayPilot.list();

        this._drawBlock = function(block) {
            if (block.rendered) {
                return false;
            }

            //var rowList = block.row;
            var row = block.row;
            if (row.hidden) {
                return false;
            }

            var left = block.min;
            var width = block.max - block.min;
            var height = calendar.eventHeight;
            var top = block.row.top;

            var div = document.createElement("div");
            div.style.position = 'absolute';
            div.style.left = left + 'px';
            div.style.top = top + 'px';
            div.style.width = width + 'px';
            div.style.height = height + 'px';

            // temp styling
            div.className = calendar._prefixCssClass("_event_group");
            div.style.cursor = "pointer";

            var args = {};
            args.group = {};
            args.group.count = block.events.length;
            args.group.events = DayPilot.list(block.events, true); // make a copy
            args.group.html = "[+] " + block.events.length + " events";
            if (typeof calendar.onBeforeGroupRender === "function") {
                calendar.onBeforeGroupRender(args);
            }

            var inner = document.createElement("div");
            inner.innerHTML = args.group.html;
            div.appendChild(inner);

            div.onmousedown = function(ev) {
                var ev = ev || window.event;
                ev.cancelBubble = true;
            };

            div.onclick = function(ev) {
                var block = div.event;
                block.expanded = true;

                calendar._deleteBlock(div);
                var elindex = DayPilot.indexOf(calendar.elements.events, div);
                if (elindex !== -1) {
                    calendar.elements.events.splice(elindex, 1);
                }

                var list = calendar._blockExpandedEvents;
                DayPilot.list(block.events).each(function(e) {
                    list.push(e.id());
                });

                //calendar._drawEvents();
                calendar._updateRowHeights();
                calendar._updateRowsNoLoad(block.part.dayIndex);
                calendar._updateHeight();

                var ev = ev || window.event;
                ev.cancelBubble = true;
            };

            // make it compatible with event.part
            // TODO resolve
            block.part = {};
            block.part.left = left;
            block.part.width = width;
            block.part.height = calendar.eventHeight;
            block.part.dayIndex = DayPilot.indexOf(calendar.rowlist, block.row);
            block.part.top = 0;
            block.part.isBlock = true;
            block.client = {};
            block.client.html = function() { return args.group.html; };
            block.data = {};
            div.event = block;

            // add it to the events collection
            this.elements.events.push(div);

            // draw the div
            this.divEvents.appendChild(div);

            block.rendered = true;

            return true;

        };

        // returns true if the event was actually rendered
        this._drawEvent = function(e, options) {

            options = options || {};
            var forced = options.forced;

            if (e.rendered) {
                return false;
            }

            if (calendar.groupConcurrentEvents) {
                var block = e.part.block;
                if (block.events.length > 1 && !block.expanded) {
                    return calendar._drawBlock(block);
                }
            }

            //var dynamic = this.dynamicEventRendering === 'Progressive' && !this.dynamicLoading;
            var dynamic = this.dynamicEventRendering === 'Progressive';

            var rowIndex = e.part.dayIndex;
            var row = this.rowlist[rowIndex];
            if (row.hidden) {
                return false;
            }
            var rowTop = row.top;

            var area = this._getDrawArea();
            var left = area.pixels.left - this.dynamicEventRenderingMargin;
            var right = area.pixels.right + this.dynamicEventRenderingMargin;
            var top = area.pixels.top;
            var bottom = area.pixels.bottom;

            var eventLeft = e.part.left;
            var eventRight = e.part.left + e.part.width;
            var eventTop = e.part.top + rowTop;
            var eventBottom = eventTop + e.part.height;

            var shouldBeSelected = calendar.multiselect._shouldBeSelected(e);
            if (!forced && !shouldBeSelected && dynamic && (right <= eventLeft || left >= eventRight || bottom <= eventTop || top >= eventBottom)) { // dynamic rendering, event outside of the current view
                return false;
            }

            var isMilestone = e.data.type === "Milestone";

            var width = e.part.width;
            var height = e.part.height;

            var cache = e.cache || e.data;

            // make sure it's not negative
            width = Math.max(0, width);
            height = Math.max(0, height);

            // var barDetached = this._durationBarDetached;

            var div = document.createElement("div");
            div.related = [];

            (function drawVersions(parent) {
                if (!calendar.eventVersionsEnabled) {
                    return;
                }

                // data.data.versions => source data
                // data.versions => calculated data

                DayPilot.list(e.data.versions).each(function(version, i) {
                    if (!version) {
                        return;
                    }

                    //var offset = (e.data.versions.length - i) * (calendar.eventVersionHeight + calendar.eventVersionMargin);
                    var vpart = e.versions[i];

                    if (!vpart) {
                        return;
                    }

                    var div = document.createElement("div");
                    div.style.position = 'absolute';
                    div.style.left = vpart.left + 'px';
                    //div.style.top = (rowTop + e.part.top - offset) + 'px';
                    div.style.top = (rowTop + vpart.top) + 'px';
                    div.style.width = vpart.width + 'px';
                    div.style.height = calendar.eventVersionHeight + 'px';
                    div.className = calendar._prefixCssClass(cssNames.event) + " " + calendar._prefixCssClass("_event_previous") + " " + calendar._prefixCssClass("_event_version");

                    if (version.toolTip) {
                        div.title = version.toolTip;
                    }

                    if (version.cssClass) {
                        DayPilot.Util.addClass(div, version.cssClass);
                    }
                    /*
                     supported properties:
                     * text
                     * html
                     * backColor
                     * fontColor
                     * borderColor
                     * backImage
                     * backRepeat
                     * complete
                     * barColor
                     * barBackColor
                     * barImageUrl
                     * barHidden
                     * htmlRight
                     * htmlLeft
                     * cssClass
                     * toolTip

                     add
                     * areas

                     */

                    var inner = document.createElement("div");
                    inner.setAttribute("unselectable", "on");
                    inner.className = calendar._prefixCssClass(cssNames.eventInner);
                    inner.innerHTML = version.html || version.text || "";

                    if (version.backColor) {
                        inner.style.background = version.backColor;
                        if (DayPilot.browser.ie9 || DayPilot.browser.ielt9) {
                            inner.style.filter = '';
                        }
                    }
                    if (version.fontColor) {
                        inner.style.color = version.fontColor;
                    }
                    if (version.borderColor) {
                        inner.style.borderColor = version.borderColor;
                    }
                    if (version.backImage) {
                        inner.style.backgroundImage = "url(" + version.backImage + ")";
                        if (version.backRepeat) {
                            inner.style.backgroundRepeat = version.backRepeat;
                        }
                    }


                    div.appendChild(inner);

                    if (vpart.continueLeft && !isMilestone) {
                        DayPilot.Util.addClass(div, calendar._prefixCssClass("_event_continueleft"));
                    }
                    if (vpart.continueRight && !isMilestone) {
                        DayPilot.Util.addClass(div, calendar._prefixCssClass("_event_continueright"));
                    }

                    var barVisible = calendar.durationBarVisible && !version.barHidden;
                    var width = vpart.width;

                    if (barVisible && width > 0) {
                        var barLeft = 100 * vpart.barLeft / (width); // %
                        var barWidth = Math.ceil(100 * vpart.barWidth / (width)); // %

                        if (calendar.durationBarMode === "PercentComplete") {
                            barLeft = 0;
                            barWidth = version.complete || 0;
                        }

                        var bar = document.createElement("div");
                        bar.setAttribute("unselectable", "on");
                        bar.className = calendar._prefixCssClass(cssNames.eventBar);
                        bar.style.position = "absolute";

                        if (version.barBackColor) {
                            bar.style.backgroundColor = version.barBackColor;
                        }

                        var barInner = document.createElement("div");
                        barInner.setAttribute("unselectable", "on");
                        barInner.className = calendar._prefixCssClass(cssNames.eventBarInner);
                        barInner.style.left = barLeft + "%";
                        if (0 < barWidth && barWidth <= 1) {
                            barInner.style.width = "1px";
                        }
                        else {
                            barInner.style.width = barWidth + "%";
                        }

                        if (version.barColor) {
                            barInner.style.backgroundColor = version.barColor;
                        }

                        if (version.barImageUrl) {
                            barInner.style.backgroundImage = "url(" + version.barImageUrl + ")";
                        }

                        bar.appendChild(barInner);
                        div.appendChild(bar);
                    }

                    if (version.htmlLeft) {

                        var margin = calendar.eventHtmlLeftMargin;
                        var divLeft = document.createElement("div");
                        divLeft.style.position = 'absolute';
                        divLeft.style.right = -(vpart.left - margin) + 'px';
                        divLeft.style.top = (rowTop + vpart.top) + 'px';
                        divLeft.style.height = calendar.eventHeight + 'px';
                        divLeft.style.boxSizing = "border-box";
                        divLeft.innerHTML = version.htmlLeft;
                        divLeft.className = calendar._prefixCssClass("_event_left");
                        divLeft.type = "divLeft";
                        divLeft.versionPart = vpart;

                        parent.related.push(divLeft);

                        // draw the div
                        calendar.divEvents.appendChild(divLeft);
                    }

                    if (version.htmlRight) {
                        var margin = calendar.eventHtmlRightMargin;
                        var divRight = document.createElement("div");
                        divRight.style.position = 'absolute';
                        divRight.style.left = (vpart.left + vpart.width + margin) + 'px';
                        divRight.style.top = (rowTop + vpart.top) + 'px';
                        divRight.style.height = calendar.eventHeight + 'px';
                        divRight.style.boxSizing = "border-box";
                        divRight.innerHTML = version.htmlRight;
                        divRight.className = calendar._prefixCssClass("_event_right");
                        divRight.type = "divRight";
                        divRight.versionPart = vpart;

                        parent.related.push(divRight);

                        // draw the div
                        calendar.divEvents.appendChild(divRight);
                    }

                    div.versionPart = vpart;
                    div.type = "version";

                    parent.related.push(div);

                    // draw the div
                    calendar.divEvents.appendChild(div);

                });

            })(div);

            if (cache.htmlLeft) {

                var margin = calendar.eventHtmlLeftMargin;
                var divLeft = document.createElement("div");
                divLeft.style.position = 'absolute';
                divLeft.style.right = -(e.part.left - margin) + 'px';
                divLeft.style.top = (rowTop + e.part.top) + 'px';
                divLeft.style.height = calendar.eventHeight + 'px';
                divLeft.style.boxSizing = "border-box";
                divLeft.innerHTML = cache.htmlLeft;
                divLeft.className = calendar._prefixCssClass("_event_left");
                divLeft.type = "divLeft";

                div.related.push(divLeft);

                // draw the div
                this.divEvents.appendChild(divLeft);
            }

            if (cache.htmlRight) {
                var margin = calendar.eventHtmlRightMargin;
                var divRight = document.createElement("div");
                divRight.style.position = 'absolute';
                divRight.style.left = (e.part.left + e.part.width + margin) + 'px';
                divRight.style.top = (rowTop + e.part.top) + 'px';
                divRight.style.height = calendar.eventHeight + 'px';
                divRight.style.boxSizing = "border-box";
                divRight.innerHTML = cache.htmlRight;
                divRight.className = calendar._prefixCssClass("_event_right");
                divRight.type = "divRight";

                div.related.push(divRight);

                // draw the div
                this.divEvents.appendChild(divRight);
            }

            var top = rowTop + e.part.top;

            //div.data = data;
            div.style.position = 'absolute';
            div.style.left = (e.part.left + calendar.eventMarginLeft)  + 'px';
            div.style.top = (rowTop + e.part.top) + 'px';
            div.style.width = (width - calendar.eventMarginLeft - calendar.eventMarginRight) + 'px';
            div.style.height = height + 'px';
            if (!calendar.eventTextWrappingEnabled) {
                div.style.whiteSpace = 'nowrap';
            }
            div.style.overflow = 'hidden';
            div.className = this._prefixCssClass(cssNames.event);
            if (isMilestone) {
                DayPilot.Util.addClass(div, calendar._prefixCssClass("_task_milestone"));
            }
            if (e.data.type === "Group") {
                DayPilot.Util.addClass(div, calendar._prefixCssClass("_task_parent"));  // remove
                DayPilot.Util.addClass(div, calendar._prefixCssClass("_task_group"));
            }
            if (cache.cssClass) {
                DayPilot.Util.addClass(div, cache.cssClass);
            }
            var lineClasses = true;
            if (lineClasses && typeof e.part.line === "number") {
                DayPilot.Util.addClass(div, this._prefixCssClass(cssNames.eventLine + e.part.line));
            }
            div.setAttribute("unselectable", "on");

            if (this.showToolTip && !this.bubble) {
                div.title = e.client.toolTip() || "";
            }

            div.onmousemove = this._onEventMouseMove;
            div.onmouseout = this._onEventMouseOut;
            div.onmousedown = this._onEventMouseDown;
            div.onmouseup = this._onEventMouseUp;

            div.ontouchstart = touch.onEventTouchStart;
            div.ontouchmove = touch.onEventTouchMove;
            div.ontouchend = touch.onEventTouchEnd;
/*
            div.ondragstart = function(e) {
                e.preventDefault();
            };
*/

            if (e.client.clickEnabled()) {
                div.onclick = this._onEventClick;
            }

            if (e.client.doubleClickEnabled()) {
                div.ondblclick = this._eventDoubleClickDispatch;
            }

            div.oncontextmenu = this._eventRightClickDispatch;

            if (typeof cache.ariaLabel !== "undefined") {
                div.setAttribute("aria-label", cache.ariaLabel);
            }
            else {
                div.setAttribute("aria-label", cache.text);
            }

            div.setAttribute("tabindex", "-1");

            var inside = [];
            var durationBarHeight = 0;

            var inner = document.createElement("div");
            inner.setAttribute("unselectable", "on");
            inner.className = calendar._prefixCssClass(cssNames.eventInner);

            if (!isMilestone) {
                if (typeof cache.onElementCreate === "function") {

                    var args = {};
                    args.element = null;
                    cache.onElementCreate(args);

                    if (args.element) {
                        inner.appendChild(cache.element);
                    }

                    e.part.elementCreateArgs = args;
                    e.part.onElementRemove = cache.onElementRemove;
                }
                else {
                    inner.innerHTML = e.client.innerHTML();
                }

            }

            if (cache.backColor) {
                inner.style.background = cache.backColor;
                if (DayPilot.browser.ie9 || DayPilot.browser.ielt9) {
                    inner.style.filter = '';
                }
            }
            if (cache.fontColor) {
                inner.style.color = cache.fontColor;
            }
            if (cache.borderColor) {
                inner.style.borderColor = cache.borderColor;
            }
            if (cache.backImage) {
                inner.style.backgroundImage = "url(" + cache.backImage + ")";
                if (cache.backRepeat) {
                    inner.style.backgroundRepeat = cache.backRepeat;
                }
            }

            div.appendChild(inner);

            var startsHere = e.start().getTime() === e.part.start.getTime();
            var endsHere = e.rawend().getTime() === e.part.end.getTime();

            if (!startsHere && !isMilestone) {
                DayPilot.Util.addClass(div, this._prefixCssClass("_event_continueleft"));
            }
            if (!endsHere && !isMilestone) {
                DayPilot.Util.addClass(div, this._prefixCssClass("_event_continueright"));
            }

            if (e.client.barVisible() && width > 0 && !isMilestone) {
                var barLeft = 100 * e.part.barLeft / (width); // %
                var barWidth = Math.ceil(100 * e.part.barWidth / (width)); // %

                if (this.durationBarMode === "PercentComplete") {
                    barLeft = 0;
                    barWidth = cache.complete || 0;
                }

                var bar = document.createElement("div");
                bar.setAttribute("unselectable", "on");
                bar.className = this._prefixCssClass(cssNames.eventBar);
                bar.style.position = "absolute";

                if (cache.barBackColor) {
                    bar.style.backgroundColor = cache.barBackColor;
                }

                var barInner = document.createElement("div");
                barInner.setAttribute("unselectable", "on");
                barInner.className = this._prefixCssClass(cssNames.eventBarInner);
                barInner.style.left = barLeft + "%";
                //barInner.setAttribute("barWidth", data.part.barWidth);  // debug
                if (0 < barWidth && barWidth <= 1) {
                    barInner.style.width = "1px";
                }
                else {
                    barInner.style.width = barWidth + "%";
                }

                if (cache.barColor) {
                    barInner.style.backgroundColor = cache.barColor;
                }

                if (cache.barImageUrl) {
                    barInner.style.backgroundImage = "url(" + cache.barImageUrl + ")";
                }

                bar.appendChild(barInner);
                div.appendChild(bar);
            }
            div.row = rowIndex;

            if (cache.areas) {
                for (var i = 0; i < cache.areas.length; i++) {
                    var area = cache.areas[i];
                    var v = area.visibility || area.v || "Visible";
                    if (v !== "Visible") {
                        continue;
                    }
                    if (area.start || area.end) {
                        area.left = calendar.getPixels(new DayPilot.Date(area.start)).left - e.part.left;
                        area.width = calendar.getPixels(new DayPilot.Date(area.end)).left - area.left - e.part.left;
                    }
                    var a = DayPilot.Areas.createArea(div, e, area);
                    div.appendChild(a);
                }
            }

            // add it to the events collection
            this.elements.events.push(div);

            // draw the div
            this.divEvents.appendChild(div);

            e.rendered = true;

            // init code for the event
            //div.event = new DayPilotScheduler.Event(div.data, calendar);
            div.event = e;

            if (shouldBeSelected) {
                calendar.multiselect.add(div.event, true);
                calendar.multiselect._update(div);
            }

            if (calendar._api2()) {
                if (typeof calendar.onAfterEventRender === 'function') {
                    var args = {};
                    args.e = div.event;
                    args.div = div;

                    calendar.onAfterEventRender(args);
                }
            }
            else {
                if (calendar.afterEventRender) {
                    calendar.afterEventRender(div.event, div);
                }
            }

            return true;
        };

        this._api2 = function() {
            return calendar.api === 2;
        };

        this._updateEventTops = function() {
            for (var i = 0; i < this.elements.events.length; i++) {
                var div = this.elements.events[i];
                var event = div.event;
                var rowIndex = event.part.dayIndex;
                var row = this.rowlist[rowIndex];
                var rowTop = row.top;
                var top = rowTop + event.part.top;
                div.style.top = top + 'px';

                // versions, including left and right div
                DayPilot.list(div.related).filter(function(item) {
                    return !!item.versionPart;
                }).each(function(rel) {
                    var vpart = rel.versionPart;
                    rel.style.top = (rowTop + vpart.top) + 'px';
                });

                // left and right div
                DayPilot.list(div.related).filter(function(item) {
                    return !item.versionPart && (item.type === "divLeft" || item.type === "divRight");
                }).each(function(rel) {
                    rel.style.top = top + 'px';
                });

                /*
                if (DayPilot.isArray(div.related)) {
                    for (var j = 0; j < div.related.length; j++) {
                        var rel = div.related[j];
                    }
                }
                */
                /*
                if (div.bar) {
                    div.bar.style.top = (rowTop + event.part.top + 10) + 'px'; // HACK
                }*/
            }
        };

        this._findEventDiv = function(e) {
            if (!e) {
                return null;
            }
            for (var i = 0; i < calendar.elements.events.length; i++) {
                var div = calendar.elements.events[i];
                if (div.event === e || div.event.data === e.data) {
                    return div;
                }
            }
            return null;
        };

        this._findEventDivEnsureRendered = function(e) {
            var ev = calendar.events._findEventInRows(e.data);
            if (!ev) {
                return null;
            }
            var row = calendar.rowlist[ev.part.dayIndex];
            calendar._updateEventPositionsInRow(row);
            calendar._drawEvent(ev, {"forced": true});  // make sure it's rendered
            return calendar._findEventDiv(ev);
        };

        this._onEventMouseOut = function(ev) {
            var div = this;

            DayPilot.Areas.hideAreas(div, ev);

            if (div.active) {
                return;
            }

            DayPilot.Util.removeClass(div, calendar._prefixCssClass("_event_hover"));

            calendar._doEventMouseOut(div);

            if (!linking.source) {
                linktools.hideLinkpointsWithDelay();
            }

            if (calendar.bubble && calendar.eventHoverHandling === 'Bubble') {
                calendar.bubble.hideOnMouseOut();
            }

        };

        this._doEventMouseOver = function(div) {
            if (typeof this.onEventMouseOver === "function") {
                var args = {};
                args.div = div;
                args.e = div.event;

                this.onEventMouseOver(args);
            }
        };

        this._doEventMouseOut = function(div) {
            if (typeof this.onEventMouseOut === "function") {
                var args = {};
                args.div = div;
                args.e = div.event;

                this.onEventMouseOut(args);
            }
        };

        this._onEventMouseMove = function(ev) {
            ev = ev || window.event;

            if (calendar.cellBubble) { calendar.cellBubble.delayedHide(); }

            var div = this;
            while (div && !div.event) { // make sure it's the top event div
                div = div.parentNode;
            }

            calendar._eventUpdateCursor(div, ev);

            var deleteDisabled = div.event.cache ? div.event.cache.deleteDisabled : div.event.data.deleteDisabled;

            if (!div.active) {
                var areas = [];
                if (calendar.eventDeleteHandling !== "Disabled" && !deleteDisabled) {
                    var top = calendar.durationBarVisible ? calendar.durationBarHeight : 0;
                    areas.push({"action":"JavaScript","v":"Hover","w":17,"h":17,"top": top + 2,"right":2, "css": calendar._prefixCssClass(cssNames.eventDelete),"js":function(e) { calendar._eventDeleteDispatch(e); } });
                }

                var list = div.event.cache ? div.event.cache.areas : div.event.data.areas;
                if (list && list.length > 0) {
                    areas = areas.concat(list);
                }
                DayPilot.Areas.showAreas(div, div.event, null, areas);
                DayPilot.Util.addClass(div, calendar._prefixCssClass("_event_hover"));

                calendar._doEventMouseOver(div);

            }

            if (calendar.linkCreateHandling !== "Disabled" && !linking.source) {
                linktools.clearHideTimeout();
                linktools.hideLinkpoints();
                if (calendar._noDragAndDropInProgress()) {
                    linktools.showLinkpoint(div);
                }
            }

            if (ev.srcElement) {
                ev.srcElement.insideEvent = true;
            }
            else {
                ev.insideEvent = true;
            }

            // bubbling must be allowed, required for moving and resizing
            //ev.cancelBubble = true;

        };


        this._moving = {};
        var moving = this._moving;

        this._onEventMouseUp = function(ev) {
            if (!calendar.ionicEventClickFix) {
                return;
            }
            var origMouse = moving.originalMouse;
            if (!origMouse) {  // right click
                return;
            }
            var curMouse = DayPilot.mc(ev);
            if (origMouse.x === curMouse.x && origMouse.y === curMouse.y) {
                calendar._onEventClick.call(this, ev);
                ev.preventDefault();
                ev.stopPropagation();
            }
        };

        this._onEventMouseDown = function(ev) {

            calendar._out();

            if (typeof DayPilot.Bubble !== 'undefined') {
                DayPilot.Bubble.hideActive();
                DayPilot.Bubble.cancelShowing();
            }

            ev = ev || window.event;

            // make sure that coordinates are set
            if (!calendar.coords) {
                var ref = calendar._maind;
                calendar.coords = DayPilot.mo3(ref, ev);
            }

            var button = DayPilot.Util.mouseButton(ev);

            ev.preventDefault();
            ev.stopPropagation();

            if (button.left) {
                var shift = ev.shiftKey;
                if (calendar.multiSelectRectangle !== "Disabled" && shift) {
                    rectangle.start();
                    return false;
                }

                if (this.style.cursor === 'w-resize' || this.style.cursor === 'e-resize') {
                    //ev.preventDefault();
                    DayPilotScheduler.preventEventClick = true;

                    // set
                    DayPilotScheduler.resizing = this;
                    DayPilotScheduler.resizingEvent = this.event;
                    DayPilotScheduler.originalMouse = DayPilot.mc(ev);

                    // cursor
                    document.body.style.cursor = this.style.cursor;
                    linktools.hideLinkpoints();
                }
                else if ((this.style.cursor === 'move') || (calendar.moveBy === 'Full' && this.event.client.moveEnabled())) {
                    moving.start = true;
                    moving.moving = this;
                    moving.movingEvent = this.event; // need to store it separately because the event box may get cleaned on sweeping
                    moving.originalMouse = DayPilot.mc(ev);
                    moving.moveOffsetX = DayPilot.mo3(this, ev).x;
                    moving.moveDragStart = calendar.getDate(calendar.coords.x, true);
                    linktools.hideLinkpoints();
                }
            }

            DayPilot.Menu && DayPilot.Menu.active && DayPilot.Menu.active.hide();

            // ev.stopPropagation();

        };

        this._touch = {};
        var touch = calendar._touch;

        if (typeof DayPilot.Global.touch === "undefined") {
            DayPilot.Global.touch = {};
        }
        DayPilot.Global.touch.active = false;
        DayPilot.Global.touch.start = false;
        touch.timeouts = [];

        touch.onEventTouchStart = function(ev) {

            // iOS
            if (DayPilot.Global.touch.active || DayPilot.Global.touch.start) {
                return;
            }

            // prevent onMainTouchStart
            ev.stopPropagation();

            touch.clearTimeouts();

            DayPilot.Global.touch.start = true;
            DayPilot.Global.touch.active = false;

            var div = this;

            var holdfor = calendar.tapAndHoldTimeout;
            touch.timeouts.push(window.setTimeout(function() {

                DayPilot.Global.touch.active = true;
                DayPilot.Global.touch.start = false;

                calendar.coords = touch.relativeCoords(ev);

                ev.preventDefault();

                var e = div.event;

                switch (calendar.eventTapAndHoldHandling) {
                    case "Move":
                        if (e.client.moveEnabled()) {
                            var coords = touchMousePos(ev);
                            touch.startMoving(div, coords);
                        }
                        break;
                    case "ContextMenu":

                        if (DayPilot.Menu) {
                            DayPilot.Menu.touchPosition(ev);
                        }

                        var menu = e.client.contextMenu();

                        if (menu) {
                            menu.show(e);
                        }
                        else {
                            if (calendar.contextMenu) {
                                calendar.contextMenu.show(e);
                            }
                        }

                        break;
                }


            }, holdfor));


        };

        touch.onEventTouchMove = function(ev) {
            touch.clearTimeouts();
            DayPilot.Global.touch.start = false;
        };

        touch.onEventTouchEnd = function(ev) {
            if (DayPilot.Util.isMouseEvent(ev)) {
                return;
            }

            touch.clearTimeouts();

            // quick tap
            if (DayPilot.Global.touch.start) {
                DayPilot.Global.touch.start = false;
                /*
                if (touch.preventEventTap) {
                    return;
                }*/
                //touch.active = false;
                ev.preventDefault();
                ev.stopPropagation();

                var div = this;
                window.setTimeout(function() {
                    calendar._eventClickSingle(div, ev);
                });
            }

            window.setTimeout(function() {
                DayPilot.Global.touch.start = false;
                DayPilot.Global.touch.active = false;
            }, 500);

        };

        touch.onMainTouchStart = function(ev) {

            // prevent after-alert firing on iOS
            if (DayPilot.Global.touch.active || DayPilot.Global.touch.start) {
                return;
            }

            // pinch
            if (ev.touches.length > 1) {
                return;
            }

            if (calendar.timeRangeSelectedHandling === 'Disabled') {
                return;
            }

            touch.clearTimeouts();

            DayPilot.Global.touch.start = true;
            DayPilot.Global.touch.active = false;

            var holdfor = calendar.tapAndHoldTimeout;
            touch.timeouts.push(window.setTimeout(function() {
                DayPilot.Global.touch.active = true;
                DayPilot.Global.touch.start = false;

                ev.preventDefault();

                calendar.coords = touch.relativeCoords(ev);
                touch.range = calendar._rangeFromCoords();
            }, holdfor));

            var tapAllowed = true;
            if (tapAllowed) {
                calendar.coords = touch.relativeCoords(ev);
            }
        };

        touch.onMainTouchMove = function(ev) {
            touch.clearTimeouts();

            DayPilot.Global.touch.start = false;

            if (DayPilotScheduler.resizing) {
                ev.preventDefault();
                touch.updateResizing();
                return;
            }


            if (DayPilot.Global.touch.active) {
                ev.preventDefault();

                calendar.coords = touch.relativeCoords(ev);

                if (DayPilotScheduler.moving) {
                    touch.updateMoving();
                    return;
                }


                if (touch.range) {
                    var range = touch.range;
                    range.end = {
                        x: Math.floor(calendar.coords.x / calendar.cellWidth)
                    };

                    calendar._drawRange(range);
                }
            }

        };

        touch.onMainTouchEnd = function(ev) {
            touch.clearTimeouts();

            var tapAllowed = true;
            try {
                if ( DayPilot.Global.touch.active ) {
                    if ( DayPilotScheduler.moving ) {

                        ev.preventDefault();

                        var e = DayPilotScheduler.movingEvent;

                        if ( calendar !== DayPilotScheduler.movingShadow.calendar ) {
                            return;
                        }

                        var newStart = DayPilotScheduler.movingShadow.start;
                        var newEnd = DayPilotScheduler.movingShadow.end;
                        var newResource = (calendar.viewType !== 'Days') ? DayPilotScheduler.movingShadow.row.id : null;
                        var external = DayPilotScheduler.drag && e.part.external;
                        //var line = DayPilotScheduler.movingShadow.line;

                        var overlapping = DayPilotScheduler.movingShadow.overlapping;
                        var forbidden = !DayPilotScheduler.movingShadow.allowed;

                        DayPilot.Util.removeClass(DayPilotScheduler.moving, calendar._prefixCssClass(calendar._css.eventMovingSource));

                        // clear the moving state
                        DayPilot.de(DayPilotScheduler.movingShadow);
                        calendar._clearShadowHover();
                        DayPilotScheduler.movingShadow.calendar = null;
                        document.body.style.cursor = '';
                        DayPilotScheduler.moving = null;
                        DayPilotScheduler.movingEvent = null;
                        DayPilotScheduler.movingShadow = null;

                        calendar._multimove.clear();
                        if ( overlapping || forbidden || calendar._multimove.forbidden || calendar._multimove.invalid ) {
                            return;
                        }

                        calendar._eventMoveDispatch(e, newStart, newEnd, newResource, external);

                    }

                    if ( touch.range ) {
                        var range = touch.range;
                        touch.range = null;

                        var shadow = calendar.elements.range2;
                        if ( shadow && shadow.overlapping ) {
                            calendar.clearSelection();
                        }
                        else {
                            calendar._timeRangeSelectedDispatchFromRange(range);
                        }

                        /*
                        var sel = calendar._getSelection(touch.range);
                        touch.range = null;
                        calendar._timeRangeSelectedDispatch(sel.start, sel.end, sel.resource);
                        */
                    }
                }
                else if ( DayPilot.Global.touch.start && tapAllowed ) {  // simple tap
                    if ( calendar.coords.x < calendar.getScrollX() ) {
                        return; // invisible
                    }

                    var range = calendar._rangeFromCoords();
                    //alert("rangefromcoords:" + calendar.coords.x);
                    calendar._drawRange(range);

                    var shadow = calendar.elements.range2;
                    if ( shadow && shadow.overlapping ) {
                        calendar.clearSelection();
                    }
                    else {
                        calendar._timeRangeSelectedDispatchFromRange(range);
                    }
                    /*
                    var sel = calendar._getSelection(range);
                    calendar._timeRangeSelectedDispatch(sel.start, sel.end, sel.resource);
                    */
                }
            }catch(e){
            }

            window.setTimeout(function() {
                DayPilot.Global.touch.start = false;
                DayPilot.Global.touch.active = false;
            }, 500);

        };

        touch.clearTimeouts = function() {
            for (var i = 0; i < touch.timeouts.length; i++) {
                clearTimeout(touch.timeouts[i]);
            }
            touch.timeouts = [];
        };

        touch.relativeCoords = function(ev) {
            let coords  = { x: 0, y: 0};
            try {
                const ref = calendar._maind;

                const x = ev.touches[0].pageX;
                const y = ev.touches[0].pageY;

                let abs = DayPilot.abs(ref);
                coords = {x: x - abs.x, y: y - abs.y, toString: function() { return "x: " + this.x + ", y:" + this.y; } };
            } catch (e) {
                console.log('touch.relativeCoords');
                console.log(e.message);
            }
            return coords;
        };

        // coords - page coords
        touch.startMoving = function(div, coords) {
            //var coords = {x: ev.touches[0].pageX, y: ev.touches[0].pageY};

            DayPilotScheduler.moving = div;
            DayPilotScheduler.movingEvent = div.event;
            DayPilotScheduler.originalMouse = coords;

            var absE = DayPilot.abs(div);
            DayPilotScheduler.moveOffsetX = coords.x - absE.x;

            //var absR = DayPilot.abs(calendar.maind);
            //var x = coords.x - absR.x;
            DayPilotScheduler.moveDragStart = calendar.getDate(calendar.coords.x, true);

            DayPilotScheduler.movingShadow = calendar._createShadow(div);

            // update dimensions
            calendar._moveShadow();

        };

        touch.startResizing = function(div, border) {
            //var coords = {x: ev.touches[0].pageX, y: ev.touches[0].pageY};

            DayPilotScheduler.resizing = div;
            DayPilotScheduler.resizingEvent = div.event;
            DayPilotScheduler.resizing.dpBorder = border;
            //DayPilotScheduler.resizing.mousePos = coords;
            //DayPilotScheduler.originalMouse = coords;

            //DayPilotScheduler.moveDragStart = calendar.getDate(calendar.coords.x, true);

            if (!DayPilotScheduler.resizingShadow) {
                DayPilotScheduler.resizingShadow = calendar._createShadow(div);
            }

            // update dimensions
            calendar._resizeShadow();
        };


        // coords - relative to maind
        touch.updateResizing = function() {
            if (!DayPilotScheduler.resizingShadow) {
                var mv = DayPilotScheduler.resizing;
                DayPilotScheduler.resizingShadow = calendar._createShadow(mv);
            }

            calendar._resizeShadow();
        };

        // coords - relative to maind
        touch.updateMoving = function() {
            if (DayPilotScheduler.movingShadow && DayPilotScheduler.movingShadow.calendar !== calendar) {
                // DayPilotScheduler.movingShadow.calendar = null;
                // DayPilot.de(DayPilotScheduler.movingShadow);
                // DayPilotScheduler.movingShadow = null;
                calendar._clearShadowHover();
            }
            if (!DayPilotScheduler.movingShadow) {
                var mv = DayPilotScheduler.moving;
                DayPilotScheduler.movingShadow = calendar._createShadow(mv);
            }

            var target = DayPilotScheduler.movingShadow.calendar;

            //DayPilotScheduler.moving.target = calendar; //might not be necessary, the target is in DayPilotScheduler.activeCalendar
            target._moveShadow();
        };

        this._eventUpdateCursor = function(div, ev) {

/*
            if (calendar.moveBy === "Disabled" || calendar.moveBy === "None") {
                return;
            }
*/
            // const
            var resizeMargin = this.eventResizeMargin;
            var moveMargin = this.eventMoveMargin;

            var object = div;

            if (typeof (DayPilotScheduler) === 'undefined') {
                return;
            }

            // position
            var offset = DayPilot.mo3(div, ev);
            if (!offset) {
                return;
            }

            calendar.eventOffset = offset;

            if (DayPilotScheduler.resizing) {
                return;
            }

            if (DayPilotScheduler.moving) {
                return;
            }

            var isFirstPart = object.event.part.start.toString() === object.event.start().toString();
            var isLastPart = object.event.part.end.toString() === object.event.rawend().toString();

            // top
            if (calendar.moveBy === 'Top' && offset.y <= moveMargin && object.event.client.moveEnabled() && calendar.eventMoveHandling !== 'Disabled') {  // TODO disabled check not necessary
                div.style.cursor = 'move';

/*
                if (isFirstPart) {
                    div.style.cursor = 'move';
                }
                else {
                    div.style.cursor = 'not-allowed';
                }
*/
            }
            // left resizing
            else if ((calendar.moveBy === 'Top' || calendar.moveBy === 'Full') && offset.x <= resizeMargin && object.event.client.resizeEnabled() && calendar.eventResizeHandling !== 'Disabled') {  // TODO disabled check not necessary
                if (isFirstPart) {
                    div.style.cursor = "w-resize";
                    div.dpBorder = 'left';
                }
                else {
                    div.style.cursor = 'not-allowed';
                }
            }
            // left moving
            else if (calendar.moveBy === 'Left' && offset.x <= moveMargin && object.event.client.moveEnabled() && calendar.eventMoveHandling !== 'Disabled') {  // TODO disabled check not necessary
                div.style.cursor = "move";
/*
                if (isFirstPart) {
                    div.style.cursor = "move";
                }
                else {
                    div.style.cursor = 'not-allowed';
                }
*/
            }
            // right resizing
            else if (div.offsetWidth - offset.x <= resizeMargin && object.event.client.resizeEnabled() && calendar.eventResizeHandling !== 'Disabled') {  // TODO disabled check not necessary
                if (isLastPart) {
                    div.style.cursor = "e-resize";
                    div.dpBorder = 'right';
                }
                else {
                    div.style.cursor = 'not-allowed';
                }
            }
            else if (!DayPilotScheduler.resizing && !DayPilotScheduler.moving) {
                if (object.event.client.clickEnabled() && calendar.eventClickHandling !== 'Disabled') {  // TODO disabled check not necessary
                    div.style.cursor = 'pointer';
                }
                else {
                    div.style.cursor = 'default';
                }
            }


            if (typeof (DayPilot.Bubble) !== 'undefined' && calendar.bubble && calendar.eventHoverHandling === 'Bubble') {
                if (div.style.cursor === 'default' || div.style.cursor === 'pointer') {
                    // preventing Chrome bug
                    var notMoved = this._lastOffset && offset.x === this._lastOffset.x && offset.y === this._lastOffset.y;

                    // turned off because it doesn't work on macos
                    var notMoved = false;

                    if (!notMoved) {
                        this._lastOffset = offset;
                        calendar.bubble.showEvent(div.event);
                    }
                }
                else {
                    /*
                    // disabled, now it is hidden on click
                    DayPilot.Bubble.hideActive();
                    */
                }
            }
        };

        this._cellCount = function() {
            if (this.viewType !== 'Days') {
                return this.itline.length;
            }
            else {
                return Math.floor(24 * 60 / this.cellDuration);
            }
        };

        this._getSelection = function(range) {
            //var range = DayPilotScheduler.range;

            var range = range || DayPilotScheduler.range || calendar.rangeHold;

            if (!range) {
                return null;
            }

            var row = calendar.rowlist[range.start.y];

            if (!row) {
                return null;
            }

            var r = range._customized ? range._customized : range;

            var resource = row.id;
            var startX = r.end.x > r.start.x ? r.start.x : r.end.x;
            var endX = (r.end.x > r.start.x ? r.end.x : r.start.x);

            var rowOffset = 0;

            /*
            if (calendar.viewType === 'Days') {
                rowOffset = row.start.getTime() - calendar.startDate.getTime();
            }
            else {
                var rowOffset = row.start.getTime() - this._visibleStart().getTime();  // may be incorrect
            }
            */

            rowOffset = row.start.getTime() - this._visibleStart().getTime();

            var start = this.itline[startX].start.addTime(rowOffset);
            var end = this.itline[endX].end.addTime(rowOffset);

            //end = calendar._adjustEndOut(end);

            return new DayPilot.Selection(start, end, resource, calendar);
        };

        this._createEdit = function(object) {
            var parentTd = object.parentNode;

            var minWidth = calendar.eventEditMinWidth;

            var edit = document.createElement('textarea');
            edit.style.position = 'absolute';
            edit.style.width = ((object.offsetWidth < minWidth) ? minWidth : (object.offsetWidth - 2)) + 'px';
            edit.style.height = (object.offsetHeight - 2) + 'px'; //offsetHeight
            edit.style.fontFamily = DayPilot.gs(object, 'fontFamily') || DayPilot.gs(object, 'font-family');
            edit.style.fontSize = DayPilot.gs(object, 'fontSize') || DayPilot.gs(object, 'font-size');
            edit.style.left = object.offsetLeft + 'px';
            edit.style.top = object.offsetTop + 'px';
            edit.style.border = '1px solid black';
            edit.style.padding = '0px';
            edit.style.marginTop = '0px';
            edit.style.backgroundColor = 'white';
            edit.value = DayPilot.tr(object.event.text());

            edit.event = object.event;
            parentTd.appendChild(edit);
            return edit;
        };

        this._findNextInVieport = function(div) {
            var divs = viewport.events();
            divs.sort(function(a, b) {
                var e1 = a.event;
                var e2 = b.event;
                if (e1.part.dayIndex !== e2.part.dayIndex) {
                    return e1.part.dayIndex - e2.part.dayIndex;
                }
                if (e1.start() !== e2.start()) {
                    return e1.start().getTime() - e2.start().getTime();
                }
                return e2.end().getTime() - e1.end().getTime();
            });
            var index = divs.indexOf(div);

            if (index === -1) {
                return null;
            }
            if (index + 1 < divs.length) {
                return divs[index + 1];
            }
            return divs[0];
        };

        this._divEdit = function(object) {
            if (!object) {
                return;
            }

            if (DayPilotScheduler.editing) {
                DayPilotScheduler.editing.blur();
                //return;
            }

            if (!object.event) {
                return;
            }

            var edit = this._createEdit(object);
            DayPilotScheduler.editing = edit;

            DayPilot.re(edit, DayPilot.touch.start, function(ev) {
                ev.stopPropagation();
            });

            edit.onblur = function() {
                //var id = object.event.value();
                //var tag = object.event.tag();

                edit.onblur = null;

                if (DayPilotScheduler.editing === edit) {
                    DayPilotScheduler.editing = null;
                }

                if (edit.parentNode) {
                    edit.parentNode.removeChild(edit);
                }

                if (!object.event) {
                    return;
                }

                var oldText = object.event.text();
                var newText = edit.value;

                // onEventEdit is always fired
                /*
                if (oldText === newText && !edit.canceling) {
                    return;
                }
                */

                //object.style.display = 'none';
                calendar._eventEditDispatch(object.event, newText, edit.canceling);
            };

            edit.onmousedown = function(e) {
                e = e || window.event;
                e.stopPropagation && e.stopPropagation();
            };

            edit.onkeypress = function(e) {
                var keynum = (window.event) ? event.keyCode : e.keyCode;

                if (keynum === 13) {
                    this.onblur();
                    return false;
                }

                return true;
            };

            edit.cancel = function() {
                if (DayPilotScheduler.editing) {
                    DayPilotScheduler.editing.canceling = true;
                    DayPilotScheduler.editing.blur();
                }
            };

            edit.onkeydown = function(e) {
                var keynum = (window.event) ? event.keyCode : e.keyCode;
                if (keynum === 27) {
                    DayPilotScheduler.editing.cancel();
                }
                else if (keynum === 9) {  // tab
                    var next = calendar._findNextInVieport(object);
                    DayPilotScheduler.editing.cancel();
                    if (next) {
                        if (DayPilot.browser.ie) {
                            setTimeout(function() { calendar._divEdit(next); }, 0);
                        }
                        else {
                            calendar._divEdit(next);
                        }
                    }
                    return false;
                }

            };

            edit.select();
            edit.focus();
        };

        this._onResMouseMove = function(ev) {
            var td = this;
            var row = td.row;
            if (typeof (DayPilot.Bubble) !== 'undefined') {
                if (calendar.cellBubble) {
                    // hideOnMouseOut() is universal, it prevented resource bubble from appearing
                    //calendar.cellBubble.hideOnMouseOut();
                }
                if (calendar.resourceBubble) {
                    //var res = calendar._createResourceBubbleParam(row);
                    var r = calendar._createRowObject(row);
                    r.div = td;
                    calendar.resourceBubble.showResource(r);
                }
            }

            /*
            var div = td.firstChild; // rowheader
            if (!div.active) {
                var row = calendar.rowlist[td.index];
                var r = calendar._createRowObject(row);
                r.areas = row.areas;
                DayPilot.Areas.showAreas(div, r);
            }
            */
        };

        this._onResMouseOut = function(ev) {
            var td = this;
            if (typeof (DayPilot.Bubble) !== 'undefined' && calendar.resourceBubble) {
                calendar.resourceBubble.hideOnMouseOut();
            }

            var div = td.firstChild;

            DayPilot.Areas.hideAreas(div, ev);
            div.data = null;
        };

        this._onResMouseUp = function(ev) {
            if (rowmoving.row) {
                // testing a hack
                rowtools.cancelClick = true;
                setTimeout(function() {
                    rowtools.cancelClick = false;
                }, 100);
            }
        };

        this._drawTimeHeader = function() {

            if (!this.timeHeader) {
                return; // mvc shortInit
            }

            this._cache.timeHeader = {};

            //var oldheader = calendar.nav.header;

            var header = document.createElement("div");
            header.style.position = "relative";
            this.nav.timeHeader = header;

            for (var y = 0; y < this.timeHeader.length; y++) {
                var row = this.timeHeader[y];
                for (var x = 0; x < row.length; x++) {
                    this._drawTimeHeaderCell2(x, y);
                }
            }

            var north = this.divNorth;


            if (north.childNodes.length === 1) {
                north.replaceChild(header, north.childNodes[0]);
            }
            else {
                if (DayPilot.browser.ie) {
                    if (north && north.firstChild) {
                        var nodes = [];
                        for (var i = 0; i < north.firstChild.childNodes.length; i++) {
                            nodes.push(north.firstChild.childNodes[i]);
                        }
                        DayPilot.de(nodes);
                    }
                    //DayPilot.puc(north);
                    // north.innerHTML = '';
                    //north.appendChild(header);
                }

                north.innerHTML = '';
                north.appendChild(header);
            }

            var gridwidth = this._getGridWidth();
            north.style.width = (gridwidth + 5000) + "px";

            calendar.divCorner.innerHTML = this.cornerHtml || '';

            if (gridwidth > 0) {
                this.divStretch.style.width = (gridwidth) + "px";
            }

        };


        this._getGroupName = function(h, cellGroupBy) {
            var html = null;
            var locale = this._resolved.locale();

            var cellGroupBy = cellGroupBy || this.cellGroupBy;

            var from = h.start;
            var to = h.end;
            //var locale = this._resolved.locale();

            switch (cellGroupBy) {
                case 'Hour':
                    html = (calendar._resolved.timeFormat() === 'Clock12Hours') ? from.toString("h tt", locale) : from.toString("H", locale);
                    break;
                case 'Day':
                    html = from.toString(locale.datePattern);
                    break;
                case 'Week':
                    html = resolved.weekStarts() === 1 ? from.weekNumberISO() : from.weekNumber(); // TODO format
                    break;
                case 'Month':
                    html = from.toString("MMMM yyyy", locale);
                    break;
                case 'Quarter':
                    html = "Q" + Math.floor(from.getMonth() / 3 + 1);
                    break;
                case 'Year':
                    html = from.toString("yyyy");
                    break;
                case 'None':
                    html = '';
                    break;
                case 'Cell':
                    // always guess, usually it's the bottom row
                    var duration = (h.end.ticks - h.start.ticks) / 60000;
                    html = this._getCellName(from, duration);
/*
                    if (this.scale === 'Manual' || this.scale === 'CellDuration') {  // hard-to-guess cell sizes
                        var duration = (h.end.ticks - h.start.ticks) / 60000;
                        html = this._getCellName(from, duration);
                    }
                    else {
                        html = this._getGroupName(h, this.scale);
                    }*/
                    break;
                default:
                    throw 'Invalid cellGroupBy value';
            }

            return html;
        };

        this._getCellName = function(start, duration) {
            var locale = this._resolved.locale();
            var duration = duration || this.cellDuration;
            if (duration < 60) // smaller than hour, use minutes
            {
                return start.toString("mm"); //String.Format("{0:00}", from.Minute);
            }
            else if (duration < 1440) // smaller than day, use hours
            {
                return calendar._resolved.timeFormat() === 'Clock12Hours' ? start.toString("h tt", locale) : start.toString("H", locale);
            }
            else if (duration < 10080) // use days
            {
                return start.toString("d");
            }
            else if (duration === 10080) {
                return resolved.weekStarts() === 1 ? start.weekNumberISO() : start.weekNumber(); // TODO format
            }
            else
            {
                return start.toString("MMMM yyyy", locale);
            }
        };

        this._addScaleSize = function(from) {
            var scale = this.scale;
            switch (scale) {
                case "Cell":
                    throw "Invalid scale: Cell";
                case "Manual":
                    throw "Internal error (addScaleSize in Manual mode)";
                case "Minute":
                    return from.addMinutes(1);
                case "CellDuration":
                    return from.addMinutes(this.cellDuration);
                default:
                    return this._addGroupSize(from, scale);
            }
        };

        this._addGroupSize = function(from, cellGroupBy) {
            var to;

            var daysHorizontally = this.viewType !== 'Days' ? this.days : 1;
            var endDate = this.startDate.addDays(daysHorizontally);
            if (calendar.scale  === "Manual") {
                endDate = calendar._visibleEnd();
            }

            var cellGroupBy = cellGroupBy || this.cellGroupBy;
            var cellDuration = 60; // dummy value to make sure it's aligned properly

            switch (cellGroupBy) {
                case 'Hour':
                    if (from.getHours() + from.getMinutes() + from.getSeconds() + from.getMilliseconds() > 0) {
                        from = from.getDatePart().addHours(from.getHours());
                    }
                    to = from.addHours(1);
                    break;
                case 'Day':
                    to = from.getDatePart().addDays(1);
                    break;
                case 'Week':
                    to = from.getDatePart().addDays(1);
                    while (to.dayOfWeek() !== resolved.weekStarts()) {
                        to = to.addDays(1);
                    }
                    break;
                case 'Month':
                    to = from.addMonths(1);
                    to = to.firstDayOfMonth();
                    //to = from.firstDayOfMonth().addDays(from.daysInMonth());

                    //var minDiff =
                    var isInt = (DayPilot.DateUtil.diff(to, from) / (1000.0 * 60)) % cellDuration === 0;
                    while (!isInt) {
                        to = to.addHours(1);
                        isInt = (DayPilot.DateUtil.diff(to, from) / (1000.0 * 60)) % cellDuration === 0;
                    }
                    break;
                case "Quarter":
                    to = from.addMonths(1);
                    to = to.firstDayOfMonth();

                    //to = to.addMonths(to.getMonth() % 3);
                    while (to.getMonth() % 3) {
                        to = to.addMonths(1);
                    }


                    //var minDiff =
                    var isInt = (DayPilot.DateUtil.diff(to, from) / (1000.0 * 60)) % cellDuration === 0;
                    while (!isInt) {
                        to = to.addHours(1);
                        isInt = (DayPilot.DateUtil.diff(to, from) / (1000.0 * 60)) % cellDuration === 0;
                    }

                    break;
                case 'Year':
                    to = from.addYears(1);
                    to = to.firstDayOfYear();

                    var isInt = (DayPilot.DateUtil.diff(to, from) / (1000.0 * 60)) % cellDuration === 0;
                    while (!isInt) {
                        to = to.addHours(1);
                        isInt = (DayPilot.DateUtil.diff(to, from) / (1000.0 * 60)) % cellDuration === 0;
                    }
                    break;
                case 'None':
                    to = endDate;
                    break;
                case 'Cell':
                    var cell = this._getItlineCellFromTime(from);
                    if (cell.current)
                    {
                        to = cell.current.end;
                    }
                    else
                    {
                        if (cell.past) {
                            to = cell.previous.end;
                        }
                        else {
                            to = cell.next.start;
                        }
                    }
                    break;
                default:
                    throw 'Invalid cellGroupBy value';
            }
            if (to.getTime() > endDate.getTime()) {
                to = endDate;
            }

            return to;
        };

        this._css = {};
        this._css.timeheadercol = "_timeheadercol";
        this._css.timeheadercolInner = "_timeheadercol_inner";
        this._css.resourcedivider = "_resourcedivider";
        this._css.eventFloat = "_event_float";
        this._css.eventFloatInner = "_event_float_inner";
        this._css.event = "_event";
        this._css.eventInner = "_event_inner";
        this._css.eventBar = "_event_bar";
        this._css.eventBarInner = "_event_bar_inner";
        this._css.eventDelete = "_event_delete";
        this._css.eventLine = "_event_line";
        this._css.eventMovingSource = "_event_moving_source";
        // this._css.eventMovingSourceAlt = "_event_moving_source_alt";
        var cssNames = this._css;

        this._drawTimeHeaderCell2 = function(x, y) {

            var header = this.nav.timeHeader;

            var p = this.timeHeader[y][x];

            var isGroup = y < this.timeHeader.length - 1;
            var left = p.left;
            var width = p.width;

            var headerDim = dim.timeHeader(y);
            var top = headerDim.top;
            var height = headerDim.height;
            
            // var top = y * resolved.headerHeight();
            // var height = resolved.headerHeight();

            var cell = document.createElement("div");
            cell.style.position = "absolute";
            cell.style.top = top + "px";
            cell.style.left = left + "px";
            cell.style.width = width + "px";
            cell.style.height = height + "px";
            if (p.toolTip) {
                cell.title = p.toolTip;
            }

            cell.setAttribute("aria-hidden", "true");

            if (p.cssClass) {
                DayPilot.Util.addClass(cell, p.cssClass);
            }

            cell.setAttribute("unselectable", "on");
            cell.style.KhtmlUserSelect = 'none';
            cell.style.MozUserSelect = 'none';
            cell.style.webkitUserSelect = 'none';

            cell.oncontextmenu = function() { return false; };
            cell.cell = {};
            cell.cell.start = p.start;
            cell.cell.end = p.end;
            cell.cell.level = y;
            cell.cell.th = p;
            cell.onclick = this._onTimeClick;

            cell.style.overflow = 'hidden';

            if (!calendar.timeHeaderTextWrappingEnabled) {
                cell.style.whiteSpace = "nowrap";
            }

            var inner = document.createElement("div");
            inner.setAttribute("unselectable", "on");
            if (p.innerHTML) {
                inner.innerHTML = p.innerHTML;
            }

            if (p.backColor) {
                inner.style.background = p.backColor;
            }

            if (p.fontColor) {
                inner.style.color = p.fontColor;
            }

            var cl = this._prefixCssClass(cssNames.timeheadercol);
            var cli = this._prefixCssClass(cssNames.timeheadercolInner);
            if (isGroup) {
                cl = this._prefixCssClass("_timeheadergroup");
                cli = this._prefixCssClass("_timeheadergroup_inner");
            }
            DayPilot.Util.addClass(cell, cl);
            DayPilot.Util.addClass(inner, cli);

            DayPilot.Util.addClass(cell, calendar._prefixCssClass("_timeheader_cell"));
            DayPilot.Util.addClass(inner, calendar._prefixCssClass("_timeheader_cell_inner"));

            // prepare left and width from start, end
            DayPilot.list(p.areas).each(function(area) {
                if (area.start) {
                    area.left = calendar.getPixels(new DayPilot.Date(area.start)).left - left;
                    if (area.end) {
                        area.width = calendar.getPixels(new DayPilot.Date(area.end)).left - area.left - left;
                    }
                }
            });

            cell.appendChild(inner);
            DayPilot.Areas.attach(cell, p, {"areas": p.areas});

            this._cache.timeHeader[x + "_" + y] = cell;

            header.appendChild(cell);
        };

        this._updateRowHeights = function() {
            if (calendar._cellStacking) {
                cellstacking.calculateEventPositions();
                return;
            }

            for (var i = 0; i < this.rowlist.length; i++) {
                var row = this.rowlist[i];
                var updated = row.getHeight() + row.marginBottom + row.marginTop;
                if (row.height !== updated) {
                    this._rowsDirty = true;
                }
                row.height = updated;
            }
        };

        this._updateRowHeaderHeights = function() {

            var header = this.divHeader;

            if (!header) {
                return false;
            }

            var len = this.rowlist.length;

            var columns = this.rowHeaderCols ? this.rowHeaderCols.length : 1;
            //var updated = false;

            // row headers
            var j = 0; // real TR index
            //var max = 0;
            for (var i = 0; i < len; i++) {
                var row = this.rowlist[i];
                if (row.hidden) {
                    continue;
                }

                var index = this._resHeaderDivBased ? i : j;

                if (!header.rows[index]) {
                    continue;
                }

                for (var c = 0; c < header.rows[index].cells.length; c++) {
                    var headerCell = header.rows[index].cells[c];

                    if (this._resHeaderDivBased) {
                        headerCell.style.top = row.top + "px";
                    }

                    var newHeight = row.height;

                    if (headerCell && headerCell.firstChild && parseInt(headerCell.firstChild.style.height, 10) !== newHeight) {
                        headerCell.firstChild.style.height = newHeight + "px";
                    }
                }

                j++;
            }

            if (this._resHeaderDivBased) {
                if (calendar.nav.resScrollSpace) {
                    calendar.nav.resScrollSpace.style.top = calendar._innerHeightTree + "px";
                }
            }

        };

        this._drawSeparator = function(index) {
            var s = this.separators[index];


            // fix
            s.location = s.location || s.Location;
            s.color = s.color || s.Color;
            s.layer = s.layer || s.Layer;
            s.width = s.width || s.Width;
            s.opacity = s.opacity || s.Opacity;

            var time = new DayPilot.Date(s.location);
            var color = s.color;
            var width = s.width ? s.width : 1;
            var above = s.layer ? s.layer === 'AboveEvents' : false;
            var opacity = s.opacity ? s.opacity : 100;

            // check the start and end dates of the visible area
            if (time.getTime() < this._visibleStart().getTime()) {
                return;
            }
            if (time.getTime() >= this._visibleEnd().getTime()) {
                return;
            }

            var pixels = this.getPixels(time);

            // check if it's in the hidden area, don't show in that case
            if (pixels.cut) {
                return;
            }

            if (pixels.left < 0) {
                return;
            }
            if (pixels.left > this._cellCount() * this.cellWidth) {
                return;
            }

            var line = document.createElement("div");
            line.style.width = width + 'px';
            line.style.height = calendar._innerHeightTree + 'px';
            line.style.position = 'absolute';
            line.style.left = (pixels.left - 1) + 'px';
            line.style.top = '0px';
            line.style.backgroundColor = color;
            line.style.opacity = opacity / 100;
            line.style.filter = "alpha(opacity=" + opacity + ")";

            if (above) {
                this.divSeparatorsAbove.appendChild(line);
            }
            else {
                this.divSeparators.appendChild(line);
            }

            this.elements.separators.push(line);
        };


        this._onMaindDblClick = function(ev) {
            if (calendar.timeRangeDoubleClickHandling === 'Disabled') {
                return false;
            }

            if (DayPilotScheduler.timeRangeTimeout) {
                clearTimeout(DayPilotScheduler.timeRangeTimeout);
                DayPilotScheduler.timeRangeTimeout = null;
            }

            var range = {};

            // make sure that coordinates are set
            if (!calendar.coords) {
                var ref = calendar._maind;
                calendar.coords = DayPilot.mo3(ref, ev);
            }

            ev = ev || window.event;

            ev.stopPropagation && ev.stopPropagation();
            ev.cancelBubble = true;

            // only process left and right button outside of selection
            if (calendar._isWithinRange(calendar.coords)) {
                var sel = calendar._getSelection(calendar.rangeHold);
                calendar._timeRangeDoubleClickDispatch(sel.start, sel.end, sel.resource);
            }
            else {
                DayPilotScheduler.range = calendar._rangeFromCoords();
                if (DayPilotScheduler.range) {
                    DayPilotScheduler.rangeCalendar = calendar;
                    var sel = calendar._getSelection(DayPilotScheduler.range);
                    calendar._timeRangeDoubleClickDispatch(sel.start, sel.end, sel.resource);
                    calendar.rangeHold = DayPilotScheduler.range;
                }
            }

            // rangeHold remains unchanged - double-clicking an existing selection doesn't cancel it
            /*
            DayPilotScheduler.rangeHold = DayPilotScheduler.range;
            DayPilotScheduler.range = null;
            */


        };

/*
        this._clearDblClickTimeout = function() {
            calendar.dblclick = null;
        };
*/
        // handles:
        // - TimeRangeSelected
        this._onMaindMouseDown = function(ev) {
            try {
                if (DayPilot.Global.touch.start || DayPilot.Global.touch.active) {
                    return;
                }

                if (DayPilotScheduler.timeRangeTimeout && false) {
                    clearTimeout(DayPilotScheduler.timeRangeTimeout);
                    DayPilotScheduler.timeRangeTimeout = null;
                }

                calendar._crosshairHideFull();
                calendar._stopScroll();

                // make sure that coordinates are set
                if (!calendar.coords) {
                    var ref = calendar._maind;
                    calendar.coords = DayPilot.mo3(ref, ev);
                }

                if (DayPilotScheduler.rectangleSelect) {
                    return false;
                }

                ev = ev || window.event;
                var button = DayPilot.Util.mouseButton(ev);

                if (button.middle || (button.right && calendar._isWithinRange(calendar.coords))) {
                    return false;
                }

                if (calendar._isWithinRange(calendar.coords)) {
                    return false;
                }

                var ctrl = ev.ctrlKey;
                var meta = ev.metaKey;
                var shift = ev.shiftKey;
                var ctrlOrMeta = ctrl || meta;

                var args = {};
                args.action = "None";
                if (calendar.multiSelectRectangle !== "Disabled" && shift) {
                    args.action = "RectangleSelect";
                }
                else if (calendar.timeRangeSelectedHandling !== 'Disabled') {
                    args.action = "TimeRangeSelect";
                }
                args.shift = shift;
                args.ctrl = shift;
                args.meta = meta;
                args.originalEvent = ev;
                args.preventDefault = function() {
                    args.action = "None";
                };

                if (typeof calendar.onGridMouseDown === "function") {
                    calendar.onGridMouseDown(args);
                }

                if (args.action === "None") {
                    ev.preventDefault();
                    ev.stopPropagation();
                    return false;
                }

                if (args.action === "RectangleSelect") {
                    var rect = {};
                    rect.start = calendar.coords;
                    rect.calendar = calendar;

                    DayPilotScheduler.rectangleSelect = rect;
                    return false;
                }

                if (calendar.allowMultiRange && !ctrlOrMeta) {
                    mr.clear();
                }

                var i = calendar._getRow(calendar.coords.y).i;
                var row = calendar.rowlist[i];
                if (row.isNewRow) {
                    return false;
                }

                DayPilotScheduler.range = calendar._rangeFromCoords();
                if (DayPilotScheduler.range) {
                    DayPilotScheduler.range.ctrl = ctrlOrMeta;
                    DayPilotScheduler.rangeCalendar = calendar;
                }
            }catch(e){
                return false;
            }

            return false; // prevent FF3 bug (?), dragging is otherwise activated and DayPilot.mo2 gives incorrect results
        };

        // creates a single cell range selection at the current position (calendar.coords)
        this._rangeFromCoords = function() {

            var range = {};

            var cx = this._getItlineCellFromPixels(calendar.coords.x).x;

            range.start = {
                y: calendar._getRow(calendar.coords.y).i,
                x: cx
            };

            range.end = {
                x: cx
            };

            if (this._isRowDisabled(calendar._getRow(calendar.coords.y).i)) {
                return null;
            }

            //return false;

            range.calendar = calendar;
            //DayPilotScheduler.range = range;

            calendar._drawRange(range);

            return range;
        };

        this._doEventResizing = function() {
            calendar._updateResizingShadow();

            var shadow = DayPilotScheduler.resizingShadow;
            var ev = DayPilotScheduler.resizing;

            (function() {

                var last = calendar._lastEventResizing;

                var original = {
                    "start": shadow.start,
                    "end": calendar._adjustEndOut(shadow.end)
                };
                shadow.original = original;

                // don't fire the event if there is no change in input values
                var so = shadow.original;
                if (so && last && last.start === so.start && last.end === calendar._adjustEndOut(so.end)) {
                    return;
                }

                var args = {};
                args.start = original.start;
                args.end = original.end;
                args.duration = new DayPilot.Duration(args.start, args.end);
                args.e = ev.event;
                args.allowed = true;
                args.resizing = DayPilotScheduler.resizing.dpBorder === "left" ? "start" : "end";
                args.left = {};
                args.left.html = args.start.toString(calendar.eventResizingStartEndFormat, resolved.locale());
                args.left.enabled = calendar.eventResizingStartEndEnabled;
                args.left.space = 5;
                args.left.width = null;
                args.right = {};
                args.right.html = args.end.toString(calendar.eventResizingStartEndFormat, resolved.locale());
                args.right.enabled = calendar.eventResizingStartEndEnabled;
                args.right.space = 5;
                args.right.width = null;

                args.multiresize = DayPilot.list(mre.list);

                var info = {};
                info.event = ev;
                info.start = args.start;
                info.end = args.end;
                args.multiresize.splice(0, 0, info);

                // calendar._lastEventResizing = { "start": args.start, "end": args.end };
                calendar._lastEventResizing = original;

                if (typeof calendar.onEventResizing === 'function') {
                    calendar.onEventResizing(args);
                }

                shadow.allowed = args.allowed;


                // allow adjusting the start and end
                var start = args.start;
                var end = calendar._adjustEndIn(args.end);

                shadow.finalStart = start;
                shadow.finalEnd = end;

                // adjust start for viewType="Days"
                if (calendar.viewType === "Days") {
                    var rowIndex = ev.event.part.dayIndex;
                    var row = calendar.rowlist[rowIndex];
                    var rowOffset = row.start.getTime() - calendar._visibleStart().getTime();

                    start = start.addTime(-rowOffset);
                    end = end.addTime(-rowOffset);
                }


                var duration = DayPilot.DateUtil.diff(start, end);
                duration = Math.max(duration, 1);

                var useBox = resolved.useBox(duration);

                var left = useBox ? calendar.getPixels(start).boxLeft : calendar.getPixels(start).left;
                var right = useBox ? calendar.getPixels(end).boxRight : calendar.getPixels(end).left;
                shadow.style.left = left + "px";
                shadow.style.width = (right - left) + "px";

                shadow.left = left;
                shadow.width = right - left;

                calendar._disabledShadow(DayPilotScheduler.resizingShadow, args);
                calendar._showShadowHover(DayPilotScheduler.resizingShadow, args);
            })();

        };

        this._onMaindMouseUp = function(ev) {
            if (DayPilotScheduler.rectangleSelect) {
                var ev = ev || window.event;
                ev.cancelBubble = true;
                ev.preventDefault && ev.preventDefault();

                DayPilotScheduler.gMouseUp(ev);

                return false;  // trying to prevent onmaindclick
            }
            moving = {};  // clear

            if (calendar.rangeHold) {
                // handles clicking an existing time range

                var button = DayPilot.Util.mouseButton(ev);

                if (button.left) {
                    var range = calendar.rangeHold;
                    //var calendar = range.calendar;
                    if (calendar._isWithinRange(calendar.coords)) {

                        var createTimeRangeClickDispatcher = function(range) {
                            return function() {
                                DayPilotScheduler.timeRangeTimeout = null;

                                var sel = calendar._getSelection(range);
                                if (!sel) {
                                    return;
                                }

                                var args = {};
                                args.start = sel.start;
                                args.end = sel.end;
                                args.resource = sel.resource;
                                args.preventDefault = function() {
                                    args.preventDefault.value = true;
                                };
                                if (typeof calendar.onTimeRangeClick === "function") {
                                    calendar.onTimeRangeClick(args);
                                }

                                if (!args.preventDefault.value) {
                                    if (typeof calendar.onTimeRangeClicked === "function") {
                                        calendar.onTimeRangeClicked(args);
                                    }
                                }
                            };
                        };

                        if (calendar.timeRangeClickHandling != "Disabled") {
                            if (calendar.timeRangeDoubleClickHandling === "Disabled") {
                                createTimeRangeClickDispatcher(range)();
                            }
                            else {
                                clearTimeout(DayPilotScheduler.timeRangeTimeout);
                                DayPilotScheduler.timeRangeTimeout = setTimeout(createTimeRangeClickDispatcher(range), calendar.doubleClickTimeout);
                            }
                        }
                    }
                }
            }

        };

        this._dragInProgress = function() {
            return DayPilotScheduler.resizing || DayPilotScheduler.moving || DayPilotScheduler.range;
        };

        // handles:
        // - EventMove (including external)
        // - EventResize
        // - TimeRangeSelected
        //
        // saves calendar.coords
        this._onMaindMouseMove = function(ev) {

            if (DayPilot.Global.touch.active) {
                return;
            }

            DayPilotScheduler.activeCalendar = calendar; // required for moving
            ev = ev || window.event;
            var mousePos = DayPilot.mc(ev);

            calendar.coords = DayPilot.mo3(calendar._maind, ev);

            //ev = ev || window.event;
            ev.insideMainD = true;
            if (window.event && window.event.srcElement) {
                window.event.srcElement.inside = true;
            }

            if (moving.start) {
                var requiredDistance = 3;
                var distance = DayPilot.distance(moving.originalMouse, mousePos);

                if (distance > requiredDistance) {
                    DayPilot.Util.copyProps(moving, DayPilotScheduler);
                    document.body.style.cursor = 'move';
                    moving = {};
                }
            }

            if (DayPilotScheduler.resizing && DayPilotScheduler.resizingEvent.calendar === calendar) {
                if (!DayPilotScheduler.resizing.event) {
                    DayPilotScheduler.resizing.event = DayPilotScheduler.resizingEvent;
                }
                calendar._mouseMoveUpdateResizing();
            }
            else if (DayPilotScheduler.movingEvent  && (DayPilotScheduler.movingEvent.calendar === calendar || DayPilotScheduler.movingEvent.calendar.dragOutAllowed)) {
                /*if (!DayPilotScheduler.moving.event) {
                    DayPilotScheduler.moving.event = DayPilotScheduler.movingEvent;
                }*/

                calendar._mouseMoveUpdateMoving();
            }
            else if (DayPilotScheduler.range && DayPilotScheduler.range.calendar === calendar) {
                DayPilotScheduler.range.moved = true;
                calendar._mouseMoveUpdateRange();
            }
            else if (linking.source) {
                var src = linking.source;
                //linktools.clear();
                //linktools.drawLinkXy(src.coords, calendar.coords, src.type + "ToStart");
                linktools.drawShadow(src.coords, calendar.coords);
            }
            else if (DayPilotScheduler.rectangleSelect) {
                DayPilotScheduler.rectangleSelect.moved = true;
                rectangle.draw();
            }

            // always update, event during drag and drop
            if (calendar.crosshairType !== 'Disabled') {  // crosshair
                calendar._updateCrosshairPosition();
            }

            calendar._cellhover();

            var insideEvent = ev.insideEvent;
            if (window.event  && window.event.srcElement) {
                insideEvent = window.event.srcElement.insideEvent;
            }

            // cell bubble
            if (calendar.cellBubble && calendar.coords && calendar.rowlist && calendar.rowlist.length > 0 && !insideEvent) {

                //var x = Math.floor(calendar.coords.x / calendar.cellWidth);
                var x = calendar._getItlineCellFromPixels(calendar.coords.x).x;
                var y = calendar._getRow(calendar.coords.y).i;

                if (0 <= y && y < calendar.rowlist.length && 0 <= x && x < calendar.itline.length) {
                    var cell = {};
                    cell.calendar = calendar;
                    cell.start = calendar.itline[x].start;
                    cell.end = calendar.itline[x].end;
                    cell.resource = calendar.rowlist[y].id;
                    cell.toJSON = function() {
                        var json = {};
                        json.start = this.start;
                        json.end = this.end;
                        json.resource = this.resource;
                        return json;
                    };

                    calendar.cellBubble.showCell(cell);
                }
            }

            if (DayPilotScheduler.drag) {
                calendar._crosshairHideFull();
                if (DayPilotScheduler.gShadow) {
                    document.body.removeChild(DayPilotScheduler.gShadow);
                }
                DayPilotScheduler.gShadow = null;

                if (!DayPilotScheduler.movingShadow && calendar.coords && calendar.rowlist.length > 0) {
                    //if (DayPilotScheduler.movingShadow) { // can be null if the location is forbidden (first two rows in IE)
                    if (!DayPilotScheduler.movingEvent) { // can be null if the location is forbidden (first two rows in IE)

                        // disabled, this is the original object which can't be used for calculations
                        DayPilotScheduler.moving = DayPilotScheduler.drag.schedulerSourceEvent || {};

                        var event = DayPilotScheduler.drag.event;

                        if (!event) {
                            //var now = new DayPilot.Date().getDatePart();
                            var now = calendar.itline[0].start;
                            var ev = { 'id': DayPilotScheduler.drag.id, 'start': now, 'end': now.addSeconds(DayPilotScheduler.drag.duration), 'text': DayPilotScheduler.drag.text };

                            var data = DayPilotScheduler.drag.data;
                            if (data) {
                                var skip = ['duration', 'element', 'remove', 'duration', 'id', 'text'];
                                for (var name in data) {
                                    if (DayPilot.contains(skip, name)) {
                                        continue;
                                    }
                                    ev[name] = data[name];
                                }
                            }

                            event = new DayPilot.Event(ev);
                            event.calendar = calendar;

                            event.part.duration = DayPilotScheduler.drag.duration;
                        }
                        else if (calendar !== event.calendar) { // source is another calendar
                            var srccal = event.calendar;
                            var originalEvent = event;
                            var newData = DayPilot.Util.copyProps(event.data);
                            event = new DayPilot.Event(newData);
                            event.calendar = srccal;

                            event.part.duration = srccal._getEventDurationWithoutNonBusiness(originalEvent);
                            //event.calendar = calendar;
                        }

                        // mark as external
                        event.part.external = true;

                        var src = DayPilotScheduler.drag.schedulerSourceEvent;
                        if (src && src.event && src.event.calendar === calendar) {
                            event.part.external = false;
                        }

                        if (!DayPilotScheduler.moving.event) {
                            DayPilotScheduler.moving.event = event; // required for accessing the source event during external drag and drop
                        }
                        else if (event.part.external) {
                        // else  {
                            DayPilotScheduler.moving.event.part.external = true;
                        }


                        DayPilotScheduler.movingEvent = event;

                    }
                    //DayPilotScheduler.movingShadow = calendar.createShadow(DayPilotScheduler.drag.duration, calendar.shadow, DayPilotScheduler.drag.shadowType);
                    //DayPilotScheduler.movingShadow = calendar.createShadow(calendar.shadow, DayPilotScheduler.drag.shadowType);

                    DayPilotScheduler.movingShadow = calendar._createShadow(DayPilotScheduler.movingEvent);
                }

                ev.cancelBubble = true;
            }

            // autoscroll
            if (calendar.autoScroll === "Always" ||
                    (calendar.autoScroll === "Drag" && (DayPilotScheduler.moving || DayPilotScheduler.resizing || DayPilotScheduler.range || DayPilotScheduler.rectangleSelect))
                    ) {


                var scrollDiv = calendar.nav.scroll;
                var coords = { x: calendar.coords.x, y: calendar.coords.y };
                coords.x -= scrollDiv.scrollLeft;
                coords.x += infitools.shiftX;
                coords.y -= scrollDiv.scrollTop;

                var width = scrollDiv.clientWidth;
                var height = scrollDiv.clientHeight;

                var border = 30;

                var left = coords.x < border ? coords.x : 0;
                var right = width - coords.x < border ? width - coords.x : 0;

                var top = coords.y < border ? coords.y : 0;
                var bottom = height - coords.y < border ? height - coords.y : 0;

                var x = 0;
                var y = 0;

                var speed = 50;

                if (left) {
                    x = -speed*invertedPct(left, border);
                }
                if (right) {
                    x = speed*invertedPct(right, border);
                }
                if (top) {
                    y = -speed*invertedPct(top, border)/2;
                }
                if (bottom) {
                    y = speed*invertedPct(top, border)/2;
                }

                if (DayPilotScheduler.resizing || DayPilotScheduler.range) {
                    y = 0;
                }

                if (x || y) {
                    calendar._startScroll(x, y);
                }
                else {
                    calendar._stopScroll();
                }
            }

            // don't cancel the event bubbling here, it will hurt position detection used in DayPilot ContextMenu and DayPilot Bubble
            //ev.cancelBubble = true;
        };

        function invertedPct(value, max) {
            return 1 - value/max;
        }

        this._mouseMoveUpdateRange = function() {
            var range = DayPilotScheduler.range;
            range.end = {
                //x: Math.floor(calendar.coords.x / calendar.cellWidth)
                x: calendar._getItlineCellFromPixels(calendar.coords.x).x
            };

            calendar._drawRange(range);
        };


        // external because of autoscroll
        this._mouseMoveUpdateResizing = function() {
            if (!DayPilotScheduler.resizingShadow) {
                DayPilotScheduler.resizingShadow = calendar._createShadow(DayPilotScheduler.resizing);
            }

            // not necessary, replaced by calendar.coords
            // DayPilotScheduler.resizing.mousePos = mousePos;

            calendar._resizeShadow();
        };

        this._mouseMoveUpdateMoving = function() {
            if (DayPilotScheduler.movingShadow && DayPilotScheduler.movingShadow.calendar !== calendar) {
                DayPilotScheduler.movingShadow.calendar = null;
                DayPilot.de(DayPilotScheduler.movingShadow);
                DayPilotScheduler.movingShadow = null;
            }
            if (!DayPilotScheduler.movingShadow) {
                var skipThis = window.navigator.userAgent.indexOf("Chrome/61.0") > -1;
                if (!skipThis) {
                    DayPilot.Util.addClass(DayPilotScheduler.moving, calendar._prefixCssClass(cssNames.eventMovingSource));
                }

                var mv = DayPilotScheduler.movingEvent;
                DayPilotScheduler.movingShadow = calendar._createShadow(mv);
            }

            calendar._expandParent();

            //DayPilotScheduler.moving.target = calendar; //might not be necessary, the target is in DayPilotScheduler.activeCalendar

            calendar._moveShadow();
        };

        this._rectangle = {};
        var rectangle = this._rectangle;

        rectangle.start = function() {
            var rect = {};
            rect.start = calendar.coords;
            rect.calendar = calendar;

            DayPilotScheduler.rectangleSelect = rect;
        };

        rectangle.draw = function() {
            var rect = DayPilotScheduler.rectangleSelect;
            var start = DayPilotScheduler.rectangleSelect.start;
            var end = calendar.coords;

            rectangle.clear();

            var original = {
                "x": rect.x,
                "y": rect.y,
                "width": rect.width,
                "height": rect.height
            };

            var left, top, width, height;

            var startX, startY, endX, endY;
            (function rectifyStartEnd() {
                startX = Math.min(start.x, end.x);
                endX = Math.max(start.x, end.x);
                if (calendar.multiSelectRectangle === "Free") {
                    startY = Math.min(start.y, end.y);
                    endY = Math.max(start.y, end.y);
                }
                else if (calendar.multiSelectRectangle === "Row") {
                    startY = start.y;  // the original row, end.y not used here
                    endY = start.y;
                }
            })();

            if (calendar.multiSelectRectangle === "Free") {
                left = startX;
                top = startY;
                width = endX - startX;
                height = endY - startY;
            }
            else if (calendar.multiSelectRectangle === "Row") {
                var y = calendar._getRow(startY).i;
                var row = calendar.rowlist[y];

                top = row.top;
                height = row.height;

                var startCell = calendar._getItlineCellFromPixels(startX).cell;
                left = startCell.left;

                var endCell = calendar._getItlineCellFromPixels(endX).cell;
                width = endCell.left + endCell.width - left;

            }
            else {
                throw "Invalid DayPilot.Scheduler.multiSelectRectangle value: " + calendar.multiSelectRectangle;
            }

            var div = DayPilot.Util.div(calendar.divRectangle, left, top, width, height);
            div.style.boxSizing = "border-box";
            div.style.backgroundColor = "#0000ff";
            div.style.border = "1px solid #000033";
            div.style.opacity = 0.4;

            rect.x = left;
            rect.y = top;
            rect.width = width;
            rect.height = height;

            if (rect.x !== original.x || rect.y !== original.y || rect.width !== original.width || rect.height !== original.height) {  // change detected
                if (typeof calendar.onRectangleEventSelecting === "function") {
                    var args = {};
                    args.events = viewport.eventsInRectangle(rect.x, rect.y, rect.width, rect.height).map(function(item) {return item.event; });
                    args.start = calendar.getDate(rect.x, true);
                    args.end = calendar.getDate(rect.x + rect.width, true);
                    calendar.onRectangleEventSelecting(args);
                }
            }

        };

        rectangle.clear = function() {
            // clear
            calendar.divRectangle.innerHTML = '';
            calendar.elements.rectangle = [];
        };

        this._getCurrentCell = function() {
            var x, y;
            if (calendar.coords && calendar.rowlist && calendar.rowlist.length > 0 && calendar.itline && calendar.itline.length > 0) {
                x = calendar._getItlineCellFromPixels(calendar.coords.x).x;
                y = calendar._getRow(calendar.coords.y).i;
                if (y >= calendar.rowlist.length) {
                    return;
                }
            }
            else {
                return null;
            }

            var cells = calendar.cells.findXy(x, y);
            return cells[0];
        };

        this._cellhover = function() {

            var cell = this._getCurrentCell();
            if ( cell ) {
                if ( this.hover.cell ) {
                    if ( this.hover.cell.x === cell.x && this.hover.cell.y === cell.y ) {
                        return;
                    }
                    this._cellhoverout();
                }

                this.hover.cell = cell;

                if ( typeof this.onCellMouseOver === 'function' ) {
                    var args = {};
                    args.cell = cell;
                    this.onCellMouseOver(args);
                }
            }
        };

        this._cellhoverout = function() {
            if (!this.hover.cell) {
                return;
            }
            if (typeof this.onCellMouseOut === 'function') {
                var args = {};
                args.cell = this.hover.cell;
                this.onCellMouseOut(args);
            }
            this.hover.cell = null;
        };

        this.hover = {};

        this._updateCrosshairPosition = function() {
            var cell = this._getCurrentCell();
            if (!cell) {
                return;
            }
            if (this.hover.cell) {
                if (this.hover.cell.x === cell.x && this.hover.cell.y === cell.y) {
                    return;
                }
            }
            this._crosshair();
        };

        this._crosshairHideFull = function() {
            this.divCrosshair.innerHTML = '';
            this._crosshairVertical = null;
            this._crosshairHorizontal = null;
        };

        this._crosshairHide = function() {
            this._crosshairHideFull();

            if (this._crosshairTop && this._crosshairTop.parentNode) {
                this._crosshairTop.parentNode.removeChild(this._crosshairTop);
                this._crosshairTop = null;
            }

            if (this._crosshairLeft) {
                for (var i = 0; i < this._crosshairLeft.length; i++) {
                    var ch = this._crosshairLeft[i];
                    if (ch.parentNode) {
                        ch.parentNode.removeChild(ch);
                    }
                }
                this._crosshairLeft = null;
            }

            this._crosshairLastX = -1;
            this._crosshairLastY = -1;
        };

        this._crosshair = function() {
            var x, y;
            if (calendar.coords && calendar.rowlist && calendar.rowlist.length > 0) {
                x = calendar._getItlineCellFromPixels(calendar.coords.x).x;
                y = calendar._getRow(calendar.coords.y).i;
                if (y >= calendar.rowlist.length) {
                    return;
                }
            }
            else {
                return;
            }

            var type = this.crosshairType;

            var row = calendar.rowlist[y];

            if (type === 'Full') {
                // vertical
                var itc = this.itline[x];

                var left = itc.left;

                var line = this._crosshairVertical;
                if (!line) {
                    var line = document.createElement("div");
                    line.style.height = calendar._innerHeightTree + 'px';
                    line.style.position = 'absolute';
                    line.style.top = '0px';
                    /*
                    line.style.backgroundColor = this.crosshairColor;
                    line.style.opacity = this.crosshairOpacity / 100;
                    line.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";
                    */
                    line.className = calendar._prefixCssClass("_crosshair_vertical");
                    this._crosshairVertical = line;
                    this.divCrosshair.appendChild(line);
                }

                line.style.left = left + 'px';
                line.style.width = itc.width + 'px';

                // horizontal
                var top = row.top;
                var height = row.height;
                //var width = this._cellCount() * this.cellWidth;
                var width = this._getGridWidth();

                var line = this._crosshairHorizontal;
                if (!line) {
                    var line = document.createElement("div");
                    line.style.width = width + 'px';
                    line.style.height = height + 'px';
                    line.style.position = 'absolute';
                    line.style.top = top + 'px';
                    line.style.left = '0px';
                    /*
                    line.style.backgroundColor = this.crosshairColor;
                    line.style.opacity = this.crosshairOpacity / 100;
                    line.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";*/
                    line.className = calendar._prefixCssClass("_crosshair_horizontal");
                    this._crosshairHorizontal = line;
                    this.divCrosshair.appendChild(line);
                }

                line.style.top = top + 'px';
                line.style.height = height + 'px';

            }

            var thc = this._getTimeHeaderCell(this.coords.x);
            if (thc && this._crosshairLastX !== thc.x) {
                if (this._crosshairTop && this._crosshairTop.parentNode) {
                    this._crosshairTop.parentNode.removeChild(this._crosshairTop);
                    this._crosshairTop = null;
                }
                
                var height = dim.timeHeader(calendar.timeHeaders.length - 1).height;

                // top
                var line = document.createElement("div");
                line.style.width = thc.cell.width + "px";
                // line.style.height = resolved.headerHeight() + "px";
                line.style.height = height + "px";
                line.style.left = '0px';
                line.style.top = '0px';
                line.style.position = 'absolute';
                /*
                line.style.backgroundColor = this.crosshairColor;
                line.style.opacity = this.crosshairOpacity / 100;
                line.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";
                */
                line.className = calendar._prefixCssClass("_crosshair_top");

                this._crosshairTop = line;
                var north = this.divNorth;
                var lastHeader = this.timeHeader ? this.timeHeader.length - 1 : 1;
                if (this.nav.timeHeader) {
                    this._cache.timeHeader[thc.x + "_" + lastHeader].appendChild(line);
                }
                else {
                    if (north.firstChild.rows[lastHeader].cells[x]) {
                        north.firstChild.rows[lastHeader].cells[x].firstChild.appendChild(line);
                    }
                }
            }

            if (this._crosshairLastY !== y) {

                if (this._crosshairLeft) {
                    for (var i = 0; i < this._crosshairLeft.length; i++) {
                        var ch = this._crosshairLeft[i];
                        if (ch.parentNode) {
                            ch.parentNode.removeChild(ch);
                        }
                    }
                    this._crosshairLeft = null;
                }

                // left
                var columns = this.rowHeaderCols ? this.rowHeaderCols.length : 1;

                this._crosshairLeft = [];
                if (this.divHeader.rows[y]) {
                    for (var i = 0; i < this.divHeader.rows[y].cells.length; i++) {
                        //var width = this.rowHeaderCols ? this.rowHeaderCols[i] : this.rowHeaderWidth;
                        var width = calendar._getOuterRowHeaderWidth();

                        // disabled because of Chrome performance problems (.clientWidth is expensive)
                        //var width = this.divHeader.rows[row.i].cells[i].clientWidth;

                        var line = document.createElement("div");
                        line.style.width = width + "px";
                        line.style.height = row.height + "px";
                        line.style.left = '0px';
                        line.style.top = '0px';
                        line.style.position = 'absolute';
                        /*
                        line.style.backgroundColor = this.crosshairColor;
                        line.style.opacity = this.crosshairOpacity / 100;
                        line.style.filter = "alpha(opacity=" + this.crosshairOpacity + ")";*/
                        line.className = calendar._prefixCssClass("_crosshair_left");

                        this._crosshairLeft.push(line);
                        this.divHeader.rows[y].cells[i].firstChild.appendChild(line);
                    }
                }
            }

            if (thc) {
                this._crosshairLastX = thc.x;
            }
            this._crosshairLastY = y;
        };

        this._getTimeHeaderCellForY = function(y, pixels) {
            var row = calendar.timeHeader[y];
            if (!row) {
                return null;
            }
            for (var i = 0; i < row.length; i++) {
                var cell = row[i];
                if (pixels >= cell.left && pixels < cell.left + cell.width) {
                    var result = {};
                    result.cell = cell;
                    result.x = i;
                    return result;
                }
            }
            return null;
        };

        this._getTimeHeaderCell = function(pixels) {
            //var last = this.timeHeader[this.timeHeader.length - 1];
            /*
            var last = DayPilot.list(this.timeHeader).last();
            if (!last) {
                return null;
            }
            */
            return calendar._getTimeHeaderCellForY(calendar.timeHeader.length - 1, pixels);


        };

        this._onMaindRightClick = function(ev) {

            ev = ev || window.event;

            if (calendar.timeRangeSelectedHandling === 'Disabled') {
                return false;
            }

            if (calendar.timeRangeRightClickHandling === "Disabled") {
                return false;
            }

            //  ***************************************
            var selection = null;
            if (calendar._isWithinRange(calendar.coords)) {
                selection = calendar._getSelection(calendar.rangeHold);
            }
            else {
                selection = calendar._getSelection();
            }

            if (!selection) {
                return;
            }

            selection.end = calendar._adjustEndOut(selection.end);


            var args = {};
            args.start = selection.start;
            args.end = selection.end;
            args.resource = selection.resource;

            args.preventDefault = function() {
                this.preventDefault.value = true;
            };

            if (typeof calendar.onTimeRangeRightClick === "function") {
                calendar.onTimeRangeRightClick(args);
                if (args.preventDefault.value) {
                    return false;
                }
            }

            if (calendar.timeRangeRightClickHandling === "ContextMenu" && calendar.contextMenuSelection) {
                calendar.contextMenuSelection.show(selection);
            }

            if (typeof calendar.onTimeRangeRightClicked === "function") {
                calendar.onTimeRangeRightClicked(args);
            }


            //  ***************************************

            ev.cancelBubble = true;

            if (!calendar.allowDefaultContextMenu) {
                return false;
            }
        };

        this._isWithinRange = function(coords) {
            var range = calendar.rangeHold;

            if (!range || !range.start || !range.end) {
                return false;
            }

            var row = this._getRowByIndex(range.start.y);

            var leftToRight = range.start.x < range.end.x;

            var rangeLeft = (leftToRight ? range.start.x : range.end.x) * this.cellWidth;
            var rangeRight = (leftToRight ? range.end.x : range.start.x) * this.cellWidth + this.cellWidth;
            var rangeTop = row.top;
            var rangeBottom = row.bottom;

            if (coords.x >= rangeLeft && coords.x <= rangeRight && coords.y >= rangeTop && coords.y <= rangeBottom) {
                return true;
            }

            return false;
        };

        this._drawRange = function(range, justDraw) {

            var range = range || DayPilotScheduler.range;

            if (!range) {
                return;
            }

            if (range.calendar !== calendar) {
                return;
            }

            function draw(range) {
                var startX = range.end.x > range.start.x ? range.start.x : range.end.x;
                var endX = (range.end.x > range.start.x ? range.end.x : range.start.x);
                var y = range.start.y;
                var row = calendar.rowlist[y];

                var start = calendar.itline[startX];
                var end = calendar.itline[endX];

                var left = start.left;
                var right = end.left + end.width;
                var width = right - left;

                var cell = calendar.elements.range2;

                if (!cell) {
                    cell = document.createElement("div");
                    cell.style.position = 'absolute';
                    cell.setAttribute("unselectable", "on");

                    cell.className = calendar._prefixCssClass("_shadow");
                    var inner = document.createElement("div");
                    inner.className = calendar._prefixCssClass("_shadow_inner");
                    cell.appendChild(inner);

                    calendar.divRange.appendChild(cell);
                }

                cell.style.left = (start.left) + "px";
                cell.style.top = calendar.rowlist[y].top + "px";
                cell.style.width = width + "px";
                cell.style.height = (calendar.rowlist[y].height - 1) + "px";

                cell.calendar = calendar;

                calendar.elements.range2 = cell;

                (function checkOverlap() {
                    cell.overlapping = false;

                    var row = calendar.rowlist[y];
                    var shadow = cell;
                    var left = start.left;

                    calendar._overlappingShadow(cell, row, left, width, null);

                    calendar._checkDisabledCells(cell, start.start, end.end, row.id);

                })();

                return cell;
            }

            (function () {
                var startX = range.end.x > range.start.x ? range.start.x : range.end.x;
                var endX = (range.end.x > range.start.x ? range.end.x : range.start.x);
                var y = range.start.y;
                var row = calendar.rowlist[y];

                if (!row) {
                    return;
                }

                var start = calendar.itline[startX];
                var end = calendar.itline[endX];

                var last = calendar._lastRange;
                var startDateTime = start.start.addTime(row.data.offset);
                var endDateTime = end.end.addTime(row.data.offset);

                // don't fire the event if there is no change
                if (!justDraw && last && last.start.getTime() === startDateTime.getTime() && last.end.getTime() === endDateTime.getTime() && last.resource === calendar.rowlist[y].id) {
                    return;
                }

                var original = {
                    "start": startDateTime,
                    "end": calendar._adjustEndOut(endDateTime)
                };

                var args = {};
                args.start = original.start;
                args.end = original.end;
                args.duration = new DayPilot.Duration(original.start, original.end);
                args.resource = calendar.rowlist[y].id;
                args.allowed = true;
                args.left = {};
                args.left.html = args.start.toString(calendar.timeRangeSelectingStartEndFormat, resolved.locale());
                args.left.enabled = calendar.timeRangeSelectingStartEndEnabled;
                args.left.space = 5;
                args.left.width = null;
                args.right = {};
                args.right.html = args.end.toString(calendar.timeRangeSelectingStartEndFormat, resolved.locale());
                args.right.enabled = calendar.timeRangeSelectingStartEndEnabled;
                args.right.space = 5;
                args.right.width = null;
                //args.overlaps = calendar.elements.range2.overlapping;

                calendar._lastRange = args;

                if (typeof calendar.onTimeRangeSelecting === 'function' && !justDraw) {
                    calendar.onTimeRangeSelecting(args);
                }

                var copy = calendar._copyRange(range);
                calendar._updateRange(copy, args.start, args.end);
                var cell = draw(copy);

                calendar._disabledShadow(cell, args);

                range._customized = copy;
                range.disabled = !args.allowed;

                calendar._showShadowHover(cell, args);

                args.start = original.start;
                args.end = original.end;

            })();

        };

        this._copyRange = function(range) {
            return {
                "start": {
                    "x": range.start.x,
                    "y": range.start.y
                },
                "end": {
                    "x": range.end.x
                },
                "disabled": range.disabled,
                "calendar": range.calendar
            }
        };

        this.range = {};
        this.range.all = function() {
            return mr.get();
        };

        this._multirange = {};
        var mr = this._multirange;

        this._multirange.list = [];

        this._multirange.clear = function() {
            DayPilot.de(DayPilot.list(mr.list).map(function(item) { return item.div; }));
            mr.list = [];
        };

        this._multirange.add = function(range) {
            range.div = calendar.elements.range2;
            calendar.elements.range2 = null;
            calendar._clearShadowHover(); // ?
            mr.list.push(range);
        };

        this._multirange.get = function() {
            return DayPilot.list(mr.list).map(function(item) { return calendar._getSelection(item);});
        };

        this._multirange.dispatch = function() {
            if (!calendar.allowMultiRange) {
                return;
            }
            if (DayPilotScheduler.range) { // in progress
                return;
            }

            var last = DayPilot.list(mr.list).last();
            calendar._timeRangeSelectedDispatchFromRange(last);
            /*
            var last = calendar._getSelection(DayPilot.list(mr.list).last());
            if (!last) {
                return;
            }
            calendar._timeRangeSelectedDispatch(last.start, last.end, last.resource);
            */
        };

        this._onMaindClick = function(ev) {

            if (calendar.timeRangeSelectedHandling === 'Disabled') {
                return false;
            }

            // fired on Android/Chrome on DOM change under finger
            if (DayPilot.Global.touch.active || DayPilot.Global.touch.start) {
                return;
            }

            ev = ev || window.event;
            var button = DayPilot.Util.mouseButton(ev);

            if (DayPilotScheduler.range) { // time range selecting already active
                return;
            }

            if (DayPilotScheduler.rectangleSelect) {
                return;
            }

            if (calendar.rangeHold && calendar._isWithinRange(calendar.coords) && (button.right || button.middle)) {
                return;
            }

            if (calendar._isRowDisabled(calendar._getRow(calendar.coords.y).i)) {
                return;
            }

            var range = {};

            var cx = calendar._getItlineCellFromPixels(calendar.coords.x).x;

            range.start = {
                y: calendar._getRow(calendar.coords.y).i,
                x: cx
            };

            range.end = {
                x: cx
            };
            
            range.calendar = calendar;

            // must be called before dispatch
            calendar.rangeHold = range;

            // disabled, it's called from timeRangeSelectedDispatch
            //calendar._drawRange(range);

            calendar._timeRangeSelectedDispatchFromRange(range);

        };

        this.timeouts = {};
        this.timeouts.drawEvents = null;
        this.timeouts.drawCells = null;
        this.timeouts.click = null;
        this.timeouts.resClick = [];
        this.timeouts.updateFloats = null;


        //this.disableOnScroll = false;

        this._onScroll = function(ev) {

/*
            if (calendar.disableOnScroll) {
                return;
            }
*/
            calendar._clearCachedValues();

            var divScroll = calendar.nav.scroll;

            calendar._scrollPos = divScroll.scrollLeft;
            calendar._scrollTop = divScroll.scrollTop;
            calendar._scrollWidth = divScroll.clientWidth;

            calendar.divTimeScroll.scrollLeft = calendar._scrollPos;
            calendar.divResScroll.scrollTop = calendar._scrollTop;

            if (infitools.isEnabled() && calendar._initialized && calendar.cellWidthSpec != "Auto") {

                if (infitools.active) {
                    /*if (calendar.nav.scroll.scrollLeft === 0) {
                        //calendar.nav.scroll.scrollLeft = 1;
                        calendar.nav.scroll.style.overflow = "hidden";
                    }*/
                    doNothing();
                }
                else {

                    if (calendar.nav.scroll.scrollLeft < calendar.infiniteScrollingMargin) {
                        infitools.active = true;
                        calendar.nav.scroll.style.overflowX = "hidden";

                        setTimeout(function() {
                            infitools.shiftStart(-calendar.infiniteScrollingStepDays);
                        }, 100);
                        return;
                    }
                    else if (calendar.nav.scroll.scrollWidth - (calendar.nav.scroll.scrollLeft + calendar.nav.scroll.clientWidth) < calendar.infiniteScrollingMargin) {
                        infitools.active = true;
                        calendar.nav.scroll.style.overflowX = "hidden";

                        setTimeout(function() {
                            infitools.shiftStart(calendar.infiniteScrollingStepDays);
                        }, 100);
                        return;
                    }
                }

            }

            if (calendar.navigatorBackSync) {
                (function backSync() {
                    var navi = DayPilot.Util.evalVariable(calendar.navigatorBackSync);
                    var start = calendar.getViewPort().start;
                    navi.select(start, { "dontNotify": true, "dontFocus": true});
                })();
            }

            if (calendar.dynamicLoading) {
                calendar._saveState();

                // need to render it here so the user can see the resources during scrolling
                //calendar._drawResHeadersProgressive();

                if (!calendar.dynamicLoadingDelayedCellRendering) {
                    var f = calendar._delayedDrawCells();
                    f();
                }

                calendar._onScrollDynamic();
                return;
            }

            //calendar._loadingStart();

            if (calendar.timeouts.drawEvents) {
                clearTimeout(calendar.timeouts.drawEvents);
                calendar.timeouts.drawEvents = null;
            }
            if (calendar.scrollDelayEvents > 0) {
                calendar.timeouts.drawEvents = setTimeout(calendar._delayedDrawEvents(), calendar.scrollDelayEvents);
            }
            else {
                /*
                var f = calendar._delayedDrawEvents();
                f();
                */
                calendar._drawEvents();
            }


            if (calendar.timeouts.drawCells) {
                clearTimeout(calendar.timeouts.drawCells);
                calendar.timeouts.drawCells = null;
            }
            if (calendar.scrollDelayCells > 0) {
                calendar.timeouts.drawCells = setTimeout(calendar._delayedDrawCells(), calendar.scrollDelayCells);
            }
            else {
                var f = calendar._delayedDrawCells();
                f();
            }

            if (calendar.timeouts.updateFloats) {
                clearTimeout(calendar.timeouts.updateFloats);
                calendar.timeouts.updateFloats = null;
            }
            if (calendar.scrollDelayFloats > 0) {
                calendar.timeouts.updateFloats = setTimeout(function() { calendar._updateFloats(); }, calendar.scrollDelayFloats);
            }
            else {
                calendar._updateFloats();
            }

            calendar.onScrollCalled = true;
        };

        /*
        this._delayedRefresh = function() {
            return function() {
                calendar._saveState();
                calendar._drawCells();
                calendar.refreshTimeout = window.setTimeout(calendar._delayedDrawEvents(), 200); // chain update
            };
        };
        */

        this._delayedDrawCells = function() {
            return function() {
                if (!calendar) {
                    return;
                }

                calendar._saveState();
                calendar._drawCells();
                // testing
                //calendar._updateHeight();
            };
        };


        this._delayedDrawEvents = function() {
            var batch = true; // turns on batch rendering

            return function() {
                if (!calendar) {
                    return;
                }

                if (calendar._hiddenEvents()) {
                    //calendar._loadingStart();

                    window.setTimeout(function() {
                        calendar._deleteOldEvents();
                        window.setTimeout(function() { calendar._drawEvents(batch); }, 50);
                    }, 50);
                }
                else {
                    calendar._findEventsInViewPort();
                }
            };
        };

        this._clearCachedValues = function() {
            this._cache.eventHeight = null;
            this._cache.drawArea = null;
        };

        this.show = function() {
            this.visible = true;
            this._previousVisible = true;
            calendar.nav.top.style.display = '';
            this._show();
            this._resize();
            this._redrawInvalidatedCells();
            calendar._onScroll();
        };

        this.hide = function() {
            this.visible = false;
            this._previousVisible = false;
            calendar.nav.top.style.display = 'none';
        };

        this._checkSuspendedOnScroll = function() {
            // turned off
            return;
/*
            if (calendar._onScrollRequested) {
                calendar._onScrollRequested = false;

                var delay = calendar.scrollDelayDynamic;
                var divScroll = calendar.nav.scroll;
                calendar.refreshTimeout = window.setTimeout(calendar._delayedRefreshDynamic(divScroll.scrollLeft, divScroll.scrollTop), delay);
            }*/
        };

        this._onScrollDynamic = function() {

            var divScroll = calendar.nav.scroll;

            calendar._scrollPos = divScroll.scrollLeft;
            calendar._scrollTop = divScroll.scrollTop;
            calendar._scrollWidth = divScroll.clientWidth;

            calendar.divTimeScroll.scrollLeft = calendar._scrollPos;
            calendar.divResScroll.scrollTop = calendar._scrollTop;

            if (calendar.refreshTimeout) {
                window.clearTimeout(calendar.refreshTimeout);
            }

            var delay = calendar.scrollDelayDynamic;

            calendar.refreshTimeout = window.setTimeout(calendar._delayedRefreshDynamic(divScroll.scrollLeft, divScroll.scrollTop), delay);
            /*
            if (calendar._noDragAndDropInProgress()) {
                calendar.refreshTimeout = window.setTimeout(calendar._delayedRefreshDynamic(divScroll.scrollLeft, divScroll.scrollTop), delay);
            }
            else {
                calendar._onScrollRequested = true;
            }
            */


            calendar._updateFloats();
        };

        this._findEventInList = function(data) {

            if (!calendar.events.list) {
                return null;
            }

            var eid = data.id;
            var estart = new DayPilot.Date(data.start).toString();

            for (var j = 0; j < this.events.list.length; j++) {
                var ex = this.events.list[j];
                // var exid = ex.id;

                if (calendar._isSameEvent(ex, data)) {
                    var result = {};
                    result.ex = ex;
                    result.index = j;
                    result.modified = !calendar._equalObjectFlat(data, ex);
                    return result;
                }

                /*
                if (exid === eid) {
                    // it's a recurring event (occurrence)
                    if (DayPilot.Util.isNullOrUndefined(eid) && !DayPilot.Util.isNullOrUndefined(data.recurrentMasterId)) {
                        var exstart = new DayPilot.Date(ex.start).toString();
                        if (ex.recurrentMasterId !== data.recurrentMasterId || estart !== exstart) {
                            continue;
                        }
                    }
                    var result = {};
                    result.ex = ex;
                    result.index = j;
                    result.modified = !calendar._equalObjectFlat(data, ex);
                    return result;
                }
                */
            }
            return null;
        };

        this._equalObjectFlat = function(first, second) {
            for (var name in first) {
                if (typeof first[name] === 'object'  && !(first[name] instanceof DayPilot.Date)) {
                    continue;
                }
                if (first[name] !== second[name]) {
                    return false;
                }
            }

            for (var name in second) {
                if (typeof second[name] === 'object') {
                    continue;
                }
                if (first[name] !== second[name]) {
                    return false;
                }
            }

            return true;
        };

        this._loadEventsDynamic = function(supplied, finished, clear, toBeDeleted) {
            var updatedRows = [];

            if (clear) {
                calendar._loadEvents(supplied);
            }
            else {
                var deletelist = [];

                // first, delete events
                DayPilot.list(toBeDeleted).forEach(function(id) {
                    var data = DayPilot.list(calendar.events.list).find(function(data) {
                        return data.id === id;
                    });
                    if (data) {
                        deletelist.push(data);
                    }
                });

                deletelist.forEach(function(data) {
                    var rows = calendar.events._removeFromRows(data);
                    updatedRows = updatedRows.concat(rows);
                });


                var foundlist = [];
                // compare only against the original list
                for (var i = 0; i < supplied.length; i++) {
                    var e = supplied[i];
                    foundlist[i] = calendar._findEventInList(e);
                }

                // perform the action
                for (var i = 0; i < supplied.length; i++) {
                    var e = supplied[i];

                    var found = foundlist[i];
                    var update = found && found.modified;
                    var add = !found;

                    if (update) {
                        // update it directly in list
                        this.events.list[found.index] = e;

                        // remove it from rows
                        var rows = calendar.events._removeFromRows(found.ex);
                        updatedRows = updatedRows.concat(rows);
                    }
                    else if (add) {
                        this.events.list.push(e);
                    }

                    if (update || add) {
                        updatedRows = updatedRows.concat(calendar.events._addToRows(e));
                    }
                }
                calendar._loadRows(updatedRows);
                calendar._updateRowHeights();
            }

            calendar._prepareRowTops();
            calendar._updateHeight();

            // only for partial update
            var useRowBasedUpdate = !clear;
            if (useRowBasedUpdate) {   // doesn't draw events that were swept
                calendar._updateRowsNoLoad(updatedRows, false, function() {
                    finished && finished();

                    calendar._deleteOldEvents();
                    // draw remaining events - loaded but not rendered (close to viewport)
                    calendar._drawEvents();
                });
            }
            else {
                calendar._deleteEvents();

                // disabled, it prevented cellSweeping from working
                // calendar._deleteCells();

                calendar._updateRowHeaderHeights();
                calendar._drawCells();

                calendar._drawEvents();
            }
        };

        this._delayedRefreshDynamic = function(scrollX, scrollY) {
            if (!calendar._serverBased()) {
                return function() {
                    if (typeof calendar.onScroll === 'function') {
                        // make sure the background is rendered immediately
                        // TODO test
                        //calendar._drawCells();

                        var update = function(args) {
                            //var updatedRows = calendar._loadEvents(events, true);
                            var finished = function() {
                                if (calendar._api2()) {
                                    if (typeof calendar.onAfterRender === 'function') {
                                        var args = {};
                                        args.isCallBack = false;
                                        args.isScroll = true;
                                        args.data = null;

                                        calendar.onAfterRender(args);
                                    }
                                }
                            };

                            calendar._loadEventsDynamic(args.events, finished, args.clearEvents, args.remove);
                        };


                        var args = {};
                        args.viewport = calendar.getViewPort();
                        args.async = false;
                        args.events = [];
                        args.remove = [];
                        args.clearEvents = false;
                        args.loaded = function() {
                            if (this.async) {
                                update(args);
                            }
                        };

                        calendar.onScroll(args);

                        if (!args.async) {
                            update(args);
                        }

                    }
                };
            }
            else {
                return function() {
                    calendar.scrollX = scrollX;
                    calendar.scrollY = scrollY;
                    calendar._callBack2('Scroll');
                };
            }
        };

        this._drawCellsFull = function() {
            var area = this._getDrawArea();

            var cellLeft = area.xStart;
            var cellWidth = area.xEnd - area.xStart;
            var cellTop = area.yStart;
            var cellHeight = area.yEnd - area.yStart;

            // initialize for client-side processing
            if (!this.cellProperties) {
                this.cellProperties = {};
            }

            for (var i = 0; i <= cellWidth; i++) {
                var x = cellLeft + i;
                for (var j = 0; j < cellHeight; j++) {
                    var y = cellTop + j;
                    if (!this.rowlist[y].hidden) {
                        this._drawCell(x, y);
                    }
                }
                this._drawLineVertical(x);
            }

            // full height
            var rarea = this._getAreaRowsWithMargin();
            for (var y = rarea.start; y < rarea.end; y++) {
                if (!this.rowlist[y].hidden) {
                    this._drawLineHorizontal(y);
                }
            }

        };

        this._drawCells = function() {
            if (calendar._disposed) {
                return;
            }

            if (calendar.progressiveRowRendering) {
                this._drawResHeadersProgressive();
            }

            if (this.rowlist !== null && this.rowlist.length > 0) {
                var sweep = this.cellSweeping;
                if (sweep) {
                    var keepOld = this.cellSweepingCacheSize;
                    this._deleteOldCells(keepOld);
                }

                this._drawCellsFull();
                this._drawTimeBreaks();
                rowtools._updateHighlighting();
            }

            // scrollbar update moved to updateHeight()

            this._rowsDirty = false;

        };

        this._drawTimeBreaks = function() {

            //this.elements.cells = [];  // just to make sure
            var area = this._getDrawArea();

            for (var x = area.xStart; x < area.xEnd; x++) {
                var breaks = (x < this.itline.length - 1) ? this.itline[x + 1].breakBefore : false;
                if (breaks) {
                    this._drawTimeBreak(x);
                }
            }
        };

        this._drawTimeBreak = function(x) {
            var index = "x" + x;
            if (this._cache.breaks[index]) {
                return;
            }

            //var left = x * this.cellWidth + this.cellWidth - 1;
            var left = this.itline[x + 1].left - 1;
            var height = this._innerHeightTree;

            var line = document.createElement("div");
            line.style.left = left + "px";
            line.style.top = "0px";
            line.style.width = "1px";
            line.style.height = height + "px";
            line.style.fontSize = '1px';
            line.style.lineHeight = '1px';
            line.style.overflow = 'hidden';
            line.style.position = 'absolute';
            line.setAttribute("unselectable", "on");
            line.className = this._prefixCssClass("_matrix_vertical_break");

            this.divBreaks.appendChild(line);
            this.elements.breaks.push(line);

            this._cache.breaks[index] = line;

        };

        this._getDrawArea = function() {

            if (calendar._cache.drawArea) {
                return calendar._cache.drawArea;
            }

            if (!this.nav.scroll) {
                return null;
            }

            // const
            //var preCache = 30;
            var scrollTop = calendar._scrollTop;

            var area = {};

            //var divScroll = calendar.divScroll;
            //***
            // var marginX = this.dynamicEventRenderingMargin;
            var marginX = this.dynamicEventRenderingMarginX != null ? this.dynamicEventRenderingMarginX : this.dynamicEventRenderingMargin;
            var marginY = this.dynamicEventRenderingMarginY != null ? this.dynamicEventRenderingMarginY : this.dynamicEventRenderingMargin;
            var left = calendar._scrollPos - marginX - infitools.shiftX;
            var right = left + calendar._scrollWidth + 2*marginX;

            var start = 0;
            var end = 0;

            if (calendar.itline && calendar.itline.length > 0) {
                start = calendar._getItlineCellFromPixels(left).x;
                end = calendar._getItlineCellFromPixels(right, true).x;
                var totalWidth = this._cellCount();
                end = Math.min(end, totalWidth); // make sure it's within the boundaries
                start = Math.max(start, 0); // check the left side
            }

            var top = scrollTop - marginY;
            var bottom = scrollTop + this.nav.scroll.offsetHeight + 2*marginY;

            var cellTop = this._getRow(top).i;
            var cellBottom = this._getRow(bottom).i;
            if (cellBottom < this.rowlist.length) {
                cellBottom++;
            }

            area.xStart = start;
            area.xEnd = end;
            area.yStart = cellTop;
            area.yEnd = cellBottom;

            area.pixels = {};
            area.pixels.left = this.nav.scroll.scrollLeft - infitools.shiftX;
            area.pixels.right = this.nav.scroll.scrollLeft - infitools.shiftX + this.nav.scroll.clientWidth;
            area.pixels.top = this.nav.scroll.scrollTop;
            area.pixels.bottom = this.nav.scroll.scrollTop + this.nav.scroll.clientHeight;
            area.pixels.width = this.nav.scroll.scrollWidth;

            calendar._cache.drawArea = area;

            return area;
        };

        this._getGridWidth = function() {
            var result = 0;

            var last = this.itline[this.itline.length - 1];
            if (!last) {
                result = 0;
            }
            else {
                result = last.left + last.width;
            }

            if (result < 0 || isNaN(result)) {
                result = 0;
            }
            return result;
        };

        this._drawLineHorizontal = function(y) {
            var index = "y" + y;

            if (this._cache.linesHorizontal[index]) {
                return;
            }

            var top = this.rowlist[y].top + this.rowlist[y].height - 1;
            //var width = this._cellCount() * this.cellWidth;
            var width = this._getGridWidth();

            var line = document.createElement("div");
            line.style.left = "0px";
            line.style.top = top + "px";
            line.style.width = width + "px";
            line.style.height = "1px";
            line.style.fontSize = '1px';
            line.style.lineHeight = '1px';
            line.style.overflow = 'hidden';
            line.style.position = 'absolute';
            line.setAttribute("unselectable", "on");
            line.className = this._prefixCssClass("_matrix_horizontal_line");

            this.divLines.appendChild(line);
            //this.elements.linesHorizontal.push(line);

            this._cache.linesHorizontal[index] = line;

        };

        this._drawLineVertical = function(x) {

            var itc = this.itline[x];
            if (!itc) {
                return;
            }

            var index = "x" + x;
            if (this._cache.linesVertical[index]) {
                return;
            }

            //var left = (x + 1) * this.cellWidth - 1;
            var left = itc.left + itc.width - 1;

            var line = document.createElement("div");
            line.style.left = left + "px";
            line.style.top = "0px";
            line.style.width = "1px";
            line.style.height = calendar._innerHeightTree + "px";
            line.style.fontSize = '1px';
            line.style.lineHeight = '1px';
            line.style.overflow = 'hidden';
            line.style.position = 'absolute';
            line.setAttribute("unselectable", "on");
            line.className = this._prefixCssClass("_matrix_vertical_line");

            this.divLines.appendChild(line);
            this.elements.linesVertical.push(line);

            this._cache.linesVertical[index] = line;
        };

        this._toggle = function(index) {

            var row = this.rowlist[index];
            var expanded = !row.expanded;

            row.expanded = expanded;
            if (row.resource) {
                row.resource.expanded = expanded;
            }
            var rows = this._updateChildren(index, row.expanded);

            if (!expanded) {
                for (var i = 0; i < rows.length; i++) {
                    var ri = rows[i];
                    this._deleteEventsInRow(ri);
                }
            }

            this._prepareRowTops();

            // the height needs to be updated before drawing cells
            this._drawResHeader();
            //this._drawResHeadersProgressive(); // not sure, should be fired from drawCells
            this._updateHeight();
            this._clearCachedValues();


            if (expanded) {
                for (var i = 0; i < rows.length; i++) {
                    var ri = rows[i];
                    this._drawEventsInRow(ri);
                }
                this._findEventsInViewPort();
            }

            this._updateEventTops();

            linktools.load();

            //this.nav.scroll.style.display = 'none';
            this._deleteCells(); // don't confuse the cache
            this._drawCells();
            //this.nav.scroll.style.display = '';


            // make sure that events that were outside of viewport before collapsing get rendered
            this._drawEvents();

            this._saveState();
            this._clearCachedValues();

            var r = this._createRowObject(row, index);
            if (expanded) {
                this._resourceExpandDispatch(r);
            }
            else {
                this._resourceCollapseDispatch(r);
            }

        };

        this._loadNode = function(i) {
            var params = {};
            params.index = i;

            if (typeof this.onLoadNode === 'function') {
                var args = {};
                var resource = this.rowlist[i].resource;
                args.resource = resource;
                args.async = false;
                args.loaded = function() {
                    if (this.async) {
                        resource.dynamicChildren = false;
                        resource.expanded = true;
                        calendar.update();
                    }
                };

                this.onLoadNode(args);

                if (!args.async) {
                    resource.dynamicChildren = false;
                    resource.expanded = true;
                    this.update();
                }
            }
            else {
                this._callBack2('LoadNode', params);
            }

        };

        this._updateChildren = function(i, topExpanded) {
            var row = this.rowlist[i];
            var changed = [];
            //var node = this.tree[i];

            if (row.children === null || row.children.length === 0) {
                return changed;
            }

            for (var k = 0; k < row.children.length; k++) {
                var index = row.children[k];
                var child = this.rowlist[index];

                var visible = topExpanded && row.expanded && !child._hiddenUsingFilter;

                child.hidden = !visible; // show/hide but don't change Expanded state
                if (topExpanded === !child.hidden) {
                    changed.push(index);
                }
                var uchildren = this._updateChildren(index, topExpanded);
                if (uchildren.length > 0) {
                    changed = changed.concat(uchildren);
                }
            }

            return changed;
        };

        this._startScroll = function(stepX, stepY) {
            //var step = 10;
            this._stopScroll();
            this._scrollabit(stepX, stepY);
        };

        this._scrollabitX = function(step) {
            if (!step) {
                return false;
            }
            var total = this.nav.scroll.scrollWidth;
            var start = this.nav.scroll.scrollLeft;
            var width = this.nav.scroll.clientWidth;
            var right = start + width;

            if (step < 0 && start <= 0) {
                return false;
            }

            if (step > 0 && right >= total) {
                return false;
            }

            this.nav.scroll.scrollLeft += step;
            calendar.coords.x += step;

            calendar._scrollabitUpdateShadow();

            // this is not necessary, it's linked using nav.scroll.onscroll
            //this.divTimeScroll.scrollLeft = this.nav.scroll.scrollLeft;

            return true;
        };

        this._scrollabitY = function(step) {
            if (!step) {
                return false;
            }
            var total = this.nav.scroll.scrollHeight;
            var start = this.nav.scroll.scrollTop;
            var height = this.nav.scroll.clientHeight;
            var bottom = start + height;

            if (step < 0 && start <= 0) {
                return false;
            }

            if (step > 0 && bottom >= total) {
                return false;
            }

            this.nav.scroll.scrollTop += step;
            calendar.coords.y += step;

            calendar._scrollabitUpdateShadow();

            // this is not necessary, it's linked using nav.scroll.onscroll
            //this.divTimeScroll.scrollTop = this.nav.scroll.scrollTop;

            return true;
        };


        this._scrollabitUpdateShadow = function() {
            if (DayPilotScheduler.resizing && DayPilotScheduler.resizing.event.calendar === calendar) {
                calendar._mouseMoveUpdateResizing();
            }
            else if (DayPilotScheduler.moving  && (DayPilotScheduler.movingEvent.calendar === calendar || DayPilotScheduler.movingEvent.calendar.dragOutAllowed)) {
                if (!DayPilotScheduler.moving.event) {
                    DayPilotScheduler.moving.event = DayPilotScheduler.movingEvent;
                }
                calendar._mouseMoveUpdateMoving();
            }
            else if (DayPilotScheduler.range && DayPilotScheduler.range.calendar === calendar) {
                calendar._mouseMoveUpdateRange();
            }
        };

        this._scrollabit = function(stepX, stepY) {

            var moved = this._scrollabitX(stepX) || this._scrollabitY(stepY);
            if (!moved) {
                return;
            }

            var delayed = function(stepX, stepY) {
                return function() {
                    calendar._scrollabit(stepX, stepY);
                };
            };

            this._autoScrollTimeout = window.setTimeout(delayed(stepX, stepY), 100);

        };

        this._stopScroll = function() {
            if (calendar._autoScrollTimeout) {
                window.clearTimeout(calendar._autoScrollTimeout);
                calendar._autoScrollTimeout = null;
            }
        };

        this._prepareRowTops = function() {
            var top = 0;
            for (var i = 0; i < this.rowlist.length; i++) {
                var row = this.rowlist[i];
                if (!row.hidden) {
                    row.top = top;
                    top += row.height;
                }
            }
            this._innerHeightTree = top;
            //return top; // now it's the bottom of the last visible row
        };

        this._deleteCells = function() {

            if (DayPilot.browser.ie) {
                calendar._deleteCellsByOne();
            }

            this.elements.cells = [];
            //this.elements.linesHorizontal = [];
            this.elements.breaks = [];
            this._cache.cells = [];
            this._cache.breaks = [];
            this.divCells.innerHTML = '';
            this.divBreaks.innerHTML = '';

            calendar._deleteLines();
        };

        this._deleteLines = function() {
            this.divLines.innerHTML = '';
            this._cache.linesVertical = {};
            this._cache.linesHorizontal = {};
            this.elements.linesVertical = [];
        };

        this._deleteCellsByOne = function(y) {
            var list = DayPilot.list();
            for (var name in calendar._cache.cells) {
                list.push(calendar._cache.cells[name]);
            }
            list.each(function(item) {
                calendar._deleteCell(item);
            });
        };


        this._deleteCellsInRow = function(y) {
            var list = DayPilot.list();
            for (var name in calendar._cache.cells) {
                list.push(calendar._cache.cells[name]);
            }
            list.filter(function(item) {
                return item && item.coords && item.coords.y === y;
            }).each(function(item) {
                calendar._deleteCell(item);
            });
        };

        this._cellsRendered = 0;

        //this._cellProps = ['html', 'cssClass', 'backColor', 'backImage', 'backRepeat', 'business', 'areas'];
        this._cellPropsBlank = DayPilot.list(['html', 'cssClass', 'backColor', 'backImage', 'backRepeat', 'areas', 'disabled']);  // "business" removed
        this._cellProps = calendar._cellPropsBlank.add('business');

        this._drawCell = function(x, y) {

            if (!this._initialized) {
                return;
            }

            //var itc = this.itline[x];
            var itc = calendar._getItline(x);
            if (!itc) {
                return;
            }

            var index = x + '_' + y;
            if (this._cache.cells[index]) {
                return;
            }

            var p = this._getCellProperties(x, y);

            calendar._doBeforeCellRender(x, y);

            // don't draw cells with no/default properties
            if (!this.drawBlankCells) {
                var isDefault = false;
                if (this._isRowParent(y)) {
                    isDefault = false;
                }
                else if (!this._hasProps(p, calendar._cellPropsBlank)) {
                    isDefault = true;
                }
                if (isDefault) {
                    return;
                }
            }

            var cell = document.createElement("div");
            cell.style.left = (itc.left) + "px";
            cell.style.top = this.rowlist[y].top + "px";
            cell.style.width = (itc.width) + "px";
            cell.style.height = (this.rowlist[y].height) + "px";
            cell.style.position = 'absolute';
            if (p && p.backColor) {
                cell.style.backgroundColor = p.backColor;
            }
            cell.setAttribute("unselectable", "on");
            cell.className = this._prefixCssClass('_cell');

            cell.coords = {};
            cell.coords.x = x;
            cell.coords.y = y;

            if (this._isRowParent(y)) {
                DayPilot.Util.addClass(cell, this._prefixCssClass("_cellparent"));
            }

            if (p) {
                if (p.cssClass) {
                    DayPilot.Util.addClass(cell, p.cssClass);
                }
                if (!DayPilot.Util.isNullOrUndefined(p.html)) {
                    cell.innerHTML = p.html;
                }
                if (p.backImage) {
                    cell.style.backgroundImage = "url(\"" + p.backImage + "\")";
                }
                if (p.backRepeat) {
                    cell.style.backgroundRepeat = p.backRepeat;
                }
                if (p.business && calendar.cellsMarkBusiness) {
                    DayPilot.Util.addClass(cell, calendar._prefixCssClass("_cell_business"));
                }

                DayPilot.list(p.areas).each(function(area) {
                    if (area.start || area.end) {
                        area.left = calendar.getPixels(new DayPilot.Date(area.start)).left - itc.left;
                        area.width = calendar.getPixels(new DayPilot.Date(area.end)).left - area.left - itc.left;
                    }
                });

                var c = calendar.cells.findXy(x, y)[0];
                DayPilot.Areas.attach(cell, c, {"areas": p.areas});
            }

            // disabled because it is firing the onTimeRangeSelected twice
            //cell.onclick = this._onMaindClick;

            // disabled temporarily, might not be necessary
            //cell.onmouseup = this._onMaindMouseUp;

            this.divCells.appendChild(cell);
            this.elements.cells.push(cell);

            this._cache.cells[index] = cell;

            //this._cellsRendered += 1;

        };

        this._bcrCache = {};

        this._redrawInvalidatedCells = function() {
            var rows = calendar._rowsWithInvalidCells();
            rows.each(function(y) {
                calendar._deleteCellsInRow(y);
            });

            calendar._drawCells();

        };

        /*
        this.redrawInvalidatedCells = function() {
            calendar._redrawInvalidatedCells();
        };
        */

        this._rowsWithInvalidCells = function() {
            // find all rows in viewport and check for invalid cells

            var result = DayPilot.list();  // array of rows indices

            var area = this._getDrawArea();

            var cellLeft = area.xStart;
            var cellWidth = area.xEnd - area.xStart;
            var cellTop = area.yStart;
            var cellHeight = area.yEnd - area.yStart;

            for (var j = 0; j < cellHeight; j++) {
                var y = cellTop + j;
                for (var i = 0; i <= cellWidth; i++) {
                    var x = cellLeft + i;
                    if (!this.rowlist[y].hidden) {
                        //this._drawCell(x, y);
                        if (!calendar._bcrCache[x + "_" + y]) {
                            result.push(y);
                            break;
                        }
                    }
                }
                //this._drawLineVertical(x);
            }

            return result;
        };

        this._doBeforeCellRender = function(x, y) {
            if (typeof this.onBeforeCellRender === 'function') {
                if (calendar.beforeCellRenderCaching && calendar._bcrCache[x + "_" + y]) {
                    return;
                }
                calendar._bcrCache[x + "_" + y] = true;

                var itc = calendar._getItline(x);
                if (!itc) {
                    return;
                }
                //var row = calendar.rowlist[y];
                //var resource = row.id;
                //var rowOffset = row.start.getTime() - this._visibleStart().getTime();
                //var start = itc.start.addTime(rowOffset);
                //var end = itc.end.addTime(rowOffset);

                var cell = calendar.cells.findXy(x, y)[0];

                var args = {};
                args.cell = cell;
                args.getPixels = function(date) {
                    var date = new DayPilot.Date(date);
                    var totalpix = calendar.getPixels(date).left;
                    return totalpix - itc.left;
                };

                this.onBeforeCellRender(args);

                // backwards compatibility
                // args.cell.properties is the cellProperties[x_y] object, use it
                // args.cell holds methods
                DayPilot.Util.copyProps(args.cell, args.cell.properties, calendar._cellProps);

                if (args.cell.properties.disabled) {
                    calendar._bcrCache._dirtyDisabled = true;
                }

                return args;
            }

        };

        this._hasProps = function(object, props) {
            if (props) {
                for (var i = 0; i < props.length; i++) {
                    if (!DayPilot.Util.isNullOrUndefined(object[props[i]])) {
                        return true;
                    }
                }
            }
            else {
                for (var name in object) {
                    if (!DayPilot.Util.isNullOrUndefined(object[name])) {
                        return true;
                    }
                }
            }
            return false;
        };

        this.clearSelection = function() {
            this._deleteRange();
            mr.clear();
        };

        this.cleanSelection = this.clearSelection;

        this.selectTimeRange = function(start, end, resource, dontFireEvent) {
            var row = calendar._findRowByResourceId(resource);

            var itcStart = calendar._getItlineCellFromTime(start);
            var cellStart = itcStart.current || itcStart.next;
            if (!cellStart) {
                throw new DayPilot.Exception("Time range selection 'start' out of timeline");
            }

            var itcEnd = calendar._getItlineCellFromTime(new DayPilot.Date(end).addSeconds(-1));
            var cellEnd = itcEnd.current || itcEnd.previous;
            if (!cellEnd) {
                throw new DayPilot.Exception("Time range selection 'end' out of timeline");
            }

            var range = {};

            range.start = {
                y: row.index,
                x: DayPilot.indexOf(calendar.itline, cellStart)
            };

            range.end = {
                x: DayPilot.indexOf(calendar.itline, cellEnd)
            };

            range.calendar = this;

            //DayPilotScheduler.range = range;

            calendar._drawRange(range);

            if (!dontFireEvent) {
                setTimeout(function() {
                    calendar._timeRangeSelectedDispatchFromRange(range);
                }, 0);
            }

        };

        this._clearMovingShadow = function() {
            DayPilot.de(DayPilotScheduler.movingShadow);
            DayPilotScheduler.movingShadow = null;
            calendar._clearShadowHover();
            calendar._multimove.clear();

            if (DayPilot.Global.movingLink) {
                DayPilot.Global.movingLink.clear();
                DayPilot.Global.movingLink = null;
            }
        };

        this._deleteRange = function() {
            // IE doesn't like the div empty
            this.divRange.innerHTML = '<div style="position:absolute; left:0px; top:0px; width:0px; height:0px;"></div>';
            this.elements.range = [];
            this.elements.range2 = null;

            this._clearShadowHover();

            calendar.rangeHold = null;
        };

        this._resolved = {};
        var resolved = this._resolved;

        resolved.clearCache = function() {
            delete calendar._cache.eventHeight;
            delete calendar._cache.headerHeight;
        };

        resolved.locale = function() {
            return DayPilot.Locale.find(calendar.locale);
        };

        resolved.timeFormat = function() {
            if (calendar.timeFormat !== 'Auto') {
                    return calendar.timeFormat;
            }
            return resolved.locale().timeFormat;
        };

        resolved.weekStarts = function() {
            if (calendar.weekStarts === 'Auto') {
                var locale = resolved.locale();
                if (locale) {
                    return locale.weekStarts;
                }
                else {
                    return 0; // Sunday
                }
            }
            else {
                return calendar.weekStarts || 0;
            }
        };

/*
        resolved.rounded = function() {
            return calendar.eventCorners === 'Rounded';
        };
*/

        resolved.layout = function() {
            var isIE6 = /MSIE 6/i.test(navigator.userAgent);
            if (calendar.layout === 'Auto') {
                if (isIE6) {
                    return 'TableBased';
                }
                else {
                    return 'DivBased';
                }
            }
            return calendar.layout;
        };

        resolved.notifyType = function() {
            var type;
            if (calendar.notifyCommit === 'Immediate') {
                type = "Notify";
            }
            else if (calendar.notifyCommit === 'Queue') {
                type = "Queue";
            }
            else {
                throw "Invalid notifyCommit value: " + calendar.notifyCommit;
            }

            return type;
        };

        resolved.isResourcesView = function() {
            return calendar.viewType !== 'Days';
        };


        resolved.useBox = function(durationTicks) {
            if (calendar.useEventBoxes === 'Always') {
                return true;
            }
            if (calendar.useEventBoxes === 'Never') {
                return false;
            }
            return durationTicks < calendar._getCellDuration() * 60 * 1000;
        };

        resolved.eventHeight = function() {
            if (calendar._cache.eventHeight) {
                return calendar._cache.eventHeight;
            }
            var height = calendar._getDimensionsFromCss("_event_height").height;
            if (!height) {
                height = calendar.eventHeight;
            }
            calendar._cache.eventHeight = height;
            return height;
        };

        resolved.headerHeight = function() {
            if (calendar._cache.headerHeight) {
                return calendar._cache.headerHeight;
            }
            var height = calendar._getDimensionsFromCss("_header_height").height;
            if (!height) {
                height = calendar.headerHeight;
            }
            calendar._cache.headerHeight = height;
            return height;
        };

        resolved.splitterWidth = function() {
            if (calendar.rowHeaderScrolling) {
                return calendar.rowHeaderSplitterWidth;
            }
            return 1;
        };

        this._dim = {};

        var dim = this._dim;

        dim.timeHeader = function(level) {
            var h = {};
            h.top = 0;
            h.height = 0;

            var defaultHeight = resolved.headerHeight();

            for (var i = 0; i <= level; i++) {
                var th = calendar.timeHeaders[i];
                h.top += h.height;
                h.height =  th.height || defaultHeight;
            }

            return h;
        };

        this._getColor = function(x, y) {
            var index = x + '_' + y;
            if (this.cellProperties && this.cellProperties[index]) {
                return this.cellProperties[index].backColor;
            }
            return null;
        };

        this._getCellProperties = function(x, y) {
            var index = x + '_' + y;

            // supplied from the server side, includes hidden rows - adjust y here
            if (calendar.cellConfig) {
                var fixedY = 0;
                for (var i = 0; i < calendar.resources.length; i++) {
                    if (!calendar.resources[i].hidden) {
                        if (fixedY === y) {
                            y = i;
                            break;
                        }
                        fixedY += 1;
                    }
                }
            }

            if (!this.cellProperties) {
                this.cellProperties = {};
            }

            if (this.cellProperties[index]) {
                return this.cellProperties[index];
            }

            if (this._cellPropertiesLazyLoading) {
                this.cellProperties[index] = calendar._getExpandedCell(x, y);
            }

            if (!this.cellProperties[index]) {
                var row = calendar.rowlist[y];
                var resource = row.id;
                //var rowOffset = row.start.getTime() - this.startDate.getTime();
                var rowOffset = row.start.getTime() - calendar._visibleStart().getTime();
                var itc = calendar._getItline(x);
                var start = itc.start.addTime(rowOffset);
                var end = itc.end.addTime(rowOffset);

                var ibj = {};
                ibj.start = start;
                ibj.end = end;
                ibj.resource = resource;

                var cell = {};
                cell.business = calendar.isBusiness(ibj);
                this.cellProperties[index] = cell;
            }

            return this.cellProperties[index];
        };

        this._copyCellProperties = function(source, x, y) {
            var index = x + '_' + y;
            this.cellProperties[index] = {};
            DayPilot.Util.copyProps(source, this.cellProperties[index], calendar._cellProps);

            //DayPilot.Util.copyProps(source, this.cellProperties[index]);
            return this.cellProperties[index];
        };

        this._getExpandedCell = function(x, y) {
            if (!this.cellConfig) {
                return null;
            }

            var config = this.cellConfig;

            var cell = this.cellProperties[x + "_" + y];

            if (!cell && config.vertical) {
                cell = this.cellProperties[x + "_0"];
            }

            if (!cell && config.horizontal) {
                cell = this.cellProperties["0_" + y];
            }

            if (!cell && config["default"]) {
                cell = config["default"];
            }

            var copy = {};
            DayPilot.Util.copyProps(cell, copy, calendar._cellProps);

            return copy;
        };

        this._expandCellProperties = function() {

            if (this._cellPropertiesLazyLoading) {
                return;
            }

            if (this._cellPropertiesExpanded) {
                return;
            }

            this._cellPropertiesExpanded = true;

            if (!this.cellConfig) {
                return;
            }

            var config = this.cellConfig;

            if (config.vertical) {
                for (var x = 0; x < config.x; x++) {
                    var def = this.cellProperties[x + "_0"];
                    if (!def) {
                        continue;
                    }
                    for (var y = 1; y < config.y; y++) {
                        this._copyCellProperties(def, x, y);
                    }
                }
            }

            if (config.horizontal) {
                for (var y = 0; y < config.y; y++) {
                    var def = this.cellProperties["0_" + y];
                    if (!def) {
                        continue;
                    }
                    for (var x = 1; x < config.x; x++) {
                        this._copyCellProperties(def, x, y);
                        //this.cellProperties[x + "_" + y] = def;
                    }
                }
            }

            if (config["default"]) {
                var def = config["default"];
                for (var y = 0; y < config.y; y++) {
                    for (var x = 0; x < config.x; x++) {
                        if (!this.cellProperties[x + "_" + y]) {
                            this._copyCellProperties(def, x, y);
    //                        this.cellProperties[x + "_" + y] = def;
                        }
                    }
                }
            }
        };

        this.isBusiness = function(cell, forceBusinessDay) {
            var start = cell.start;
            var end = cell.end;

            var cellDuration = (end.getTime() - start.getTime()) / (1000 * 60);  // minutes

            if (cellDuration <= 1440) {  // for one day per cell and lower only
                // if (calendar.viewType !== "Days" && !calendar.businessWeekends) {
                if (!calendar.businessWeekends && !forceBusinessDay) {
                    if (cell.start.dayOfWeek() === 0 || cell.start.dayOfWeek() === 6) {
                        return false;
                    }
                }
            }
            if (cellDuration < 720) {
                var startHour = start.getHours();
                startHour += start.getMinutes() / 60.0;
                startHour += start.getSeconds() / 3600.0;
                startHour += start.getMilliseconds() / 3600000.0;

                if (startHour < this.businessBeginsHour) {
                    return false;
                }

                if (this.businessEndsHour >= 24) {
                    return true;
                }
                if (startHour >= this.businessEndsHour) {
                    return false;
                }
                /*

                if (cell.start.getHours() < this.businessBeginsHour || cell.start.getHours() >= this.businessEndsHour) {
                    return false;
                }
                else {
                    return true;
                }*/
            }

            return true;
        };

        this._versionCheck = function() {

            // check licensing restrictions

            switch (calendar._productCode) {
                case "aspnet":
                    if (!this._isAspnetWebForms()) {
                        throw new DayPilot.Exception("ASP.NET WebForms environment required. https://doc.daypilot.org/common/asp-net-webforms-required/");
                    }
                    break;
                case "netmvc":
                    if (!this.backendUrl) {
                        throw new DayPilot.Exception("DayPilot.Scheduler.backendUrl required. https://doc.daypilot.org/common/backendurl-required-asp-net-mvc/");
                    }
                    break;
                case "javaxx":
                    if (!this.backendUrl) {
                        throw new DayPilot.Exception("DayPilot.Scheduler.backendUrl required. https://doc.daypilot.org/common/backendurl-required-java/");
                    }
                    break;
            }
        };

        this._show = function() {
            if (this.nav.top.style.visibility === 'hidden') {
                this.nav.top.style.visibility = 'visible';
            }
        };

        this._visible = function() {
            var el = calendar.nav.top;
            if (!el) {
                return false;
            }
            return el.offsetWidth > 0 && el.offsetHeight > 0;
        };

        this._waitForVisibility = function() {
            var visible = calendar._visible;

            if (!visible() && !calendar._visibilityInterval) {
                //calendar.debug.message("Not visible during init, starting visibilityInterval");
                calendar._visibilityInterval = setInterval(function() {
                    if (visible()) {
                        //calendar.debug.message("Made visible, calling .show()");
                        clearInterval(calendar._visibilityInterval);
                        calendar.show();
                        calendar._autoRowHeaderWidth();
                    }
                }, 100);
            }
        };

        // sets the total height
        this._setHeight = function(pixels) {
            if (this.heightSpec !== "Parent100Pct") {
                this.heightSpec = "Fixed";
            }
            this.height = pixels - (this._getTotalHeaderHeight() + 2);
            this._updateHeight();
        };

        this.setHeight = this._setHeight;

        this._findRowByResourceId = function(id) {
            return DayPilot.list(eventloading.rowcache[id]).first();
        };

        this._loadTop = function() {
            //this.nav.top = document.getElementById(id);
            if (this.id && this.id.tagName) {
                this.nav.top = this.id;
            }
            else if (typeof this.id === "string") {
                this.nav.top = document.getElementById(this.id);
                if (!this.nav.top) {
                    throw "DayPilot.Scheduler: The placeholder element not found: '" + id + "'.";
                }
            }
            else {
                throw "DayPilot.Scheduler() constructor requires the target element or its ID as a parameter";
            }

        };

        this._shortInit = function() {
            //this._loadTop();
            this._prepareVariables();
            this._loadResources();
            //this._initPrepareDiv();
            this._resize();
            this._registerGlobalHandlers();
            this._registerDispose();
            DayPilotScheduler.register(this);
            this._fireAfterRenderDetached(this.afterRenderData, false);
            this._registerOnScroll();
            this._startAutoRefresh();
            this._callBack2("Init");
        };

        this.init = function() {
            this._versionCheck();
            this._adjustApi();
            this._initUpdateBased();
            this._waitForVisibility();
            this._watchWidthChanges();
            return this;
        };

        this._initUpdateBased = function() {
            this._loadTop();

            if (this.nav.top.dp) {
                return;
            }

            this._initPrepareDiv();

            var loadFromServer = this._isShortInit();

            if (loadFromServer) {
                this._shortInit();
                this._initialized = true;
                this._clearCachedValues();
                return;
            }

            this._registerGlobalHandlers();
            this._registerDispose();
            DayPilotScheduler.register(this);
            this._registerOnScroll();

            this._update();

            var angular = calendar._angular.scope || calendar._angular2.enabled;

            if (calendar.scrollToDate) {
                calendar.scrollTo(calendar.scrollToDate);
            }
            else if (calendar.scrollX || calendar.scrollY) {
                calendar.setScroll(calendar.scrollX, calendar.scrollY);
            }
            else if (!angular) {
                calendar._onScroll();
            }

            if (calendar.scrollToResourceId) {
                calendar.scrollToResource(calendar.scrollToResourceId);
                calendar.scrollToResourceId = null;
            }

            var setScrollY = function() {
                if (calendar.scrollY) {
                    calendar.setScroll(calendar.scrollX, calendar.scrollY);
                }
            };

            window.setTimeout(setScrollY, 200);

            if (this.messageHTML) {
                window.setTimeout(function() { calendar.message(calendar.messageHTML); }, 0);
            }

            this._startAutoRefresh();


            this._clearCachedValues();
            this._fireAfterRenderDetached(this.afterRenderData, false);
            //this.debug.message("Init complete.");

            if (calendar.initEventEnabled) {
                setTimeout(function() {
                    calendar._callBack2("Init");
                });
            }

            this._postInit();

            this._initialized = true;
            this._canBeDisposed = true;

            var p = calendar._scrollToAfterInit;
            if (p) {
                calendar.scrollTo(p.date, p.animated, p.position);
            }
/*
            else if (!infitools.isEnabled()) {
                calendar._onScroll();
            }
*/
            else {
                calendar._onScroll();
            }

        };

        this._adjustApi = function() {
            if (calendar._serverBased()) {
                delete calendar.infinite;
            }
        };

        this._specialHandling = null;
        this._loadOptions = function(options) {
            if (!options) {
                return;
            }

            var specialHandling = {
                "events": {
                    "preInit": function() {
                        var events = this.data;
                        if (!events) {
                            return;
                        }
                        if (DayPilot.isArray(events.list)) {
                            calendar.events.list = events.list;
                        }
                        else {
                            calendar.events.list = events;
                        }
                    },
                    "postInit": function() {

                    }
                },
                "links": {
                    "preInit": function() {
                        var links = this.data;
                        if (!links) {
                            return;
                        }
                        if (DayPilot.isArray(links.list)) {
                            calendar.links.list = links.list;
                        }
                        else {
                            calendar.links.list = links;
                        }
                    },
                    "postInit": function() {

                    }
                },
                "scrollTo": {
                    "preInit": function() {

                    },
                    "postInit": function() {
                        if (this.data) {
                            calendar.scrollTo(this.data, options.scrollToAnimated, options.scrollToPosition);
                        }
                    }
                },
                "scrollX": {
                    "postInit": function() {
                        if (this.data) {
                            calendar.setScrollX(this.data);
                        }
                    }
                },
                "scrollY": {
                    "postInit": function() {
                        if (this.data) {
                            calendar.setScrollY(this.data);
                        }
                    }
                }
            };
            calendar._specialHandling = specialHandling;

            if (calendar._angular2.scrollToRequested) {
                specialHandling.scrollTo.data = calendar._angular2.scrollToRequested;
                calendar._angular2.scrollToRequested = null;
            }
            if (calendar._angular2.scrollXRequested) {
                specialHandling.scrollX.data = calendar._angular2.scrollXRequested;
                calendar._angular2.scrollXRequested = null;
            }
            if (calendar._angular2.scrollYRequested) {
                specialHandling.scrollY.data = calendar._angular2.scrollYRequested;
                calendar._angular2.scrollYRequested = null;
            }

            for (var name in options) {
                if (specialHandling[name]) {
                    var item = specialHandling[name];
                    item.data = options[name];
                    if (item.preInit) {
                        item.preInit();
                    }
                }
                else {
                    calendar[name] = options[name];
                }
            }

        };

        this._postInit = function() {
            var specialHandling = calendar._specialHandling;
            for (var name in specialHandling) {
                var item = specialHandling[name];
                if (item.postInit) {
                    item.postInit();
                }
            }
            calendar._specialHandling = {};
        };

        this.temp = {};

        this.temp.getPosition = function() {
            var x = Math.floor(calendar.coords.x / calendar.cellWidth);
            var y = calendar._getRow(calendar.coords.y).i;
            if (y < calendar.rowlist.length) {
                var cell = {};
                cell.start = calendar.itline[x].start;
                cell.end = calendar.itline[x].end;
                cell.resource = calendar.rowlist[y].id;
                return cell;
            }
            else {
                return null;
            }
        };

        // communication between components
        this.internal = {};
        // ASP.NET
        this.internal.initialized = function() {
            return calendar._initialized;
        };

        // Areas
        this.internal.dragInProgress = this._dragInProgress;
        // DayPilot.Action
        this.internal.invokeEvent = this._invokeEvent;
        // DayPilot.Menu
        this.internal.eventMenuClick = this._eventMenuClick;
        this.internal.timeRangeMenuClick = this._timeRangeMenuClick;
        this.internal.resourceHeaderMenuClick = this._rowMenuClick;
        this.internal.linkMenuClick = this._linkMenuClick;
        // DayPilot.Bubble
        this.internal.bubbleCallBack = this._bubbleCallBack;
        this.internal.findEventDiv = this._findEventDiv;
        this.internal.rowtools = this._rowtools;
        // DayPilot.Gantt
        this.internal.getNodeChildren = this._getNodeChildren;
        this.internal.callback = function() {
            calendar._callBack2.apply(calendar, arguments);
        };
        this.internal.createRowObject = this._createRowObject;
        this.internal.restools = this._restools;
        this.internal.gantt = null;
        // DayPilot.Event
        this.internal.adjustEndIn = calendar._adjustEndIn;
        this.internal.adjustEndNormalize = calendar._adjustEndNormalize;

        this.internal.touch = calendar._touch;

        // DayPilot.Kanban
        this.internal.cssNames = calendar._css;
        this.internal.enableCellStacking = function(autoHeight) {
            calendar._cellStacking = true;
            calendar._cellStackingAutoHeight = autoHeight;
        };
        this.internal.deleteDragSource = function() {
            calendar._deleteDragSource();
        };

        // Angular2
        this.internal.skipUpdate = calendar._angular2.skipUpdate;
        this.internal.skipped = calendar._angular2.skipped;
        this.internal.loadOptions = calendar._loadOptions;
        this.internal.postInit = calendar._postInit;
        this.internal.enableAngular2 = function() { calendar._angular2.enabled = true; };

        this.Init = this.init;

        this._loadOptions(options);

    };

    debug = new DayPilot.Scheduler().v === "${v\u007d";

    DayPilot.Row = function(row, calendar) {
        if (!row) {
            throw "Now row object supplied when creating DayPilot.Row";
        }
        if (!calendar) {
            throw "No parent control supplied when creating DayPilot.Row";
        }

        var index = DayPilot.indexOf(calendar.rowlist, row);

        this._original = {};
        var original = this._original;

        original.id = row.id;
        original.name = row.name;
        original.data = row.resource;
        original.tags = row.tags;

        var r = this;
        r.isRow = true;
        r.menuType = 'resource';
        r.start = row.start;
        r.name = row.name;
        r.value = row.id;
        r.id = row.id;
        r.tags = row.tags;
        r.bubbleHtml = row.bubbleHtml;
        r.index = index;
        r.level = row.level;
        r.calendar = calendar;
        r.data = row.resource;
        r._row = row;
        r.$ = {};
        r.$.row = row;
        r.toJSON = function(key) {
            var json = {};
            json.start = this.start;
            json.name = this.name;
            json.value = this.value;
            json.id = this.id;
            json.index = this.index;

            return json;
        };

        r.parent = function() {
            if (!r._row._makeVisibleParent) {
                return null;
            }
            return calendar._createRowObject(r._row._makeVisibleParent);
        };

        r.children = function() {
            var list = DayPilot.list(r.$.row.children).map(function(i) {
                return calendar._createRowObject(calendar.rowlist[i]);
            });

            list.add = function(child) {
                var r1 = r.$.row.resource;
                if (!r1.children) {
                    r1.children = [];
                }
                r1.children.push(child);
            };

            return list;
        };

        r.loaded = function() {
            return r._row.loaded;
        };

        r.cells = {};
        r.cells.all = function() {
            var list = [];
            var maxX = calendar.itline.length;
            var y = r.index;
            for(var x = 0; x < maxX; x++) {
                var cell = calendar.cells.findXy(x, y);
                list.push(cell[0]);
            }
            return calendar._cellArray(list);
        };

        r.cells.forRange = function(start, end) {
            var row = r;
            var rowOffset = row.start.getTime() - calendar._visibleStart().getTime();

            start = new DayPilot.Date(start);
            end = new DayPilot.Date(end);

            var rowStart = calendar._visibleStart().addTime(rowOffset);
            var rowEnd = calendar._visibleEnd().addTime(rowOffset);

            if (start < rowStart) {
                start = rowStart;
            }

            if (end > rowEnd) {
                end = rowEnd;
            }

            var startCell = calendar.cells.find(start, r.id)[0];
            var endCell = calendar.cells.find(end.addTime(-1), r.id)[0];

            if (!startCell) {
                return null;
            }

            if (!endCell) {
                return null;
            }

            if (startCell.y !== endCell.y) {
                return null;
            }

            var y = startCell.y;

            //var cell = calendar.cells._cell(x, y);
            var list = [];

            for (var x = startCell.x; x <= endCell.x; x++) {
                list.push(calendar.cells._cell(x, y));
            }
            return calendar._cellArray(list);

        };

        r.cells.totalDuration = function() {
            return new DayPilot.Duration(r.cells.all().map(function(cell) { return cell.end.getTime() - cell.start.getTime();}).reduce(function(acc, val) { return acc + val; }, 0));
        };

        r.events = {};
        r.events.all = function() {
            var list = DayPilot.list();
            for (var i = 0; i < r._row.events.length; i++) {
                list.push(r._row.events[i]);
            }
            return list;
        };

        r.events.isEmpty = function() {
            return r._row.events.length === 0;
        };

        r.events.forRange = function(start, end) {
            return r._row.events.forRange(start, end);
        };

        r.events.totalDuration = function() {
            var ticks = 0;
            r.events.all().each(function(item) {
                ticks += item.part.end.getTime() - item.part.start.getTime();
            });
            return new DayPilot.Duration(ticks);
        };

        r.groups = {};
        r.groups.collapseAll = function() {
            for (var i = 0; i < r._row.blocks.length; i++) {
                var block = r._row.blocks[i];
                var group = new EventGroup(block);
                group._collapseDontRedrawRow();
            }

            calendar._updateRowHeights();
            calendar._updateRowsNoLoad(r.index);
            calendar._updateHeight();

        };
        r.groups.expandAll = function() {
            for (var i = 0; i < r._row.blocks.length; i++) {
                var block = r._row.blocks[i];
                var group = new EventGroup(block);
                group._expandDontRedrawRow();
            }

            calendar._updateRowHeights();
            calendar._updateRowsNoLoad(r.index);
            calendar._updateHeight();

        };
        r.groups.expanded = function() {
            var list = [];
            for (var i = 0; i < r._row.blocks.length; i++) {
                var block = r._row.blocks[i];
                if (block.expanded && block.lines.length > calendar.groupConcurrentEventsLimit) {
                    list.push(new EventGroup(block));
                }
            }
            return DayPilot.list(list);
        };
        r.groups.collapsed = function() {
            var list = [];
            for (var i = 0; i < r._row.blocks.length; i++) {
                var block = r._row.blocks[i];
                if (!block.expanded) {
                    list.push(new EventGroup(block));
                }
            }
            return DayPilot.list(list);
        };
        r.groups.all = function() {
            var list = [];
            for (var i = 0; i < r._row.blocks.length; i++) {
                var block = r._row.blocks[i];
                list.push(new EventGroup(block));
            }
            return DayPilot.list(list);
        };

        r.events.collapseGroups = r.groups.collapseAll;
        r.events.expandGroups = r.groups.expandAll;

        r.column = function(i) {
            return new RowHeaderColumn(r, i);
        };

        r.toggle = function() {
            calendar._toggle(r.index);
        };

        r.collapse = function() {
            if (r.$.row.expanded) {
                r.toggle();
            }
        };

        r.expand = function() {
            if (!r.$.row.expanded) {
                r.toggle();
            }
        };

        r.remove = function() {
            calendar.rows.remove(r);
        };

        r.edit = function() {
            calendar.rows.edit(r);
        };

        r.addClass = function(cssClass) {
            var row = r;
            var table = calendar.divHeader;

            var row = table.rows[row.index];
            if (row) {
                var cells = DayPilot.list(row.cells).map(function(cell) { return cell.cellDiv; });
                DayPilot.Util.addClass(cells, cssClass);
            }

            r.$.row.cssClass = DayPilot.Util.addClassToString(r.$.row.cssClass, cssClass);
        };

        r.removeClass = function(cssClass) {
            var row = r;
            var table = calendar.divHeader;

            var row = table.rows[row.index];
            if (row) {
                var cells = DayPilot.list(row.cells).map(function(cell) { return cell.cellDiv; });
                DayPilot.Util.removeClass(cells, cssClass);
            }

            r.$.row.cssClass = DayPilot.Util.removeClassFromString(r.$.row.cssClass, cssClass);
        };

        var EventGroup = function(block) {

            var findDiv = function(block) {
                for (var i = 0; i < calendar.elements.events.length; i++) {
                    var div = calendar.elements.events[i];
                    if (div.event === block) {
                        return div;
                    }
                }
                return null;
            };

            this._expandDontRedrawRow = function() {
                block.expanded = true;

                var list = calendar._blockExpandedEvents;
                DayPilot.list(block.events).each(function(e) {
                    list.push(e.id());
                });

                var div = findDiv(block);
                if (div) {
                    calendar._deleteBlock(div);
                    var elindex = DayPilot.indexOf(calendar.elements.events, div);
                    if (elindex !== -1) {
                        calendar.elements.events.splice(elindex, 1);
                    }
                }
            };

            this.expand = function() {
                this._expandDontRedrawRow();

                calendar._updateRowHeights();
                calendar._updateRowsNoLoad(block.row.index);
                calendar._updateHeight();
            };

            this._collapseDontRedrawRow = function() {
                if (block.lines.length > calendar.groupConcurrentEventsLimit) {
                    block.expanded = false;

                    var collapsed = DayPilot.list(block.events).map(function(e) { return e.id()});
                    calendar._blockExpandedEvents = calendar._blockExpandedEvents.filter(function(item) {
                        return !DayPilot.contains(collapsed, item);
                    });
                }
            };

            this.collapse = function() {
                this._collapseDontRedrawRow();

                calendar._updateRowHeights();
                calendar._updateRowsNoLoad(block.row.index);
                calendar._updateHeight();
            };

        };

        var RowHeaderColumn = function(row, i) {
            this.html = function(html) {
                var table = row.calendar.divHeader;
                var cell = table.rows[row.index].cells[i];
                var text = cell.textDiv;

                if (typeof html === "undefined") {
                    return text.innerHTML;
                }
                else {
                    text.innerHTML = html;
                }
            };
        };
    };

    // internal moving
    DayPilotScheduler.moving = null;
    DayPilotScheduler.movingEvent = null;

    // internal resizing
    DayPilotScheduler.originalMouse = null;
    DayPilotScheduler.resizing = null;
    DayPilotScheduler.resizingEvent = null;
    DayPilotScheduler.preventEventClick = false;

    DayPilotScheduler.globalHandlers = false;
    DayPilotScheduler.timeRangeTimeout = null;

    // selecting
    DayPilotScheduler.selectedCells = null;

    DayPilotScheduler.dragStart = function(element, duration, id, text) {

        DayPilot.us(element);

        var drag = DayPilotScheduler.drag = {};
        drag.element = element;
        drag.duration = duration;
        drag.text = text;
        drag.id = id;
        //drag.shadowType = type ? type : 'Fill';  // default value
        drag.data = { "id":id, "text": text, "duration":duration, "externalHtml": text};

        return false;
    };

    DayPilot.Scheduler.startDragging = function(options) {
        var options = options || {};

        var element = options.element;
        var removeElement = options.keepElement ? null : element;

        DayPilot.us(element);

        var drag = DayPilotScheduler.drag = {};
        drag.element = removeElement;
        drag.id = options.id;
        drag.duration = options.duration || 60;
        drag.text = options.text || "";
        //drag.shadowType = 'Fill';  // default value
        drag.data = options;

        return false;
    };

    /*
     * options: {
     *      element: dom element,
     *      duration: duration in minutes,
     *      text: event text,
     *      id: id,
     *      onDragStart: function(args)
     *          args.data - options object
     *          args.preventDefault() - cancels the action
     * }
     */
    DayPilot.Scheduler.makeDraggable = function(options) {
        options = options || {};
        var element = options.element;
        var removeElement = options.keepElement ? null : (options.remove || element);

        if (!element) {
            throw new DayPilot.Exception("makeDraggable(options): options.element must be specified");
        }

        DayPilot.us(element);  // make it unselectable
        DayPilot.re(element, "mousedown", function(ev) {
            //DayPilotScheduler.dragStart(removeElement, options.duration, options.id, options.text, options);

            if (!DayPilot.Util.mouseButton(ev).left) {
                return;
            }

            startDragging();

            var element = (ev.target || ev.srcElement);
            if(element.tagName) {
                var tagname = element.tagName.toLowerCase();
                if(tagname === "textarea" || tagname === "select" || tagname === "input") {
                    return false;
                }
            }
            ev.preventDefault && ev.preventDefault();
            return false;
        });

        element.ontouchstart = function(ev) {

            var holdfor = 0;

            window.setTimeout(function() {
                startDragging();
                DayPilotScheduler.gTouchMove(ev);
                ev.preventDefault();
            }, holdfor);

            ev.preventDefault();
        };

        function startDragging() {
            // TODO create drag.event = new DayPilot.Event() here
            // TODO merge with DayPilot.Scheduler.startDragging()

            var duration = options.duration || 60;
            if (duration instanceof DayPilot.Duration) {
                duration = duration.totalSeconds();
            }

            var drag = DayPilotScheduler.drag = {};
            drag.element = removeElement;
            drag.id = options.id;
            drag.duration = duration;
            drag.text = options.text || "";
            //drag.shadowType = 'Fill';  // default value
            drag.data = options;
        }
    };

    DayPilot.Scheduler.stopDragging = function() {

        if (DayPilotScheduler.drag) {
            if (DayPilotScheduler.drag.schedulerSourceEvent) {
                var e = DayPilotScheduler.drag.schedulerSourceEvent;
                var srcCal = e.event.calendar;
                DayPilot.Util.removeClass(e, srcCal._prefixCssClass(calendar._css.eventMovingSource));
            }
        }
            // external
        DayPilotScheduler.dragStop();

        // resizing
        if (DayPilotScheduler.resizing) {
            DayPilot.de(DayPilotScheduler.resizingShadow);
            DayPilotScheduler.resizing = null;
            DayPilotScheduler.resizingEvent = null;
            DayPilotScheduler.resizingShadow = null;
        }

        // moving
        if (DayPilotScheduler.moving) {
            var calendar = DayPilotScheduler.movingEvent.calendar;
            DayPilot.Util.removeClass(DayPilotScheduler.moving, calendar._prefixCssClass(calendar._css.eventMovingSource));
            DayPilot.de(DayPilotScheduler.movingShadow);
            DayPilotScheduler.moving = null;
            DayPilotScheduler.movingEvent = null;
            DayPilotScheduler.movingShadow = null;
        }


        if (DayPilotScheduler.range) {
            var calendar = DayPilotScheduler.range.calendar;
            calendar.clearSelection();
            DayPilotScheduler.range = null;
        }

        document.body.style.cursor = '';

        DayPilot.list(DayPilotScheduler.registered).each(function(calendar) {
            calendar._stopScroll();
            calendar._clearShadowHover();
            calendar._rowtools.resetMoving();
        });
    };

    DayPilotScheduler.dragStop = function() {
        if (DayPilotScheduler.gShadow) {
            document.body.removeChild(DayPilotScheduler.gShadow);
            DayPilotScheduler.gShadow = null;
        }
        DayPilotScheduler.drag = null;
    };

    DayPilotScheduler.register = function(calendar) {
        if (!DayPilotScheduler.registered) {
            DayPilotScheduler.registered = DayPilot.list();
            DayPilotScheduler.registered.out = function() {
                var list = DayPilotScheduler.registered;
                list.forEach(function(c) {
                     c._out();
                });
            };
        }
        for (var i = 0; i < DayPilotScheduler.registered.length; i++) {
            if (DayPilotScheduler.registered[i] === calendar) {
                return;
            }
        }
        DayPilotScheduler.registered.push(calendar);

    };

    DayPilotScheduler.unregister = function(calendar) {
        var a = DayPilotScheduler.registered;
        if (a) {
            var i = DayPilot.indexOf(a, calendar);
            if (i !== -1) {
                a.splice(i, 1);
            }
            if (a.length === 0) {
                a = null;
            }
        }

        if (!a) {
            DayPilot.ue(document, 'mousemove', DayPilotScheduler.gMouseMove);
            DayPilot.ue(document, 'mouseup', DayPilotScheduler.gMouseUp);
            DayPilot.ue(document, 'mousedown', DayPilotScheduler.gMouseDown);
            DayPilot.ue(document, 'touchmove', DayPilotScheduler.gTouchMove);
            DayPilot.ue(document, 'touchend', DayPilotScheduler.gTouchEnd);

            DayPilot.ue(window, 'keyup', DayPilotScheduler.gKeyUp);
            //DayPilot.ue(window, 'unload', DayPilotScheduler.gUnload);
            DayPilotScheduler.globalHandlers = false;
        }
    };

    function calendarFromTouchEvent(ev) {
        var clientX = ev.touches[0].clientX;
        var clientY = ev.touches[0].clientY;
        var el = document.elementFromPoint(clientX, clientY);
        while (el && el.parentNode) {
            el = el.parentNode;
            if (el.daypilotMainD) {
                return el.calendar;
            }
        }
        return false;
    }

    function touchMousePos(ev) {
        var x = ev.touches[0].pageX;
        var y = ev.touches[0].pageY;

        var mousePos = {};
        mousePos.x = x;
        mousePos.y = y;
        return mousePos;
    }

    function status(msg, clear) {
        var status = document.getElementById("status");
        if (!status) {
            return;
        }
        if (clear) {
            status.innerHTML = "";
        }

        status.innerHTML += " " + msg;
    }

    DayPilotScheduler.gTouchMove = function(ev) {

        if (DayPilotScheduler.resizing) {
            var calendar = DayPilotScheduler.resizing.event.calendar;
            calendar.coords = calendar._touch.relativeCoords(ev);
            //DayPilotScheduler.resizing.mousePos = touchMousePos(ev);
            calendar._touch.updateResizing();
            ev.preventDefault();
        }

        if (DayPilotScheduler.moving && !DayPilotScheduler.drag) {
            var calendar = DayPilotScheduler.movingEvent.calendar;
            calendar.coords = calendar._touch.relativeCoords(ev);

            calendar._touch.updateMoving();
            ev.preventDefault();

            (function dragOut() {
                if (!calendar.dragOutAllowed) {
                    return;
                }

                var targetCal = calendarFromTouchEvent(ev);

                if (!targetCal || targetCal !== calendar) {

                    var e = DayPilotScheduler.movingEvent;

                    DayPilotScheduler.drag = {};
                    var drag = DayPilotScheduler.drag;

                    drag.id = e.id();
                    drag.text = e.text();

                    drag.schedulerSourceEvent = DayPilotScheduler.moving;
                    drag.element = null;
                    drag.duration = (e.rawend().getTime() - e.start().getTime()) / 1000;
                    drag.text = e.text();
                    drag.id = e.id();
                    //drag.shadowType = cal.shadow;

                    drag.event = DayPilot.Util.copyProps(e, new DayPilot.Event());

                    calendar._clearShadowHover();

                    DayPilot.de(DayPilotScheduler.movingShadow);

                    DayPilotScheduler.movingShadow.calendar = null;
                    DayPilotScheduler.movingShadow = null;

                    DayPilotScheduler.registered.out();

                }
            })();
        }

        if (DayPilotScheduler.drag) {
            ev.preventDefault();

            var mousePos = touchMousePos(ev);

            var calendar = calendarFromTouchEvent(ev);

                if (calendar) {

                    // hide the global shadow
                    if (DayPilotScheduler.gShadow) {
                        document.body.removeChild(DayPilotScheduler.gShadow);
                    }
                    DayPilotScheduler.gShadow = null;

                    calendar.coords = calendar._touch.relativeCoords(ev);

                    if (!DayPilotScheduler.movingShadow && calendar.rowlist.length > 0) {
                        if (!DayPilotScheduler.moving) { // can be null if the location is forbidden (first two rows in IE)
                            DayPilotScheduler.moving = {};

                            var event = DayPilotScheduler.drag.event;
                            if (!event) {
                                //var now = new DayPilot.Date().getDatePart();
                                var now = calendar.itline[0].start;
                                //calendar.debug.message("external start/touch:" + now);
                                var ev = {
                                    'id': DayPilotScheduler.drag.id,
                                    'start': now,
                                    'end': now.addSeconds(DayPilotScheduler.drag.duration),
                                    'text': DayPilotScheduler.drag.text
                                };

                                var data = DayPilotScheduler.drag.data;
                                if (data) {
                                    var skip = ['duration', 'element', 'remove', 'id', 'text'];
                                    for (var name in data) {
                                        if (DayPilot.contains(skip, name)) {
                                            continue;
                                        }
                                        ev[name] = data[name];
                                    }
                                }

                                event = new DayPilot.Event(ev);
                                event.calendar = calendar;
                                event.part.duration = DayPilotScheduler.drag.duration;
                            }

                            event.part.external = true;

                            var src = DayPilotScheduler.drag.schedulerSourceEvent;
                            if (src && src.event && src.event.calendar === calendar) {
                                // if (DayPilotScheduler.drag.schedulerSourceEvent.event.calendar === calendar) {
                                event.part.external = false;
                                // }
                            }

                            //DayPilotScheduler.moving.event = event;
                            DayPilotScheduler.movingEvent = event;
                        }
                        //alert("Creating shadow: " + DayPilotScheduler.movingEvent);
                        DayPilotScheduler.movingShadow = calendar._createShadow(DayPilotScheduler.movingEvent);
                    }

                    if (DayPilotScheduler.moving) {
                        calendar._touch.updateMoving();
                    }

                }
                else {

                    // hide the local shadow
                    DayPilot.de(DayPilotScheduler.movingShadow);
                    var movingSaveForLater = DayPilotScheduler.moving;
                    DayPilotScheduler.moving = null;
                    DayPilotScheduler.movingEvent = null;
                    DayPilotScheduler.movingShadow = null;

                    if (!DayPilotScheduler.gShadow) {
                        DayPilotScheduler.gShadow = DayPilotScheduler.createGShadow(DayPilotScheduler.drag.data);
                        DayPilotScheduler.gShadow.source = movingSaveForLater;
                    }

                    var shadow = DayPilotScheduler.gShadow;
                    shadow.style.left = mousePos.x + 'px';
                    shadow.style.top = mousePos.y + 'px';

                    DayPilotScheduler.registered.out();

                }

        }
    };

    DayPilotScheduler.gTouchEnd = function(ev) {
        DayPilotScheduler.gMouseUp(ev);
    };

    DayPilotScheduler.gMouseMove = function(ev) {

        if (typeof (DayPilotScheduler) === 'undefined') {
            return;
        }

        // AngularJS 1.x is firing onmousemove for touch events
        // Chrome on Android is firing onmousemove for touch events
        if (DayPilot.Global.touch.active || DayPilot.Global.touch.start) {
            return;
        }

        ev = ev || window.event;

        // quick and dirty inside detection
        // hack, but faster then recursing through the parents
        if (ev.insideMainD) {  // FF
            return;
        }
        else if (ev.srcElement) {  // IE
            if (ev.srcElement.inside) {
                return;
            }
        }

        var mousePos = DayPilot.mc(ev);

        if (DayPilotScheduler.drag) {

            if (!DayPilotScheduler.drag.startFired) {
                var data = DayPilotScheduler.drag.data || {};
                var onDragStart = data.onDragStart;

                var canceled = false;

                if (typeof onDragStart === "function") {
                    var args = {};
                    args.data = data;

                    args.preventDefault = function() {
                        args.preventDefault.value = true;
                    };
                    onDragStart(args);

                    canceled = args.preventDefault.value;
                }

                DayPilotScheduler.drag.startFired = true;

                if (canceled) {
                    DayPilotScheduler.drag = null;
                    return;
                }
            }

            document.body.style.cursor = 'move';
            if (!DayPilotScheduler.gShadow) {
                DayPilotScheduler.gShadow = DayPilotScheduler.createGShadow(DayPilotScheduler.drag.data);
            }

            var shadow = DayPilotScheduler.gShadow;
            shadow.style.left = mousePos.x + 'px';
            shadow.style.top = mousePos.y + 'px';

            // it's being moved outside, delete the inside shadow
            DayPilotScheduler.moving = null;
            DayPilotScheduler.movingEvent = null;
            if (DayPilotScheduler.movingShadow) {
                var cal = DayPilotScheduler.movingShadow.calendar;
                cal && cal._clearShadowHover();
                DayPilotScheduler.movingShadow.calendar = null;
                DayPilot.de(DayPilotScheduler.movingShadow);
                DayPilotScheduler.movingShadow = null;
            }

        }
        else if (DayPilotScheduler.moving && DayPilotScheduler.movingEvent && DayPilotScheduler.movingEvent.calendar.dragOutAllowed && !DayPilotScheduler.drag) {
            var cal = DayPilotScheduler.movingEvent.calendar; // source
            var ev = DayPilotScheduler.movingEvent;

            // clear target
            //DayPilotScheduler.moving.target = null;

            document.body.style.cursor = 'move';
            if (!DayPilotScheduler.gShadow) {
                DayPilotScheduler.gShadow = DayPilotScheduler.createGShadow(ev.data);
                DayPilotScheduler.gShadow.source = DayPilotScheduler.moving;
            }

            var shadow = DayPilotScheduler.gShadow;
            shadow.style.left = mousePos.x + 'px';
            shadow.style.top = mousePos.y + 'px';

            // it's being moved outside, delete the inside shadow
            DayPilotScheduler.drag = {};
            var drag = DayPilotScheduler.drag;
            drag.schedulerSourceEvent = DayPilotScheduler.moving;
            drag.element = null;
            drag.duration = (ev.rawend().getTime() - ev.start().getTime()) / 1000;
            drag.text = ev.text();
            drag.id = ev.value();
            //drag.shadowType = cal.shadow;

            drag.event = DayPilot.Util.copyProps(ev, new DayPilot.Event());

            cal._clearShadowHover();

            DayPilot.de(DayPilotScheduler.movingShadow);

            DayPilotScheduler.movingShadow.calendar = null;
            DayPilotScheduler.movingShadow = null;

        }

        DayPilotScheduler.registered.out();
/*        for (var i = 0; i < DayPilotScheduler.registered.length; i++) {
            if (DayPilotScheduler.registered[i]._out) {
                DayPilotScheduler.registered[i]._out();
            }
        }*/
    };

    DayPilotScheduler.gUnload = function(ev) {

        if (!DayPilotScheduler.registered) {
            return;
        }
        for (var i = 0; i < DayPilotScheduler.registered.length; i++) {
            var c = DayPilotScheduler.registered[i];
            //c.dispose();

            DayPilotScheduler.unregister(c);
        }
    };

    DayPilotScheduler.gMouseDown = function(ev) {
        if (DayPilotScheduler.editing) {
            DayPilotScheduler.editing.blur();
        }
    };

    DayPilotScheduler.gKeyUp = function(ev) {
        var ev = ev || window.event;
        var key = ev.keyCode;
        if (key === 17) {
            if (DayPilotScheduler.rangeCalendar) {
                var calendar = DayPilotScheduler.rangeCalendar;
                calendar._multirange.dispatch();
            }
            /*
            DayPilot.list(DayPilotScheduler.registered).each(function(item) {
                item._multirange.dispatch();
            });*/
        }
    };

    DayPilotScheduler.gMouseUp = function(ev) {

        DayPilot.list(DayPilotScheduler.registered).each(function(calendar) {
            calendar._stopScroll();
        });

        if (DayPilotScheduler.resizing) {

            var cleanup = function() {
                var e = DayPilotScheduler.resizingEvent;
                var calendar = e.calendar;

                document.body.style.cursor = '';
                DayPilotScheduler.resizing = null;
                DayPilotScheduler.resizingEvent = null;

                DayPilot.de(DayPilotScheduler.resizingShadow);
                DayPilotScheduler.resizingShadow = null;

                calendar._checkSuspendedOnScroll();
            };

            setTimeout(function() {  // it needs to survive onEventClick
                DayPilotScheduler.preventEventClick = false;
            });

            if (!DayPilotScheduler.resizingShadow) {
                cleanup();
                return;
            }

            var e = DayPilotScheduler.resizingEvent;
            var calendar = e.calendar;

            //calendar._updateResizingShadow();

/*
            var newStart = DayPilotScheduler.resizingShadow.start;
            var newEnd = DayPilotScheduler.resizingShadow.end;
*/
            var newStart = DayPilotScheduler.resizingShadow.finalStart;
            var newEnd = DayPilotScheduler.resizingShadow.finalEnd;

            var overlapping = DayPilotScheduler.resizingShadow.overlapping;
            var forbidden = !DayPilotScheduler.resizingShadow.allowed;

            calendar._clearShadowHover();
            calendar._multiresize.clear();

            cleanup();

            if (overlapping || forbidden) {
                return;
            }

            // action here
            calendar._eventResizeDispatch(e, newStart, newEnd);
        }
        else if (DayPilotScheduler.movingEvent) {

            var cleanup = function() {

                DayPilot.Global.movingAreaData = null;

                var calendar = DayPilotScheduler.movingShadow && DayPilotScheduler.movingShadow.calendar;

                if (DayPilotScheduler.movingShadow) {
                    DayPilot.de(DayPilotScheduler.movingShadow);
                    DayPilotScheduler.movingShadow.calendar = null;
                }

                document.body.style.cursor = '';
                DayPilotScheduler.moving = null;
                DayPilotScheduler.movingEvent = null;
                DayPilotScheduler.drag = null;

                calendar._checkSuspendedOnScroll();

                if (calendar) {
                    calendar._lastEventMoving = null;
                }

            };

            if (!DayPilotScheduler.movingShadow) {
                cleanup();
                return;
            }

            var e = DayPilotScheduler.movingEvent;

            //var calendar = e.calendar;  // doesn't work for drag&drop between two schedulers, this is the source
            var calendar = DayPilotScheduler.movingShadow.calendar;

            if (!calendar) {
                cleanup();
                return;
            }

            DayPilot.Util.removeClass(DayPilotScheduler.moving, calendar._prefixCssClass(calendar._css.eventMovingSource));

            (function clearSourceCss() {
                if (DayPilotScheduler.drag) {
                    if (DayPilotScheduler.drag.schedulerSourceEvent) {
                        var e = DayPilotScheduler.drag.schedulerSourceEvent;
                        if (e && e.event) {
                            var srcCal = e.event.calendar;
                            DayPilot.Util.removeClass(e, srcCal._prefixCssClass(calendar._css.eventMovingSource));
                        }
                    }
                }
            })();

            if (!DayPilotScheduler.movingShadow.row) {
                cleanup();
                return;
            }

            clearTimeout(calendar._autoexpand.timeout);

            var newStart = DayPilotScheduler.movingShadow.start;
            var newEnd = DayPilotScheduler.movingShadow.end;
            var newResource = (calendar.viewType !== 'Days') ? DayPilotScheduler.movingShadow.row.id : null;

            var external = (DayPilotScheduler.drag ? true : false) && e.part.external;
            var line = DayPilotScheduler.movingShadow.line;
            //var left = DayPilotScheduler.movingShadow.offsetLeft;

            var overlapping = DayPilotScheduler.movingShadow.overlapping;
            var forbidden = !DayPilotScheduler.movingShadow.allowed;


            if (DayPilotScheduler.drag) {
                if (!calendar.todo) {
                    calendar.todo = {};
                }
                calendar.todo.del = DayPilotScheduler.drag.element;
                DayPilotScheduler.drag = null;
                //cleanup();
            }

            DayPilotScheduler.movingShadow.calendar = null;
            document.body.style.cursor = '';
            DayPilotScheduler.moving = null;
            DayPilotScheduler.movingEvent = null;

            if (overlapping || forbidden || calendar._multimove.forbidden  || calendar._multimove.invalid) {
                // clear the moving state
                calendar._clearMovingShadow();
                return;
            }

            var ev = ev || window.event;
            calendar._eventMoveDispatch(e, newStart, newEnd, newResource, external, ev, line);
            //calendar._multimove.clear();

            DayPilot.Global.movingAreaData = null;
        }
        else if (DayPilotScheduler.range) {

            ev = ev || window.event;
            var button = DayPilot.Util.mouseButton(ev);

            var range = DayPilotScheduler.range;
            var calendar = range.calendar;

            var cleanup = function() {
                //var calendar = DayPilotScheduler.range.calendar;
                calendar._checkSuspendedOnScroll();
            };

            calendar._lastRange = null;

            var ctrl = ev.ctrlKey || ev.metaKey;
            if (calendar.allowMultiRange) {
                if (!calendar.elements.range2.overlapping) {
                    calendar._multirange.add(range);
                }
                else {
                    DayPilot.de(calendar.elements.range2);
                    calendar.elements.range2 = null;
                    calendar._clearShadowHover();
                }
                DayPilotScheduler.range = null;
                if (!ctrl) {
                    calendar._multirange.dispatch();
                }
                cleanup();
                return;
            }

            if (DayPilotScheduler.timeRangeTimeout) {
                clearTimeout(DayPilotScheduler.timeRangeTimeout);
                DayPilotScheduler.timeRangeTimeout = null;

                // disabled because it fired timeRangeDoubleClick twice
                //calendar._onMaindDblClick(ev);

                cleanup();
                return;
            }

            calendar.rangeHold = range;

            // must be cleared before dispatching
            DayPilotScheduler.range = null;

            var createTimeRangeDispatcher = function(range) {
                return function() {

                    //calendar.debug.message("delayed (gMouseUp)");

                    DayPilotScheduler.timeRangeTimeout = null;

                    var shadow = calendar.elements.range2;
                    if (shadow && shadow.overlapping) {
                        calendar.clearSelection();
                        return;
                    }

                    calendar._timeRangeSelectedDispatchFromRange(range);
                    //calendar._timeRangeSelectedDispatch(sel.start, sel.end, sel.resource);

                    if (calendar.timeRangeSelectedHandling !== "Hold" && calendar.timeRangeSelectedHandling !== "HoldForever") {
                        doNothing();
                        //calendar.deleteRange();
                    }
                    else {
                        calendar.rangeHold = range;
                    }
                };
            };

            //calendar.debug.message("gMouseUp");
            //var sel = calendar._getSelection(range);
            var rc = calendar._copyRange(range); // might not be necessary

            cleanup();

            if (!button.left) { // only left-click
                DayPilotScheduler.timeRangeTimeout = null;
                return;
            }

            if (range.moved || calendar.timeRangeDoubleClickHandling === 'Disabled') {
                createTimeRangeDispatcher(rc)();

                var ev = ev || window.event;
                ev.cancelBubble = true;
                return false;  // trying to prevent onmaindclick
            }
            else {
                DayPilotScheduler.timeRangeTimeout = setTimeout(createTimeRangeDispatcher(rc), calendar.doubleClickTimeout);  // 300 ms
            }

        }
        else if (rowmoving.row) {
            var calendar = rowmoving.calendar;
            if (calendar) {
                calendar._rowMoveDispatch();
            }/*
            else {
                calendar._rowtools.resetMoving();
            }*/
        }
        else if (linking.source) {
            var calendar = linking.calendar;
            calendar._linktools.clearShadow();
            calendar._linktools.hideLinkpoints();

            linking.source = null;
            linking.calendar = null;
        }
        else if (DayPilotScheduler.splitting) {
            var splitting = DayPilotScheduler.splitting;
            splitting.cleanup();
            DayPilotScheduler.splitting = null;
        }
        else if (DayPilotScheduler.rectangleSelect) {
            var rect = DayPilotScheduler.rectangleSelect;
            var calendar = rect.calendar;

            if (!rect.moved) {
                DayPilotScheduler.rectangleSelect = null;
                if (!calendar._isWithinRange(calendar.coords)) {
                    calendar._onMaindClick(ev);
                }
                return;
            }

            var x = rect.x;
            var y = rect.y;
            var width = rect.width;
            var height = rect.height;

            var append = false;
            var events = calendar._viewport.eventsInRectangle(x, y, width, height).map(function(item) {return item.event;});

            if (typeof calendar.onRectangleEventSelect === "function") {
                var args = {};
                args.events = events;
                args.append = false;
                args.start = calendar.getDate(x, true);
                args.end = calendar.getDate(x + width, true);
                args.preventDefault = function() {
                    this.preventDefault.value = true;
                };

                calendar.onRectangleEventSelect(args);

                if (args.preventDefault.value) {
                    calendar._rectangle.clear();
                    DayPilotScheduler.rectangleSelect = null;

                    return;
                }

                append = args.append;
            }

            if (!append) {
                calendar.multiselect.clear(true);
            }

            events.each(function(e) {
                calendar.multiselect.add(e, true);
            });

            calendar.multiselect.redraw();

            setTimeout(function() {  // needs to survive until onmaindclick is called
                calendar._rectangle.clear();
                DayPilotScheduler.rectangleSelect = null;
            },0);


            if (typeof calendar.onRectangleEventSelected === "function") {
                var args = {};
                args.events = events;
                calendar.onRectangleEventSelected(args);
            }

        }
        /*else if (DayPilotScheduler.rangeHold) {
            // handles clicking an existing time range

            var button = DayPilot.Util.mouseButton(ev);

            if (button.left) {
                var range = DayPilotScheduler.rangeHold;
                var calendar = range.calendar;
                if (calendar._isWithinRange(calendar.coords)) {

                    var createTimeRangeClickDispatcher = function(range) {
                        return function() {
                            DayPilotScheduler.timeRangeTimeout = null;

                            var sel = calendar._getSelection(range);
                            if (!sel) {
                                return;
                            }

                            var args = {};
                            args.start = sel.start;
                            args.end = sel.end;
                            args.resource = sel.resource;
                            args.preventDefault = function() {
                                args.preventDefault.value = true;
                            };
                            if (typeof calendar.onTimeRangeClick === "function") {
                                calendar.onTimeRangeClick(args);
                            }

                            if (!args.preventDefault.value) {
                                if (typeof calendar.onTimeRangeClicked === "function") {
                                    calendar.onTimeRangeClicked(args);
                                }
                            }
                        };
                    };

                    if (calendar.timeRangeClickHandling != "Disabled") {
                        if (calendar.timeRangeDoubleClickHandling === "Disabled") {
                            createTimeRangeClickDispatcher(range)();
                        }
                        else {
                            clearTimeout(DayPilotScheduler.timeRangeTimeout);
                            DayPilotScheduler.timeRangeTimeout = setTimeout(createTimeRangeClickDispatcher(range), calendar.doubleClickTimeout);
                        }
                    }
                }
            }
        }
*/
        // clean up external drag helpers
        if (DayPilotScheduler.drag) {
            if (DayPilotScheduler.drag.event && DayPilotScheduler.drag.event.part) {
                delete DayPilotScheduler.drag.event.part.external;
            }
            DayPilotScheduler.drag = null;
            document.body.style.cursor = '';
        }

        if (DayPilotScheduler.gShadow) {
            if (DayPilotScheduler.gShadow.source) {
                var calendar = DayPilotScheduler.gShadow.source.event.calendar;
                DayPilot.Util.removeClass(DayPilotScheduler.gShadow.source, calendar._prefixCssClass(calendar._css.eventMovingSource));
            }

            document.body.removeChild(DayPilotScheduler.gShadow);
            DayPilotScheduler.gShadow = null;
        }

        DayPilotScheduler.moveOffsetX = null; // clean for next external drag
        DayPilotScheduler.moveDragStart = null;

    };

    // global shadow, external drag&drop
    DayPilotScheduler.createGShadow = function(options) {
        var options = options || {};

        var shadow = document.createElement('div');
        shadow.setAttribute('unselectable', 'on');
        shadow.style.position = 'absolute';
        shadow.style.width = '100px';
        shadow.style.height = '20px';
        shadow.style.zIndex = 101;
        shadow.style.pointerEvents = "none";

        shadow.style.backgroundColor = "#aaaaaa";
        shadow.style.opacity = 0.5;
        shadow.style.filter = "alpha(opacity=50)";

        shadow.className = options.externalCssClass;
        if (options.externalHtml) {
            shadow.innerHTML = options.externalHtml;
        }

        document.body.appendChild(shadow);

        return shadow;
    };

    var rowmoving = {};
    DayPilot.Global.rowmoving = rowmoving;

    var linking = {};
    DayPilot.Global.linking = linking;

    // publish the API

    /*
    // (backwards compatibility)
    DayPilot.SchedulerVisible.dragStart = DayPilotScheduler.dragStart;
    DayPilot.SchedulerVisible.dragStop = DayPilotScheduler.dragStop;
    DayPilot.SchedulerVisible.Scheduler = DayPilotScheduler.Scheduler;
    DayPilot.SchedulerVisible.globalHandlers = DayPilotScheduler.globalHandlers;
    */

    //  jQuery plugin
    if (typeof jQuery !== 'undefined') {
        (function($) {
            $.fn.daypilotScheduler = function(options) {
                var first = null;
                var j = this.each(function() {
                    if (this.daypilot) { // already initialized
                        return;
                    }

                    var daypilot = new DayPilot.Scheduler(this.id || this, options);
                    daypilot.init();

                    this.daypilot = daypilot;

                    if (!first) {
                        first = daypilot;
                    }
                });
                if (this.length === 1) {
                    return first;
                }
                else {
                    return j;
                }
            };
        })(jQuery);
    }

    // AngularJS plugin
    (function registerAngularModule() {
        var app = DayPilot.am();

        if (!app) {
            return;
        }

        app.directive("daypilotScheduler", ['$parse', function($parse) {
            return {
                "restrict": "E",
                "template": "<div id='{{id}}'></div>",
                "compile": function compile(element, attrs) {
                    element[0].removeAttribute("id");
                    element[0].innerHTML = this["template"].replace("{{id\u007d\u007d", attrs["id"]);

                    return function link(scope, element, attrs) {
                        // var calendar = new DayPilot.Scheduler(element[0]);
                        var calendar = new DayPilot.Scheduler(element[0].firstChild);
                        calendar._angular.scope = scope;
                        // calendar.init();

                        var oattr = attrs["id"];
                        if (oattr) {
                            scope[oattr] = calendar;
                        }

                        // save DayPilot.Scheduler object in the specified variable
                        var pas = attrs["publishAs"];
                        if (pas) {
                            var getter = $parse(pas);
                            var setter = getter.assign;
                            setter(scope, calendar);
                        }

                        // bind event handlers from attributes starting with "on"
                        for (var name in attrs) {
                            if (name.indexOf("on") === 0) {  // event handler
                                var apply = DayPilot.Util.shouldApply(name);

                                if (apply) {
                                    (function(name) {
                                        calendar[name] = function(args) {
                                            var f = $parse(attrs[name]);
                                            DayPilot.Util.safeApply(scope, function() {
                                                f(scope, {"args": args});
                                            });
                                            /*
                                            scope["$apply"](function() {
                                                f(scope, {"args": args});
                                            });
                                            */
                                        };
                                    })(name);
                                }
                                else {
                                    (function(name) {
                                        calendar[name] = function(args) {
                                            var f = $parse(attrs[name]);
                                            f(scope, {"args": args});
                                        };
                                    })(name);
                                }

                            }
                        }

                        var watch = scope["$watch"];
                        var config = attrs["config"] || attrs["daypilotConfig"];
                        var events = attrs["events"] || attrs["daypilotEvents"];

                        if (!config) {
                            calendar.init();
                        }

                        watch.call(scope, config, function (value, oldVal) {
                            calendar._loadOptions(value);
                            if (calendar._initialized) {
                                calendar.update();
                                calendar._postInit();
                            }
                            else {
                                calendar.init();
                            }
                        }, true);

                        events && watch.call(scope, events, function(value) {
                            //calendar.debug.message("daypilot-events value change detected, updating.");
                            //var calendar = element.data("calendar");
                            calendar.events.list = value;
                            calendar._update({"eventsOnly": true});
                        }, true);

                        scope.$on("$destroy", function() {
                            calendar.dispose();
                        });

                    };
                }
            };
        }]);
    })();

    if (typeof Sys !== 'undefined' && Sys.Application && Sys.Application.notifyScriptLoaded) {
        Sys.Application.notifyScriptLoaded();
    }

})();