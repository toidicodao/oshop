import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {
  cart$: Observable<ShoppingCart>;
  constructor(private shoppingCartService: ShoppingCartService, private orderService: OrderService) {}

  async ngOnInit() { 
    this.cart$ = await this.shoppingCartService.getCart();
  }

  
}
