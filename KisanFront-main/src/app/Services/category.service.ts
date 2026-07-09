import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { HttpClient } from '@angular/common/http';

export interface ICategory {
  id?: number;
  name: string;
  imageurl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiurl = `${API_BASE_URL}/categories`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.apiurl);
  }

  add(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(this.apiurl, category);
  }

  update(id: number, category: ICategory): Observable<ICategory> {
    return this.http.put<ICategory>(`${this.apiurl}/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiurl}/${id}`);
  }
}