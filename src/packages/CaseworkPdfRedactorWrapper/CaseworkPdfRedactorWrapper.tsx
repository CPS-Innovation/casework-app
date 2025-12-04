import { ComponentProps, useEffect, useState } from 'react';
import { useAxiosInstance } from '../DocumentSelectAccordion/getters/getAxiosInstance';
import { PdfRedactorMiniModal } from '../PdfRedactor/modals/PdfRedactorMiniModal';
import { DeletionReasonForm } from '../PdfRedactor/PdfDeletionReasonForm';
import { RedactionDetailsForm } from '../PdfRedactor/PdfRedactionTypeForm';
import { PdfRedactor } from '../PdfRedactor/PdfRedactor';
import { TCoord, TRedaction } from '../PdfRedactor/utils/coordUtils';
import { TIndexedDeletion } from '../PdfRedactor/utils/deletionUtils';
import { TMode } from '../PdfRedactor/utils/modeUtils';
import { TIndexedRotation } from '../PdfRedactor/utils/rotationUtils';
import { useWindowMouseListener } from '../PdfRedactor/utils/useWindowMouseListener';
import { saveDeletions } from './utils/saveDeletionsUtils';
import { saveRedactions } from './utils/saveRedactionsUtils';
import { saveRotations } from './utils/saveRotationsUtils';

export const CaseworkPdfRedactorWrapper = (p: {
  fileUrl: string;
  mode: TMode;
  onModeChange: (x: TMode) => void;
}) => {
  const [redactions, setRedactions] = useState<TRedaction[]>([]);
  const [indexedRotation, setIndexedRotation] = useState<TIndexedRotation>({});
  const [indexedDeletion, setIndexedDeletion] = useState<TIndexedDeletion>({});

  const [redactionDetails, setRedactionDetails] = useState<
    { redactionId: string; randomId: string }[]
  >([]);
  const [deletionDetails, setDeletionDetails] = useState<
    { deletionId: string; randomId: string }[]
  >([]);

  useEffect(() => {
    const redactionIds = redactions.map((red) => red.id);
    setRedactionDetails((prev) =>
      prev.filter((redDetail) => redactionIds.includes(redDetail.redactionId))
    );
  }, [redactions]);
  useEffect(() => {
    const deletionIds = Object.values(indexedDeletion)
      .filter((del) => del.isDeleted)
      .map((del) => del.id);
    setDeletionDetails((prev) =>
      prev.filter((detail) => deletionIds.includes(detail.deletionId))
    );
  }, [indexedDeletion]);

  const [redactionPopupProps, setRedactionPopupProps] = useState<Omit<
    ComponentProps<typeof RedactionDetailsForm> & TCoord,
    'onSaveSuccess' | 'onCancelClick'
  > | null>(null);
  const [deleteReasonPopupProps, setDeleteReasonPopupProps] = useState<Omit<
    ComponentProps<typeof DeletionReasonForm> & TCoord,
    'onSaveSuccess' | 'onCancelClick'
  > | null>(null);

  const mousePos = useWindowMouseListener();
  const axiosInstance = useAxiosInstance();

  return (
    <div>
      {redactionPopupProps &&
        (() => {
          const handleCloseModal = () => {
            setRedactions((prev) =>
              prev.filter(
                (x) => !redactionPopupProps.redactionIds.includes(x.id)
              )
            );
            setRedactionPopupProps(null);
          };

          return (
            <PdfRedactorMiniModal
              coordX={redactionPopupProps.x}
              coordY={redactionPopupProps.y}
              onBackgroundClick={handleCloseModal}
              onEscPress={handleCloseModal}
            >
              <RedactionDetailsForm
                redactionIds={redactionPopupProps.redactionIds}
                documentId={redactionPopupProps.documentId}
                urn={redactionPopupProps.urn}
                caseId={redactionPopupProps.caseId}
                onCancelClick={() => {
                  setRedactions((prev) =>
                    prev.filter(
                      (x) => !redactionPopupProps.redactionIds.includes(x.id)
                    )
                  );
                  setRedactionPopupProps(null);
                }}
                onSaveSuccess={() => setRedactionPopupProps(null)}
              />
            </PdfRedactorMiniModal>
          );
        })()}
      {deleteReasonPopupProps &&
        (() => {
          const handleCloseModal = () => {
            setIndexedDeletion((prev) => {
              const { [deleteReasonPopupProps.pageNumber]: _, ...rest } = prev;
              return rest;
            });
            setDeleteReasonPopupProps(null);
          };

          return (
            <PdfRedactorMiniModal
              coordX={deleteReasonPopupProps.x}
              coordY={deleteReasonPopupProps.y}
              onBackgroundClick={handleCloseModal}
              onEscPress={handleCloseModal}
            >
              <DeletionReasonForm
                pageNumber={deleteReasonPopupProps.pageNumber}
                documentId={deleteReasonPopupProps.documentId}
                urn={deleteReasonPopupProps.urn}
                caseId={deleteReasonPopupProps.caseId}
                onCancelClick={() => {
                  setIndexedDeletion((prev) => {
                    const { [deleteReasonPopupProps.pageNumber]: _, ...rest } =
                      prev;
                    return rest;
                  });
                  setDeleteReasonPopupProps(null);
                }}
                onSaveSuccess={() => setDeleteReasonPopupProps(null)}
              />
            </PdfRedactorMiniModal>
          );
        })()}
      <PdfRedactor
        fileUrl={p.fileUrl}
        mode={p.mode}
        hideToolbar
        onModeChange={p.onModeChange}
        redactions={redactions}
        onRedactionsChange={(newRedactions) => setRedactions(newRedactions)}
        onAddRedactions={(add) => {
          const newRedactionDetails = add.map((x) => ({
            redactionId: x.id,
            randomId: `This redaction does ${crypto.randomUUID()}`
          }));
          setRedactionDetails((prev) => [...prev, ...newRedactionDetails]);
          setRedactionPopupProps(() => ({
            x: mousePos.current.x,
            y: mousePos.current.y,
            redactionIds: add.map((x) => x.id),
            documentId: 'This document does not exist',
            urn: 'This URN does not exist',
            caseId: 'This case does not exist'
          }));
        }}
        onRemoveRedactions={() => {}}
        onSaveRedactions={async () => {
          // const redactionsWithDetails = redactions
          //   .map((x) => {
          //     const thisDetails = redactionDetails.find(
          //       (y) => y.redactionId === x.id
          //     );
          //     if (!thisDetails) return undefined;
          //     return { ...x, ...thisDetails };
          //   })
          //   .filter((x) => !!x);

          // redactionsWithDetails;
          saveRedactions({
            axiosInstance,
            urn: '',
            caseId: 0,
            versionId: '',
            documentId: '',
            redactions
          });
        }}
        indexedRotation={indexedRotation}
        onRotationsChange={(newRotations) => setIndexedRotation(newRotations)}
        indexedDeletion={indexedDeletion}
        onDeletionsChange={(newDeletions) => setIndexedDeletion(newDeletions)}
        onDeletionAdd={(add) => {
          const newDeletionDetails = {
            deletionId: add.id,
            randomId: `This deletion does ${crypto.randomUUID()}`
          };
          setDeletionDetails((prev) => [...prev, newDeletionDetails]);
          setDeleteReasonPopupProps(() => ({
            x: mousePos.current.x,
            y: mousePos.current.y,
            pageNumber: add.pageNumber,
            documentId: 'This document does not exist',
            urn: 'This URN does not exist',
            caseId: 'This case does not exist'
          }));
        }}
        onDeletionRemove={() => {}}
        onSaveDeletions={async () => {
          saveDeletions({
            axiosInstance,
            urn: '',
            caseId: 0,
            versionId: '',
            documentId: '',
            deletions: Object.values(indexedDeletion)
          });
          // const deletionsWithDetails = Object.values(indexedDeletion)
          //   .map((x) => {
          //     const thisDetails = deletionDetails.find(
          //       (y) => y.deletionId === x.id
          //     );
          //     if (!thisDetails) return undefined;
          //     return { ...x, ...thisDetails };
          //   })
          //   .filter((x) => !!x);

          // deletionsWithDetails;
        }}
        onSaveRotations={async () => {
          // rotations don't require details
          saveRotations({
            axiosInstance,
            urn: '',
            caseId: 0,
            versionId: '',
            documentId: '',
            rotations: Object.values(indexedRotation)
          });
        }}
      />
    </div>
  );
};
