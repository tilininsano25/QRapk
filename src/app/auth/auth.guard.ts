import { CanActivateFn } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
export const authGuard: CanActivateFn = (route, state) => {
const afAuth = inject(AngularFireAuth);
const router = inject(Router);
return afAuth.authState.pipe(
take(1),
map(user => {
if (user) {
return true; // Usuario autenticado
} else {
router.navigate(['/home']); // Redirige a la página de login
return false; // Usuario no autenticado
}
})
);
}