import { Component } from '@angular/core';
import { FarmerService } from '../../../Services/farmer.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ILogin } from '../../../Services/customer.service';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-farmer-login',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink],
  templateUrl: './farmer-login.component.html',
  styleUrl: './farmer-login.component.css'
})
export class FarmerLoginComponent {

    loginRequest:ILogin={
    email:'',
    password:''
  }
  message='';
  isLoading=false;
  
  constructor(private farmerservice :FarmerService, private router :Router, private alert: AlertService){}
  
  login(){
    this.isLoading=true;
    this.alert.loading('Signing in', 'Checking your farmer account');
    this.farmerservice.login(this.loginRequest).subscribe({
      next:(res:any)=>{
        this.isLoading=false
        this.alert.close();
        this.alert.success('Login successful', 'Welcome back.');
        localStorage.setItem("farmer",JSON.stringify(res));
        this.router.navigate(["/farmer/f-dashboard"]);
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
  


