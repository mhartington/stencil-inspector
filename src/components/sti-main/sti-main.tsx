import {
  Component,
  State
} from '@stencil/core';

import autobind from '~decorators/autobind';
import {
  StiInjector
} from '~helpers/injector';
import {
  StiComponentData,
  StiNamespaceData
} from '~helpers/interfaces';

@Component({
  tag: 'sti-main',
  styleUrl: 'sti-main.pcss',
  shadow: true
})
export class StiMain {
  @State()
  private namespace: StiNamespaceData = null;

  @State()
  private component: StiComponentData = null;

  @State()
  private dark: boolean = false;

  protected componentWillLoad(): void {
    this.dark = chrome && chrome.devtools && chrome.devtools.panels && (chrome.devtools.panels as any).themeName === 'dark';

    StiInjector.Instance.register(this);
  }

  @autobind
  public changeNamespace(namespace: StiNamespaceData): void {
    this.namespace = namespace;
  }

  @autobind
  public changeComponent(component: StiComponentData): void {
    this.component = component;
  }

  protected hostData(): JSXElements.StiMainAttributes {
    return {
      class: {
        dark: this.dark
      }
    };
  }

  private renderContent(): JSX.Element | JSX.Element[] {
    const validNamespace: boolean = this.namespace !== null;
    const validComponent: boolean = this.component !== null;

    if (!validNamespace && !validComponent) {
      return (
        <sti-message
          message='Loading...'
          dark={this.dark}
        />
      );
    }

    return [
      validComponent !== null ? (
        <sti-group
          group={this.component}
          dark={this.dark}
        />
      ) : null,
      validNamespace !== null ? (
        <sti-group
          group={this.namespace}
          dark={this.dark}
        />
      ) : null
    ];
  }

  protected render(): null | JSX.Element[] {
    return [
      (
        <sti-logo
          class='logo'
          dark={this.dark}
        />
      ),
      this.renderContent()
    ];
  }
}
