import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminSubcategoriesPage } from './admin-subcategories';

@NgModule({
  declarations: [
    AdminSubcategoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(AdminSubcategoriesPage),
  ],
})
export class AdminSubcategoriesPageModule {}
