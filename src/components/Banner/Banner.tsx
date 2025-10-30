import { PropsWithChildren } from 'react';
import { BannerType } from '../../schemas/banner';
import './Banner.scss';

type Props = BannerType;

export const Banner = ({
  type = 'success',
  header,
  content
}: PropsWithChildren<Props>) => {
  const getBannerClass = () => {
    switch (type) {
      case 'success':
        return 'govuk-notification-banner--success';
      case 'important':
        return 'govuk-notification-banner--important';
      case 'error':
        return 'govuk-notification-banner banner-error';
    }
  };

  const getBannerTitle = () => {
    switch (type) {
      case 'success':
        return 'Success';
      case 'important':
        return 'Important';
      case 'error':
        return 'There is a problem';
      default:
        return '';
    }
  };

  return (
    <div
      className={`govuk-notification-banner ${getBannerClass()} success-banner-custom-width`}
      role="region"
      aria-labelledby="govuk-notification-banner-title"
      data-module="govuk-notification-banner"
    >
      <div className="govuk-notification-banner__header">
        <h2
          className="govuk-notification-banner__title"
          id="govuk-notification-banner-title"
        >
          {getBannerTitle()}
        </h2>
      </div>

      <div className="govuk-notification-banner__content">
        <h3 className="govuk-notification-banner__heading">{header}</h3>
        {content && <p className="govuk-body">{content}</p>}
      </div>
    </div>
  );
};
