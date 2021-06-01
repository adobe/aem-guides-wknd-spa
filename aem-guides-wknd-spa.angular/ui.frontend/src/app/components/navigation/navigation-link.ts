export class NavigationLink {

    title: string;
    path: string;
    url: string;
    level: number;
    children: NavigationLink[];
    active: boolean;

    constructor(data) {
      this.path = data.path;
      this.title = data.title;
      this.url = data.url;
      this.level = data.level;
      this.active = data.active;
      this.children = data.children.map( item => {
          return new NavigationLink(item);
      });
    }
  }
