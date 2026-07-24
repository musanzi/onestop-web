import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, AlertCircle, Search, Home, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-project-detail-error',

  imports: [RouterLink, TranslateModule, LucideAngularModule],
  templateUrl: './project-detail-error.html'
})
export class ProjectDetailErrorComponent {
  icons = { alertCircle: AlertCircle, search: Search, home: Home, arrowLeft: ArrowLeft };
}
