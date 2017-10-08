import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminCategoriesPage } from './admin-categories';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    AdminCategoriesPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AdminCategoriesPage),
  ],
})
export class AdminCategoriesPageModule {}
