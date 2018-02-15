import {
  Component,
  Prop,
  State
} from '@stencil/core';

import autobind from '~decorators/autobind';
import {
  StiCategoryData,
  StiItemData
} from '~helpers/interfaces';

@Component({
  tag: 'sti-category',
  styleUrl: 'sti-category.pcss',
  shadow: true
})
export class StiCategory {
  @Prop()
  public category: StiCategoryData = null;

  @Prop()
  public dark: boolean = false;

  @State()
  private expanded: boolean = true;

  protected componentWillLoad(): void {
    this.expanded = this.category.expanded;
  }

  protected hostData(): JSXElements.StiCategoryAttributes {
    return {
      class: {
        expanded: this.expanded,
        dark: this.dark
      }
    };
  }

  @autobind
  private headerClickHandler(): void {
    this.expanded = !this.expanded;
  }

  @autobind
  private renderChild(item: StiItemData): JSX.Element {
    return (
      <sti-item
        item={item}
        class='item'
        dark={this.dark}
      />
    );
  }

  private renderChildList(): JSX.Element {
    if (!this.expanded) {
      return null;
    }

    const actualMessage: string = this.category.items.length === 0 ? `${this.category.label} has no entries` : '';

    return actualMessage ?
      (
        <sti-message
          message={actualMessage}
          dark={this.dark}
        />
      ) :
      this.category.items.map(this.renderChild);
  }

  protected render(): JSX.Element | JSX.Element[] {
    return [
      (
        <h3
          class='header'
          onClick={this.headerClickHandler}
        >
          <sti-arrow
            class='arrow'
            direction={this.expanded}
          />
          <div class='label'>
            {this.category.label}
          </div>
        </h3>
      ),
      this.renderChildList()
    ];
  }
}
