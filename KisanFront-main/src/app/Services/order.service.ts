import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';
import { Customer } from './admin.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ICart } from './cart.service';
import { Observable } from 'rxjs';

export interface FarmerOrder {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  paymentStatus: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerContact: string;
  productId: number;
  productName: string;
  productImageUrl?: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${API_BASE_URL}/orders`;
  customer!: Customer;
  constructor(private http: HttpClient) { }

  placeOrder(
    cartItems :ICart[],
    shipping:{
      name: string,
      address: string,
      city: string,
      pinCode: string,
      contact: string

    },
    gstPercent = 0,
    discountPercent = 0
  ): Observable<any> {

    const items = cartItems.map(i => ({
      productId: i.product.id,
      quantity: i.quantity
    }));

    const store = localStorage.getItem('customer');
    this.customer = store ? JSON.parse(store) : null;

    const orderRequest={
      customerId:this.customer.id,
      shipping,
      items,
      gstPercent,
      discountPercent
    }
        return this.http.post(`${this.apiUrl}`,orderRequest);
  
}
getOrderByCustomer(customerId:number):Observable<any[]>{
   return this.http.get<any[]>(`${this.apiUrl}/${customerId}/customer`);

}

cancelOrder(orderId:number):Observable<any>{
   return this.http.put<any>(`${this.apiUrl}/${orderId}/cancel`,{});
  }

    getAll():Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  updateOrderStatus(id:number,status:string):Observable<any>{
   return this.http.put<any>(`${this.apiUrl}/${id}/status?status=${status}`,{});
  }

  getDashboard(){
   return this.http.get<any[]>(`${this.apiUrl}/dashboard`)
  }

  getOrdersByFarmer(farmerId: number) {

  return this.http.get<any[]>(
    `${this.apiUrl}/farmer/${farmerId}/orders`
  );

}

getFarmerOrders(): Observable<FarmerOrder[]> {
  const farmer = JSON.parse(localStorage.getItem('farmer') || 'null');
  const token = localStorage.getItem('token') || localStorage.getItem('farmerToken') || '';

  let headers = new HttpHeaders();

  if (farmer?.id) {
    headers = headers.set('X-Farmer-Id', String(farmer.id));
  }

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  return this.http.get<FarmerOrder[]>(`${API_BASE_URL}/farmer/orders`, { headers });
}

getFarmerDashboard(farmerId: number) {

  return this.http.get<any>(
    `${this.apiUrl}/farmer/${farmerId}/dashboard`
  );

}



}




