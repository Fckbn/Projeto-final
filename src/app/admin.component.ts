import { Component } from '@angular/core';
import { AppService, MenuItem } from './app.service';

@Component({
  selector: 'app-admin',
  template: `
    <div class="page-shell">
      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Painel Admin</p>
          <h2>Gerenciar itens do cardápio</h2>
        </div>

        <article class="dashboard-card admin-card">
          <form class="auth-form admin-form" (ngSubmit)="addItem()">
            <label>
              Nome do item
              <input type="text" [(ngModel)]="itemName" name="itemName" required />
            </label>
            <label>
              Descrição
              <textarea rows="3" [(ngModel)]="itemDescription" name="itemDescription" required></textarea>
            </label>
            <label>
              Categoria
              <select [(ngModel)]="itemCategory" name="itemCategory" required>
                <option value="almoco">Almoço</option>
                <option value="lanches">Lanches</option>
                <option value="bebidas">Bebidas</option>
              </select>
            </label>
            <label>
              Preço
              <input type="number" min="0" step="0.01" [(ngModel)]="itemPrice" name="itemPrice" required />
            </label>
            <label class="checkbox-row">
            </label>
            <button class="button primary" type="submit">Adicionar item</button>
          </form>
        </article>

        <div class="section-heading" style="margin-top: 28px;">
          <h3>Itens existentes</h3>
        </div>

        <div class="menu-items-list">
          <article class="menu-item-card" *ngFor="let item of menuItems">
            <div class="menu-item-header">
              <div>
                <h3>{{ item.name }}</h3>
                <p class="menu-item-description">{{ item.description }}</p>
              </div>
              <span class="menu-item-price">R$ {{ item.price.toFixed(2).replace('.', ',') }}</span>
            </div>
            <p class="menu-item-meta">Categoria: {{ getTitle(item.category) }} | Status: <strong>{{ item.available ? 'Ativo' : 'Inativo' }}</strong></p>
            <div class="menu-item-actions">
              <button class="button outline" type="button" (click)="toggleAvailability(item.id)">
                {{ item.available ? 'Desativar' : 'Ativar' }}
              </button>
              <button class="button ghost" type="button" (click)="deleteItem(item.id)">Excluir</button>
            </div>
          </article>
        </div>

        <button class="button outline" routerLink="/home">Voltar</button>
      </section>
    </div>
  `
})
export class AdminComponent {
  itemName = '';
  itemDescription = '';
  itemCategory: 'almoco' | 'bebidas' | 'lanches' = 'almoco';
  itemPrice: number | null = null;
  itemAvailable = true;
  menuItems: MenuItem[] = [];

  constructor(public appService: AppService) {
    this.refreshItems();
  }

  addItem(): void {
    if (!this.itemName.trim() || !this.itemDescription.trim() || this.itemPrice === null) {
      return;
    }

    this.appService.addMenuItem({
      id: this.appService.generateId(),
      name: this.itemName.trim(),
      description: this.itemDescription.trim(),
      category: this.itemCategory,
      price: this.itemPrice,
      available: this.itemAvailable
    });

    this.clearForm();
    this.refreshItems();
  }

  toggleAvailability(id: string): void {
    this.appService.toggleItemAvailability(id);
    this.refreshItems();
  }

  deleteItem(id: string): void {
    this.appService.deleteMenuItem(id);
    this.refreshItems();
  }

  getTitle(category: 'almoco' | 'bebidas' | 'lanches'): string {
    return category === 'almoco' ? 'Almoço' : category === 'bebidas' ? 'Bebidas' : 'Lanches';
  }

  private clearForm(): void {
    this.itemName = '';
    this.itemDescription = '';
    this.itemCategory = 'almoco';
    this.itemPrice = null;
    this.itemAvailable = true;
  }

  private refreshItems(): void {
    this.menuItems = this.appService.menuItems;
  }
}
