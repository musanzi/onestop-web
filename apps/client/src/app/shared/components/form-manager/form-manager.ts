import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '@shared/ui';
import { ArrowLeft, ArrowRight, Check, LucideAngularModule } from 'lucide-angular';

export interface FormManagerSubmittedPayload {
  value: unknown;
  rawValue: unknown;
}

export interface StepConfig {
  label: string;
  controls: string[];
}

@Component({
  selector: 'app-form-manager',
  imports: [ReactiveFormsModule, ButtonComponent, LucideAngularModule],
  templateUrl: './form-manager.html'
})
export class FormManager implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  @Input() steps?: StepConfig[];
  @Input() messages?: string[];
  @Input() loading = false;
  @Input() stickyProgress = false;
  @Input() showProgress = true;

  @Output() submitted = new EventEmitter<FormManagerSubmittedPayload>();
  @Output() stepChanged = new EventEmitter<number>();

  readonly #tick = signal(0);
  readonly #destroyRef = inject(DestroyRef);
  readonly currentStep = signal(0);

  icons = {
    arrowLeft: ArrowLeft,
    arrowRight: ArrowRight,
    check: Check
  };

  readonly isStepper = computed(() => !!this.steps && this.steps.length > 1);
  readonly totalSteps = computed(() => this.steps?.length ?? 1);
  readonly canGoNext = computed(() => {
    this.validControls();
    return this.currentStep() < this.totalSteps() - 1 && this.isCurrentStepValid();
  });
  readonly canGoPrev = computed(() => this.currentStep() > 0);
  readonly isLastStep = computed(() => this.currentStep() === this.totalSteps() - 1);

  readonly totalControls = computed(() => {
    this.#tick();
    const f = this.form;
    if (!f) return 0;
    return this.#countControls(f);
  });

  readonly validControls = computed(() => {
    this.#tick();
    const f = this.form;
    if (!f) return 0;
    return this.#countValidControls(f);
  });

  readonly progressPercent = computed(() => {
    const total = this.totalControls();
    if (!total) return 0;
    const valid = this.validControls();
    return Math.round((valid / total) * 100);
  });

  readonly currentMessage = computed(() => {
    const customMessages = this.messages;
    if (customMessages?.length) {
      const idx = Math.min(
        customMessages.length - 1,
        Math.floor((this.progressPercent() / 100) * customMessages.length)
      );
      return customMessages[idx] ?? customMessages[customMessages.length - 1];
    }

    const pct = this.progressPercent();
    if (pct === 0) return 'Commencez par remplir les premiers champs.';
    if (pct < 50) return 'Bon début — continuez comme ça.';
    if (pct < 90) return 'On y est presque — encore quelques détails.';
    if (pct < 100) return 'Parfait — vous pouvez soumettre le formulaire.';
    return 'Formulaire complet.';
  });

  readonly progressGradient = computed(() => {
    const pct = this.progressPercent();
    if (pct === 0) return '#9ca3af';
    if (pct <= 25) return '#ef4444';
    if (pct <= 50) return '#f97316';
    if (pct <= 75) return '#eab308';
    return '#22c55e';
  });

  readonly progressTextColor = computed(() => {
    const pct = this.progressPercent();
    if (pct === 0) return '#4b5563';
    if (pct <= 25) return '#dc2626';
    if (pct <= 50) return '#ea580c';
    if (pct <= 75) return '#ca8a04';
    return '#15803d';
  });

  ngOnInit(): void {
    if (!this.form) return;
    this.form.valueChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.#tick.update((v) => v + 1);
    });

    this.form.statusChanges.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
      this.#tick.update((v) => v + 1);
    });
  }

  nextStep(): void {
    if (!this.canGoNext()) return;
    this.currentStep.update((v) => v + 1);
    this.stepChanged.emit(this.currentStep());
    this.#scrollToTop();
  }

  prevStep(): void {
    if (!this.canGoPrev()) return;
    this.currentStep.update((v) => v - 1);
    this.stepChanged.emit(this.currentStep());
    this.#scrollToTop();
  }

  goToStep(index: number): void {
    if (index < 0 || index >= this.totalSteps()) return;
    // Permettre navigation uniquement vers les étapes précédentes ou si toutes les précédentes sont valides
    if (index <= this.currentStep() || this.#areAllPreviousStepsValid(index)) {
      this.currentStep.set(index);
      this.stepChanged.emit(this.currentStep());
      this.#scrollToTop();
    }
  }

  isCurrentStepValid(): boolean {
    if (!this.isStepper() || !this.steps) return this.form.valid;
    const step = this.steps[this.currentStep()];
    if (!step) return true;
    return step.controls.every((controlName) => {
      const control = this.form.get(controlName);
      return control ? control.valid : true;
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.loading) return;
    if (!this.form) return;

    this.form.markAllAsTouched();
    this.#tick.update((v) => v + 1);

    if (this.form.invalid) return;

    this.submitted.emit({
      value: this.form.value,
      rawValue: this.form.getRawValue()
    });
  }

  #areAllPreviousStepsValid(targetIndex: number): boolean {
    if (!this.steps) return true;
    for (let i = 0; i < targetIndex; i++) {
      const step = this.steps[i];
      const allValid = step.controls.every((controlName) => {
        const control = this.form.get(controlName);
        return control ? control.valid : true;
      });
      if (!allValid) return false;
    }
    return true;
  }

  #scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  #countControls(control: AbstractControl): number {
    if (control instanceof FormGroup || control instanceof FormArray) {
      return Object.values(control.controls).reduce(
        (count, childControl) => count + this.#countControls(childControl),
        0
      );
    }

    return this.#shouldTrackControl(control) ? 1 : 0;
  }

  #countValidControls(control: AbstractControl): number {
    if (control instanceof FormGroup || control instanceof FormArray) {
      return Object.values(control.controls).reduce(
        (count, childControl) => count + this.#countValidControls(childControl),
        0
      );
    }

    return this.#shouldTrackControl(control) && !control.disabled && control.valid ? 1 : 0;
  }

  #shouldTrackControl(control: AbstractControl): boolean {
    if (control.hasValidator?.(Validators.required)) {
      return true;
    }
    return this.#hasValue(control);
  }

  #hasValue(control: AbstractControl): boolean {
    const value = control.value;
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return true;
  }
}
