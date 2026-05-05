'use client';

/**
 * Skip Navigation Component
 * 
 * Provides skip links for keyboard users to bypass repetitive navigation
 * and jump directly to main content.
 * 
 * **Validates: Requirement 21.7** - Provide skip navigation links for keyboard users
 * 
 * Features:
 * - Skip to main content
 * - Skip to navigation
 * - Only visible when focused (keyboard navigation)
 * - Meets WCAG 2.1 AA standards
 */
export function SkipNavigation() {
  return (
    <div className="skip-navigation">
      <a
        href="#main-content"
        className="skip-link"
      >
        Aller au contenu principal
      </a>
      <a
        href="#navigation"
        className="skip-link"
      >
        Aller à la navigation
      </a>
    </div>
  );
}

// Add these styles to globals.css or use inline styles
// .skip-navigation {
//   position: absolute;
//   top: 0;
//   left: 0;
//   z-index: 9999;
// }
// 
// .skip-link {
//   position: absolute;
//   top: -40px;
//   left: 0;
//   background: #C9A14A;
//   color: #000;
//   padding: 8px 16px;
//   text-decoration: none;
//   font-weight: 600;
//   border-radius: 0 0 4px 0;
//   transition: top 0.2s;
// }
// 
// .skip-link:focus {
//   top: 0;
// }
