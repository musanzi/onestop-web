import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe, NgClass } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStore } from '@core/auth/auth.store';
import { SidebarService } from '@shared/services/sidebar.service';
import { LucideAngularModule, BadgeCheck, ChevronDown, LogOut, Ellipsis } from 'lucide-angular';
import { USER_MENU_CONFIG, isUserMenuActive } from '../../config/user-menu.config';
import type { MenuItem } from '@features/dashboard/shared/config/menu.config';
import { DashboardSidebarWidget } from '@features/dashboard/shared/components/dashboard-sidebar-widget/dashboard-sidebar-widget';

@Component({
  selector: 'app-user-dashboard-sidebar',
  imports: [AsyncPipe, NgClass, RouterModule, LucideAngularModule, DashboardSidebarWidget],
  templateUrl: './user-dashboard-sidebar.html'
})
export class UserDashboardSidebar {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);
  private readonly destroyRef = inject(DestroyRef);
  readonly sidebarService = inject(SidebarService);

  readonly isExpanded$ = this.sidebarService.isExpanded$;
  readonly isMobileOpen$ = this.sidebarService.isMobileOpen$;
  readonly isHovered$ = this.sidebarService.isHovered$;

  currentPath = signal<string>(this.router.url);
  expandedMenus = signal<Set<string>>(new Set());

  readonly menuConfig = USER_MENU_CONFIG;

  readonly icons = {
    verified: BadgeCheck,
    chevronDown: ChevronDown,
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
          this.autoExpandActiveMenus();
        }
      });

    effect(() => {
      this.autoExpandActiveMenus();
    });
  }

  private autoExpandActiveMenus(): void {
    const currentPath = this.currentPath();
    const expanded = new Set<string>();

    this.menuConfig.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children && isUserMenuActive(item, currentPath)) {
          expanded.add(item.id);
        }
      });
    });

    this.expandedMenus.set(expanded);
  }

  toggleMenu(menuId: string): void {
    const expanded = new Set(this.expandedMenus());
    if (expanded.has(menuId)) {
      expanded.delete(menuId);
    } else {
      expanded.add(menuId);
    }
    this.expandedMenus.set(expanded);
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus().has(menuId);
  }

  isActive(item: MenuItem): boolean {
    return isUserMenuActive(item, this.currentPath());
  }

  isChildActive(child: MenuItem): boolean {
    return child.path ? this.currentPath() === child.path : false;
  }

  onMenuClick(item: MenuItem, event?: MouseEvent): void {
    if (item.disabled) {
      event?.preventDefault();
      return;
    }

    if (item.children && item.children.length > 0) {
      event?.preventDefault();
      this.toggleMenu(item.id);
      return;
    }

    if (item.path) {
      void this.router.navigateByUrl(item.path);
      this.sidebarService.closeMobile();
    }
  }

  onChildClick(child: MenuItem): void {
    if (child.disabled) return;

    if (child.path) {
      void this.router.navigateByUrl(child.path);
      this.sidebarService.closeMobile();
    }
  }

  onKeyDown(event: KeyboardEvent, item: MenuItem): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onMenuClick(item);
    }

    if (item.children && item.children.length > 0) {
      if (event.key === 'ArrowRight' && !this.isMenuExpanded(item.id)) {
        event.preventDefault();
        this.toggleMenu(item.id);
      }
      if (event.key === 'ArrowLeft' && this.isMenuExpanded(item.id)) {
        event.preventDefault();
        this.toggleMenu(item.id);
      }
    }
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

  getBadgeColorClass(color: 'primary' | 'success' | 'warning' | 'danger'): string {
    const colors = {
      primary: 'bg-brand-500 text-white',
      success: 'bg-success-500 text-white',
      warning: 'bg-amber-500 text-white',
      danger: 'bg-red-500 text-white'
    };
    return colors[color] || colors.primary;
  }
}
