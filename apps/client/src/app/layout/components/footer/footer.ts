import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { PARCOURIR_LINKS, MY_CINOLU_LINKS, SOCIAL_LINKS } from '../../data/links.data';
import { LucideAngularModule, ArrowUpRight, ChevronRight } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, NgOptimizedImage, LucideAngularModule, TranslateModule],
  templateUrl: './footer.html'
})
export class Footer {
  links = [
    { titleKey: 'footer.sections.explore', urls: PARCOURIR_LINKS },
    { titleKey: 'footer.sections.my_cinolu', urls: MY_CINOLU_LINKS },
    { titleKey: 'footer.sections.socials', urls: SOCIAL_LINKS }
  ];
  icons = { arrowUpRight: ChevronRight, arrowRight: ArrowUpRight };

  currentYear = computed(() => new Date().getFullYear());

  getYear(): number {
    return new Date().getFullYear();
  }
}
