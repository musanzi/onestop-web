import { Component, inject, OnInit, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  LucideAngularModule,
  MapPin,
  Mail,
  Globe,
  Linkedin,
  Target,
  Users,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  Building2,
  Eye
} from 'lucide-angular';
import { AmbassadorStore } from '../../store/ambassador.store';
import { getInitials } from '@shared/helpers/ambassador.helpers';
import { ApiImgPipe, resolveApiImageUrl } from '@shared/pipes/api-img.pipe';
import type { IImage } from '@shared/models/entities.models';
import { ImageLightboxComponent } from '@shared/components/image-lightbox/image-lightbox';
import { ImageLightboxItem } from '@shared/components/image-lightbox/image-lightbox.model';
import { SeoService } from '@core/services/seo';
import { PublicButton, PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-detail-ambassador',
  imports: [
    CommonModule,
    TranslateModule,
    ApiImgPipe,
    LucideAngularModule,
    RouterLink,
    ImageLightboxComponent,
    PublicSection,
    PublicContainer,
    PublicButton
  ],
  providers: [AmbassadorStore],
  templateUrl: './detail-ambassador.html'
})
export class DetailAmbassador implements OnInit {
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  store = inject(AmbassadorStore);

  galleryIndexes = signal<Map<string | number, number>>(new Map());
  lightboxOpen = signal<boolean>(false);
  lightboxItems = signal<ImageLightboxItem[]>([]);
  lightboxIndex = signal<number>(0);

  icons = {
    mapPin: MapPin,
    mail: Mail,
    globe: Globe,
    linkedin: Linkedin,
    target: Target,
    users: Users,
    package: Package,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    chevronUp: ChevronUp,
    chevronDown: ChevronDown,
    x: X,
    building: Building2,
    eye: Eye
  };

  ambassador = computed(() => this.store.ambassador());

  constructor() {
    effect(() => {
      const ambassador = this.ambassador();
      if (!ambassador?.email || !ambassador.name) return;

      this.seo.updateEntityPage({
        name: ambassador.name,
        description: ambassador.biography,
        path: `/ambassadors/${encodeURIComponent(ambassador.email)}`,
        image: new ApiImgPipe().transform(ambassador, 'user')
      });
    });
  }

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      this.store.loadAmbassador(email);
    }
  }

  getInitials(name: string): string {
    return getInitials(name);
  }

  getGalleryIndex(productId: string | number): number {
    return this.galleryIndexes().get(productId) ?? 0;
  }

  getVisibleThumbnails(gallery: IImage[], productId: string | number): { image: IImage; actualIndex: number }[] {
    if (!gallery || gallery.length === 0) return [];

    const currentIndex = this.getGalleryIndex(productId);
    const visibleCount = Math.min(3, gallery.length);
    const result: { image: IImage; actualIndex: number }[] = [];

    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % gallery.length;
      result.push({ image: gallery[index], actualIndex: index });
    }

    return result;
  }

  goToImage(productId: string | number, index: number): void {
    const newMap = new Map(this.galleryIndexes());
    newMap.set(productId, index);
    this.galleryIndexes.set(newMap);
  }

  scrollGallery(productId: string | number, direction: 'up' | 'down', galleryLength: number): void {
    const currentIndex = this.getGalleryIndex(productId);
    const newIndex =
      direction === 'down' ? (currentIndex + 1) % galleryLength : (currentIndex - 1 + galleryLength) % galleryLength;
    this.goToImage(productId, newIndex);
  }

  openLightbox(images: IImage[], index: number): void {
    this.lightboxItems.set(
      images.map((image, i) => ({
        src: resolveApiImageUrl(image, 'gallery'),
        alt: `Image ${i + 1}`
      }))
    );
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
  }
}
