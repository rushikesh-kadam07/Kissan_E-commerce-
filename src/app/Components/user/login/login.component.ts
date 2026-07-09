import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService, ILogin } from '../../../Services/customer.service';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  loginRequest :ILogin={
    email:"",
    password:""

  }
  error="";
  
  constructor(private servic :CustomerService,private router:Router, private alert: AlertService){
  }

  login(){
    this.alert.loading('Signing in', 'Checking your customer account');
    this.servic.login(this.loginRequest).subscribe({
      next:( res:any)=>{
        this.alert.close();
        this.alert.success('Login successful', 'Welcome back.');
        localStorage.setItem("customer",JSON.stringify(res));
        this.router.navigate(["/customer/home"]);
      },
      error:(err)=>{
        this.alert.close();
        this.alert.error('Login failed', this.alert.getErrorMessage(err, 'Invalid email or password.'));
      }
    })
  }
  

}
