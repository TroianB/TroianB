import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestinationComponent } from './destination/destination.component';
import { DestinationDetailsComponent } from './destination-details/destination-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentComponent } from './payment/payment.component';

const routes: Routes = [
  {
    path: 'tour/:id', component: DestinationComponent
  },
  {
    path: 'tour-details/:id', component: DestinationDetailsComponent
  },
  {
    path: 'checkout', component: CheckoutComponent
  },
  {
    path: 'payment', component: PaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DestinationsRoutingModule { }
