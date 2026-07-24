import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SidebarService } from '@shared/services/sidebar.service';

@Component({
  selector: 'app-dashboard-backdrop',
  imports: [AsyncPipe],
  template: `
    @if (isMobileOpen$ | async) {
      <div
        class="fixed inset-0 z-40 bg-gray-900/50 xl:hidden"
        (click)="closeSidebar()"
        (keydown.escape)="closeSidebar()"
        role="button"
        tabindex="0"
        aria-label="Fermer le menu"></div>
    }
  `
})
export class DashboardBackdrop {
  private readonly sidebarService = inject(SidebarService);

  readonly isMobileOpen$ = this.sidebarService.isMobileOpen$;

  closeSidebar(): void {
    this.sidebarService.closeMobile();
  }
}
