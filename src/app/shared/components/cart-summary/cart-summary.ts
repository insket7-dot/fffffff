import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CartService } from '@app/shared/services/cart/cart.service';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [IonicModule, TranslateModule],
  templateUrl: './cart-summary.html',
  styleUrls: ['./cart-summary.scss'],
})
export class CartSummaryComponent {
  private readonly cartService = inject(CartService);

  // 购物车数据
  protected readonly cartList = this.cartService.cartList;
  protected readonly cartTotal = this.cartService.cartTotal;

  // 确认订单
  confirmOrder() {
    // 这里可以添加确认订单的逻辑
    console.log('Confirm order');
  }
}
