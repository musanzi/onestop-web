import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Rocket } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-sidebar-widget',
  imports: [RouterLink, LucideAngularModule],
  template: `
    <div class="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]">
      <h3 class="mb-2 font-semibold text-gray-900 dark:text-white">Parrainage Cinolu</h3>
      <p class="mb-4 text-theme-sm text-gray-500 dark:text-gray-400">
        Invitez des entrepreneurs et développez l'écosystème.
      </p>
      <a
        routerLink="/dashboard/user/referral/link"
        class="flex items-center justify-center rounded-lg bg-brand-500 p-3 text-theme-sm font-medium text-white hover:bg-brand-600">
        <i-lucide [name]="icons.rocket" class="mr-2 h-4 w-4" />
        Partager mon lien
      </a>
    </div>
  `
})
export class DashboardSidebarWidget {
  readonly icons = { rocket: Rocket };
}
