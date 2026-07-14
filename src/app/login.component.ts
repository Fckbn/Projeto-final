import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './app.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="page-shell auth-page">
      <div class="auth-panel">
        <h2>Entrar</h2>
        <form class="auth-form" (ngSubmit)="login()">
          <label>
            Usuário ou e-mail
            <input type="text" [(ngModel)]="loginValue" name="loginValue" required />
          </label>
          <label>
            Senha
            <input type="password" [(ngModel)]="passwordValue" name="passwordValue" required />
          </label>
          <button class="button primary" type="submit">Acessar conta</button>
        </form>

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

        <form class="auth-form" (ngSubmit)="guestLogin()">
          <label>
            Entrar como convidado
            <input type="text" [(ngModel)]="guestName" name="guestName" placeholder="Nome do convidado" required />
          </label>
          <button class="button outline" type="submit" [disabled]="!acceptedTerms">Entrar como convidado</button>
        </form>

        <p class="auth-tip">Não tem conta? <a routerLink="/register">Criar conta</a></p>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginValue = '';
  passwordValue = '';
  guestName = '';
  acceptedTerms = false;

  constructor(private appService: AppService, private router: Router) {}

  login(): void {
    if (!this.acceptedTerms) {
      return;
    }

    const success = this.appService.login(this.loginValue, this.passwordValue);
    if (success) {
      this.router.navigate(['/home']);
    }
  }

  guestLogin(): void {
    if (!this.acceptedTerms) {
      return;
    }

    const success = this.appService.guestLogin(this.guestName);
    if (success) {
      this.router.navigate(['/home']);
    }
  }
}
