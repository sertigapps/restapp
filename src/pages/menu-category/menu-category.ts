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
  selector: 'page-menu-category',
  templateUrl: 'menu-category.html',
})
export class MenuCategoryPage {
  category: Category;
  subcats : Array<SubCategory> = [];
  items : Array<Item> = [];
  item_ids : any={};
  sc_items : any={};
  sections_open : any = {};
  constructor(public userprovider:UserProvider,public menuprovider:MenuProvider, public navCtrl: NavController,
                public actionSheetCtrl: ActionSheetController, 
                public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, public navParams: NavParams) {
  this.category = this.navParams.get('category');
  this.subcats = this.menuprovider.sub_categories.filter((sc)=>{
    return sc.category_id == this.category.id;
  });
  this.subcats.sort((a,b)=>{
    return a.full_record.order - b.full_record.order;
  });
  this.subcats.forEach((sc)=>{
    this.sc_items[sc.id] = this.menuprovider.items.filter((item)=>{
      if(item.full_record.subcategory_id != sc.id || item.full_record.visible==-1 ){
        return false;
      }
      this.item_ids[item.id]=true;
      return true;
    });
    this.sc_items[sc.id] = this.sc_items[sc.id].concat(this.menuprovider.menus.filter((item)=>{
      if(item.full_record.subcategory_id != sc.id || item.full_record.visible==-1){
        return false;
      }
      this.item_ids[item.id]=true;
      return true;
    }));
    this.sc_items[sc.id] = this.sc_items[sc.id].filter((item)=>{
          var valid = true;
          if(item.full_record.offer && item.full_record.days && item.full_record.days.indexOf((new Date()).getDay().toString()) < 0){
            valid = false;
          }
          return valid;  
    });
    this.sc_items[sc.id].sort((a,b)=>{
      return a.full_record.order - b.full_record.order;
    });
  });
  this.items = this.menuprovider.items.filter((item)=>{
    return   item.category_id == this.category.id && !this.item_ids[item.id] && (!item.full_record.visible || item.full_record.visible==1);
  });
  this.items= this.items.concat( this.menuprovider.menus.filter((item)=>{
    return   item.category_id == this.category.id && !this.item_ids[item.id] && (!item.full_record.visible || item.full_record.visible==1) ;
  }));
  this.items = this.items.filter((item)=>{
        var valid = true;
        if(item.full_record.offer && item.full_record.days && item.full_record.days.indexOf((new Date()).getDay().toString()) < 0){
          valid = false;
        }
        return valid;  
  });
  this.items.sort((a,b)=>{
    return a.full_record.order - b.full_record.order;
  });
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuCategoryPage ');
  }
toggleSection(c){
  this.sections_open[c] = !this.sections_open[c];
}
}
