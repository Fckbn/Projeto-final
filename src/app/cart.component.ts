import { Component } from '@angular/core';
import { AppService, MenuItem } from './app.service';

@Component({
  selector: 'app-cart',
  template: `
    <div class="page-shell">
      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Carrinho</p>
          <h2>Itens no seu carrinho</h2>
        </div>

        <div *ngIf="cartItems.length; else emptyCart">
          <div class="cart-items-list">
            <article class="menu-item-card" *ngFor="let item of cartItems">
              <div class="menu-item-header">
                <h3>{{ item.name }}</h3>
                <span class="menu-item-price">R$ {{ item.price.toFixed(2).replace('.', ',') }}</span>
              </div>
              <p>{{ item.description }}</p>
              <div class="menu-item-actions">
                <button class="button outline" (click)="addToAccount(item)">Adicionar à conta</button>
              </div>
            </article>
          </div>

          <div class="cart-summary">
            <p><strong>Total do carrinho:</strong> R$ {{ totalCartValue.toFixed(2).replace('.', ',') }}</p>
            <button class="button primary" (click)="payTotal()">Pagar total</button>
          </div>

          <button class="button secondary" (click)="clearCart()">Limpar carrinho</button>
        </div>

        <ng-template #emptyCart>
          <p>Seu carrinho está vazio.</p>
        </ng-template>

        <button class="button outline" routerLink="/home">Voltar</button>
      </section>
    </div>
  `
})
export class CartComponent {
  constructor(public appService: AppService) {}

  get cartItems(): MenuItem[] {
    return this.appService.getCartItems();
  }

  get totalCartValue(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price, 0);
  }

  payTotal(): void {
    this.appService.payCart();
  }

  addToAccount(item: MenuItem): void {
    this.appService.addCartItemToAccount(item);
  }

  clearCart(): void {
    this.appService.clearCart();
  }
}
