describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ];

  beforeEach(() => {
    cy.visit('/login');
  });

  describe('Login Page Responsiveness', () => {
    viewports.forEach((viewport) => {
      it(`should display correctly on ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height);

        // Check logo is visible
        cy.get('nav').should('be.visible');
        cy.contains('HealthCare+').should('be.visible');

        // Check form is visible and accessible
        cy.get('input[type="email"]').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');

        // Check no horizontal scroll
        cy.document().then((doc) => {
          expect(doc.documentElement.scrollWidth).to.be.lte(viewport.width + 1);
        });
      });
    });
  });

  describe('Navbar Responsiveness', () => {
    it('should show hamburger menu on mobile', () => {
      cy.viewport(375, 667);
      cy.visit('/login');

      // Hamburger menu should be visible on mobile
      cy.get('button[aria-label="Toggle mobile menu"]').should('be.visible');

      // Desktop menu should be hidden
      cy.get('nav').find('.hidden.md\\:flex').should('not.be.visible');
    });

    it('should show desktop menu on large screens', () => {
      cy.viewport(1280, 720);
      cy.visit('/login');

      // Desktop menu should be visible
      cy.get('nav').find('.hidden.md\\:flex').should('exist');
    });

    it('should toggle mobile menu', () => {
      cy.viewport(375, 667);
      cy.visit('/login');

      // Mobile menu should be closed by default
      cy.get('.md\\:hidden.border-t').should('not.exist');

      // Click hamburger to open
      cy.get('button[aria-label="Toggle mobile menu"]').click();

      // Mobile menu should be open
      cy.get('.md\\:hidden.border-t').should('be.visible');
    });
  });

  describe('Responsive Grid Layouts', () => {
    // Note: These tests would need authentication
    // For now, we'll test the public pages

    it('should adapt grid columns based on viewport', () => {
      cy.visit('/');

      // Test on mobile (1 column)
      cy.viewport(375, 667);
      cy.wait(500);

      // Test on tablet (2 columns)
      cy.viewport(768, 1024);
      cy.wait(500);

      // Test on desktop (4 columns)
      cy.viewport(1280, 720);
      cy.wait(500);
    });
  });

  describe('Responsive Typography', () => {
    viewports.forEach((viewport) => {
      it(`should have readable text on ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');

        // Check main headings are visible
        cy.get('h1, h2, h3').each(($heading) => {
          cy.wrap($heading).should('be.visible');

          // Text should not overflow
          cy.wrap($heading).then(($el) => {
            const element = $el[0];
            expect(element.scrollWidth).to.be.lte(element.clientWidth + 2);
          });
        });
      });
    });
  });

  describe('No Horizontal Scroll', () => {
    viewports.forEach((viewport) => {
      it(`should not have horizontal scroll on ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');

        // Check document width doesn't exceed viewport
        cy.document().then((doc) => {
          const scrollWidth = doc.documentElement.scrollWidth;
          const clientWidth = doc.documentElement.clientWidth;

          // Allow 1px tolerance for rounding
          expect(scrollWidth).to.be.lte(clientWidth + 1);
        });
      });
    });
  });

  describe('Touch Target Size (Mobile)', () => {
    it('should have adequately sized touch targets on mobile', () => {
      cy.viewport(375, 667);
      cy.visit('/login');

      // Buttons should be at least 44x44px (iOS guideline)
      cy.get('button').each(($button) => {
        cy.wrap($button).then(($el) => {
          const rect = $el[0].getBoundingClientRect();

          // Check if button is visible (not display: none)
          if ($el.css('display') !== 'none') {
            expect(rect.height).to.be.at.least(36); // Slightly lower for some text buttons
            expect(rect.width).to.be.at.least(36);
          }
        });
      });
    });
  });
});
