import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ArrowLeft,
  ArrowRight,
  BadgeInfo,
  Calendar1,
  FileText,
  LucideAngularModule,
  MessageCircle,
  MessageCircleMore,
  MoveUpRight,
  Newspaper,
  NotepadText,
  Pencil,
  Search,
  Tag,
  Tags,
  ThumbsUp,
  Trash,
  UserPlus
} from 'lucide-angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { ArticleCardDetailSkeleton } from '../article-card-detail-skeleton/article-card-detail-skeleton';
import { RecentArticlesStore } from '../../store/articles/recent-articles.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddCommentStore } from '../../store/comments/add-comment.store';
import { AuthStore } from '@core/auth/auth.store';
import { UpdateCommentStore } from '../../store/comments/update-comment.store';
import { IComment } from '@shared/models/entities.models';
import { DeleteCommentStore } from '../../store/comments/delete-comment';
import { CommentsStore } from '../../store/comments/comments.store';
import { Subject, takeUntil } from 'rxjs';
import { QuillViewComponent } from 'ngx-quill';
import { ArticleStore } from '@features/blog/store/articles/article.store';
import { AnalyticsService } from '@core/services/analytics/analytics.service';
import { TranslateModule } from '@ngx-translate/core';
import { ArticleDetailSidebarComponent } from '../../components/article-detail-sidebar/article-detail-sidebar';
import { ArticleDetailNotFoundComponent } from '../../components/article-detail-not-found/article-detail-not-found';
import { ButtonComponent, DialogComponent } from '@shared/ui';
import { SeoService } from '@core/services/seo';

@Component({
  selector: 'app-detail-article',
  providers: [
    CommentsStore,
    ArticleStore,
    UpdateCommentStore,
    RecentArticlesStore,
    AddCommentStore,
    DeleteCommentStore
  ],
  imports: [
    LucideAngularModule,
    CommonModule,
    ApiImgPipe,
    ArticleCardDetailSkeleton,
    NgOptimizedImage,
    ReactiveFormsModule,
    ButtonComponent,
    DialogComponent,
    QuillViewComponent,
    TranslateModule,
    ArticleDetailSidebarComponent,
    ArticleDetailNotFoundComponent
  ],
  templateUrl: './detail-article.html',
  styleUrl: '../../../../shared/styles/quill-view.css'
})
export class DetailArticle implements OnInit, OnDestroy {
  #fb = inject(FormBuilder);
  form: FormGroup;
  storeAddComment = inject(AddCommentStore);
  profile = inject(AuthStore);
  updateCommentStore = inject(UpdateCommentStore);
  deleteCommentStore = inject(DeleteCommentStore);
  commentsStore = inject(CommentsStore);
  store = inject(ArticleStore);
  storeArticle = inject(RecentArticlesStore);
  #route = inject(ActivatedRoute);
  updateCommentForm: FormGroup;
  icons = {
    moveLeft: ArrowLeft,
    arrowRight: ArrowRight,
    fileText: FileText,
    notepadText: NotepadText,
    userPlus: UserPlus,
    tag: Tag,
    tags: Tags,
    comment: MessageCircleMore,
    like: ThumbsUp,
    calendar: Calendar1,
    moveUp: MoveUpRight,
    info: BadgeInfo,
    edit: Pencil,
    delete: Trash,
    messageCircle: MessageCircle,
    newspaper: Newspaper,
    search: Search
  };
  queryParams = signal<{ page: string }>({
    page: this.#route.snapshot.queryParams['page'] || '1'
  });
  #slug = this.#route.snapshot.params['slug'];
  comment = signal<IComment | null>(null);
  showEditModal = signal(false);
  destroy$ = new Subject<void>();
  isLoggedIn = signal<boolean>(false);
  #analytics = inject(AnalyticsService);
  #seo = inject(SeoService);
  #articleOpenTime = performance.now();

  ngOnDestroy() {
    const article = this.store.article();
    if (article) {
      const timeSpent = performance.now() - this.#articleOpenTime;
      this.#analytics.trackBlogArticleRead({
        slug: article.slug,
        time_spent_ms: Math.round(timeSpent)
      });
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor() {
    this.form = this.#fb.group({
      content: ['', Validators.required],
      articleId: ['']
    });

    this.updateCommentForm = this.#fb.group({
      id: ['', Validators.required],
      content: ['', Validators.required]
    });

    effect(() => {
      this.isLoggedIn.set(!!this.profile.user());
      if (!this.isLoggedIn()) this.form.get('content')?.disable();
      this.commentsStore.loadComments({
        slug: this.#slug,
        dto: this.queryParams()
      });
    });

    effect(() => {
      const a = this.store.article();
      if (!a?.slug || !a.title) return;
      this.#articleOpenTime = performance.now();
      this.#analytics.trackBlogArticleOpen(a.slug);
      this.#seo.updateEntityPage({
        name: a.title,
        description: a.summary ?? a.content,
        path: `/blog-ressources/${a.slug}`,
        type: 'article'
      });
    });
  }

  loadMore(): void {
    this.queryParams.update((params) => ({
      ...params,
      page: String(Number(params.page) + 1)
    }));
  }

  ngOnInit(): void {
    this.#route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const slug = params.get('slug');
      if (slug) this.store.loadArticle(slug);
    });
  }

  onAddComment(): void {
    const article = this.store.article();
    if (!article || !this.form.valid) return;
    this.form.patchValue({ articleId: article.id });
    this.storeAddComment.addComment(this.form.value);
    this.form.reset();
  }

  onToggleEditModal(comment: IComment | null): void {
    this.comment.set(comment);
    this.updateCommentForm.patchValue({
      id: comment?.id || '',
      content: comment?.content || ''
    });
    this.showEditModal.set(true);
  }

  closeModal(): void {
    this.showEditModal.set(false);
  }

  onUpdateComment(): void {
    this.updateCommentStore.updateComment({
      payload: this.updateCommentForm.value,
      onSuccess: () => {
        this.showEditModal.set(false);
      }
    });
  }

  onDeleteComment(commentId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Êtes-vous sûr ?')) {
      this.deleteCommentStore.deleteComment({ id: commentId });
    }
  }
}
