import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { FC } from 'react';

export type InvalidInstruction = {
  description: string;
  instruction: string;
  invalidChildInstructions: InvalidInstruction[] | null;
};

export type InvalidInstructionFeedbackProps = {
  first?: boolean;
  invalidInstruction: InvalidInstruction;
  last?: boolean;
  root?: boolean;
};

const InvalidInstructionFeedback: FC<InvalidInstructionFeedbackProps> = (props) => {
  const invalidInstructionListItemStyles: SxProps<Theme> = { pt: undefined };
  const invalidChildInstructionsListItemStyles: SxProps<Theme> = { pt: undefined, pb: undefined };

  if (props.root && props.invalidInstruction.invalidChildInstructions) {
    invalidInstructionListItemStyles.pb = 0;

    invalidChildInstructionsListItemStyles.pt = 0;
  }

  if (props.root && props.last) {
    invalidInstructionListItemStyles.pb = 0;

    invalidChildInstructionsListItemStyles.pb = 0;
  }

  return (
    <>
      {props.root && props.first && <Divider component="li" />}

      <ListItem disableGutters disablePadding={!props.root} sx={invalidInstructionListItemStyles}>
        <ListItemText
          primary={props.invalidInstruction.instruction}
          secondary={props.invalidInstruction.description}
        />
      </ListItem>

      {props.invalidInstruction.invalidChildInstructions && (
        <ListItem
          disableGutters
          disablePadding={!props.root}
          sx={invalidChildInstructionsListItemStyles}
        >
          <List disablePadding dense sx={{ pl: 4 }}>
            {props.invalidInstruction.invalidChildInstructions.map(
              (invalidChildInstruction, invalidChildInstructionIndex, invalidChildInstructions) => (
                <InvalidInstructionFeedback
                  key={invalidChildInstructionIndex}
                  invalidInstruction={invalidChildInstruction}
                  first={invalidChildInstructionIndex === 0}
                  last={invalidChildInstructionIndex === invalidChildInstructions.length - 1}
                ></InvalidInstructionFeedback>
              )
            )}
          </List>
        </ListItem>
      )}

      {props.root && !props.last && <Divider component="li" />}
    </>
  );
};

export default InvalidInstructionFeedback;
