import { Component } from '@angular/core';
import { IonicPage, Platform,NavController,LoadingController,AlertController, ViewController,NavParams } from 'ionic-angular';
import { AppAvailability } from '@ionic-native/app-availability';
import { CallNumber } from '@ionic-native/call-number';
import { CartProvider } from '../../providers/cart/cart';
import { UserProvider } from '../../providers/user/user';
import { TranslationPipe } from "../../pipes/translation/translation";

/**
 * Generated class for the ContactUsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-user',
  templateUrl: 'show-user.html',
})
export class ShowUserPage {
  public userinfo:any;
  public orders:Array<any>;
  public block_message:string;
  constructor( public translate : TranslationPipe,public userprovider:UserProvider,public cartprovider:CartProvider,public params: NavParams, private callNumber: CallNumber,public apavail:AppAvailability,public platform: Platform,
    public viewCtrl: ViewController,public navCtrl: NavController,public alertCtrl:AlertController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.userinfo = this.params.get('userinfo');
    this.orders = [];
    this.block_message = this.translate.transform('block_user');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
    this.orders = [];
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  block_user(){
    let alert2 = this.alertCtrl.create({
      title: this.translate.transform('confirm_block_user'),
      buttons: [
        {
          text:this.translate.transform('yes'),
          handler: data =>{
            let loading_2 = this.loadingCtrl.create({
              content: this.translate.transform('loading'),
            });
            loading_2.present();
            this.userprovider.block_user(this.userinfo.emailaddress,this.userinfo.personid).subscribe((data)=>{
              loading_2.dismissAll();
              this.block_message = this.translate.transform('user_blocked');
            });
          }
        },
        {
          text:this.translate.transform('cancel'),
          role:'cancel',
        }
      ]
    });
    alert2.present();
    
  }
  call(){
    if(this.userinfo.phonenumber){
    this.callNumber.callNumber(this.userinfo.phonenumber, true)
    .then(() => console.log('Launched dialer!'))
    .catch(() => console.log('Error launching dialer'));
    }
  }
  load_history(){
    this.cartprovider.get_user_orders(this.userinfo.emailaddress).subscribe((orders)=>{
      orders.forEach(data => {
      if(data.id!=this.userinfo.id){
        this.orders.push({
          'create_date': (new Date(data.create_date)).toLocaleString(),
          'stage':data.stage,
          'total':data.total,
          'item_name':data.item_name
        })
      }
    });
    });
    
  }
}