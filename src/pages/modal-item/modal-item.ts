import { Component,ViewChild } from '@angular/core';
import { Slides,IonicPage,LoadingController,ViewController,ActionSheetController,Platform, NavParams,ToastController,Loading } from 'ionic-angular';
import { Item } from '../../app/models/item';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { UserProvider } from '../../providers/user/user';
import { Http,Headers,RequestOptions} from '@angular/http';
import { MenuProvider } from '../../providers/menu/menu';
import { SubCategory } from '../../app/models/subcategory';
import { TranslationPipe } from "../../pipes/translation/translation";
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-modal-item',
  templateUrl: 'modal-item.html',
})
export class ModalItemPage {
  @ViewChild(Slides) slides: Slides;
  public id : number;
  public title : string;
  public image_base : string = "https://s3.amazonaws.com/sertigs3/labarraapp/";
  loading: Loading;
  type_options:Array<any> = [];
  lastImage: string = null;
  image_uploaded: string = null;
  public title_button : string;
  public item :  Item;
  public subcategories: Array<SubCategory> = []
  constructor( public translate : TranslationPipe,private imageResizer: ImageResizer, public http: Http,public menuprovider:MenuProvider,public userprovider:UserProvider,private camera: Camera,private transfer: Transfer,
    public params: NavParams, public actionSheetCtrl: ActionSheetController,  private filePath: FilePath,
    public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, private file: File,
    public viewCtrl: ViewController) {
    this.id = this.params.get('id');
    let menu_flag = this.params.get('menu_flag');
    if(this.id===0){
      this.item = new Item(0,0,'',{"id":0,"menu_flag":menu_flag ,"name":'',"included_types":[""] ,"included":[""] ,"prices":['0.01'],"images":[],"price_label":['Base']},this.http);
      this.title = "create_new_item";
      this.title_button = "create";
    }
    else{
      this.item = this.params.get('item');
      if(!this.item.full_record.prices){
        this.item.full_record.prices = [''];
      }
      if(!this.item.full_record.included){
        this.item.full_record.included = [''];
      }
      if(!this.item.full_record.included_types){
        this.item.full_record.included_types = [''];
      }
      if(this.item.full_record.image_url){
        this.image_uploaded = this.item.full_record.image_url;
      }
      this.title_button = "save";
      this.title = "update_item";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalItemPage');
  }
   dismiss() {
    this.viewCtrl.dismiss();
  }
  update_options(e,i){
    this.item.full_record.included_types[i] = '';
  }
  customTrackBy(index: number, obj: any): any {
	return index;
  }
add_price(){
  this.item.full_record.price_label.push('');
  this.item.full_record.prices.push('');
}
remove_price(index){
  this.item.full_record.price_label.splice(index,1);
  this.item.full_record.prices.splice(index,1);
}
add_item(){
  this.item.full_record.included.push('');
  this.item.full_record.included_types.push('');
}
remove_item(index){
  this.item.full_record.included.splice(index,1);
  this.item.full_record.included_types.splice(index,1);
}
remove_image(index){
  if(index == this.item.full_record.images.length -1){
    this.slides.slideTo(index-1);
  }
  if(this.item.full_record.images[index] && this.item.full_record.images[index]!=''){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    headers.append('sertig_token',this.userprovider.token.toString());
    headers.append('sertig_email',this.userprovider.emailaddress.toString());
    
    let data = {item:this.item.full_record.images[index].split('/').pop(),appid:'labarraapp'};
    
  this.http.post('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/deleteimage', JSON.stringify(data), options).map(res => res.json()).subscribe((data)=>{
  console.log('imagedeleted');
  });
  }
  this.item.full_record.images.splice(index,1);
}
  submit(){
     this.loading = this.loadingCtrl.create({
    content: this.translate.transform('saving')+' '+this.translate.transform('item'),
  });
  this.loading.present();
    this.item.save(this.userprovider.emailaddress,this.userprovider.token).subscribe(res => {
      this.loading.dismissAll();
      if (!res.errorMessage) {
        if(this.id===0){
          if(res.menu_flag && res.menu_flag == 1){
            this.menuprovider.menus.push( new Item(res.id,res.category_id,res.name,res,this.http));
          }
          else{
            this.menuprovider.items.push( new Item(res.id,res.category_id,res.name,res,this.http));
          }
        }
        else{
          if(res.Attributes){
            this.menuprovider.updateitem(this.item.id,res.Attributes);
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
  updatesubcats(){
    this.subcategories = this.menuprovider.sub_categories.filter(sc=>{
      return this.item.full_record.category_id == sc.category_id
    });
  }
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.translate.transform('select_image_source'),
      buttons: [
        {
          text: this.translate.transform('load_from_library'),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: this.translate.transform('use_camera'),
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: this.translate.transform('cancel'),
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }
  public takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };
 
  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast(err);
  });
}
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
    this.uploadImage();
  }, error => {
    this.presentToast(this.translate.transform('error_storing_file'));
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
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}
public pathForImageShow(img) {
    return this.image_base + this.userprovider.emailaddress.replace('@','_-_')+img;
}
public gotoLast(){

    this.slides.slideTo(this.item.full_record.images.length-1);
}
public uploadImage() {
  // Destination URL
  var url = "http://34.195.122.172/upload/upload_image.php";
 
  // File for Upload
 var targetPathBefore = this.pathForImage(this.lastImage);
 let options_mage = {
   uri: targetPathBefore,
   //folderName: 'Protonet',
   quality: 90,
   width: 1600,
   height: 1200,
   fileName: 'resizedimage.jpg' 
  } as ImageResizerOptions;
 
  this.imageResizer
  .resize(options_mage)
  .then((targetPath: string) => {
 
  // File name only
  var filename = this.lastImage;
 
  var options = {
    fileKey: "file",
    fileName: this.userprovider.emailaddress.replace('@','_-_')+ filename,
    chunkedMode: false,
    mimeType: "multipart/form-data",
    params : {
      'fileName': this.userprovider.emailaddress.replace('@','_-_')+ filename,
      'sertig_email': this.userprovider.emailaddress,
      'sertig_token': this.userprovider.token,
      'sertig_app': "labarraapp"
  }
  };
 
  const fileTransfer: TransferObject = this.transfer.create();
 
  this.loading = this.loadingCtrl.create({
    content: this.translate.transform('uploading')+' ....',
  });
  this.loading.present();
 
  // Use the FileTransfer to upload the image
  fileTransfer.upload(targetPath, url, options).then(data => {
    this.loading.dismissAll();
    var data_res= JSON.parse(data['response']);
    if(data_res.error){
      this.presentToast(data_res.message);
    }
    this.image_uploaded = this.pathForImageShow(this.lastImage);
    if(!this.item.full_record.images){
      this.item.full_record.images = [];
    }
    this.item.full_record.images.push(this.image_uploaded);
    setTimeout(()=> {
      this.gotoLast();
    }, 500);
  }, err => {
    this.loading.dismissAll()
    this.presentToast(this.translate.transform('error_uploading'));
  });
})
.catch(e => console.log('Error resizing',e));
}

}
