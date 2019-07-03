import { Component } from '@angular/core';
import { IonicPage,NavController, ActionSheetController, MenuController,ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { User } from '../../app/models/User' ;
import { UserProvider } from '../../providers/user/user';
import { MenuProvider } from '../../providers/menu/menu';
import { CartProvider } from '../../providers/cart/cart';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public user:User;
  public posts_valid:any;
  lastImage: string = null;
  loading: Loading;
  constructor(  public cartprovider:CartProvider,public userprovider:UserProvider,public menuprovider:MenuProvider, public navCtrl: NavController,private menu: MenuController,  
                public actionSheetCtrl: ActionSheetController, 
                public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) { 
    this.user = this.userprovider.user;
    this.menu.enable(true, 'sidenav'); 
  }

  ionViewDidLoad() {
    this.menuprovider.validposts = this.menuprovider.posts.filter(function(item){
      var valid = true;
      if(item.full_record.offer ==1 && item.full_record.days && item.full_record.days.indexOf((new Date()).getDay().toString()) < 0){
        valid = false;
      }
      return valid; 
    });
    console.log('ionViewDidLoad HomePage');
  }
  
 
  public openLocalAccounts() {
    this.navCtrl.push('AccountsPage');
  }
public openAdmin(){
  this.navCtrl.push('AdminPage');
}
show_item_to_order(item_id,pricesale,label){

  var it = this.menuprovider.getitem(item_id);
  var price_sale = (pricesale)?pricesale:false;
  this.navCtrl.push('ShowItemPage',{'item':it,'price':price_sale,'label':label})
}



}
