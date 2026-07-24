import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PARTNERS, PARTNERS_CATEGORIES, IPartner } from '../../data/partners.data';
import { UserPlus, LucideAngularModule, Heart, ShoppingCart, MoveUpRight, MoveRight } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LandingSectionHeader } from '../landing-section-header/landing-section-header';
import { PartnerCard } from './partner-card/partner-card';
import { PublicButton, PublicContainer } from '@shared/public';

@Component({
  selector: 'app-partners',
  imports: [
    CommonModule,
    LucideAngularModule,
    RouterLink,
    TranslateModule,
    LandingSectionHeader,
    PartnerCard,
    PublicContainer,
    PublicButton
  ],
  templateUrl: './partners.html'
})
export class Partners {
  partners = PARTNERS;
  categoryParteners = PARTNERS_CATEGORIES;

  firstRow: IPartner[] = [];
  secondRow: IPartner[] = [];
  firstRowDuplicated: IPartner[] = [];
  secondRowDuplicated: IPartner[] = [];

  icons = {
    userPlus: UserPlus,
    piHeart: Heart,
    shoppingCart: ShoppingCart,
    moveUp: MoveUpRight,
    moveRight: MoveRight
  };

  selectedUserId = 0;

  constructor() {
    this.splitPartnersIntoRows();
  }

  private splitPartnersIntoRows(): void {
    const mid = Math.ceil(this.partners.length / 2);
    this.firstRow = this.partners.slice(0, mid);
    this.secondRow = this.partners.slice(mid);
    this.firstRowDuplicated = [...this.firstRow, ...this.firstRow];
    this.secondRowDuplicated = [...this.secondRow, ...this.secondRow];
  }

  selectPartenerType(type: number) {
    this.selectedUserId = type;
  }
}
