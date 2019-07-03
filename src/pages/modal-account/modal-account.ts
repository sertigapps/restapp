import { Component } from '@angular/core';
import { IonicPage, LoadingController, ViewController, ActionSheetController, Platform, NavParams, ToastController, Loading } from 'ionic-angular';
import { Account } from '../../app/models/account';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { UserProvider } from '../../providers/user/user';
import { Http, RequestOptions, Headers } from '@angular/http';
import { MenuProvider } from '../../providers/menu/menu';
import { CartProvider } from '../../providers/cart/cart';
import { TranslationPipe } from "../../pipes/translation/translation";
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

/**
 * Generated class for the ModalAccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-account',
  templateUrl: 'modal-account.html',
})
export class ModalAccountPage {
  title: String = "new_account";
  title_button: String = "create";
  public id: number;
  loading: Loading;
  public account: Account;
  constructor(public cart: CartProvider,public translate: TranslationPipe, private imageResizer: ImageResizer, public http: Http, public menuprovider: MenuProvider, public userprovider: UserProvider, private camera: Camera,
    private transfer: Transfer,
    public params: NavParams, public actionSheetCtrl: ActionSheetController, private filePath: FilePath,
    public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, private file: File,
    public viewCtrl: ViewController) {
    this.id = this.params.get('id');
    if (this.id === 0) {
      this.account = new Account(0, '', { "id": 0, "name": '' }, this.http);
    }
    else {
      this.account = this.params.get('account');
      this.title_button = "save";
      this.title = "update_cat";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalCategoriePage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  submit() {
    this.loading = this.loadingCtrl.create({
      content: this.translate.transform('saving') + ' ' + this.translate.transform('account'),
    });
    this.loading.present();
    this.account.save(this.userprovider.emailaddress, this.userprovider.token).subscribe(res => {
      this.loading.dismissAll();
      if (!res.errorMessage) {
        if (this.id === 0) {
          this.cart.accounts.push(new Account(res.id, res.name, res, this.http));
        }
        else {
          if (res.Attributes) {
            this.cart.updateaccount(this.account.id, res.Attributes);
          }
        }
        this.viewCtrl.dismiss();
      } else {
        this.presentToast(JSON.stringify(res));
      }
    },
      error => {
        this.loading.dismissAll();
        this.presentToast(this.translate.transform('error_on_req'));
      });
  }
  
  
  
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}

