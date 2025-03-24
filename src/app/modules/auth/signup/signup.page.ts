import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';

import { AuthService } from 'src/app/services';

import { FormComponent } from 'src/app/shared/form/form.component';

import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage extends FormComponent implements OnInit, OnDestroy {
  public SignupFormGroup!: FormGroup;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private storageService: StorageService,
  ) {
    super();
  }

  ngOnInit() {
    this.createSignupForm();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private createSignupForm() {
    this.SignupFormGroup = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      { validator: this.passwordMatchValidator },
    );
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  public async handleSubmit() {
    if (this.SignupFormGroup.valid) {
      await this.loadingService.basicLoading('Um momento...', true);

      const data = this.SignupFormGroup.getRawValue();
      delete data.confirmPassword;

      this.authService
        .signUp(data)
        .pipe(
          takeUntil(this.ngUnsubscribe),
          catchError((error) => {
            return throwError(() => error);
          }),
        )
        .subscribe({
          next: async (response) => {
            await this.storageService.clear().then(async () => {
              await this.storageService.set('token', response);
              await this.storageService.set('isAuthenticated', true);
            });

            this.loadingService.dismissLoader();
            await this.toastService.basicToast(
              'Conta criada com sucesso!',
              'positive',
            );
          },
          error: async (error) => {
            this.loadingService.dismissLoader();
            await this.toastService.basicToast(
              error.error?.message ||
                'Ocorreu um erro ao criar sua conta, tente novamente mais tarde.',
              'negative',
            );
          },
          complete: () => {
            this.loadingService.dismissLoader();
            this.SignupFormGroup.reset();
          },
        });
    } else {
      this.SignupFormGroup.markAllAsTouched();
    }
  }
}
