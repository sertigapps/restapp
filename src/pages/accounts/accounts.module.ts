import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountsPage } from './accounts';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    AccountsPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AccountsPage),
  ],
})
export class AccountsPageModule {}
