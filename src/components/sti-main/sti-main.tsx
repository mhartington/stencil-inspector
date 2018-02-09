import {
  Component,
  State
} from '@stencil/core';

import autobind from '~decorators/autobind';
import {
  StiInjector
} from '~helpers/injector';
import {
  StiMap
} from '~helpers/interfaces';

@Component({
  tag: 'sti-main',
  styleUrls: [
    'reset.css',
    'sti-main.scss'
  ]
})
export class StiMain {
  @State()
  private debugInfo: StiMap;

  @State()
  private isDarkTheme: boolean = false;

  protected componentWillLoad(): void {
    this.isDarkTheme = chrome && chrome.devtools && chrome.devtools.panels && (chrome.devtools.panels as any).themeName === 'dark';

    StiInjector.Instance.register(this.elementInfoChangeHandler);
  }

  @autobind
  private elementInfoChangeHandler(debugInfo: StiMap): void {
    this.debugInfo = debugInfo;
  }

  protected hostData(): JSXElements.StiMainAttributes {
    return {
      class: {
        darkTheme: this.isDarkTheme
      }
    };
  }

  protected render(): null | JSX.Element[] {
    if (!this.debugInfo) {
      return null;
    }

    return [
      (
        <h1 class='app-header'>
          <sti-logo />
          <span class='logo-badge'>
            INSPECTOR
          </span>
        </h1>
      ),
      (
        <sti-group-view
          heading='Component Info'
          category='cmp'
          items={this.debugInfo.cmp}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group-view
          heading='Component Props'
          category='props'
          items={this.debugInfo.props}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group-view
          heading='Element'
          category='el'
          items={this.debugInfo.el}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      )
    ];
  }
}
