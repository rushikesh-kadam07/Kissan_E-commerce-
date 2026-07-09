import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id?: number;
  name: string;
  email: string;
  contact: number;
  address:string;
  city:string;
  password:string;
}


export interface IAdmin {
  username: string;
  password: string;
}


@Injectable({
  providedIn: 'root'
})
export class AdminService { 


private apiUrl = `${API_BASE_URL}/admin`;
  constructor(private http: HttpClient) { }

  register(customer: Customer):Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/create`, customer);
  }

  login(admin: IAdmin):Observable<IAdmin> {
    return this.http.post<IAdmin>(`${this.apiUrl}/login`, admin);

}
}
