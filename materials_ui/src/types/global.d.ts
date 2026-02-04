declare module '*.scss';
declare module '@ministryofjustice/frontend/moj/components/button-menu/button-menu.mjs';

export {};

declare global {
  interface Window {
    acquireAccessToken: () => Promise<string | null>;
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'case-info-summary': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & { caseid: string; urn: string },
          HTMLElement
        >;
      }
    }
  }
}
