import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private appService: AppService, private router: Router) {}

  canActivate(): boolean {
    if (this.appService.isAdminLogged) {
      return true;
    }

    this.router.navigate([this.appService.isLoggedIn ? '/home' : '/login']);
    return false;
  }
}
