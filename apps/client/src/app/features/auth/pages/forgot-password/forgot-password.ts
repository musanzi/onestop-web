import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthCard } from '../../components/auth-card/auth-card';
import { ForgotPasswordStore } from '../../store/forgot-password.store';
import { TranslateModule } from '@ngx-translate/core';
import { AuthPanelComponent, ButtonComponent, TextfieldComponent } from '@shared/ui';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  providers: [ForgotPasswordStore],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ButtonComponent,
    AuthPanelComponent,
    TextfieldComponent,
    AuthCard,
    TranslateModule
  ]
})
export class ForgotPassword {
  #formBuilder = inject(FormBuilder);
  form: FormGroup;
  store = inject(ForgotPasswordStore);

  constructor() {
    this.form = this.#formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onForgotPassword(): void {
    if (!this.form.invalid) {
      this.form.disable();
      this.store.forgotPassword(this.form.value);
      this.form.enable();
    }
  }
}
