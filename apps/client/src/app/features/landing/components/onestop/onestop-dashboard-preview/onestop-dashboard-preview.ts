import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BriefcaseBusiness,
  ChevronDown,
  CircleUser,
  Gift,
  GraduationCap,
  Hand,
  LayoutDashboard,
  Link2,
  LucideAngularModule,
  Package,
  Star,
  UserPlus,
  Users
} from 'lucide-angular';

@Component({
  selector: 'app-onestop-dashboard-preview',
  imports: [TranslateModule, LucideAngularModule],
  templateUrl: './onestop-dashboard-preview.html'
})
export class OnestopDashboardPreview {
  readonly icons = {
    hand: Hand,
    overview: LayoutDashboard,
    ventures: BriefcaseBusiness,
    programs: GraduationCap,
    profile: CircleUser,
    projects: BriefcaseBusiness,
    products: Package,
    referrals: UserPlus,
    profileStat: Users,
    gift: Gift,
    link: Link2,
    star: Star,
    chevron: ChevronDown
  };

  readonly stats = [
    { icon: this.icons.projects, labelKey: 'onestop.preview.stats.projects', value: '2' },
    { icon: this.icons.products, labelKey: 'onestop.preview.stats.products', value: '4' },
    { icon: this.icons.referrals, labelKey: 'onestop.preview.stats.referrals', value: '14' },
    { icon: this.icons.profileStat, labelKey: 'onestop.preview.stats.profile', value: '100%' }
  ] as const;
}
