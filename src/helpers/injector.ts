// tslint:disable:no-invalid-this

import {
  HostElement
} from '@stencil/core/dist/declarations/component';

import {
  StiEntry,
  StiGroup,
  StiMap
} from './interfaces';

createStiScout = function (): void {
  // if (window.stiScout) {
  //   return;
  // }

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
      /** Create an item */
      createStiEntry(entryPartial: Partial<StiEntry>, value: any, instance: any): StiEntry {
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
          }

          const currentCachingIndex: number = entryPartial.cachingIndex || getNextCachingIndex();

          entryPartial.cachingIndex = currentCachingIndex;

          this.cachingMap[cachingIndex] = {
            instance,
            expandableValue,
            cachingIndex: currentCachingIndex
          };

          return entryPartial as StiEntry;
        } catch (e) {
          return null;
        }
      },

      /** Convert an object into a group of items */
      convertObjectToGroup(obj: {}): StiGroup {
        return Object.keys(obj)
          .reduce((acc: StiGroup, name: string) => {
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
            $rendered,
            _hasLoaded,
            _hasDestroyed,
            _isQueuedForUpdate,
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

              const cmps: {} = {
                connected: $connected,
                rendered: $rendered,
                loaded: _hasLoaded,
                destroyed: _hasDestroyed,
                queuedForUpdate: _isQueuedForUpdate
              };

              map.cmp = this.convertObjectToGroup(cmps);

              const props: {} = filterKeys(_instance)
                .reduce((acc: {}, key: string): any => {
                  return {
                    ...acc,
                    [key]: _instance[key]
                  };
                }, {});

              map.props = this.convertObjectToGroup(props);

              const el: {} = filterKeys(_instance.__el)
                .reduce((acc: {}, key: string): any => {
                  return {
                    ...acc,
                    [key]: _instance.__el[key]
                  };
                }, {});

              map.el = this.convertObjectToGroup({
                el
              }, true);
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

      getExpandedValue(id: number): StiGroup {
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

        chrome.devtools.inspectedWindow.eval(code, (newExpandedValue: StiGroup) => {
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
