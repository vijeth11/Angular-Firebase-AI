import { Injectable } from '@angular/core';
import { Product, PRODUCTS } from './../../models/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  public getProducts(): Product[] {
    return PRODUCTS;
  }
}
