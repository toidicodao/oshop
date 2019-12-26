import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/product.service';
import { Subscription } from 'rxjs/Subscription';
import { DataTableResource } from 'angular5-data-table';
import { Product } from 'src/app/models/product';
// import undefined = require('firebase/empty-import');
@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit, OnDestroy{
  products: Product[] ;
  filteredProducts: any[];
  subscription: Subscription;
  items: Product[] = [];
  itemCount: number;
  tableResource: DataTableResource<Product>
  constructor( private productService: ProductService) {
    this.subscription = this.productService.getAll3().subscribe(
      products => {
        this.products = products;
        this.initializeTable(products);
      }
    )
   }

   private initializeTable(products:Product[]){
    this.tableResource = new DataTableResource(products);
        this.tableResource.query({ offset: 0})
        .then(items => this.items = items);
        this.tableResource.count()
        .then(count => this.itemCount = count);
   }

   reloadItems(params){
     if(!this.tableResource) return;
    this.tableResource.query(params)
        .then(items => this.items = items);
   }

   filter(query: string) { 
    let filteredProducts = (query) ?
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
      this.products;

    this.initializeTable(filteredProducts);
  }

  //  filter(query: string){
  //    // Set lại danh sách rỗng trước khi tìm kiếm
  //    this.products = []
  //    // Kiểm tra từ nhập vào có hay không
  //    if (query) {
  //     this.products.filter(p => {
  //       // p.payload.val() as Product
  //       // xxx: Produ = p.payload as 
  //       console.log(p.title)
  //       // Kiểm tra xem kết quả tìm kiếm có trang danh sách products
  //       if (p.title.toLowerCase().includes(query.toLowerCase())) {
  //         // Nếu có thì sẽ đẩy vào danh sách filteredProducts
  //         // Không có thì bỏ qua
  //         this.products.push(p)
  //       }
  //     })
  //    }else{
  //      // Nếu ng dùng k nhập từ tìm kiếm thì sẽ gán lại danh sách như khi ms load trang
  //       this.products = this.products
  //    }
  //  }
   
   ngOnInit(){

   }
   ngOnDestroy(){
    this.subscription.unsubscribe();
   }
}
