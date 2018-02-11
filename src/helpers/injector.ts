// tslint:disable:no-invalid-this

import {
  AppGlobal,
  ComponentInstance
} from '@stencil/core/dist/declarations';
import {
  ComponentListenersData,
  HostElement
} from '@stencil/core/dist/declarations/component';
import {
  StiGroupData,
  StiItemData,
  StiMapData
} from '~helpers/interfaces';

createStiScout = (): void => {
  if (window.stiScout) {
    window.stiScout = undefined;
  }

  ((): void => {
    /** It works as an id for the cached elements */
    let cachingIndex: number = 0;

    /** Increment and return the cache index */
    function getNextCachingIndex(): number {
      return ++cachingIndex;
    }

    window.stiScout = {
      /** Read the members of every component */
      buildComponentsMembers(receivedMembers: any[] = []): any {
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

      /** Read the details of components */
      buildComponentsDetails(): any {
        const app: AppGlobal = (window as any).app;

        return app.components.reduce((acc: any, comp: any): any => {
          const tag: string = comp[0] || 'unknown';
          const bundle: string = comp[1] || 'unknown';
          const hasStyles: boolean = !!comp[2] || false;
          const members: any[] = this.buildComponentsMembers(comp[3]);

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

          const listeners: ComponentListenersData = (comp[5] || []).reduce((listenerAcc: {}, listener: any) => {
            return {
              ...listenerAcc,
              [listener[0]]: listener[1]
            };
          }, []);

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

      /** Read the props group */
      buildProps(currentCmpType: any, instance: ComponentInstance): StiGroupData {
        return {
          label: 'Props',
          expanded: true,
          items: Object.keys(currentCmpType.props)
            .map((propName: string) => {
              const returnObj: any = {
                name: propName,
                type: 'object',
                canExpand: true,
                cachingIndex: getNextCachingIndex()
              };

              let value: any = instance[propName];

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
                  value: instance[propName],
                  ...currentCmpType.props[propName]
                },
                cachingIndex: returnObj.cachingIndex
              };

              return returnObj;
            }, [])
        };
      },

      /** Create an item */
      createItem(partialItem: Partial<StiItemData>, value: any): StiItemData {
        try {
          let expandableValue: any;

          if (value instanceof Node) {
            partialItem.canExpand = true;

            partialItem.type = 'node';

            partialItem.value = value.constructor.name;

            expandableValue = value;
          } else if (Array.isArray(value)) {
            partialItem.canExpand = true;

            partialItem.type = 'array';

            partialItem.value = `Array[${value.length}]`;

            expandableValue = value;
          } else {
            partialItem.type = typeof value;

            partialItem.value = value;
          }

          if (value === null) {
            partialItem.type = 'null';

            partialItem.value = 'null';
          } else if (value === undefined) {
            partialItem.type = 'undefined';

            partialItem.value = 'undefined';
          } else if (partialItem.type === 'object') {
            partialItem.canExpand = true;

            expandableValue = value;

            partialItem.value = value.constructor ? value.constructor.name : 'Object';
          } else if (typeof value === 'function') {
            partialItem.canExpand = true;

            partialItem.value = `ƒ ${value.name || 'unknown'}`;

            expandableValue = {
              body: value.toString()
            };
          }

          const currentCachingIndex: number = partialItem.cachingIndex || getNextCachingIndex();

          partialItem.cachingIndex = currentCachingIndex;

          this.cachingMap[cachingIndex] = {
            expandableValue,
            cachingIndex: currentCachingIndex
          };

          return partialItem as StiItemData;
        } catch (e) {
          return null;
        }
      },

      /** Read the data and create and item */
      buildGroupFromInstance(label: string, currentCmpType: any, instance: ComponentInstance): StiGroupData {
        const key: string = label.toLowerCase();

        return {
          label,
          expanded: true,
          items: Object.keys(currentCmpType[key])
            .map((propName: string): any => {
              return this.createItem({
                name: propName
              }, instance[propName]);
            })
        };
      },

      buildListenersGroup(currentCmpType: any, instance: ComponentInstance): StiGroupData {
        const items: any = Object.keys(currentCmpType.listeners)
          .reduce((acc: any[], listenerKey: string) => {
            return {
              ...acc,
              [listenerKey]: instance[currentCmpType.listeners[listenerKey]]
            };
          }, {});

        return this.convertObjectToGroup('Listeners', items);
      },

      /** Convert an object into a group of items */
      convertObjectToGroup(label: string, obj: {}, expanded: boolean = true): StiGroupData {
        const keys: string[] = [];

        for (const key in obj) {
          if (key) {
            keys.push(key);
          }
        }

        return {
          label,
          expanded,
          items: keys.map((name: string): StiItemData => {
            return this.createItem({
              name
            }, obj[name]);
          })
        };
      },

      /** Read the data about the current selected node */
      initializeMap(selectedNode: HostElement): StiMapData {
        try {
          const {
            $connected,
            _instance
          } = selectedNode;

          /** Initialize the map object */
          const map: StiMapData = {
            info: {
              success: false,
              message: ''
            },
            groups: []
          };

          /** Initialize a new caching object */
          this.cachingMap = {};

          this.cachingIndex = 0;

          if (typeof $connected !== 'undefined') {
            if (typeof _instance !== 'undefined') {
              map.info.success = true;

              const components: any = this.buildComponentsDetails();

              const currentCmpType: any = components[selectedNode.tagName.toLowerCase()];

              map.groups.push(this.buildProps(currentCmpType, _instance));
              map.groups.push(this.buildGroupFromInstance('States', currentCmpType, _instance));
              map.groups.push(this.buildGroupFromInstance('Methods', currentCmpType, _instance));
              map.groups.push(this.buildGroupFromInstance('Elements', currentCmpType, _instance));
              map.groups.push(this.buildListenersGroup(currentCmpType, _instance));
              map.groups.push(this.convertObjectToGroup('Instance', _instance));
              map.groups.push(this.convertObjectToGroup('Element', _instance.__el, false));
              map.groups.push(this.convertObjectToGroup('Context', (window as any).app.Context));
              map.groups.push(this.convertObjectToGroup('Registered Components', components, false));
            } else {
              map.info.message = 'Stencil is running in production mode';
            }
          } else {
            map.info.message = 'The element is not a Stencil component';
          }

          return map;
        } catch (e) {
          return {
            info: {
              success: false,
              message: 'Uncaught error'
            },
            groups: []
          };
        }
      },

      /** Read the expanded value data */
      getExpandedValue(id: number): StiItemData[] {
        let value: any = this.cachingMap[id].expandableValue;

        if (Array.isArray(value)) {
          value = value.reduce((acc: {}, currentValue: any, index: number) => {
            return {
              ...acc,
              [index]: currentValue
            };
          }, {});
        }

        return this.convertObjectToGroup(id.toString(), value).items;
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
      chrome.devtools.inspectedWindow.eval(code, (mapData: StiMapData) => {
        this.registrations.forEach((registration: any) => {
          registration(mapData);
        });
      });

      /** Bind the selection change listener */
      chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
        chrome.devtools.inspectedWindow.eval(code, (mapData: StiMapData) => {
          this.registrations.forEach((registration: any) => {
            registration(mapData);
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

  public expandItem(opts: any, item: StiItemData, callback: any): void {
    let {
      isExpanded,
      expandedValue
    } = opts;

    let waitForEval: boolean = false;

    if (item.canExpand) {
      isExpanded = !isExpanded;

      if (isExpanded && expandedValue.length === 0) {
        const code: string = `stiScout.getExpandedValue(${item.cachingIndex});`;

        waitForEval = true;

        chrome.devtools.inspectedWindow.eval(code, (newExpandedValue: StiItemData[]) => {
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
