import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { MenuProvider } from '../../providers/menu/menu';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the AdminCategoriesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-admin-ingredients',
  templateUrl: 'admin-ingredients.html',
})
export class AdminIngredientsPage {
  constructor(public menuprovider:MenuProvider, private alertCtrl: AlertController,public userprovider: UserProvider,public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Admin Ingredients');
  }
  public editIngredient(ing){
    if(ing===0){
      let modal = this.modalCtrl.create('ModalIngredientPage',{'id': 0 });
      modal.present();
    }
    else{
      let modal = this.modalCtrl.create('ModalIngredientPage',{'ing': ing });
      modal.present();
    }
    
  }
  public deleteIngredient(ing){
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to delete ?',
      subTitle: 'This ingredient will not be available to use anymore',
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
            this.menuprovider.deleteingredient(ing,this.userprovider.emailaddress,this.userprovider.token);
          }
        }
      ]
    });
    alert.present();
  }

}
