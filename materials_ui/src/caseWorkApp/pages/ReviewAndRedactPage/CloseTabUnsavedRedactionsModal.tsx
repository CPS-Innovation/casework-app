import { GovUkBanner } from '../../../materials_components/DocumentSelectAccordion/templates/GovUkBanner';
import { Button } from '../../components/button';
import { Modal } from './Modal';

type Props = { onReturnClick: () => void; onIgnoreClick: () => void };

export const CloseTabUnsavedRedactionsModal = ({
  onReturnClick,
  onIgnoreClick
}: Props) => (
  <Modal onBackgroundClick={onIgnoreClick} onEscPress={onIgnoreClick}>
    <GovUkBanner
      variant="error"
      headerTitle="Error"
      contentHeading="You have unsaved redactions"
      contentBody={
        <>
          <p className="govuk-body">
            If you do not save the redactions the file will not be changed.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button variant="primary" onClick={onReturnClick}>
              Return to case file
            </Button>
            <Button variant="inverse" onClick={onIgnoreClick}>
              Ignore
            </Button>
          </div>
        </>
      }
    />
  </Modal>
);
