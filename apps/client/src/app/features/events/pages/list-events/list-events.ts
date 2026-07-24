import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventCard } from '../../components/event-card/event-card';
import { EventCardSkeleton } from '../../components/event-card-skeleton/event-card-skeleton';
import { FilterEventsDto } from '../../dto/filter-events.dto';
import { EventsStore } from '../../store/events.store';
import { EventCategoriesStore } from '../../store/categories.store';
import { TranslateModule } from '@ngx-translate/core';
import { CirclePlus, LucideAngularModule } from 'lucide-angular';
import { PublicContainer, PublicPageHero, PublicSection } from '@shared/public';
import { PaginationComponent } from '@shared/ui';

@Component({
  selector: 'app-events',
  providers: [EventsStore, EventCategoriesStore],
  imports: [
    CommonModule,
    PaginationComponent,
    NgOptimizedImage,
    EventCard,
    EventCardSkeleton,
    TranslateModule,
    LucideAngularModule,
    PublicPageHero,
    PublicSection,
    PublicContainer
  ],
  templateUrl: './list-events.html'
})
export class ListEvents implements OnInit {
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  skeletonArray = Array(6).fill(0);
  store = inject(EventsStore);
  categoriesStore = inject(EventCategoriesStore);
  queryParams = signal<FilterEventsDto>({
    page: this.#route.snapshot.queryParams?.['page'] ? Number(this.#route.snapshot.queryParams['page']) : 1,
    categories: this.#route.snapshot.queryParams?.['categories']
  });

  icons = {
    circlePlus: CirclePlus
  };

  readonly itemsPerPage = 40;

  currentPage = computed(() => {
    const page = this.queryParams().page;
    return Number.isFinite(page) && page > 0 ? page : 1;
  });

  totalItems = computed(() => this.store.events()[1]);

  loading = computed(() => this.store.isLoading());

  ngOnInit(): void {
    this.store.loadEvents(this.queryParams());
  }

  async onFilterChange(event: Event, filter: 'page' | 'categories'): Promise<void> {
    const value = Array.from((event.target as HTMLSelectElement).selectedOptions).map((option) => option.value);
    this.queryParams.update((params) => ({
      ...params,
      page: 1,
      [filter]: value
    }));
    await this.updateRouteAndEvents();
  }

  async onClear(): Promise<void> {
    this.queryParams.update((params) => ({
      ...params,
      page: 1,
      categories: null
    }));
    await this.updateRouteAndEvents();
  }

  async onPageChange(currentPage: number): Promise<void> {
    this.queryParams.update((params) => ({
      ...params,
      page: currentPage
    }));
    await this.updateRouteAndEvents();
  }

  async updateRoute(): Promise<void> {
    const { page, categories } = this.queryParams();
    const queryParams = {
      page: page === 1 ? null : page,
      categories
    };
    await this.#router.navigate(['/events'], { queryParams });
  }

  async updateRouteAndEvents(): Promise<void> {
    await this.updateRoute();
    this.store.loadEvents(this.queryParams());
  }
}
