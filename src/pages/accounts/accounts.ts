import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController,NavParams } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { UserProvider } from '../../providers/user/user';
 import { Account } from '../../app/models/account';

/**
 * Generated class for the AccountsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage {

  constructor(public user: UserProvider,public cartprovider: CartProvider, public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams) {
  }
  public showAccount(acc) {
    let modal = this.modalCtrl.create('ModalChargePage', { 'account': acc });
    modal.present();
  }
  public editAccount(acc) {
    if (acc === 0) {
      let modal = this.modalCtrl.create('ModalAccountPage', { 'id': 0 });
      modal.present();
    }
    else {
      let modal = this.modalCtrl.create('ModalAccountPage', { 'account': acc });
      modal.present();
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountsPage');
    this.cartprovider.calculate_total_locals();
  }
  showMenu(c:Account){
    this.user.account_selected = c;
    this.navCtrl.setRoot('MenuPage')
  }

}
