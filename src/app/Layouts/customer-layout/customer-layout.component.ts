import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ICustomer } from '../../Services/customer.service';
import { FooterComponent } from '../../shared/footer/footer.component';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule, FooterComponent],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.css'
})
export class CustomerLayoutComponent implements OnInit {


  constructor(private router: Router) {}

  customer: ICustomer | null = null;
  searchControl = new FormControl('', { nonNullable: true });

  ngOnInit(): void {

    const store = localStorage.getItem('customer');
    this.customer = store ? JSON.parse(store) : null;
    

    this.searchControl.valueChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged()
      )
      .subscribe((keyword) => {
        const trimmedKeyword = keyword.trim();

        this.router.navigate(['/customer/products'], {
          queryParams: trimmedKeyword ? { keyword: trimmedKeyword } : {}
        });
      });
    
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  logOut(): void {
    localStorage.removeItem('customer');
    this.router.navigate(['/']);
  }

}
