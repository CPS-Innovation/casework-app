import { AxiosError } from 'axios';
import { useState } from 'react';

import z from 'zod';
import { useAxiosInstance } from '../../../caseWorkApp/components/utils/getData';

type UseDocumentCheckoutOptions = { caseId?: number; urn?: string };

export const useDocumentCheckOutRequest = ({
  caseId,
  urn
}: UseDocumentCheckoutOptions) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const request = useAxiosInstance();

  const checkOut = async (fnProps: {
    documentId: string;
    versionId: number | string;
  }) => {
    setIsLoading(true);

    try {
      const response = await request.post(
        `/api/urns/${urn}/cases/${caseId}/documents/${fnProps.documentId}/versions/${fnProps.versionId}/checkout`
      );
      setIsLoading(false);

      return { success: true, data: { response } } as const;
    } catch (error: unknown) {
      setIsLoading(false);

      console.log('asd', error);

      const schema = z.object({
        response: z.object({ data: z.object({ detail: z.string() }) })
      });
      const parsedResp = schema.safeParse(error);
      const message = parsedResp.success
        ? parsedResp.data.response.data.detail
            .split('Exception Message: ')[1]
            ?.toLowerCase()
        : undefined;

      if (error instanceof AxiosError && error.status === 409)
        return { success: false, status: 'locked', message } as const;

      return { success: false, status: 'generic error', message } as const;
    }
  };

  const checkIn = async (fnProps: {
    documentId: string;
    versionId: number;
  }) => {
    setIsLoading(true);

    try {
      await request.delete(
        `/api/urns/${urn}/cases/${caseId}/documents/${fnProps.documentId}/versions/${fnProps.versionId}/checkout`
      );
      setIsLoading(false);

      return { success: true } as const;
    } catch (error: unknown) {
      setIsLoading(false);

      if (!!error && typeof error === 'object' && 'message' in error)
        console.error(error?.message);

      return { success: false } as const;
    }
  };

  return { checkIn, checkOut, isLoading };
};
