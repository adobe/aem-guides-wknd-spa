import { NavigationLink } from './navigation-link';

describe('NavigationLink', () => {
  it('should create an instance', () => {
    const data = {
      children: [],
      level: 1,
      active: false,
      path: '/content/wknd-spa-angular/us/en/home/page-1',
      description: null,
      url: '/content/wknd-spa-angular/us/en/home/page-1.html',
      lastModified: 1589429385100,
      title: 'Page 1'
    };
    expect(new NavigationLink(data)).toBeTruthy();
  });
});
