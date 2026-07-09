import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const customerAuthGuard: CanActivateFn = (route, state) => {


  const router = inject(Router);
  

  const  customerData =localStorage.getItem('customer');
  if(customerData){
    return true
  }
  else{
    return router.navigate(['/']);
  }

  
};
