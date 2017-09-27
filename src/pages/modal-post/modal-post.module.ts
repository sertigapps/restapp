import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPostPage } from './modal-post';

@NgModule({
  declarations: [
    ModalPostPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalPostPage),
  ],
})
export class ModalPostPageModule {}
