import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  menuOpen: boolean = false;
  headerBackgroundColor: string = 'linear-gradient(89.64deg, rgba(0, 0, 0, 0.0384) -3.8%, rgba(51, 51, 51, 0.7296) 46.83%, rgba(1, 24, 2, 0.96) 94.34%)';

  constructor(private router: Router) { }

  ngOnInit(): void {
      // Subscribe to router events to listen for route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateHeaderColor(event.urlAfterRedirects);
      }
    });
  }
  // Function to change header background color based on route
  updateHeaderColor(url: string): void {
    if (url === '/home') {
      this.headerBackgroundColor = 'lightblue';
    } else if (url === '/about') {
      this.headerBackgroundColor = 'linear-gradient(89.64deg, rgba(29, 49, 3, 0.04) -3.8%, #869F44 18.75%, rgba(68, 110, 11, 0.772579) 51.32%, #172001 94.34%)';
    } else if (url.includes('blogs')) {
      this.headerBackgroundColor = 'linear-gradient(89.64deg, rgba(29, 49, 3, 0.04) -3.8%, #869F44 18.75%, rgba(68, 110, 11, 0.772579) 51.32%, #172001 94.34%)';
    } else if (url === '/tours/checkout') {
      this.headerBackgroundColor = 'linear-gradient(89.64deg, rgba(29, 49, 3, 0.04) -3.8%, #869F44 18.75%, rgba(68, 110, 11, 0.772579) 51.32%, #172001 94.34%)';
    } else if (url === '/contact') {
      this.headerBackgroundColor = 'linear-gradient(89.64deg, rgba(29, 49, 3, 0.04) -3.8%, #869F44 18.75%, rgba(68, 110, 11, 0.772579) 51.32%, #172001 94.34%)';
    }
    else {
      this.headerBackgroundColor = 'linear-gradient(89.64deg, rgba(0, 0, 0, 0.0384) -3.8%, rgba(51, 51, 51, 0.7296) 46.83%, rgba(1, 24, 2, 0.96) 94.34%)'; 
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toursSection() {
    this.router.navigate(['']);
    setTimeout(() => {
      const element = document.getElementById('container-3');
      if (element) {
        console.log(element);
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);

  }

}
