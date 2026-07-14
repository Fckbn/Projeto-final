import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="page-shell">
      <section class="hero">
        <div class="hero-copy">
          <h1>Seu favorito para almoçar :) </h1>
          <p class="hero-text">No Acantos Bar, o ambiente acolhedor encontra pratos bem feitos, drinks e petiscos para cada visita.</p>
          <div class="hero-actions">
            <a class="button primary" routerLink="/menu/almoco">Almoço</a>
            <a class="button outline" routerLink="/menu/lanches">Lanches</a>
            <a class="button outline" routerLink="/menu/bebidas">Bebidas</a>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {}
