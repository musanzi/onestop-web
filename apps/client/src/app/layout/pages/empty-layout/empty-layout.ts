import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackButton } from '@shared/components/back-button/back-button';

@Component({
  selector: 'app-empty-layout',
  templateUrl: './empty-layout.html',
  imports: [RouterOutlet, BackButton]
})
export class EmptyLayout {}
