import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  template: `
    <div class="page-shell">
      <section class="section-block contact-block">
        <div class="section-heading">
          <p class="eyebrow">Contato</p>
          <h2>Entre em contato e faça seu pedido.</h2>
        </div>
        <article class="contact-card">
          <p><strong>Telefone/WhatsApp:</strong> (71) 99243-1981</p>
          <p><strong>Endereço:</strong> Salvador, BA</p>
          <p><strong>Horário:</strong> terça a domingo, das 8h às 20h</p>
        </article>
      </section>
    </div>
  `
})
export class ContactComponent {}
