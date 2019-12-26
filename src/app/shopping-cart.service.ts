
import { Observable } from 'rxjs';
import { ShoppingCart } from './models/shopping-cart';
import { Product } from './models/product';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import {ShoppingCartItem} from './models/shopping-cart-item';

@Injectable()
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>> {
    const cartId = await this.getOrCreateCartId();

    let cart = this.db.object('/shopping-carts/' + cartId).snapshotChanges()
    .map(x => new ShoppingCart(x.payload.exportVal().items));
    return cart
  }

  async addToCart(product: Product) { 
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() { 
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove().then(result => {
    });
  }
  

  private create() { 
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async getOrCreateCartId(): Promise<string> { 
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId; 

    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  private async updateItem(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.$key);
    item$
      .snapshotChanges()
      .pipe(
        take(1))
        .subscribe(item => {
          let quantity = change
          if (item.payload.exists()){
            quantity = (item.payload.exportVal().quantity || 0) + change;
          }
          if (quantity === 0) item$.remove();
          else item$.update({
            title: product.title,
            imageUrl: product.imageUrl,
            price: product.price,
            quantity: quantity
          })
        }
      );
  }
}
