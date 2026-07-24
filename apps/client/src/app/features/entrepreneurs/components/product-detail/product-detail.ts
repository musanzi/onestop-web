import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Eye, X, ChevronLeft, ChevronRight, Package, MoveRight } from 'lucide-angular';
import { PublicProductStore } from '../../store/product.store';
import { ProductDetailSkeleton } from '../product-detail-skeleton/product-detail-skeleton';
import { ApiImgPipe, resolveApiImageUrl } from '@shared/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { IImage } from '@shared/models';
import { ImageLightboxComponent } from '@shared/components/image-lightbox/image-lightbox';
import { ImageLightboxItem } from '@shared/components/image-lightbox/image-lightbox.model';
import { SeoService } from '@core/services/seo';

@Component({
  selector: 'app-product-detail',
  providers: [PublicProductStore],
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    ApiImgPipe,
    ProductDetailSkeleton,
    TranslateModule,
    ImageLightboxComponent
  ],
  templateUrl: './product-detail.html'
})
export class ProductDetail implements OnInit {
  store = inject(PublicProductStore);
  route = inject(ActivatedRoute);
  seo = inject(SeoService);

  lightboxOpen = signal(false);
  lightboxItems = signal<ImageLightboxItem[]>([]);
  lightboxIndex = signal(0);
  product = computed(() => this.store.product());

  icons = {
    eye: Eye,
    x: X,
    chevronLeft: ChevronLeft,
    chevronRight: ChevronRight,
    package: Package,
    moveRight: MoveRight
  };

  constructor() {
    effect(() => {
      const product = this.product();
      if (!product?.slug || !product.name) return;

      const ventureSlug = product.venture?.slug;
      this.seo.updateEntityPage({
        name: product.name,
        description: product.description,
        path: ventureSlug
          ? `/entrepreneurs/venture/${ventureSlug}/${product.slug}`
          : `/entrepreneurs/venture/${product.slug}`,
        image: new ApiImgPipe().transform(product.gallery?.[0] ?? product, 'product')
      });
    });
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug'];
    this.store.loadProduct(slug);
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
