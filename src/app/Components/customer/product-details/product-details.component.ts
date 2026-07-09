import { Component, OnInit } from '@angular/core';
import { IProduct, ProductService } from '../../../Services/product.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ICustomer } from '../../../Services/customer.service';
import { CartService, ICartDTO } from '../../../Services/cart.service';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [FormsModule,CommonModule,],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit{
  product! :IProduct;
  selectedImages :String | null=null;
  customer! :ICustomer;
  customerId : any;
  cartDTO :ICartDTO={customerId:0,productId:0,quantity:0}

  constructor(private route :ActivatedRoute,
    private productservices :ProductService,
    private cartService : CartService,
    private alert: AlertService
  ){}


  ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
            if(id) this.loadProduct(+id); 
            
      
       const store = localStorage.getItem('customer');
    this.customer = store ? JSON.parse(store) : null;
    this.customerId = this.customer.id;

        console.log(this.customerId);
    
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

  addTOCart(){
     if(!this.customer.id) return;
      if(!this.product.id) return;

      this.cartDTO.customerId = this.customerId;
      this.cartDTO.productId = this.product.id;
      this.cartDTO.quantity = 1;

      this.cartService.addToCart(this.cartDTO).subscribe({
        next:(res)=>{
          this.alert.toastSuccess('Product added to cart');
          console.log(res);
        },
        error:(err)=>{
          this.alert.error('Cart update failed', this.alert.getErrorMessage(err, 'Could not add product to cart.'));
          console.error(err);
        }
      })

  }


}
