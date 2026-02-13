import { CanActivateFn, Router } from '@angular/router';
import { HttpAuth } from '../services/http-auth';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
//Paso1: Inyectar la dependencia de HttpAuth para verificar el estado de autenticación
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);

//Pas2: Verificar invocar el método checkAuthStatus()
  return httpAuth.checkAuthStatus().pipe(
    tap( (isAuthenticated) => {
      if(!isAuthenticated){
        router.navigateByUrl('/login');   //Redireccionar cuando no me deja acceder a la ruta
      }
    })
  );

};
