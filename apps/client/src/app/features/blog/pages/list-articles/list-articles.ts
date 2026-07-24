import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IArticle } from '@shared/models/entities.models';
import { ArticlesStore } from '../../store/articles/articles.store';
import { ArticleCard } from '../../components/article-card/article-card';
import { FilterArticlesDto } from '../../dto/filter-articles.dto';
import { ArticleCardSkeleton } from '../../components/article-card-skeleton/article-card-skeleton';
import { TagsStore } from '../../store/articles/tags.store';
import { Pen } from 'lucide-angular';
import { AnalyticsService } from '@core/services/analytics/analytics.service';
import { TranslateModule } from '@ngx-translate/core';
import { PublicContainer, PublicPageHero, PublicSection } from '@shared/public';
import { PaginationComponent } from '@shared/ui';

@Component({
  selector: 'app-blog',
  providers: [ArticlesStore, TagsStore],
  imports: [
    CommonModule,
    ArticleCard,
    PaginationComponent,
    ArticleCardSkeleton,
    PublicPageHero,
    PublicSection,
    PublicContainer,
    TranslateModule
  ],
  templateUrl: './list-articles.html'
})
export class ListArticles implements OnInit {
  store = inject(ArticlesStore);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  tagsStore = inject(TagsStore);
  #analytics = inject(AnalyticsService);
  arrSkeleton = Array.from({ length: 12 }, (_, index) => index);
  selectedTags: string[] =
    this.#route.snapshot.queryParamMap
      .get('tags')
      ?.split(',')
      .map((tag) => tag.trim())
      .filter(Boolean) ?? [];
  queryParams = signal<FilterArticlesDto>({
    page: this.#route.snapshot.queryParamMap.get('page'),
    tags: this.#route.snapshot.queryParamMap.get('tags')
  });
  icons = { edit: Pen };

  readonly itemsPerPage = 12;

  currentPage = computed(() => {
    const page = this.queryParams().page;
    if (!page) {
      return 1;
    }
    const parsed = Number(page);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  });

  totalItems = computed(() => this.store.articles()[1]);

  loading = computed(() => this.store.isLoading());

  ngOnInit(): void {
    this.store.loadArticles(this.queryParams());
  }

  trackByArticleId(index: number, article: IArticle): string {
    return article.id || index.toString();
  }

  async onFilterChange(event: Event | string[], filter: 'page' | 'tags'): Promise<void> {
    const value = Array.isArray(event)
      ? event
      : Array.from((event.target as HTMLSelectElement).selectedOptions).map((option) => option.value);

    this.queryParams().page = null;
    this.queryParams()[filter] = value.length ? value.join(',') : null;

    if (filter === 'tags') {
      this.selectedTags = [...value];
      this.#analytics.trackBlogFilter(this.selectedTags);
    }

    await this.updateRouteAndArticles();
  }

  async onClear(): Promise<void> {
    this.selectedTags = [];
    this.queryParams().page = null;
    this.queryParams().tags = null;
    await this.updateRouteAndArticles();
  }

  async toggleTag(tagId: string): Promise<void> {
    this.selectedTags = this.isTagSelected(tagId)
      ? this.selectedTags.filter((selectedTagId) => selectedTagId !== tagId)
      : [...this.selectedTags, tagId];

    await this.onFilterChange(this.selectedTags, 'tags');
  }

  isTagSelected(tagId: string): boolean {
    return this.selectedTags.includes(tagId);
  }

  async onPageChange(currentPage: number): Promise<void> {
    this.queryParams().page = currentPage === 1 ? null : currentPage.toString();
    this.#analytics.trackBlogPagination(currentPage);
    await this.updateRouteAndArticles();
  }

  async updateRoute(): Promise<void> {
    const { page, tags } = this.queryParams();
    const queryParams = { page, tags };
    await this.#router.navigate(['/blog-ressources'], { queryParams });
  }

  async updateRouteAndArticles(): Promise<void> {
    await this.updateRoute();
    this.store.loadArticles(this.queryParams());
  }
}
