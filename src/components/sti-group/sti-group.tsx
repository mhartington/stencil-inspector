import {
  Component,
  Prop,
  State
} from '@stencil/core';

import autobind from '~decorators/autobind';
import {
  StiEntry,
  StiGroupInterface,
  StiStatus
} from '~helpers/interfaces';

@Component({
  tag: 'sti-group',
  styleUrl: 'sti-group.pcss',
  shadow: true
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

  private renderChild(child: StiEntry): JSX.Element {
    return (
      <sti-property
        item={child}
        darkTheme={this.darkTheme}
      />
    );
  }

  protected render(): JSX.Element[] {
    const {
      success,
      message
    } = this.info;

    const itemKeys: string[] = Object.keys(this.items || {});

    const actualError: string = success === false ? message : (itemKeys.length === 0 ? `${this.group} not available` : '');

    const itemsArr: StiEntry[] = itemKeys.map((itemKey: string): StiEntry => {
      return this.items[itemKey];
    });

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
      (
        <div class='content'>
          <sti-message message={actualError} />
          {this.expanded ? itemsArr.map(this.renderChild) : null}
        </div>
      )
    ];
  }
}
