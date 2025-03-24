import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private storageService: StorageService,
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const isAuthenticated = await this.storageService.get('isAuthenticated'); // Obtenha o estado de autenticação usando o StorageService
    if (isAuthenticated === true) {
      // Se o usuário estiver autenticado, verifique se eles estão indo para a rota 'auth'
      if (state.url.startsWith('/auth/login')) {
        // Redirecione para a página de 'tabs'
        this.router.navigate(['tabs']);
        return false; // Impedir o acesso à rota 'auth'
      }

      // Caso contrário, permita o acesso à rota atual
      return true;
    } else {
      // Caso contrário, redirecione para a página de login
      this.router.navigate(['auth/login']);
      return false;
    }
  }
}
