import { style } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  priceDetails: any;
  selectAccount: any;
  cardNumber: any;
  orderID: any
  bookingId: any;
  tourBookingDetails: any;

  paypalLoading: boolean = false;
  showPayPalButton: boolean = false;

  visible: boolean = false;
  errorVisible: boolean = false;

  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;
  constructor(private api: ApiService) { }

  async createOrder() {
    this.paypalLoading = true;
    try {
      const amount = this.tourBookingDetails?.totalPrice;
      this.api.createPaypalOrder(amount).subscribe((response: any) => {
        // console.log("response: ", response)
        this.orderID = response.orderID;
        // console.log('Order ID:', this.orderID);
        this.paypalLoading = false;
        this.initiatePayPalPayment();
      }, (err: any) => {
        // console.log(err);
        this.paypalLoading = false;
      }
      );
    } catch (error) {
      this.paypalLoading = false
      console.error('Error creating order:', error);
    }
  }

  initiatePayPalPayment() {

    window.scrollTo({ top: 0, behavior: 'smooth' });
    paypal.Buttons({
      createOrder: () => {
        // Use the order ID created by the backend
        return this.orderID;
      },
      onApprove: async (data: any, actions: any) => {
        // Capture the payment on approval
        const captureResponse = await actions.order.capture();
        // console.log('Payment completed successfully:', captureResponse);

        const payerID = captureResponse.payer.payer_id;
        const amount = this.tourBookingDetails?.totalPrice;
        const paymentStatus = captureResponse.status;
        // console.log(paymentStatus);

        // Call the API to store payment details
        this.api.storePaymentDetails({
          orderID: this.orderID,
          bookingId: this.bookingId,
          amount,
          paymentStatus,
          payerID,
        }).subscribe((res: any) => {
          this.errorVisible = false;
          this.visible = true; // Show success message or confirmation
          // console.log(res);
        }, (err: any) => {
          this.errorVisible = true;
          this.visible = false;
          console.error('Error storing payment details:', err);
        });

      },
      onError: (err: any) => {
        console.error('Payment error:', err);

        this.api.storePaymentDetails({
          orderID: this.orderID,
          bookingId: this.bookingId,
          errorMessage: err.message,
          errorDetails: err,
          paymentStatus: 'ERROR',
        }).subscribe({
          next: (response: any) => {
            console.log('Error details stored successfully:', response);
          },
          error: (storeError: any) => {
            console.error('Error storing payment error details:', storeError);
          }
        });

      }
    }).render('#paypal-button-container');
  }

  onPayButtonClick() {
    this.paypalLoading = true;
    setTimeout(() => {
      this.paypalLoading = false;
      this.showPayPalButton = true;

      // Render PayPal buttons in the new div
      this.createOrder()
    }, 100);

  }


  ngOnInit(): void {
    this.api.bookingIdSubject$.subscribe((res: any) => {
      console.log(res);
      this.bookingId = res._id;

      this.api.getBookingById(this.bookingId).subscribe({
        next: (res: any) => {
          console.log(res);
          this.tourBookingDetails = res;
          this.priceDetails = res.priceDetails;
        }, error: (err: any) => {
          console.log(err);
        }
      });
    });
    console.log(window.paypal);
  }

}
