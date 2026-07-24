import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { BadgeLevel } from '@shared/config/badges.config';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-user-badge-indicator',
  imports: [NgClass, LucideAngularModule],

  templateUrl: './user-badge-indicator.html'
})
export class UserBadgeIndicatorComponent {
  badge = input.required<BadgeLevel | null>();
  showLabel = input<boolean>(true);
  size = input<'sm' | 'md' | 'lg'>('md');

  getBackgroundClass(): string {
    const badge = this.badge();
    if (!badge) return '';

    const bgMap: Record<string, string> = {
      'text-blue-600': 'bg-blue-50 hover:bg-blue-100',
      'text-purple-600': 'bg-purple-50 hover:bg-purple-100',
      'text-orange-600': 'bg-orange-50 hover:bg-orange-100',
      'text-emerald-600': 'bg-emerald-50 hover:bg-emerald-100',
      'text-amber-600': 'bg-amber-50 hover:bg-amber-100'
    };

    return bgMap[badge.color] || 'bg-gray-50 hover:bg-gray-100';
  }
}
