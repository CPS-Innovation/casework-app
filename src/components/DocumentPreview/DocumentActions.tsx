import PreviewIcon from '../../assets/images/preview-hide-arrow.svg';

type Props = { label: string; isOpen: boolean; onDocumentOpen: () => void };

export default function DocumentActions({
  label,
  isOpen = false,
  onDocumentOpen
}: Props) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onDocumentOpen();
      }}
      className="govuk-body govuk-link"
      aria-label={`Actions for ${label}`}
      style={{
        marginBottom: '0px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
      data-testid="buttonActions"
    >
      <span style={{ marginRight: '2px' }}>{isOpen ? 'Hide' : 'Preview'}</span>
      <img
        src={PreviewIcon}
        alt="Actions Icon"
        className={isOpen ? 'preview-icon-flipped govuk-link' : 'govuk-link'}
        style={{ width: '12px', height: '12px', marginLeft: '4px' }}
      />
    </a>
  );
}
