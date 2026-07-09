import { Component, OnInit } from '@angular/core';
import { FarmerOrder, OrderService } from '../../../Services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-view-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-orders.component.html',
  styleUrl: './view-orders.component.css'
})
export class ViewOrdersComponent implements OnInit {

  orders: FarmerOrder[] = [];
  filteredOrders: FarmerOrder[] = [];
  farmer: any;
  searchText = '';
  isLoading = false;

  constructor(private orderService: OrderService, private alert: AlertService) {}

  ngOnInit(): void {

    const store = localStorage.getItem('farmer');

    this.farmer = store ? JSON.parse(store) : null;

    if (this.farmer) {
      this.loadOrders();
    } else {
      this.alert.error('Farmer not found', 'Please login again.');
    }
  }

  loadOrders() {
    this.isLoading = true;

    this.orderService
      .getFarmerOrders()
      .subscribe({

        next: (data: FarmerOrder[]) => {
          this.orders = data || [];
          this.applySearch();
          this.isLoading = false;
        },

        error: (err) => {

          console.log(err);
          this.isLoading = false;

          this.alert.error('Error', 'Failed to load orders');
        }
      });
  }

  applySearch() {
    const term = this.searchText.trim().toLowerCase();

    if (!term) {
      this.filteredOrders = [...this.orders];
      return;
    }

    this.filteredOrders = this.orders.filter(order =>
      String(order.orderId).includes(term) ||
      (order.customerName || '').toLowerCase().includes(term) ||
      (order.customerEmail || '').toLowerCase().includes(term) ||
      (order.productName || '').toLowerCase().includes(term) ||
      (order.paymentStatus || '').toLowerCase().includes(term) ||
      (order.orderStatus || '').toLowerCase().includes(term)
    );
  }

  getStatusBadge(status?: string): string {
    switch ((status || '').toUpperCase()) {
      case 'SUCCESS':
      case 'DELIVERED':
      case 'CONFIRMED':
        return 'bg-success';
      case 'PENDING':
      case 'IN_PROCESS':
        return 'bg-warning text-dark';
      case 'FAILED':
      case 'CANCELLED':
      case 'REJECT':
        return 'bg-danger';
      case 'DISPATCH':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  }
}
