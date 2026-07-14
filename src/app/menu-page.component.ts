import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService, MenuItem } from './app.service';

@Component({
  selector: 'app-menu-page',
  template: `
    <div class="page-shell">
      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Cardápio</p>
          <h2>{{ title }}</h2>
        </div>
        <div class="menu-items-list">
          <article class="menu-item-card" *ngFor="let item of menuItems">
            <div class="menu-item-header">
              <h3>{{ item.name }}</h3>
              <span class="menu-item-price">R$ {{ item.price.toFixed(2).replace('.', ',') }}</span>
            </div>
            <p>{{ item.description }}</p>
            <div class="menu-item-actions">
              <button class="button primary" (click)="addToCart(item)">Adicionar ao carrinho</button>
              <button class="button outline" (click)="addToAccount(item)">Adicionar à conta</button>
              <button class="button ghost" *ngIf="isAdmin" (click)="deleteItem(item.id)">Excluir</button>
            </div>
          </article>
        </div>
      </section>
    </div>
  `
})
export class MenuPageComponent {
  category: 'almoco' | 'bebidas' | 'lanches' = 'almoco';
  title = 'Almoço';
  menuItems: MenuItem[] = [];

  constructor(private route: ActivatedRoute, public appService: AppService) {
    this.route.params.subscribe((params) => {
      this.category = params['category'] as 'almoco' | 'bebidas' | 'lanches';
      this.title = this.getTitle(this.category);
      this.menuItems = this.appService.getVisibleMenuItems(this.category);
    });
  }

  get isAdmin(): boolean {
    return this.appService.isAdminLogged;
  }

  addToCart(item: MenuItem): void {
    this.appService.addToCart(item);
  }

  addToAccount(item: MenuItem): void {
    this.appService.addToAccount(item);
  }

  deleteItem(id: string): void {
    if (!this.isAdmin) {
      return;
    }
    this.appService.deleteMenuItem(id);
    this.menuItems = this.appService.getVisibleMenuItems(this.category);
  }

  private getTitle(category: 'almoco' | 'bebidas' | 'lanches'): string {
    switch (category) {
      case 'almoco':
        return 'Almoço';
      case 'bebidas':
        return 'Bebidas';
      case 'lanches':
        return 'Lanches / Petiscos';
      default:
        return 'Cardápio';
    }
  }
}
