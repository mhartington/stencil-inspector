import {
  Component,
  Prop,
  State
} from '@stencil/core';

import autobind from '~decorators/autobind';
import {
  StiGroupInterface,
  StiStatus
} from '~helpers/interfaces';

@Component({
  tag: 'sti-group',
  styleUrl: 'sti-group.pcss'
})
export class StiGroup {
  @Prop()
  public group: string = '';

  @Prop()
  public items: StiGroupInterface = {};

  @Prop()
  public info: StiStatus = null;

  @Prop()
  public darkTheme: boolean = false;

  @State()
  private expanded: boolean = true;

  protected hostData(): JSXElements.StiGroupAttributes {
    return {
      class: {
        expanded: this.expanded,
        darkTheme: this.darkTheme
      }
    };
  }

  @autobind
  private headerClickHandler(): void {
    this.expanded = !this.expanded;
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
      itemsArr = Object.keys(this.items || {})
        .map((itemKey: string): JSX.Element => {
          return (
            <sti-property
              item={this.items[itemKey]}
              darkTheme={this.darkTheme}
            />
          );
        });

      actualMessage = itemsArr.length === 0 ? `${this.group} not available` : '';
    }

    return (
      <div class='content'>
        {
          actualMessage ?
            (
              <sti-message message={actualMessage} />
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
            {this.group}
          </div>
        </h2>
      ),
      this.renderChildList()
    ];
  }
}
