import { Component } from '@angular/core';
import { IonicPage,NavController, ActionSheetController, MenuController,ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { User } from '../../app/models/User' ;
import { UserProvider } from '../../providers/user/user';
import { MenuProvider } from '../../providers/menu/menu';
import { CartProvider } from '../../providers/cart/cart';


@IonicPage()
@Component({
  selector: 'page-my-orders',
  templateUrl: 'my-orders.html'
})
export class MyOrdersPage {
  public user:User;
  lastImage: string = null;
  loading: Loading;
  sections_open:any = {};
  constructor(  public cartprovider:CartProvider,public userprovider:UserProvider,public menuprovider:MenuProvider, public navCtrl: NavController,private menu: MenuController,  
                public actionSheetCtrl: ActionSheetController, 
                public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) { 
    this.user = this.userprovider.user;
    this.menu.enable(true, 'sidenav'); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad My oRDERS ');
  }
  
 

public openAdmin(){
  this.navCtrl.push('AdminPage');
}
toggleSection(id){
  this.sections_open[id] = !this.sections_open[id];
}


}