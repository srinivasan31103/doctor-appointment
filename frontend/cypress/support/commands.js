// Custom Cypress commands for testing

// Login command
Cypress.Commands.add('login', (email = 'admin@healthcare.com', password = 'admin123') => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/login');
});

// Logout command
Cypress.Commands.add('logout', () => {
  cy.contains('Logout').click();
  cy.url().should('include', '/login');
});

// Check responsive element visibility
Cypress.Commands.add('checkResponsiveVisibility', (selector, viewport) => {
  const viewports = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 },
  };

  cy.viewport(viewports[viewport].width, viewports[viewport].height);
  cy.wait(500); // Wait for animations
});

// Check if element is visible in viewport
Cypress.Commands.add('isInViewport', (selector) => {
  cy.get(selector).then(($el) => {
    const bottom = Cypress.$(cy.state('window')).height();
    const rect = $el[0].getBoundingClientRect();

    expect(rect.top).not.to.be.greaterThan(bottom);
    expect(rect.bottom).not.to.be.greaterThan(bottom);
  });
});
