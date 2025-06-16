import { Component, inject, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() cartCount: number = 0;
  private router = inject(Router);

  onCartClick() {
    // Implement cart click logic (e.g., open cart sidebar or modal)
    this.router.navigate(['/cart']);
  }

  onHomeClick() {
    this.router.navigate(['/home']);
  }
}
