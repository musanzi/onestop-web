import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VenturesStore } from '@features/dashboard/shared/store/ventures.store';
import { IProduct, IImage } from '@shared/models/entities.models';
import { ProductsStore } from '@features/dashboard/shared/store/products.store';
import { GalleryImageUpload } from '@shared/components/gallery-image-upload/gallery-image-upload';
import { ImageLightboxComponent } from '@shared/components/image-lightbox/image-lightbox';
import { ImageLightboxItem } from '@shared/components/image-lightbox/image-lightbox.model';
import { ApiImgPipe, resolveApiImageUrl } from '@shared/pipes/api-img.pipe';
import { ProductGalleryStore } from '@features/dashboard/shared/store/product-gallery.store';
import { FormManager } from '@shared/components/form-manager/form-manager';
import { TranslateModule } from '@ngx-translate/core';
import { Eye, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-product-form',
  providers: [ProductGalleryStore],
  imports: [
    ReactiveFormsModule,
    GalleryImageUpload,
    ApiImgPipe,
    FormManager,
    ImageLightboxComponent,
    TranslateModule,
    LucideAngularModule
  ],
  templateUrl: './product-form.html'
})
export class ProductForm implements OnInit {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  productsStore = inject(ProductsStore);
  venturesStore = inject(VenturesStore);

  isEditMode = signal(false);
  currentSlug: string | null = null;
  product = signal<IProduct | null>(null);
  galleryImages = signal<IImage[]>([]);
  lightboxOpen = signal(false);
  lightboxItems = signal<ImageLightboxItem[]>([]);
  lightboxIndex = signal(0);
  galleryStore = inject(ProductGalleryStore);

  readonly icons = { eye: Eye };

  form = this.fb.group({
    ventureId: ['', Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]]
  });

  constructor() {
    effect(() => {
      const product = this.productsStore.selectedProduct();
      if (product && this.isEditMode() && !this.productsStore.isLoading()) {
        this.product.set(product);
        this.form.patchValue(
          {
            ventureId: product.venture?.id || '',
            name: product.name || '',
            description: product.description || '',
            price: product.price || 0
          },
          { emitEvent: false }
        );

        if (product.gallery?.length) {
          this.galleryImages.set(product.gallery);
        }
      }
    });

    effect(() => {
      const gallery = this.galleryStore.images();
      const loading = this.galleryStore.isLoading();
      if (!loading) {
        this.galleryImages.set(gallery);
      }
    });
  }

  ngOnInit() {
    this.venturesStore.loadAllVentures();
    this.currentSlug = this.route.snapshot.paramMap.get('slug');
    if (this.currentSlug) {
      this.isEditMode.set(true);
      this.productsStore.loadProductBySlug(this.currentSlug);
      this.galleryStore.loadAll(this.currentSlug);
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;

    if (this.isEditMode() && this.currentSlug) {
      this.productsStore.updateProduct({
        slug: this.currentSlug,
        data: formData as Partial<IProduct>
      });
    } else {
      this.productsStore.createProduct(formData as Partial<IProduct> & { ventureId: string });
    }
  }

  handleGalleryLoaded(): void {
    if (!this.currentSlug) {
      return;
    }
    this.galleryStore.loadAll(this.currentSlug);
    this.productsStore.loadProductBySlug(this.currentSlug);
  }

  getGalleryUploadUrl(): string {
    const productId = this.product()?.id;
    return productId ? `products/id/${productId}/gallery` : '';
  }

  removeGalleryImage(imageId: string | number): void {
    this.galleryStore.delete(String(imageId));
  }

  openGalleryLightbox(index: number): void {
    const images = this.galleryImages();
    if (!images.length) {
      return;
    }
    this.lightboxItems.set(
      images.map((image, i) => ({
        src: resolveApiImageUrl(image, 'gallery'),
        alt: `Image galerie ${i + 1}`
      }))
    );
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
  }

  cancel() {
    this.productsStore.resetSelection();
  }
}
