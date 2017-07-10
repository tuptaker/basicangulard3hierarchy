import { BasichierarchyPage } from './app.po';

describe('basichierarchy App', () => {
  let page: BasichierarchyPage;

  beforeEach(() => {
    page = new BasichierarchyPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
