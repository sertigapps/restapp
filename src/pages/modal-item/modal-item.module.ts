import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalItemPage } from './modal-item';

@NgModule({
  declarations: [
    ModalItemPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalItemPage),
  ],
})
export class ModalItemPageModule {}
