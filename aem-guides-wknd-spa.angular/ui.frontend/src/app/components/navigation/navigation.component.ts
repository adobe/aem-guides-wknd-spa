import { Component, OnInit, Input } from '@angular/core';
import { NavigationLink } from './navigation-link';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  @Input() items: object[];

  constructor() { }

  get navigationLinks(): NavigationLink[] {

    if (this.items && this.items.length > 0) {
      return this.items.map(item => {
        return new NavigationLink(item);
      });
    }

    return null;
  }

  ngOnInit() { }

}
