import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgClass } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStore } from '@core/auth/auth.store';
import { SidebarService } from '@shared/services/sidebar.service';
import { LucideAngularModule, BadgeCheck, LogOut, User, Ellipsis } from 'lucide-angular';
import { MENTOR_MENU_CONFIG, isMentorMenuActive } from '../../config/mentor-menu.config';
import type { MenuItem } from '@features/dashboard/shared/config/menu.config';

@Component({
  selector: 'app-mentor-dashboard-sidebar',
  imports: [AsyncPipe, NgClass, RouterModule, LucideAngularModule],
  templateUrl: './mentor-dashboard-sidebar.html'
})
export class MentorDashboardSidebar {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly destroyRef = inject(DestroyRef);
  readonly sidebarService = inject(SidebarService);

  readonly isExpanded$ = this.sidebarService.isExpanded$;
  readonly isMobileOpen$ = this.sidebarService.isMobileOpen$;
  readonly isHovered$ = this.sidebarService.isHovered$;

  currentPath = signal<string>(this.router.url);

  readonly menuConfig = MENTOR_MENU_CONFIG;

  readonly icons = {
    verified: BadgeCheck,
    person: User,
    logout: LogOut,
    sectionDots: Ellipsis
  };

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentPath.set(event.url);
        }
      });
  }

  isActive(item: MenuItem): boolean {
    return isMentorMenuActive(item, this.currentPath());
  }

  onMenuClick(item: MenuItem): void {
    if (item.disabled || !item.path) {
      return;
    }
    void this.router.navigateByUrl(item.path);
    this.sidebarService.closeMobile();
  }

  onSidebarMouseEnter(): void {
    if (!this.sidebarService.isDesktopViewport()) {
      return;
    }
    let expanded = true;
    const sub = this.sidebarService.isExpanded$.subscribe((val) => {
      expanded = val;
    });
    sub.unsubscribe();
    if (!expanded) {
      this.sidebarService.setHovered(true);
    }
  }

  signOut(): void {
    this.authStore.signOut();
  }

  navigateToUserDashboard(): void {
    void this.router.navigateByUrl('/dashboard/user');
    this.sidebarService.closeMobile();
  }
}
