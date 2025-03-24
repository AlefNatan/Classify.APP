import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AlertController } from '@ionic/angular';

import { PostService } from 'src/app/services/post.service';
import { EventsService } from 'src/app/shared/services/events.service';

import type { Post } from 'src/app/types/response/post.response';

import { StorageService } from 'src/app/shared/services/storage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  public posts: Post[] = [];
  public isLoading = false;
  public hasMore = true;
  public isLoadingPosts = true;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,

    private postService: PostService,
    private eventsService: EventsService,

    private storageService: StorageService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.loadPosts();
    this.listenToPostUpdates();
  }

  ionViewWillEnter() {
    this.loadPosts();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public loadPosts(event?: any) {
    if (!this.hasMore || this.isLoading) {
      event?.target?.complete();
      return;
    }

    this.isLoading = true;

    this.postService
      .getMyPosts()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => {
          this.posts = [...this.posts, ...response.items];
          this.hasMore = false;
          this.isLoading = false;
          event?.target?.complete();
        },
        error: async () => {
          this.isLoading = false;
          event?.target?.complete();
          await this.toastService.basicToast(
            'Erro ao carregar posts. Tente novamente mais tarde.',
            'negative',
          );
        },
      });
  }

  private listenToPostUpdates() {
    this.eventsService.postUpdate$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.posts = [];
        this.hasMore = true;
        this.loadPosts();
      });
  }

  async handleLogout() {
    await this.storageService.clear();
    this.router.navigate(['/auth/login']);

    await this.toastService.basicToast(
      'Logout realizado com sucesso!',
      'positive',
    );
  }

  public async handleRefresh(event: any) {
    this.posts = [];
    this.hasMore = true;
    await this.loadPosts();
    event.target.complete();
  }

  public onScroll(event: any) {
    this.loadPosts();
    event.target.complete();
  }

  public async handleDeletePost(postId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este post?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.deletePost(postId);
          },
        },
      ],
    });

    await alert.present();
  }

  private async deletePost(postId: number) {
    await this.loadingService.basicLoading('Excluindo post...', true);

    this.postService
      .delete(postId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: async () => {
          this.loadingService.dismissLoader();
          await this.toastService.basicToast(
            'Post removido com sucesso.',
            'positive',
          );
          this.posts = this.posts.filter((post) => post.id !== postId);
          this.eventsService.emitPostUpdate();
        },
        error: async () => {
          this.loadingService.dismissLoader();
          await this.toastService.basicToast(
            'Erro ao excluir post. Tente novamente mais tarde.',
            'negative',
          );
        },
      });
  }
}
