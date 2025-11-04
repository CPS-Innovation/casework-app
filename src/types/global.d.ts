declare module '*.scss';
declare module '@ministryofjustice/frontend/moj/components/button-menu/button-menu.mjs';

declare global {
  interface Window {
    cpsContext?: {
      acquireAccessToken: () => Promise<string | null | undefined>;
      init: () => void;
    };
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'cps-materials-table': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & { caseid: number; urn: string },
          HTMLElement
        >;
      }
    }
  }
}

export {};
