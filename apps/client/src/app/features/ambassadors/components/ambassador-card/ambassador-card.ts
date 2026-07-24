import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Mail, MapPin, Medal, Sparkles, Star, Trophy, Users } from 'lucide-angular';
import { IUser } from '@shared/models';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { getInitials, getAmbassadorLevel } from '@shared/helpers/ambassador.helpers';

@Component({
  selector: 'app-ambassador-card',

  imports: [CommonModule, RouterLink, TranslateModule, LucideAngularModule, ApiImgPipe],
  templateUrl: './ambassador-card.html'
})
export class AmbassadorCard {
  ambassador = input.required<IUser>();
  index = input<number>(0);
  currentPage = input<number>(1);

  imageError = output<Event>();

  icons = {
    star: Star,
    mapPin: MapPin,
    sparkles: Sparkles,
    trophy: Trophy,
    medal: Medal,
    mail: Mail,
    users: Users
  };

  getInitials(name: string): string {
    return getInitials(name);
  }

  getAmbassadorBadge(referralsCount?: number) {
    return getAmbassadorLevel(referralsCount);
  }

  getProgressPercentage(referralsCount: number): number {
    const maxReferrals = 50;
    return Math.min(100, Math.round((referralsCount / maxReferrals) * 100));
  }

  onImageError(event: Event): void {
    this.imageError.emit(event);
  }
}
