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
  StiEntry,
  StiGroupInterface
} from '~helpers/interfaces';

@Component({
  tag: 'sti-property',
  styleUrl: 'sti-property.pcss',
  shadow: true
})
export class StiPropertyView {
  @Prop()
  public item: StiEntry = null;

  @Prop()
  public darkTheme: boolean = false;

  @State()
  private isExpanded: boolean = false;

  @State()
  private expandedValue: StiGroupInterface = null;

  @Watch('item')
  protected itemChangeHandler(): void {
    this.isExpanded = false;

    this.expandedValue = null;
  }

  protected hostData(): JSXElements.StiPropertyAttributes {
    return {
      class: {
        dark: this.darkTheme
      }
    };
  }

  @autobind
  private itemsChangeHandler(newItem: { isExpanded: boolean; expandedValue: StiGroupInterface }): void {
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

  private renderChild(child: StiEntry): JSX.Element {
    return (
      <sti-property
        item={child}
        darkTheme={this.darkTheme}
      />
    );
  }

  private renderChildList(isExpanded: boolean, items: StiGroupInterface): JSX.Element {
    if (!isExpanded || !items) {
      return null;
    }

    const itemsArr: StiEntry[] = Object.keys(items)
      .map((itemKey: string): StiEntry => {
        return items[itemKey];
      });

    return (
      <div class='children'>
        <sti-message message={itemsArr.length === 0 ? 'Object has no properties.' : ''} />
        {itemsArr.map(this.renderChild)}
      </div>
    );
  }

  protected render(): JSX.Element[] {
    return [
      (
        <div class='property'>
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
      this.item.canExpand ? this.renderChildList(this.isExpanded, this.expandedValue) : null
    ];
  }
}
