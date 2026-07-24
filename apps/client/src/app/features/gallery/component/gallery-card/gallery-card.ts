import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GALLERY_IMAGES, IGalleryImage } from '../../data/gallery.data';
import { ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronRight, Eye } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ImageLightboxComponent } from '@shared/components/image-lightbox/image-lightbox';
import { PublicButton, PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-gallery-card',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    TranslateModule,
    ImageLightboxComponent,
    PublicSection,
    PublicContainer,
    PublicButton
  ],
  templateUrl: './gallery-card.html'
})
export class GalleryCardComponent {
  icons = {
    prev: ChevronRight,
    eye: Eye
  } as const;

  private allPhotos: IGalleryImage[] = GALLERY_IMAGES;

  photos = signal<IGalleryImage[]>([...this.allPhotos]);
  activeCategory = signal<string | null>(null);
  page = signal(1);
  perPage = 9;

  currentIndex = signal(0);
  lightboxOpen = signal(false);

  lightboxItems = computed(() =>
    this.photos().map((photo) => ({
      src: photo.src,
      alt: photo.alt,
      category: photo.category
    }))
  );

  filtered = computed(() => this.photos().slice(0, this.page() * this.perPage));
  canLoadMore = computed(() => this.filtered().length < this.photos().length);

  loadMore() {
    this.page.update((p) => p + 1);
  }

  openLightbox(p: IGalleryImage) {
    this.currentIndex.set(this.photos().findIndex((x) => x.src === p.src));
    this.lightboxOpen.set(true);
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
  }

  listCategories() {
    return Array.from(new Set(this.allPhotos.map((photo) => photo.category).filter((c): c is string => !!c)));
  }

  filterByCategory(item: string): void {
    this.photos.set(this.allPhotos.filter((photo) => photo.category === item));
    this.page.set(1);
    this.closeLightbox();
    this.activeCategory.set(item);
  }

  resetFilter(): void {
    this.photos.set([...this.allPhotos]);
    this.page.set(1);
    this.activeCategory.set(null);
  }

  isActiveButton(category: string): boolean {
    return this.activeCategory() === category;
  }

  trackBySrc(_: number, item: IGalleryImage) {
    return item.src;
  }
}
