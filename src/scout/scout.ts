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
  StiCacheMap,
  StiCategories,
  StiDefinedComponent,
  StiDefinedComponents,
  StiItemData,
  StiListener,
  StiListeners,
  StiMapData,
  StiMembers,
  StiStatus
} from '~helpers/interfaces';

export const createScout: () => void = (): void => {
  const encapsulations: { [index: number]: string } = {
    0: 'No',
    1: 'Shadow DOM',
    2: 'Scoped CSS'
  };

  const memberTypes: { [index: number]: string } = {
    1: 'props',
    2: 'props',
    3: 'props',
    4: 'props',
    5: 'states',
    6: 'methods',
    7: 'elements'
  };

  class StiScout {
    private static _instance: StiScout;

    private status: StiStatus = {
      success: false,
      message: 'Loading...'
    };

    private namespace: AppGlobal = null;

    private components: StiDefinedComponents = {};

    private cacheMap: StiCacheMap = {};

    private cacheIndex: number = 0;

    private constructor() {
      /** Reset the cache object */
      this.cacheMap = {};

      /** Reset the cache index */
      this.cacheIndex = 0;

      /** Reset the status also */
      this.status = {
        success: false,
        message: 'Loading...'
      };

      window.addEventListener('load', () => {
        this.findNamespaceObject();

        if (this.namespace !== null) {
          this.components = (this.namespace.components || []).reduce(this.parseDefinedComponents, {});
        } else {
          this.status.message = 'Could not detect the namespace object';
        }
      });
    }

    private getNewCacheIndex(): number {
      return ++this.cacheIndex;
    }

    /** Check if a given prop is the namespace we are looking for */
    private checkWindowProp(propKey: string): boolean {
      const propValue: any = window[propKey];

      return (
        typeof propValue === 'object' &&
        propValue !== null &&
        propValue.hasOwnProperty('Context') &&
        propValue.hasOwnProperty('components') &&
        propValue.hasOwnProperty('h')
      );
    }

    /** Find the namespace */
    private findNamespaceObject(): void {
      // TODO: implement an array in the settings page to check for them first in order to improve performance

      /** First of all check the default namespace as most of the people are not changing this */
      if (this.checkWindowProp('app')) {
        this.namespace = (window as any).app;
      } else {
        /** Iterate over the keys of window to see if we match another one */
        const key: string = Object
          .keys(window)
          .filter(this.checkWindowProp)
          .pop();

        this.namespace = key ? window[key] : null;
      }
    }

    /** Read each component member data */
    private parseMembersData(members: StiMembers, member: ComponentMemberData): StiMembers {
      const name: string = member[0] || 'unknown';
      const type: number = member[1] || 0;
      const category: string = memberTypes[type];

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

      return members;
    }

    /** Read each listener data */
    private parseListenerData(listeners: StiListeners, listener: ComponentListenersData): StiListeners {
      return {
        ...listeners,
        [listener[1]]: {
          method: listener[0],
          event: listener[1],
          capture: listener[2],
          passive: listener[3],
          enabled: listener[4]
        }
      };
    }

    /** Read every defined component */
    private parseDefinedComponents(components: StiDefinedComponents, component: LoadComponentRegistry): StiDefinedComponents {
      const tag: string = component[0] || 'unknown';
      const bundle: string = (component[1] as any) || 'unknown';
      const hasStyles: boolean = !!component[2] || false;

      const members: StiMembers = (component[3] || []).reduce(this.parseMembersData, {
        props: {},
        states: [],
        methods: [],
        elements: []
      });

      const encapsulated: string = encapsulations[component[4]] || 'Unknown';

      const listeners: StiListeners = (component[5] || []).reduce(this.parseListenerData, {});

      return {
        ...components,
        [tag]: {
          tag,
          bundle,
          hasStyles,
          encapsulated,
          ...members,
          listeners
        }
      };
    }

    /** Check if the current key is an instance */
    private filterNodeKeysBinder(node: HostElement): (key: string) => boolean {
      return (key: string): boolean => {
        return node[key] && typeof node[key] === 'object' && typeof node[key].render === 'function';
      };
    }

    /** Find the instance object when production mode is active */
    private findInstanceObject(node: HostElement): ComponentInstance {
      const key: string = Object
        .keys(node)
        .filter(this.filterNodeKeysBinder(node))
        .pop();

      return key ? node[key] : null;
    }

    private parseComponentProp(componentMap: StiDefinedComponent, instance: ComponentInstance): (propName: string) => StiItemData {
      return (propName: string): StiItemData => {
        const returnObj: Partial<StiItemData> = {
          name: propName,
          type: 'object',
          canExpand: true,
          cacheIndex: this.getNewCacheIndex()
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

        this.cacheMap[returnObj.cacheIndex] = {
          expandableValue: {
            value: instance[propName],
            ...componentMap.props[propName]
          },
          cacheIndex: returnObj.cacheIndex
        };

        return returnObj as StiItemData;
      };
    }

    /** Read the current component props */
    private parseComponentProps(componentMap: StiDefinedComponent, instance: ComponentInstance): StiItemData[] {
      return Object
        .keys(componentMap.props)
        .map(this.parseComponentProp(componentMap, instance));
    }

    /** Create an item */
    private createItem(partialItem: Partial<StiItemData>, value: any): StiItemData {
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

        const cacheIndex: number = partialItem.cacheIndex || this.getNewCacheIndex();

        partialItem.cacheIndex = cacheIndex;

        this.cacheMap[cacheIndex] = {
          expandableValue,
          cacheIndex
        };

        return partialItem as StiItemData;
      } catch (e) {
        return null;
      }
    }

    /** Helper for creating items */
    private itemMapper(obj: {}): (name: string) => StiItemData {
      return (name: string): StiItemData => {
        return this.createItem({
          name
        }, obj[name]);
      };
    }

    /** Read the values for some of the categories */
    private parseItemsFromInstance(key: string, componentMap: StiDefinedComponent, instance: ComponentInstance): StiItemData[] {
      return componentMap[key].map(this.itemMapper(instance));
    }


    private mapListenerValue(componentMap: StiDefinedComponent, instance: ComponentInstance): (key: string) => StiListener {
      return (key: string): StiListener => {
        return {
          ...componentMap.listeners[key],
          body: instance[componentMap.listeners[key].method]
        };
      };
    }

    private parseComponentListeners(componentMap: StiDefinedComponent, instance: ComponentInstance): StiItemData[] {
      const listeners: StiListener[] = Object
        .keys(componentMap.listeners)
        .map(this.mapListenerValue(componentMap, instance));

      return this.parseItemsFromObject(listeners);
    }

    /** Convert an object into a group of items */
    private parseItemsFromObject(obj: {} | any[]): StiItemData[] {
      const keys: string[] = [];

      for (const key in obj) {
        if (key) {
          keys.push(key);
        }
      }

      return keys.map(this.itemMapper(obj));
    }

    /** Change element */
    public changeElement(selectedNode: HTMLElement | HostElement): StiMapData {
      const status: StiStatus = {
        success: false,
        message: ''
      };

      const categories: StiCategories = {
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

      try {
        /** Check if we have any selected node. Sometimes this may come undefined */
        if (selectedNode) {
          const {
            $connected,
            $rendered
          } = selectedNode as HostElement;

          if ($connected) {
            if ($rendered) {
              const {
                _instance = this.findInstanceObject(selectedNode as HostElement)
              } = selectedNode as HostElement;

              status.success = true;

              const componentMap: StiDefinedComponent = this.components[selectedNode.tagName.toLowerCase()];

              categories.props.items = this.parseComponentProps(componentMap, _instance);
              categories.states.items = this.parseItemsFromInstance('states', componentMap, _instance);
              categories.methods.items = this.parseItemsFromInstance('methods', componentMap, _instance);
              categories.elements.items = this.parseItemsFromInstance('elements', componentMap, _instance);
              categories.listeners.items = this.parseComponentListeners(componentMap, _instance);
              categories.instance.items = this.parseItemsFromObject(_instance);
            } else {
              status.message = 'Component is not rendered';
            }
          } else {
            status.message = 'Component is not connected';
          }
        } else {
          status.message = 'Component does not exist';
        }
      } catch (e) {
        status.message = e && e.message ? e.message.toString() : 'Uncaught Error';
      }

      return {
        status,
        categories
      };
    }

    /** Convert an array into object */
    private convertArrayToObj(obj: {}, currentValue: any, index: number): {} {
      return {
        ...obj,
        [index]: currentValue
      };
    }

    /** Read the expanded value data */
    public getExpandedValue(id: number): StiItemData[] {
      let value: any = this.cacheMap[id].expandableValue;

      if (Array.isArray(value)) {
        value = value.reduce(this.convertArrayToObj, {});
      }

      return this.parseItemsFromObject(value);
    }


    public static get Instance(): StiScout {
      return this._instance || (this._instance = new this());
    }
  }

  (window as any).stiScout = StiScout.Instance;
};
