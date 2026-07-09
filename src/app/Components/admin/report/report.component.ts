import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_BASE_URL } from '../../../Services/api.config';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Xliff } from '@angular/compiler';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../Services/alert.service';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule,UpperCasePipe,FormsModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {

type: string = '';
  data: any[] = [];
  columns: any[] = [];
  loading = false;
  toDate = '';
  cities: string[] = [];
  city: string = '';
  fromDate = '';




      constructor(private route: ActivatedRoute, private http: HttpClient, private alert: AlertService) { }


   ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.type = param.get('type')!;
      this.loadData();
    });
    this.http.get<string[]>(`${API_BASE_URL}/orders/cities`).subscribe(
      res=>{
        this.cities = res;
      });

  }

  loadData() {
    this.loading = true;

    let url = `${API_BASE_URL}/${this.type}`;

    if(this.type ==='orders'){
      url = `${API_BASE_URL}/${this.type}/filter?from=${this.fromDate}&to=${this.toDate}&city=${this.city}`
    }

    this.http.get<any[]>(url).subscribe({
      next: res => {
        setTimeout(() => {
          this.data = res.map(item => {
            delete item.imageURL;
            delete item.createdAt;
            delete item.password;
            delete item.items;
            delete item.images;
            delete item.specifications;
            return item;
          });

          console.log(this.data);

          this.columns = this.data.length ? Object.keys(this.data[0]) : [];
          console.log(this.columns);
          this.loading = false;
          if (this.data.length === 0) {
            this.alert.info('No data found', 'Try different filters or report.', 1800);
          }

        }, 800);

      },
      error: err => {
        this.loading = false;
        console.error(err);
      }
    })
  }

  getValue(row: any, col: string): any {
    const value = row[col];

    if (value === null || value === undefined) return;

    if (col.toLocaleLowerCase().includes('date')) {
      return new Date(value).toLocaleDateString();
    }

    if (typeof value === 'object') {
      //prodcut nested obj
      if (value.name) {
        return value.name;
      }

      // customer object
      if (value.name && value.email) {
        return value.name;
      }

      // payment object
      if (value.paymentMethod) {
        return `${value.paymentMethod} (Rs.${value.netAmount})`;
      }

      // shipping object
      if (value.city && value.pinCode) {
        return `${value.name}, ${value.city}-${value.pinCode}`;
      }

      return JSON.stringify(value);
    }


    return value;

  }

  downloadPdf() {

    const doc = new jsPDF();

    doc.text(this.type.toUpperCase() + 'REPORT', 14, 10);

    autoTable(doc, {
      head: [this.columns],
      body: this.data.map(row =>
            this.columns.map(col =>this.getValue(row, col))
      ),
    });

    doc.save(this.type+'_report.pdf');

    this.alert.toastSuccess('PDF downloaded');

  }

  downloadExcel(){
    const formattedData = this.data.map(row=>{
      const obj : any={};
      this.columns.forEach(col=>{
        obj[col] = this.getValue(row,col);
      });
      return obj;
    });

    const workbook = XLSX.utils.book_new();
    const worksheet= XLSX.utils.json_to_sheet(formattedData);

    XLSX.utils.book_append_sheet(workbook,worksheet,'REPORT');

    const excelBuffer = XLSX.write(workbook,{
      bookType:'xlsx',
      type:'array'
    });

    const blob = new Blob([excelBuffer],{
      type:'applicatiom/octet-stream'
    });

    saveAs(blob,this.type+'_report.xlsx');
    this.alert.toastSuccess('Excel downloaded');

  }



}
