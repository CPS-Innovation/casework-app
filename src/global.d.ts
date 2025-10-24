declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'case-info-summary': React.DetailedHTMLProps<
          React.HTMLAttributes<HTMLElement> & { caseId: string; urn: string },
          HTMLElement
        >;
      }
    }
  }
}
export {};
