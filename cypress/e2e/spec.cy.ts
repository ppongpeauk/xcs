const url = 'http://localhost:3000';

describe('main', () => {
  beforeEach(() => {
    cy.visit(url);
  });
  it('login successful', () => {
    Cypress.session.clearCurrentSessionData();
    // input login information
    cy.visit(url + '/auth/logout');
    cy.url().should('include', '/auth/login');
    cy.visit(url + '/auth/login');
    cy.get('input[name="email"]').type('xcs+test@restrafes.co');
    cy.get('input[name="password"]').type('qzu3pmy*vna8pmq6UKH');
    cy.get('button[type="submit"]').click();
    // check if login is successful
    cy.url().should('include', '/home');
  });
  it('settings', () => {
    cy.visit(url + '/settings/profile');
    cy.contains('Save').click();
  });
});
