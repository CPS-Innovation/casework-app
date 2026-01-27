type CheckboxProps = { id: string; label: string; hint?: string };

export const Checkbox = ({ id, label, hint }: CheckboxProps) => {
  return (
    <div className="govuk-checkboxes" data-module="govuk-checkboxes">
      <div className="govuk-checkboxes__item">
        <input
          className="govuk-checkboxes__input"
          id={id}
          name={id}
          type="checkbox"
        />
        <label className="govuk-label govuk-checkboxes__label" htmlFor={id}>
          {label}
        </label>

        {hint && (
          <div
            id={`${id}-item-hint`}
            className="govuk-hint govuk-checkboxes__hint"
          >
            {hint}
          </div>
        )}
      </div>
    </div>
  );
};
