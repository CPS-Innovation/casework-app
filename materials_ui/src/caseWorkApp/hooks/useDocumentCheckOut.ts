import { AxiosError } from 'axios';
import { useState } from 'react';

import { useAxiosInstance } from '../components/utils.ts/getData';

type UseDocumentCheckoutOptions = { caseId?: number; urn?: string };

type CheckoutResponse = 'success' | 'locked' | 'error';

export const useDocumentCheckOut = ({
  caseId,
  urn
}: UseDocumentCheckoutOptions) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const request = useAxiosInstance();

  const checkOut = async (
    documentId: string,
    version: number | string
  ): Promise<CheckoutResponse> => {
    setIsLoading(true);

    try {
      await request.post(
        `/api/urns/${urn}/cases/${caseId}/documents/${documentId}/versions/${version}/checkout`
      );
      setIsLoading(false);

      return 'success';
    } catch (error: unknown) {
      setIsLoading(false);

      if (error instanceof AxiosError) {
        if (error.status === 409) {
          return 'locked';
        }
      }

      return 'error';
    }
  };

  const checkIn = async (
    documentId: string,
    version: number | string
  ): Promise<CheckoutResponse> => {
    setIsLoading(true);

    try {
      await request.delete(
        `/api/urns/${urn}/cases/${caseId}/documents/${documentId}/versions/${version}/checkout`
      );
      setIsLoading(false);

      return 'success';
    } catch (error: unknown) {
      setIsLoading(false);

      if (error instanceof AxiosError) {
        console.error(error?.message);
      }

      return 'error';
    }
  };

  return { checkIn, checkOut, isLoading };
};
