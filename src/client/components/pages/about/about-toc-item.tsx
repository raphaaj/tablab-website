import NextLinkComposed from '@client/components/ui/next-link-composed';
import { HeaderSection } from '@client/models/common/header-section';
import MuiLink from '@mui/material/Link';
import { TFunction, Trans } from 'next-i18next';
import { FC, memo } from 'react';

export interface AboutTOCItemProps {
  headerSection: HeaderSection;
  isCurrentHeaderSection: boolean;
  t: TFunction;
}

const AboutTOCItem: FC<AboutTOCItemProps> = ({ headerSection, isCurrentHeaderSection, t }) => {
  return (
    <MuiLink
      sx={(theme) => ({
        fontWeight: isCurrentHeaderSection
          ? theme.typography.fontWeightBold
          : theme.typography.fontWeightRegular,
        borderLeft: isCurrentHeaderSection ? 3 : 0,
        borderColor: 'primary',
      })}
      pl={2}
      color={isCurrentHeaderSection ? 'primary' : 'inherit'}
      underline="none"
      component={NextLinkComposed}
      to={`#${headerSection.id}`}
    >
      <Trans t={t} i18nKey={headerSection.textContentTranslationKey}></Trans>
    </MuiLink>
  );
};

export default memo(AboutTOCItem);
