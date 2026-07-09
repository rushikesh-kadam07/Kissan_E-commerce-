import { Component, OnInit } from '@angular/core';
import { IProduct, ProductService } from '../../../Services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule,CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product! :IProduct
    selectedImages :String | null=null
  
    constructor(private route :ActivatedRoute,private productservices :ProductService){}
    ngOnInit(): void {

      const id = this.route.snapshot.paramMap.get('id');
            if(id) this.loadProduct(+id);    
      
    }
  
     loadProduct(id:number){
      this.productservices.getById(id).subscribe({
        next:(res)=>{
          this.product = res;
          console.log(res);
        },
        error:(err)=>{
          console.error(err);
        }
      })
    }
  
    getProductImage():string{
      return this.product?.images?.[0].imageUrl;
    }
  
    selectImage(img:string){
        this.selectedImages = img;
    }
  
  }


