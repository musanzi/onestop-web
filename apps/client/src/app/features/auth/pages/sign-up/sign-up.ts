import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { AuthCard } from '../../components/auth-card/auth-card';
import { SignUpStore } from '../../store/sign-up.store';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { validateReturnUrl } from '@core/auth/auth-redirect.util';
import { TranslateModule } from '@ngx-translate/core';
import { AuthPanelComponent, ButtonComponent, PasswordFieldComponent, TextfieldComponent } from '@shared/ui';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.html',
  providers: [SignUpStore],
  imports: [
    ButtonComponent,
    AuthPanelComponent,
    TextfieldComponent,
    PasswordFieldComponent,
    RouterLink,
    ReactiveFormsModule,
    AuthCard,
    TranslateModule
  ]
})
export class SignUp {
  #formBuilder: FormBuilder = inject(FormBuilder);
  #route = inject(ActivatedRoute);
  form: FormGroup;
  store = inject(SignUpStore);
  ref = this.#route.snapshot.queryParams['ref'] || null;

  constructor() {
    this.form = this.#formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password_confirm: ['', [Validators.required, Validators.minLength(6)]]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirm = control.get('password_confirm');

    if (!password || !passwordConfirm) {
      return null;
    }

    if (!passwordConfirm.touched) {
      return null;
    }

    if (password.value !== passwordConfirm.value) {
      passwordConfirm.setErrors({ ...passwordConfirm.errors, passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (passwordConfirm.hasError('passwordMismatch')) {
      const errors = { ...passwordConfirm.errors };
      delete errors['passwordMismatch'];
      passwordConfirm.setErrors(Object.keys(errors).length > 0 ? errors : null);
    }

    return null;
  }

  onSignUp(): void {
    if (this.form.invalid) return;

    const { name, email, password } = this.form.getRawValue();
    const returnUrl = validateReturnUrl(this.#route.snapshot.queryParams['returnUrl']);

    this.store.signUp({
      payload: {
        name: name.trim(),
        email,
        password,
        ...(this.ref ? { referral_code: this.ref } : {})
      },
      returnUrl
    });
  }
}
