import { useEffect, useMemo, useRef, useState } from 'react';
import { Document, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { AreaIcon } from './icons/AreaIcon';
import { EditIcon } from './icons/EditIcon';
import { TickCircleIcon } from './icons/TickCircleIcon';
import { PdfRedactorPage } from './PdfRedactorPage';
import type { TRedaction } from './utils/coordUtils';
import { ModeStyleTag, type TMode } from './utils/modeUtils';
import { useTrigger } from './utils/useTriggger';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const useScaleHelper = (p?: { initScale?: number }) => {
  const [scale, setScale] = useState(p?.initScale ?? 1);

  const increaseScale = () => setScale((prev) => (prev += 0.25));
  const decreaseScale = () =>
    setScale((prev) => {
      const newScale = prev - 0.25;
      return newScale <= 0 ? prev : newScale;
    });
  const resetScale = () => setScale(1);

  return { scale, increaseScale, decreaseScale, resetScale };
};

const indexRedactionsOnPageNumber = (redactions: TRedaction[]) => {
  const temp: { [k: number]: TRedaction[] } = {};
  redactions.forEach((redaction) => (temp[redaction.pageNumber] = []));
  redactions.forEach((redaction) => temp[redaction.pageNumber].push(redaction));
  return temp;
};

export const PdfRedactor = (p: {
  fileUrl: string;
  redactions: TRedaction[];
  hideToolbar: boolean;
  mode: TMode;
  onModeChange: (x: TMode) => void;
  onRedactionsChange: (redactions: TRedaction[]) => void;
  onAddRedactions: (redactions: TRedaction[]) => void;
  onRemoveRedactions: (redactionIds: string[]) => void;
  onSaveRedactions: (redactions: TRedaction[]) => Promise<void>;
}) => {
  // ref required for eventlistener
  const modeRef = useRef(p.mode);

  // Keep ref in sync with p.mode
  // - lift state up, but worsen developer experience???
  useEffect(() => {
    modeRef.current = p.mode;
  }, [p.mode]);
  const [numPages, setNumPages] = useState<number>();
  const scaleHelper = useScaleHelper();
  const pdfRedactorWrapperElmRef = useRef<HTMLDivElement>(null);

  const indexedRedactions = useMemo(() => {
    return indexRedactionsOnPageNumber(p.redactions);
  }, [p.redactions]);

  const redactHighlightedTextTrigger = useTrigger();
  const redactHighlightedIfTextRedactionMode = () => {
    if (modeRef.current !== 'textRedact') return;
    redactHighlightedTextTrigger.fire();
  };

  useEffect(() => {
    const elm = pdfRedactorWrapperElmRef.current;
    if (!elm) return;

    elm.addEventListener('mouseup', redactHighlightedIfTextRedactionMode);
    return () =>
      elm.removeEventListener('mouseup', redactHighlightedIfTextRedactionMode);
  }, []);

  return (
    <div ref={pdfRedactorWrapperElmRef}>
      <ModeStyleTag mode={p.mode} />
      {!p.hideToolbar && (
        <div
          style={{
            border: '1px solid black',
            background: 'white',
            color: 'black',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px'
          }}
        >
          <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span>
              <button
                className={`govuk-button ${
                  p.mode === 'areaRedact' ? '' : 'govuk-button--secondary'
                }`}
                onClick={() => p.onModeChange('areaRedact')}
              >
                <AreaIcon width={20} height={20} />
              </button>
              <button
                className={`govuk-button ${
                  p.mode === 'textRedact' ? '' : 'govuk-button--secondary'
                }`}
                onClick={() => p.onModeChange('textRedact')}
              >
                <EditIcon width={20} height={20} />
              </button>
            </span>
            {p.mode === 'textRedact' && (
              <button
                className="govuk-button govuk-button--secondary"
                onClick={() => redactHighlightedTextTrigger.fire()}
              >
                <TickCircleIcon width={20} height={20} />
              </button>
            )}
          </span>

          <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span>x{scaleHelper.scale.toFixed(2)}</span>
            <button
              className="govuk-button govuk-button--secondary"
              onClick={() => scaleHelper.decreaseScale()}
            >
              -
            </button>
            <button
              className="govuk-button govuk-button--secondary"
              onClick={() => scaleHelper.increaseScale()}
            >
              +
            </button>
            <button
              className="govuk-button govuk-button--secondary"
              onClick={() => scaleHelper.resetScale()}
            >
              x 1.00
            </button>
          </span>
        </div>
      )}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'relative',
            height: '500px',
            width: '100%',
            overflowX: 'scroll',
            overflowY: 'scroll',
            backgroundColor: 'gray'
          }}
        >
          <Document
            file={p.fileUrl}
            onLoadSuccess={(x) => {
              p.onRedactionsChange([]);
              setNumPages(x.numPages);
            }}
          >
            {[...Array(numPages)].map((_, j) => (
              <PdfRedactorPage
                key={j}
                pageNumber={j + 1}
                scale={scaleHelper.scale}
                onMouseMove={() => {}}
                redactHighlightedTextTriggerData={
                  redactHighlightedTextTrigger.data
                }
                mode={p.mode}
                onPageRedactionsChange={() => {
                  // const newIndexed = { ...indexRedactionsOnPageNumber, [j]: x };
                  // p.onRedactionsChange(
                  //   flattenRedactionsOnPageNumber(newIndexed)
                  // );
                }}
                onAddRedactions={(x) => {
                  p.onRedactionsChange([...p.redactions, ...x]);
                  p.onAddRedactions(x);
                }}
                onRemoveRedactions={(ids) => {
                  p.onRedactionsChange(
                    p.redactions.filter((red) => !ids.includes(red.id))
                  );
                  p.onRemoveRedactions(ids);
                }}
                redactions={(() => {
                  const y = indexedRedactions[j + 1] ?? [];
                  return y;
                })()}
              />
            ))}
            <br />
            <br />
            <br />
          </Document>
        </div>
        {p.redactions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: '25px',
              left: 0,
              right: 0,
              zIndex: 10
            }}
          >
            <div
              style={{
                border: '1px solid black',
                background: 'white',
                color: 'black',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px'
              }}
            >
              <button
                className="govuk-button govuk-button--inverse"
                onClick={() => {
                  p.onRedactionsChange([]);
                  // p.onRemoveRedactions(p.redactions.map((x) => x.id));
                  // setRedactionsOnPageNumber({});
                }}
              >
                Remove all redactions
              </button>
              <span
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <span>
                  {p.redactions.length === 1 && <>There is 1 redaction</>}
                  {p.redactions.length > 1 && (
                    <>There are {p.redactions.length} redactions</>
                  )}
                </span>
                <button
                  className="govuk-button"
                  onClick={async () => {
                    await p.onSaveRedactions(p.redactions);
                    p.onRedactionsChange([]);
                    p.onRedactionsChange([]);
                  }}
                >
                  Save all redactions
                </button>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
