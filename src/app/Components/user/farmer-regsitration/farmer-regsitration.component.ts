import { Component } from '@angular/core';
import { FarmerService, Ifarmer } from '../../../Services/farmer.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-farmer-regsitration',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './farmer-regsitration.component.html',
  styleUrl: './farmer-regsitration.component.css'
})
export class FarmerRegsitrationComponent {

  farmer: Ifarmer = {
    address: '',
    contact: 0,
    email: '',
    name: '',
    password: '',
  };

  error: string = '';

  constructor(private service: FarmerService, private alert: AlertService) {}

  registerFarmer() {
    this.alert.loading('Creating account', 'Please wait while we register your farmer account');

    this.service.regis(this.farmer).subscribe({
      next: () => {
        this.alert.close();
        this.alert.success('Registration successful', 'Your farmer account has been created.');
      },
      error: (err: { error: any; message: any; }) => {
        this.alert.close();
        this.error = err.error || err.message || 'Registration Failed';
        this.alert.error('Registration failed', this.alert.getErrorMessage(err, 'Registration failed.'));
        console.log('Error while Register', err);
      }
    });
  }
}
