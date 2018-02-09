// tslint:disable:no-invalid-this

import {
  HostElement
} from '@stencil/core/dist/declarations/component';

declare var createStiDebugger: any;

declare global {
  interface Window {
    stiDebugger: any;
  }
}

export interface ComponentDebugEntry {
  name: string;
  canExpand: boolean;
  isExpanded: boolean;
  type: string;
  value: string;
  expandedValue: ComponentDebugInfo;
  debugId: number;
}

export interface ComponentDebugInfo {
  [field: string]: ComponentDebugEntry;
}

export interface DebugInfoStatus {
  success: boolean;
  error: {
    category: string;
    message: string;
  };
}

export interface DebugInfo {
  info: DebugInfoStatus;
  cmp?: ComponentDebugInfo;
  props?: ComponentDebugInfo;
  el?: ComponentDebugInfo;
}

createStiDebugger = function (): void {
  // if (window.stiDebugger) {
  //   return;
  // }

  (function (): void {
    let nextDebugId: number = 0;

    function getNextDebugId(): number {
      return ++nextDebugId;
    }

    /** Create an error debug info object from an error */
    function createErrorDebugInfo(e: Error): DebugInfo {
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

    function getDebugPropertyKeys(obj: {}, flag: boolean = false): string[] {
      const props: string[] = [];

      for (const key in obj) {
        if (key && key !== '__el' && (flag === false || !key.startsWith('_'))) {
          props.push(key);
        }
      }

      return props;
    }

    window.stiDebugger = {
      setValueOnDebugInfo(debugInfo: Partial<ComponentDebugEntry>, value: any, instance: any): DebugInfo {
        try {
          let expandableValue: any;

          if (value instanceof Node) {
            debugInfo.canExpand = true;

            debugInfo.type = 'node';

            debugInfo.value = value.constructor.name;

            expandableValue = value;
          } else if (Array.isArray(value)) {
            debugInfo.canExpand = true;

            debugInfo.type = 'array';

            debugInfo.value = `Array[${value.length}]`;

            expandableValue = value;
          } else {
            debugInfo.type = typeof value;

            debugInfo.value = value;
          }

          if (value === null) {
            debugInfo.type = 'null';

            debugInfo.value = 'null';
          } else if (value === undefined) {
            debugInfo.type = 'undefined';

            debugInfo.value = 'undefined';
          } else if (debugInfo.type === 'object') {
            debugInfo.canExpand = true;

            expandableValue = value;

            debugInfo.value = value.constructor ? value.constructor.name : 'Object';
          }

          const debugId: number = debugInfo.debugId || getNextDebugId();

          debugInfo.debugId = debugId;

          this.debugValueLookup[debugId] = {
            instance,
            expandableValue,
            debugId
          };

          return debugInfo as DebugInfo;
        } catch (e) {
          return createErrorDebugInfo(e);
        }
      },

      convertObjectToComponentDebugInfo(obj: {}): ComponentDebugInfo {
        return Object.keys(obj)
          .reduce((acc: DebugInfo, name: string) => {
            return {
              ...acc,
              [name]: this.setValueOnDebugInfo({
                name
              }, obj[name], obj)
            };
          }, {});
      },

      /** Read the data about the current selected node */
      getDebugInfoForNode(selectedNode: HostElement): DebugInfo {
        try {
          const {
            $connected,
            $rendered,
            _hasLoaded,
            _hasDestroyed,
            _isQueuedForUpdate,
            _instance
          } = selectedNode;

          /** Initialize DebugInfo object */
          const debugInfo: Partial<DebugInfo> = {};

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

              const cmps: {} = {
                connected: $connected,
                rendered: $rendered,
                loaded: _hasLoaded,
                destroyed: _hasDestroyed,
                queuedForUpdate: _isQueuedForUpdate
              };

              debugInfo.cmp = this.convertObjectToComponentDebugInfo(cmps);

              const props: {} = getDebugPropertyKeys(_instance)
                .reduce((acc: {}, key: string): any => {
                  return {
                    ...acc,
                    [key]: _instance[key]
                  };
                }, {});

              debugInfo.props = this.convertObjectToComponentDebugInfo(props);

              const el: {} = getDebugPropertyKeys(_instance.__el)
                .reduce((acc: {}, key: string): any => {
                  return {
                    ...acc,
                    [key]: _instance.__el[key]
                  };
                }, {});

              debugInfo.el = this.convertObjectToComponentDebugInfo({
                el
              }, true);
            } else {
              debugInfo.info = {
                success: false,
                error: {
                  category: 'general',
                  message: 'Stencil is running in production mode'
                }
              };
            }
          } else {
            debugInfo.info = {
              success: false,
              error: {
                category: 'general',
                message: 'The element is not a Stencil component'
              }
            };
          }

          return debugInfo as DebugInfo;
        } catch (e) {
          return createErrorDebugInfo(e);
        }
      },

      getExpandedDebugValueForId(id: number): ComponentDebugInfo {
        let value: any = this.debugValueLookup[id].expandableValue;

        if (Array.isArray(value)) {
          const newValue: any = {};

          value.forEach((currentValue: any, index: any) => {
            newValue[index] = currentValue;
          });

          value = newValue;
        }

        value = getDebugPropertyKeys(value)
          .reduce((acc: {}, key: string): any => {
            return {
              ...acc,
              [key]: value[key]
            };
          }, {});

        return this.convertObjectToComponentDebugInfo(value);
      }
    };
  })();
};

export class StiInjector {
  private static _instance: StiInjector;

  private registrations: any[] = [];

  private constructor() {
    if (chrome && chrome.devtools) {
      const code: string = `(${createStiDebugger.toString()})(); stiDebugger.getDebugInfoForNode($0)`;

      /** Get the current selected element */
      chrome.devtools.inspectedWindow.eval(code, (debugObject: any) => {
        this.registrations.forEach((registration: any) => {
          registration(debugObject);
        });
      });

      /** Bind the selection change listener */
      chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
        chrome.devtools.inspectedWindow.eval(code, (debugObject: any) => {
          this.registrations.forEach((registration: any) => {
            registration(debugObject);
          });
        });
      });
    }
  }

  public static get Instance(): StiInjector {
    return this._instance || (this._instance = new this());
  }

  public register(method: any): void {
    this.registrations.push(method);
  }

  public toggleDebugValueExpansion(item: any, debugInfo: ComponentDebugEntry, callback: any): void {
    let {
      isExpanded,
      expandedValue
    } = item;

    let waitForEval: boolean = false;

    if (debugInfo.canExpand) {
      isExpanded = !isExpanded;

      if (isExpanded && !expandedValue) {
        const code: string = `stiDebugger.getExpandedDebugValueForId(${debugInfo.debugId});`;

        waitForEval = true;

        chrome.devtools.inspectedWindow.eval(code, (newExpandedValue: ComponentDebugInfo) => {
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
