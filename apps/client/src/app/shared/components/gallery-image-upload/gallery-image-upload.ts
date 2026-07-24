import { Component, inject, input, OnDestroy, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Eye, ImagePlus, LucideAngularModule, Trash2, Upload } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ImageLightboxComponent } from '../image-lightbox/image-lightbox';
import { ImageLightboxItem } from '../image-lightbox/image-lightbox.model';

interface PendingImage {
  id: string;
  file: File;
  previewUrl: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-gallery-image-upload',
  imports: [LucideAngularModule, TranslateModule, ImageLightboxComponent],
  templateUrl: './gallery-image-upload.html',
  styleUrl: './gallery-image-upload.css'
})
export class GalleryImageUpload implements OnDestroy {
  name = input('image');
  url = input.required<string>();
  maxSizeMb = input(2);
  loaded = output<void>();

  private http = inject(HttpClient);

  pending = signal<PendingImage[]>([]);
  uploading = signal(false);
  error = signal<string | null>(null);
  dragOver = signal(false);
  lightboxOpen = signal(false);
  lightboxItems = signal<ImageLightboxItem[]>([]);
  lightboxIndex = signal(0);

  icons = {
    upload: Upload,
    imagePlus: ImagePlus,
    trash: Trash2,
    eye: Eye
  };

  openPreview(index: number): void {
    const items = this.pending().map((item) => ({
      src: item.previewUrl,
      alt: item.file.name
    }));
    if (!items.length) {
      return;
    }
    this.lightboxItems.set(items);
    this.lightboxIndex.set(index);
    this.lightboxOpen.set(true);
  }

  ngOnDestroy(): void {
    this.revokeAllPreviews();
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.addFiles(Array.from(input.files));
    }
    input.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    if (event.dataTransfer?.files?.length) {
      this.addFiles(Array.from(event.dataTransfer.files));
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave(): void {
    this.dragOver.set(false);
  }

  addFiles(files: File[]): void {
    const maxBytes = this.maxSizeMb() * 1024 * 1024;
    const next = [...this.pending()];
    let hasError = false;

    for (const file of files) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        this.error.set('Format non accepté (JPG, PNG ou WEBP uniquement)');
        hasError = true;
        continue;
      }
      if (file.size > maxBytes) {
        this.error.set(`Fichier trop volumineux (max. ${this.maxSizeMb()} Mo)`);
        hasError = true;
        continue;
      }
      next.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }

    if (!hasError) {
      this.error.set(null);
    }
    this.pending.set(next);
  }

  removePending(id: string): void {
    const item = this.pending().find((p) => p.id === id);
    if (item) {
      URL.revokeObjectURL(item.previewUrl);
    }
    this.pending.update((list) => list.filter((p) => p.id !== id));
    if (this.pending().length === 0) {
      this.error.set(null);
    }
  }

  clearAll(): void {
    this.revokeAllPreviews();
    this.pending.set([]);
    this.error.set(null);
  }

  async uploadAll(): Promise<void> {
    const items = this.pending();
    const uploadUrl = this.url();
    if (!items.length || !uploadUrl) {
      return;
    }

    this.uploading.set(true);
    this.error.set(null);

    try {
      for (const item of items) {
        const formData = new FormData();
        formData.append(this.name(), item.file, item.file.name);
        await firstValueFrom(this.http.post(uploadUrl, formData));
      }
      this.clearAll();
      this.loaded.emit();
    } catch {
      this.error.set('Erreur lors du téléversement. Réessayez.');
    } finally {
      this.uploading.set(false);
    }
  }

  private revokeAllPreviews(): void {
    this.pending().forEach((p) => URL.revokeObjectURL(p.previewUrl));
  }
}
