import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController, AlertController } from 'ionic-angular';
import { MenuProvider } from '../../providers/menu/menu';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the AdminItemsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-menus',
  templateUrl: 'admin-menus.html',
})
export class AdminMenusPage {

  constructor(private alertCtrl: AlertController,public menuprovider:MenuProvider,public userprovider: UserProvider,public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminItemsPage');
  }
   public edititem(item,menu_flag){
    if(item===0){
      let modal = this.modalCtrl.create('ModalItemPage',{'id': 0 ,'menu_flag':menu_flag});
      modal.present();
    }
    else{
      let modal = this.modalCtrl.create('ModalItemPage',{'item': item });
      modal.present();
    }
    
  }
  public deleteitem(item){
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to delete ?',
      subTitle: 'This item will no longer be available to order.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.menuprovider.deleteitem(item,this.userprovider.emailaddress,this.userprovider.token);
          }
        }
      ]
    });
    alert.present();
  }

}
