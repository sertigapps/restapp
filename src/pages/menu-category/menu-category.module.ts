import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuCategoryPage } from './menu-category';

@NgModule({
  declarations: [
    MenuCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(MenuCategoryPage),
  ],
})
export class MenuCategoryPageModule {}
