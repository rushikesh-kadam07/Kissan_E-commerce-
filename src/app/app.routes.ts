import { Routes } from '@angular/router';
import { UserLayoutComponent } from './Layouts/user-layout/user-layout.component';
import { CustomerLayoutComponent } from './Layouts/customer-layout/customer-layout.component';
import { AdimLoginComponent } from './Components/admin/adim-login/adim-login.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { AdminComponent } from './Layouts/admin-layout/admin.component';
import { customerAuthGuard } from './guards/customer-auth.guard';
import { FarmerLoginComponent } from './Components/user/farmer-login/farmer-login.component';
import { FarmerComponent } from './Layouts/farmer/farmer.component';

export const routes: Routes = [
    {

        path :"",
        component:UserLayoutComponent,
        children:[
            {path:"",loadComponent:()=>import('./Components/user/home/home.component').then(a=>a.HomeComponent)},
            {path:"enquiry",loadComponent:()=>import('./Components/user/enquiry/enquiry.component').then(b=>b.EnquiryComponent)},
            {path:"signUp",loadComponent:()=>import('./Components/user/customer/customer.component').then(c=>c.CustomerComponent)},
            {path:"login",loadComponent:()=>import('./Components/user/login/login.component').then(d=>d.LoginComponent)},
            {path:"farmer-login",loadComponent:()=>import('./Components/user/farmer-login/farmer-login.component').then(a=>a.FarmerLoginComponent)},
            {path :"farmer-register",loadComponent:()=>import('./Components/user/farmer-regsitration/farmer-regsitration.component').then(c=>c.FarmerRegsitrationComponent)},
            {path :"product",loadComponent:()=>import('./Components/user/product-list/product-list.component').then(m=>m.ProductListComponent)},
            {path :"product/:id",loadComponent:()=>import('./Components/user/product-details/product-details.component').then(m=>m.ProductDetailsComponent)},
            {path :"agri-robotices",loadComponent:()=>import('./Components/user/agri-robotics/agri-robotics.component').then(m=>m.AgriRoboticsComponent)},
            {path :"aerohonics",loadComponent:()=>import('./Components/user/aerophonics/aerophonics.component').then(m=>m.AerophonicsComponent)},
            {path :"greenhouse",loadComponent:()=>import('./Components/user/greenhouse/greenhouse.component').then(m=>m.GreenhouseComponent)},
            {path :"soil",loadComponent:()=>import('./Components/user/soil-type/soil-type.component').then(m=>m.SoilTypeComponent)},
            {path :"precision",loadComponent:()=>import('./Components/user/precision-farming/precision-farming.component').then(m=>m.PrecisionFarmingComponent)},
             {path :"forget",loadComponent:()=>import('./Components/user/forget-password/forget-password.component').then(m=>m.ForgetPasswordComponent)},
            {path :"contact",loadComponent:()=>import('./Components/user/contact/contact.component').then(m=>m.ContactComponent)},
             {path :"aboutus",loadComponent:()=>import('./Components/user/aboutus/aboutus.component').then(m=>m.AboutusComponent)},








         


        ]
    },
    {
        path :"customer",
        component:CustomerLayoutComponent,
        canActivate:[customerAuthGuard],
        children:[
            {path:"home",loadComponent:()=>import('./Components/customer/home/home.component').then(c=>c.HomeComponent)},
            {path:'feedback',loadComponent:()=>import('./Components/customer/feedback/feedback.component').then(a=>a.FeedbackComponent)},
            {path:'products/:id',loadComponent:()=>import('./Components/customer/product-details/product-details.component').then(a=>a.ProductDetailsComponent)},
            {path :'products',loadComponent:()=>import('./Components/customer/product-list/product-list.component').then(a=>a.ProductListComponent)},
            {path :'cart',loadComponent:()=>import('./Components/customer/cart/cart.component').then(a=>a.CartComponent)},
            { path: 'payment', loadComponent: () => import('./Components/customer/payment/payment.component').then(m => m.PaymentComponent) },
            { path: 'payment-success', loadComponent: () => import('./Components/customer/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent) },
            { path: 'payment-failed', loadComponent: () => import('./Components/customer/payment-failed/payment-failed.component').then(m => m.PaymentFailedComponent) },
            { path: 'myOrder', loadComponent: () => import('./Components/customer/my-orders/my-orders.component').then(m => m.MyOrdersComponent) },
            ]
    },
        {
      path:'admin/login',
      component:AdimLoginComponent
    },
    {
      path:'admin',
       component:AdminComponent,
      canActivate:[adminAuthGuard],
      children:[
        {path:'dashboard',loadComponent:()=>import('./Components/admin/dashboard/dashboard.component').then(m=>m.DashboardComponent)},
        {path:'categories',loadComponent:()=>import('./Components/admin/category/category.component').then(m=>m.CategoryComponent)},
         {path:'orders',loadComponent:()=>import('./Components/admin/orders/orders.component').then(m=>m.OrdersComponent)},
         {path:'report/:type',loadComponent:()=>import('./Components/admin/report/report.component').then(m=>m.ReportComponent)},


      ]
    },

    {path: 'farmer/login',
    component:FarmerLoginComponent

    },
    {
        path:'farmer',
        component:FarmerComponent,
        children:[
        {path:'f-dashboard',loadComponent:()=>import('./Components/farmer/f-dashboard/f-dashboard.component').then(m=>m.FDashboardComponent)},
        {path:'manage-product',loadComponent:()=>import('./Components/farmer/manage-product/manage-product.component').then(m=>m.ManageProductComponent)},
         {path:'view-order',loadComponent:()=>import('./Components/farmer/view-orders/view-orders.component').then(m=>m.ViewOrdersComponent)}

        ]

    }

];
