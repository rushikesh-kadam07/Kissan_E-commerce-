import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILogin } from './customer.service';
export interface Ifarmer {
  id?: number;
  name: string;
  email: string;
  address:string;
  contact: number;
  password:string;
}


@Injectable({
  providedIn: 'root'
})
export class FarmerService {

  
  private apiUrl = `${API_BASE_URL}/farmer`;
    constructor(private http: HttpClient) { }
  
    regis(customer: Ifarmer):Observable<Ifarmer> {
      return this.http.post<Ifarmer>(`${this.apiUrl}/create`, customer);
    }
  
    login(fadmin: ILogin):Observable<ILogin> {
      debugger;
      return this.http.post<ILogin>(`${this.apiUrl}/login`, fadmin);
  
  }

    sendOtp(email: string) {
      return this.http.post(`${this.apiUrl}/send-otp`, { email });
    }

    verifyOtp(email: string, otp: string) {
      return this.http.post(`${this.apiUrl}/verify-otp`, { email, otp });
    }

    resetPassword(email: string, password: string) {
      return this.http.post(`${this.apiUrl}/reset-password`, { email, password });
    }

    getFarmerById(farmerId: number): Observable<Ifarmer> {

  return this.http.get<Ifarmer>(
    `${this.apiUrl}/farmer/${farmerId}`
  );

}
}
