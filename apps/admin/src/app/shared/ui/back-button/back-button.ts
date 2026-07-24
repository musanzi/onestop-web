import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BACK_BUTTON_ICONS } from '@shared/data';

@Component({
  selector: 'app-ui-back-button',
  imports: [LucideAngularModule],
  templateUrl: './back-button.html'
})
export class BackButton {
  icons = BACK_BUTTON_ICONS;
  private readonly location = inject(Location);

  onGoBack(): void {
    this.location.back();
  }
}
