import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SERVICES } from '@features/landing/data/services.data';
import { ServiceCard } from '../service-card/service-card';
import { LandingSectionHeader } from '../landing-section-header/landing-section-header';
import { PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-services',
  imports: [ServiceCard, TranslateModule, LandingSectionHeader, PublicSection, PublicContainer],
  templateUrl: './services.html'
})
export class Services {
  services = SERVICES;

  // Mapping des services vers les clés i18n
  serviceKeys: Record<string, { titleKey: string; descriptionKey: string }> = {
    'Innovative Solutions': {
      titleKey: 'services.items.innovative_solutions.title',
      descriptionKey: 'services.items.innovative_solutions.description'
    },
    'Co-Creation de Startups': {
      titleKey: 'services.items.co_creation.title',
      descriptionKey: 'services.items.co_creation.description'
    },
    'Innovation Challenges': {
      titleKey: 'services.items.innovation_challenges.title',
      descriptionKey: 'services.items.innovation_challenges.description'
    },
    'Project Management': {
      titleKey: 'services.items.project_management.title',
      descriptionKey: 'services.items.project_management.description'
    },
    'Ecosystem Mapping': {
      titleKey: 'services.items.ecosystem_mapping.title',
      descriptionKey: 'services.items.ecosystem_mapping.description'
    }
  };
}
