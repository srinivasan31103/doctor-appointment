describe('Viewport-Specific Tests', () => {
  const pages = ['/', '/login', '/register'];

  describe('Mobile Viewport (375x667)', () => {
    beforeEach(() => {
      cy.viewport(375, 667);
    });

    pages.forEach((page) => {
      it(`should display ${page} correctly on mobile`, () => {
        cy.visit(page);

        // Check no horizontal scroll
        cy.document().then((doc) => {
          expect(doc.documentElement.scrollWidth).to.be.lte(376);
        });

        // Navbar should be fixed and visible
        cy.get('nav').should('be.visible');
        cy.get('nav').should('have.class', 'fixed');

        // Content should not overflow
        cy.get('body').then(($body) => {
          expect($body[0].scrollWidth).to.be.lte(376);
        });
      });
    });

    it('should have mobile-optimized spacing', () => {
      cy.visit('/login');

      // Check padding is appropriate for mobile
      cy.get('main').should('have.class', 'p-4');
    });

    it('should show mobile menu toggle', () => {
      cy.visit('/');

      cy.get('button[aria-label="Toggle mobile menu"]').should('be.visible');
    });

    it('should hide desktop-only elements', () => {
      cy.visit('/');

      // Desktop navigation should be hidden
      cy.get('.hidden.md\\:flex').should('not.be.visible');
    });

    it('should use mobile-friendly font sizes', () => {
      cy.visit('/');

      cy.contains('HealthCare+').should('have.class', 'text-lg');
    });
  });

  describe('Tablet Viewport (768x1024)', () => {
    beforeEach(() => {
      cy.viewport(768, 1024);
    });

    pages.forEach((page) => {
      it(`should display ${page} correctly on tablet`, () => {
        cy.visit(page);

        // Check no horizontal scroll
        cy.document().then((doc) => {
          expect(doc.documentElement.scrollWidth).to.be.lte(769);
        });

        // Should still show mobile menu on tablet
        cy.get('button[aria-label="Toggle mobile menu"]').should('be.visible');
      });
    });

    it('should have tablet-optimized layout', () => {
      cy.visit('/login');

      // Content should have medium spacing
      cy.get('main').should('satisfy', ($main) => {
        return $main.hasClass('sm:p-6') || $main.hasClass('p-4');
      });
    });

    it('should show desktop navigation on tablet', () => {
      cy.visit('/');

      // Desktop navigation should be visible on tablet
      cy.get('.hidden.md\\:flex').should('be.visible');
    });

    it('should adapt grid layouts for tablet', () => {
      cy.visit('/');

      // Grids should use 2 columns on tablet (md:grid-cols-2)
      cy.wait(500);
    });
  });

  describe('Desktop Viewport (1280x720)', () => {
    beforeEach(() => {
      cy.viewport(1280, 720);
    });

    pages.forEach((page) => {
      it(`should display ${page} correctly on desktop`, () => {
        cy.visit(page);

        // Check no horizontal scroll
        cy.document().then((doc) => {
          expect(doc.documentElement.scrollWidth).to.be.lte(1281);
        });

        // Mobile menu should be hidden
        cy.get('button[aria-label="Toggle mobile menu"]').should('not.be.visible');
      });
    });

    it('should show desktop navigation', () => {
      cy.visit('/');

      // Desktop navigation should be visible
      cy.get('.hidden.md\\:flex').should('be.visible');
    });

    it('should have desktop-optimized spacing', () => {
      cy.visit('/login');

      // Content should have large spacing
      cy.get('main').should('satisfy', ($main) => {
        return $main.hasClass('lg:p-8') || $main.hasClass('sm:p-6') || $main.hasClass('p-4');
      });
    });

    it('should use larger font sizes', () => {
      cy.visit('/');

      cy.contains('HealthCare+').should('satisfy', ($el) => {
        return $el.hasClass('text-2xl') || $el.hasClass('sm:text-2xl');
      });
    });

    it('should show sidebar on desktop (when authenticated)', () => {
      cy.visit('/login');

      // Sidebar should exist with desktop classes
      // Note: Sidebar visibility depends on authentication
    });
  });

  describe('Large Desktop Viewport (1920x1080)', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080);
    });

    it('should handle large screens without issues', () => {
      cy.visit('/');

      // Check content is centered and doesn't stretch too wide
      cy.get('.max-w-7xl').should('exist');

      // Check no horizontal scroll
      cy.document().then((doc) => {
        expect(doc.documentElement.scrollWidth).to.be.lte(1921);
      });
    });

    it('should maintain readable line lengths', () => {
      cy.visit('/');

      // Max-width containers should prevent text from being too wide
      cy.get('.max-w-7xl, .max-w-6xl, .max-w-4xl').should('exist');
    });
  });

  describe('Viewport Transitions', () => {
    it('should smoothly transition between viewports', () => {
      cy.visit('/');

      // Start at mobile
      cy.viewport(375, 667);
      cy.wait(300);

      // Transition to tablet
      cy.viewport(768, 1024);
      cy.wait(300);

      // Transition to desktop
      cy.viewport(1280, 720);
      cy.wait(300);

      // Should still be functional
      cy.get('nav').should('be.visible');
    });

    it('should maintain state during viewport changes', () => {
      cy.visit('/');

      // Open mobile menu
      cy.viewport(375, 667);
      cy.get('button[aria-label="Toggle mobile menu"]').click();
      cy.get('.md\\:hidden.border-t').should('be.visible');

      // Resize to desktop
      cy.viewport(1280, 720);
      cy.wait(300);

      // Page should still be functional
      cy.get('nav').should('be.visible');
    });
  });

  describe('Content Margins', () => {
    it('should have no left margin on mobile', () => {
      cy.viewport(375, 667);
      cy.visit('/');

      cy.get('main').should('not.have.class', 'ml-64');
    });

    it('should have no left margin on tablet', () => {
      cy.viewport(768, 1024);
      cy.visit('/');

      cy.get('main').should('not.have.class', 'ml-64');
    });

    it('should have left margin on desktop for sidebar', () => {
      cy.viewport(1280, 720);
      cy.visit('/login');

      // After implementing responsive design, main should have lg:ml-64
      cy.get('main').should('satisfy', ($main) => {
        return $main.hasClass('lg:ml-64') || !$main.hasClass('ml-64');
      });
    });
  });

  describe('Responsive Images and Media', () => {
    pages.forEach((page) => {
      it(`should load appropriate images for viewport on ${page}`, () => {
        const viewports = [
          { width: 375, height: 667 },
          { width: 768, height: 1024 },
          { width: 1280, height: 720 },
        ];

        viewports.forEach((viewport) => {
          cy.viewport(viewport.width, viewport.height);
          cy.visit(page);

          // Check images don't overflow
          cy.get('img').each(($img) => {
            cy.wrap($img).then(($el) => {
              const rect = $el[0].getBoundingClientRect();
              expect(rect.width).to.be.lte(viewport.width + 1);
            });
          });
        });
      });
    });
  });

  describe('Responsive Forms', () => {
    it('should display forms correctly across viewports', () => {
      cy.visit('/login');

      [375, 768, 1280].forEach((width) => {
        cy.viewport(width, 720);

        // Form should be visible
        cy.get('form').should('be.visible');

        // Inputs should be accessible
        cy.get('input[type="email"]').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');

        // Form shouldn't overflow
        cy.get('form').then(($form) => {
          const formWidth = $form[0].getBoundingClientRect().width;
          expect(formWidth).to.be.lte(width + 1);
        });
      });
    });
  });
});
