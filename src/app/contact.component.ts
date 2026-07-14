import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  template: `
    <div class="page-shell">
      <section class="section-block contact-block">
        <div class="section-heading">
          <p class="eyebrow">Contato</p>
          <h2>Entre em contato e monte a sua noite conosco.</h2>
        </div>
        <article class="contact-card">
          <p><strong>Telefone:</strong> (11) 99999-0000</p>
          <p><strong>Endereço:</strong> Rua das Flores, 123 — São Paulo</p>
          <p><strong>Horário:</strong> terça a domingo, das 18h às 00h</p>
        </article>
      </section>
    </div>
  `
})
export class ContactComponent {}
