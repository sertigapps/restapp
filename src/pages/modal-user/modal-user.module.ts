import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalUserPage } from './modal-user';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ModalUserPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ModalUserPage),
  ],
})
export class ModalUserPageModule {}
