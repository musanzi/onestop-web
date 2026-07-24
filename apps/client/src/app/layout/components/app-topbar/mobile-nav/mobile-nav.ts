import { Component, input, signal, computed, inject, effect, HostListener, PLATFORM_ID } from '@angular/core';
import { NgOptimizedImage, NgClass, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ILink } from '../../../data/links.data';
import { ApiImgPipe } from '@shared/pipes';
import { AuthStore } from '@core/auth/auth.store';
import { IProgram } from '@shared/models';
import { LanguageSwitcherComponent } from '../../language-switcher/language-switcher';
import { TOPBAR_ICONS, TOPBAR_ANIMATION } from '../topbar.config';
import { LanguageService } from '@core/services/language/language.service';
import { PublicButton } from '@shared/public';

@Component({
  selector: 'app-mobile-nav',
  imports: [
    RouterModule,
    NgOptimizedImage,
    LucideAngularModule,
    ApiImgPipe,
    LanguageSwitcherComponent,
    TranslateModule,
    NgClass,
    PublicButton
  ],
  templateUrl: './mobile-nav.html'
})
export class MobileNav {
  private languageService = inject(LanguageService);
  private platformId = inject(PLATFORM_ID);

  links = input.required<ILink[]>();
  programs = input.required<IProgram[]>();
  onestopUrl = input.required<string>();
  authStore = input.required<InstanceType<typeof AuthStore>>();
  solid = input(false);

  isOpen = signal<boolean>(false);
  programsOpen = signal<boolean>(false);
  openLinkIndex = signal<number | null>(null);

  icons = TOPBAR_ICONS;
  animation = TOPBAR_ANIMATION;

  user = computed(() => this.authStore().user());
  menuButtonClass = computed(() =>
    this.solid() || this.isOpen() ? 'text-gray-900 hover:bg-black/5' : 'text-white hover:bg-white/10'
  );

  translateField = computed(() => {
    const currentLang = this.languageService.currentLanguage();
    return (value: string | null | undefined, fieldName: string, obj: unknown): string => {
      if (!value) return '';
      if (currentLang === 'fr') return value;
      if (obj && fieldName && typeof obj === 'object' && obj !== null) {
        const translatedField = `${fieldName}_${currentLang}`;
        const translatedValue = (obj as Record<string, unknown>)[translatedField];
        return typeof translatedValue === 'string' ? translatedValue : value;
      }
      return value;
    };
  });

  constructor() {
    effect((onCleanup) => {
      if (!isPlatformBrowser(this.platformId) || !this.isOpen()) return;

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      onCleanup(() => {
        document.body.style.overflow = previousOverflow;
      });
    });
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.closeNav();
    }
  }

  toggleNav(): void {
    if (this.isOpen()) {
      this.closeNav();
      return;
    }

    this.isOpen.set(true);
  }

  closeNav(): void {
    this.isOpen.set(false);
    this.openLinkIndex.set(null);
    this.programsOpen.set(false);
  }

  onSignOut(): void {
    this.closeNav();
    this.authStore().signOut();
  }

  toggleLink(index: number): void {
    this.programsOpen.set(false);
    this.openLinkIndex.update((current) => (current === index ? null : index));
  }

  isLinkOpen(index: number): boolean {
    return this.openLinkIndex() === index;
  }

  togglePrograms(): void {
    this.openLinkIndex.set(null);
    this.programsOpen.update((value) => !value);
  }

  getUserInitials(): string {
    const name = this.user()?.name || 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
