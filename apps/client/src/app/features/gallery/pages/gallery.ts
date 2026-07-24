import { Component, signal, OnInit } from '@angular/core';
import { GALLERY_IMAGES } from '../data/gallery.data';
import { Image } from 'lucide-angular';
import { GalleryCardComponent } from '../component/gallery-card/gallery-card';
import { GallerySkeleton } from '../component/gallery-skeleton/gallery-skeleton';
import { TranslateModule } from '@ngx-translate/core';
import { PublicPageHero } from '@shared/public';

@Component({
  selector: 'app-gallery',
  imports: [PublicPageHero, GalleryCardComponent, GallerySkeleton, TranslateModule],
  templateUrl: './gallery.html'
})
export class Gallery implements OnInit {
  galleryImages = GALLERY_IMAGES;
  loading = signal(true);

  icons = {
    image: Image
  };

  ngOnInit() {
    setTimeout(() => {
      this.loading.set(false);
    }, 1000);
  }
}
