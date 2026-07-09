import { Component, OnInit } from '@angular/core';
import { CategoryService, ICategory } from '../../../Services/category.service';
import { IProduct, IProductDTO, ProductService } from '../../../Services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ifarmer } from '../../../Services/farmer.service';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-manage-product',
  standalone: true,
  imports: [FormsModule,CommonModule ],
  templateUrl: './manage-product.component.html',
  styleUrl: './manage-product.component.css'
})
export class ManageProductComponent implements OnInit {

   products: IProduct[] = [];
  categories: ICategory[] = [];
  farmer!:Ifarmer;
  newProduct: any = this.getEmpatyProduct();
  imagePreview: string | null = null;

  isEdit = false;

  getEmpatyProduct() {
    return {
      name: '',
      price: 0,
      stock: 0,
      categoryId: 0,
      farmerId:0,
      imageurls: [],
      specifications: []
    }
  }

  constructor(private categoryService: CategoryService,
    private ProductService: ProductService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    const store=localStorage.getItem("farmer");
    if(store){
      const farmerObj = JSON.parse(store);
      this.farmer = farmerObj;
    }
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        console.log("Categories from api", res);
        this.categories = res;
      },
      error: (err) => {
        console.error("error while fetching categories", err);
      }
    })
  }

  loadProducts() {
    if(this.farmer){
    this.ProductService.getByFarmerId(this.farmer.id!).subscribe({
      
      
      next: (res) => {
        console.log("Products from api", res);
        this.products = res;
      },
      error: (err) => {
        console.error("error while fetching products", err);
      }
    })
  }
  else{
    this.products=[];
  }
}

  onImageSelected(event: any) {
    const files = event.target.files;

    this.newProduct.imageurls = [];
    this.imagePreview = null;
    

    if (!files.length) return

    Array.from(files).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.newProduct.imageurls.push(reader.result as string);

        if (!this.imagePreview) {
          this.imagePreview = reader.result as string
        }
      };
      reader.readAsDataURL(file);
    });
  }

  addSpecification(){
    this.newProduct.specifications.push({name:'',value:''});
  }

  removeSpecification(index:number){
    this.newProduct.specifications.splice(index,1);
  }

  addProduct(){

this.newProduct.farmerId = this.farmer?.id;

  if (!this.newProduct.farmerId) {
    this.alert.error('Validation failed', 'Farmer ID is missing. Please login again.');
    return;
  }

  if (!this.newProduct.categoryId) {
    this.alert.error('Validation failed', 'Please select a category.');
    return;
  }


    console.log(this.newProduct);
    this.alert.loading('Saving product', 'Please wait while the product is saved');
    this.ProductService.add(this.newProduct).subscribe({
      next: ()=>{
        this.alert.close();
        this.alert.success('Product saved', 'Your product has been added successfully.');
        this.resetForm();
        this.loadProducts();
        console.log();
        
      },
      error:err =>{
        this.alert.close();
        this.alert.error('Product save failed', this.alert.getErrorMessage(err));
        console.error(err);
      }


    })
  }

  editProduct(p:IProduct){
    this.isEdit = true;

    this.newProduct={
      name:p.product_name,
      price:p.price,
      stock:p.stock,
      available:p.available,
      categoryId:p.category?.id||0,
      farmerId:p.farmer?.id || 0,
      // imageurls:p.images?.[0].imageUrl || [],

      imageurls: p.images ? p.images.map(img => img.imageUrl) : [],
      specifications:p.specifications || [],
      id:p.id      
    }
  }

  updateProduct(){
    if(!this.newProduct.id) return;

    this.ProductService.update(this.newProduct.id,this.newProduct).subscribe({
     next:(res)=>{
        this.alert.success('Product updated', 'The product details were updated successfully.');
        this.resetForm();
        this.loadProducts();
      },
      error:err => {
        this.alert.error('Product update failed', this.alert.getErrorMessage(err));
      
  }})
  }

  // 
  


  async deleteProduct(id: number) {
  const confirmed = await this.alert.confirmDelete('this product');
  if (!confirmed) return;

  console.log("Deleting ID:", id);
  this.alert.loading('Deleting product', 'Please wait while the product is removed');

  this.ProductService.delete(id).subscribe({
    next: (res) => {
      this.alert.close();
      this.alert.toastSuccess('Product deleted');
      console.log(res);
      this.products = this.products.filter(p => p.id !== id);
      if (this.newProduct.id === id) {
        this.resetForm();
      }
    },
    error: (err) => {
      this.alert.close();
      console.log("Delete error:", err);
      console.error(err);
      this.alert.error('Delete failed', this.alert.getErrorMessage(err, 'Delete failed'));
    }
  });
}

  resetForm(){
    this.isEdit=false;
    this.newProduct = this.getEmpatyProduct();
    this.imagePreview=null;
  }

}
