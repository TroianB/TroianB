import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import CountryList from 'country-list-with-dial-code-and-flag'


@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss'],
  standalone: true,  // Mark the component as standalone
  imports: [CommonModule, SharedModule, ToastModule, RouterModule],
  providers: [MessageService]
})
export class ContactusComponent implements OnInit {

  contactForm!: FormGroup;
  countries = CountryList.getAll();
  selectedCountry = this.countries[28];
  constructor(private fb: FormBuilder, private api: ApiService, private messageService: MessageService) { }

  ngOnInit(): void {
    console.log(CountryList.getAll())
    this.contactForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      country_code: [this.selectedCountry.countryCode, [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
      checked: ['', Validators.required]
    });

  }
  formatPhoneNumber() {
    // const phoneUtil = new AsYouType();
    const formattedNumber = (this.contactForm.get('country_code')?.value);
    this.contactForm.get('country_code')?.setValue(formattedNumber);
  }
  restrictNonAlphabeticInput(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.keyCode);
    if (!/^[a-zA-Z]+$/.test(inputChar)) {
      event.preventDefault(); // Prevent input if it’s not alphabetic
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.api.createContactForm(this.contactForm.value).subscribe({
        next: (res: any) => {
          console.log(res);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message sent successfully' });
          this.contactForm.reset();
        }, error: (err: any) => {
          console.log(err)
        }
      })
    }
    else {
      this.contactForm.markAllAsTouched();
    }
  }

}
