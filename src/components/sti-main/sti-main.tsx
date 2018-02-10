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
          heading='Props'
          category='props'
          items={this.debugInfo.props}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group-view
          heading='States'
          category='states'
          items={this.debugInfo.states}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group-view
          heading='Methods'
          category='methods'
          items={this.debugInfo.methods}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group-view
          heading='Elements'
          category='elements'
          items={this.debugInfo.elements}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group-view
          heading='Instance'
          category='instance'
          items={this.debugInfo.instance}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group-view
          heading='Registered Components'
          category='cmp'
          items={this.debugInfo.cmp}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      )
    ];
  }
}
