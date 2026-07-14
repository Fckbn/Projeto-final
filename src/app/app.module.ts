import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { HomeComponent } from './home.component';
import { MenuPageComponent } from './menu-page.component';
import { SettingsComponent } from './settings.component';
import { ContactComponent } from './contact.component';
import { CartComponent } from './cart.component';
import { AdminComponent } from './admin.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    MenuPageComponent,
    CartComponent,
    SettingsComponent,
    ContactComponent,
    AdminComponent
  ],
  imports: [BrowserModule, BrowserAnimationsModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
