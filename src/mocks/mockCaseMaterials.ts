import { CaseMaterialsType } from '../../src/schemas/caseMaterials';

const material: CaseMaterialsType[] = [
  {
    id: 4242662,
    originalFileName: 'Case Action Plan 4 (test)',
    subject: 'James is a rather nice person',
    documentTypeId: 1200,
    materialId: 4242662,
    link: 'null',
    category: 'Other Material',
    type: 'Other Material',
    hasAttachments: false,
    status: 'Used',
    readStatus: 'Read',
    method: 'Item',
    direction: 'Outgoing',
    party: 'Police',
    date: new Date('2022-02-08T00:00:00Z'),
    title: '',
    recordedDate: null,
    witnessId: 2794967,
    producer: '',
    reference: '',
    item: '',
    existingproducerOrWitnessId: 0,
    isReclassifiable: true
  },
  {
    id: 4242661,
    originalFileName: 'Case Action Plan 3 (test)',
    subject: 'Test action plan',
    documentTypeId: 1200,
    materialId: 4242661,
    link: 'null',
    category: 'Other Material',
    type: 'Other Material',
    hasAttachments: false,
    status: 'None',
    readStatus: 'Read',
    method: 'Item',
    direction: 'Outgoing',
    party: 'Police',
    date: new Date('2022-02-08T00:00:00Z'),
    title: '',
    recordedDate: null,
    witnessId: 2794967,
    producer: '',
    reference: '',
    item: '',
    existingproducerOrWitnessId: 0,
    isReclassifiable: true
  }
];

export const mockCaseMaterials = (overwrite?: Partial<CaseMaterialsType>) => {
  return material.map((currentMaterial) => ({
    ...currentMaterial,
    ...overwrite
  }));
};
