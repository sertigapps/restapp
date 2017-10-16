import { Component } from '@angular/core';
import { IonicPage,NavController, ActionSheetController,AlertController,ToastController, Platform,NavParams, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { MenuProvider } from '../../providers/menu/menu';
import { CartProvider } from '../../providers/cart/cart';
import { TranslationPipe } from "../../pipes/translation/translation";

/**
 * Generated class for the MenuCategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-item',
  templateUrl: 'show-item.html',
})
export class ShowItemPage {
  item: any;
  sections_open : any = {};
  ingredients : any;
  ingredients_selected:any;
  extras_added : any;
  ingredients_included : any;
  extras:any;
  type_selected:any;
  comment_order:String;

  item_type:any;
  item_type_selected:any;
  ingredients_menu:any;
  ingredients_item:any;
  ingredients_item_selected:any;
  ingredients_item_included:any;
  extras_item:any;
  extras_item_added:any;
  quantity:number;
  quantities : Array<number> = [1,2,3,4,5,6,7,8,9,10];
  total_base:number;
  current_total :number;
  total:number;
  loading:any;
  disabled_types:any;

  extra_price:any;
  extra_total:any;
  disabled_order:boolean=false;

  constructor(public translate : TranslationPipe,public userprovider:UserProvider,public menuprovider:MenuProvider, public navCtrl: NavController,  
                public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController,public cartprovider:CartProvider,
                public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public navParams: NavParams) {

  this.item = this.navParams.get('item');
  this.extra_price = {};
  this.ingredients =(this.item.full_record.ingredients)? JSON.parse(JSON.stringify(this.item.full_record.ingredients)):[];
  this.ingredients_selected =(this.item.full_record.ingredients)? JSON.parse(JSON.stringify(this.item.full_record.ingredients)):[];
  this.ingredients_included = {};
  this.ingredients.forEach(i => {
    this.ingredients_included[i.split(',')[0]]= true;
  });
  this.extras = this.menuprovider.ingredients.filter(i=>{
    return !this.ingredients_included[i.id];
  });
  
  if(this.item.full_record.price_label.length==1){
    this.type_selected = this.item.full_record.price_label[0];
    this.current_total = parseInt(this.item.full_record.prices[0]); 
  }
  var price= this.navParams.get('price');
  if(price){
    this.disabled_types = true;
    this.current_total = parseInt(price);
  }
  var label= this.navParams.get('label');
  if(label && !this.item.full_record.menu_flag && this.item.full_record.menu_flag !=1 ){
    this.type_selected = label;
  }
  this.quantity = 1;
  if(this.current_total){
    this.total = this.current_total * this.quantity;
    this.total_base = JSON.parse(JSON.stringify(this.current_total)) ;
  }
  if(this.item.full_record.menu_flag && this.item.full_record.menu_flag ==1 && this.item.full_record.included){
    this.ingredients_menu = [];
    this.ingredients_item_selected = {};
    this.item_type = {};
    this.item_type_selected = {};
    this.ingredients_item ={};
    this.ingredients_item_included={};
    this.extras_item ={};
    this.extras_item_added = {};
    this.item.full_record.included.forEach((i,index)=>{
      var item_included = this.menuprovider.getitem(i);
      this.item_type[item_included.id] = item_included.full_record.price_label;
      this.item_type_selected[item_included.id] = this.item.full_record.included_types[index];
      this.ingredients_menu.push(i);
      this.ingredients_item_included[item_included.id] = {};
      this.ingredients_item_selected[item_included.id] = [];
      this.extras_item[item_included.id] = [];
      this.extras_item_added[item_included.id] = [];
      this.ingredients_item[item_included.id] = (item_included.full_record.ingredients)? JSON.parse(JSON.stringify(item_included.full_record.ingredients)):[];
      this.ingredients_item_selected[item_included.id] = (item_included.full_record.ingredients)? JSON.parse(JSON.stringify(item_included.full_record.ingredients)):[];
      if(item_included.full_record.ingredients){
        item_included.full_record.ingredients.forEach(element => {
          this.ingredients_item_included[item_included.id][element.split(',')[0]]=true;
        });
      }
      this.extras_item[item_included.id] = this.menuprovider.ingredients.filter(i=>{
        return !this.ingredients_item_included[item_included.id][i.id];
      });
    });
  }
}
qty_change(qty){
  
  this.total = this.current_total * qty;
  this.extra_total = 0;
  Object.keys(this.extra_price).forEach((i)=>{
    this.extra_total+=this.extra_price[i]*qty;
  });
  this.total+=this.extra_total;
}
  calculate_price(event){
      this.current_total = parseInt(this.item.full_record.prices[ this.item.full_record.price_label.indexOf(event)]);
      this.total = this.current_total * this.quantity;
      this.extra_total = 0;
      Object.keys(this.extra_price).forEach((i)=>{
        this.extra_total+=this.extra_price[i]*this.quantity;
      });
      this.total+=this.extra_total;
  }
  calculate_price_menu(new_type,id,index){
    var current_item = this.menuprovider.getitem(id);
    var prev_type = this.item.full_record.included_types[index];
    var prev_val = parseInt(current_item.getPricebyLabel(prev_type));
    var new_val = parseInt(current_item.getPricebyLabel(new_type));
    this.current_total = this.total_base + (new_val-prev_val);
    if(this.current_total<this.total_base){
      this.current_total = this.total_base*1;
    }
    this.total = this.current_total * this.quantity;
    this.extra_total = 0;
    Object.keys(this.extra_price).forEach((i)=>{
      this.extra_total+=this.extra_price[i]*this.quantity;
    });
    this.total+=this.extra_total;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuCategoryPage');
    
  }
  toggleSection(c){
    this.sections_open[c] = !this.sections_open[c];
  }
  calculate_price_ingredients(c,index){
    if(!index){
      index = 'base';
    }
    this.total = (this.total)?this.total:0;
    this.extra_total =(this.extra_total)?this.extra_total:0;
    this.total -= this.extra_total;
    this.extra_total = 0;
    this.extra_price[index]=0;
    c.forEach((element) => {
      let ing = this.menuprovider.getingredient(element);
      if(ing && ing.full_record.price){
        this.extra_price[index]+=ing.full_record.price ;
      }
    });
    Object.keys(this.extra_price).forEach((i)=>{
      this.extra_total+=this.extra_price[i]*this.quantity;
    });
    this.total+=this.extra_total;
  }
  create_order(){
    this.disabled_order= true;
    this.userprovider.get_store_settings().subscribe((data)=>{
      if(data['orders_available']!=1){
        let alert = this.alertCtrl.create({
          title: this.translate.transform('order_not_created'),
          subTitle: this.translate.transform('orders_disabled'),
          buttons: [
            {
              text:this.translate.transform('OK'),
              role:'cancel',
              handler: data => {
                
              }
            }
          ]
        });
        alert.present();
      }
      else if(data['available_'+this.item.id] && data['available_'+this.item.id]!=1){
          let alert = this.alertCtrl.create({
            title: this.translate.transform('order_not_created'),
            subTitle: this.translate.transform('item_unavailable'),
            buttons: [
              {
                text:this.translate.transform('OK'),
                role:'cancel',
                handler: data => {
                  
                }
              }
            ]
          });
          alert.present();
      }
      else{
        let alert = this.alertCtrl.create({
          title: this.translate.transform('confirm_order'),
          subTitle: this.translate.transform('confirm_order_msg1')+' Q '+this.total+this.translate.transform('confirm_order_msg2'),
          buttons: [
            {
              text:this.translate.transform('order_now'),
              handler: data => {
                var order = {
                              'personid':this.userprovider.user.full_record.id,
                              'emailaddress':this.userprovider.user.emailaddress,
                              'stage':1,
                              'create_date':(new Date()).getTime()
                            };
                if(this.userprovider.user.full_record.phonenumber){
                  order['phonenumber'] = this.userprovider.user.full_record.phonenumber;
                }
                if(this.userprovider.user.full_record.name){
                  order['personname'] = this.userprovider.user.full_record.name;
                }
                if(this.userprovider.user.full_record.lastname){
                  order['personlastname'] = this.userprovider.user.full_record.lastname;
                }
                if(this.userprovider.user.full_record.image_url){
                  order['image_url'] = this.userprovider.user.full_record.image_url;
                }
                order['title'] = [];
                order['no'] = [];
                order['extra'] = [];
                if(this.item.full_record.menu_flag && this.item.full_record.menu_flag==1){
                  this.item.full_record.included.forEach(element => {
                        
                        var current_item = this.menuprovider.getitem(element);
                        var title = current_item.name;
                        if(current_item.full_record.price_label.length >1){
                          title = current_item.name + ' - ' +this.item_type_selected[element.split(',')[0]];
                        }
                        var no = [];
                        if(this.ingredients_item[element.split(',')[0]]){
                          this.ingredients_item[element.split(',')[0]].forEach((ing)=>{
                            if(this.ingredients_item_selected[element.split(',')[0]] && this.ingredients_item_selected[element.split(',')[0]].indexOf(ing)<0){
                              no.push('NO '+ing.split(',')[1]);
                            }
                          });
                        }
                        var extra = [];
                        if(this.extras_item_added[element.split(',')[0]]){
                          this.extras_item_added[element.split(',')[0]].forEach((ing)=>{
                              extra.push('ADD '+ing.split(',')[1]);
                          });
                        }
                        order['no'].push( no);
                        order['title'].push( title);
                        order['extra'].push(extra);
                  });
                }
                else{
                  var title = this.item.name;
                  if(this.item.full_record.price_label.length >1){
                    title = this.item.name + ' - ' +this.type_selected;
                  }
                  var no = [];
                  if(this.ingredients){
                    this.ingredients.forEach((ing)=>{
                      if(this.ingredients_selected && this.ingredients_selected.indexOf(ing)<0){
                        no.push('NO '+ing.split(',')[1]);
                      }
                    });
                  }
                  var extra = [];
                  if(this.extras_added){
                    this.extras_added.forEach((ing)=>{
                        extra.push('ADD '+ing.split(',')[1]);
                    });
                  }
                  order['no'].push( no);
                  order['title'].push( title);
                  order['extra'].push(extra);
                }
                order['total'] = this.total;
                order['quantity'] = this.quantity;
                order['item_id'] = this.item.id;
                order['item_name'] = this.item.name;
                if(this.comment_order && this.comment_order != ''){
                  order['comment_order'] = this.comment_order;
                }
                if(this.item.category_id){
                  order['category_id'] = this.item.category_id;
                }
                if(this.item.full_record.subcategory_id){
                  order['subcategory_id'] = this.item.full_record.subcategory_id;
                }
                this.loading = this.loadingCtrl.create({
                  content: this.translate.transform('placing_order'),
                });
                this.loading.present();
                this.cartprovider.notify_new_order(this.userprovider.user.emailaddress).subscribe((notif_data)=>{
                  this.cartprovider.place_order_request(order,this.userprovider.user.emailaddress,this.userprovider.user.token).subscribe((data)=>{
                    this.item.add_order(this.userprovider.emailaddress,this.userprovider.token);
                    this.cartprovider.add_order(data);
                    let alert = this.alertCtrl.create({
                      title: this.translate.transform('order_created'),
                      subTitle:this.translate.transform('ready_msg'),
                      buttons: [
                        {
                          text: 'OK',
                          handler: data => {
                            this.loading.dismissAll();
                            this.navCtrl.pop();
                            
                          }
                        }
                      ]
                    });
                    alert.present();
                  })
                },(error)=>{
                  this.loading.dismissAll();
                });
              }
            },
            {
              text:this.translate.transform('cancel'),
              role:'cancel',
              handler: data => {
                
              }
            }
          ]
        });
        alert.present();
      }

      this.disabled_order= false;
    });
  }
    
  
}
