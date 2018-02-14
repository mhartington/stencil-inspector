import {
  Component,
  Prop,
  State
} from '@stencil/core';

import autobind from '~decorators/autobind';

@Component({
  tag: 'sti-group',
  styleUrl: 'sti-group.pcss',
  shadow: true
})
export class StiGroup {
  @Prop()
  public group: any = {
    label: '',
    items: [],
    expanded: true
  };

  @Prop()
  public info: any = null;

  @Prop()
  public dark: boolean = false;

  @State()
  private expanded: boolean = true;

  protected componentWillLoad(): void {
    this.expanded = this.group.expanded;
  }

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
  private renderChild(item: any): JSX.Element {
    return (
      <sti-item
        item={item}
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
    } = this.info;

    let actualMessage: string = '';
    let itemsArr: JSX.Element[] = [];

    if (!success) {
      actualMessage = message;
    } else {
      itemsArr = this.group.items.map(this.renderChild);

      actualMessage = itemsArr.length === 0 ? `${this.group.label} not available` : '';
    }

    return (
      <div class='content'>
        {
          actualMessage ?
            (
              <sti-message
                message={actualMessage}
                dark={this.dark}
              />
            ) :
            itemsArr
        }
      </div>
    );
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
        </h2>
      ),
      this.renderChildList()
    ];
  }
}
