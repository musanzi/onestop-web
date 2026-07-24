import { Component, computed, input } from '@angular/core';

export type PublicContainerWidth = 'default' | 'wide' | 'full';

@Component({
  selector: 'app-public-container',
  template: `<div [class]="classes()"><ng-content /></div>`
})
export class PublicContainer {
  readonly width = input<PublicContainerWidth>('default');
  readonly className = input<string>('');

  protected readonly classes = computed(() => {
    const widthClass =
      this.width() === 'wide'
        ? 'mx-auto w-full max-w-screen-5xl px-5 sm:px-8 lg:px-16 xl:px-24 2xl:px-32'
        : this.width() === 'full'
          ? 'w-full px-5 sm:px-8 lg:px-16 xl:px-24 2xl:px-32'
          : 'mx-auto w-full max-w-screen-2xl px-5 sm:px-8 lg:px-16 xl:px-24 2xl:px-32';

    return [widthClass, this.className()].filter(Boolean).join(' ');
  });
}
