import { useEffect, useRef, useState } from 'react';
import { Page } from 'react-pdf';
import { DocumentIcon } from './icons/DocumentIcon';
import { RotateIcon } from './icons/RotateIcon';
import {
  PositionedRedactionBox,
  PositionPdfOverlayBox,
  RedactionBox
} from './PdfRedactorComponents';
import { GovUkButton } from './templates/GovUkButton';
import {
  convertCoordPairToXywh,
  getPdfCoords,
  type TCoord,
  type TRedaction
} from './utils/coordUtils';
import { createId } from './utils/generalUtils';
import { getPdfCoordPairsOfHighlightedText } from './utils/highlightedTextUtils';
import type { TMode } from './utils/modeUtils';
import { useTriggerListener, type TTriggerData } from './utils/useTriggger';

export const PdfRedactorRotationOverlay = (p: {
  pageRotation: number;
  onPageRotationChange: (x: number) => void;
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: '#00000055',
        zIndex: 500
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            color: '#ffffff',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <GovUkButton
              variant="inverse"
              onClick={() => {
                const newVal = p.pageRotation - 90;
                p.onPageRotationChange(newVal < 0 ? 360 + newVal : newVal);
              }}
              style={{
                display: 'flex',
                whiteSpace: 'nowrap',
                border: 0,
                padding: 0,
                paddingRight: '8px',
                gap: '8px',
                alignItems: 'center'
              }}
            >
              <span
                style={{
                  background: '#1d70b8',
                  height: '25px',
                  width: '25px',
                  padding: '5px'
                }}
              >
                <RotateIcon color="white" flip />
              </span>
              <div>rotate page left</div>
            </GovUkButton>
            <span style={{ height: '125px', width: '125px' }}>
              <DocumentIcon color="white" rotateDegrees={p.pageRotation} />
            </span>
            <GovUkButton
              variant="inverse"
              onClick={() => {
                const newVal = p.pageRotation + 90;
                p.onPageRotationChange(newVal >= 360 ? newVal - 360 : newVal);
              }}
              style={{
                display: 'flex',
                whiteSpace: 'nowrap',
                border: 0,
                padding: 0,
                paddingLeft: '8px',
                gap: '8px',
                alignItems: 'center'
              }}
            >
              <div>rotate page right</div>
              <span
                style={{
                  background: '#1d70b8',
                  height: '25px',
                  width: '25px',
                  padding: '5px'
                }}
              >
                <RotateIcon color="white" />
              </span>
            </GovUkButton>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.5rem' }}>
              Rotate page {p.pageRotation}&deg;
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span
              onClick={() => p.onPageRotationChange(0)}
              className="govuk-link"
              style={{
                color: '#ffffff',
                visibility: p.pageRotation === 0 ? 'hidden' : 'unset'
              }}
            >
              Cancel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export const PdfRedactorDeletionOverlay = (p: {
  pageIsDelete: boolean;
  onPageIsDeleteChange: (x: boolean) => void;
  pageNumber: number;
  pagesAmount?: number;
}) => {
  return (
    <>
      {!p.pageIsDelete && (
        <div style={{ position: 'absolute', top: 0, right: 0, zIndex: 500 }}>
          <GovUkButton
            variant="inverse"
            onClick={() => p.onPageIsDeleteChange(true)}
            style={{
              display: 'flex',
              whiteSpace: 'nowrap',
              border: 0,
              padding: 0,
              paddingRight: '8px',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <span
              style={{
                background: '#1d70b8',
                height: '25px',
                width: '25px',
                padding: '5px'
              }}
            >
              <RotateIcon color="white" />
            </span>
            <div>
              Delete page {p.pageNumber} / {p.pagesAmount}
            </div>
          </GovUkButton>
        </div>
      )}
      {p.pageIsDelete && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: '#00000055',
            zIndex: 500
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                color: '#ffffff',
                gap: '8px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px'
                }}
              >
                <span style={{ height: '125px', width: '125px' }}>
                  <DocumentIcon color="white" rotateDegrees={0} />
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontSize: '2.5rem', textAlign: 'center' }}>
                  Page selected for deletion
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ color: '#ffffff', textAlign: 'center' }}>
                  Click "save all deletions" to remove the page from the
                  document
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span
                  onClick={() => p.onPageIsDeleteChange(false)}
                  className="govuk-link"
                  style={{ color: '#ffffff' }}
                >
                  Cancel
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export const PdfRedactorPage = (p: {
  onMouseMove: (p: { x: number; y: number } | null) => void;
  pageNumber: number;
  pagesAmount?: number;
  isTruthyValue: boolean;
  scale: number;
  mode: TMode;
  redactHighlightedTextTriggerData: TTriggerData;
  onPageRedactionsChange: (p: TRedaction[]) => void;
  onAddRedactions: (p: TRedaction[]) => void;
  onRemoveRedactions: (p: TRedaction['id'][]) => void;
  redactions: TRedaction[];
  pageRotationDegrees: number;
  onPageRotationChange: (x: number) => void;
  pageIsDelete: boolean;
  onPageIsDeleteChange: (x: boolean) => void;
}) => {
  const { pageNumber, scale, redactions } = p;

  const [firstCorner, setFirstCorner] = useState<TCoord | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null
  );
  useEffect(() => setFirstCorner(null), [p.mode]);
  useEffect(() => p.onMouseMove(mousePos), [mousePos]);

  useTriggerListener({
    triggerData: p.redactHighlightedTextTriggerData,
    fn: () => {
      const pdfPageRect = pdfPageWrapperElmRef.current?.getBoundingClientRect();
      if (!pdfPageRect) return;

      const coordPairs = getPdfCoordPairsOfHighlightedText({
        pdfPageRect,
        scale
      });

      const newRedactions = coordPairs.map((coordPair) => {
        return {
          ...coordPair,
          id: createId(),
          pageNumber,
          pageHeight: pdfPageRect.height,
          pageWidth: pdfPageRect.width
        };
      });

      if (newRedactions.length === 0) return;

      p.onAddRedactions(newRedactions);
      p.onPageRedactionsChange([...redactions, ...newRedactions]);
    }
  });

  const pdfPageWrapperElmRef = useRef<HTMLDivElement | null>(null);
  const requestAnimationFrameRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (requestAnimationFrameRef.current)
        cancelAnimationFrame(requestAnimationFrameRef.current);
    };
  }, []);

  return (
    <div>
      <span
        style={{
          display: 'block',
          margin: 'auto',
          width: 'fit-content',
          padding: '10px 10px 0px 10px'
        }}
      >
        <span style={{ position: 'relative', display: 'inline-flex' }}>
          {p.mode === 'rotation' && (
            <PdfRedactorRotationOverlay
              pageRotation={p.pageRotationDegrees}
              onPageRotationChange={p.onPageRotationChange}
            />
          )}
          {p.mode === 'deletion' ||
            (p?.isTruthyValue && (
              <PdfRedactorDeletionOverlay
                pageIsDelete={p.pageIsDelete}
                onPageIsDeleteChange={p.onPageIsDeleteChange}
                pageNumber={pageNumber}
                pagesAmount={p.pagesAmount}
              />
            ))}
          <div
            ref={pdfPageWrapperElmRef}
            style={{ position: 'relative' }}
            tabIndex={0}
            className="react-pdf-page-wrapper"
          >
            <Page
              pageNumber={p.pageNumber}
              onClick={() => {
                if (p.mode !== 'areaRedact') return;
                const pdfPageWrapperElm = pdfPageWrapperElmRef.current;

                if (!pdfPageWrapperElm) return;
                const pdfPageRect = pdfPageWrapperElm.getBoundingClientRect();

                if (firstCorner && mousePos) {
                  const newRedaction: TRedaction = {
                    id: crypto.randomUUID(),
                    x1: firstCorner.x,
                    y1: firstCorner.y,
                    x2: mousePos.x,
                    y2: mousePos.y,
                    pageNumber: p.pageNumber,
                    pageHeight: pdfPageRect.height,
                    pageWidth: pdfPageRect.width
                  };
                  p.onAddRedactions([newRedaction]);
                  p.onPageRedactionsChange([
                    ...(redactions ? redactions : []),
                    newRedaction
                  ]);
                }
                setFirstCorner(firstCorner ? null : mousePos);
              }}
              scale={p.scale}
              onMouseMove={(e) => {
                if (requestAnimationFrameRef.current) return;

                const target = e.currentTarget as HTMLDivElement;

                requestAnimationFrameRef.current = requestAnimationFrame(() => {
                  const rect = target.getBoundingClientRect();

                  const coord = getPdfCoords({
                    screenX: e.clientX,
                    screenY: e.clientY,
                    scale: p.scale,
                    pdfPageRect: rect
                  });
                  setMousePos(coord);

                  requestAnimationFrameRef.current = null;
                });
              }}
              // onMouseLeave={() => setMousePos(null)}
            />
            {firstCorner &&
              mousePos &&
              (() => {
                const { xLeft, yBottom, width, height } =
                  convertCoordPairToXywh({
                    x1: firstCorner.x,
                    y1: firstCorner.y,
                    x2: mousePos.x,
                    y2: mousePos.y
                  });

                return (
                  <PositionPdfOverlayBox
                    xLeft={xLeft}
                    yBottom={yBottom}
                    width={width}
                    height={height}
                    scale={p.scale}
                  >
                    <RedactionBox
                      background="#fce8974d"
                      border="1px dashed #333"
                    />
                  </PositionPdfOverlayBox>
                );
              })()}

            {redactions?.map((box, i) => {
              const { xLeft, yBottom, width, height } =
                convertCoordPairToXywh(box);

              return (
                <PositionedRedactionBox
                  key={i}
                  xLeft={xLeft}
                  yBottom={yBottom}
                  width={width}
                  height={height}
                  scale={p.scale}
                  onCloseButtonClick={() => {
                    p.onRemoveRedactions([box.id]);
                    p.onPageRedactionsChange(
                      redactions?.filter((x) => x.id !== box.id)
                    );
                  }}
                />
              );
            })}
          </div>
        </span>
      </span>
    </div>
  );
};

