import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProduct, ProductService } from '../../../Services/product.service';
import { RouterLink } from '@angular/router';
import { CategoryService, ICategory } from '../../../Services/category.service';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit, OnDestroy {
  categoriesList: ICategory[] = [];
  productList: IProduct[] = [];
  selectedCategory: ICategory | null = null;
  searchKeyword = '';
  isLoading = false;
  errorMessage = '';

  private searchKeyword$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private categories: CategoryService,
    private productservice: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadproducts();
    this.listenForSearch();
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
    this.errorMessage = '';

    this.productservice.getAll().subscribe({
      next: (res) => {
        this.productList = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Unable to load products. Please try again.';
        this.isLoading = false;
      }
    });
  }

  selectCategory(c: ICategory): void {
    this.selectedCategory = c;
    this.searchKeyword = '';
    this.errorMessage = '';
    this.isLoading = true;

    this.productservice.getByCatId(c.id!).subscribe({
      next: (res) => {
        this.productList = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Unable to load this category. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onSearchChange(keyword: string): void {
    this.searchKeyword$.next(keyword);
  }

  searchNow(): void {
    this.searchKeyword$.next(this.searchKeyword);
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.selectedCategory = null;
    this.loadproducts();
  }

  private listenForSearch(): void {
    this.searchKeyword$
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((keyword) => {
        const value = keyword.trim();
        this.searchKeyword = value;
        this.selectedCategory = null;

        if (!value) {
          this.loadproducts();
          return;
        }

        this.searchProducts(value);
      });
  }

  private searchProducts(keyword: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productservice.searchProducts(keyword).subscribe({
      next: (res) => {
        this.productList = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.productList = [];
        this.errorMessage = 'Search failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
