import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import {Location} from '@angular/common';
import {MapTo} from '@adobe/cq-angular-editable-components';

const HeaderEditConfig = {
  emptyLabel: 'Header',
  isEmpty: cqModel =>
    !cqModel || !cqModel.items || cqModel.items.length < 1
};


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() items: object[];
  isMenuOpen = false;
  isHome = false;
  homePageUrl;

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit() {
    this.setHomePage();
  }

  get hasNavigation() {
    return this.items && this.items.length > 0;
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

MapTo('wknd-spa-angular/components/header')(HeaderComponent, HeaderEditConfig);
