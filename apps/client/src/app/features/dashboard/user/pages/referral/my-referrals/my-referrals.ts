import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReferralsStore } from '@features/dashboard/shared/store/referrals.store';
import { AuthStore } from '@core/auth/auth.store';
import { IUser } from '@shared/models/entities.models';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { ReferralCtaCard } from '../../../components/referral-cta-card/referral-cta-card';
import { PaginationComponent } from '@shared/ui';
import { Award, CalendarDays, LucideAngularModule, Share2, UserX, Users } from 'lucide-angular';

@Component({
  selector: 'app-my-referrals',
  imports: [CommonModule, RouterModule, ApiImgPipe, ReferralCtaCard, LucideAngularModule, PaginationComponent],
  templateUrl: './my-referrals.html',
  standalone: true
})
export class MyReferrals implements OnInit {
  referralsStore = inject(ReferralsStore);
  authStore = inject(AuthStore);

  readonly icons = {
    award: Award,
    calendar: CalendarDays,
    share: Share2,
    userOff: UserX,
    users: Users
  };

  readonly itemsPerPage = 20;

  currentPage = computed(() => this.referralsStore.referredUsersPage());

  invitedUsers = computed(() => this.referralsStore.referredUsers());
  totalUsers = computed(() => this.referralsStore.referredUsersTotalCount());
  loading = computed(() => this.referralsStore.isLoadingReferredUsers());

  totalInvitations = computed(() => this.referralsStore.referredUsersTotalCount());

  ngOnInit() {
    this.referralsStore.loadReferredUsers({ page: 1 });
  }

  goToPage(page: number) {
    const totalPages = Math.max(1, Math.ceil(this.totalUsers() / this.itemsPerPage));
    if (page < 1 || page > totalPages || page === this.currentPage()) {
      return;
    }
    this.referralsStore.loadReferredUsers({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  }

  getUserInitials(user: IUser): string {
    if (!user.name) return '?';
    const parts = user.name.split(' ');
    if (parts.length >= 2) {
      return parts[0].charAt(0) + parts[1].charAt(0);
    }
    return parts[0].charAt(0);
  }
}
