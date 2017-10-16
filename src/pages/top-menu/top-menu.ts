import { Component } from '@angular/core';
import { IonicPage,NavController, ActionSheetController,ToastController, Platform,NavParams, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { MenuProvider } from '../../providers/menu/menu';

import { Category } from '../../app/models/category';
import { SubCategory } from '../../app/models/subcategory';
import { Item } from '../../app/models/item';

/**
 * Generated class for the MenuCategoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top-menu',
  templateUrl: 'top-menu.html',
})
export class TopMenuPage {
  category: Category;
  subcats : Array<SubCategory> = [];
  items : Array<Item> = [];
  item_ids : any={};
  sc_items : any={};
  sections_open : any = {};
  constructor(public userprovider:UserProvider,public menuprovider:MenuProvider, public navCtrl: NavController,
                public actionSheetCtrl: ActionSheetController, 
                public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public navParams: NavParams) {
  
  this.items = this.menuprovider.items.filter((item)=>{
    return  item.rate!='0';
  });
  this.items= this.items.concat( this.menuprovider.menus.filter((item)=>{
    return  item.rate!='0'; ;
  }));
  this.items.sort((a,b)=>{
    return parseInt(b.rate) - parseInt(a.rate);
  });
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuCategoryPage ');
  }
toggleSection(c){
  this.sections_open[c] = !this.sections_open[c];
}
}
