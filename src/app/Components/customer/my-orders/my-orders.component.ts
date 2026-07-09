import { Component } from '@angular/core';
import { ICustomer } from '../../../Services/customer.service';
import { OrderService } from '../../../Services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../Services/alert.service';


@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent {

   customer!: ICustomer;
  orders: any[] = [];

  constructor(private orderService: OrderService, private alert: AlertService) { }

  ngOnInit(): void {
    const store = localStorage.getItem('customer');
    this.customer = store ? JSON.parse(store) : null;

    if(!this.customer.id) return;

    this.loadOrders(this.customer.id);

  }

  loadOrders(customerId: number) {
    this.orderService.getOrderByCustomer(customerId).subscribe({
      next: (res) => {
        this.orders = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

   async cancelOrder(orderId:number){
    const confirmed = await this.alert.confirmCancel('this order');
    if (!confirmed) return;

    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {

        this.alert.success('Cancelled', 'Your order has been cancelled.');


        this.loadOrders(this.customer.id!);
      },

      error: err => {

        this.alert.error('Failed', this.alert.getErrorMessage(err, 'Error cancelling order'));
        console.error(err);

      }
    });
  }

}


