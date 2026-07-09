import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService, ICategory } from '../../../Services/category.service';
import { IProduct, ProductService } from '../../../Services/product.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule,CurrencyPipe,FormsModule,RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  categoriesList: ICategory[] = [];
  productList: IProduct[] = [];
  selectedCategory: ICategory | null = null;
  searchKeyword = '';
  isLoading = false;

  private searchKeyword$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private categories: CategoryService,
    private productservice: ProductService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.loadCategories();
    this.listenForSearchKeywords();
    this.listenForQueryParamSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadCategories(): void {
    this.categories.getAll().subscribe({
      next: (res) => {
        this.categoriesList = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  
  loadproducts(): void {
    this.isLoading = true;
    this.productservice.getAll().subscribe({
      next: (res) => {
        this.productList = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  selectCategory(c: ICategory): void {
    this.selectedCategory = c;
    this.searchKeyword = '';

    this.productservice.getByCatId(c.id!).subscribe({
      next: (res) => {
        this.productList = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private listenForQueryParamSearch(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.searchKeyword$.next(params.get('keyword') ?? '');
      });
  }

  private listenForSearchKeywords(): void {
    this.searchKeyword$
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((keyword) => {
        this.searchKeyword = keyword.trim();
        this.selectedCategory = null;

        if (!this.searchKeyword) {
          this.loadproducts();
          return;
        }

        this.searchProducts(this.searchKeyword);
      });
  }

  private searchProducts(keyword: string): void {
    this.isLoading = true;

    this.productservice.searchProducts(keyword).subscribe({
      next: (res) => {
        this.productList = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.productList = [];
        this.isLoading = false;
      }
    });
  }
}


