import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { validateReturnUrl } from '@core/auth/auth-redirect.util';
import { LucideAngularModule, Lock, LogIn, UserPlus, X } from 'lucide-angular';

@Component({
  selector: 'app-auth-required-modal',

  imports: [LucideAngularModule],
  templateUrl: './auth-required-modal.html'
})
export class AuthRequiredModalComponent {
  private readonly router = inject(Router);

  isOpen = input.required<boolean>();
  returnUrl = input<string>('/');
  message = input<string>('Cette action nécessite une connexion. Connectez-vous ou créez un compte pour continuer.');

  closed = output<void>();

  icons = {
    lock: Lock,
    logIn: LogIn,
    userPlus: UserPlus,
    x: X
  };

  goToSignIn(): void {
    const url = validateReturnUrl(this.returnUrl());
    this.router.navigate(['/sign-in'], { queryParams: { returnUrl: url } });
    this.closed.emit();
  }

  goToSignUp(): void {
    this.router.navigate(['/sign-up']);
    this.closed.emit();
  }

  onBackdropClick(): void {
    this.closed.emit();
  }
}
