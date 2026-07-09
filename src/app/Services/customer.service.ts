import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
export interface ICustomer {
  id? :number;
  address: string;
  city: string;
  contact: number;
  email: string;
  name: string;
  password: string;
}
export interface ILogin{
  email:string;
  password :string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService{

  private apiurl =`${API_BASE_URL}/customers`;
  constructor(private http:HttpClient){

  }
  register(Customer :ICustomer):Observable<ICustomer>{
    return this.http.post<ICustomer>(`${this.apiurl}/register`, Customer);
  }

  login(request:ILogin):Observable<ICustomer>{
    return this.http.post<ICustomer>(`${this.apiurl}/login`,request)
  }

  sendOtp(email:string){
    return this.http.post(`${this.apiurl}/send-otp`, { email });
  }

  verifyOtp(email:string,otp:string){
     return this.http.post(`${this.apiurl}/verify-otp`, { email, otp });
  }

  resetPassword(email:string,password:string){
    return this.http.post(`${this.apiurl}/reset-password`, { email, password });
  }
  
}


