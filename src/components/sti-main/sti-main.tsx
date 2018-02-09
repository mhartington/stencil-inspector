import {
  Component,
  State
} from '@stencil/core';

import autobind from '../../decorators/autobind';
import {
  DebugInfo,
  StiInjector
} from '../../helpers/injector';

@Component({
  tag: 'sti-main',
  styleUrls: [
    'reset.css',
    'sti-main.scss'
  ]
})
export class StiMain {
  @State()
  private debugInfo: DebugInfo;

  @State()
  private isDarkTheme: boolean = false;

  protected componentWillLoad(): void {
    this.isDarkTheme = chrome && chrome.devtools && chrome.devtools.panels && (chrome.devtools.panels as any).themeName === 'dark';

    StiInjector.Instance.register(this.elementInfoChangeHandler);
  }

  @autobind
  private elementInfoChangeHandler(debugInfo: DebugInfo): void {
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
        <sti-debug-group
          heading='Component Info'
          category='cmp'
          items={this.debugInfo.cmp}
          info={this.debugInfo.info}
        />
      ),
      (
        <sti-debug-group
          heading='Component Props'
          category='props'
          items={this.debugInfo.props}
          info={this.debugInfo.info}
        />
      ),
      (
        <sti-debug-group
          heading='Element'
          category='el'
          items={this.debugInfo.el}
          info={this.debugInfo.info}
        />
      )
    ];
  }
}
