import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { MenuProvider } from '../../providers/menu/menu';
import { UserProvider } from '../../providers/user/user';
import { TranslationPipe } from "../../pipes/translation/translation";

/**
 * Generated class for the AdminCategoriesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-categories',
  templateUrl: 'admin-categories.html',
})
export class AdminCategoriesPage {
  constructor(public translate : TranslationPipe,public menuprovider:MenuProvider, private alertCtrl: AlertController,public userprovider: UserProvider,public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminCategoriesPage');
  }
  public editCategory(cat){
    if(cat===0){
      let modal = this.modalCtrl.create('ModalCategoriePage',{'id': 0 });
      modal.present();
    }
    else{
      let modal = this.modalCtrl.create('ModalCategoriePage',{'cat': cat });
      modal.present();
    }
    
  }
  public deleteCategory(cat){
    let alert = this.alertCtrl.create({
      title: this.translate.transform ( 'confirm_delete'),
      subTitle:this.translate.transform ( 'delete_cat_msg'),
      buttons: [
        {
          text: this.translate.transform ('cancel'),
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: this.translate.transform ('ok'),
          handler: data => {
            this.menuprovider.deletecategory(cat,this.userprovider.emailaddress,this.userprovider.token);
          }
        }
      ]
    });
    alert.present();
  }

}
