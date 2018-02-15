import autobind from '~decorators/autobind';

import {
  StiComponent,
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
      this.injectScout();
    }
  }

  public static get Instance(): StiInjector {
    return this._instance || (this._instance = new this());
  }

  @autobind
  private injectScout(): void {
    chrome.devtools.inspectedWindow.eval(
      `(${createScout.toString()})()`,
      () => {
        this.getNamespace();

        chrome.devtools.panels.elements.onSelectionChanged.addListener(this.getComponent);
        chrome.devtools.network.onNavigated.addListener(this.networkNavigateHandler);
      }
    );
  }

  private getNamespace(): void {
    chrome.devtools.inspectedWindow.eval(
      'stiScout.getNamespace()',
      (mapData: any): void => {
        (this.mainInstances || []).forEach((instance: any) => {
          instance.changeNamespace(mapData);
        });

        this.getComponent();
      });
  }

  @autobind
  private getComponent(): void {
    chrome.devtools.inspectedWindow.eval(
      'stiScout.changeElement($0)',
      (component: StiComponent): void => {
        (this.mainInstances || []).forEach((instance: any) => {
          instance.changeComponent(component);
        });
      });
  }

  @autobind
  private networkNavigateHandler(): void {
    chrome.devtools.network.onNavigated.removeListener(this.networkNavigateHandler);

    this.injectScout();
  }

  public register(mainInstance: any): void {
    this.mainInstances.push(mainInstance);
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
