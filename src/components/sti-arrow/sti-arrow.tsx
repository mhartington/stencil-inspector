import {
  Component,
  Prop
} from '@stencil/core';

@Component({
  tag: 'sti-arrow',
  styleUrl: 'sti-arrow.pcss'
})
export class StiArrow {
  @Prop()
  public direction: boolean = true;

  protected render(): string {
    return this.direction ? '▼' : '▶';
  }
}
