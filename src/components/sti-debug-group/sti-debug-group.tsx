import {
  Component,
  Prop
} from '@stencil/core';

import {
  ComponentDebugEntry,
  ComponentDebugInfo,
  DebugInfoStatus
} from '../../helpers/injector';

@Component({
  tag: 'sti-debug-group',
  styleUrl: 'sti-debug-group.scss'
})
export class StiDebugGroup {
  @Prop()
  public heading: string = '';

  @Prop()
  public category: string = '';

  @Prop()
  public items: ComponentDebugInfo = null;

  @Prop()
  public info: DebugInfoStatus = null;

  private renderError(message: string = ''): JSX.Element {
    return (
      <span class='not-found'>{message}</span>
    );
  }

  private renderChild(child: ComponentDebugEntry): JSX.Element {
    return (
      <li>
        <sti-property-view item={child} />
      </li>
    );
  }

  private renderChildList(items: ComponentDebugInfo): JSX.Element {
    const itemsArr: ComponentDebugEntry[] = Object.keys(items)
      .map((itemKey: string): ComponentDebugEntry => {
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
      error
    } = this.info;

    return (
      <section>
        <h2 class='header'>
          {this.heading}
        </h2>
        <div class='content'>
          {success === false && (error.category === 'general' || error.category === this.category) ?
            this.renderError(error.message) :
            this.renderChildList(this.items)
          }
        </div>
      </section>
    );
  }
}
