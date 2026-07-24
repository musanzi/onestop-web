import { Component } from '@angular/core';
import { Programs } from '@features/landing/components/programs/programs';

@Component({
  selector: 'app-list-programs',
  imports: [Programs],
  template: `<div class="pt-28 lg:pt-32"><app-programs /></div>`
})
export class ListPrograms {}
