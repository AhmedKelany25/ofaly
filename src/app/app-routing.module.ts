import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ContactsGuard } from './contacts/guards/contacts.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { AutoAuthGuard } from './auth/guards/auto-auth.guard';
import { NewUserGuard } from './profile/guards/new-user.guard';
import { ExistingUserGuard } from './profile/guards/existing-user.guard';
import { PatientExistGuard } from './health/guards/patient-exist.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard, NewUserGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthPageModule),
    canActivate: [AutoAuthGuard],
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./chat/chat.module').then((m) => m.ChatPageModule),
    canActivate: [AuthGuard, NewUserGuard],
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./shop/shop.module').then((m) => m.ShopPageModule),
    canActivate: [AuthGuard, NewUserGuard],
  },
  {
    path: 'health',
    loadChildren: () =>
      import('./health/health.module').then((m) => m.HealthPageModule),
    canActivate: [PatientExistGuard, AuthGuard, NewUserGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsPageModule),
    canActivate: [AuthGuard, NewUserGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard, ExistingUserGuard],
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('./contacts/contacts.module').then((m) => m.ContactsPageModule),
    canActivate: [AuthGuard, AuthGuard, ContactsGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },  {
    path: 'audio',
    loadChildren: () => import('./audio/audio.module').then( m => m.AudioPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
