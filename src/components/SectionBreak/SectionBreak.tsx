import './SectionBreak.scss';

type Size = 'm' | 'l' | 'xl';

type Props = { size?: Size; visible?: boolean };

export const SectionBreak = ({ size = 'l', visible = true }: Props) => {
  return (
    <hr
      className={`govuk-section-break govuk-section-break--${size}${visible ? ' govuk-section-break--visible' : ''}`}
    />
  );
};
