import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuCategoryPage } from './menu-category';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    MenuCategoryPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(MenuCategoryPage),
  ],
})
export class MenuCategoryPageModule {}
