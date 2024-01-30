import NextLinkComposed from '@client/components/ui/next-link-composed';
import { HeaderSection as HeaderSectionModel } from '@client/models/common/header-section';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { TFunction, Trans } from 'next-i18next';
import { forwardRef, memo } from 'react';

export interface HeaderSectionProps {
  headerSection: HeaderSectionModel;
  t: TFunction;
}

const HeaderSection = forwardRef<HTMLAnchorElement, HeaderSectionProps>(function HeaderSection(
  { headerSection, t },
  ref
) {
  const headerSectionHierarchyLevel = headerSection.getHierarchyLevel();

  let typographyVariant: 'h4' | 'h5' | 'h6';
  switch (headerSectionHierarchyLevel) {
    case 0:
      typographyVariant = 'h4';
      break;
    case 1:
      typographyVariant = 'h5';
      break;
    default:
      typographyVariant = 'h6';
  }

  return (
    <Typography variant={typographyVariant} mb={2}>
      <MuiLink
        sx={(theme) => ({ fontWeight: theme.typography.fontWeightBold })}
        pt={2}
        color="inherit"
        underline="none"
        component={NextLinkComposed}
        to={`#${headerSection.id}`}
        id={headerSection.id}
        ref={ref}
      >
        <Trans t={t} i18nKey={headerSection.textContentTranslationKey}></Trans>
      </MuiLink>
    </Typography>
  );
});

export default memo(HeaderSection);
