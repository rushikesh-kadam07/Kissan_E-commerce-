import { Component } from '@angular/core';
import { AdminService, IAdmin } from '../../../Services/admin.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-adim-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './adim-login.component.html',
  styleUrl: './adim-login.component.css'
})
export class AdimLoginComponent {
  loginRequest:IAdmin={
  username:'',
  password:''
}
message='';
isLoading=false;

constructor(private adminService :AdminService, private router :Router, private alert: AlertService){}

login(){
  this.isLoading=true;
  this.alert.loading('Signing in', 'Checking your admin account');
  this.adminService.login(this.loginRequest).subscribe({
    next:(res:any)=>{
      this.isLoading=false
      this.alert.close();
      this.alert.success('Login successful', 'Welcome back.');
      localStorage.setItem("admin",JSON.stringify(res));
      this.router.navigate(["admin/dashboard"]);
    },
    error:(err)=>{
        this.alert.close();
        this.isLoading=false;
        this.message="Invalid username password";
        this.alert.error('Login failed', this.alert.getErrorMessage(err, 'Invalid username or password.'));
        console.error("login failed",err);
      }

  })
}
}
