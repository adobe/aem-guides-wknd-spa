import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isHome = false;
  homePageUrl;

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    this.setHomePage();
  }


  setHomePage() {
    this.isHome = '/content/wknd-spa-angular/us/en/home' === this.route.snapshot.data.path;
    this.homePageUrl = '/content/wknd-spa-angular/us/en/home.html';
  }

  onBackClick() {
  this.location.back();
  }

  onMenuToggle() {
    this.isMenuOpen = this.isMenuOpen ? false : true;
  }

}
