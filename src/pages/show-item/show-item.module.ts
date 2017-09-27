import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowItemPage } from './show-item';

@NgModule({
  declarations: [
    ShowItemPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowItemPage),
  ],
})
export class ShowItemPageModule {}
