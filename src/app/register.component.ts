import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="page-shell auth-page">
      <div class="auth-panel">
        <h2>Criar conta</h2>
        <form class="auth-form" (ngSubmit)="register()">
          <label>
            Nome completo
            <input type="text" [(ngModel)]="name" name="name" required />
          </label>
          <label>
            E-mail
            <input type="email" [(ngModel)]="email" name="email" required />
          </label>
          <label>
            Senha
            <input type="password" [(ngModel)]="password" name="password" required />
          </label>
          <div class="lgpd-container">
            <p class="lgpd-text">
              Os dados serão mantidos em nossa base de dados, só enquanto for desejado por você.
              A qualquer momento, será possível editar ou remover tais dados.
            </p>

            <div class="lgpd-checkbox-group">
              <label>
                <input type="checkbox" [(ngModel)]="acceptedTerms" name="acceptedTerms" class="lgpd-checkbox" />
                <span>Sim. Li e concordo com os <a href="https://policies.google.com/privacy?hl=pt-BR&client_theme=dark" target="_blank">Termos e Condições</a>.</span>
              </label>
            </div>
          </div>
          <button class="button primary" type="submit" [disabled]="!acceptedTerms">Criar conta</button>
        </form>
        <p class="auth-tip">Já tem conta? <a routerLink="/login">Entrar</a></p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  acceptedTerms = false;

  constructor(private appService: AppService, private router: Router) {}

  register(): void {
    if (!this.acceptedTerms) {
      return;
    }

    const success = this.appService.register(this.name, this.email, this.password);
    if (success) {
      this.router.navigate(['/home']);
    }
  }
}
