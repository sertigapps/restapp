import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController, AlertController } from 'ionic-angular';
import { MenuProvider } from '../../providers/menu/menu';
import { UserProvider } from '../../providers/user/user';
import { TranslationPipe } from "../../pipes/translation/translation";

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
  search_cats:any;
  search_scats:any;
  selected_scats:any;
  loading_avails:boolean;
  constructor(public translate : TranslationPipe,private alertCtrl: AlertController,public menuprovider:MenuProvider,public userprovider: UserProvider,public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams) {
    this.search_cats = [];
    this.search_scats = [];
    this.selected_scats = [];
  }
  update_options(e){
    this.search_scats = this.menuprovider.sub_categories.filter((a)=>{
      return e.indexOf(a.category_id+"")>-1;
    });
  }
  ionViewDidLoad() {
    this.loading_avails=true;
    console.log('ionViewDidLoad AdminItemsPage');
    this.userprovider.get_store_settings().subscribe((data)=>{
      this.loading_avails=false;
      this.menuprovider.menus.forEach((i)=>{
          i.full_record['availability']=(data['available_'+i.id] && data['available_'+i.id]!=1)?(data['available_'+i.id]):1;
      });
    });
  }
  customTrackBy(index: number, obj: any): any {
    return index;
    }
    switch_availability(c){
      this.loading_avails = true;
    c.switch_availability(this.userprovider.emailaddress,this.userprovider.token).subscribe((data)=>{
      this.loading_avails = false;
      //this.menuprovider.updateitem(c.id,c.full_record);
    });
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
      title: this.translate.transform ( 'confirm_delete'),
      subTitle: this.translate.transform ( 'delete_menu_msg'),
      buttons: [
        {
          text: this.translate.transform ( 'cancel'),
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: this.translate.transform ( 'ok'),
          handler: data => {
            this.menuprovider.deletemenu(item,this.userprovider.emailaddress,this.userprovider.token);
          }
        }
      ]
    });
    alert.present();
  }

}
