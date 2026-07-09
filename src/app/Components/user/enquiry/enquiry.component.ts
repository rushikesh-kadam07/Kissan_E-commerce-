import { Component } from '@angular/core';
import { EnquiryModels, EnquiryService } from '../../../Services/enquiry.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../Services/alert.service';

@Component({
  selector: 'app-enquiry',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './enquiry.component.html',
  styleUrl: './enquiry.component.css'
})
export class EnquiryComponent {

  constructor(private enquiryService: EnquiryService, private alert: AlertService) {}

  save(enquiry: EnquiryModels) {

    this.enquiryService.submitEnquiry(enquiry).subscribe({
      next: () => {
        console.log("Enquiry Submitted...");

        this.alert.success('Success', 'Enquiry submitted successfully');
      },

      error: (err) => {
        console.log(err);

        this.alert.error('Error', 'Failed to submit enquiry');
      }
    });
  }
}
