import { Component, signal } from '@angular/core';
import { IPartner, PARTNERS } from '../../landing/data/partners.data';
import { CommonModule } from '@angular/common';
import { ArrowRight, Handshake, LucideAngularModule } from 'lucide-angular';
import { PartnersSkeleton } from '../component/partners-skeleton/partners-skeleton';
import { PartnersCard } from '../component/partners-card/partners-card';
import { PublicButton, PublicContainer, PublicPageHero, PublicSection } from '@shared/public';

@Component({
  selector: 'app-partners',
  imports: [
    CommonModule,
    PublicPageHero,
    PublicSection,
    PublicContainer,
    PublicButton,
    LucideAngularModule,
    PartnersCard,
    PartnersSkeleton
  ],
  templateUrl: './partners.html'
})
export class Partners {
  partners = PARTNERS;
  icons = {
    handshake: Handshake,
    arrowRight: ArrowRight
  };

  loading = signal(false);

  allPartners: IPartner[] = PARTNERS;

  filteredPartners: IPartner[] = [...this.allPartners];
  lightboxOpen = signal(false);
  currentIndex = signal(0);

  page = signal(1);
  perPage = 12;
  isActiveCategory = signal<string | null>(null);

  current = signal<IPartner | null>(null);

  filtered = () => this.filteredPartners.slice(0, this.page() * this.perPage);

  canLoadMore = () => this.filtered().length < this.filteredPartners.length;

  loadMore() {
    this.page.update((p) => p + 1);
  }

  listCategories() {
    const uniques = Array.from(
      new Set(this.allPartners.map((photo) => photo.category).filter((c): c is string => !!c))
    );
    return uniques;
  }

  filterByCategory(item: string): void {
    this.filteredPartners = this.allPartners.filter((photo) => photo.category === item);
    this.page.set(1);
    this.isActiveCategory.set(item);
  }

  resetFilter(): void {
    this.filteredPartners = [...this.allPartners];
    this.page.set(1);
    this.isActiveCategory.set(null);
  }

  isActiveButton(category: string): boolean {
    return this.isActiveCategory() === category;
  }
}
