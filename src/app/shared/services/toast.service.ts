import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async basicToast(
    message: string,
    type: 'positive' | 'negative' = 'negative',
    translucent: boolean = false,
    duration: number = 3000,
  ): Promise<void> {
    try {
      const toast = await this.toastController.create({
        cssClass:
          type === 'positive'
            ? 'custom-toast-positive'
            : 'custom-toast-negative',
        message,
        translucent,
        duration,
        icon: type === 'positive' ? 'checkmark-outline' : 'close-outline',
        buttons: [
          {
            text: 'Dispensar',
            role: 'cancel',
          },
        ],
      });

      await toast.present();
    } catch (error) {
      console.error('Erro ao apresentar o toast:', error);
    }
  }

  async dismissToast(): Promise<void> {
    try {
      await this.toastController.dismiss();
    } catch (error) {
      console.error('Erro ao descartar o toast:', error);
    }
  }
}
