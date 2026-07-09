import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnquiryModels, EnquiryService } from '../../../Services/enquiry.service';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
   constructor(
    private enquiryService: EnquiryService,
    private alert: AlertService
  ) {}

  save(enquiry: EnquiryModels) {

    this.enquiryService.submitEnquiry(enquiry).subscribe({
      next: () => {
        console.log("Enquiry Submitted...");

        this.alert.success('Success', 'Contact With You Soon..!');
      },

      error: (err) => {
        console.log(err);

        this.alert.error('Error', 'Failed to submit enquiry');
      }
    });
  }

 


}
