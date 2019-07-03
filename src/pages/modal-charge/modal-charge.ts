import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController,LoadingController, NavParams } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { Account } from '../../app/models/account';
import { TranslationPipe } from "../../pipes/translation/translation";

import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the ModalChargePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-charge',
  templateUrl: 'modal-charge.html',
})
export class ModalChargePage {
  account :Account;
  accountOrders:Array<Account> = [];
  sections_open: any = {};
  loadingController :any;
  orderSelected:any={};
  total_selected:Number = 0;
  ordersSelected: Array<Account> = [];
  constructor(public translate: TranslationPipe,public navCtrl: NavController, public loadingCtrl: LoadingController,public cartprovider: CartProvider, public userprovider: UserProvider, public navParams: NavParams, public viewCtrl: ViewController) {
    this.account = this.navParams.get('account');
    this.total_selected = 0;
    this.accountOrders = this.cartprovider.local_orders.filter((order)=>{
      return order.full_record.account_id == this.account.id;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalChargePage');
    this.total_selected = 0;
  } 
  toggleSection(id) {
    this.sections_open[id] = !this.sections_open[id];
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  chargeAll(){
    this.loadingController = this.loadingCtrl.create({
      content: this.translate.transform('loading'),
    });
    this.loadingController.present();
    this.updateNextOrder();
  } 
  updateTotalSelected(){
    this.total_selected=0;
    this.accountOrders.forEach((o)=>{
      if(this.orderSelected[o.id]){
        this.total_selected+=o.full_record.total;
      }
    });
  }
  updateAccount() {
    this.account.full_record.status_code = 2;
    this.account.save(this.userprovider.emailaddress, this.userprovider.token).subscribe(data => {
      if (!data.errorMessage) {
        this.cartprovider.accounts=this.cartprovider.accounts.filter((acc)=>{
          return acc.id != this.account.id;
        });
        this.loadingController.dismissAll();
        this.navCtrl.pop();
      }
    });
  }
  updateNextOrder(){
    let order = this.accountOrders.pop();
    if(order){
      order.full_record.status_code = 2;
      order.save(this.userprovider.emailaddress, this.userprovider.token).subscribe(data => {
        if (!data.errorMessage) {
          this.updateNextOrder();
        }
      });
    }
    else{
      this.updateAccount();
    }
  }
  updateNextOrderSelected() {
    let order = this.ordersSelected.pop();
    if (order) {
      order.full_record.status_code = 2;
      this.accountOrders = this.accountOrders.filter((o)=>{
        return o.id != order.id;
      });
      this.cartprovider.local_orders = this.cartprovider.local_orders.filter((lo) => {
        return lo.id != order.id;
      });
      this.cartprovider.calculate_total_locals();
      order.save(this.userprovider.emailaddress, this.userprovider.token).subscribe(data => {
        if (!data.errorMessage) {
          this.updateNextOrderSelected();
        }
      });
    }
    else {
      if(this.accountOrders.length<1){
        this.updateAccount();
      }
      else{
        this.loadingController.dismissAll();
      }
    }
  }
  chargeSelected(){
    this.ordersSelected = [];
    this.accountOrders.forEach((order)=>{
      if(this.orderSelected[order.id]){
        this.ordersSelected.push(order);
      }
    });
    this.loadingController = this.loadingCtrl.create({
      content: this.translate.transform('loading'),
    });
    this.loadingController.present();
    this.updateNextOrderSelected();
  }

}
