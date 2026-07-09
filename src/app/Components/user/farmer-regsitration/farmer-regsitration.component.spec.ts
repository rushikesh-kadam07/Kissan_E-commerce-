import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerRegsitrationComponent } from './farmer-regsitration.component';

describe('FarmerRegsitrationComponent', () => {
  let component: FarmerRegsitrationComponent;
  let fixture: ComponentFixture<FarmerRegsitrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerRegsitrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FarmerRegsitrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
