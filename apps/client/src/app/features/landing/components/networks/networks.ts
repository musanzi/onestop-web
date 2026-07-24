import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Network, Globe, Users } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { NETWORKS } from '@features/landing/data/networks.data';
import { LandingSectionHeader } from '../landing-section-header/landing-section-header';
import { PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-networks',
  imports: [CommonModule, LucideAngularModule, TranslateModule, LandingSectionHeader, PublicSection, PublicContainer],
  templateUrl: './networks.html'
})
export class Networks {
  networks = NETWORKS;

  icons = {
    network: Network,
    globe: Globe,
    users: Users
  };
}
