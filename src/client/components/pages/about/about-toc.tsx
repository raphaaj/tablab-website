import AboutTOCItem from '@client/components/pages/about/about-toc-item';
import { HeaderSection } from '@client/models/common/header-section';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { TFunction } from 'next-i18next';
import { FC, memo } from 'react';

interface AboutTOCProps {
  currentHeaderSectionHtmlAnchorElement: HTMLAnchorElement | null;
  headerSections: HeaderSection[];
  t: TFunction;
}

const AboutTOC: FC<AboutTOCProps> = ({
  currentHeaderSectionHtmlAnchorElement,
  headerSections,
  t,
}) => {
  const aboutTOCItems: JSX.Element[] = [];

  for (const headerSection of headerSections) {
    if (headerSection.htmlAnchorElement) {
      const headerSectionHierarchyLevel = headerSection.getHierarchyLevel();

      aboutTOCItems.push(
        <ListItem
          key={headerSection.id}
          sx={(theme) => ({
            paddingLeft: theme.spacing(headerSectionHierarchyLevel * 3),
          })}
        >
          <AboutTOCItem
            t={t}
            headerSection={headerSection}
            isCurrentHeaderSection={
              headerSection.htmlAnchorElement === currentHeaderSectionHtmlAnchorElement
            }
          ></AboutTOCItem>
        </ListItem>
      );
    }
  }

  return (
    <List disablePadding sx={{ position: 'sticky', top: (theme) => theme.spacing(2) }}>
      {aboutTOCItems}
    </List>
  );
};

export default memo(AboutTOC);
