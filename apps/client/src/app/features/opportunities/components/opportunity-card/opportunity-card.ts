import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, Globe } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { IOpportunity } from '@shared/models';

@Component({
  selector: 'app-opportunity-card',
  imports: [CommonModule, RouterLink, LucideAngularModule, TranslateModule, DatePipe],
  templateUrl: './opportunity-card.html'
})
export class OpportunityCard {
  readonly opportunity = input.required<IOpportunity>();
  protected readonly icons = {
    arrowRight: ArrowRight,
    globe: Globe
  };

  protected readonly isExpired = computed(() => {
    const dueDate = this.opportunity().due_date ? new Date(this.opportunity().due_date).getTime() : 0;
    return dueDate > 0 && dueDate < Date.now();
  });
}
