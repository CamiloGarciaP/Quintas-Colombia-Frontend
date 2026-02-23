import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { HttpAuth } from '../services/http-auth';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';


export const roleGuard: CanActivateFn = async (route, state) => {
  
  const httpAuth = inject(HttpAuth);
  const router = inject(Router);

  //Extrae la lista de roles permitidos para cada ruta
  const allowedRoles = route.data['roles'];

  //Obtenemos los datos del usuario(Observable), convertimos en una promeso ( firstValueFrom)
  const user = await firstValueFrom(httpAuth.currentUser$);

  //Extraemos el rol del usuario autenticado
  const role = user?.role;

  //PASO 1:(Opcional) Verificamos si NO hay usuario autenticado
  if (!user) {
    router.navigateByUrl('/login');
    return false;
  }
  
  //PASO 2: Verificamos que sí la ruta NO TIENE DEFINIDOS roles, permitimos el acceso.
  if (!allowedRoles || allowedRoles.length == 0 ) {
    return true;
  }

  // PASO 3: Verificamos si el usuario tiene al menos un rol que esté permitido
  if (role && role.length > 0) {
    
    // Iteramos sobre los roles del usuario para ver si ALGUNO coincide con los permitidos
    const tienePermiso = role.some( rolUsuario => allowedRoles.includes(rolUsuario) );

    if (tienePermiso) {
      return true; // Dejamos pasar al usuario
    }
  }

  //PASO 3: Verificamos sí el role del usuario ESTÁ DENTRO de los roles permitidos.
  // if(role && allowedRoles.includes(role)){
  //   return true;
  // }

  //PASO 4: Si no cumple ninguna condición, denegamos el acceso. 
  router.navigateByUrl('/dashboard'); 
  return false;
};
