import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdimLoginComponent } from './adim-login.component';

describe('AdimLoginComponent', () => {
  let component: AdimLoginComponent;
  let fixture: ComponentFixture<AdimLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdimLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdimLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
