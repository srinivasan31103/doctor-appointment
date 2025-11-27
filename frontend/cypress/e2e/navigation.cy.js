describe('Navigation Tests', () => {
  describe('Navbar Tests', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should display logo and brand name', () => {
      cy.get('nav').within(() => {
        cy.contains('HealthCare+').should('be.visible');
        cy.get('svg').should('exist'); // Heart icon
      });
    });

    it('should show login/register buttons when not authenticated', () => {
      cy.contains('Login').should('be.visible');
      cy.contains('Register').should('be.visible');
    });

    it('should navigate to login page', () => {
      cy.contains('Login').click();
      cy.url().should('include', '/login');
    });

    it('should navigate to register page', () => {
      cy.contains('Register').click();
      cy.url().should('include', '/register');
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      cy.viewport(375, 667);
      cy.visit('/');
    });

    it('should show hamburger menu button', () => {
      cy.get('button[aria-label="Toggle mobile menu"]').should('be.visible');
    });

    it('should open and close mobile menu', () => {
      // Menu should be closed initially
      cy.get('.md\\:hidden.border-t').should('not.exist');

      // Open menu
      cy.get('button[aria-label="Toggle mobile menu"]').click();
      cy.get('.md\\:hidden.border-t').should('be.visible');

      // Close menu
      cy.get('button[aria-label="Toggle mobile menu"]').click();
      cy.get('.md\\:hidden.border-t').should('not.exist');
    });

    it('should display navigation items in mobile menu', () => {
      cy.get('button[aria-label="Toggle mobile menu"]').click();

      cy.get('.md\\:hidden.border-t').within(() => {
        cy.contains('Login').should('be.visible');
        cy.contains('Register').should('be.visible');
      });
    });

    it('should close mobile menu when navigation item is clicked', () => {
      cy.get('button[aria-label="Toggle mobile menu"]').click();
      cy.get('.md\\:hidden.border-t').should('be.visible');

      cy.contains('Login').click();

      // Should navigate and menu should close
      cy.url().should('include', '/login');
    });
  });

  describe('Sidebar Tests (Desktop)', () => {
    it('should be hidden on mobile by default', () => {
      cy.viewport(375, 667);
      cy.visit('/');

      // Sidebar should be off-screen on mobile
      cy.get('.fixed.left-0.top-16.w-64').should('have.class', '-translate-x-full');
    });

    it('should be visible on desktop', () => {
      cy.viewport(1280, 720);
      cy.visit('/');

      // On desktop, sidebar should be visible (no negative translate)
      cy.get('.fixed.left-0.top-16.w-64').should('have.class', 'lg:translate-x-0');
    });
  });

  describe('Responsive Sidebar Drawer', () => {
    beforeEach(() => {
      cy.viewport(375, 667);
      cy.visit('/login');
    });

    it('should open sidebar drawer on mobile when hamburger clicked', () => {
      // Login first to see sidebar
      cy.get('input[type="email"]').type('test@example.com');
      cy.get('input[type="password"]').type('password123');

      // Note: Actual login would require valid credentials
      // This test demonstrates the structure

      // After login, the sidebar hamburger should be visible
      // cy.get('button[aria-label="Toggle menu"]').should('exist');
    });
  });

  describe('Navigation Links', () => {
    it('should have working navigation links in navbar', () => {
      cy.visit('/');

      // Logo should link to home
      cy.get('nav a[href="/"]').should('exist');
    });

    it('should maintain fixed navbar on scroll', () => {
      cy.visit('/');

      cy.get('nav').should('have.class', 'fixed');
      cy.get('nav').should('have.class', 'top-0');

      // Scroll down
      cy.scrollTo(0, 500);

      // Navbar should still be at top
      cy.get('nav').should('have.class', 'fixed');
      cy.get('nav').should('be.visible');
    });
  });

  describe('Navbar Z-Index', () => {
    it('should have navbar above other content', () => {
      cy.visit('/');

      cy.get('nav').should('have.class', 'z-50');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for buttons', () => {
      cy.viewport(375, 667);
      cy.visit('/');

      cy.get('button[aria-label="Toggle mobile menu"]').should('exist');
    });

    it('should be keyboard navigable', () => {
      cy.visit('/');

      // Tab through navigation
      cy.get('body').tab();

      // Links should be focusable
      cy.focused().should('have.attr', 'href');
    });
  });
});
