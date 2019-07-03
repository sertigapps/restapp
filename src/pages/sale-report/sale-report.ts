import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslationPipe } from "../../pipes/translation/translation";
import { Order } from '../../app/models/order';
import { Http } from '@angular/http';
import { CartProvider } from '../../providers/cart/cart';
import { MenuProvider } from '../../providers/menu/menu';

@IonicPage()
@Component({
  selector: 'page-sale-report',
  templateUrl: 'sale-report.html',
})
export class SaleReportPage {
  monthnames:Array<String>=[];
  startdate:any;
  report_orders: Array<Order> = [];
  report_indexes: any ;
  report_objects: any ;
  index_array: any ;
  report_type:String;
  qty_total :number;
  total:number;
  loading_report:boolean=false;
  enddate:any;
  constructor(public http: Http,public cartprovider: CartProvider,public menuprovider: MenuProvider, public translate : TranslationPipe,public navCtrl: NavController, public navParams: NavParams) {
    this.monthnames = [ translate.transform('january'),translate.transform('february'),translate.transform('march'),
    translate.transform('april'),translate.transform('may'),translate.transform('june'),
    translate.transform('july'),translate.transform('august'),translate.transform('september'),
    translate.transform('october'),translate.transform('november'),translate.transform('december')
  ];
    var date = new Date();
    this.startdate = date.toISOString();
    this.enddate = date.toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SaleReportPage');
  }
  generate_report(){
    this.loading_report = true;
    this.cartprovider.fetch_report_orders(this.startdate,this.enddate).subscribe(data=>{
      this.loading_report = false;
      this.report_orders = [];
      data.forEach(c=>{
        this.report_orders.push(new Order(c.id,c.emailaddress,c.personid,c.create_date,c.total,c,this.http));
      });
      this.show_report('byitem');
    });
  }
  show_report(type){
    switch(type){
      case 'byitem':
          this.report_objects= {};
          this.report_indexes= {};
          this.qty_total = 0;
          this.total = 0;
          this.report_orders.forEach((o)=>{
            if(!this.report_objects[o.full_record.item_id]){
              this.report_indexes[o.full_record.item_id] = o.full_record.item_name;
              this.report_objects[o.full_record.item_id] = {'qty':parseInt(o.full_record.quantity),'total':o.full_record.total};
            }
            else{
              this.report_objects[o.full_record.item_id] = {'qty':parseInt(this.report_objects[o.full_record.item_id]['qty'])+parseInt(o.full_record.quantity),
                  'total':this.report_objects[o.full_record.item_id]['total']+o.full_record.total};
            }
            this.total +=o.full_record.total;
            this.qty_total +=parseInt(o.full_record.quantity);
          });
          this.index_array = Object.keys(this.report_indexes);
          this.report_type = "byitem";
        break;
      case 'bycat':
          this.report_objects= {};
          this.report_indexes= {};
          this.qty_total = 0;
          this.total = 0;
          this.report_orders.forEach((o)=>{
            if(!this.report_objects[o.full_record.category_id]){
              var cat = this.menuprovider.getcat(o.full_record.category_id);
              this.report_indexes[o.full_record.category_id] = (cat)?cat.name:'Deleted Cat';
              this.report_objects[o.full_record.category_id] = {'qty':o.full_record.quantity,'total':o.full_record.total};
            }
            else{
              this.report_objects[o.full_record.category_id] = {'qty':this.report_objects[o.full_record.category_id]['qty']+o.full_record.quantity,
                  'total':this.report_objects[o.full_record.category_id]['total']+o.full_record.total};
            }
            this.total +=o.full_record.total;
            this.qty_total +=o.full_record.quantity;
          });
          this.index_array = Object.keys(this.report_indexes);
          this.report_type = "bycat";
        break;
        case 'byuser':
            this.report_objects= {};
            this.report_indexes= {};
            this.qty_total = 0;
            this.total = 0;
            this.report_orders.forEach((o)=>{
              if(!this.report_objects[o.full_record.emailaddress]){
                this.report_indexes[o.full_record.emailaddress] = o.full_record.personname + ' ' + o.full_record.personlastname+' '+o.full_record.emailaddress;
                this.report_objects[o.full_record.emailaddress] = {'qty':o.full_record.quantity,'total':o.full_record.total};
              }
              else{
                this.report_objects[o.full_record.emailaddress] = {'qty':this.report_objects[o.full_record.emailaddress]['qty']+o.full_record.quantity,
                    'total':this.report_objects[o.full_record.emailaddress]['total']+o.full_record.total};
              }
              this.total +=o.full_record.total;
              this.qty_total +=o.full_record.quantity;
            });
            this.index_array = Object.keys(this.report_indexes);
            this.report_type = "byuser";
          break;
    }
  }

}
