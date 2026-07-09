import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/order.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule,FormsModule,JsonPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

 isLoading=false;
orders:any[]=[];

constructor(private orderService:OrderService, private alert: AlertService){}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(){
    this.isLoading = true;
    this.orderService.getAll().subscribe({
      next:(res)=>{
        setTimeout(() => {
          this.orders = res;          
         // console.log(res);
           this.orders.forEach(o => o.newStatus = o.status);
          this.isLoading=false;
        }, 800);
      },
      error:(err)=>{
        console.error(err);
        this.isLoading=false;
        this.alert.error('Error', this.alert.getErrorMessage(err));
      }
    })
  }

  updateStatus(order:any){
      this.orderService.updateOrderStatus(order.id,order.newStatus).subscribe({
        next:(res)=>{
          console.log(res);
          this.loadOrders();
          this.alert.success('Order processed', 'The order was updated successfully.', 1500);
        },
        error:(err)=>{
          this.alert.error('Error', this.alert.getErrorMessage(err));
        }
      })
  }


   getStatusClass(status: string): string {
  switch (status) {
    case 'IN_PROCESS': return 'bg-warning';
    case 'DISPATCH': return 'bg-info';
    case 'DELIVERED': return 'bg-success';
    case 'REJECT':
    case 'CANCELLED': return 'bg-danger';
    default: return 'bg-secondary';
  }
}

getStatusLabel(status: string): string {
  switch (status) {
    case 'IN_PROCESS': return 'Processing';
    case 'DISPATCH': return 'Dispatched';
    case 'DELIVERED': return 'Delivered';
    case 'REJECT': return 'Rejected';
    case 'CONFORM':return 'Conform';
    case 'CANCELLED': return 'Cancelled';
    default: return status;
  }
}

}
