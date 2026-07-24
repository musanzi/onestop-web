import { Component, effect, inject, Input, input, signal } from '@angular/core';
import { Calendar1, Heart, LucideAngularModule, MessageCircleMore, MoveRight } from 'lucide-angular';
import { IArticle } from '@shared/models/entities.models';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ArticleLikesService } from '../../services/article-likes.service';

@Component({
  selector: 'app-article-card',
  imports: [LucideAngularModule, NgOptimizedImage, ApiImgPipe, RouterLink, CommonModule, TranslateModule],
  templateUrl: './article-card.html'
})
export class ArticleCard {
  @Input() count = '';
  @Input() isPriority = false;
  article = input.required<IArticle>();
  readonly liked = signal(false);
  readonly #articleLikesService = inject(ArticleLikesService);
  icons = {
    comment: MessageCircleMore,
    like: Heart,
    calendar: Calendar1,
    moveRight: MoveRight
  };

  constructor() {
    effect(() => {
      this.liked.set(this.#articleLikesService.isLiked(this.article().id));
    });
  }

  get commentCount() {
    return (comments: unknown) => (Array.isArray(comments) ? comments.length : 0);
  }

  toggleLike(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const isLiked = this.#articleLikesService.toggleLike(this.article().id);
    this.liked.set(isLiked);
  }
}
