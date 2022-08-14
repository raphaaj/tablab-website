import { InvalidInstruction } from '@components/invalid-instruction-feedback';
import InvalidInstructionsFeedback from '@components/invalid-instructions-feedback';
import Layout from '@components/layout/layout';
import Tablature from '@components/tablature';
import TextFieldFontMonospace from '@components/text-field-font-monospace';
import { TabLib } from '@lib/tab/tab-lib';
import { TabCreationError } from '@models/tab/tab-creation-error';
import CreateIcon from '@mui/icons-material/Create';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { TabInstructionRenderizationError } from '@view-models/tab/tab-instruction-renderization-error';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

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

type Tablature = {
  blocks: string[][];
  observations: string | null;
  title: string | null;
};

function createInvalidInstructionFromRenderizationError(
  renderizationError: TabInstructionRenderizationError
): InvalidInstruction {
  let invalidChildInstructions: InvalidInstruction[] | null = null;

  if (renderizationError.childErrors) {
    invalidChildInstructions = renderizationError.childErrors.map(
      createInvalidInstructionFromRenderizationError
    );
  }

  return {
    invalidChildInstructions,
    instruction: renderizationError.instruction,
    description: renderizationError.errorMessage as string,
  };
}

/**
 * TODO: exibição de erros inesperados (alert ou snackbar)
 * TODO: exibição de esqueleto de tablatura ao aguardar criação da tablatura
 * TODO: exibição de mensagens de validação no formulário
 */

export default function Editor() {
  const router = useRouter();
  const { t } = useTranslation('editor');

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [instructionsInputValue, setInstructionsInputValue] = useState('');
  const [titleInputValue, setTitleInputValue] = useState('');
  const [observationsInputValue, setObservationsInputValue] = useState('');
  const [numberOfStringsInputValue, setNumberOfStringsInputValue] =
    useState(DEFAULT_NUMBER_OF_STRINGS);
  const [initialSpacingInputValue, setInitialSpacingInputValue] = useState(DEFAULT_INITIAL_SPACING);

  const [isCreatingTab, setIsCreatingTab] = useState(false);
  const [createdTab, setCreatedTab] = useState<Tablature | null>(null);
  const [invalidInstructions, setInvalidInstructions] = useState<InvalidInstruction[] | null>(null);
  const [tabCreationError, setTabCreationError] = useState<unknown | null>(null);

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

  const handleTabCreation: React.FormEventHandler = async (event) => {
    event.preventDefault();

    setIsCreatingTab(true);
    setCreatedTab(null);
    setInvalidInstructions(null);
    setTabCreationError(null);

    try {
      const tabCreationResult = await TabLib.createTab(
        {
          initialSpacing: initialSpacingInputValue,
          instructions: instructionsInputValue.trim(),
          numberOfStrings: numberOfStringsInputValue,
          tabBlockLength: 40, // TODO: adapt according to viewport width
          observations: observationsInputValue.trim(),
          title: titleInputValue.trim(),
        },
        { acceptedLanguage: router.locale }
      );

      setCreatedTab({
        title: tabCreationResult.title,
        observations: tabCreationResult.observations,
        blocks: tabCreationResult.renderedTab,
      });
    } catch (error) {
      if (error instanceof TabCreationError && error.renderizationErrors) {
        const invalidInstructions = error.renderizationErrors.map((renderizationError) =>
          createInvalidInstructionFromRenderizationError(renderizationError)
        );

        setInvalidInstructions(invalidInstructions);
      } else {
        setTabCreationError(error);
      }
    } finally {
      setIsCreatingTab(false);
    }
  };

  return (
    <Layout>
      <Grid
        container
        justifyContent="center"
        sx={(theme) => ({
          [theme.breakpoints.up('md')]: {
            padding: '1.75rem 0',
          },
          [theme.breakpoints.down('md')]: {
            padding: '0.75rem 0',
          },
        })}
      >
        <Grid item xs={12} md={10} lg={8}>
          <>
            <Box mb={3}>
              <form onSubmit={handleTabCreation}>
                <TextFieldFontMonospace
                  id="instructions-input"
                  label={t('instructions-form.fields.instructions-input.label')}
                  multiline
                  fullWidth
                  required
                  minRows={4}
                  value={instructionsInputValue}
                  onChange={handleInstructionsInputValueChange}
                  variant="filled"
                  margin="normal"
                  inputProps={{
                    readOnly: isCreatingTab,
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
            </Box>

            {!isCreatingTab && invalidInstructions && (
              <Alert
                severity="warning"
                icon={false}
                sx={{ 'width': '100%', '& .MuiAlert-message': { width: '100%' } }}
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

            {!isCreatingTab && createdTab && (
              <Tablature
                blocks={createdTab.blocks}
                observations={createdTab.observations}
                title={createdTab.title}
              />
            )}
          </>
        </Grid>
      </Grid>
    </Layout>
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
