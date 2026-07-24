import { Component, input } from '@angular/core';
import { PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-gallery-skeleton',
  imports: [PublicSection, PublicContainer],
  templateUrl: './gallery-skeleton.html'
})
export class GallerySkeleton {
  count = input<number>(8);

  get placeholders() {
    return new Array(this.count);
  }

  trackByIndex(index: number) {
    return index;
  }
}
