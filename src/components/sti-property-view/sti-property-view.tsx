import {
  Component,
  Prop,
  State,
  Watch
} from '@stencil/core';

import autobind from '../../decorators/autobind';
import {
  ComponentDebugEntry,
  ComponentDebugInfo,
  StiInjector
} from '../../helpers/injector';

@Component({
  tag: 'sti-property-view',
  styleUrl: 'sti-property-view.scss'
})
export class StiPropertyView {
  @Prop()
  public item: ComponentDebugEntry = null;

  @State()
  private isExpanded: boolean = false;

  @State()
  private expandedValue: ComponentDebugInfo = null;

  @Watch('item')
  protected itemChangeHandler(): void {
    this.isExpanded = false;

    this.expandedValue = null;
  }

  @autobind
  private itemsChangeHandler(newItem: { isExpanded: boolean; expandedValue: ComponentDebugInfo }): void {
    this.isExpanded = newItem.isExpanded;

    this.expandedValue = newItem.expandedValue;
  }

  @autobind
  private arrowClickHandler(): void {
    StiInjector.Instance.toggleDebugValueExpansion({
      isExpanded: this.isExpanded,
      expandedValue: this.expandedValue
    }, this.item, this.itemsChangeHandler);
  }

  private renderArrow(isExpanded: boolean): JSX.Element {
    if (isExpanded) {
      return (
        <span class='down'>▼</span>
      );
    }

    return (
      <span class='right'>▶</span>
    );
  }

  private renderChild(child: ComponentDebugEntry): JSX.Element {
    return (
      <li>
        <sti-property-view item={child} />
      </li>
    );
  }

  private renderChildList(isExpanded: boolean, items: ComponentDebugInfo): JSX.Element {
    if (!isExpanded || !items) {
      return null;
    }

    const itemsArr: ComponentDebugEntry[] = Object.keys(items)
      .map((itemKey: string): ComponentDebugEntry => {
        return items[itemKey];
      });

    return (
      <ul class='properties'>
        {
          itemsArr.length === 0 ?
            (
              <div class='no-properties'>
                Object has no properties.
              </div>
            ) :
            itemsArr.map(this.renderChild)
        }
      </ul>
    );
  }

  protected render(): JSX.Element[] {
    return [
      (
        <span class='property-line'>
          <span
            style={{
              opacity: this.item.canExpand ? '1' : '0'
            }}
            class='arrow'
            onClick={this.arrowClickHandler}
          >
            {this.renderArrow(this.isExpanded)}
          </span>
          <span class='property-name'>
            {this.item.name}
          </span>
          <span class='token-colon'>
            :
          </span>
          &nbsp;
          <span class='value-container'>
            {
              this.item.type === 'string' ?
                (
                  <span class='property-value string'>
                    "
                  </span>
                ) :
                null
            }
            <span class={`property-value ${this.item.type}`}>
              {this.item.value.toString()}
            </span>
            {
              this.item.type === 'string' ?
                (
                  <span class='property-value string'>
                    "
                  </span>
                ) :
                null
            }
          </span>
        </span>
      ),
      this.renderChildList(this.isExpanded, this.expandedValue)
    ];
  }
}
