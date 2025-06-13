import { Routes } from '@angular/router';
import { CartComponent } from './cart/cart';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
