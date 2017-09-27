import { Component } from '@angular/core';
import { IonicPage,NavController, ActionSheetController, MenuController,ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { User } from '../../app/models/User' ;
import { UserProvider } from '../../providers/user/user';
import { MenuProvider } from '../../providers/menu/menu';
import { CartProvider } from '../../providers/cart/cart';


@IonicPage()
@Component({
  selector: 'page-order-view',
  templateUrl: 'order-view.html'
})
export class OrderViewPage {
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
advance(order){
  this.loading = this.loadingCtrl.create({
    content: 'Placing Order ...',
  });
  this.loading.present();
  order.notify_update();
  order.advance(this.userprovider.user.emailaddress,this.userprovider.user.token).subscribe((data)=>{
    this.loading.dismissAll();
    if(data.errorMessage){
      console.log('Error Updating');
    }
    order.full_record.stage = order.full_record.stage+1;
    if(order.full_record.stage==4){
      order.full_record.status_code = 2;
    }
    this.cartprovider.update_counters();
  });
}


}
