import autobind from '~decorators/autobind';
import {
  StiExpandPayload,
  StiNamespaceData
} from '~helpers/interfaces';

import {
  StiComponentData,
  StiItemData
} from './interfaces';
import {
  createScout
} from './scout';

export class StiInjector {
  private static _instance: StiInjector;

  private mainInstances: any[] = [];

  private constructor() {
    if (chrome && chrome.devtools) {
      this.injectScout(true);
    }
  }

  public static get Instance(): StiInjector {
    return this._instance || (this._instance = new this());
  }

  @autobind
  private injectScout(overwrite: boolean = true): void {
    chrome.devtools.inspectedWindow.eval(
      `(${createScout.toString()})(${overwrite.toString()})`,
      () => {
        this.getNamespace();

        chrome.devtools.panels.elements.onSelectionChanged.addListener(this.getComponent);
        chrome.devtools.network.onNavigated.addListener(this.networkNavigateHandler);
      }
    );
  }

  private parseResponse(response: string, key: string): any {
    let parsedResponse: any;

    try {
      parsedResponse = JSON.parse(response);
    } catch (e) {
      parsedResponse = {
        label: key,
        status: {
          success: false,
          message: 'Could not fetch the data'
        },
        categories: {}
      };
    }

    return parsedResponse;
  }

  private getNamespace(): void {
    chrome.devtools.inspectedWindow.eval(
      'stiScout.getNamespace()',
      (namespace: string): void => {
        const parsedData: StiNamespaceData = this.parseResponse(namespace, 'Global Details');

        (this.mainInstances || []).forEach((instance: any) => {
          instance.changeNamespace(parsedData);
        });

        this.getComponent();
      });
  }

  @autobind
  private getComponent(): void {
    chrome.devtools.inspectedWindow.eval(
      'stiScout.changeElement($0)',
      (component: string): void => {
        const parsedData: StiComponentData = this.parseResponse(component, 'Component Details');

        (this.mainInstances || []).forEach((instance: any) => {
          instance.changeComponent(parsedData);
        });
      });
  }

  @autobind
  private networkNavigateHandler(): void {
    chrome.devtools.network.onNavigated.removeListener(this.networkNavigateHandler);

    this.injectScout(true);
  }

  public register(mainInstance: any): void {
    this.mainInstances.push(mainInstance);
  }

  public expandItem(opts: StiExpandPayload, item: StiItemData, callback: (newItem: StiExpandPayload) => void): void {
    const {
      expandedValue
    } = opts;

    let {
      isExpanded
    } = opts;

    let waitForEval: boolean = false;

    if (item.canExpand) {
      isExpanded = !isExpanded;

      if (isExpanded && expandedValue.length === 0) {
        waitForEval = true;

        chrome.devtools.inspectedWindow.eval(
          `stiScout.getExpandedValue(${item.cacheIndex});`,
          (newExpandedValue: string) => {
            callback({
              expandedValue: JSON.parse(newExpandedValue),
              isExpanded: true
            });
          }
        );
      }

      if (!waitForEval) {
        callback({
          expandedValue,
          isExpanded
        });
      }
    }
  }

  public refresh(): void {
    chrome.devtools.network.onNavigated.removeListener(this.networkNavigateHandler);

    this.injectScout(true);
  }
}
