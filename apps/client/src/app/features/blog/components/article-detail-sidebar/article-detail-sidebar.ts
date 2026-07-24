import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import type { IArticle, IImage } from '@shared/models/entities.models';

@Component({
  selector: 'app-article-detail-sidebar',

  imports: [RouterLink, NgOptimizedImage, DatePipe, TitleCasePipe, TranslateModule, ApiImgPipe],
  templateUrl: './article-detail-sidebar.html'
})
export class ArticleDetailSidebarComponent {
  articles = input.required<IArticle[]>();
  gallery = input<IImage[]>([]);
  activeIndex = signal(0);
}
