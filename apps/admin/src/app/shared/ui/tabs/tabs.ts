import { Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import type { LucideIconData } from '@shared/data';

@Component({
  selector: 'app-ui-tabs',
  imports: [LucideAngularModule],
  templateUrl: './tabs.html'
})
export class UiTabs {
  tabs = input.required<{ label: string; name: string; icon?: LucideIconData }[]>();
  activeTab = input.required<string>();
  tabChange = output<string>();
  isLoading = input<boolean>(false);

  onTabChange(tabName: string) {
    this.tabChange.emit(tabName);
  }
}
