import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICustomer } from './customer.service';
import { IProduct } from './product.service';
import { API_BASE_URL } from './api.config';
import { map, Observable } from 'rxjs';

export interface ICartDTO{
  customerId:number;
  productId:number;
  quantity:number;
}

export interface ICart{
  id? : number;
  customer:ICustomer;
   product:IProduct;
  quantity:number;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {

    private apiUrl =`${API_BASE_URL}/cart`


  constructor( private https : HttpClient) { }

    addToCart(dto:ICartDTO):Observable<ICart>{
   return this.https.post<ICart>(`${this.apiUrl}`,dto);
  }

 getCart(id:number):Observable<ICart[]>{
  return this.https.get<ICart[]>(`${this.apiUrl}/${id}`);
 } 

  updateCartItem(item:ICartDTO,id:number):Observable<ICart>{
  return this.https.put<ICart>(`${this.apiUrl}/${id}`,item);
  }

 removeFromCart(CartItemId:number):Observable<void>{
    return this.https.delete<void>(`${this.apiUrl}/${CartItemId}`);
  }

 clearCart(customerId:number):Observable<void>{
    return this.https.delete<void>(`${this.apiUrl}/clear/customer/${customerId}`);
  }

 getTotal(items? :ICart[] ): number{
  if(!items) return 0;
  return items.reduce((sum,it)=>sum+(it.product?.price ??0) * (it.quantity ?? 0),0);
 }

 getCartWithTotal(id : number):Observable<{items :ICart[];total:number}>{
  return this.getCart(id).pipe(map(items=>({items,total: this.getTotal(items)})))
 }

 
  



}
