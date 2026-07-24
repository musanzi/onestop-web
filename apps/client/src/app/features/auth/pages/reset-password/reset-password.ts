import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthCard } from '../../components/auth-card/auth-card';
import { ResetPasswordStore } from '../../store/reset-password.store';
import { AuthPanelComponent, ButtonComponent, PasswordFieldComponent } from '@shared/ui';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  providers: [ResetPasswordStore],
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ButtonComponent,
    AuthPanelComponent,
    PasswordFieldComponent,
    AuthCard,
    TranslateModule
  ]
})
export class ResetPassword {
  #token = inject(ActivatedRoute).snapshot.queryParams['token'];
  #formBuilder = inject(FormBuilder);
  form: FormGroup;
  store = inject(ResetPasswordStore);

  constructor() {
    this.form = this.#formBuilder.group({
      password: ['', Validators.required],
      password_confirm: ['', Validators.required]
    });
  }

  onResetPassword(): void {
    if (this.form.invalid) return;
    this.form.disable();
    const { password, password_confirm } = this.form.value;
    const payload = { token: this.#token, password, password_confirm };
    this.store.resetPassword(payload);
    this.form.enable();
  }
}
