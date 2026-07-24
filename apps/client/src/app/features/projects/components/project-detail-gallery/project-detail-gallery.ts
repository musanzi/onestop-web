import { Component, input, signal } from '@angular/core';
import { ApiImgPipe } from '@shared/pipes/api-img.pipe';
import type { IProject } from '@shared/models/entities.models';

@Component({
  selector: 'app-project-detail-gallery',

  imports: [ApiImgPipe],
  templateUrl: './project-detail-gallery.html'
})
export class ProjectDetailGalleryComponent {
  project = input.required<IProject>();
  activeIndex = signal(0);
}
