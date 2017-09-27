import { Component ,ViewChild} from '@angular/core';
import { Platform,AlertController,LoadingController,Loading ,Nav} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HomePage} from '../pages/home/home';
import { Order } from '../app/models/order';
import { Keychain } from '@ionic-native/keychain';
import { NativeStorage } from '@ionic-native/native-storage';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { UserProvider } from '../providers/user/user';
import { CartProvider } from '../providers/cart/cart';
import { Http , Headers, RequestOptions } from '@angular/http';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  @ViewChild(Nav) nav: Nav;
  loading: Loading;
  pushObject: PushObject;
  pages: Array<{title: string, component: any}>;
  private url='https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/';
  rootPage:any ='SplashscreenPage';

  constructor(  public cartprovider:CartProvider,public userprovider:UserProvider, public authservice:AuthServiceProvider,public platform: Platform,
                private nativeStorage:NativeStorage, private keychain: Keychain, splashScreen: SplashScreen,public push: Push, 
                private alertCtrl: AlertController,public http: Http, private loadingCtrl: LoadingController) {
    platform.ready().then(() => {
      if(platform.is('ios')){
        this.keychain.get('sertig_token')
        .then(value=>{
          if(value){
            value = JSON.parse(value);
            this.fetchUserLoged(value.id,value.token);
          }
          else{
            this.rootPage = 'LoginPage';
          }
        })
        .catch(err=>{
            this.rootPage = 'LoginPage';
          }
        )
      }
      else{
        this.nativeStorage.getItem('sertig_token')
        .then(
          data =>{
            if(data){
              this.fetchUserLoged(data.id,data.token);
            }
            else{
              this.rootPage = 'LoginPage';
            }
          },
          error=>{
            this.rootPage = 'LoginPage';
          }
        );
      }
    });
    this.pages = [
      { title: 'Home', component: HomePage }
    ];
  }
  fetchUserLoged(id,token){
      let loading = this.loadingCtrl.create({content : "Loading .."});
      this.http.get(this.url+'person/id/'+id).map(res => res.json()).subscribe(res=>{
        loading.dismissAll();
        if(res.errorMessage){
          this.showPopup(res.errorMessage,'');
          if(this.platform.is('ios')){
          this.keychain.set('sertig_token',JSON.stringify(false)).
          then(()=>this.showPopup('Deleted Id and Token',''))
          .catch(err=> this.showPopup('Error deleting item IOS',err));
              this.nav.setRoot ( 'LoginPage');
          }
          else{
            this.nativeStorage.setItem('sertig_token',false)
            .then(
              ()=>this.showPopup('Deleted Id and Token',''),
              error => this.showPopup('Error deleting item Other', error)
            );
                this.nav.setRoot ( 'LoginPage');
          }
        }
        else{
          this.userprovider.logged_in(res.name,res.lastname,token,res.emailaddress,res);
          this.http.get(this.url+'person_token/emailaddress/'+res.emailaddress+'/token/'+token).map(res => res.json()).subscribe(res=>{
            if(res && res.errorMessage){
              this.showPopup(res.errorMessage,'');
            }
            else{
              if(!res || res.status_code ===0){
                  if(this.platform.is('ios')){
                    this.keychain.set('sertig_token',JSON.stringify(false)).
                    then(()=>this.showPopup('Deleted Id and Token',''))
                    .catch(err=> this.showPopup('Error deleting item IOS',err));
                        this.nav.setRoot ( 'LoginPage');
                    }
                    else{
                      this.nativeStorage.setItem('sertig_token',false)
                      .then(
                        ()=>this.showPopup('Deleted Id and Token',''),
                        error => this.showPopup('Error deleting item Other', error)
                      );
                          this.nav.setRoot ( 'LoginPage');
                    }
              }
            }
          });
          //this.nativeStorage.setItem('sertig_registration',false).then(()=>{
          //push token
                  this.pushsetup((registration_id,err)=>{
                    if(registration_id){
                      this.save_registration(registration_id.registrationId);
                      if(this.userprovider.user.full_record.admin_flag &&this.userprovider.user.full_record.admin_flag!=0){
                        this.pushObject.subscribe('neworder').then((data)=>{
                          if(data!="OK"){
                            this.showPopup('Error subscribing to new orders','');
                             this.pushObject.subscribe('newuser').then((data)=>{
                              if(data!="OK"){
                                this.showPopup('Error subscribing to new orders','');
                              }
                            });
                          }
                        });
                        
                     /* this.pushObject.subscribe('neworder').then((data)=>{
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
                          if(data!="OK"){
                            this.showPopup('Error unsubscribing to new orders','');
                          }
                          this.pushObject.unsubscribe('newuser').then((data)=>{
                            if(data!="OK"){
                              this.showPopup('Error unsubscribing to new orders','');
                            }
                          });
                        });
                        /*this.pushObject.unsubscribe('neworder').then((data)=>{
                          if(data!="OK"){
                            this.showPopup('Error unsubscribing to new orders','');
                          }
                        });
                        this.pushObject.unsubscribe('newuser').then((data)=>{
                          if(data!="OK"){
                            this.showPopup('Error unsubscribing to new orders','');
                          }
                        });*/
                      }
                    }
                    else{
                      this.showPopup('Error Registering for notifications', err);
                    }
                   
                  });
                  if(this.userprovider.user.full_record.admin_flag &&this.userprovider.user.full_record.admin_flag!=0){
                    this.cartprovider.fetch_new_orders();
                  }
                  this.cartprovider.fetch_my_orders(this.userprovider.user.emailaddress);
                   this.nav.setRoot('HomePage');
        //});//push token end
        }
        
      });
      
  }
  save_registration(reg_token){
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
               
            });
             
    }
  }
  pushsetup(callback) {
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
   /* if(this.userprovider.user.full_record.admin_flag && this.userprovider.user.full_record.admin_flag!= 0){
      options.android.topics = ['neworder','newuser'];
      options.ios.topics = ['neworder','newuser'];
    }*/
    this.pushObject = this.push.init(options);
  
    this.pushObject.on('notification').subscribe((notification: any) => {
      if(notification.message =="New Order Received"){      
          setTimeout(()=> {
          let alert = this.alertCtrl.create({
            title: "New Order Received",
            buttons: [
              {
                text: 'OK',
                handler: data => {
                  this.cartprovider.fetch_more_orders().subscribe(data=>{
                    data.forEach(c=>{
                      if(!this.cartprovider.orders_indexed[c.id]){
                        this.cartprovider.orders.push(new Order(c.id,c.emailaddress,c.personid,c.create_date,c.total,c,this.http));
                      }
                    });
                    this.cartprovider.new_orders = this.cartprovider.orders.filter((o)=>{return o.full_record.status_code == 1 }).length;
                  });
                  this.cartprovider.orders.sort((a,b)=>{
                    return a.create_date - b.create_date;
                  });
                  this.nav.push("OrderViewPage");
                }
              }
            ]
          });
          alert.present();
        }, 500);
      }
      if(notification.message =="Order Updated"){    
        let alert = this.alertCtrl.create({
          title: "Order Updated",
          buttons: [
            {
              text: 'OK',
              handler: data => {
                let found = false;
                this.cartprovider.myorders.forEach(element => {
                  if(element.id==notification.additionalData.order_id){
                    found= true;
                    element.full_record.stage =  element.full_record.stage +1;
                    if(element.full_record.stage==4){
                      element.full_record.status_code = 2;
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
    if(notification.message =="New User"){    
      let alert = this.alertCtrl.create({
        title: "New User",
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
      callback(registration);
    });
    
    this.pushObject.on('error').subscribe(error =>{
      callback(false,error);
    });
    }
  openPage(page) {
    this.nav.setRoot(page);
  }
  logout() {
    this.showPopup(this.userprovider.emailaddress,this.userprovider.token);
      let loading = this.loadingCtrl.create({content : "Login out .."});
    this.authservice.logout(this.userprovider.emailaddress,this.userprovider.token).subscribe(res => {
      loading.dismissAll();
      if(!res.errorMessage){
        if(this.platform.is('ios')){
          this.keychain.set('sertig_token',JSON.stringify(false)).
          then(()=>this.showPopup('Deleted Id and Token',''))
          .catch(err=> this.showPopup('Error deleting item IOS',err));
        }
        else{
          this.nativeStorage.setItem('sertig_token',false)
          .then(
            ()=>this.showPopup('Deleted Id and Token',''),
            error => this.showPopup('Error deleting item Other', error)
          );  
        }
        this.pushObject.unregister().then(()=>{
          this.showPopup('Unsubscribed from push','');
        });
        this.nav.setRoot ( 'LoginPage');
      }
      else{
        this.showPopup(res.errorMessage,'');
      }
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

