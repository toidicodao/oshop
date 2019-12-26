import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import {map, startWith} from "rxjs/operators";
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }
  create(product){
    return this.db.list('/products').push(product);
  }
  getAll(){
    return this.db.list('/products');
  }
  getAll3(): Observable<Product[]> {
    return this.db.list<Product>('/products')
        .snapshotChanges()
        .pipe(
            map(changes =>
                changes.map(c => {
                    let data = c.payload.val() as Product;
                    data.$key = c.payload.key;
                    return { ...data };
                })
            )
        );
}

  get(productId){
    return this.db.object('/products/' + productId);
  }
  update(productId, product){
    return this.db.object('/products/' + productId).update(product);
  }
  delete(productId){
    return this.db.object('/products/' + productId).remove();
  }
}
