import { Component, input, OnInit, output, viewChild, inject } from '@angular/core';
import { FilePondComponent, FilePondModule, registerPlugin } from 'ngx-filepond';
import validateType from 'filepond-plugin-file-validate-type';
import validateSize from 'filepond-plugin-file-validate-size';
import imagePreview from 'filepond-plugin-image-preview';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';

registerPlugin(imagePreview, validateType, validateSize);

/**
 * @deprecated Préférer `app-confirmed-image-upload` (1 image) ou `app-gallery-image-upload` (plusieurs).
 */

@Component({
  selector: 'app-file-upload',
  imports: [FilePondModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})
export class FileUpload implements OnInit {
  pond = viewChild<FilePondComponent>('pond');
  name = input.required<string>();
  url = input.required<string>();
  multiple = input<boolean>(false);
  loaded = output<void>();
  pondOptions: Record<string, unknown> = {};
  http = inject(HttpClient);

  ngOnInit(): void {
    const isMultiple = this.multiple();

    this.pondOptions = {
      name: this.name(),
      acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxFileSize: '2MB',
      allowImagePreview: true,
      allowFileSizeValidation: true,
      credits: false,
      instantUpload: true,
      allowRemove: true,
      allowRevert: false,
      allowMultiple: isMultiple,
      maxFiles: isMultiple ? 10 : 1,
      stylePanelLayout: isMultiple ? 'integrated' : 'compact',
      imagePreviewHeight: isMultiple ? 140 : 160,
      labelMaxFileSizeExceeded: 'Fichier trop volumineux (max. 2 Mo)',
      labelMaxFileSize: 'Taille max. : 2 Mo',
      labelFileProcessing: 'Téléversement…',
      labelFileProcessingComplete: 'Terminé',
      labelFileProcessingError: 'Erreur',
      labelTapToCancel: 'Annuler',
      labelTapToRetry: 'Réessayer',
      labelTapToUndo: 'Annuler',
      labelIdle: `
        <div class="filepond-custom-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5d9c46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M20 16.58A5 5 0 0 1 18 7h-1.26A8 8 0 1 0 4 16.25"/><path d="M8 16h8"/></svg>
          <p style="margin: 8px 0; font-weight: 600; color: #2b4225;">Glissez-déposez votre image ici</p>
          <p style="margin: 0; font-size: 14px; color: #7cb764;">ou <span style="color: #5d9c46; text-decoration: underline;">parcourir</span></p>
        </div>
      `,
      server: {
        process: (
          _fieldName: string,
          file: File,
          _metadata: unknown,
          load: (p: string | Record<string, unknown>) => void,
          error: (errorText: string) => void,
          progress: (computable: boolean, loadedSize: number, totalSize: number) => void,
          abort: () => void
        ) => {
          const formData = new FormData();
          formData.append(this.name(), file, file.name);

          const request = this.http
            .post<{ cover?: string; logo?: string; image?: string; id?: string }>(this.url(), formData, {
              reportProgress: true,
              observe: 'events'
            })
            .subscribe({
              next: (event: HttpEvent<{ cover?: string; logo?: string; image?: string; id?: string }>) => {
                if (event.type === HttpEventType.Response) {
                  const response = event.body;
                  const fileId = response?.cover || response?.logo || response?.image || response?.id || file.name;
                  load(fileId);
                  this.clearPondFiles(isMultiple);
                  this.loaded.emit();
                } else if (event.type === HttpEventType.UploadProgress && event.total) {
                  progress(true, event.loaded, event.total);
                }
              },
              error: () => {
                error('Erreur lors du téléchargement');
              }
            });

          return {
            abort: () => {
              request.unsubscribe();
              abort();
            }
          };
        }
      }
    };
  }

  private clearPondFiles(immediate: boolean): void {
    const delay = immediate ? 400 : 3000;
    setTimeout(() => {
      this.pond()?.['pond']?.removeFiles();
    }, delay);
  }
}
