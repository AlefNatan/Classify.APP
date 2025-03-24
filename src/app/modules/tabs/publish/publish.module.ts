import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublishPageRoutingModule } from './publish-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';

import { PublishPage } from './publish.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublishPageRoutingModule,
    SharedModule,
  ],
  declarations: [PublishPage],
})
export class PublishPageModule {}
