import { Component, Input } from '@angular/core';
import { IPartner } from '../../../data/partners.data';

@Component({
  selector: 'app-partner-card',
  templateUrl: './partner-card.html'
})
export class PartnerCard {
  @Input({ required: true }) partner!: IPartner;
}
