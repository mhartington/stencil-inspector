import {
  Component,
  Prop
} from '@stencil/core';

@Component({
  tag: 'sti-message',
  styleUrl: 'sti-message.pcss',
  shadow: true
})
export class StiMessage {
  @Prop()
  public message: string = '';

  protected hostData(): JSXElements.StiMessageAttributes {
    return {
      class: {
        hidden: this.message.length === 0
      }
    };
  }

  protected render(): JSX.Element {
    return this.message;
  }
}
