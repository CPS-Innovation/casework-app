import {
  PCDDetailsResponseType,
  PCDListingResponseType,
  PCDListingType
} from '../../schemas/pcd';

export const mockPcdListItem = (
  override?: Partial<PCDListingType>
): PCDListingType => ({
  id: 1,
  decisionRequested: '01-01-2025',
  decisionRequiredBy: '10-01-2025',
  type: 'type',
  ...(override || {})
});

export const mockPcdListResponse: PCDListingResponseType = [
  mockPcdListItem(),
  mockPcdListItem({ id: 2, decisionRequested: '02-01-2025' }),
  mockPcdListItem({ id: 3, decisionRequested: '03-01-2025' }),
  mockPcdListItem({ id: 4, decisionRequested: '04-01-2025' })
];

const pcdRequestResponse: PCDDetailsResponseType = {
  caseOutline: [
    {
      heading: 'Summary of Key Evidence',
      text: 'test test',
      textWithCmsMarkup: 'test test'
    },
    {
      heading: 'Defendant Interview',
      text: 'test test more information',
      textWithCmsMarkup: 'test test more information'
    },
    {
      heading: 'Fingerprint/Forensic/Drugs Evidence',
      text: 'test',
      textWithCmsMarkup: 'test'
    },
    { heading: 'Outstanding Work', text: 'test', textWithCmsMarkup: 'test' }
  ],
  comments: { text: '.', textWithCmsMarkup: '.' },
  suspects: [
    {
      surname: 'WHITE',
      firstNames: 'Harry',
      dob: '2000-02-17',
      bailConditions: '',
      bailDate: '',
      remandStatus: '',
      proposedCharges: [
        {
          charge: 'FI68091\u00A0Trespass in a building with a firearm',
          earlyDate: '2020-02-28',
          lateDate: '',
          location:
            '13 High Street,\u00A0Birmingham,\u00A0West Midlands,\u00A0B23 6RG',
          category: 'EW'
        }
      ]
    }
  ],
  policeContactDetails: [
    { role: 'Supervising', rank: '', name: 'Tufan Butuner', number: '9770' },
    { role: 'Completing', rank: 'PS', name: 'James Chapman', number: '187' }
  ],
  materialProvided: [],
  id: 131721,
  type: 'Telephone',
  decisionRequiredBy: '2021-02-02',
  decisionRequested: '2022-02-09'
};

export const mockPcdRequestResponse = (
  overwrite?: Partial<PCDDetailsResponseType>
) => {
  return { ...pcdRequestResponse, ...overwrite };
};
