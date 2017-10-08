import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalItemPage } from './modal-item';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ModalItemPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ModalItemPage),
  ],
})
export class ModalItemPageModule {}
