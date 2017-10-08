import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminItemsPage } from './admin-items';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    AdminItemsPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AdminItemsPage),
  ],
})
export class AdminItemsPageModule {}
