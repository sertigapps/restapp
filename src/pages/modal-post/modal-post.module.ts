import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalPostPage } from './modal-post';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ModalPostPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ModalPostPage),
  ],
})
export class ModalPostPageModule {}
