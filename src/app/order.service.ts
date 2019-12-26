import { ShoppingCartService } from './shopping-cart.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable()
export class OrderService {

  constructor(private db: AngularFireDatabase, private shoppingCartService: ShoppingCartService) { }

  async placeOrder(order) {
    let result = await this.db.list('/orders').push(order);
    this.shoppingCartService.clearCart();
    return result;
  }

  getOrders() { 
    return this.db.list('/orders');
  }

  getOrdersByUser(userId: string) {

    let my_order = this.db.list('/orders').snapshotChanges()
    .map(changes  => changes.map(y => (
      { 
        key: y.payload.key, ...y.payload.val()
      }
     )
    ))
    return my_order
    // let  my_order = this.db.list('/orders', ref => ref.orderByChild('userId').equalTo(userId))
    // let xxx = this.db.object('/orders').valyeChanges().subscribe(data => {
    //   console.log(data.valueChanges);
    // });
    // return this.db.list('/orders', {
    //   query: {
    //     orderByChild: 'userId',
    //     equalTo: userId        
    //   }
    // });
  }
}
