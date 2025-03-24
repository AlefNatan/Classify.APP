import { Component } from '@angular/core';

import { StorageService } from './shared/services/storage.service';
import { AuthService } from './services';

import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private storageService: StorageService,
  ) {
    this.createStorage();
  }

  private async createStorage() {
    await this.storageService.init();
  }
}
