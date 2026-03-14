import { Component, computed, inject, input } from '@angular/core';
import { GetCurrentLangService } from '@core/services/get-current-lang.service';
import { Product } from '@shared/models';
import { ProductBadgesComponent } from "../components/product-badges/product-badges.component";
import { ProductPriceComponent } from "../components/product-price/product-price.component";
import { ProductRateComponent } from "../components/product-rate/product-rate.component";
import { ProductStatusComponent } from "../components/product-status/product-status.component";
import { MEDIA_URL } from '@core/urls';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddProductDialogComponent } from '@shared/components/dialogs/admin/add-product-dialog/add-product-dialog.component';

@Component({
  selector: 'app-admin-product-card',
  imports: [
    ProductBadgesComponent,
    ProductPriceComponent,
    ProductRateComponent,
    ProductStatusComponent,
    RouterModule,
  ],
  templateUrl: './admin-product-card.component.html',
  styleUrl: './admin-product-card.component.scss'
})
export class AdminProductCardComponent {
  readonly product = input.required<Product>()
  private readonly dialog = inject(MatDialog)

  protected readonly currentLang = inject(GetCurrentLangService).currentLang

  protected readonly imgUrl = computed(() => `${MEDIA_URL}${this.product().publicId}-mini`);

  protected openAddProductDialog() {
    const productDialog = this.dialog.open(AddProductDialogComponent, {
      panelClass: ['dialog-full-width'],
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '95vh',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
      data: {
        product: this.product()
      },
      position: {
        left: '0',
        bottom: '0',
      }
    })
  }
}
