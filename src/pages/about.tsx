import BaseLayout from '@client/components/layout/base-layout';
import AboutTOC from '@client/components/pages/about/about-toc';
import TablatureBlock from '@client/components/tablature/tablature-block';
import ChipCode from '@client/components/ui/chip-code';
import HeaderSection from '@client/components/ui/header-section';
import InstructionSyntaxPresentation from '@client/components/ui/instruction-syntax-presentation';
import NextLinkComposed from '@client/components/ui/next-link-composed';
import { useSnackbarReducerContext } from '@client/contexts/snackbar-reducer.context';
import { useScrollSpy } from '@client/hooks/use-scroll-spy';
import { HeaderSection as HeaderSectionModel } from '@client/models/common/header-section';
import { EnqueueSnackbarAction } from '@client/reducers/snackbar.reducer';
import { InstructionExample } from '@common/view-models/instruction-example/instruction-example';
import { InstructionExampleWithDescription } from '@common/view-models/instruction-example/instruction-example-with-description';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { InstructionExamplesSetupDTO } from '@server/services/instruction-examples-setup-provider-service/dtos/instruction-examples-setup-dto';
import { InstructionExamplesSetupProviderService } from '@server/services/instruction-examples-setup-provider-service/instruction-examples-setup-provider-service';
import { TablatureCreationDataDTO } from '@server/services/tablature/dtos/tablature-creation-data-dto';
import { TablatureService } from '@server/services/tablature/tablature-service';
import { GetStaticProps } from 'next';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FC, useCallback, useState } from 'react';

interface RenderedInstructionExample<TInstructionExample extends InstructionExample> {
  instructionExample: TInstructionExample;
  renderedTab: string[][];
}

const ChipCodeHoverButtonContentCopyIcon = <ContentCopyIcon fontSize="inherit" />;

const TablatureTechniqueName: FC<{
  children?: React.ReactNode;
  lang?: string;
}> = ({ children, lang }) => (
  <Box component="span" lang={lang} sx={{ fontStyle: 'italic' }}>
    {children}
  </Box>
);

export interface AboutProps {
  renderedInstructionExamplesForBasicInstruction: RenderedInstructionExample<InstructionExampleWithDescription>[];
  renderedInstructionExamplesForBasicInstructionWithTechnique: RenderedInstructionExample<InstructionExampleWithDescription>[];
  renderedInstructionExamplesForFooterInstruction: RenderedInstructionExample<InstructionExample>[];
  renderedInstructionExamplesForHeaderInstruction: RenderedInstructionExample<InstructionExample>[];
  renderedInstructionExamplesForMergeInstruction: RenderedInstructionExample<InstructionExample>[];
  renderedInstructionExamplesForRepeatInstruction: RenderedInstructionExample<InstructionExample>[];
  renderedInstructionExamplesForSpacingInstruction: RenderedInstructionExample<InstructionExample>[];
}

const About: FC<AboutProps> = ({
  renderedInstructionExamplesForBasicInstruction,
  renderedInstructionExamplesForBasicInstructionWithTechnique,
  renderedInstructionExamplesForFooterInstruction,
  renderedInstructionExamplesForHeaderInstruction,
  renderedInstructionExamplesForMergeInstruction,
  renderedInstructionExamplesForRepeatInstruction,
  renderedInstructionExamplesForSpacingInstruction,
}) => {
  const { t } = useTranslation('about');

  const [introductionHtmlAnchorElement, setIntroductionHtmlAnchorElement] =
    useState<HTMLAnchorElement | null>(null);

  const [basicInstructionHtmlAnchorElement, setBasicInstructionHtmlAnchorElement] =
    useState<HTMLAnchorElement | null>(null);
  const [
    basicInstructionWithTechniqueHtmlAnchorElement,
    setBasicInstructionWithTechniqueHtmlAnchorElement,
  ] = useState<HTMLAnchorElement | null>(null);

  const [advancedInstructionsHtmlAnchorElement, setAdvancedInstructionsHtmlAnchorElement] =
    useState<HTMLAnchorElement | null>(null);
  const [advancedInstructionMergeHtmlAnchorElement, setAdvancedInstructionMergeHtmlAnchorElement] =
    useState<HTMLAnchorElement | null>(null);
  const [
    advancedInstructionRepeatHtmlAnchorElement,
    setAdvancedInstructionRepeatHtmlAnchorElement,
  ] = useState<HTMLAnchorElement | null>(null);
  const [advancedInstructionBreakHtmlAnchorElement, setAdvancedInstructionBreakHtmlAnchorElement] =
    useState<HTMLAnchorElement | null>(null);
  const [
    advancedInstructionSpacingHtmlAnchorElement,
    setAdvancedInstructionSpacingHtmlAnchorElement,
  ] = useState<HTMLAnchorElement | null>(null);
  const [
    advancedInstructionHeaderHtmlAnchorElement,
    setAdvancedInstructionHeaderHtmlAnchorElement,
  ] = useState<HTMLAnchorElement | null>(null);
  const [
    advancedInstructionFooterHtmlAnchorElement,
    setAdvancedInstructionFooterHtmlAnchorElement,
  ] = useState<HTMLAnchorElement | null>(null);

  const [composingTheTablatureHtmlAnchorElement, setComposingTheTablatureHtmlAnchorElement] =
    useState<HTMLAnchorElement | null>(null);

  const introductionHeaderSection = new HeaderSectionModel({
    id: 'introduction',
    htmlAnchorElement: introductionHtmlAnchorElement,
    textContentTranslationKey: 'sections.introduction.name',
  });

  const basicInstructionHeaderSection = new HeaderSectionModel({
    id: 'basic-instruction',
    htmlAnchorElement: basicInstructionHtmlAnchorElement,
    textContentTranslationKey: 'sections.basicInstruction.name',
  });

  const basicInstructionWithTechniqueHeaderSection = new HeaderSectionModel({
    id: 'basic-instruction-with-technique',
    htmlAnchorElement: basicInstructionWithTechniqueHtmlAnchorElement,
    textContentTranslationKey: 'sections.basicInstruction.childSections.techniques.name',
    parent: basicInstructionHeaderSection,
  });

  const advancedInstructionsHeaderSection = new HeaderSectionModel({
    id: 'advanced-instructions',
    htmlAnchorElement: advancedInstructionsHtmlAnchorElement,
    textContentTranslationKey: 'sections.advancedInstructions.name',
  });

  const advancedInstructionMergeHeaderSection = new HeaderSectionModel({
    id: 'advanced-instruction-merge',
    htmlAnchorElement: advancedInstructionMergeHtmlAnchorElement,
    textContentTranslationKey: 'sections.advancedInstructions.childSections.merge.name',
    parent: advancedInstructionsHeaderSection,
  });

  const advancedInstructionRepeatHeaderSection = new HeaderSectionModel({
    id: 'advanced-instruction-repeat',
    htmlAnchorElement: advancedInstructionRepeatHtmlAnchorElement,
    textContentTranslationKey: 'sections.advancedInstructions.childSections.repeat.name',
    parent: advancedInstructionsHeaderSection,
  });

  const advancedInstructionBreakHeaderSection = new HeaderSectionModel({
    id: 'advanced-instruction-break',
    htmlAnchorElement: advancedInstructionBreakHtmlAnchorElement,
    textContentTranslationKey: 'sections.advancedInstructions.childSections.break.name',
    parent: advancedInstructionsHeaderSection,
  });

  const advancedInstructionSpacingHeaderSection = new HeaderSectionModel({
    id: 'advanced-instruction-spacing',
    htmlAnchorElement: advancedInstructionSpacingHtmlAnchorElement,
    textContentTranslationKey: 'sections.advancedInstructions.childSections.spacing.name',
    parent: advancedInstructionsHeaderSection,
  });

  const advancedInstructionHeaderHeaderSection = new HeaderSectionModel({
    id: 'advanced-instruction-header',
    htmlAnchorElement: advancedInstructionHeaderHtmlAnchorElement,
    textContentTranslationKey: 'sections.advancedInstructions.childSections.header.name',
    parent: advancedInstructionsHeaderSection,
  });

  const advancedInstructionFooterHeaderSection = new HeaderSectionModel({
    id: 'advanced-instruction-footer',
    htmlAnchorElement: advancedInstructionFooterHtmlAnchorElement,
    textContentTranslationKey: 'sections.advancedInstructions.childSections.footer.name',
    parent: advancedInstructionsHeaderSection,
  });

  const composingTheTablatureHeaderSection = new HeaderSectionModel({
    id: 'composing-the-tablature',
    htmlAnchorElement: composingTheTablatureHtmlAnchorElement,
    textContentTranslationKey: 'sections.tablatureComposition.name',
  });

  const headerSections = [
    introductionHeaderSection,
    basicInstructionHeaderSection,
    basicInstructionWithTechniqueHeaderSection,
    advancedInstructionsHeaderSection,
    advancedInstructionMergeHeaderSection,
    advancedInstructionRepeatHeaderSection,
    advancedInstructionBreakHeaderSection,
    advancedInstructionSpacingHeaderSection,
    advancedInstructionHeaderHeaderSection,
    advancedInstructionFooterHeaderSection,
    composingTheTablatureHeaderSection,
  ];

  const currentHeaderSectionHtmlAnchorElement = useScrollSpy(
    headerSections.map((x) => x.htmlAnchorElement)
  );

  const { dispatchSnackbarAction } = useSnackbarReducerContext();

  const copiedToClipboardSnackbarMessage = t('actions.copyToClipboard.snackbarMessage');
  const handleChipCodeClick = useCallback(
    async (code: string) => {
      await navigator.clipboard.writeText(code);

      dispatchSnackbarAction(
        new EnqueueSnackbarAction({
          message: copiedToClipboardSnackbarMessage,
        })
      );
    },
    [dispatchSnackbarAction, copiedToClipboardSnackbarMessage]
  );

  return (
    <BaseLayout>
      <Grid container spacing={3}>
        <Grid item xs={0} md={4} xl={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          <AboutTOC
            currentHeaderSectionHtmlAnchorElement={currentHeaderSectionHtmlAnchorElement}
            headerSections={headerSections}
            t={t}
          ></AboutTOC>
        </Grid>
        <Grid item xs={12} md={8} xl={9}>
          <section>
            <HeaderSection
              headerSection={introductionHeaderSection}
              ref={setIntroductionHtmlAnchorElement}
              t={t}
            ></HeaderSection>

            <Typography mb={2}>{t('sections.introduction.introduction')}</Typography>
          </section>

          <Divider sx={{ my: 3 }} />

          <section>
            <HeaderSection
              headerSection={basicInstructionHeaderSection}
              ref={setBasicInstructionHtmlAnchorElement}
              t={t}
            ></HeaderSection>

            <Typography mb={2}>{t('sections.basicInstruction.introduction')}</Typography>

            <InstructionSyntaxPresentation>
              {t('sections.basicInstruction.instructionSyntax')}
            </InstructionSyntaxPresentation>

            <Typography mb={2}>{t('sections.basicInstruction.examplesIntroduction')}</Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table aria-label={t('sections.basicInstruction.examplesTable.description')}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t('sections.basicInstruction.examplesTable.headers.instruction')}
                    </TableCell>
                    <TableCell>
                      {t('sections.basicInstruction.examplesTable.headers.description')}
                    </TableCell>
                    <TableCell>
                      {t('sections.basicInstruction.examplesTable.headers.result')}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {renderedInstructionExamplesForBasicInstruction.map(
                    (
                      renderedInstructionExampleForBasicInstruction,
                      renderedInstructionExampleForBasicInstructionIndex
                    ) => (
                      <TableRow
                        key={renderedInstructionExampleForBasicInstructionIndex}
                        sx={
                          renderedInstructionExampleForBasicInstructionIndex + 1 ===
                          renderedInstructionExamplesForBasicInstruction.length
                            ? { '& .MuiTableCell-root': { borderBottomWidth: 0 } }
                            : {}
                        }
                      >
                        <TableCell>
                          <ChipCode
                            code={
                              renderedInstructionExampleForBasicInstruction.instructionExample
                                .instruction
                            }
                            onClick={handleChipCodeClick}
                            hoverButtonIcon={ChipCodeHoverButtonContentCopyIcon}
                          />
                        </TableCell>
                        <TableCell>
                          {
                            renderedInstructionExampleForBasicInstruction.instructionExample
                              .description
                          }
                        </TableCell>
                        <TableCell>
                          <TablatureBlock
                            align="left"
                            borderless={true}
                            disableGutters={true}
                            discardHeader={true}
                            discardFooter={true}
                            fullWidth={false}
                            label=""
                            block={renderedInstructionExampleForBasicInstruction.renderedTab[0]}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </section>

          <Divider sx={{ my: 3 }} />

          <section>
            <HeaderSection
              headerSection={basicInstructionWithTechniqueHeaderSection}
              ref={setBasicInstructionWithTechniqueHtmlAnchorElement}
              t={t}
            ></HeaderSection>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.basicInstruction.childSections.techniques.introduction"
                components={{
                  tablatureTechniqueName: (
                    <TablatureTechniqueName
                      lang={t('instruction-examples:techniques.languageTagForTechniqueName')}
                    />
                  ),
                }}
              />
            </Typography>

            <InstructionSyntaxPresentation>
              {t('sections.basicInstruction.childSections.techniques.instructionSyntax')}
            </InstructionSyntaxPresentation>

            <Typography mb={2}>
              {t('sections.basicInstruction.childSections.techniques.examplesIntroduction')}
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table aria-label="Exemplos de instruções básicas com indicação de técnica e seus resultados na tablatura">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t(
                        'sections.basicInstruction.childSections.techniques.examplesTable.headers.technique'
                      )}
                    </TableCell>
                    <TableCell>
                      {t(
                        'sections.basicInstruction.childSections.techniques.examplesTable.headers.instruction'
                      )}
                    </TableCell>
                    <TableCell>
                      {t(
                        'sections.basicInstruction.childSections.techniques.examplesTable.headers.result'
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {renderedInstructionExamplesForBasicInstructionWithTechnique.map(
                    (
                      renderedInstructionExampleForBasicInstructionWithTechnique,
                      renderedInstructionExampleForBasicInstructionWithTechniqueIndex
                    ) => (
                      <TableRow
                        key={renderedInstructionExampleForBasicInstructionWithTechniqueIndex}
                        sx={
                          renderedInstructionExampleForBasicInstructionWithTechniqueIndex + 1 ===
                          renderedInstructionExamplesForBasicInstructionWithTechnique.length
                            ? { '& .MuiTableCell-root': { borderBottomWidth: 0 } }
                            : {}
                        }
                      >
                        <TableCell>
                          <TablatureTechniqueName
                            lang={t('instruction-examples:techniques.languageTagForTechniqueName')}
                          >
                            {
                              renderedInstructionExampleForBasicInstructionWithTechnique
                                .instructionExample.description
                            }
                          </TablatureTechniqueName>
                        </TableCell>
                        <TableCell>
                          <ChipCode
                            code={
                              renderedInstructionExampleForBasicInstructionWithTechnique
                                .instructionExample.instruction
                            }
                            onClick={handleChipCodeClick}
                            hoverButtonIcon={ChipCodeHoverButtonContentCopyIcon}
                          />
                        </TableCell>
                        <TableCell>
                          <TablatureBlock
                            align="left"
                            borderless={true}
                            disableGutters={true}
                            discardHeader={true}
                            discardFooter={true}
                            fullWidth={false}
                            label=""
                            block={
                              renderedInstructionExampleForBasicInstructionWithTechnique
                                .renderedTab[0]
                            }
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="warning">
              <Typography sx={{ mb: 1 }}>
                {t(
                  'sections.basicInstruction.childSections.techniques.relevantObservations.useOfOtherTechniques'
                )}
              </Typography>

              <Typography>
                {t(
                  'sections.basicInstruction.childSections.techniques.relevantObservations.motivationToUseOtherTechniques'
                )}
              </Typography>
            </Alert>
          </section>

          <Divider sx={{ my: 3 }} />

          <section>
            <HeaderSection
              headerSection={advancedInstructionsHeaderSection}
              ref={setAdvancedInstructionsHtmlAnchorElement}
              t={t}
            ></HeaderSection>

            <Typography>{t('sections.advancedInstructions.introduction')}</Typography>

            <Box component="ul" sx={{ '& li:not(:last-child)': { marginBottom: 0.5 } }}>
              <li>{t('sections.advancedInstructions.extendedCapabilities.newNotes')};</li>

              <li>{t('sections.advancedInstructions.extendedCapabilities.writingMadeEasy')};</li>

              <li>
                {t('sections.advancedInstructions.extendedCapabilities.formatAndCustomization')};
              </li>

              <li>{t('sections.advancedInstructions.extendedCapabilities.sections')}.</li>
            </Box>
          </section>

          <Divider sx={{ my: 3 }} />

          <section>
            <HeaderSection
              headerSection={advancedInstructionMergeHeaderSection}
              ref={setAdvancedInstructionMergeHtmlAnchorElement}
              t={t}
            ></HeaderSection>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.advancedInstructions.childSections.merge.introduction"
                components={{
                  mergeInstructionCode: <ChipCode code="merge" onClick={handleChipCodeClick} />,
                }}
              />
            </Typography>

            <Box component="ul">
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.extended')}
                <InstructionSyntaxPresentation>
                  {t('sections.advancedInstructions.childSections.merge.extendedInstructionSyntax')}
                </InstructionSyntaxPresentation>
              </li>
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.short')}
                <InstructionSyntaxPresentation>
                  {t('sections.advancedInstructions.childSections.merge.shortInstructionSyntax')}
                </InstructionSyntaxPresentation>
              </li>
            </Box>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.advancedInstructions.childSections.merge.examplesIntroduction"
                components={{
                  mergeInstructionCode: <ChipCode code="merge" onClick={handleChipCodeClick} />,
                }}
              />
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table
                aria-label={t(
                  'sections.advancedInstructions.childSections.merge.examplesTable.description'
                )}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t(
                        'sections.advancedInstructions.childSections.merge.examplesTable.headers.instruction'
                      )}
                    </TableCell>
                    <TableCell>
                      {t(
                        'sections.advancedInstructions.childSections.merge.examplesTable.headers.result'
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {renderedInstructionExamplesForMergeInstruction.map(
                    (
                      renderedInstructionExampleForMergeInstruction,
                      renderedInstructionExampleForMergeInstructionIndex
                    ) => (
                      <TableRow
                        key={renderedInstructionExampleForMergeInstructionIndex}
                        sx={
                          renderedInstructionExampleForMergeInstructionIndex + 1 ===
                          renderedInstructionExamplesForMergeInstruction.length
                            ? { '& .MuiTableCell-root': { borderBottomWidth: 0 } }
                            : {}
                        }
                      >
                        <TableCell>
                          <ChipCode
                            code={
                              renderedInstructionExampleForMergeInstruction.instructionExample
                                .instruction
                            }
                            onClick={handleChipCodeClick}
                            hoverButtonIcon={ChipCodeHoverButtonContentCopyIcon}
                          />
                        </TableCell>
                        <TableCell>
                          <TablatureBlock
                            align="left"
                            borderless={true}
                            disableGutters={true}
                            discardHeader={true}
                            discardFooter={true}
                            fullWidth={false}
                            label=""
                            block={renderedInstructionExampleForMergeInstruction.renderedTab[0]}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Alert severity="warning">
              <Typography>
                <Trans
                  t={t}
                  i18nKey="sections.advancedInstructions.childSections.merge.relevantObservations.orderOfInstructionsToMerge"
                  components={{
                    mergeInstructionCode: <ChipCode code="merge" onClick={handleChipCodeClick} />,
                  }}
                />
              </Typography>
            </Alert>
          </section>

          <Divider sx={{ my: 3 }} />

          <section>
            <HeaderSection
              headerSection={advancedInstructionRepeatHeaderSection}
              ref={setAdvancedInstructionRepeatHtmlAnchorElement}
              t={t}
            ></HeaderSection>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.advancedInstructions.childSections.repeat.introduction"
                components={{
                  repeatInstructionCode: <ChipCode code="repeat" onClick={handleChipCodeClick} />,
                }}
              />
            </Typography>

            <Box component="ul">
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.extended')}
                <InstructionSyntaxPresentation>
                  {t(
                    'sections.advancedInstructions.childSections.repeat.extendedInstructionSyntax'
                  )}
                </InstructionSyntaxPresentation>
              </li>
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.short')}
                <InstructionSyntaxPresentation>
                  {t('sections.advancedInstructions.childSections.repeat.shortInstructionSyntax')}
                </InstructionSyntaxPresentation>
              </li>
            </Box>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.advancedInstructions.childSections.repeat.examplesIntroduction"
                components={{
                  repeatInstructionCode: <ChipCode code="repeat" onClick={handleChipCodeClick} />,
                }}
              />
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table
                aria-label={t(
                  'sections.advancedInstructions.childSections.repeat.examplesTable.description'
                )}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t(
                        'sections.advancedInstructions.childSections.repeat.examplesTable.headers.instruction'
                      )}
                    </TableCell>
                    <TableCell>
                      {t(
                        'sections.advancedInstructions.childSections.repeat.examplesTable.headers.result'
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {renderedInstructionExamplesForRepeatInstruction.map(
                    (
                      renderedInstructionExampleForRepeatInstruction,
                      renderedInstructionExampleForRepeatInstructionIndex
                    ) => (
                      <TableRow
                        key={renderedInstructionExampleForRepeatInstructionIndex}
                        sx={
                          renderedInstructionExampleForRepeatInstructionIndex + 1 ===
                          renderedInstructionExamplesForRepeatInstruction.length
                            ? { '& .MuiTableCell-root': { borderBottomWidth: 0 } }
                            : {}
                        }
                      >
                        <TableCell>
                          <ChipCode
                            code={
                              renderedInstructionExampleForRepeatInstruction.instructionExample
                                .instruction
                            }
                            onClick={handleChipCodeClick}
                            hoverButtonIcon={ChipCodeHoverButtonContentCopyIcon}
                          />
                        </TableCell>
                        <TableCell>
                          <TablatureBlock
                            align="left"
                            borderless={true}
                            disableGutters={true}
                            discardHeader={true}
                            discardFooter={true}
                            fullWidth={false}
                            label=""
                            block={renderedInstructionExampleForRepeatInstruction.renderedTab[0]}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </section>

          <Divider sx={{ my: 3 }} />

          <section>
            <HeaderSection
              headerSection={advancedInstructionBreakHeaderSection}
              ref={setAdvancedInstructionBreakHtmlAnchorElement}
              t={t}
            ></HeaderSection>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.advancedInstructions.childSections.break.introduction"
                components={{
                  breakInstructionCode: <ChipCode code="break" onClick={handleChipCodeClick} />,
                }}
              />
            </Typography>

            <Box component="ul">
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.extended')}
                <InstructionSyntaxPresentation>
                  {t('sections.advancedInstructions.childSections.break.extendedInstructionSyntax')}
                </InstructionSyntaxPresentation>
              </li>
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.short')}
                <InstructionSyntaxPresentation>
                  {t('sections.advancedInstructions.childSections.break.shortInstructionSyntax')}
                </InstructionSyntaxPresentation>
              </li>
            </Box>
          </section>

          <Divider sx={{ my: 3 }} />

          <section>
            <HeaderSection
              headerSection={advancedInstructionSpacingHeaderSection}
              ref={setAdvancedInstructionSpacingHtmlAnchorElement}
              t={t}
            ></HeaderSection>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.advancedInstructions.childSections.spacing.introduction"
                components={{
                  spacingInstructionCode: <ChipCode code="spacing" onClick={handleChipCodeClick} />,
                  spacingCharacterCode: <ChipCode code="-" />,
                }}
              />
            </Typography>

            <Box component="ul">
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.extended')}
                <InstructionSyntaxPresentation>
                  {t(
                    'sections.advancedInstructions.childSections.spacing.extendedInstructionSyntax'
                  )}
                </InstructionSyntaxPresentation>
              </li>
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.short')}
                <InstructionSyntaxPresentation>
                  {t('sections.advancedInstructions.childSections.spacing.shortInstructionSyntax')}
                </InstructionSyntaxPresentation>
              </li>
            </Box>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.advancedInstructions.childSections.spacing.examplesIntroduction"
                components={{
                  spacingInstructionCode: <ChipCode code="spacing" onClick={handleChipCodeClick} />,
                }}
              />
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table
                aria-label={t(
                  'sections.advancedInstructions.childSections.spacing.examplesTable.description'
                )}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t(
                        'sections.advancedInstructions.childSections.spacing.examplesTable.headers.instruction'
                      )}
                    </TableCell>
                    <TableCell>
                      {t(
                        'sections.advancedInstructions.childSections.spacing.examplesTable.headers.result'
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {renderedInstructionExamplesForSpacingInstruction.map(
                    (
                      renderedInstructionExampleForSpacingInstruction,
                      renderedInstructionExampleForSpacingInstructionIndex
                    ) => (
                      <TableRow
                        key={renderedInstructionExampleForSpacingInstructionIndex}
                        sx={
                          renderedInstructionExampleForSpacingInstructionIndex + 1 ===
                          renderedInstructionExamplesForSpacingInstruction.length
                            ? { '& .MuiTableCell-root': { borderBottomWidth: 0 } }
                            : {}
                        }
                      >
                        <TableCell>
                          <ChipCode
                            code={
                              renderedInstructionExampleForSpacingInstruction.instructionExample
                                .instruction
                            }
                            onClick={handleChipCodeClick}
                            hoverButtonIcon={ChipCodeHoverButtonContentCopyIcon}
                          />
                        </TableCell>
                        <TableCell>
                          <TablatureBlock
                            align="left"
                            borderless={true}
                            disableGutters={true}
                            discardHeader={true}
                            discardFooter={true}
                            fullWidth={false}
                            label=""
                            block={renderedInstructionExampleForSpacingInstruction.renderedTab[0]}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </section>

          <Divider sx={{ my: 3 }} />

          <section>
            <HeaderSection
              headerSection={advancedInstructionHeaderHeaderSection}
              ref={setAdvancedInstructionHeaderHtmlAnchorElement}
              t={t}
            ></HeaderSection>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.advancedInstructions.childSections.header.introduction"
                components={{
                  headerInstructionCode: <ChipCode code="header" onClick={handleChipCodeClick} />,
                }}
              />
            </Typography>

            <Box component="ul">
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.extended')}
                <InstructionSyntaxPresentation>
                  {t(
                    'sections.advancedInstructions.childSections.header.extendedInstructionSyntax'
                  )}
                </InstructionSyntaxPresentation>
              </li>
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.short')}
                <InstructionSyntaxPresentation>
                  {t('sections.advancedInstructions.childSections.header.shortInstructionSyntax')}
                </InstructionSyntaxPresentation>
              </li>
            </Box>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.advancedInstructions.childSections.header.examplesIntroduction"
                components={{
                  headerInstructionCode: <ChipCode code="header" onClick={handleChipCodeClick} />,
                }}
              />
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table
                aria-label={t(
                  'sections.advancedInstructions.childSections.header.examplesTable.description'
                )}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t(
                        'sections.advancedInstructions.childSections.header.examplesTable.headers.instruction'
                      )}
                    </TableCell>
                    <TableCell>
                      {t(
                        'sections.advancedInstructions.childSections.header.examplesTable.headers.result'
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {renderedInstructionExamplesForHeaderInstruction.map(
                    (
                      renderedInstructionExampleForHeaderInstruction,
                      renderedInstructionExampleForHeaderInstructionIndex
                    ) => (
                      <TableRow
                        key={renderedInstructionExampleForHeaderInstructionIndex}
                        sx={
                          renderedInstructionExampleForHeaderInstructionIndex + 1 ===
                          renderedInstructionExamplesForHeaderInstruction.length
                            ? { '& .MuiTableCell-root': { borderBottomWidth: 0 } }
                            : {}
                        }
                      >
                        <TableCell>
                          <ChipCode
                            code={
                              renderedInstructionExampleForHeaderInstruction.instructionExample
                                .instruction
                            }
                            onClick={handleChipCodeClick}
                            hoverButtonIcon={ChipCodeHoverButtonContentCopyIcon}
                          />
                        </TableCell>
                        <TableCell>
                          <TablatureBlock
                            align="left"
                            borderless={true}
                            disableGutters={true}
                            discardHeader={false}
                            discardFooter={true}
                            fullWidth={false}
                            label=""
                            block={renderedInstructionExampleForHeaderInstruction.renderedTab[0]}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </section>

          <Divider sx={{ my: 3 }} />

          <section>
            <HeaderSection
              headerSection={advancedInstructionFooterHeaderSection}
              ref={setAdvancedInstructionFooterHtmlAnchorElement}
              t={t}
            ></HeaderSection>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.advancedInstructions.childSections.footer.introduction"
                components={{
                  footerInstructionCode: <ChipCode code="footer" onClick={handleChipCodeClick} />,
                }}
              />
            </Typography>

            <Box component="ul">
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.extended')}
                <InstructionSyntaxPresentation>
                  {t(
                    'sections.advancedInstructions.childSections.footer.extendedInstructionSyntax'
                  )}
                </InstructionSyntaxPresentation>
              </li>
              <li>
                {t('sections.advancedInstructions.introductionForInstructionSynatx.short')}
                <InstructionSyntaxPresentation>
                  {t('sections.advancedInstructions.childSections.footer.shortInstructionSyntax')}
                </InstructionSyntaxPresentation>
              </li>
            </Box>

            <Typography mb={2}>
              <Trans
                t={t}
                i18nKey="sections.advancedInstructions.childSections.footer.examplesIntroduction"
                components={{
                  footerInstructionCode: <ChipCode code="footer" onClick={handleChipCodeClick} />,
                }}
              />
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table
                aria-label={t(
                  'sections.advancedInstructions.childSections.footer.examplesTable.description'
                )}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t(
                        'sections.advancedInstructions.childSections.footer.examplesTable.headers.instruction'
                      )}
                    </TableCell>
                    <TableCell>
                      {t(
                        'sections.advancedInstructions.childSections.footer.examplesTable.headers.result'
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {renderedInstructionExamplesForFooterInstruction.map(
                    (
                      renderedInstructionExampleForFooterInstruction,
                      renderedInstructionExampleForFooterInstructionIndex
                    ) => (
                      <TableRow
                        key={renderedInstructionExampleForFooterInstructionIndex}
                        sx={
                          renderedInstructionExampleForFooterInstructionIndex + 1 ===
                          renderedInstructionExamplesForFooterInstruction.length
                            ? { '& .MuiTableCell-root': { borderBottomWidth: 0 } }
                            : {}
                        }
                      >
                        <TableCell>
                          <ChipCode
                            code={
                              renderedInstructionExampleForFooterInstruction.instructionExample
                                .instruction
                            }
                            onClick={handleChipCodeClick}
                            hoverButtonIcon={ChipCodeHoverButtonContentCopyIcon}
                          />
                        </TableCell>
                        <TableCell>
                          <TablatureBlock
                            align="left"
                            borderless={true}
                            disableGutters={true}
                            discardHeader={true}
                            discardFooter={false}
                            fullWidth={false}
                            label=""
                            block={renderedInstructionExampleForFooterInstruction.renderedTab[0]}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </section>

          <Divider sx={{ my: 3 }} />

          <section>
            <HeaderSection
              headerSection={composingTheTablatureHeaderSection}
              ref={setComposingTheTablatureHtmlAnchorElement}
              t={t}
            ></HeaderSection>

            <Typography mb={2}>{t('sections.tablatureComposition.introduction')}</Typography>

            <Box sx={{ textAlign: 'center' }}>
              <Button
                to="/editor"
                variant="contained"
                color="secondary"
                size="large"
                component={NextLinkComposed}
              >
                {t('sections.tablatureComposition.actions.goToEditor.label')}
              </Button>
            </Box>
          </section>
        </Grid>
      </Grid>
    </BaseLayout>
  );
};

export default About;

export const getStaticProps: GetStaticProps = async (context) => {
  const instructionExamplesSetupProviderService = new InstructionExamplesSetupProviderService(
    context.locale
  );

  const basicInstructionExamplesSetup =
    await instructionExamplesSetupProviderService.getBasicInstructionExamplesSetup();
  const basicInstructionWithTechniqueExamplesSetup =
    await instructionExamplesSetupProviderService.getBasicInstructionWithTechniqueExamplesSetup();
  const footerInstructionExamplesSetup =
    await instructionExamplesSetupProviderService.getFooterInstructionExamplesSetup();
  const headerInstructionExamplesSetup =
    await instructionExamplesSetupProviderService.getHeaderInstructionExamplesSetup();
  const mergeInstructionExamplesSetup =
    await instructionExamplesSetupProviderService.getMergeInstructionExamplesSetup();
  const repeatInstructionExamplesSetup =
    await instructionExamplesSetupProviderService.getRepeatInstructionExamplesSetup();
  const spacingInstructionExamplesSetup =
    await instructionExamplesSetupProviderService.getSpacingInstructionExamplesSetup();

  const renderedInstructionExamplesForBasicInstruction = await renderInstructionExamplesFromSetup(
    basicInstructionExamplesSetup
  );
  const renderedInstructionExamplesForBasicInstructionWithTechnique =
    await renderInstructionExamplesFromSetup(basicInstructionWithTechniqueExamplesSetup);
  const renderedInstructionExamplesForFooterInstruction = await renderInstructionExamplesFromSetup(
    footerInstructionExamplesSetup
  );
  const renderedInstructionExamplesForHeaderInstruction = await renderInstructionExamplesFromSetup(
    headerInstructionExamplesSetup
  );
  const renderedInstructionExamplesForMergeInstruction = await renderInstructionExamplesFromSetup(
    mergeInstructionExamplesSetup
  );
  const renderedInstructionExamplesForRepeatInstruction = await renderInstructionExamplesFromSetup(
    repeatInstructionExamplesSetup
  );
  const renderedInstructionExamplesForSpacingInstruction = await renderInstructionExamplesFromSetup(
    spacingInstructionExamplesSetup
  );

  const aboutComponentProps: AboutProps = {
    renderedInstructionExamplesForBasicInstruction,
    renderedInstructionExamplesForBasicInstructionWithTechnique,
    renderedInstructionExamplesForFooterInstruction,
    renderedInstructionExamplesForHeaderInstruction,
    renderedInstructionExamplesForMergeInstruction,
    renderedInstructionExamplesForRepeatInstruction,
    renderedInstructionExamplesForSpacingInstruction,
  };

  return {
    props: {
      ...(await serverSideTranslations(context.locale || '', [
        'common',
        'about',
        'layout',
        'instruction-examples',
      ])),
      ...aboutComponentProps,
    },
  };
};

async function renderInstructionExamplesFromSetup<TInstructionExample extends InstructionExample>(
  instructionExamplesSetup: InstructionExamplesSetupDTO<TInstructionExample>
): Promise<RenderedInstructionExample<TInstructionExample>[]> {
  const tablatureService = new TablatureService();

  const renderedInstructionExamples: RenderedInstructionExample<TInstructionExample>[] = [];
  for (const instructionExample of instructionExamplesSetup.instructionExamples) {
    const tabCreationResult = await tablatureService.createTablature(
      new TablatureCreationDataDTO({
        initialSpacing: instructionExamplesSetup.initialSpacing,
        instructions: instructionExample.instruction,
        numberOfStrings: instructionExamplesSetup.numberOfStrings,
        rowsLength: instructionExamplesSetup.rowsLenght,
      })
    );

    if (tablatureService.isSuccessfulTablatureCreationResult(tabCreationResult)) {
      renderedInstructionExamples.push({
        instructionExample: { ...instructionExample },
        renderedTab: tabCreationResult.tablature.renderedTab,
      });
    } else {
      throw new Error(
        `Failed to render tab for example instruction ${instructionExample.instruction}`
      );
    }
  }

  return renderedInstructionExamples;
}
