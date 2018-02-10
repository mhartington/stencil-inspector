import {
  Component,
  State
} from '@stencil/core';

import autobind from '~decorators/autobind';
import {
  StiInjector
} from '~helpers/injector';
import {
  StiGroupData,
  StiMapData
} from '~helpers/interfaces';

@Component({
  tag: 'sti-main',
  styleUrl: 'sti-main.pcss',
  shadow: true
})
export class StiMain {
  @State()
  private mapData: StiMapData = {
    info: {
      success: false,
      message: 'Loading...'
    },
    groups: []
  };

  @State()
  private isDarkTheme: boolean = false;

  protected componentWillLoad(): void {
    this.isDarkTheme = chrome && chrome.devtools && chrome.devtools.panels && (chrome.devtools.panels as any).themeName === 'dark';

    StiInjector.Instance.register(this.elementInfoChangeHandler);
  }

  @autobind
  private elementInfoChangeHandler(mapData: StiMapData): void {
    this.mapData = mapData;
  }

  protected hostData(): JSXElements.StiMainAttributes {
    return {
      class: {
        dark: this.isDarkTheme
      }
    };
  }

  @autobind
  private renderGroup(group: StiGroupData): JSX.Element {
    return (
      <sti-group
        group={group}
        info={this.mapData.info}
        darkTheme={this.isDarkTheme}
      />
    );
  }

  protected render(): null | JSX.Element[] {
    return [
      (
        <sti-logo
          class='logo'
          darkTheme={this.isDarkTheme}
        />
      ),
      this.mapData.groups.length > 0 ?
        this.mapData.groups.map(this.renderGroup) :
          (
            !this.mapData.info.success ?
              (
                <sti-message message={this.mapData.info.message} />
              ) :
              null
          )
    ];
  }
}
