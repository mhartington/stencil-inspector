// tslint:disable:no-invalid-this

import {
  AppGlobal
} from '@stencil/core/dist/declarations';
import {
  ComponentListenersData,
  HostElement
} from '@stencil/core/dist/declarations/component';

import {
  StiEntry,
  StiGroupInterface,
  StiMap
} from './interfaces';

createStiScout = (): void => {
  if (window.stiScout) {
    window.stiScout = undefined;
  }

  (function (): void {
    /** It works as an id for the cached elements */
    let cachingIndex: number = 0;

    /** Increment and return the cache index */
    function getNextCachingIndex(): number {
      return ++cachingIndex;
    }

    /** Filter the properties of an object */
    function filterKeys(obj: {}, skipUnderline: boolean = false): string[] {
      const props: string[] = [];

      for (const key in obj) {
        if (key && key !== '__el' && (skipUnderline === false || !key.startsWith('_'))) {
          props.push(key);
        }
      }

      return props;
    }

    window.stiScout = {
      /** Split the members in categories */
      parseComponentMemberData(receivedMembers: any[] = []): any {
        const members: any = {
          props: {},
          states: {},
          methods: {},
          elements: {}
        };

        const categories: any = {
          1: 'props',
          2: 'props',
          3: 'props',
          4: 'props',
          5: 'states',
          6: 'methods',
          7: 'elements'
        };

        receivedMembers.forEach((member: any) => {
          const name: string = member[0] || 'unknown';

          const typeValue: number = member[1] || 0;
          const isObserved: boolean = !!member[2] || false;
          const controller: string = member[4] || '';

          const category: string = categories[typeValue];

          let value: any = {
            name,
            isObserved,
            controller
          };

          if (typeValue >= 1 && typeValue <= 4) {
            value = {
              ...value,
              isMutable: typeValue === 2,
              isContextProp: typeValue === 3,
              isConnectProp: typeValue === 4
            };
          }

          members[category][name] = value;
        });

        return members;
      },

      buildComponentsDetails(): any {
        const app: AppGlobal = (window as any).app;

        return app.components.reduce((acc: any, comp: any): any => {
          const tag: string = comp[0] || 'unknown';
          const bundle: string = comp[1] || 'unknown';
          const hasStyles: boolean = !!comp[2] || false;
          const members: any[] = this.parseComponentMemberData(comp[3]);

          const encapsulatedValue: number = comp[4] || 0;

          let encapsulated: string;

          switch (encapsulatedValue) {
            case 0:
              encapsulated = 'no';
              break;

            case 1:
              encapsulated = 'shadow dom';
              break;

            case 2:
              encapsulated = 'scoped css';
              break;

            default:
              encapsulated = 'unknown';
          }

          const listeners: ComponentListenersData = comp[5] && comp[5][0] ? comp[5][0] : [];

          return {
            ...acc,
            [tag]: {
              tag,
              bundle,
              hasStyles,
              encapsulated,
              ...members,
              listeners
            }
          };
        }, {});
      },

      /** Create an item */
      createStiEntry(entryPartial: Partial<StiEntry>, value: any): StiEntry {
        try {
          let expandableValue: any;

          if (value instanceof Node) {
            entryPartial.canExpand = true;

            entryPartial.type = 'node';

            entryPartial.value = value.constructor.name;

            expandableValue = value;
          } else if (Array.isArray(value)) {
            entryPartial.canExpand = true;

            entryPartial.type = 'array';

            entryPartial.value = `Array[${value.length}]`;

            expandableValue = value;
          } else {
            entryPartial.type = typeof value;

            entryPartial.value = value;
          }

          if (value === null) {
            entryPartial.type = 'null';

            entryPartial.value = 'null';
          } else if (value === undefined) {
            entryPartial.type = 'undefined';

            entryPartial.value = 'undefined';
          } else if (entryPartial.type === 'object') {
            entryPartial.canExpand = true;

            expandableValue = value;

            entryPartial.value = value.constructor ? value.constructor.name : 'Object';
          } else if (typeof value === 'function') {
            entryPartial.canExpand = true;

            entryPartial.value = `ƒ ${value.name || 'unknown'}`;

            expandableValue = {
              body: value.toString()
            };
          }

          const currentCachingIndex: number = entryPartial.cachingIndex || getNextCachingIndex();

          entryPartial.cachingIndex = currentCachingIndex;

          this.cachingMap[cachingIndex] = {
            expandableValue,
            cachingIndex: currentCachingIndex
          };

          return entryPartial as StiEntry;
        } catch (e) {
          return null;
        }
      },

      /** Convert an object into a group of items */
      convertObjectToGroup(obj: {}, getAllProps: boolean = false): StiGroupInterface {
        const keys: string[] = getAllProps ?
          Object.getOwnPropertyNames(obj) :
          Object.keys(obj);

        return keys.reduce((acc: StiGroupInterface, name: string) => {
          return {
            ...acc,
            [name]: this.createStiEntry({
              name
            }, obj[name], obj)
          };
        }, {});
      },

      /** Read the data about the current selected node */
      initializeMap(selectedNode: HostElement): StiMap {
        try {
          const {
            $connected,
            _instance
          } = selectedNode;

          /** Initialize the map object */
          const map: Partial<StiMap> = {};

          /** Initialize a new caching object */
          this.cachingMap = {};

          this.cachingIndex = 0;

          if (typeof $connected !== 'undefined') {
            if (typeof _instance !== 'undefined') {
              map.info = {
                success: true,
                message: ''
              };

              const components: any = this.buildComponentsDetails();

              map.cmp = this.convertObjectToGroup(components);

              const currentCmpType: any = components[selectedNode.tagName.toLowerCase()];

              map.props = Object.keys(currentCmpType.props)
                .reduce((acc: any, propName: string) => {
                  const returnObj: any = {
                    name: propName,
                    type: 'object',
                    canExpand: true,
                    cachingIndex: getNextCachingIndex()
                  };

                  let value: any = _instance[propName];

                  if (value instanceof Node) {
                    value = value.constructor.name;
                  } else if (Array.isArray(value)) {
                    value = `Array[${value.length}]`;
                  } else if (value === null) {
                    value = 'null';
                  } else if (typeof value === 'undefined') {
                    value = 'undefined';
                  } else if (typeof value === 'function') {
                    value = `ƒ ${value.name || 'unknown'}`;
                  } else if (typeof value === 'object') {
                    value = value.constructor ? value.constructor.name : 'Object';
                  }

                  returnObj.value = value;

                  this.cachingMap[returnObj.cachingIndex] = {
                    expandableValue: {
                      value: _instance[propName],
                      ...currentCmpType.props[propName]
                    },
                    cachingIndex: returnObj.cachingIndex
                  };

                  return {
                    ...acc,
                    [propName]: returnObj
                  };
                }, {});

              const states: any = Object.keys(currentCmpType.states)
                .reduce((acc: {}, stateName: string): any => {
                  return {
                    ...acc,
                    [stateName]: _instance[stateName]
                  };
                }, {});

              map.states = this.convertObjectToGroup(states);

              const methods: any = Object.keys(currentCmpType.methods)
                .reduce((acc: {}, methodName: string): any => {
                  return {
                    ...acc,
                    [methodName]: _instance[methodName]
                  };
                }, {});

              map.methods = this.convertObjectToGroup(methods);

              const elements: any = Object.keys(currentCmpType.elements)
                .reduce((acc: {}, elementName: string): any => {
                  return {
                    ...acc,
                    [elementName]: _instance[elementName]
                  };
                }, {});

              map.elements = this.convertObjectToGroup(elements);

              map.instance = this.convertObjectToGroup(_instance);
            } else {
              map.info = {
                success: false,
                message: 'Stencil is running in production mode'
              };
            }
          } else {
            map.info = {
              success: false,
              message: 'The element is not a Stencil component'
            };
          }

          return map as StiMap;
        } catch (e) {
          return null;
        }
      },

      getExpandedValue(id: number): StiGroupInterface {
        let value: any = this.cachingMap[id].expandableValue;

        if (Array.isArray(value)) {
          const newValue: any = {};

          value.forEach((currentValue: any, index: any) => {
            newValue[index] = currentValue;
          });

          value = newValue;
        }

        value = filterKeys(value)
          .reduce((acc: {}, key: string): any => {
            return {
              ...acc,
              [key]: value[key]
            };
          }, {});

        return this.convertObjectToGroup(value);
      }
    };
  })();
};

export class StiInjector {
  private static _instance: StiInjector;

  private registrations: any[] = [];

  private constructor() {
    if (chrome && chrome.devtools) {
      const code: string = `(${createStiScout.toString()})(); stiScout.initializeMap($0)`;

      /** Get the current selected element */
      chrome.devtools.inspectedWindow.eval(code, (map: StiMap) => {
        this.registrations.forEach((registration: any) => {
          registration(map);
        });
      });

      /** Bind the selection change listener */
      chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
        chrome.devtools.inspectedWindow.eval(code, (map: StiMap) => {
          this.registrations.forEach((registration: any) => {
            registration(map);
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

  public expandItem(item: any, entry: StiEntry, callback: any): void {
    let {
      isExpanded,
      expandedValue
    } = item;

    let waitForEval: boolean = false;

    if (entry.canExpand) {
      isExpanded = !isExpanded;

      if (isExpanded && !expandedValue) {
        const code: string = `stiScout.getExpandedValue(${entry.cachingIndex});`;

        waitForEval = true;

        chrome.devtools.inspectedWindow.eval(code, (newExpandedValue: StiGroupInterface) => {
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
