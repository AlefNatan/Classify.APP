import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(public loadingController: LoadingController) {}

  async basicLoading(
    message: string,
    translucent: boolean,
    duration?: number,
  ): Promise<void> {
    try {
      this.loading = await this.loadingController.create({
        message,
        translucent,
        spinner: 'circular',
        duration,
        cssClass: 'custom-loading',
      });
      await this.loading.present();
    } catch (error) {
      console.error('Erro ao apresentar o loader:', error);
    }
  }

  async dismissLoader(): Promise<void> {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
