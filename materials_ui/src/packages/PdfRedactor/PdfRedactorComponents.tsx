import { GovUkButton } from './templates/GovUkButton';
import type { TXywhPair } from './utils/coordUtils';

export const PositionPdfOverlayBox = (
  p: TXywhPair & { scale: number; children: React.ReactNode }
) => (
  <div
    style={{
      position: 'absolute',
      left: `${p.xLeft * p.scale}px`,
      bottom: `${p.yBottom * p.scale}px`,
      width: `${p.width * p.scale}px`,
      height: `${p.height * p.scale}px`
    }}
  >
    {p.children}
  </div>
);

export const CloseIcon = () => (
  <div
    style={{
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      color: 'black'
    }}
  >
    ×
  </div>
);

export const RedactionBox = (p: { background: string; border: string }) => (
  <div
    style={{
      background: p.background,
      border: p.border,
      height: '100%',
      width: '100%'
    }}
  ></div>
);

export const PositionedRedactionBox = (
  p: TXywhPair & { scale: number; onCloseButtonClick: () => void }
) => {
  return (
    <PositionPdfOverlayBox
      xLeft={p.xLeft}
      yBottom={p.yBottom}
      width={p.width}
      height={p.height}
      scale={p.scale}
    >
      <RedactionBox background="#0000004d" border="2px solid black" />

      <GovUkButton
        variant="inverse"
        style={{
          padding: 0,
          borderRadius: '50%',
          border: 'solid 1px black',
          overflow: 'hidden',
          boxShadow: 'none',
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          zIndex: 10
        }}
        onClick={() => p.onCloseButtonClick()}
      >
        <CloseIcon />
      </GovUkButton>
    </PositionPdfOverlayBox>
  );
};
