import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedbackService } from '../../../Services/feedback.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent  implements OnInit{

  feedbackForm!:FormGroup
  submitting=false;
  submitted=false;

  constructor(private fb : FormBuilder,private feedbackService: FeedbackService){}
  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      name:['',Validators.required],
      email:['',Validators.required,Validators.email],
      mobile:['',Validators.required],
      productQuality:[0,Validators.required],
      productPrice:[0,Validators.required],
      orderProcess:[0,Validators.required],
      deliveryService:[0,Validators.required],
      suggestion:['',Validators.required]
    });
  }

  setRating(controlName:string, rating:number) {
    this.feedbackForm.get(controlName)?.setValue(rating);
  }

  submit(){
    if(this.feedbackForm.invalid) return ;
    this.submitting = true;

    this.feedbackService.submit(this.feedbackForm.value).subscribe({
      next:()=>{
        this.submitting=false;
        this.submitted= true;
        this.feedbackForm.reset();
      },
      error:()=>{
        this.submitting=false;
      }
    });
  }



}
