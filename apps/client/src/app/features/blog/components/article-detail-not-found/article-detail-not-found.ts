import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, FileX, ArrowRight, Newspaper, Tag, Search } from 'lucide-angular';
import { ButtonComponent } from '@shared/ui';

@Component({
  selector: 'app-article-detail-not-found',

  imports: [RouterLink, TranslateModule, LucideAngularModule, ButtonComponent],
  templateUrl: './article-detail-not-found.html'
})
export class ArticleDetailNotFoundComponent {
  icons = { fileX: FileX, arrowRight: ArrowRight, newspaper: Newspaper, tag: Tag, search: Search };
}
