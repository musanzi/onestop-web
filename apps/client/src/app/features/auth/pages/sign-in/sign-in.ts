import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '@environments/environment';
import { validateReturnUrl } from '@core/auth/auth-redirect.util';
import { AuthStore } from '@core/auth/auth.store';
import { AuthCard } from '../../components/auth-card/auth-card';
import { SignInStore } from '../../store/sign-in.store';
import { AuthPanelComponent, ButtonComponent, PasswordFieldComponent, TextfieldComponent } from '@shared/ui';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.html',
  providers: [SignInStore],
  imports: [
    RouterLink,
    ButtonComponent,
    AuthPanelComponent,
    TextfieldComponent,
    PasswordFieldComponent,
    ReactiveFormsModule,
    NgOptimizedImage,
    AuthCard,
    TranslateModule
  ]
})
export class SignIn {
  #formBuilder: FormBuilder = inject(FormBuilder);
  #route = inject(ActivatedRoute);
  #authStore = inject(AuthStore);
  form: FormGroup;
  store = inject(SignInStore);

  constructor() {
    this.form = this.#formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSignIn(): void {
    if (this.form.invalid) return;

    const returnUrl = validateReturnUrl(this.#route.snapshot.queryParams['returnUrl']);

    this.store.signIn({
      payload: this.form.value,
      onSuccess: () => undefined,
      returnUrl
    });
  }

  signinWithGoogle(): void {
    const returnUrl = validateReturnUrl(this.#route.snapshot.queryParams['returnUrl']);
    this.#authStore.setRedirectUrl(returnUrl);
    window.location.replace(environment.apiUrl + 'auth/google');
  }
}
