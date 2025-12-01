export type TMode = 'textRedact' | 'areaRedact' | 'rotation';

const modeStyleMap: { [k in TMode]: string } = {
  areaRedact: `
    .react-pdf__Page__annotations a, 
    .react-pdf__Page__textContent span {
      pointer-events: none !important;
    }
    .react-pdf__Page__annotations, 
    .react-pdf__Page__textContent {
      cursor: crosshair;
    }
    `,
  textRedact: ``,
  rotation: ``
};

const allStyles = `
    .react-pdf-page-wrapper:focus {
      box-shadow: inset 0 0 0 .0625rem #0b0c0c;
      outline: .125rem solid #fd0;
      outline-offset: 0;
    }
    `;

export const ModeStyleTag = (p: { mode: TMode }) => (
  <style>
    {modeStyleMap[p.mode]}
    {allStyles}
  </style>
);
