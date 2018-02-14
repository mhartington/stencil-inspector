import {
  StiItemData,
  StiMapData
} from '~helpers/interfaces';

import {
  createScout
} from '../scout/scout';

export class StiInjector {
  private static _instance: StiInjector;

  private registrations: any[] = [];

  private constructor() {
    if (chrome && chrome.devtools) {
      chrome.devtools.inspectedWindow.eval(`(${createScout.toString()})()`);

      const code: string = `stiScout.initializeMap($0)`;

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
        const code: string = `stiScout.getExpandedValue(${item.cacheIndex});`;

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
