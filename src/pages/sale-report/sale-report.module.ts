import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaleReportPage } from './sale-report';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    SaleReportPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(SaleReportPage),
  ],
})
export class SaleReportPageModule {}
