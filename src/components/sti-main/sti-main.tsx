import {
  Component,
  State
} from '@stencil/core';

import autobind from '~decorators/autobind';
import {
  StiInjector
} from '~helpers/injector';

@Component({
  tag: 'sti-main',
  styleUrl: 'sti-main.pcss',
  shadow: true
})
export class StiMain {
  @State()
  private mapData: any = {
    info: {
      success: false,
      message: 'Loading...'
    },
    groups: []
  };

  @State()
  private dark: boolean = false;

  protected componentWillLoad(): void {
    this.dark = chrome && chrome.devtools && chrome.devtools.panels && (chrome.devtools.panels as any).themeName === 'dark';

    StiInjector.Instance.register(this.elementInfoChangeHandler);
  }

  @autobind
  private elementInfoChangeHandler(mapData: any): void {
    this.mapData = mapData;
  }

  protected hostData(): JSXElements.StiMainAttributes {
    return {
      class: {
        dark: this.dark
      }
    };
  }

  @autobind
  private renderGroup(group: any): JSX.Element {
    return (
      <sti-group
        group={group}
        info={this.mapData.info}
        dark={this.dark}
      />
    );
  }

  protected render(): null | JSX.Element[] {
    return [
      (
        <sti-logo
          class='logo'
          dark={this.dark}
        />
      ),
      this.mapData.groups.length > 0 ?
        this.mapData.groups.map(this.renderGroup) :
          (
            !this.mapData.info.success ?
              (
                <sti-message
                  message={this.mapData.info.message}
                  dark={this.dark}
                />
              ) :
              null
          )
    ];
  }
}
