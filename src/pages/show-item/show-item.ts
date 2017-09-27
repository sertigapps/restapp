import { Component } from '@angular/core';
import { IonicPage,NavController, ActionSheetController,AlertController,ToastController, Platform,NavParams, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { MenuProvider } from '../../providers/menu/menu';
import { CartProvider } from '../../providers/cart/cart';

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

  item_type:any;
  item_type_selected:any;
  ingredients_menu:any;
  ingredients_item:any;
  ingredients_item_selected:any;
  ingredients_item_included:any;
  extras_item:any;
  extras_item_added:any;

  current_total :any;
  loading:any;

  constructor(public userprovider:UserProvider,public menuprovider:MenuProvider, public navCtrl: NavController,  
                public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController,public cartprovider:CartProvider,
                public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public navParams: NavParams) {
  this.item = this.navParams.get('item');
  
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
    this.current_total = this.item.full_record.prices[0]; 
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
      item_included.full_record.ingredients.forEach(element => {
        this.ingredients_item_included[item_included.id][element.split(',')[0]]=true;
      });
      this.extras_item[item_included.id] = this.menuprovider.ingredients.filter(i=>{
        return !this.ingredients_item_included[item_included.id][i.id];
      });
    });
  }
}
  calculate_price(event){
      this.current_total = this.item.full_record.prices[ this.item.full_record.price_label.indexOf(event)];
  }
  calculate_price_menu(new_type,id,index){
    var current_item = this.menuprovider.getitem(id);
    var prev_type = this.item.full_record.included_types[index];
    var prev_val = parseInt(current_item.getPricebyLabel(prev_type));
    var new_val = parseInt(current_item.getPricebyLabel(new_type));
    if(prev_val<new_val){
      this.current_total = parseInt(this.current_total) + (new_val-prev_val);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuCategoryPage');
  }
  toggleSection(c){
    this.sections_open[c] = !this.sections_open[c];
  }
  create_order(){
    let alert = this.alertCtrl.create({
      title: 'Confirm order',
      subTitle: 'By clicking Order you compromise to pay the amount of Q '+this.current_total+', Would you like to order now or add it to cart ?',
      buttons: [
        {
          text: 'Order Now',
          handler: data => {
            var order = {
                          'personid':this.userprovider.user.full_record.id,
                          'emailaddress':this.userprovider.user.emailaddress,
                          'stage':1,
                          'create_date':(new Date()).getTime()
                        };
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
            order['total'] = this.current_total;
            this.loading = this.loadingCtrl.create({
              content: 'Placing Order ...',
            });
            this.loading.present();
            this.cartprovider.notify_new_order(this.userprovider.user.emailaddress).subscribe((notif_data)=>{
              this.cartprovider.place_order_request(order,this.userprovider.user.emailaddress,this.userprovider.user.token).subscribe((data)=>{
                this.cartprovider.add_order(data);
                let alert = this.alertCtrl.create({
                  title: 'Order created',
                  subTitle: 'We\'ll let you know once its ready',
                  buttons: [
                    {
                      text: 'OK',
                      handler: data => {
                        this.loading.dismissAll();
                        this.navCtrl.pop();
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
          text: 'Cancel',
          role:'cancel',
          handler: data => {
            
          }
        }
      ]
    });
    alert.present();
  }
    
  
}
