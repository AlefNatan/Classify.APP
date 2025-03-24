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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends FormComponent implements OnInit, OnDestroy {
  public LoginFormGroup!: FormGroup;

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
    this.createLoginForm();
  }

  async ionViewWillEnter() {
    await this.storageService.get('rememberMe').then((res: any) => {
      if (res != null && res != undefined) {
        this.LoginFormGroup.controls['email'].setValue(res.email);
        this.LoginFormGroup.controls['password'].setValue(res.password);
        this.LoginFormGroup.controls['remember'].setValue(true);
      } else {
        this.LoginFormGroup.controls['remember'].setValue(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private createLoginForm() {
    this.LoginFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      remember: [false],
    });
  }

  public async handleSubmit() {
    if (this.LoginFormGroup.valid) {
      await this.loadingService.basicLoading('Um momento...', true);

      const data = this.LoginFormGroup.getRawValue();

      this.authService
        .signIn(data)
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

            const rememberUserData = data.remember;
            if (rememberUserData === true)
              await this.storageService.set('rememberMe', data);
            else await this.storageService.remove('rememberMe');

            this.loadingService.dismissLoader();
            this.router.navigate(['tabs']);
          },
          error: async (error) => {
            console.log(error);
            this.loadingService.dismissLoader();
            await this.toastService.basicToast(
              error.message ||
                'Ocorreu um erro ao se conectar ao serviço, tente novamente mais tarde.',
              'negative',
            );
          },
          complete: () => {
            this.loadingService.dismissLoader();
            this.LoginFormGroup.reset();
          },
        });
    } else {
      this.LoginFormGroup.markAllAsTouched();
    }
  }
}
