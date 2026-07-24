import { Component, PLATFORM_ID, effect, inject } from '@angular/core';
import { AsyncPipe, NgClass, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SidebarService } from '@shared/services/sidebar.service';
import { DashboardBackdrop } from '@shared/layout/dashboard-backdrop/dashboard-backdrop';
import { BackButton } from '@shared/components';

@Component({
  selector: 'app-dashboard-shell-layout',
  imports: [AsyncPipe, NgClass, RouterModule, DashboardBackdrop, BackButton],
  templateUrl: './dashboard-shell-layout.html'
})
export class DashboardShellLayout {
  private readonly platformId = inject(PLATFORM_ID);
  readonly sidebarService = inject(SidebarService);

  readonly isExpanded$ = this.sidebarService.isExpanded$;
  readonly isHovered$ = this.sidebarService.isHovered$;
  readonly isMobileOpen$ = this.sidebarService.isMobileOpen$;

  private readonly mobileOpen = toSignal(this.sidebarService.isMobileOpen$, { initialValue: false });

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      document.body.style.overflow = this.mobileOpen() ? 'hidden' : '';
    });
  }
}
