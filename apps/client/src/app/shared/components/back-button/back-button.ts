import { Component, inject, computed } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

/** Routes formulaire : le retour est géré dans la page pour éviter le chevauchement. */
const HIDE_FIXED_BACK_URL = /\/ventures\/(create|edit\/)/;

@Component({
  selector: 'app-back-button',
  imports: [LucideAngularModule, TranslateModule],
  templateUrl: './back-button.html'
})
export class BackButton {
  icons = {
    back: ArrowLeft
  };

  #location = inject(Location);
  #router = inject(Router);
  #url = toSignal(
    this.#router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.#router.url),
      startWith(this.#router.url)
    ),
    { initialValue: this.#router.url }
  );

  showFixed = computed(() => !HIDE_FIXED_BACK_URL.test(this.#url()));

  onGoBack(): void {
    this.#location.back();
  }
}
