import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardMiniComponent } from './product-card-mini.component';

describe('ProductCardMiniComponent', () => {
  let component: ProductCardMiniComponent;
  let fixture: ComponentFixture<ProductCardMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardMiniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCardMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
