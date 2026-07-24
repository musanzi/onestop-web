import { Component, input } from '@angular/core';
import { BadgeLevel } from '@shared/config/badges.config';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-badge-progress-bar',

  imports: [NgClass],

  templateUrl: './badge-progress-bar.html'
})
export class BadgeProgressBarComponent {
  currentBadge = input.required<BadgeLevel>();
  nextBadge = input<BadgeLevel | null>(null);
  currentCount = input.required<number>();
  progressPercentage = input.required<number>();
  isMaxLevel = input<boolean>(false);
  showThresholds = input<boolean>(true);
}
