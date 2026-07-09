import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule,RouterLink, FooterComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
    constructor(private router:Router){}

    isReportOpen=false;

logout(){
  localStorage.removeItem('admin');
  this.router.navigate(['/']);
}

  toggle()
  {
    this.isReportOpen = ! this.isReportOpen;
  }

}



