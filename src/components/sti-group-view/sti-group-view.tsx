import {
  Component,
  Prop
} from '@stencil/core';

import {
  StiEntry,
  StiGroup,
  StiStatus
} from '~helpers/interfaces';

@Component({
  tag: 'sti-group-view',
  styleUrl: 'sti-group-view.scss'
})
export class StiGroupView {
  @Prop()
  public heading: string = '';

  @Prop()
  public category: string = '';

  @Prop()
  public items: StiGroup = null;

  @Prop()
  public info: StiStatus = null;

  @Prop()
  public darkTheme: boolean = false;

  protected hostData(): JSXElements.StiGroupViewAttributes {
    return {
      class: {
        darkTheme: this.darkTheme
      }
    };
  }

  private renderError(message: string = ''): JSX.Element {
    return (
      <span class='not-found'>{message}</span>
    );
  }

  private renderChild(child: StiEntry): JSX.Element {
    return (
      <li>
        <sti-property-view
          item={child}
          darkTheme={this.darkTheme}
        />
      </li>
    );
  }

  private renderChildList(items: StiGroup): JSX.Element {
    const itemsArr: StiEntry[] = Object.keys(items)
      .map((itemKey: string): StiEntry => {
        return items[itemKey];
      });

    return (
      <ul>
        {itemsArr.map(this.renderChild)}
      </ul>
    );
  }

  protected render(): JSX.Element {
    const {
      success,
      message
    } = this.info;

    const actualError: string = success === false ? message : (Object.keys(this.items).length === 0 ? `Component has no ${this.category}` : '');

    return (
      <section>
        <h2 class='header'>
          {this.heading}
        </h2>
        <div class='content'>
          {actualError ?
            this.renderError(actualError) :
            this.renderChildList(this.items)
          }
        </div>
      </section>
    );
  }
}
