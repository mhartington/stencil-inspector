import {
  Component,
  Prop,
  State
} from '@stencil/core';

import autobind from '~decorators/autobind';
import {
  StiGroupData
} from '~helpers/interfaces';

@Component({
  tag: 'sti-group',
  styleUrl: 'sti-group.pcss',
  shadow: true
})
export class StiGroup {
  @Prop()
  public group: StiGroupData = null;

  @Prop()
  public dark: boolean = false;

  @State()
  private expanded: boolean = true;

  protected hostData(): JSXElements.StiGroupAttributes {
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
  private renderChild(category: string): JSX.Element {
    return (
      <sti-category
        category={this.group.categories[category]}
        class='category'
        dark={this.dark}
      />
    );
  }

  private renderChildList(): JSX.Element {
    if (!this.expanded) {
      return null;
    }

    const {
      success,
      message
    } = this.group.status;

    let actualMessage: string = '';
    const itemsKeys: string[] = Object.keys(this.group.categories || {});

    if (!success) {
      actualMessage = message || 'Unknown Error';
    } else if (itemsKeys.length === 0) {
      actualMessage = `${this.group.label} has no items`;
    }

    return actualMessage ?
      (
        <sti-message
          message={actualMessage}
          class='message'
          dark={this.dark}
        />
      ) :
      itemsKeys.map(this.renderChild);
  }

  protected render(): JSX.Element[] {
    return [
      (
        <h2
          class='header'
          onClick={this.headerClickHandler}
        >
          <sti-arrow
            class='arrow'
            direction={this.expanded}
          />
          <div class='label'>
            {this.group.label}
          </div>
          <sti-refresh />
        </h2>
      ),
      this.renderChildList()
    ];
  }
}
