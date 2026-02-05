import { WitnessListResponseType } from '../../src/schemas/witness';

const mockWitnesses: WitnessListResponseType = {
  witnesses: [
    {
      caseId: 2147043,
      witnessId: 2794967,
      firstName: 'Test',
      surname: 'Witness'
    }
  ]
};
export const mockWitness = (
  overwrite: Partial<WitnessListResponseType> = {}
) => ({ ...mockWitnesses, ...overwrite });
