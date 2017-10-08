import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderViewPage } from './order-view';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    OrderViewPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(OrderViewPage),
  ],
})
export class OrderViewPageModule {}
