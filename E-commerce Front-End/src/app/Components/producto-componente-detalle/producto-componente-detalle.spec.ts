import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoComponenteDetalle } from './producto-componente-detalle';

describe('ProductoComponenteDetalle', () => {
  let component: ProductoComponenteDetalle;
  let fixture: ComponentFixture<ProductoComponenteDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductoComponenteDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoComponenteDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
