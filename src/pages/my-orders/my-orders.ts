import { Component } from '@angular/core';
import { IonicPage,NavController, ActionSheetController, MenuController,AlertController,ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { User } from '../../app/models/User' ;
import { UserProvider } from '../../providers/user/user';
import { MenuProvider } from '../../providers/menu/menu';
import { CartProvider } from '../../providers/cart/cart';
import { TranslationPipe } from "../../pipes/translation/translation";
import { LaunchNavigator } from '@ionic-native/launch-navigator';


@IonicPage()
@Component({
  selector: 'page-my-orders',
  templateUrl: 'my-orders.html'
})
export class MyOrdersPage {
  public user:User;
  lastImage: string = null;
  loading: Loading;
  ratings:any;
  
  sections_open:any = {};
  constructor(  public cartprovider:CartProvider,public userprovider:UserProvider,public menuprovider:MenuProvider, public navCtrl: NavController,private menu: MenuController,  
                public actionSheetCtrl: ActionSheetController, public alertCtrl:AlertController,public translate:TranslationPipe,
                public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController,private launchNavigator: LaunchNavigator) { 
    this.user = this.userprovider.user;
    this.menu.enable(true, 'sidenav'); 
    this.ratings = {};
    this.cartprovider.myorders.forEach((data)=>{
      if(data.full_record.ranked){
        this.ratings[data.id] = data.full_record.ranked;
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad My oRDERS ');
  }
  public openLocalAccounts() {
    this.navCtrl.push('AccountsPage');

  }
public openAdmin(){
  this.navCtrl.push('AdminPage');
}
open_maps(){
  this.launchNavigator.navigate([14.5281229,-90.6214151]);
}
toggleSection(id){
  this.sections_open[id] = !this.sections_open[id];
}
rate_object(order){
  if(this.ratings[order.id]){
  let loading = this.loadingCtrl.create({content : this.translate.transform('loading')+".."});
  loading.present();
  order.rate(this.userprovider.emailaddress,this.userprovider.token,this.ratings[order.id],(success)=>{
    if(success){
      loading.dismissAll();
    }
  });
}
}
load_prev_orders(){
  this.cartprovider.fetch_my_prev_orders(this.userprovider.emailaddress);
  this.cartprovider.myorders.forEach((data)=>{
    if(data.full_record.ranked){
      this.ratings[data.id] = data.full_record.ranked;
    }
  });
}
refresh_my_orders(){
  this.cartprovider.refresh_my_orders(this.userprovider.emailaddress);
  this.cartprovider.myorders.forEach((data)=>{
    if(data.full_record.ranked){
      this.ratings[data.id] = data.full_record.ranked;
    }
  });
}
cancel(c){
  let alert = this.alertCtrl.create({
    title: this.translate.transform('confirm_cancel'),
    buttons: [
      {
        text:this.translate.transform('yes'),
        handler: data => {
          c.cancel(this.userprovider.emailaddress,this.userprovider.token).subscribe((data)=>{
            let alert2 = this.alertCtrl.create({
              title: this.translate.transform('order_1')+' '+this.translate.transform('canceled'),
              buttons: [
                {
                  text:this.translate.transform('ok'),
                  role:'cancel',
                }
              ]
            });
            alert2.present();
          });
        }
      },
      {
        text:this.translate.transform('no'),
        role:'cancel',
        handler: data => {
          
        }
      }
    ]
  });
  alert.present();
}

}