import { Component } from '@angular/core';
import { NavController,MenuController,Platform, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Keychain } from '@ionic-native/keychain';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserProvider } from '../../providers/user/user';
import { CartProvider } from '../../providers/cart/cart';
import { Order } from '../../app/models/order';
import { Http , Headers, RequestOptions } from '@angular/http';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { TranslationPipe } from "../../pipes/translation/translation";
 
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  private url='https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/';
   pushObject: PushObject;
  registerCredentials = {emailaddress:'',password:''}
 
  constructor(  public translate : TranslationPipe,public cartprovider:CartProvider,public userprovider:UserProvider,private platform: Platform,
                private nativeStorage:NativeStorage, private keychain: Keychain,public menu: MenuController,public push: Push, 
                private nav: NavController,public http: Http, private auth: AuthServiceProvider, 
                private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.menu.enable(false, 'sidenav'); 
   }
 
  public createAccount() {
    this.nav.push('RegisterPage');
  }
  public recoverAccount() {
    this.nav.push('RecoverPasswordPage');
  }
 
  public login() {
    let loading = this.loadingCtrl.create({content : this.translate.transform('login_message')});
    loading.present();
    this.auth.login(this.registerCredentials).subscribe(res => {
      loading.dismissAll();
      if (!res.errorMessage) {
        this.userprovider.logged_in(res.name,res.lastname,res.token,res.emailaddress,res);
        if(this.platform.is('ios')){
          this.keychain.set('sertig_token',JSON.stringify({id:res.id,token:res.token}),false).
          then(()=>console.log('Stored Id and Token',''))
          .catch(err=> console.log('Error storing item IOS',err));
        }
        else{
          this.nativeStorage.setItem('sertig_token',{id:res.id,token:res.token})
          .then(
            ()=>console.log('Stored Id and Token',''),
            error => console.log('Error storing item Other', error)
          );
        }
         this.pushsetup((registration_id,err)=>{
          console.log('registration id',JSON.stringify(registration_id));
            if(registration_id){
              this.save_registration(registration_id.registrationId,()=>{
                if(this.userprovider.user.full_record.admin_flag &&this.userprovider.user.full_record.admin_flag!=0){
                  this.pushObject.subscribe('neworder').then((data)=>{
                    console.log("Subscribed to new Orders");
                    this.pushObject.subscribe('newuser').then((data)=>{
                      console.log("Subscribed to new users");
                    },(e) => {
                      this.showPopup('Error subscribing to new users','');
                      console.log('error:', e);
                    });
                  },(e) => {
                    this.showPopup('Error subscribing to new orders','');
                    console.log('error:', e);
                  }
                );
                  /*this.pushObject.subscribe('neworder').then((data)=>{
                    if(data!="OK"){
                      this.showPopup('Error subscribing to new orders','');
                    }
                  });
                  this.pushObject.subscribe('newuser').then((data)=>{
                    if(data!="OK"){
                      this.showPopup('Error subscribing to new orders','');
                    }
                  });*/
                }
                else{
                  
                  this.pushObject.unsubscribe('neworder').then((data)=>{
                    this.pushObject.unsubscribe('newuser').then((data)=>{
                      console.log('Unsubscribed');
                    });
                  });
                  /*
                  this.pushObject.unsubscribe('neworder').then((data)=>{
                    if(data!="OK"){
                      this.showPopup('Error subscribing to new orders','');
                    }
                  });
                  this.pushObject.unsubscribe('newuser').then((data)=>{
                    if(data!="OK"){
                      this.showPopup('Error subscribing to new orders','');
                    }
                  });*/
                }
              });
            }
            else{
              console.log('Error Registering for notifications', err);
            }
            
          });
          if(this.userprovider.user.full_record.admin_flag &&this.userprovider.user.full_record.admin_flag!=0){
            this.cartprovider.fetch_new_orders();
          }
          this.cartprovider.fetch_my_orders(this.userprovider.user.emailaddress);
          this.nav.setRoot('HomePage');
      } else {
        this.showPopup(this.translate.transform("access_denied"),this.translate.transform(res.errorMessage));
      }
    },
      error => {
        this.showPopup('Error',error);
      });
  }
  save_registration(reg_token,callback){
    let platform = 'false';
    if(this.platform.is('ios')){
      platform = 'ios';
    }
    if(this.platform.is('android')){
      platform = 'android';
    }
    if(platform!='false'){
      let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            let options = new RequestOptions({ headers: headers });
            headers.append('sertig_token',this.userprovider.user.token.toString());
            headers.append('sertig_email',this.userprovider.user.emailaddress.toString());
           
            this.http.put('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/person_token/emailaddress/'+this.userprovider.user.emailaddress+'/token/'+this.userprovider.user.token,JSON.stringify({"notification":reg_token,"platform":platform}) , options)
            .subscribe(res => {
                callback();
            });
             
    }
  }
  pushsetup(callback) {
  console.log('push setup');
  const options: PushOptions = {
      android: {
          senderID: '1066733044729',
          sound:true,
          vibrate:true
      },
      browser: {
           },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'true'
      },
      windows: {}
    };
    /*if(this.userprovider.user.full_record.admin_flag && this.userprovider.user.full_record.admin_flag!= 0){
      options.android.topics = ['neworder','newuser'];
      options.ios.topics = ['neworder','newuser'];
    }*/
    this.pushObject = this.push.init(options);
  
    this.pushObject.on('notification').subscribe((notification: any) => {
      console.log('Notification');
      if(notification.additionalData.note_type =="New Order Received"){      
        setTimeout(()=> {
        let alert = this.alertCtrl.create({
          title: this.translate.transform("new_order_received"),
          buttons: [
            {
              text: 'OK',
              handler: data => {
                let loading = this.loadingCtrl.create({content : this.translate.transform("loading_order")+ ".."});
                loading.present();
                this.cartprovider.fetch_more_orders().subscribe(data=>{
                  data.forEach(c=>{
                      this.cartprovider.orders.push(new Order(c.id,c.emailaddress,c.personid,c.create_date,c.total,c,this.http));
                  });
                  this.cartprovider.new_orders = this.cartprovider.orders.filter((o)=>{return o.full_record.status_code == 1 }).length;
                  this.cartprovider.orders.sort((a,b)=>{
                    return a.create_date - b.create_date;
                  });
                  loading.dismissAll();
                  this.nav.push("OrderViewPage");
                });
               
              }
            }
          ]
        });
        alert.present();
      }, 500);
    }
    if(notification.additionalData.note_type =="Order Updated"){
      this.cartprovider.refresh_my_orders(this.userprovider.emailaddress);    
      let alert = this.alertCtrl.create({
        title: this.translate.transform("order_updated"),
        buttons: [
          {
            text: 'OK',
            handler: data => {
              let found = false;
              this.cartprovider.myorders.forEach(element => {
                if(element.id==notification.additionalData.order_id){
                  found= true;
                  element.full_record.stage = notification.additionalData.new_status;
                  if(element.full_record.stage==4){
                    element.full_record.status_code = 2;
                  }
                  if(notification.additionalData.estimated_time){
                    element.full_record.estimated_time = notification.additionalData.estimated_time;
                  }
                }
              });
              if(!found ){
                this.http.get(this.url+'order/id/'+notification.additionalData.order_id).map(res => res.json()).subscribe(full=>{
                this.cartprovider.myorders.push(new Order(full.id,full.emailaddress,full.personid,full.create_date,full.total,full,this.http));
                this.cartprovider.update_counters();
                });
              }
              this.cartprovider.update_counters();
            }
          }
        ]
      });
      alert.present();
  }
  if(notification.additionalData.note_type  =="New User"){    
    let alert = this.alertCtrl.create({
      title:this.translate.transform("new_user"),
      buttons: [
        {
          text: 'OK',
          handler: data => {
            
          }
        }
      ]
    });
    alert.present();
}
    });
  
    this.pushObject.on('registration').subscribe((registration: any) => {
      //do whatever you want with the registration ID
      console.log('registered succesfully');
      callback(registration);
    });
    
    this.pushObject.on('error').subscribe(error =>{
      console.log('error on subscription');
      callback(false,error);
    });
    }
 
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
          }
        }
      ]
    });
    alert.present();
  }
}