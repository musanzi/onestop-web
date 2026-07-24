import { Component, booleanAttribute, computed, input, numberAttribute, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';

export type PaginationVisibleItem = number | 'ellipsis';

@Component({
  selector: 'ui-pagination',
  imports: [LucideAngularModule, TranslateModule],
  templateUrl: './pagination.html'
})
export class PaginationComponent {
  readonly page = input(1, { transform: numberAttribute });
  readonly pageSize = input(10, { transform: numberAttribute });
  readonly total = input(0, { transform: numberAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly showSummary = input(false, { transform: booleanAttribute });
  readonly showPageNumbers = input(true, { transform: booleanAttribute });
  readonly maxVisiblePages = input(7, { transform: numberAttribute });
  readonly scrollToTop = input(false, { transform: booleanAttribute });

  readonly pageChange = output<number>();

  protected readonly icons = {
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight
  };

  protected readonly totalPages = computed(() => {
    if (this.total() <= 0 || this.pageSize() <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(this.total() / this.pageSize()));
  });

  protected readonly rangeStart = computed(() => {
    if (this.total() === 0) return 0;
    return (this.page() - 1) * this.pageSize() + 1;
  });

  protected readonly rangeEnd = computed(() => {
    if (this.total() === 0) return 0;
    return Math.min(this.page() * this.pageSize(), this.total());
  });

  protected readonly visiblePages = computed((): PaginationVisibleItem[] => {
    if (!this.showPageNumbers()) {
      return [];
    }

    const total = this.totalPages();
    const current = this.page();
    const maxVisible = Math.max(3, this.maxVisiblePages());

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const items: PaginationVisibleItem[] = [1];
    const innerCount = maxVisible - 2;
    const side = Math.max(1, Math.floor(innerCount / 2));

    let start = Math.max(2, current - side);
    let end = Math.min(total - 1, current + side);

    if (current <= side + 1) {
      end = Math.min(total - 1, innerCount);
    }

    if (current >= total - side) {
      start = Math.max(2, total - innerCount + 1);
    }

    if (start > 2) {
      items.push('ellipsis');
    }

    for (let pageNumber = start; pageNumber <= end; pageNumber++) {
      items.push(pageNumber);
    }

    if (end < total - 1) {
      items.push('ellipsis');
    }

    if (total > 1) {
      items.push(total);
    }

    return items;
  });

  protected readonly isInteractionDisabled = computed(() => this.disabled() || this.loading());

  protected readonly isPreviousDisabled = computed(() => this.isInteractionDisabled() || this.page() <= 1);

  protected readonly isNextDisabled = computed(() => this.isInteractionDisabled() || this.page() >= this.totalPages());

  protected setPage(nextPage: number): void {
    if (this.isInteractionDisabled()) {
      return;
    }

    if (nextPage < 1 || nextPage > this.totalPages() || nextPage === this.page()) {
      return;
    }

    this.pageChange.emit(nextPage);

    if (this.scrollToTop() && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  protected previousPage(): void {
    this.setPage(this.page() - 1);
  }

  protected nextPage(): void {
    this.setPage(this.page() + 1);
  }
}
