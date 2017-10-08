import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactUsPage } from './contact-us';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    ContactUsPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ContactUsPage),
  ],
})
export class ContactUsPageModule {}
