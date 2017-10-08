import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminSubcategoriesPage } from './admin-subcategories';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    AdminSubcategoriesPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AdminSubcategoriesPage),
  ],
})
export class AdminSubcategoriesPageModule {}
