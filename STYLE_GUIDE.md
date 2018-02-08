# Style Guide

## Motivation
My way of writing TypeScript might be a little bit too much, but there are a couple of reasons I am proceeding like this.

1. Faster accomodation for everybody: 
   * people that are coming from true OOP languages are having some hard times understanding the OOP available in scripting languages
   * tracking the code in both IDEs and code editors is much easier (you can find usages, one-time rename event etc.) 
2. Given the fact that this aims to be a boilerplate, the code must follow some strict rules in terms of coding standards. From my past experience: if you don't impose a style from scratch, you will have a lot of bad time in the future when multiple people will develop on that project.

## TypeScript
```ts
/**
 * Imports
 *    - Always destructure the imports.
 *    - Always chop down imports
 *    - Modules are ordered alphabetically
 *    - Imported members are ordered alphabetically
 *    - There should be only three types of imports: node_modules, imports following paths mappings, relative imports
 */

/** 1. node_modules imports */
import {
  Component,
  Listen,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';
import {
  Store
} from '@stencil/redux';

/**
 * 2. Imports following paths mapping in tsconfig.json
 *    - mimic packages and namespaces
 */
import autobind from '~decorators/autobind';

/** 3. Relative imports */
import {
  AppSomethingMessage
} from './app-something.interface';

@Component({
  tag: 'app-something', /** Always prefix the components with "app-" */
  styleUrl: 'app-something.pcss' /** The stylesheet file should be named exactly like the components */
})
export default class AppSomething {
  /**
   * 1. Internal Props (context and connect)
   *    - ordering: alphabetically
   *    - initial value: never
   *    - naming: identically with the context/connect name
   *    - modifier: private
   */
  @Prop({
    context: 'store'
  })
  private store: Store;

  /**
   * 2. Public Properties
   *    - ordering: naturally
   *    - initial value: always
   *    - naming: following the guidelines
   *    - modifier: public
   */
  @Prop()
  public content: string = '';

  @Prop()
  public message: AppSomethingMessage = '';

  /**
   * 3. Self-controlled State Items
   *    - ordering: naturally
   *    - initial value: always
   *    - naming: following the guidelines
   *    - modifier: private
   */
  @State()
  private isValidated: boolean;

  /**
   * 4. Binded State Items
   *    - ordering: naturally
   *    - initial value: never
   *    - naming: following the guidelines
   *    - modifier: private
   */
  @State()
  private isValidatedRedux: boolean;

  /**
   * 5. HTML Element Instance
   *    - ordering: -
   *    - initial value: never
   *    - naming: HTML(ClassName)Element
   *    - modifier: public or private
   */
  @Element()
  private $element: HTMLAppSomethingElement;

  /**
   * 6. Own Properties
   *    - ordering: naturally
   *    - initial value: always
   *    - naming: following the guidelines
   *    - modifier: private
   */
  private num: number = 0;

  private $appOtherReference: HTMLAppOtherElement = null;

  /**
   * 7. Watchers
   *    - ordering: same as corresponding props
   *    - naming: (prop)ChangeHandler
   *    - modifier: protected
   *    - param types: same as corresponding prop
   *    - return type: always
   *    - preceeded by directly-tied methods
   */
  @Watch('message')
  protected messageChangeHandler(newValue: AppSomethingMessage, oldValue: AppSomethingMessage): void {
    ...
  }

  private updateState(): void {
    ...
  }

  @Watch('content')
  protected contentChangeHandler(newValue: AppSomethingMessage, oldValue: AppSomethingMessage): void {
    this.updateState();
  }

  /**
   * 8. Component lifecycle Eventsd
   *    - ordering: naturally
   *    - naming: component(Will/Did)(Load/Update/Unload)
   *    - modifier: protected
   *    - param types: -
   *    - return type: void
   *    - preceeded by directly-tied methods
   */
  protected componentWillLoad(): void {
    console.log('The component is about to be rendered');
  }

  protected componentDidLoad(): void {
    console.log('The component has been rendered');
  }

  protected componentWillUpdate(): void {
    console.log('The component will update');
  }

  protected componentDidUpdate(): void {
    console.log('The component did update');
  }

  protected componentDidUnload(): void {
    console.log('The view has been removed from the DOM');
  }

  /**
   * 9. Listeners
   *    - ordering: naturally
   *    - naming: component(event)Handler
   *    - modifier: protected
   *    - param types: always
   *    - return type: void
   *    - preceeded by directly-tied methods
   */
  @Listen('click', {
    enabled: false
  })
  protected componentClickHandler(ev: UIEvent): void {
    console.log('hi!');
  }

  /**
   * 10. Public Methods API
   *    - ordering: naturally
   *    - naming: following the guidelines
   *    - modifier: public
   *    - param types: always
   *    - return type: always
   *    - preceeded by directly-tied methods
   */
  @Method()
  public open(): void {
    ...
  }

  @Method()
  public close(): void {
    ...
  }

  /**
   * 11. Other Local methods
   *    - ordering: naturally
   *    - naming: following the guidelines
   *    - modifier: private
   *    - param types: always
   *    - return type: always
   *    - preceeded by directly-tied methods
   */
  private prepareAnimation(): void {
    ...
  }

  /**
   * 12. hostData() Method
   *    - ordering: -
   *    - naming: hostData
   *    - modifier: protected
   *    - param types: -
   *    - return type: JSXElements.(ClassName)Attributes
   *    - preceeded by directly-tied methods
   */
  protected hostData(): JSXElements.AppSomethingAttributes {
    return {
      class: {
        'message active': this.content.length > 0
      }
    };
  }

  /**
   * 12. Methods directly-tied to render()
   *    - ordering: naturally
   *    - naming: render(Element) | (element)(event)Handler | following the guidelines
   *    - modifier: protected
   *    - param types: always
   *    - return type: always
   *    - preceeded by directly-tied methods
   *    - use autobind instead of arrow functions
   */
  @autobind
  private messageLabelClickHandler(evt: UIEvent): void {
    ...
  }

  private renderMessage(): JSX.Element[] {
    return [
      (
        <spa onClick={this.messageLabelClickHandler}>Message:</span>
      ),
      (
        <span>{this.message}</span>
      )
    ];
  }

  /**
   * 13. render() Method
   *    - ordering: -
   *    - naming: render
   *    - modifier: protected
   *    - param types: -
   *    - return type: always
   *    - preceeded by directly-tied methods
   */
  protected render(): JSX.Element {
    return (
      <div class='menu-inner page-inner'>
        <slot />
        {this.renderMessage()}
      </div>
    );
  }
}
```
