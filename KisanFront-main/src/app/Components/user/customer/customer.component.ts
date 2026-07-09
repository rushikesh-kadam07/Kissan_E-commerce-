import { Component } from '@angular/core';
import { CustomerService, ICustomer } from '../../../Services/customer.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink,RouterOutlet],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent {
  customer: ICustomer = {
    address: '',
    city: '',
    contact: 0,
    email: '',
    name: '',
    password: '',
  };

  error: string = '';

  constructor(private service: CustomerService, private alert: AlertService) {}

  registerCustomer() {
    this.alert.loading('Creating account', 'Please wait while we register your customer account');

    this.service.register(this.customer).subscribe({
      next: () => {
        this.alert.close();
        this.alert.success('Registration successful', 'Your customer account has been created.');
      },
      error: (err) => {
        this.alert.close();
        this.error = err.error || err.message || 'Registration Failed';
        this.alert.error('Registration failed', this.alert.getErrorMessage(err, 'Registration failed.'));
        console.log('Error while Register', err);
      },
    });
  }
}


