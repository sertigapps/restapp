import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAccountPage } from './modal-account';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ModalAccountPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ModalAccountPage),
  ],
})
export class ModalAccountPageModule {}
