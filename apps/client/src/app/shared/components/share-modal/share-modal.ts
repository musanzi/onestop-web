import { Component, input, output } from '@angular/core';
import { shareToSocial } from '@shared/helpers/social-share.helper';
import { LucideAngularModule, X, Copy, MessageCircle, Linkedin, Facebook, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-share-modal',

  imports: [LucideAngularModule],
  templateUrl: './share-modal.html'
})
export class ShareModalComponent {
  link = input.required<string>();
  shareMessage = input.required<string>();
  referralCount = input.required<number>();

  closeModal = output<void>();
  copied = output<void>();

  // Icônes Lucide
  icons = {
    x: X,
    copy: Copy,
    messageCircle: MessageCircle,
    linkedin: Linkedin,
    facebook: Facebook,
    chevronRight: ChevronRight
  };

  shareOn(platform: 'whatsapp' | 'linkedin' | 'facebook') {
    shareToSocial({
      platform,
      link: this.link(),
      referralCount: this.referralCount()
    });
    this.closeModal.emit();
  }

  onCopy() {
    navigator.clipboard.writeText(this.link()).then(() => {
      this.copied.emit();
    });
  }
}
