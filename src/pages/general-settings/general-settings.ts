import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ApproveUsersPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-general-settings',
  templateUrl: 'general-settings.html',
})
export class GeneralSettingsPage {
  loading_spinner :boolean= true;
  store_settings:any;
  orders_available = false;
  constructor(public userprovider:UserProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loading_spinner = true;
    console.log('ionViewDidLoad generalSettings');
    this.load_settings();
  }
  load_settings(){
    this.userprovider.get_store_settings().subscribe((data)=>{
      this.loading_spinner = false;
      this.store_settings = data;
      this.orders_available = (this.store_settings.orders_available==1)?true:false;
    });
  }
  update_order_store(value){
    this.orders_available= value;
    let update_val = (value)?1:-1;
    this.userprovider.switch_order_availability(update_val).subscribe((data)=>{
      if(data.errorMessage){
        this.orders_available = !value;
      }
    },
  (error)=>{
    console.log('Error Changing');
  });
  }
}

