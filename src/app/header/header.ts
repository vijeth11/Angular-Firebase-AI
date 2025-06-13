import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Input() cartCount: number = 0;

  onCartClick() {
    // Implement cart click logic (e.g., open cart sidebar or modal)
    alert('Cart clicked!');
  }
}
