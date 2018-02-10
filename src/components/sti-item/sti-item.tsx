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
  public darkTheme: boolean = false;

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
        dark: this.darkTheme
      }
    };
  }

  @autobind
  private itemsChangeHandler(newItem: { isExpanded: boolean; expandedValue: StiItemData[] }): void {
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

  private renderChild(item: StiItemData): JSX.Element {
    return (
      <sti-item
        item={item}
        darkTheme={this.darkTheme}
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
              <sti-message message='Object has no properties.' />
            )
        }
      </div>
    );
  }

  protected render(): JSX.Element[] {
    return [
      (
        <div class='item'>
          {
            this.item.canExpand ?
              (
                <sti-arrow
                  direction={this.isExpanded}
                  onClick={this.arrowClickHandler}
                />
              ) :
              null
          }
          <div class='name'>
            {this.item.name}
          </div>
          <div class={`value ${this.item.type}`}>
            {this.item.value.toString()}
          </div>
        </div>
      ),
      !this.isExpanded ? null : this.renderChildList()
    ];
  }
}
