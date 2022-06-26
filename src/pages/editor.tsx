import Layout from '@components/layout/layout';
import TextFieldFontMonospace from '@components/text-field-font-monospace';
import CreateIcon from '@mui/icons-material/Create';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
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

export default function Editor() {
  const { t } = useTranslation('editor');

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [title, setTitle] = useState('');
  const [observations, setObservations] = useState('');
  const [numberOfStrings, setNumberOfStrings] = useState(DEFAULT_NUMBER_OF_STRINGS);
  const [initialSpacing, setInitialSpacing] = useState(DEFAULT_INITIAL_SPACING);

  const toggleShowAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const handleInstructionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInstructions(event.target.value);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleObservationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setObservations(event.target.value);
  };

  const handleNumberOfStringsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfStrings(Number(event.target.value));
  };

  const handleInitialSpacingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInitialSpacing(Number(event.target.value));
  };

  const handleSubmission: React.FormEventHandler = async (event) => {
    event.preventDefault();
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
          <form onSubmit={handleSubmission}>
            <TextFieldFontMonospace
              id="instructions-input"
              label={t('instructions-form.fields.instructions-input.label')}
              multiline
              fullWidth
              required
              minRows={4}
              value={instructions}
              onChange={handleInstructionsChange}
              variant="filled"
              margin="normal"
            />

            <Collapse in={showAdvancedOptions} timeout="auto" unmountOnExit>
              <TextField
                id="title-input"
                label={t('instructions-form.fields.title-input.label')}
                fullWidth
                value={title}
                onChange={handleTitleChange}
                variant="filled"
                margin="normal"
              />

              <TextField
                id="observations-input"
                label={t('instructions-form.fields.observations-input.label')}
                multiline
                fullWidth
                value={observations}
                onChange={handleObservationsChange}
                variant="filled"
                margin="normal"
              />

              <Grid container columnSpacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="number-of-strings-input"
                    select
                    fullWidth
                    required
                    label={t('instructions-form.fields.number-of-strings-input.label')}
                    value={numberOfStrings}
                    onChange={handleNumberOfStringsChange}
                    variant="filled"
                    margin="normal"
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
                    value={initialSpacing}
                    onChange={handleInitialSpacingChange}
                    variant="filled"
                    margin="normal"
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

              <Tooltip title={t('instructions-form.controls.write-tablature.label')} arrow>
                <IconButton
                  aria-label={t('instructions-form.controls.write-tablature.label')}
                  color="primary"
                  type="submit"
                >
                  <CreateIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </form>
        </Grid>
      </Grid>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale || '', ['common', 'editor', 'layout'])),
    },
  };
};
