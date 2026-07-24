import { Component, inject } from '@angular/core';
import { Headset, LucideAngularModule, Phone, Mail, MapPin } from 'lucide-angular';
import { CONTACT_ITEMS, SOCIAL_LINKS } from '../data/contact.data';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { COUNTRY_CODE } from '@shared/data/country-item.data';
import { FadeInOnScrollDirective } from '@shared/directives/animations-on-scroll.directive';
import { GENDERS } from '@shared/data/genders.data';
import { ContactUsStore } from '../store/contact-us.store';
import { HeroCard } from '../../../layout/components/hero-card/hero-card';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent, SelectComponent, type UiSelectOption } from '@shared/ui';
import { PublicContainer, PublicSection } from '@shared/public';

@Component({
  selector: 'app-contact-us',
  providers: [ContactUsStore],
  imports: [
    LucideAngularModule,
    FormsModule,
    FadeInOnScrollDirective,
    ReactiveFormsModule,
    ButtonComponent,
    SelectComponent,
    HeroCard,
    TranslateModule,
    PublicSection,
    PublicContainer
  ],
  templateUrl: './contact-us.html'
})
export class ContactUs {
  icons = {
    phone: Headset,
    phoneIcon: Phone,
    mail: Mail,
    mapPin: MapPin
  };
  countryItems = COUNTRY_CODE;
  contactItems = CONTACT_ITEMS;
  #formBuilder: FormBuilder = inject(FormBuilder);
  store = inject(ContactUsStore);
  form: FormGroup;
  selectedCountryCode = '';
  genderItems = GENDERS;
  socialMediaItems = SOCIAL_LINKS;
  countryOptions: UiSelectOption[] = COUNTRY_CODE.map((item) => ({ label: item.name, value: item.name }));

  constructor() {
    this.form = this.#formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.email, Validators.required]],
      phone_number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      country: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  onSelectCountry(value: string | string[] | null): void {
    if (Array.isArray(value)) return;
    this.selectedCountryCode = this.countryItems.find((item) => item.name === value)?.code || '';
  }

  onSubmit() {
    this.store.contactUs({
      payload: {
        ...this.form.value,
        phone_number: this.selectedCountryCode + this.form.value.phone_number
      },
      onSuccess: () => {
        this.form.reset();
        this.selectedCountryCode = '';
      }
    });
  }

  get formattedCountryCode(): string {
    if (!this.selectedCountryCode) return '---';
    return this.selectedCountryCode.toString().startsWith('+')
      ? this.selectedCountryCode
      : `+${this.selectedCountryCode}`;
  }
}
