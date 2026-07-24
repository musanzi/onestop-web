import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Check, LucideAngularModule } from 'lucide-angular';
import { PublicButton, PublicContainer, PublicSection } from '@shared/public';
import { LandingSectionHeader } from '../landing-section-header/landing-section-header';
import { OnestopDashboardPreview } from './onestop-dashboard-preview/onestop-dashboard-preview';

@Component({
  selector: 'app-onestop',
  imports: [
    RouterLink,
    TranslateModule,
    LucideAngularModule,
    PublicSection,
    PublicContainer,
    PublicButton,
    LandingSectionHeader,
    OnestopDashboardPreview
  ],
  templateUrl: './onestop.html'
})
export class Onestop {
  readonly icons = { check: Check };

  readonly moduleKeys = [
    'onestop.modules.programs',
    'onestop.modules.projects',
    'onestop.modules.products',
    'onestop.modules.profile',
    'onestop.modules.referral'
  ] as const;

  readonly benefitKeys = [
    'onestop.benefits.programs',
    'onestop.benefits.ventures',
    'onestop.benefits.profile',
    'onestop.benefits.activity'
  ] as const;
}
