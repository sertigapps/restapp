import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowItemPage } from './show-item';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ShowItemPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ShowItemPage),
  ],
})
export class ShowItemPageModule {}
