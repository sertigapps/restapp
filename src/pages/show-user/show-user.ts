import { Component } from '@angular/core';
import { IonicPage, Platform,NavController, ViewController,NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppAvailability } from '@ionic-native/app-availability';
import { Device } from '@ionic-native/device';
import { CallNumber } from '@ionic-native/call-number';
import { CartProvider } from '../../providers/cart/cart'

/**
 * Generated class for the ContactUsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-user',
  templateUrl: 'show-user.html',
})
export class ShowUserPage {
  public userinfo:any;
  public orders:Array<any>;
  constructor(public cartprovider:CartProvider,public params: NavParams, private callNumber: CallNumber,public apavail:AppAvailability,public platform: Platform,
    public viewCtrl: ViewController,public navCtrl: NavController,private iab: InAppBrowser, public navParams: NavParams) {
    this.userinfo = this.params.get('userinfo');
    this.orders = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
    this.orders = [];
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  call(){
    if(this.userinfo.phonenumber){
    this.callNumber.callNumber(this.userinfo.phonenumber, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
    }
  }
  load_history(){
    this.cartprovider.get_user_orders(this.userinfo.emailaddress).subscribe((orders)=>{
      orders.forEach(data => {
      if(data.id!=this.userinfo.id){
        this.orders.push({
          'create_date': (new Date(data.create_date)).toLocaleString(),
          'stage':data.stage,
          'total':data.total,
          'item_name':data.item_name
        })
      }
    });
    });
    
  }
}