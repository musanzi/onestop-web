import { Component, inject, input, OnDestroy, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Eye, ImagePlus, LucideAngularModule, Trash2, Upload } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ImageLightboxComponent } from '../image-lightbox/image-lightbox';
import { ImageLightboxItem } from '../image-lightbox/image-lightbox.model';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export type ConfirmedImagePreviewShape = 'circle' | 'landscape' | 'square';

@Component({
  selector: 'app-confirmed-image-upload, app-profile-image-upload',
  imports: [LucideAngularModule, TranslateModule, ImageLightboxComponent],
  templateUrl: './confirmed-image-upload.html',
  styleUrl: './confirmed-image-upload.css'
})
export class ConfirmedImageUpload implements OnDestroy {
  name = input('image');
  url = input.required<string>();
  maxSizeMb = input(2);
  previewShape = input<ConfirmedImagePreviewShape>('circle');
  chooseTitle = input('Choisir une image');
  confirmLabel = input("Confirmer l'image");
  previewAlt = input('Aperçu');
  loaded = output<void>();

  private http = inject(HttpClient);

  pendingFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  uploading = signal(false);
  error = signal<string | null>(null);
  dragOver = signal(false);
  lightboxOpen = signal(false);
  lightboxItems = signal<ImageLightboxItem[]>([]);

  icons = {
    upload: Upload,
    imagePlus: ImagePlus,
    trash: Trash2,
    eye: Eye
  };

  openPreview(): void {
    const url = this.previewUrl();
    if (!url) {
      return;
    }
    this.lightboxItems.set([{ src: url, alt: this.previewAlt(), caption: this.pendingFile()?.name }]);
    this.lightboxOpen.set(true);
  }

  ngOnDestroy(): void {
    this.revokePreview();
  }

  onFileInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    if (file) {
      this.setPendingFile(file);
    }
    inputEl.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.setPendingFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(true);
  }

  onDragLeave(): void {
    this.dragOver.set(false);
  }

  clearPending(): void {
    this.revokePreview();
    this.pendingFile.set(null);
    this.error.set(null);
  }

  async upload(): Promise<void> {
    const file = this.pendingFile();
    const uploadUrl = this.url();
    if (!file || !uploadUrl) {
      return;
    }

    this.uploading.set(true);
    this.error.set(null);

    try {
      const formData = new FormData();
      formData.append(this.name(), file, file.name);
      await firstValueFrom(this.http.post(uploadUrl, formData));
      this.clearPending();
      this.loaded.emit();
    } catch {
      this.error.set('Erreur lors du téléversement. Réessayez.');
    } finally {
      this.uploading.set(false);
    }
  }

  private setPendingFile(file: File): void {
    const maxBytes = this.maxSizeMb() * 1024 * 1024;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      this.error.set('Format non accepté (JPG, PNG ou WEBP uniquement)');
      return;
    }
    if (file.size > maxBytes) {
      this.error.set(`Fichier trop volumineux (max. ${this.maxSizeMb()} Mo)`);
      return;
    }

    this.revokePreview();
    this.pendingFile.set(file);
    this.previewUrl.set(URL.createObjectURL(file));
    this.error.set(null);
  }

  private revokePreview(): void {
    const url = this.previewUrl();
    if (url) {
      URL.revokeObjectURL(url);
    }
    this.previewUrl.set(null);
  }
}

/** @deprecated Utiliser ConfirmedImageUpload */
export { ConfirmedImageUpload as ProfileImageUpload };
