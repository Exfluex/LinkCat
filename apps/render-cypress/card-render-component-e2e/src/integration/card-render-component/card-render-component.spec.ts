describe('card-render-component: CardRenderComponent component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=cardrendercomponent--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to CardRenderComponent!');
    });
});
