import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminAuthGuard: CanActivateFn = (route, state) => {


   const router=inject(Router);
   const Admin = localStorage.getItem('admin');
   if (Admin) {
     return true;
   }
   else{
     return router.navigate(['/']);
   }
  
};
