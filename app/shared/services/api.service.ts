import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

const toursDetails = 'tours_details';
const bookingId = 'booking_id';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Create a BehaviorSubject initialized with the value from localStorage or a default value
  private dataSubject = new BehaviorSubject<any>(this.getDataFromLocalStorage());
  private bookingIdSubject = new BehaviorSubject<any>(this.getBookingIdFromLocalStorage());

  // Expose the BehaviorSubject as an observable
  toursData$ = this.dataSubject.asObservable();
  bookingIdSubject$ = this.bookingIdSubject.asObservable();

  // Get data from localStorage
  private getDataFromLocalStorage(): any {
    const data = localStorage.getItem(toursDetails);
    return data ? JSON.parse(data) : null;
  }

  setData(newData: any): void {
    // Update localStorage
    localStorage.setItem(toursDetails, JSON.stringify(newData));

    this.dataSubject.next(newData);
  }
  // Get booking id from localStorage
  private getBookingIdFromLocalStorage(): any {
    const data = localStorage.getItem(bookingId);
    return data ? JSON.parse(data) : null;
  }
  setBookingId(newData: any): void {
    // Update localStorage
    localStorage.setItem(bookingId, JSON.stringify(newData));

    this.bookingIdSubject.next(newData);
  }

  // Clear data from localStorage and reset the BehaviorSubject
  clearData(): void {
    localStorage.removeItem(toursDetails);
    this.dataSubject.next(null);
  }

  getHomeBanners() {
    return this.http.get(`${this.apiUrl}/banner`);
  }


  getTours() {
    return this.http.get(`${this.apiUrl}/tours`)
  }

  getSingleTourDetails(id: any) {
    return this.http.get(`${this.apiUrl}/tours/${id}`)
  }

  getSpots(id: any) {
    return this.http.get(`${this.apiUrl}/spots/${id}`);
  }
  getSpot(id: any) {
    return this.http.get(`${this.apiUrl}/spots/spot/${id}`);
  }

  getActivities(id: any) {
    return this.http.get(`${this.apiUrl}/activities/spot/${id}`);
  }
  getAllActivities() {
    return this.http.get(`${this.apiUrl}/activities`);
  }
  getBlogs() {
    return this.http.get(`${this.apiUrl}/blogs`);
  }
  getBlogById(id: any) {
    return this.http.get(`${this.apiUrl}/blogs/${id}`);
  }
  createBooking(data: any) {
    return this.http.post(`${this.apiUrl}/booking`, data);
  }
  getBookingById(id: any) {
    return this.http.get(`${this.apiUrl}/booking/${id}`);
  }

  createPaypalOrder(amount: number) {
    return this.http.post(`${this.apiUrl}/payment/create`, { amount });

  }
  storePaymentDetails(paymentDetails: any) {
    return this.http.post(`${this.apiUrl}/payment`, paymentDetails);
  }

  createFeedback(data: any) {
    return this.http.post(`${this.apiUrl}/feedback`, data);

  }
  createContactForm(data: any) {
    return this.http.post(`${this.apiUrl}/contact`, data);

  }
  getPrivacyPolicy() {
    return this.http.get(`${this.apiUrl}/privacy-policy`);
  }
  getGalleryData() {
    return this.http.get(`${this.apiUrl}/gallery`)
  }
  getSingleGalleryData(id: any) {
    return this.http.get(`${this.apiUrl}/gallery/${id}`)
  }
}

