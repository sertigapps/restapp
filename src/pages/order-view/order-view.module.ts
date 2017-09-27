import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderViewPage } from './order-view';

@NgModule({
  declarations: [
    OrderViewPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderViewPage),
  ],
})
export class OrderViewPageModule {}
