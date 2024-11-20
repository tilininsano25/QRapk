import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard'; // Importar el guardia
import { AsistenciaComponent } from './components/asistencia/asistencia.component';
import { AsignaturaComponent } from './components/asignatura/asignatura.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordPageModule),
    canActivate: [authGuard] // Guardia
  },
  {
    path: 'scan-qr',
    loadChildren: () => import('./scan-qr/scan-qr.module').then(m => m.ScanQrPageModule),
    canActivate: [authGuard] // Guardia
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfilePageModule),
    canActivate: [authGuard] // Guardia
  },

  { path: 'inicio'
  , loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {path:'asignatura',
    component: AsignaturaComponent,
    canActivate:[authGuard]
  },
  {path:'asistencia',
    component: AsistenciaComponent,
    canActivate:[authGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }