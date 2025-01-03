import BaseLayout from '@client/components/layout/base-layout';
import { InvalidInstruction } from '@client/components/pages/editor/invalid-instruction-feedback';
import InvalidInstructionsFeedback from '@client/components/pages/editor/invalid-instructions-feedback';
import Tablature from '@client/components/tablature/tablature';
import TablatureSkeleton from '@client/components/tablature/tablature-skeleton';
import NextLinkComposed from '@client/components/ui/next-link-composed';
import TextFieldFontMonospace from '@client/components/ui/text-field-font-monospace';
import { container } from '@client/container';
import { useSnackbarReducerContext } from '@client/contexts/snackbar-reducer.context';
import { useHtmlElementSize } from '@client/hooks/use-html-element-size';
import { TablatureCreationError } from '@client/models/tablature/tablature-creation-error';
import { TablatureDownloadError } from '@client/models/tablature/tablature-download-error';
import { EnqueueSnackbarAction } from '@client/reducers/snackbar.reducer';
import {
  ITablatureService,
  ITablatureServiceInjectionToken,
} from '@client/services/tablature-service/interfaces/tablature-service.interface';
import { TablatureInstructionCompilationErrorDetails } from '@common/view-models/tablature/tablature-compilation-error';
import CreateIcon from '@mui/icons-material/Create';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MuiLink from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { GetStaticProps } from 'next';
import { Trans, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';

export const DEFAULT_NUMBER_OF_STRINGS = 6;
export const DEFAULT_INITIAL_SPACING = 3;

export const MAX_NUMBER_OF_STRINGS_OPTION = 12;
export const MIN_NUMBER_OF_STRINGS_OPTION = 4;
export const OPTIONS_FOR_NUMBER_OF_STRING = Array.from(
  {
    length: MAX_NUMBER_OF_STRINGS_OPTION - MIN_NUMBER_OF_STRINGS_OPTION + 1,
  },
  (_, i) => i + MIN_NUMBER_OF_STRINGS_OPTION
);

export const MAX_INITIAL_SPACING_OPTION = 15;
export const MIN_INITIAL_SPACING_OPTION = 1;
export const OPTIONS_FOR_INITIAL_SPACING = Array.from(
  {
    length: MAX_INITIAL_SPACING_OPTION - MIN_INITIAL_SPACING_OPTION + 1,
  },
  (_, i) => i + MIN_INITIAL_SPACING_OPTION
);

export const NUMBER_OF_TABLATURE_BLOCKS_ON_SKELETON = 3;

interface Tablature {
  blocks: string[][];
  initialSpacing: number;
  instructions: string;
  numberOfStrings: number;
  observations: string | null;
  title: string | null;
}

function createInvalidInstructionFromInstructionRenderizationError(
  instructionRenderizationError: TablatureInstructionCompilationErrorDetails
): InvalidInstruction {
  let invalidChildInstructions: InvalidInstruction[] | null = null;

  if (instructionRenderizationError.childInstructionsCompilationErrors) {
    invalidChildInstructions = instructionRenderizationError.childInstructionsCompilationErrors.map(
      createInvalidInstructionFromInstructionRenderizationError
    );
  }

  return {
    invalidChildInstructions,
    instruction: instructionRenderizationError.instruction,
    description: instructionRenderizationError.compilationErrorMessage,
  };
}

export default function Editor() {
  const router = useRouter();
  const { t } = useTranslation('editor');

  const contentGridRef = useRef<HTMLDivElement | null>(null);

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const [instructionsInputValue, setInstructionsInputValue] = useState('');
  const [instructionsInputError, setInstructionsInputError] = useState<string | null>(null);

  const [titleInputValue, setTitleInputValue] = useState('');
  const [observationsInputValue, setObservationsInputValue] = useState('');
  const [numberOfStringsInputValue, setNumberOfStringsInputValue] =
    useState(DEFAULT_NUMBER_OF_STRINGS);
  const [initialSpacingInputValue, setInitialSpacingInputValue] = useState(DEFAULT_INITIAL_SPACING);

  const [isCreatingTab, setIsCreatingTab] = useState(false);
  const [createdTab, setCreatedTab] = useState<Tablature | null>(null);
  const [invalidInstructions, setInvalidInstructions] = useState<InvalidInstruction[] | null>(null);
  const [tabCreationError, setTabCreationError] = useState<unknown | null>(null);

  const [isDownloadingTab, setIsDownloadingTab] = useState(false);

  const contentGridSize = useHtmlElementSize(contentGridRef.current);

  const { dispatchSnackbarAction } = useSnackbarReducerContext();

  const toggleShowAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const handleInstructionsInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInstructionsInputValue(event.target.value);
  };

  const handleTitleInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInputValue(event.target.value);
  };

  const handleObservationsInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setObservationsInputValue(event.target.value);
  };

  const handleNumberOfStringsInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfStringsInputValue(Number(event.target.value));
  };

  const handleInitialSpacingInputValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInitialSpacingInputValue(Number(event.target.value));
  };

  const isTabCreationFormValid = (): boolean => {
    setInstructionsInputError(null);

    let isInstructionsInputValueValid = true;
    if (!instructionsInputValue || !instructionsInputValue.trim()) {
      isInstructionsInputValueValid = false;
      setInstructionsInputError(
        t('instructions-form.fields.instructions-input.validation-errors.required')
      );
    }

    const isTabCreationFormValid = isInstructionsInputValueValid;

    return isTabCreationFormValid;
  };

  const handleTabCreation: React.FormEventHandler = async (event) => {
    event.preventDefault();

    setCreatedTab(null);
    setInvalidInstructions(null);
    setTabCreationError(null);

    if (!isTabCreationFormValid()) return;

    setIsCreatingTab(true);

    try {
      const tablatureService = container.resolve<ITablatureService>(
        ITablatureServiceInjectionToken
      );

      let tablatureRowsLength = tablatureService.getMinTablatureRowsLength();
      if (contentGridSize.width) {
        // The relation between the grid content width and tab's block length was determined empirically
        const tabBlockLenthFromGridContentWidth = Math.trunc(0.103 * contentGridSize.width - 6.58);

        if (tabBlockLenthFromGridContentWidth > tablatureRowsLength) {
          tablatureRowsLength = tabBlockLenthFromGridContentWidth;
        }
      }

      const tabCreationResult = await tablatureService.createTablature(
        {
          initialSpacing: initialSpacingInputValue,
          instructions: instructionsInputValue.trim(),
          numberOfStrings: numberOfStringsInputValue,
          rowsLength: tablatureRowsLength,
          observations: observationsInputValue.trim(),
          title: titleInputValue.trim(),
        },
        { acceptedLanguage: router.locale }
      );

      setCreatedTab({
        blocks: tabCreationResult.tablature,
        initialSpacing: tabCreationResult.initialSpacing,
        instructions: tabCreationResult.instructions,
        numberOfStrings: tabCreationResult.numberOfStrings,
        observations: tabCreationResult.observations,
        title: tabCreationResult.title,
      });
    } catch (error) {
      if (error instanceof TablatureCreationError && error.instructionsCompilationErrors) {
        const invalidInstructions = error.instructionsCompilationErrors.map(
          (instructionRenderizationError) =>
            createInvalidInstructionFromInstructionRenderizationError(instructionRenderizationError)
        );

        setInvalidInstructions(invalidInstructions);
        setInstructionsInputError(
          t('instructions-form.fields.instructions-input.validation-errors.invalid-instructions')
        );
      } else {
        setTabCreationError(error);
      }
    } finally {
      setIsCreatingTab(false);
    }
  };

  const handleDownloadTablature = async () => {
    if (isDownloadingTab) return;

    setIsDownloadingTab(true);

    try {
      if (!createdTab) throw new TablatureDownloadError();

      const tablatureService = container.resolve<ITablatureService>(
        ITablatureServiceInjectionToken
      );

      const tablaturePdfDocument = await tablatureService.downloadTablatureAsPdfDocument(
        {
          initialSpacing: createdTab.initialSpacing,
          instructions: createdTab.instructions,
          numberOfStrings: createdTab.numberOfStrings,
          observations: createdTab.observations,
          title: createdTab.title,
        },
        { acceptedLanguage: router.locale }
      );

      const tablaturePdfDocumentObjectURL = window.URL.createObjectURL(tablaturePdfDocument);

      const downloadTablatureLinkElement = document.createElement('a');
      downloadTablatureLinkElement.href = tablaturePdfDocumentObjectURL;
      downloadTablatureLinkElement.download = 'tablature.pdf';
      document.body.appendChild(downloadTablatureLinkElement);
      downloadTablatureLinkElement.click();
      document.body.removeChild(downloadTablatureLinkElement);

      window.URL.revokeObjectURL(tablaturePdfDocumentObjectURL);
    } catch (error) {
      const errorSnackbarTitle = t('tab-download.error.title');
      const errorSnackbarMessage = t('tab-download.error.message');

      dispatchSnackbarAction(
        new EnqueueSnackbarAction({
          severity: 'error',
          title: errorSnackbarTitle,
          message: errorSnackbarMessage,
        })
      );
    } finally {
      setIsDownloadingTab(false);
    }
  };

  return (
    <BaseLayout>
      <Grid container rowSpacing={3} justifyContent="center">
        <Grid item xs={12} xl={10}>
          <Typography mb={1}>{t('introduction.command')}</Typography>

          <Typography mb={2}>
            <Trans
              t={t}
              i18nKey="introduction.instructions-guide"
              components={{
                instructionGuideLink: (
                  <MuiLink
                    component={NextLinkComposed}
                    to="about"
                    target="_blank"
                    rel="noopener"
                  ></MuiLink>
                ),
              }}
            />
          </Typography>

          <form onSubmit={handleTabCreation} noValidate>
            <TextFieldFontMonospace
              id="instructions-input"
              label={t('instructions-form.fields.instructions-input.label')}
              multiline
              fullWidth
              required
              minRows={4}
              value={instructionsInputValue}
              onChange={handleInstructionsInputValueChange}
              error={instructionsInputError !== null}
              helperText={instructionsInputError}
              variant="filled"
              margin="normal"
              inputProps={{
                readOnly: isCreatingTab,
                spellCheck: 'false',
              }}
            />

            <Collapse in={showAdvancedOptions} timeout="auto" unmountOnExit>
              <TextField
                id="title-input"
                label={t('instructions-form.fields.title-input.label')}
                fullWidth
                value={titleInputValue}
                onChange={handleTitleInputValueChange}
                variant="filled"
                margin="normal"
                inputProps={{
                  readOnly: isCreatingTab,
                }}
              />

              <TextField
                id="observations-input"
                label={t('instructions-form.fields.observations-input.label')}
                multiline
                fullWidth
                value={observationsInputValue}
                onChange={handleObservationsInputValueChange}
                variant="filled"
                margin="normal"
                inputProps={{
                  readOnly: isCreatingTab,
                }}
              />

              <Grid container columnSpacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="number-of-strings-input"
                    select
                    fullWidth
                    required
                    label={t('instructions-form.fields.number-of-strings-input.label')}
                    value={numberOfStringsInputValue}
                    onChange={handleNumberOfStringsInputValueChange}
                    variant="filled"
                    margin="normal"
                    SelectProps={{
                      readOnly: isCreatingTab,
                    }}
                  >
                    {OPTIONS_FOR_NUMBER_OF_STRING.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    id="initial-spacing-input"
                    select
                    fullWidth
                    required
                    label={t('instructions-form.fields.initial-spacing-input.label')}
                    value={initialSpacingInputValue}
                    onChange={handleInitialSpacingInputValueChange}
                    variant="filled"
                    margin="normal"
                    SelectProps={{
                      readOnly: isCreatingTab,
                    }}
                  >
                    {OPTIONS_FOR_INITIAL_SPACING.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Collapse>

            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Tooltip
                title={
                  showAdvancedOptions
                    ? t('instructions-form.controls.advanced-options-exibition.hide-label')
                    : t('instructions-form.controls.advanced-options-exibition.show-label')
                }
                arrow
              >
                <IconButton
                  onClick={toggleShowAdvancedOptions}
                  aria-expanded={showAdvancedOptions}
                  aria-label={
                    showAdvancedOptions
                      ? t('instructions-form.controls.advanced-options-exibition.hide-label')
                      : t('instructions-form.controls.advanced-options-exibition.show-label')
                  }
                >
                  {showAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Tooltip>

              {isCreatingTab ? (
                <CircularProgress sx={{ margin: 0, padding: '0.5rem' }} />
              ) : (
                <Tooltip title={t('instructions-form.controls.write-tablature.label')} arrow>
                  <IconButton
                    aria-label={t('instructions-form.controls.write-tablature.label')}
                    color="primary"
                    type="submit"
                    disabled={isCreatingTab}
                  >
                    <CreateIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </form>
        </Grid>
        <Grid item xs={12} ref={contentGridRef}>
          <>
            {isCreatingTab && (
              <TablatureSkeleton
                hasTitle={!!titleInputValue}
                hasObservations={!!observationsInputValue}
                numberOfBlocks={NUMBER_OF_TABLATURE_BLOCKS_ON_SKELETON}
                numberOfRowsPerBlock={numberOfStringsInputValue + 2}
              />
            )}

            {!isCreatingTab && createdTab && (
              <>
                <Tablature
                  blocks={createdTab.blocks}
                  observations={createdTab.observations}
                  title={createdTab.title}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      endIcon={<SaveAltIcon />}
                      disabled={isDownloadingTab}
                      onClick={handleDownloadTablature}
                    >
                      {t('tab-download.controls.download.label')}
                    </Button>
                    {isDownloadingTab && (
                      <CircularProgress
                        size={20}
                        thickness={5}
                        sx={{
                          color: (theme) => theme.palette.secondary.contrastText,
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          marginTop: '-10px',
                          marginLeft: '-10px',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </>
            )}

            {!isCreatingTab && invalidInstructions && (
              <Alert
                severity="warning"
                icon={false}
                sx={{ width: '100%', '& .MuiAlert-message': { width: '100%' } }}
              >
                <AlertTitle sx={{ display: 'flex', mb: 2 }}>
                  <WarningAmberIcon
                    sx={{ color: (theme) => theme.palette.warning.light, mr: 1, fontSize: 22 }}
                  />
                  {t('tab-creation.errors.invalid-instructions.title')}
                </AlertTitle>

                <InvalidInstructionsFeedback
                  invalidInstructions={invalidInstructions}
                ></InvalidInstructionsFeedback>
              </Alert>
            )}

            {!isCreatingTab && tabCreationError && (
              <Alert severity="error">
                <AlertTitle>{t('tab-creation.errors.general.title')}</AlertTitle>
                {t('tab-creation.errors.general.message')}
              </Alert>
            )}
          </>
        </Grid>
      </Grid>
    </BaseLayout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || '', [
        'common',
        'editor',
        'layout',
        'tablature',
      ])),
    },
  };
};
