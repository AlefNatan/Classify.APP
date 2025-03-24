import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { EventsService } from 'src/app/shared/services/events.service';

import type { Post } from 'src/app/types/response/post.response';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit, OnDestroy {
  public posts: Post[] = [];
  public currentPage = 1;
  public pageSize = 5;
  public isLoading = false;
  public hasMore = true;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private postService: PostService,
    private eventsService: EventsService,

    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.loadPosts();
    this.listenToPostUpdates();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private listenToPostUpdates() {
    this.eventsService.postUpdate$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.posts = [];
        this.currentPage = 1;
        this.hasMore = true;
        this.loadPosts();
      });
  }

  public loadPosts(event?: any) {
    if (!this.hasMore || this.isLoading) {
      event?.target?.complete();
      return;
    }

    this.isLoading = true;

    this.postService
      .getAll(this.currentPage, this.pageSize)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response) => {
          if (this.currentPage === 1) {
            this.posts = response.items;
          } else {
            this.posts = [...this.posts, ...response.items];
          }
          this.hasMore = response.items.length > 0;
          this.currentPage++;
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

  public async handleRefresh(event: any) {
    this.posts = [];
    this.currentPage = 1;
    this.hasMore = true;
    await this.loadPosts();
    event.target.complete();
  }

  public onScroll(event: any) {
    this.loadPosts();
    event.target.complete();
  }

  public async sharePostWhatsapp(post: Post) {
    const message = `Olá! Vi seu post sobre ${post.title} e gostaria de mais informações.`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${post.user.phone}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  public async sharePostEmail(post: Post) {
    const subject = `Interesse no post: ${post.title}`;
    const body = `Olá! Vi seu post sobre "${post.title}" e gostaria de mais informações.`;
    const mailtoUrl = `mailto:${post.user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  }
}
