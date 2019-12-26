import { Component, OnInit, Input } from '@angular/core';
import { ShoppingCart } from '../models/shopping-cart';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { async } from '@angular/core/testing';
import { OrderService } from '../order.service';
import {Order} from './../models/order'
@Component({
  selector: 'shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.scss']
})
export class ShippingFormComponent implements OnInit {
  @Input('cart') cart: ShoppingCart;
  userId: string;
  shipping = {}
  userSubscription: Subscription;
  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user.uid);
  }
  ngOnDestroy() { 
    this.userSubscription.unsubscribe();
  }

  async placeOrder(){
    let order = new Order(this.userId, this.shipping, this.cart)
    let result = await this.orderService.placeOrder(order)
    this.router.navigate(['/order-success', result.key]);
  }

}
