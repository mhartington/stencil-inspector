import {
  Component,
  Prop,
  State,
  Watch
} from '@stencil/core';

import autobind from '~decorators/autobind';
import {
  StiInjector
} from '~helpers/injector';
import {
  StiExpandPayload,
  StiItemData
} from '~helpers/interfaces';

@Component({
  tag: 'sti-item',
  styleUrl: 'sti-item.pcss',
  shadow: true
})
export class StiItemView {
  @Prop()
  public item: StiItemData = null;

  @Prop()
  public print: boolean = false;

  @Prop()
  public dark: boolean = false;

  @State()
  private isExpanded: boolean = false;

  private expandedValue: StiItemData[] = [];

  @Watch('item')
  protected itemChangeHandler(): void {
    this.isExpanded = false;

    this.expandedValue = [];
  }

  protected hostData(): JSXElements.StiItemAttributes {
    return {
      class: {
        dark: this.dark
      }
    };
  }

  @autobind
  private itemsChangeHandler(newItem: StiExpandPayload): void {
    this.isExpanded = newItem.isExpanded;

    this.expandedValue = newItem.expandedValue;
  }

  @autobind
  private arrowClickHandler(): void {
    StiInjector.Instance.expandItem({
      isExpanded: this.isExpanded,
      expandedValue: this.expandedValue
    }, this.item, this.itemsChangeHandler);
  }

  @autobind
  private renderChild(item: StiItemData): JSX.Element {
    return (
      <sti-item
        item={item}
        print={this.item.type === 'function'}
        dark={this.dark}
      />
    );
  }

  private renderChildList(): JSX.Element {
    return (
      <div class='children'>
        {
          this.expandedValue.length > 0 ?
            this.expandedValue.map(this.renderChild) :
            (
              <sti-message
                message='Object has no properties.'
                dark={this.dark}
              />
            )
        }
      </div>
    );
  }

  protected render(): JSX.Element[] {
    const print: string = this.print ? 'print' : '';

    return [
      (
        <div class='item'>
          {
            this.item.canExpand ?
              (
                <sti-arrow
                  direction={this.isExpanded}
                  onClick={this.arrowClickHandler}
                  class='arrow'
                />
              ) :
              null
          }
          <div class={`name ${print}`}>
            {this.item.name}
          </div>
          <div class={`value ${this.item.type} ${print}`}>
            {this.item.value.toString()}
          </div>
        </div>
      ),
      !this.isExpanded ? null : this.renderChildList()
    ];
  }
}
