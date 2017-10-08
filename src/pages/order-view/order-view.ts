import { Component } from '@angular/core';
import { IonicPage,NavController, ActionSheetController, MenuController,ModalController,AlertController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { User } from '../../app/models/User' ;
import { UserProvider } from '../../providers/user/user';
import { MenuProvider } from '../../providers/menu/menu';
import { Http } from '@angular/http';
import { CartProvider } from '../../providers/cart/cart';
import { Order } from '../../app/models/order';
import { TranslationPipe } from "../../pipes/translation/translation";


@IonicPage()
@Component({
  selector: 'page-order-view',
  templateUrl: 'order-view.html'
})
export class OrderViewPage {
  public user:User;
  lastImage: string = null;
  loading: Loading;
  sections_open:any = {};
  constructor(  public translate : TranslationPipe,public cartprovider:CartProvider,public userprovider:UserProvider,public menuprovider:MenuProvider, public navCtrl: NavController,private menu: MenuController,  
                public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController,public http: Http,public alertCtrl:AlertController,
                public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) { 
    this.user = this.userprovider.user;
    this.menu.enable(true, 'sidenav'); 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad My oRDERS ');
  }
  
 

public openAdmin(){
  this.navCtrl.push('AdminPage');
}
toggleSection(id){
  this.sections_open[id] = !this.sections_open[id];
}
showinfo(c){
  let modal = this.modalCtrl.create('ShowUserPage',{'userinfo': c.full_record });
  modal.present();
}
advance(order){
  let loading_2 = this.loadingCtrl.create({
    content: this.translate.transform('loading'),
  });
  loading_2.present();
  order.fetch_record().subscribe((data)=>{
    loading_2.dismissAll();
    order.full_record = JSON.parse(JSON.stringify(data));
    if(data.status_code == 2 && data.stage == 5){
      let alert2 = this.alertCtrl.create({
        title: this.translate.transform('order_has_canceled'),
        buttons: [
          {
            text:this.translate.transform('ok'),
            role:'cancel',
          }
        ]
      });
      alert2.present();
    }
    else if(data.status_code == 2 && data.stage == 4){
      let alert2 = this.alertCtrl.create({
        title: this.translate.transform('order_has_completed'),
        buttons: [
          {
            text:this.translate.transform('ok'),
            role:'cancel',
          }
        ]
      });
      alert2.present();
    }
    else{
      if(order.full_record.stage==1){
        const alert = this.alertCtrl.create({
          title:this.translate.transform('estimated_time_to_cook') ,
          inputs: [
            {
              type:'number',
              name: 'estimated_time',
              placeholder: this.translate.transform('estimated_time')
            }],
            
            buttons:[
              {
                text:this.translate.transform('ok'),
                handler: data => {
                  if (data.estimated_time!=0) {
                    this.loading = this.loadingCtrl.create({
                      content: this.translate.transform('updating_order'),
                    });
                    this.loading.present();
                    let now_time = new Date();
                    let estimated_label = (new Date(now_time.getTime()+(60000*data.estimated_time))).toLocaleString();
                    order.notify_update(estimated_label);
                    order.advance(this.userprovider.user.emailaddress,this.userprovider.user.token,estimated_label).subscribe((data)=>{
                      this.loading.dismissAll();
                      if(data.errorMessage){
                        console.log('Error Updating');
                      }
                      order.full_record.estimated_time = estimated_label;
                      order.full_record.stage = order.full_record.stage+1;
                      if(order.full_record.stage==4){
                        order.full_record.status_code = 2;
                      }
                      this.cartprovider.update_counters();
                    });
                  } else {
                    return false;
                  }
                }
              },
              {
                text:this.translate.transform('cancel'),
                role:'cancel',
              }
            ]});
            alert.present();
      }
      else{
          this.loading = this.loadingCtrl.create({
            content: this.translate.transform('updating_order'),
          });
          this.loading.present();
          let now_time = new Date();
          let estimated_label = (new Date(now_time.getTime()+(60000*data.estimated_time))).toLocaleString();
          order.notify_update(estimated_label);
          order.advance(this.userprovider.user.emailaddress,this.userprovider.user.token,estimated_label).subscribe((data)=>{
            this.loading.dismissAll();
            if(data.errorMessage){
              console.log('Error Updating');
            }
            order.full_record.estimated_time = estimated_label;
            order.full_record.stage = order.full_record.stage+1;
            if(order.full_record.stage==4){
              order.full_record.status_code = 2;
            }
            this.cartprovider.update_counters();
          });
      }
  }
});
}
refresh_orders(){
  let loading = this.loadingCtrl.create({content : this.translate.transform("loading_order")+ ".."});
  this.cartprovider.fetch_more_orders().subscribe(data=>{
    data.forEach(c=>{
        this.cartprovider.orders.push(new Order(c.id,c.emailaddress,c.personid,c.create_date,c.total,c,this.http));
    });
    this.cartprovider.new_orders = this.cartprovider.orders.filter((o)=>{return o.full_record.status_code == 1 }).length;
    this.cartprovider.orders.sort((a,b)=>{
      return a.create_date - b.create_date;
    });
    loading.dismissAll();
  });
}


}
