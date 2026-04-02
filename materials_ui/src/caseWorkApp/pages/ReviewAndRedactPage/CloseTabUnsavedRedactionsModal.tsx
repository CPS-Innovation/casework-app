import { Button } from '../../components/button';
import { Modal } from './Modal';

type Props = { onReturnClick: () => void; onIgnoreClick: () => void };

export const CloseTabUnsavedRedactionsModal = ({
  onReturnClick,
  onIgnoreClick
}: Props) => (
  <Modal onBackgroundClick={onIgnoreClick} onEscPress={onIgnoreClick}>
    <div
      style={{ padding: '50px 30px', background: 'white', maxWidth: '480px' }}
    >
      <h2 className="govuk-heading-l">You have unsaved redactions</h2>
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
    </div>
  </Modal>
);
