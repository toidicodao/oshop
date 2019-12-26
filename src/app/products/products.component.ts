import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { CategoryService } from '../category.service';
import { Product } from '../models/product';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCart } from './../models/shopping-cart';
import 'rxjs/add/operator/switchMap'
import { ShoppingCartService } from '../shopping-cart.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products$;
  categories$;
  category: string;
  products: Product[] = []
  cart$: Observable<ShoppingCart>;
  constructor(
    productService: ProductService,
    categoryService: CategoryService ,
    route: ActivatedRoute,
    private shoppingCartService: ShoppingCartService
  ) { 

    this.products$ = productService.getAll3()
    this.categories$ = categoryService.getCategories();

    route.queryParamMap.subscribe(params => {
      this.category = params.get('category');
      const that = this
      if (this.category){
        this.products$.forEach(function (value) {
          let prodcut_tmp: Product[] = value as Product[]
          that.products = prodcut_tmp.filter(p => p.category === that.category)
        });
      }else{
        this.products$.forEach(function (value) {
          that.products = value as Product[]
        }); 
      }
    })
  }
  
  async ngOnInit(){
    this.cart$ = await this.shoppingCartService.getCart()
  }  
}
