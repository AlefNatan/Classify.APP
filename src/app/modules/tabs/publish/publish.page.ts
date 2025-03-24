import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { FormComponent } from 'src/app/shared/form/form.component';
import { EventsService } from 'src/app/shared/services/events.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.page.html',
  styleUrls: ['./publish.page.scss'],
})
export class PublishPage extends FormComponent implements OnInit, OnDestroy {
  public publishFormGroup!: FormGroup;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private eventsService: EventsService,
  ) {
    super();
  }

  ngOnInit() {
    this.createPublishForm();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private createPublishForm() {
    this.publishFormGroup = this.formBuilder.group({
      title: ['', [Validators.required]],
      subtitle: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  public async handleSubmit() {
    if (this.publishFormGroup.valid) {
      await this.loadingService.basicLoading('Publicando post...', true);

      const data = this.publishFormGroup.getRawValue();

      this.postService
        .create(data)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: async () => {
            this.loadingService.dismissLoader();
            await this.toastService.basicToast(
              'Post criado com sucesso.',
              'positive',
            );
            this.publishFormGroup.reset();
            this.eventsService.emitPostUpdate();
          },
          error: async () => {
            this.loadingService.dismissLoader();
            await this.toastService.basicToast(
              'Erro ao publicar o post. Tente novamente mais tarde.',
              'negative',
            );
          },
        });
    } else {
      this.publishFormGroup.markAllAsTouched();
    }
  }
}
