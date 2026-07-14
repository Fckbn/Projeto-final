import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AppService } from './app.service';
import { trigger, transition, style, animate, query, group } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
        query(':enter', style({ opacity: 0, transform: 'translateY(16px)' }), { optional: true }),
        group([
          query(':leave', animate('200ms ease', style({ opacity: 0, transform: 'translateY(-16px)' })), { optional: true }),
          query(':enter', animate('260ms ease', style({ opacity: 1, transform: 'translateY(0)' })), { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  backgroundImages = ['img/almoco1.jpg', 'img/almoco2.jpg', 'img/Cerveja.jpg'];
  currentBackgroundIndex = 0;
  private backgroundTimer: any;

  constructor(public appService: AppService, private router: Router) {}

  ngOnInit(): void {
    this.startBackgroundCarousel();
  }

  ngOnDestroy(): void {
    if (this.backgroundTimer) {
      clearInterval(this.backgroundTimer);
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    this.appService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/login']);
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet && outlet.isActivated ? outlet.activatedRoute.routeConfig?.path ?? '' : '';
  }

  private startBackgroundCarousel(): void {
    this.backgroundTimer = setInterval(() => {
      this.currentBackgroundIndex = (this.currentBackgroundIndex + 1) % this.backgroundImages.length;
    }, 3000);
  }
}
