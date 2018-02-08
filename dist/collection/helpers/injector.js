// tslint:disable:no-invalid-this
createStiDebugger = function () {
    // if (window.stiDebugger) {
    //   return;
    // }
    (function () {
        let nextDebugId = 0;
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
            const props = [];
            for (const key in obj) {
                if (key) {
                    props.push(key);
                }
            }
            return props;
        }
        window.stiDebugger = {
            setValueOnDebugInfo(debugInfo, value, instance) {
                try {
                    let expandableValue;
                    if (value instanceof Node) {
                        debugInfo.canExpand = true;
                        debugInfo.type = 'node';
                        debugInfo.value = value.constructor.name;
                        expandableValue = value;
                    }
                    else if (Array.isArray(value)) {
                        debugInfo.canExpand = true;
                        debugInfo.type = 'array';
                        debugInfo.value = `Array[${value.length}]`;
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
                    const debugId = debugInfo.debugId || getNextDebugId();
                    debugInfo.debugId = debugId;
                    this.debugValueLookup[debugId] = {
                        instance,
                        expandableValue,
                        debugId
                    };
                    return debugInfo;
                }
                catch (e) {
                    return createErrorDebugInfo(e);
                }
            },
            convertObjectToComponentDebugInfo(obj) {
                return Object.keys(obj)
                    .reduce((acc, name) => {
                    return Object.assign({}, acc, { [name]: this.setValueOnDebugInfo({
                            name
                        }, obj[name], obj) });
                }, {});
            },
            /** Read the data about the current selected node */
            getDebugInfoForNode(selectedNode) {
                try {
                    const { $connected, $rendered, _hasLoaded, _hasDestroyed, _isQueuedForUpdate, _instance } = selectedNode;
                    /** Initialize DebugInfo object */
                    const debugInfo = {};
                    /** Initialize a new caching object */
                    this.debugValueLookup = {};
                    this.nextDebugId = 0;
                    if (typeof $connected !== 'undefined') {
                        if (typeof _instance !== 'undefined') {
                            debugInfo.info = {
                                success: true,
                                error: {
                                    category: '',
                                    message: ''
                                }
                            };
                            const cmps = {
                                connected: $connected,
                                rendered: $rendered,
                                loaded: _hasLoaded,
                                destroyed: _hasDestroyed,
                                queuedForUpdate: _isQueuedForUpdate
                            };
                            debugInfo.cmp = this.convertObjectToComponentDebugInfo(cmps);
                            const props = getDebugPropertyKeys(_instance)
                                .reduce((acc, key) => {
                                return Object.assign({}, acc, { [key]: _instance[key] });
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
            getExpandedDebugValueForId(id) {
                let value = this.debugValueLookup[id].expandableValue;
                if (Array.isArray(value)) {
                    const newValue = {};
                    value.forEach((currentValue, index) => {
                        newValue[index] = currentValue;
                    });
                    value = newValue;
                }
                value = getDebugPropertyKeys(value)
                    .reduce((acc, key) => {
                    return Object.assign({}, acc, { [key]: value[key] });
                }, {});
                return this.convertObjectToComponentDebugInfo(value);
            }
        };
    })();
};
class StiInjector {
    constructor() {
        this.registrations = [];
        if (chrome && chrome.devtools) {
            const code = `(${createStiDebugger.toString()})(); stiDebugger.getDebugInfoForNode($0)`;
            /** Get the current selected element */
            chrome.devtools.inspectedWindow.eval(code, (debugObject) => {
                this.registrations.forEach((registration) => {
                    registration(debugObject);
                });
            });
            /** Bind the selection change listener */
            chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
                chrome.devtools.inspectedWindow.eval(code, (debugObject) => {
                    this.registrations.forEach((registration) => {
                        registration(debugObject);
                    });
                });
            });
        }
    }
    static get Instance() {
        return this._instance || (this._instance = new this());
    }
    register(method) {
        this.registrations.push(method);
    }
    toggleDebugValueExpansion(item, debugInfo, callback) {
        let { isExpanded, expandedValue } = item;
        let waitForEval = false;
        if (debugInfo.canExpand) {
            isExpanded = !isExpanded;
            if (isExpanded && !expandedValue) {
                const code = `stiDebugger.getExpandedDebugValueForId(${debugInfo.debugId});`;
                waitForEval = true;
                chrome.devtools.inspectedWindow.eval(code, (newExpandedValue) => {
                    expandedValue = newExpandedValue;
                    callback({
                        expandedValue: newExpandedValue,
                        isExpanded: true
                    });
                });
            }
            if (!waitForEval) {
                callback({
                    expandedValue,
                    isExpanded
                });
            }
        }
    }
}
const StiInjectorInstance = StiInjector.Instance;
export default StiInjectorInstance;
//# sourceMappingURL=injector.js.map