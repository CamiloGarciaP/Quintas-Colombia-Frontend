import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { HttpAuth } from '../services/http-auth';

export const publicGuard: CanActivateFn = (route, state) => {
 //Paso1: Inyectar la dependencia de HttpAuth para verificar el estado de autenticación
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);

//Pas2: Verificar invocar el método checkAuthStatus()
  return httpAuth.checkAuthStatus().pipe(
    tap( (isAuthenticated) => {
      console.info('Estado de autenticación:', isAuthenticated);
      if(isAuthenticated){
        router.navigateByUrl('/login');   //Redireccionar cuando no me deja acceder a la ruta
      }
    }),
    map(isAuthenticated => !isAuthenticated)
  );
};
