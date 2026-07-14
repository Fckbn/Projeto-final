import { Component } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-settings',
  template: `
    <div class="page-shell">
      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Configurações</p>
          <h2>Seus dados pessoais</h2>
        </div>
        <article class="dashboard-card settings-card">
          <p><strong>Nome:</strong> {{ appService.currentUser?.name }}</p>
          <p><strong>E-mail:</strong> {{ appService.currentUser?.email }}</p>
          <p><strong>Tipo de conta:</strong> {{ appService.isAdminLogged ? 'Administrador' : 'Cliente' }}</p>
          <div *ngIf="!appService.isAdminLogged">
            <h3>Conta ativa</h3>
            <p><strong>Status:</strong> {{ accountPaidStatus ? 'Pago' : 'Aberta' }}</p>
            <div *ngIf="currentAccountItems.length; else noAccountItems">
              <ul>
                <li *ngFor="let item of currentAccountItems">{{ item.name }} — R$ {{ item.price.toFixed(2).replace('.', ',') }}</li>
              </ul>
              <p class="account-total"><strong>Total da conta:</strong> R$ {{ currentAccountTotal.toFixed(2).replace('.', ',') }}</p>
            </div>
            <ng-template #noAccountItems>
              <p>Nenhum item na conta ainda.</p>
            </ng-template>
          </div>

          <div *ngIf="appService.isAdminLogged">
            <h3>Contas dos clientes</h3>
            <div *ngFor="let account of allAccounts" class="account-summary">
              <div class="account-summary-header">
                <strong>{{ account.name }}</strong> ({{ account.email }})
                <span class="account-status {{ account.paid ? 'paid' : 'open' }}">{{ account.paid ? 'Pago' : 'Aberto' }}</span>
              </div>
              <div *ngIf="account.accountItems.length; else noItems">
                <ul>
                  <li *ngFor="let item of account.accountItems">{{ item.name }} — R$ {{ item.price.toFixed(2).replace('.', ',') }}</li>
                </ul>
                <p class="account-total"><strong>Total da conta:</strong> R$ {{ getAccountTotal(account.accountItems).toFixed(2).replace('.', ',') }}</p>
                <button class="button primary" *ngIf="!account.paid" (click)="markAsPaid(account.email)">Marcar como pago</button>
              </div>
              <ng-template #noItems>
                <p>Sem itens nessa conta.</p>
              </ng-template>
            </div>
          </div>

          <button class="button outline" routerLink="/home">Voltar</button>
        </article>
      </section>
    </div>
  `
})
export class SettingsComponent {
  constructor(public appService: AppService) {}

  get currentAccountItems() {
    return this.appService.getAccountItemsForCurrent();
  }

  get accountPaidStatus(): boolean {
    return this.appService.getCurrentAccountPaidStatus();
  }

  get currentAccountTotal(): number {
    return this.currentAccountItems.reduce((sum, item) => sum + item.price, 0);
  }

  get allAccounts() {
    return this.appService.getAllAccountSummaries();
  }

  getAccountTotal(items: { price: number }[]): number {
    return items.reduce((sum, item) => sum + item.price, 0);
  }

  markAsPaid(email: string): void {
    this.appService.setAccountPaidStatus(email, true);
  }
}
