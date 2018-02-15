import {
  Component,
  State
} from '@stencil/core';

import autobind from '~decorators/autobind';
import {
  StiInjector
} from '~helpers/injector';
import {
  StiComponent,
  StiNamespace,
  StiStatus
} from '~helpers/interfaces';

@Component({
  tag: 'sti-main',
  styleUrl: 'sti-main.pcss',
  shadow: true
})
export class StiMain {
  @State()
  private namespace: StiNamespace = {
    status: {
      success: false,
      message: 'Loading...'
    },
    context: null,
    components: null
  };

  @State()
  private component: StiComponent = {
    status: {
      success: false,
      message: 'Loading...'
    },
    categories: null
  };

  @State()
  private dark: boolean = false;

  protected componentWillLoad(): void {
    this.dark = chrome && chrome.devtools && chrome.devtools.panels && (chrome.devtools.panels as any).themeName === 'dark';

    StiInjector.Instance.register(this);
  }

  @autobind
  public changeNamespace(namespace: StiNamespace): void {
    this.namespace = namespace;
  }

  @autobind
  public changeComponent(component: StiComponent): void {
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
    if (!this.namespace.status.success) {
      return (
        <sti-message
          message={this.namespace.status.message}
          dark={this.dark}
        />
      );
    }

    const componentStatus: StiStatus = !this.namespace.status.success ?
      this.namespace.status :
      this.component.status;

    return [
      [
        (
          <sti-group
            group={this.component.categories.props}
            info={componentStatus}
            dark={this.dark}
          />
        ),
        (
          <sti-group
            group={this.component.categories.states}
            info={componentStatus}
            dark={this.dark}
          />
        ),
        (
          <sti-group
            group={this.component.categories.elements}
            info={componentStatus}
            dark={this.dark}
          />
        ),
        (
          <sti-group
            group={this.component.categories.methods}
            info={componentStatus}
            dark={this.dark}
          />
        ),
        (
          <sti-group
            group={this.component.categories.listeners}
            info={componentStatus}
            dark={this.dark}
          />
        ),
        (
          <sti-group
            group={this.component.categories.instance}
            info={componentStatus}
            dark={this.dark}
          />
        )
      ],
      this.namespace.components && (
        <sti-group
          group={this.namespace.context}
          info={this.namespace.status}
          dark={this.dark}
        />
      ),
      this.namespace.context && (
        <sti-group
          group={this.namespace.components}
          info={this.namespace.status}
          dark={this.dark}
        />
      )
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
