import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeaccountPage } from './changeaccount';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ChangeaccountPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ChangeaccountPage),
  ],
})
export class ChangeaccountPageModule {}
