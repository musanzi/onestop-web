import { Component, inject, signal, effect, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthStore } from '@core/auth/auth.store';
import { isProfileIncomplete } from '@core/auth/profile.util';
import { IUser, UserStatus } from '@shared/models/entities.models';
import { UpdateInfoStore } from '@features/dashboard/shared/store/update-info.store';
import { UpdateInfoDto } from '@features/dashboard/shared/dto/update-info.dto';
import { ConfirmedImageUpload } from '@shared/components/confirmed-image-upload/confirmed-image-upload';
import { ApiImgPipe } from '@shared/pipes';
import { FormManager } from '@shared/components/form-manager/form-manager';
import { SectionCardComponent, SelectComponent, type UiSelectOption } from '@shared/ui';
import {
  Badge,
  BadgeCheck,
  Building2,
  Cake,
  CheckCircle,
  CircleX,
  Clock3,
  FileText,
  Globe,
  GraduationCap,
  Info,
  LayoutDashboard,
  LucideAngularModule,
  Mail,
  Network,
  Phone,
  Rocket,
  Save,
  SquarePen,
  Star,
  User,
  Users,
  VenusAndMars,
  X
} from 'lucide-angular';

function toDateInputValue(value: Date | string | null | undefined): string {
  if (!value) {
    return '';
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    ConfirmedImageUpload,
    ApiImgPipe,
    FormManager,
    LucideAngularModule,
    SelectComponent,
    SectionCardComponent
  ],
  providers: [UpdateInfoStore],
  templateUrl: './profile.html'
})
export class ProfilePage {
  authStore = inject(AuthStore);
  updateInfoStore = inject(UpdateInfoStore);
  fb = inject(FormBuilder);
  router = inject(Router);
  #route = inject(ActivatedRoute);
  #shouldCompleteProfile = this.#route.snapshot.queryParamMap.get('completeProfile') === '1';

  icons = {
    badge: Badge,
    birthDate: Cake,
    cancel: CircleX,
    checkCircle: CheckCircle,
    city: Building2,
    close: X,
    country: Globe,
    dashboard: LayoutDashboard,
    description: FileText,
    edit: SquarePen,
    email: Mail,
    gender: VenusAndMars,
    info: Info,
    network: Network,
    phone: Phone,
    profile: User,
    rocketLaunch: Rocket,
    save: Save,
    schedule: Clock3,
    school: GraduationCap,
    star: Star,
    users: Users,
    verified: BadgeCheck
  };

  isEditing = signal(false);
  showProfileCompletionBanner = signal(false);

  user = computed(() => this.authStore.user());
  hasMentorProfile = computed(() => !!this.user()?.mentor_profile);
  mentorStatus = computed(() => this.user()?.mentor_profile?.status || null);
  isSaving = computed(() => this.updateInfoStore.isLoading());
  formLoading = computed(() => this.authStore.isLoading() || this.isSaving());

  statusOptions: UiSelectOption[] = [
    { label: 'Entrepreneur', value: UserStatus.ENTREPRENEUR },
    { label: 'Investisseur', value: UserStatus.INVESTOR },
    { label: 'Partenaire', value: UserStatus.PARTNER },
    { label: 'Autre', value: UserStatus.OTHER }
  ];

  profileForm = this.fb.group({
    name: ['', Validators.required],
    biography: [''],
    status: [null as UserStatus | null],
    phone_number: [''],
    city: [''],
    country: [''],
    gender: [''],
    birth_date: ['']
  });

  constructor() {
    effect(() => {
      const user = this.user();
      if (!user) {
        return;
      }

      const needsCompletion = this.#shouldCompleteProfile || isProfileIncomplete(user);
      this.showProfileCompletionBanner.set(needsCompletion);

      if (needsCompletion && !this.isEditing()) {
        this.isEditing.set(true);
      }

      if (!this.isEditing()) {
        this.patchFormFromUser(user);
        this.profileForm.disable({ emitEvent: false });
      } else {
        this.profileForm.enable({ emitEvent: false });
      }
    });
  }

  toggleEdit(): void {
    this.isEditing.update((v) => !v);
    if (this.isEditing()) {
      this.profileForm.enable({ emitEvent: false });
    } else {
      const user = this.user();
      if (user) {
        this.patchFormFromUser(user);
      }
      this.profileForm.disable({ emitEvent: false });
    }
  }

  getUploadUrl(): string {
    return 'users/me/profile-image';
  }

  handlePhotoLoaded(): void {
    void this.authStore.getProfile();
  }

  saveProfile(): void {
    const user = this.user();

    if (this.profileForm.invalid || !user || this.isSaving()) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValue = this.profileForm.getRawValue();

    const payload: UpdateInfoDto = {
      email: user.email ?? '',
      address: (user as IUser & { address?: string }).address ?? '',
      phone_number: formValue.phone_number ?? '',
      gender: formValue.gender ?? '',
      name: formValue.name ?? user.name ?? '',
      birth_date: formValue.birth_date
        ? new Date(`${formValue.birth_date}T12:00:00`)
        : user.birth_date
          ? new Date(user.birth_date)
          : new Date(),
      country: formValue.country ?? '',
      city: formValue.city ?? '',
      biography: formValue.biography ?? '',
      status: formValue.status ?? null
    };

    this.updateInfoStore.updateInfo(payload);

    this.isEditing.set(false);
    this.profileForm.disable({ emitEvent: false });
    this.showProfileCompletionBanner.set(false);

    if (this.#route.snapshot.queryParamMap.has('completeProfile')) {
      void this.router.navigate([], {
        relativeTo: this.#route,
        queryParams: { completeProfile: null },
        queryParamsHandling: 'merge',
        replaceUrl: true
      });
    }
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    const user = this.user();
    if (user) {
      this.patchFormFromUser(user);
    }
    this.profileForm.disable({ emitEvent: false });
  }

  applyAsMentor(): void {
    void this.router.navigate(['/dashboard/user/mentor/apply']);
  }

  goToMentorDashboard(): void {
    void this.router.navigate(['/dashboard/mentor']);
  }

  private patchFormFromUser(user: IUser): void {
    this.profileForm.patchValue(
      {
        name: user.name,
        biography: user.biography || '',
        status: user.status ?? null,
        phone_number: user.phone_number || '',
        city: user.city || '',
        country: user.country || '',
        gender: user.gender || '',
        birth_date: toDateInputValue(user.birth_date)
      },
      { emitEvent: false }
    );
  }
}
