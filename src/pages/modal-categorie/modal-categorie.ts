import { Component } from '@angular/core';
import { IonicPage,LoadingController,ViewController,ActionSheetController,Platform, NavParams,ToastController,Loading } from 'ionic-angular';
import { Category } from '../../app/models/category';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { UserProvider } from '../../providers/user/user';
import { Http,RequestOptions,Headers} from '@angular/http';
import { MenuProvider } from '../../providers/menu/menu';
import { TranslationPipe } from "../../pipes/translation/translation";
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-modal-categorie',
  templateUrl: 'modal-categorie.html',
})
export class ModalCategoriePage {
  public id : number;
  public title : string;
  public image_base : string ="https://s3.amazonaws.com/sertigs3/labarraapp/";
  loading: Loading;
  lastImage: string = null;
  image_uploaded: string = null;
  public title_button : string;
  public category :  Category;
  constructor(  public translate : TranslationPipe,private imageResizer: ImageResizer,public http: Http,public menuprovider:MenuProvider,public userprovider:UserProvider,private camera: Camera,
    private transfer: Transfer,
    public params: NavParams, public actionSheetCtrl: ActionSheetController,  private filePath: FilePath,
    public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController, private file: File,
    public viewCtrl: ViewController) {
    this.id = this.params.get('id');
    if(this.id===0){
      this.category = new Category(0,'',{"id":0, "name":'','text_color':'#000'},this.http);
      this.title = "create_new_cat";
      this.title_button = "create";
    }
    else{
      this.category = this.params.get('cat');
      if(this.category.full_record.image_url){
        this.image_uploaded = this.category.full_record.image_url;
      }
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
  submit(){
     this.loading = this.loadingCtrl.create({
    content: this.translate.transform('saving')+' '+this.translate.transform('category'),
  });
  this.loading.present();
    this.category.save(this.userprovider.emailaddress,this.userprovider.token).subscribe(res => {
      this.loading.dismissAll();
      if (!res.errorMessage) {
        if(this.id===0){
          this.menuprovider.categories.push( new Category(res.id,res.name,res,this.http));
        }
        else{
          if(res.Attributes){
            this.menuprovider.updatecategory(this.category.id,res.Attributes);
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
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.translate.transform('select_image_source'),
      buttons: [
        {
          text:  this.translate.transform('load_from_library'),
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
          text:this.translate.transform('cancel'),
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
public uploadImage() {
  // Destination URL
  var url = "http://www.sertigapps.com/upload/upload_image.php";
 
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
      if(this.category.full_record.image_url && this.category.full_record.image_url!=''){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        headers.append('sertig_token',this.userprovider.token.toString());
        headers.append('sertig_email',this.userprovider.emailaddress.toString());
        
        let data = {item:this.category.full_record.image_url.split('/').pop(),appid:'labarraapp'};
        
      this.http.post('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/deleteimage', JSON.stringify(data), options).map(res => res.json()).subscribe((data)=>{
      console.log('imagedeleted');
      });
      }
      this.image_uploaded = this.pathForImageShow(this.lastImage);
      this.category.full_record.image_url = this.image_uploaded;
    }, err => {
      console.log(err);
      this.loading.dismissAll()
      this.presentToast(this.translate.transform('error_uploading'));
    });
  })
  .catch(e => console.log('Error resizing',e));
}

}
