// import { Injectable } from '@angular/core';
// import { AngularFireDatabase } from 'angularfire2/database';
// import { Product } from './models/product';
// import "rxjs/add/operator/take";
// // import "rxjs/add/operator/map";
// import { map } from 'rxjs/operators';
// import {ShoppingCart} from './models/shopping-cart'
// import { Observable } from 'rxjs/Observable';
// @Injectable()
// export class ShoppingCartService {

//   constructor(private db: AngularFireDatabase) { }
//   create(){
//     return this.db.list('/shopping-carts').push({
//       dateCreate: new Date().getTime()
//     })
//   }

//   // getCart(cartId: string){
//   //   return this.db.object('/shopping-carts/' + cartId);
//   // }

//   async getCart(): Promise<Observable<ShoppingCart>> {
//     let cartId = await this.getOrCreateCartId();
//     return this.db.object('/shopping-carts/' + cartId)
//     .valueChanges()
//     .pipe(
//       map(x => new ShoppingCart(x.items))
//     )
//   }

//   private async getOrCreateCartId(): Promise<string>{
//     let cartId = localStorage.getItem('cartId')
//     if (!cartId){
//       let result = await this.create();
//       localStorage.setItem('cartId', result.key);
//       return result.key
      
//     }else{
//       return cartId
//     }
//   }

//   private getItem(cartId: string, productId: string){
//     return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
//   }

//   private async updateItem(product: Product, change: number){
//     let cartId =  await this.getOrCreateCartId();
//     let items$ = this.getItem(cartId, product.$key)

    
//     items$.valueChanges().take(1).subscribe(item => {
//       // if (item.$exists()){
//       //   items$.update({quantity: item.quantity + 1})
//       // }else{
        
//       // }

//       // let quantity = (item.quantity || 0) + change
//       //   items$.update({
//       //     title: product.title,
//       //     imageUrl: product.imageUrl,
//       //     price: product.price,
//       //     quantity: quantity
//       //   })
//       //   items$.update({
//       //     quantity: item.quantity + 1
//       //   // })
//       // }
//     });
    
//   }

//   addToCart(product: Product){
//     this.updateItem(product, 1)
//   }
// }



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

    let xxx = this.db.object('/shopping-carts/' + cartId).snapshotChanges()
    .map(x => new ShoppingCart(x.payload.exportVal().items));

    // let xxxx = this.db.object('/shopping-carts/' + cartId).snapshotChanges()
    console.log(xxx);
    return xxx
    // .pipe(
    // //   take(1))
    // //   .subscribe(
    // //     item => {
    // //       new ShoppingCart(x.payload.exportVal().items)
    // //     }
    // //   )
    //   map( x => 
    //     new ShoppingCart(x.payload.exportVal().items)
    //   )
    // );
  }

  async addToCart(product: Product) { 
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() { 
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
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
