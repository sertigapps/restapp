import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminIngredientsPage } from './admin-ingredients';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    AdminIngredientsPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AdminIngredientsPage),
  ],
})
export class AdminIngredientsPageModule {}
