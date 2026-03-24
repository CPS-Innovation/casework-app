import { useRef } from 'react';

type Props = {
  isLoading: boolean;
  loadingMessage?: string;
  completeMessage?: string;
};

export const LoadingStatusAnnouncer = ({
  isLoading,
  loadingMessage = 'Loading, please wait.',
  completeMessage = 'Loading complete.'
}: Props) => {
  const wasLoading = useRef(false);

  if (isLoading) {
    wasLoading.current = true;
  }

  const announcement = isLoading ? loadingMessage : wasLoading.current ? completeMessage : '';

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="govuk-visually-hidden">
      {announcement}
    </div>
  );
};
