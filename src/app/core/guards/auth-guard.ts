import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
//Paso1: Inyectar la dependencia de HttpAuth para verificar el estado de autenticación
//Pas2: Verificar invocar el método checkAuthStatus()


  return true;
};
