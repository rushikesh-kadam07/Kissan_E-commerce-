import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { OrderService } from '../../../Services/order.service';
import { ProductService } from '../../../Services/product.service';
import { FarmerService, Ifarmer } from '../../../Services/farmer.service';

@Component({
  selector: 'app-f-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './f-dashboard.component.html',
  styleUrls: ['./f-dashboard.component.css']
})

export class FDashboardComponent implements OnInit {

  // ================= FARMER =================

  farmerId: number = 0;

  farmers!: Ifarmer;

  // ================= ORDERS =================

  orders: any[] = [];

  // ================= DASHBOARD =================

  data: any = {};

  totalOrders: number = 0;

  totalProducts: number = 0;

  totalEarnings: number = 0;

  pendingOrders: number = 0;

  isLoading: boolean = false;

  // ================= CONSTRUCTOR =================

  constructor(

    private orderService: OrderService,

    private productService: ProductService,

    private farmerService: FarmerService

  ) {}

  // ================= ON INIT =================

  ngOnInit(): void {

    // ================= GET FARMER FROM LOCAL STORAGE =================

    const store = localStorage.getItem('farmer');

    this.farmers = store
      ? JSON.parse(store)
      : {} as Ifarmer;

    // ================= FARMER ID =================

    this.farmerId = this.farmers?.id || 0;

    console.log("Farmer:", this.farmers);

    console.log("Farmer ID:", this.farmerId);

    // ================= LOAD DATA =================

    if (this.farmerId) {

      this.loadFarmerProfile();

      this.loadDashboard();

      this.loadFarmerOrders();

    } else {

      console.log("Farmer ID not found");

    }

  }

  // ================= FARMER PROFILE =================

  loadFarmerProfile(): void {

    this.farmerService
      .getFarmerById(this.farmerId)
      .subscribe({

        next: (res: any) => {

          console.log("Farmer Response:", res);

          this.farmers = res;

        },

        error: (err) => {

          console.log("Farmer Error:", err);

        }

      });

  }

  // ================= DASHBOARD =================

  loadDashboard(): void {

    this.orderService
      .getFarmerDashboard(this.farmerId)
      .subscribe({

        next: (res: any) => {

          console.log("Dashboard Response:", res);

          this.data = res || {};

          // ================= ASSIGN VALUES =================

          this.totalOrders =
            this.data.totalOrders || 0;

          this.totalProducts =
            this.data.totalProducts || 0;

          this.totalEarnings =
            this.data.totalRevenue || 0;

          this.pendingOrders =
            this.data.pendingPayments || 0;

        },

        error: (err) => {

          console.log("Dashboard Error:", err);

        }

      });

  }

  // ================= FARMER ORDERS =================

  loadFarmerOrders(): void {

    this.isLoading = true;

    this.orderService
      .getOrdersByFarmer(this.farmerId)
      .subscribe({

        next: (res: any[]) => {

          console.log("Orders Response:", res);

          this.orders = res || [];

          this.isLoading = false;

        },

        error: (err) => {

          console.log("Orders Error:", err);

          this.isLoading = false;

        }

      });

  }

}