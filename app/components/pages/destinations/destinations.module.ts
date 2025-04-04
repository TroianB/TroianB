import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DestinationsRoutingModule } from './destinations-routing.module';
import { DestinationComponent } from './destination/destination.component';
import { DestinationDetailsComponent } from './destination-details/destination-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent } from './payment/payment.component';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { ToastModule } from 'primeng/toast';


@NgModule({
  declarations: [
    DestinationComponent,
    DestinationDetailsComponent,
    CheckoutComponent,
    PaymentComponent 
  ],
  imports: [
    CommonModule,
    DestinationsRoutingModule,
    SharedModule,
    ToastModule
  ]
})
export class DestinationsModule { }
