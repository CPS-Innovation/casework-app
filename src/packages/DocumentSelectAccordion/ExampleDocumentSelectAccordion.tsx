import { useEffect, useState } from 'react';
import z from 'zod';
import {
  DocumentSelectAccordion,
  DocumentSelectAccordionSection
} from './DocumentSelectAccordion';
import { DocumentSelectAccordionDocument } from './DocumentSelectAccordionDocument';
import {
  categoryDetails,
  initDocsOnDocCategoryNamesMap
} from './getters/categoriseDocument';
import {
  documentListSchema,
  documentSchema,
  useGetCaseDocumentList
} from './getters/useGetCaseDocumentList';

const unusedCommRegexes = [
  //UM, must be standalone word
  /(?<=^|\s)UM(?=\s|$)/gi,
  //UM+digit, must be standalone word,
  /(?<=^|\s)UM\d+(?=\s|$)/gi,
  //UNUSED, standalone word,
  /(?<=^|\s)UNUSED(?=\s|$)/gi,
  //UNUSED+digit, standalone word,
  /(?<=^|\s)UNUSED\d+(?=\s|$)/gi,
  //-UM, as an ending/suffix to a word
  /(?<=^|\s)\S+-UM(?=\s|$)/gi,
  //-UM+digits, as an ending/suffix to a word
  /(?<=^|\s)\S+-UM\d+(?=\s|$)/gi,
  //MG6C, standalone word
  /(?<=^|\s)MG6C(?=\s|$)/gi,
  //MG6D, standalone word
  /(?<=^|\s)MG6D(?=\s|$)/gi,
  //MG6E, standalone word
  /(?<=^|\s)MG6E(?=\s|$)/gi,
  //MG06C, standalone word
  /(?<=^|\s)MG06C(?=\s|$)/gi,
  //MG06D, standalone word
  /(?<=^|\s)MG06D(?=\s|$)/gi,
  //MG06E, standalone word
  /(?<=^|\s)MG06E(?=\s|$)/gi,
  //SDC, standalone word
  /(?<=^|\s)SDC(?=\s|$)/gi
];

const documentTypeIdsMap = {
  review: [101, 102, 103, 104, 189, 212, 227, 1034, 1035, 1064],
  caseOverview: [
    1002, 1003, 1004, 1005, 1006, 1036, 1037, 1038, 1060, 1061, 219736, 225887
  ],
  statement: [1016, 1017, 1018, 1031],
  exhibit: [
    1019, 1020, 1021, 1022, 1023, 1028, 1030, 1042, 1044, 1050, 1062, 1066,
    1201, 100239, 225569, 226148
  ],
  forensic: [1027, 1048, 1049, 1203],
  unusedMaterial: [1001, 1008, 1009, 1010, 1011, 1039, 1202],
  defendant: [1056, 1057, 1058, 225654],
  courtPreparation: [
    82, 86, 87, 106, 107, 135, 187, 516, 1012, 1013, 1014, 1015, 1024, 1025,
    1033, 1040, 1041, 1045, 1046, 1047, 1063, 1500, 1503, 214480, 216223,
    223239, 223240, 225254, 225545, 225546, 225590, 225627, 225644, 225902,
    225925, 225936, 225944, 225950, 225951, 226379, 226497, 226558, 227279,
    227465
  ],
  communication: [
    1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
    23, 24, 25, 26, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
    47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65,
    66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 83, 84, 85,
    88, 89, 91, 97, 98, 99, 100, 105, 108, 109, 110, 111, 112, 113, 114, 115,
    116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130,
    131, 132, 133, 134, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146,
    147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161,
    162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176,
    177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 188, 190, 191, 192, 193,
    194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208,
    209, 210, 211, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224,
    225, 226, 228, 229, 230, 231, 232, 511, 512, 513, 514, 515, 517, 1007, 1026,
    1029, 1032, 1055, 1065, 1200, 100230, 100231, 100232, 100233, 100234,
    100235, 100236, 100237, 100238, 100240, 100241, 100242, 100243, 100244,
    100245, 100246, 100247, 100248, 100249, 100250, 100251, 100252, 100253,
    102601, 102602, 102636, 103476, 103477, 103478, 104138, 104139, 104140,
    112072, 112191, 112223, 112225, 215766, 215768, 216533, 216536, 220064,
    220454, 220546, 222392, 224298, 224462, 225043, 225357, 225525, 225526,
    225552, 225553, 225564, 225581, 225582, 225583, 225584, 225595, 225596,
    225638, 225798, 225804, 225808, 225812, 225886, 225888, 225898, 225904,
    225906, 225908, 225909, 225911, 225914, 225916, 225917, 225929, 225933,
    225956, 225972, 226015, 226046, 226047, 226136, 226570, 226594, 226598,
    226650, 227251
  ],
  uncategorised: [1051, 1052, 1053, 1054, 1059]
};

type TDocumentCategoryName =
  | 'review'
  | 'caseOverview'
  | 'statement'
  | 'exhibit'
  | 'forensic'
  | 'unusedMaterial'
  | 'defendant'
  | 'courtPreparation'
  | 'communication'
  | 'uncategorised';

const getDocumentCategory = (
  doc: z.infer<typeof documentSchema>
): TDocumentCategoryName => {
  if (
    doc.cmsDocType.documentType === 'PCD' ||
    documentTypeIdsMap.review.includes(doc.cmsDocType.documentTypeId)
  )
    return 'review' as const;

  if (documentTypeIdsMap.caseOverview.includes(doc.cmsDocType.documentTypeId))
    return 'caseOverview' as const;

  if (
    !doc.isUnused &&
    documentTypeIdsMap.statement.includes(doc.cmsDocType.documentTypeId)
  )
    return 'statement' as const;

  if (
    doc.cmsDocType.documentCategory === 'Exhibit' &&
    documentTypeIdsMap.exhibit.includes(doc.cmsDocType.documentTypeId)
  )
    return 'exhibit' as const;

  if (documentTypeIdsMap.forensic.includes(doc.cmsDocType.documentTypeId))
    return 'forensic' as const;

  if (
    (!!doc.presentationTitle &&
      doc.cmsDocType.documentTypeId === 1029 &&
      !doc.presentationTitle.includes('UM/') &&
      unusedCommRegexes.some((regex) => doc.presentationTitle.match(regex))) ||
    doc.isUnused ||
    documentTypeIdsMap.unusedMaterial.includes(doc.cmsDocType.documentTypeId)
  )
    return 'unusedMaterial' as const;

  if (documentTypeIdsMap.defendant.includes(doc.cmsDocType.documentTypeId))
    return 'defendant' as const;

  if (
    documentTypeIdsMap.courtPreparation.includes(doc.cmsDocType.documentTypeId)
  )
    return 'courtPreparation' as const;

  if (
    doc.cmsOriginalFileName?.endsWith('.hte') ||
    documentTypeIdsMap.communication.includes(doc.cmsDocType.documentTypeId)
  )
    return 'communication' as const;

  if (documentTypeIdsMap.uncategorised.includes(doc.cmsDocType.documentTypeId))
    return 'uncategorised' as const;

  return 'uncategorised' as const;
};

const safeJsonParse = (x: unknown) => {
  try {
    return { success: true, data: JSON.parse(x as string) } as const;
  } catch (error) {
    return { success: false, error: {} } as const;
  }
};

const safeGetReadCaseDocumentIdsFromLocalStorage = (caseId: number) => {
  const localStorageKey = `caseDocumentAccordionReadDocIds-${caseId}`;
  const schema = z.array(z.string());
  const readDocsJson = window.localStorage.getItem(localStorageKey) ?? '[]';
  const readDocsJsonParsed = safeJsonParse(readDocsJson);
  const readDocsSchemaParsed = schema.safeParse(readDocsJsonParsed.data);

  return readDocsSchemaParsed.success ? readDocsSchemaParsed.data : [];
};
const safeSetReadCaseDocumentsFromLocalStorage = (p: {
  caseId: number;
  newReadDocIds: string[];
}) => {
  const localStorageKey = `caseDocumentAccordionReadDocIds-${p.caseId}`;

  window.localStorage.setItem(localStorageKey, JSON.stringify(p.newReadDocIds));
};

export const CaseDocumentsSelectAccordion = (p: {
  urn: string;
  caseId: number;
  openDocumentIds: string[];
  onSetDocumentOpenIds: (docIds: string[]) => void;
}) => {
  const { caseId, urn } = p;
  const [isExpandedController, setIsExpandedController] = useState(false);
  const documentList = useGetCaseDocumentList({ urn, caseId });
  const [readDocumentIds, setReadDocumentIds] = useState<string[]>(
    safeGetReadCaseDocumentIdsFromLocalStorage(caseId)
  );
  const [mode, setMode] = useState<
    { mode: 'accordion' } | { mode: 'notes'; documentId: string }
  >({ mode: 'accordion' });

  useEffect(() => {
    const newReadDocIds = [
      ...new Set([...readDocumentIds, ...p.openDocumentIds])
    ];

    safeSetReadCaseDocumentsFromLocalStorage({ caseId, newReadDocIds });
  }, [readDocumentIds]);

  const parsed = documentListSchema.safeParse(documentList.data);

  if (!parsed.success) return <></>;

  const docsOnDocCategoryNames = initDocsOnDocCategoryNamesMap();
  parsed.data.forEach((doc) => {
    const categoryName = getDocumentCategory(doc);
    docsOnDocCategoryNames[categoryName].push(doc);
  });
  const newData = categoryDetails.map((x) => ({
    key: x.label,
    label: x.label,
    documents: docsOnDocCategoryNames[x.categoryName]
  }));

  if (mode.mode === 'accordion')
    return (
      <div>
        <a
          className="govuk-link"
          onClick={() => setIsExpandedController((x) => !x)}
          style={{ float: 'right', paddingBottom: '8px', cursor: 'pointer' }}
        >
          {isExpandedController ? 'Close' : 'Open'} all sections
        </a>
        <DocumentSelectAccordion>
          {newData.map((item) => (
            <DocumentSelectAccordionSection
              key={item.key}
              title={`${item.label} (${item.documents.length})`}
              isExpandedController={isExpandedController}
            >
              {item.documents.length === 0 ? (
                <div style={{ height: '60px', padding: '12px' }}>
                  There are no documents available.
                </div>
              ) : (
                item.documents.map((document) => (
                  <DocumentSelectAccordionDocument
                    key={`${item.key}-${document.documentId}`}
                    documentName={document.presentationTitle}
                    documentDate={document.documentId}
                    ActiveDocumentTag={p.openDocumentIds.includes(
                      document.documentId
                    )}
                    NewTag={!readDocumentIds.includes(document.documentId)}
                    showLeftBorder={p.openDocumentIds.includes(
                      document.documentId
                    )}
                    notesStatus={(() => {
                      if (
                        document.cmsDocType.documentType === 'PCD' ||
                        document.cmsDocType.documentCategory === 'Review'
                      )
                        return 'disabled';
                      return document.hasNotes ? 'newNotes' : 'none';
                    })()}
                    onDocumentClick={() => {
                      setReadDocumentIds((docIds) => [
                        ...new Set([...docIds, document.documentId])
                      ]);
                      const docSet = new Set([
                        ...p.openDocumentIds,
                        document.documentId
                      ]);
                      p.onSetDocumentOpenIds([...docSet]);
                    }}
                    onNotesClick={() => {
                      setMode({
                        mode: 'notes',
                        documentId: document.documentId
                      });
                    }}
                  />
                ))
              )}
            </DocumentSelectAccordionSection>
          ))}
        </DocumentSelectAccordion>

        <pre>{JSON.stringify(documentList.data, null, 2)}</pre>
      </div>
    );

  if (mode.mode === 'notes') {
    const documentId = mode.documentId;

    return (
      <>
        <button
          onClick={() => {
            setMode({ mode: 'accordion' });
          }}
        >
          go back
        </button>
        {documentId}
      </>
    );
  }
};
