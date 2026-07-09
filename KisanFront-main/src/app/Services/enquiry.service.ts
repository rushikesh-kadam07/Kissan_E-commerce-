import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from './api.config';
import { Observable } from 'rxjs';

export interface EnquiryModels{
  name :String;
  email :String;
  password : String;
  contact :number;
  subject :String;
}

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
constructor(private http:HttpClient){

  }
    private apiurl =`${API_BASE_URL}/enquiry`;


  submitEnquiry(enquiry: EnquiryModels):Observable<EnquiryModels>{{

return this.http.post<EnquiryModels>(`${this.apiurl}`,enquiry);
  }
  
  }
}
