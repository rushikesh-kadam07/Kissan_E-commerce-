import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../../Services/cart.service';
import { Router, RouterLink } from '@angular/router';
import { IPaymentDTO, PaymentService } from '../../../Services/payment.service';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit{

  paymentForm!: FormGroup;
  submitting = false;
  successMessage = '';
  totalAmount = 0;
  netAmount = 0;
  gstPercent = 18;
  discountPercent = 5;
  orderId!: number;


    constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router,
    private paymentService:PaymentService,
    private alert: AlertService
  ) {}


  ngOnInit(): void {

    // Get last order from localStorage
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || '{}');
    if (!lastOrder?.id) {
      this.alert.info('No order found', 'Please place an order first.', 2200);
      this.router.navigate(['/customer/cart']);
      return;

  }

   this.orderId = lastOrder.id;
    this.totalAmount = lastOrder.totalAmount || 0;
    this.updateNetAmount();

  this.paymentForm = this.fb.group({
      paymentMethod: ['Card', Validators.required],
    });
  }

  updateNetAmount(){
    const gst = (this.totalAmount * this.gstPercent)/100;
    const discount= (gst * this.discountPercent)/100;

    this.netAmount = this.totalAmount + gst - discount;
  }

  makePayment(){
    this.submitting=true;
    if(this.paymentForm.invalid) {
      this.submitting = false;
      this.alert.error('Validation failed', 'Please select a payment method.');
      return;
    }

    const method = this.paymentForm.value.paymentMethod;

    if(method ==='COD'){
      const paymentData:IPaymentDTO={
         orderId: this.orderId,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'COD',
      gstPercent: this.gstPercent,
      discountPercent: this.discountPercent,
      totalAmount: this.totalAmount,
      netAmount: this.netAmount,
      transactionRef: 'COD-' + Date.now()
      }

      this.alert.loading('Confirming order', 'Saving your cash on delivery order');
      this.paymentService.makePayment(paymentData).subscribe({
        next:(res)=>{
          this.alert.close();
          this.successMessage = 'Order placed with Cash on delivery';
          this.alert.success('Order placed', 'Your cash on delivery order is confirmed.');
          localStorage.removeItem('lastOrder');
          localStorage.setItem('paymentData', JSON.stringify(res));

           this.router.navigate(['/customer/payment-success']);
           this.submitting=false;
        }, 
        error:(err)=>{
          this.alert.close();
          this.alert.error('Payment failed', this.alert.getErrorMessage(err, 'Could not confirm payment.'));
          console.error(err);
          localStorage.removeItem('lastOrder');
          this.submitting=false;
        }
      });

    }
    else if(method === 'Card'){
      this.alert.loading('Redirecting to payment', 'Opening the secure card payment page');
      this.paymentService.createStripeSession(this.orderId).subscribe({
        next:(res:any)=>{
          this.alert.close();
          window.location.href = res.url;
        },
        error:(err)=>{
          this.alert.close();
          this.submitting = false;
          this.alert.error('Payment failed', this.alert.getErrorMessage(err, 'Could not start card payment.'));
          console.error(err);
        }
      })
    }

  }

}
