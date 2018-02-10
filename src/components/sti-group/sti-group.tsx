import {
  Component,
  Prop,
  State
} from '@stencil/core';

import autobind from '~decorators/autobind';
import {
  StiGroupData,
  StiItemData,
  StiStatusData
} from '~helpers/interfaces';

@Component({
  tag: 'sti-group',
  styleUrl: 'sti-group.pcss',
  shadow: true
})
export class StiGroup {
  @Prop()
  public group: StiGroupData = {
    label: '',
    items: [],
    expanded: true
  };

  @Prop()
  public info: StiStatusData = null;

  @Prop()
  public darkTheme: boolean = false;

  @State()
  private expanded: boolean = true;

  protected componentWillLoad(): void {
    this.expanded = this.group.expanded;
  }

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

  private renderChild(item: StiItemData): JSX.Element {
    return (
      <sti-item
        item={item}
        darkTheme={this.darkTheme}
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
            {this.group.label}
          </div>
        </h2>
      ),
      this.renderChildList()
    ];
  }
}
