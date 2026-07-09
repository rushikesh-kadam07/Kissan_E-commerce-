import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../Services/payment.service';

@Component({
  selector: 'app-payment-failed',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './payment-failed.component.html',
  styleUrl: './payment-failed.component.css'
})
export class PaymentFailedComponent implements OnInit{
  loading: boolean = true;
  errorMessage: string = '';
  order: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {

    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!sessionId) {
      this.loading = false;
      this.errorMessage = 'Invalid payment session.';
      return;
    }

    this.paymentService.confirmPayment(sessionId).subscribe({
      next: (res) => {
        this.order = res;

        if (res.status === 'FAILED' || res.status === 'CANCELLED') {
          this.errorMessage = 'Payment was not completed.';
        }

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.errorMessage = 'Payment verification failed. Please try again.';
      }
    });
  }

  retryPayment() {
    this.router.navigate(['/customer/payment', this.order?.id]);
  }

}


