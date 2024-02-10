import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandSearcherComponent } from './brand-searcher.component';

describe('BrandSearcherComponent', () => {
  let component: BrandSearcherComponent;
  let fixture: ComponentFixture<BrandSearcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandSearcherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrandSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
