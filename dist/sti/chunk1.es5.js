/*! Built with http://stenciljs.com */
sti.loadBundle('./chunk1.js', ['exports'], function (exports) {
    var h = window.sti.h;
    var Context = window.sti.Context;
    // tslint:disable:no-invalid-this
    function autobind(target, propertyKey, descriptor) {
        var actualFn = descriptor.value;
        if (typeof actualFn !== 'function') {
            throw new Error("Cannot autobind: " + typeof actualFn);
        }
        return {
            configurable: true,
            get: function () {
                if (this === target.prototype || this.hasOwnProperty(propertyKey) || typeof actualFn !== 'function') {
                    return actualFn;
                }
                var bindedFn = actualFn.bind(this);
                Object.defineProperty(this, propertyKey, {
                    configurable: true,
                    get: function () {
                        return bindedFn;
                    },
                    set: function (value) {
                        actualFn = value;
                        // tslint:disable-next-line:no-dynamic-delete
                        delete this[propertyKey];
                    }
                });
                return bindedFn;
            },
            set: function (value) {
                actualFn = value;
            }
        };
    }
    // tslint:disable:no-invalid-this
    createStiDebugger = function () {
        // if (window.stiDebugger) {
        //   return;
        // }
        (function () {
            var nextDebugId = 0;
            function getNextDebugId() {
                return ++nextDebugId;
            }
            /** Create an error debug info object from an error */
            function createErrorDebugInfo(e) {
                return {
                    info: {
                        success: false,
                        error: {
                            category: 'general',
                            message: e.message
                        }
                    }
                };
            }
            function getDebugPropertyKeys(obj) {
                var props = [];
                for (var key in obj) {
                    if (key) {
                        props.push(key);
                    }
                }
                return props;
            }
            window.stiDebugger = {
                setValueOnDebugInfo: function (debugInfo, value, instance) {
                    try {
                        var expandableValue = void 0;
                        if (value instanceof Node) {
                            debugInfo.canExpand = true;
                            debugInfo.type = 'node';
                            debugInfo.value = value.constructor.name;
                            expandableValue = value;
                        }
                        else if (Array.isArray(value)) {
                            debugInfo.canExpand = true;
                            debugInfo.type = 'array';
                            debugInfo.value = "Array[" + value.length + "]";
                            expandableValue = value;
                        }
                        else {
                            debugInfo.type = typeof value;
                            debugInfo.value = value;
                        }
                        if (value === null) {
                            debugInfo.type = 'null';
                            debugInfo.value = 'null';
                        }
                        else if (value === undefined) {
                            debugInfo.type = 'undefined';
                            debugInfo.value = 'undefined';
                        }
                        else if (debugInfo.type === 'object') {
                            debugInfo.canExpand = true;
                            expandableValue = value;
                            debugInfo.value = value.constructor ? value.constructor.name : 'Object';
                        }
                        var debugId = debugInfo.debugId || getNextDebugId();
                        debugInfo.debugId = debugId;
                        this.debugValueLookup[debugId] = {
                            instance: instance,
                            expandableValue: expandableValue,
                            debugId: debugId
                        };
                        return debugInfo;
                    }
                    catch (e) {
                        return createErrorDebugInfo(e);
                    }
                },
                convertObjectToComponentDebugInfo: function (obj) {
                    var _this = this;
                    return Object.keys(obj)
                        .reduce(function (acc, name) {
                        return Object.assign({}, acc, (_a = {}, _a[name] = _this.setValueOnDebugInfo({
                            name: name
                        }, obj[name], obj), _a));
                        var _a;
                    }, {});
                },
                /** Read the data about the current selected node */
                getDebugInfoForNode: function (selectedNode) {
                    try {
                        var $connected = selectedNode.$connected, $rendered = selectedNode.$rendered, _hasLoaded = selectedNode._hasLoaded, _hasDestroyed = selectedNode._hasDestroyed, _isQueuedForUpdate = selectedNode._isQueuedForUpdate, _instance_1 = selectedNode._instance;
                        /** Initialize DebugInfo object */
                        var debugInfo = {};
                        /** Initialize a new caching object */
                        this.debugValueLookup = {};
                        this.nextDebugId = 0;
                        if (typeof $connected !== 'undefined') {
                            if (typeof _instance_1 !== 'undefined') {
                                debugInfo.info = {
                                    success: true,
                                    error: {
                                        category: '',
                                        message: ''
                                    }
                                };
                                var cmps = {
                                    connected: $connected,
                                    rendered: $rendered,
                                    loaded: _hasLoaded,
                                    destroyed: _hasDestroyed,
                                    queuedForUpdate: _isQueuedForUpdate
                                };
                                debugInfo.cmp = this.convertObjectToComponentDebugInfo(cmps);
                                var props = getDebugPropertyKeys(_instance_1)
                                    .reduce(function (acc, key) {
                                    return Object.assign({}, acc, (_a = {}, _a[key] = _instance_1[key], _a));
                                    var _a;
                                }, {});
                                debugInfo.props = this.convertObjectToComponentDebugInfo(props);
                            }
                            else {
                                debugInfo.info = {
                                    success: false,
                                    error: {
                                        category: 'general',
                                        message: 'Stencil is running in production mode'
                                    }
                                };
                            }
                        }
                        else {
                            debugInfo.info = {
                                success: false,
                                error: {
                                    category: 'general',
                                    message: 'The element is not a Stencil component'
                                }
                            };
                        }
                        return debugInfo;
                    }
                    catch (e) {
                        return createErrorDebugInfo(e);
                    }
                },
                getExpandedDebugValueForId: function (id) {
                    var value = this.debugValueLookup[id].expandableValue;
                    if (Array.isArray(value)) {
                        var newValue_1 = {};
                        value.forEach(function (currentValue, index) {
                            newValue_1[index] = currentValue;
                        });
                        value = newValue_1;
                    }
                    value = getDebugPropertyKeys(value)
                        .reduce(function (acc, key) {
                        return Object.assign({}, acc, (_a = {}, _a[key] = value[key], _a));
                        var _a;
                    }, {});
                    return this.convertObjectToComponentDebugInfo(value);
                }
            };
        })();
    };
    var StiInjector = /** @class */ (function () {
        function StiInjector() {
            var _this = this;
            this.registrations = [];
            if (chrome && chrome.devtools) {
                var code_1 = "(" + createStiDebugger.toString() + ")(); stiDebugger.getDebugInfoForNode($0)";
                /** Get the current selected element */
                chrome.devtools.inspectedWindow.eval(code_1, function (debugObject) {
                    _this.registrations.forEach(function (registration) {
                        registration(debugObject);
                    });
                });
                /** Bind the selection change listener */
                chrome.devtools.panels.elements.onSelectionChanged.addListener(function () {
                    chrome.devtools.inspectedWindow.eval(code_1, function (debugObject) {
                        _this.registrations.forEach(function (registration) {
                            registration(debugObject);
                        });
                    });
                });
            }
        }
        Object.defineProperty(StiInjector, "Instance", {
            get: function () {
                return this._instance || (this._instance = new this());
            },
            enumerable: true,
            configurable: true
        });
        StiInjector.prototype.register = function (method) {
            this.registrations.push(method);
        };
        StiInjector.prototype.toggleDebugValueExpansion = function (item, debugInfo, callback) {
            var isExpanded = item.isExpanded, expandedValue = item.expandedValue;
            var waitForEval = false;
            if (debugInfo.canExpand) {
                isExpanded = !isExpanded;
                if (isExpanded && !expandedValue) {
                    var code = "stiDebugger.getExpandedDebugValueForId(" + debugInfo.debugId + ");";
                    waitForEval = true;
                    chrome.devtools.inspectedWindow.eval(code, function (newExpandedValue) {
                        expandedValue = newExpandedValue;
                        callback({
                            expandedValue: newExpandedValue,
                            isExpanded: true
                        });
                    });
                }
                if (!waitForEval) {
                    callback({
                        expandedValue: expandedValue,
                        isExpanded: isExpanded
                    });
                }
            }
        };
        return StiInjector;
    }());
    var StiInjectorInstance = StiInjector.Instance;
    exports.autobind = autobind;
    exports.StiInjectorInstance = StiInjectorInstance;
});
