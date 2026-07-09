import { Injectable } from '@angular/core';
import { ICategory } from './category.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from './api.config';
import { Observable } from 'rxjs';
import { Ifarmer } from './farmer.service';

export interface ISpecificationDTO{
  name:String;
  value :String;

}
export interface IProductDTO{
  name:String;
  price:number;
  stock:number;
  available?:boolean;
  categoryId:number;//cat
  farmerId:number,
  imageurls:string[];
  specifications:ISpecificationDTO[];

}
export interface IProductImage{
  imageUrl:string;
  isPrimary:boolean;
}

export interface IProduct{
  id?:number;
  product_name:string;
  price:number;   
  stock:number;
  available?:boolean;
  category:ICategory;
  // farmer:Ifarmer;
  images:IProductImage[];
  specifications:ISpecificationDTO[];
  farmer:Ifarmer;
}


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = `${API_BASE_URL}/products`;

  constructor(private http: HttpClient) {}

  add(product: IProductDTO): Observable<IProduct> {
    return this.http.post<IProduct>(this.apiUrl, product);
  }

  getAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.apiUrl);
  }

  getById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  update(id: number, product: IProductDTO): Observable<IProduct> {
   return this.http.put<IProduct>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getByFarmerId(id: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}/farmer/${id}`);
  }

  getByCatId(id: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${this.apiUrl}/categories/${id}`);
  }

  searchProducts(keyword: string): Observable<IProduct[]> {
    const params = new HttpParams().set('keyword', keyword);
    return this.http.get<IProduct[]>(`${this.apiUrl}/search`, { params });
  }

  getTotalProducts(id:number){
  return this.http.get<number>(`${this.apiUrl}/total-products/${id}`);
}
}
