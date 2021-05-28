import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import {Location} from '@angular/common';
import { MapTo } from '@adobe/aem-angular-editable-components';
import { NavigationLink } from '../navigation/navigation-link';

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
    if (this.hasNavigation) {
      const rootNavigationLink: NavigationLink = new NavigationLink(this.items[0]);
      this.isHome = rootNavigationLink.path === this.route.snapshot.data.path;
      this.homePageUrl = rootNavigationLink.url;
    }
  }

  onBackClick() {
  this.location.back();
  }

  onMenuToggle() {
    this.isMenuOpen = this.isMenuOpen ? false : true;
  }

}

MapTo('wknd-spa-angular/components/header')(HeaderComponent, HeaderEditConfig);
