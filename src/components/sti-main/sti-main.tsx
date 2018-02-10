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
  styleUrl: 'sti-main.pcss'
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
        dark: this.isDarkTheme
      }
    };
  }

  protected render(): null | JSX.Element[] {
    if (!this.debugInfo) {
      return null;
    }

    return [
      (
        <sti-logo
          class='logo'
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group
          group='Props'
          class='props'
          items={this.debugInfo.props}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group
          group='States'
          class='states'
          items={this.debugInfo.states}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group
          group='Methods'
          class='methods'
          items={this.debugInfo.methods}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group
          group='Elements'
          class='elements'
          items={this.debugInfo.elements}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group
          group='Instance'
          class='instance'
          items={this.debugInfo.instance}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      ),
      (
        <sti-group
          group='Registered Components'
          class='components'
          items={this.debugInfo.cmp}
          info={this.debugInfo.info}
          darkTheme={this.isDarkTheme}
        />
      )
    ];
  }
}
