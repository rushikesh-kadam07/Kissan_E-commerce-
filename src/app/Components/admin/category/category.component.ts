import { Component, OnInit } from '@angular/core';
import { CategoryService, ICategory } from '../../../Services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: ICategory[] = [];

  newCategory: ICategory = {
    name: '',
    imageurl: ''
  };

  isEdit = false;
  imagePreview: string | null = null;

  success = '';
  error = '';

  constructor(private category: CategoryService, private alert: AlertService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // ✅ IMAGE SELECT (BASE64)
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.newCategory.imageurl = reader.result as string;
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ✅ LOAD
  loadCategories() {
    this.category.getAll().subscribe({
      next: (res: any[]) => {
        console.log(res);
        this.categories = res;
      },
      error: (err) => {
        console.error("Error fetching Categories", err);
      }
    });
  }

  // ✅ ADD
  saveCategory() {
    this.category.add(this.newCategory).subscribe({
      next: () => {
        this.success = 'Category added successfully';
        this.alert.success('Category added', 'The category was saved successfully.');
        this.loadCategories();
        this.resetForm();
      },
      error: (err: any) => {
        this.error = err.error || err.message;
        this.alert.error('Category save failed', this.alert.getErrorMessage(err));
      }
    });
  }

  // ✅ EDIT CLICK
  editCategory(c: ICategory) {
    this.isEdit = true;
    this.newCategory = { ...c };
    this.imagePreview = c.imageurl;
  }

  // ✅ UPDATE
  updateCategory() {
    if (!this.newCategory.id) return;

    this.category.update(this.newCategory.id, this.newCategory).subscribe({
      next: () => {
        this.success = 'Category updated successfully';
        this.alert.success('Category updated', 'The category was updated successfully.');
        this.loadCategories();
        this.resetForm();
      },
      error: (err: any) => {
        this.error = err.error || err.message;
        this.alert.error('Category update failed', this.alert.getErrorMessage(err));
      }
    });
  }

  // ✅ DELETE
  async deleteCategory(id: number | undefined) {
    if (!id) return;
    const confirmed = await this.alert.confirmDelete('this category');
    if (!confirmed) return;

    this.category.delete(id).subscribe({
      next: () => {
        this.success = 'Category deleted successfully';
        this.alert.toastSuccess('Category deleted');
        this.loadCategories();
      },
      error: (err: any) => {
        this.error = err.error || err.message || 'Failed to delete';
        this.alert.error('Delete failed', this.alert.getErrorMessage(err, 'Failed to delete category.'));
      }
    });
  }

  // ✅ RESET
  resetForm() {
    this.isEdit = false;
    this.newCategory = { name: '', imageurl: '' };
    this.imagePreview = null;
  }
}
