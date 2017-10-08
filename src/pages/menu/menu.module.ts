import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuPage } from './menu';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    MenuPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(MenuPage),
  ],
})
export class MenuPageModule {}
