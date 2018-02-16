import {
  AppGlobal,
  ComponentInstance,
  LoadComponentRegistry
} from '@stencil/core/dist/declarations';
import {
  ComponentListenersData,
  ComponentMemberData,
  HostElement
} from '@stencil/core/dist/declarations/component';

import {
  StiAppContext,
  StiCacheMap,
  StiComponentCategories,
  StiComponentData,
  StiDefinedComponent,
  StiDefinedComponents,
  StiEnum,
  StiItemData,
  StiListener,
  StiListeners,
  StiMembers,
  StiStatus
} from '~helpers/interfaces';

// tslint:disable:typedef

/** Yeah, I know this looks messy. I tried to transform this in a class but well, Chrome... */
export const createScout: (overwrite: boolean) => void = (overwrite: boolean): void => {
  if (overwrite || !(window as any).stiScout) {
    (window as any).stiScout = undefined;

    ((): void => {
      const encapsulations: StiEnum = {
        0: 'No',
        1: 'Shadow DOM',
        2: 'Scoped CSS'
      };

      const memberTypes: StiEnum = {
        1: 'props',
        2: 'props',
        3: 'props',
        4: 'props',
        5: 'states',
        6: 'methods',
        7: 'elements'
      };

      const cacheMap: StiCacheMap = {};

      let cacheIndex: number = 0;

      const status: StiStatus = {
        success: false,
        message: 'Loading...'
      };

      let namespace: AppGlobal = null;

      let node: HostElement = null;

      let components: StiDefinedComponents = {};

      let context: StiAppContext = {};

      let componentMap: StiDefinedComponent = null;

      let componentInstance: ComponentInstance = null;

      let componentData: StiComponentData = null;

      /**
       * Global Helper Methods
       */

      /** Increment the caching index and retrieve it */
      const getNewCacheIndex = (): number => {
        return ++cacheIndex;
      };

      /** Create an item */
      const createItem = (partialItem: Partial<StiItemData>, value: any): StiItemData => {
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

          const currentCacheIndex: number = partialItem.cacheIndex || getNewCacheIndex();

          partialItem.cacheIndex = currentCacheIndex;

          cacheMap[currentCacheIndex] = {
            expandableValue,
            cacheIndex: currentCacheIndex
          };

          return partialItem as StiItemData;
        } catch (e) {
          return null;
        }
      };

      /** Helper for creating items */
      const itemMapper = (obj: {}): (name: string) => StiItemData => {
        return (name: string): StiItemData => {
          return createItem({
            name
          }, obj[name]);
        };
      };

      /** Convert an object into a group of items */
      const parseItemsFromObject = (obj: {} | any[]): StiItemData[] => {
        const keys: string[] = [];

        for (const key in obj) {
          if (key) {
            keys.push(key);
          }
        }

        return keys.map(itemMapper(obj));
      };

      /** Convert an array into object */
      const convertArrayToObj = (obj: {}, currentValue: any, index: number): {} => {
        return {
          ...obj,
          [index]: currentValue
        };
      };

      /**
       * Namespace Methods
       */

      /** Check if a given prop is the namespace we are looking for */
      const checkWindowProp = (propKey: string): boolean => {
        const propValue: any = window[propKey];

        return (
          typeof propValue === 'object' &&
          propValue !== null &&
          propValue.hasOwnProperty('Context') &&
          propValue.hasOwnProperty('components') &&
          propValue.hasOwnProperty('h')
        );
      };

      /** Find the namespace */
      const findNamespaceObject = (): void => {
        // TODO: implement an array in the settings page to check for them first in order to improve performance

        /** First of all check the default namespace as most of the people are not changing this */
        if (checkWindowProp('app')) {
          namespace = (window as any).app;
        } else {
          /** Iterate over the keys of window to see if we match another one */
          const key: string = Object
            .keys(window)
            .filter(checkWindowProp)
            .pop();

          namespace = key ? window[key] : null;
        }
      };

      /** Read each component member data */
      const parseMembersData = (members: StiMembers, member: ComponentMemberData): StiMembers => {
        const name: string = member[0] || 'unknown';
        const type: number = member[1] || 0;
        const category: string = memberTypes[type];

        if (category) {
          /** Here we have props */
          if (type >= 1 && type <= 4) {
            const isObserved: boolean = !!member[2] || false;
            const controller: string = member[4] || '';

            members[category][name] = {
              name,
              isObserved,
              controller,
              isMutable: type === 2,
              isContextProp: type === 3,
              isConnectProp: type === 4
            };
          } else {
            /** While here we have the rest of the members */
            members[category].push(name);
          }
        }

        return members;
      };

      /** Read each listener data */
      const parseListenerData = (listeners: StiListeners, listener: ComponentListenersData): StiListeners => {
        return {
          ...listeners,
          [listener[0]]: {
            event: listener[0],
            method: listener[1],
            capture: listener[2],
            passive: listener[3],
            enabled: listener[4]
          }
        };
      };

      /** Read every defined component */
      const parseDefinedComponents = (definedComponents: StiDefinedComponents, component: LoadComponentRegistry): StiDefinedComponents => {
        const tag: string = component[0] || 'unknown';
        const bundle: string = (component[1] as any) || 'unknown';
        const hasStyles: boolean = !!component[2] || false;

        const members: StiMembers = (component[3] || []).reduce(parseMembersData, {
          props: {},
          states: [],
          methods: [],
          elements: []
        });

        const encapsulated: string = encapsulations[component[4]] || 'Unknown';

        const listeners: StiListeners = (component[5] || []).reduce(parseListenerData, {});

        return {
          ...definedComponents,
          [tag]: {
            tag,
            bundle,
            hasStyles,
            encapsulated,
            ...members,
            listeners
          }
        };
      };

      /**
       * Component Methods
       */

      /** Check if the current key is an instance */
      const filterNodeKeys = (key: string): boolean => {
        const obj: any = node[key];

        return obj && typeof obj === 'object' && typeof obj.render === 'function';
      };

      /** Find the instance object when production mode is active */
      const findInstanceObject = (currentNode: HostElement): ComponentInstance => {
        const key: string = Object
          .keys(currentNode)
          .filter(filterNodeKeys)
          .pop();

        return key ? currentNode[key] : null;
      };

      const parseComponentProp = (propName: string): StiItemData => {
        const instance: ComponentInstance = componentInstance;

        const returnObj: Partial<StiItemData> = {
          name: propName,
          type: 'object',
          canExpand: true,
          cacheIndex: getNewCacheIndex()
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

        cacheMap[returnObj.cacheIndex] = {
          expandableValue: {
            value: instance[propName],
            ...componentMap.props[propName]
          },
          cacheIndex: returnObj.cacheIndex
        };

        return returnObj as StiItemData;
      };

      /** Read the current component props */
      const parseComponentProps = (): StiItemData[] => {
        return Object
          .keys(componentMap.props)
          .map(parseComponentProp);
      };

      /** Read the values for some of the categories */
      const parseItemsFromInstance = (key: string): StiItemData[] => {
        return componentMap[key].map(itemMapper(componentInstance));
      };

      /** Map the values defined in the namespace */
      const mapListenerValue = (key: string): StiListener => {
        return {
          ...componentMap.listeners[key],
          body: componentInstance[componentMap.listeners[key].method]
        };
      };

      /** Read the listeners of a component */
      const parseComponentListeners = (): StiItemData[] => {
        const listeners: StiListener[] = Object
          .keys(componentMap.listeners)
          .map(mapListenerValue);

        return parseItemsFromObject(listeners);
      };

      /** Read the component data */
      const parseComponentData = (selectedNode: HTMLElement | HostElement): StiComponentData => {
        const componentStatus: StiStatus = {
          success: false,
          message: 'Loading...'
        };

        const categories: StiComponentCategories = {
          props: {
            label: 'Props',
            expanded: true,
            items: []
          },
          states: {
            label: 'States',
            expanded: true,
            items: []
          },
          methods: {
            label: 'Methods',
            expanded: true,
            items: []
          },
          elements: {
            label: 'Elements',
            expanded: true,
            items: []
          },
          listeners: {
            label: 'Listeners',
            expanded: true,
            items: []
          },
          instance: {
            label: 'Instance',
            expanded: false,
            items: []
          }
        };

        /** Yeah, I know... this looks ugly but I can't do anything. Chrome Extensions are unstable and I encountered every following errors */
        try {
          /** Check if we have any selected node. Sometimes this may come undefined */
          if (selectedNode) {
            const {
              $connected,
              $rendered
            } = selectedNode as HostElement;

            if ($connected) {
              if ($rendered) {
                componentInstance = (selectedNode as HostElement)._instance || findInstanceObject(selectedNode as HostElement);

                if (!componentInstance) {
                  componentStatus.message = 'Could not find instance';
                } else {
                  componentMap = components[selectedNode.tagName.toLowerCase()];

                  componentStatus.success = true;
                  componentStatus.message = '';

                  categories.props.items = parseComponentProps();
                  categories.states.items = parseItemsFromInstance('states');
                  categories.methods.items = parseItemsFromInstance('methods');
                  categories.elements.items = parseItemsFromInstance('elements');
                  categories.listeners.items = parseComponentListeners();
                  categories.instance.items = parseItemsFromObject(componentInstance);
                }
              } else {
                componentStatus.message = 'Component is not rendered';
              }
            } else {
              componentStatus.message = 'Component is not connected';
            }
          } else {
            componentStatus.message = 'Component does not exist';
          }
        } catch (e) {
          componentStatus.message = e && e.message ? e.message.toString() : 'Uncaught Error';
        }

        return {
          label: 'Component Details',
          status: componentStatus,
          categories
        };
      };

      (window as any).stiScout = {
        /** Get the parsed namespace data */
        getNamespace: (): string => {
          findNamespaceObject();

          if (namespace !== null) {
            components = (namespace.components || []).reduce(parseDefinedComponents, {});

            context = namespace.Context || {};

            status.success = true;
            status.message = '';
          } else {
            status.message = 'Could not detect the namespace object';
          }

          let response: string = '{}';

          try {
            response = JSON.stringify({
              label: 'Global Details',
              status,
              categories: {
                components: {
                  label: 'Components',
                  expanded: false,
                  items: parseItemsFromObject(components)
                },
                context: {
                  label: 'Context',
                  expanded: false,
                  items: parseItemsFromObject(context)
                }
              }
            });
          } catch (e) {
            response = JSON.stringify({
              label: 'Global Details',
              status: {
                success: false,
                message: 'Could not stringify the response'
              },
              categories: {}
            });
          }

          return response;
        },

        /** Change element */
        changeElement: (selectedNode: HTMLElement | HostElement): string => {
          if (selectedNode !== node) {
            node = selectedNode as HostElement;

            componentData = parseComponentData(selectedNode);
          }

          let response: string = '{}';

          try {
            response = JSON.stringify(componentData);
          } catch (e) {
            response = JSON.stringify({
              label: 'Component Details',
              status: {
                success: false,
                message: 'Could not stringify the response'
              },
              categories: {}
            });
          }

          return response;
        },

        /** Read the expanded value data */
        getExpandedValue: (id: number): string => {
          let value: any = cacheMap[id].expandableValue;

          if (Array.isArray(value)) {
            value = value.reduce(convertArrayToObj, {});
          }

          let response: string = '{}';

          try {
            response = JSON.stringify(parseItemsFromObject(value));
          } catch (e) {
            response = '{}';
          }

          return response;
        }
      };
    })();
  }
};
