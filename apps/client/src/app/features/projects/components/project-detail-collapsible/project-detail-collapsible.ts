import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, ChevronUp, FileText, CheckCircle2, Target, Info } from 'lucide-angular';

export type CollapsibleTheme = 'primary' | 'primary-check' | 'amber' | 'blue';

@Component({
  selector: 'app-project-detail-collapsible',

  imports: [NgClass, TranslateModule, LucideAngularModule],
  templateUrl: './project-detail-collapsible.html'
})
export class ProjectDetailCollapsibleComponent {
  titleKey = input.required<string>();
  content = input<string>('');
  emptyKey = input<string>('project_detail.detail.empty');
  expanded = input.required<boolean>();
  sectionId = input.required<string>();
  theme = input<CollapsibleTheme>('primary');

  toggleChange = output<void>();

  icons = { chevronUp: ChevronUp, fileText: FileText, checkCircle2: CheckCircle2, target: Target, info: Info };

  boxClasses(): string {
    const t = this.theme();
    const base =
      'flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2';
    if (t === 'amber') return `${base} bg-amber-50 hover:bg-amber-100 focus:ring-amber-400`;
    if (t === 'blue') return `${base} bg-blue-50 hover:bg-blue-100 focus:ring-blue-400`;
    return `${base} bg-primary-50 hover:bg-primary-100 focus:ring-primary-400`;
  }

  chevronClasses(): string {
    const t = this.theme();
    const expanded = this.expanded();
    if (t === 'amber') return expanded ? 'rotate-180 text-amber-600' : 'rotate-0 text-amber-500';
    if (t === 'blue') return expanded ? 'rotate-180 text-blue-600' : 'rotate-0 text-blue-500';
    return expanded ? 'rotate-180 text-primary-600' : 'rotate-0 text-primary-500';
  }

  contentClasses(): string {
    const t = this.theme();
    const base = 'text-gray-700 leading-relaxed transition-all duration-300 ease-in-out overflow-hidden';
    const expanded = this.expanded();
    if (expanded) {
      if (t === 'amber')
        return `${base} max-h-[500px] opacity-100 bg-amber-50/20 rounded-xl p-3 border border-amber-100`;
      if (t === 'blue') return `${base} max-h-[500px] opacity-100 bg-blue-50/20 rounded-xl p-3 border border-blue-100`;
      return `${base} max-h-[500px] opacity-100 bg-primary-50/20 rounded-xl p-3 border border-primary-100`;
    }
    return `${base} max-h-[3.5em] opacity-90 line-clamp-2`;
  }

  onToggle(): void {
    this.toggleChange.emit();
  }
}
