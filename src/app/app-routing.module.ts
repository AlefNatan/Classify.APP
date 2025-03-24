import { NgModule } from '@angular/core';

import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'src/app/shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login', // Redireciona para a página de login ao iniciar
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('src/app/modules/auth/auth.module').then((m) => m.AuthModule), // Carrega o módulo de autenticação
    // canActivate: [AuthGuard],
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('src/app/modules/tabs/tabs.module').then((m) => m.TabsPageModule), // Carrega o módulo de tabs
    canActivate: [AuthGuard],
  },

  {
    path: '**',
    loadChildren: () =>
      import('src/app/modules/notfound/notfound.module').then(
        (m) => m.NotfoundPageModule,
      ), // Carrega o módulo de not found
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
