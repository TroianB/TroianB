import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import CountryList from 'country-list-with-dial-code-and-flag';
import { MessageService } from 'primeng/api';
import { ApiService } from 'src/app/shared/services/api.service';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [MessageService]
})
export class CheckoutComponent implements OnInit {


  selectedDate: Date | null = null;

  isRotated = true;

  spots: any[] = [
    {
      img: '../../../../../assets/checkout/spot/img2.png',
      title: 'Dolphin Watch',
      desc: 'For a unique dolphin watching experience in Boracay, join a sunrise tour featuring a local guide’s exclusive “dolphin dance” technique to attract dolphins closer. This tour also includes a visit to a secret viewing spot known only to locals, offering intimate and spectacular dolphin encounters not available elsewhere.',
      date: '',
    },
    {
      img: '../../../../../assets/checkout/spot/img1.png',
      title: 'Sports Package',
      desc: 'For a unique sports package in Boracay, enjoy personalized lessons in exclusive water sports like kiteboarding and stand-up paddleboarding at hidden spots. This package includes premium equipment and private training sessions, plus access to local sports events for an insider’s view of the island’s vibrant sports scene.',
      date: '',
    },
  ];
  minDate: Date;

  userForm!: FormGroup;

  //this is for shwing checkout specific section
  checkoutStatus: any = {
    userDetailsStatus: false,
    paymentStatus: false
  }
  visible: boolean = false;

  allToursDetails: any[] = [];
  bookingId: any;

  // Object to store count and price for each category
  priceDetails = {
    adult: { count: 1, price: 0, totalPrice: 0 },  // Adult has 2 by default
    child: { count: 0, price: 0, totalPrice: 0 },  // Child has 2 by default
    infant: { count: 0, price: 0, totalPrice: 0 }    // Infant has 1 by default
  };

  selectedTimes: Date[] = []; // To track selected times
  timeWarningMessage: string[] = [];
  paymentLoading: boolean = false;
  payNowStatus: boolean = false;
  payLaterStatus: boolean = false;
  paymentLatterSuccess: boolean = false;


  countries = CountryList.getAll();
  selectedCountry = this.countries[28];

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private messageService: MessageService) {
    this.minDate = new Date();
  }


  ngOnInit(): void {
    console.log(this.selectedCountry.countryCode)
    this.userForm = this.fb.group({
      user_name: ['', Validators.required],
      country_code: [this.selectedCountry.countryCode, Validators.required],
      user_mobile: [null, [Validators.required]],
      user_email: ['', [Validators.required, Validators.email]],
      user_address: ['', Validators.required],
    });
    // Subscribe to the data observable
    this.api.toursData$.subscribe((data: any) => {
      this.allToursDetails = [...data];

      this.allToursDetails[0].startDate = null;
      this.allToursDetails[0].endDate = null;

      for (let i = 1; i < this.allToursDetails.length; i++) {
        this.allToursDetails[i].date = null;
        this.allToursDetails[i].time = null; // Add time to the remaining objects
        this.selectedTimes.push(new Date());
      }
      console.log(this.allToursDetails);

      //call for starting price
      this.calculateTotalPrices();
    });

  }

  formatPhoneNumber() {
    // const phoneUtil = new AsYouType();
    const formattedNumber = (this.userForm.get('country_code')?.value);
    this.userForm.get('country_code')?.setValue(formattedNumber);
  }
  // Enforce max length of 10 digits
  restrictToTenDigits(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    // Allow only numbers (0-9) and limit to 10 digits
    const isNumberKey = event.key >= '0' && event.key <= '9';
    const isControlKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(event.key);

    // Prevent input if not a number and the input length is already 10
    if (!isNumberKey && !isControlKey) {
      event.preventDefault();
    } else if (input.value.length >= 10 && isNumberKey) {
      console.log('hi');
      event.preventDefault(); // Prevent adding more than 10 digits
    }
  }
  onStartDateSelect() {
    if (this.allToursDetails[0].startDate) {
      this.allToursDetails[0].endDate = null; // Clear the end date if necessary
    }
  }

  // This method checks if the selected date is today
  isToday(selectedDate: Date): boolean {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  }

  // This method determines the min time based on the selected date
  getMinTime(date: any): Date {
    if (date && this.isToday(date)) {
      const minTime = new Date();
      minTime.setSeconds(0); // Reset seconds if necessary
      return minTime; // Return current time as the minimum
    }
    return new Date(0); // No min time restriction if not today
  }

  // Method to allow only letters (alphabets) in input fields using RegEx
  allowLettersOnly(event: KeyboardEvent): boolean {
    const inputChar = String.fromCharCode(event.charCode); // Get the character from the charCode
    const regex = /^[a-zA-Z\s]*$/;
    if (regex.test(inputChar)) {
      return true;
    } else {
      event.preventDefault(); // Prevent the input if it doesn't match the pattern
      return false;
    }
  }

  addTime(event: Date, activityIndex: number) {

    const selectedTime = new Date(event);
    selectedTime.setSeconds(0, 0);
    // Check if the time is already selected
    if (this.isTimeSelected(selectedTime, activityIndex)) {
      alert('This time is already selected for another activity.');
      // //this is for set placeholder after model work
      // setTimeout(() => {
      //   this.allToursDetails[activityIndex].time = null; // Or you can restore the previous value
      // }, 0);

      // //this  is  for when time is same then need to increase by one hour
      // setTimeout(() => {
      //   // Add 1 hour to the selected time
      //   const updatedTime = new Date(event);
      //   updatedTime.setHours(event.getHours() + 1);
      //   this.allToursDetails[activityIndex].time = updatedTime;

      // }, 0);
      this.timeWarningMessage[activityIndex - 1] = "Time is already selected !";
    } else {
      // Store selected time
      this.allToursDetails[activityIndex].time = selectedTime;
      this.selectedTimes[activityIndex - 1] = selectedTime;
      this.timeWarningMessage[activityIndex - 1] = "";


      //for time not below of todays date
    }
  }
  get timeWarningStatus() {
    return this.timeWarningMessage.some(message => message?.trim() !== "");
  }

  isTimeSelected(time: Date, currentIndex: number): boolean {
    return this.selectedTimes.some((selectedTime, index) => {
      // Check if the selected time belongs to a different activity
      return index !== currentIndex - 1 && selectedTime.getTime() === time.getTime();
    });
  }

  calculateTotalPrices() {
    const newPriceDetails = {
      adult: { ...this.priceDetails.adult, price: 0 },
      child: { ...this.priceDetails.child, price: 0 },
      infant: { ...this.priceDetails.infant, price: 0 }
    };

    this.allToursDetails.forEach(tour => {
      // Sum prices from the main object
      if (tour.price_adult) {
        newPriceDetails.adult.price += parseInt(tour.price_adult);
      }
      if (tour.price_child) {
        newPriceDetails.child.price += parseInt(tour.price_child);
      }
      if (tour.price_infant) {
        newPriceDetails.infant.price += parseInt(tour.price_infant);
      }

      // If the tour has spot_id with prices, include those as well
      if (tour.spot_id) {
        if (tour.spot_id.price_adult) {
          newPriceDetails.adult.price += parseInt(tour.spot_id.price_adult);
        }
        if (tour.spot_id.price_child) {
          newPriceDetails.child.price += parseInt(tour.spot_id.price_child);
        }
        if (tour.spot_id.price_infant) {
          newPriceDetails.infant.price += parseInt(tour.spot_id.price_infant);
        }
      }
    });

    // Calculate total prices based on count
    newPriceDetails.adult.totalPrice = newPriceDetails.adult.price * newPriceDetails.adult.count;
    newPriceDetails.child.totalPrice = newPriceDetails.child.price * newPriceDetails.child.count;
    newPriceDetails.infant.totalPrice = newPriceDetails.infant.price * newPriceDetails.infant.count;

    this.priceDetails = newPriceDetails;
  }

  // Function to increment the count
  increment(type: 'adult' | 'child' | 'infant') {
    this.priceDetails[type].count++;
    this.calculateTotalPrice(type);
  }

  // Function to decrement the count
  decrement(type: 'adult' | 'child' | 'infant') {
    if (this.priceDetails[type].count > 0) {
      this.priceDetails[type].count--;
      this.calculateTotalPrice(type);
    }
  }

  // Function to recalculate total price based on count
  calculateTotalPrice(type: 'adult' | 'child' | 'infant') {
    this.priceDetails[type].totalPrice = this.priceDetails[type].count * this.priceDetails[type].price;
  }

  getTotalPrice(): number {
    return this.priceDetails.adult.totalPrice +
      this.priceDetails.child.totalPrice +
      this.priceDetails.infant.totalPrice;
  }

  goBack() {
    window.history.back()
  }

  onPayment() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      this.payNowStatus = true;
      this.payLaterStatus = false;
      this.createBooking(true);
    }
    else {
      this.userForm.markAllAsTouched();
    }
  }
  onLaterPayment() {
    this.visible = true;
    if (this.userForm.valid) {
      console.log(this.userForm.value);
      this.payNowStatus = false;
      this.payLaterStatus = true;
      this.createBooking(false);
    }
    else {
      this.userForm.markAllAsTouched();
    }
  }
  createBooking(payNow: boolean) {

    this.paymentLoading = true;

    let payload = {
      ...this.userForm.value,
      tours_details: this.allToursDetails,
      priceDetails: this.priceDetails,
      totalPrice: this.priceDetails.adult.totalPrice + this.priceDetails.child.totalPrice + this.priceDetails.infant.totalPrice,
      payNow: payNow,
      paymentStatus: 'Pending',
    };
    if (payload.totalPrice <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Select at least one people' });
      this.paymentLoading = true;
      this.payLaterStatus = false;
      this.paymentLatterSuccess = false;
      this.payNowStatus = false;

      return;
    }
    this.api.createBooking(payload).subscribe({
      next: (res: any) => {
        console.log(res);
        this.paymentLoading = false;
        this.paymentLatterSuccess = true;
        if (res.payNow) {
          this.router.navigate(['tours/payment']);
        }
        //set to local storage
        this.api.setBookingId(res);
      },
      error: (err: any) => {
        console.log(err);
        this.paymentLoading = true;
        this.payLaterStatus = false;
        this.paymentLatterSuccess = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Booking Faild' });

      }
    })
  }

  toggleRotation() {
    this.isRotated = !this.isRotated;
  }
  // Method to open the PrimeNG calendar when clicking on the custom icon
  openCalendar(calendar: any) {
    calendar.toggle();
    console.log(this.allToursDetails);
  }
  selectTime(timePicker: any) {
    timePicker.toggle();
  }


}
