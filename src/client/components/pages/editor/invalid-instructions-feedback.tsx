import InvalidInstructionFeedback, {
  InvalidInstruction,
} from '@client/components/pages/editor/invalid-instruction-feedback';
import List from '@mui/material/List';
import { FC } from 'react';

export interface InvalidInstructionsFeedbackProps {
  invalidInstructions: InvalidInstruction[];
}

const InvalidInstructionsFeedback: FC<InvalidInstructionsFeedbackProps> = (props) => {
  return (
    <List disablePadding>
      {props.invalidInstructions.map((invalidInstruction, invalidInstructionIndex) => (
        <InvalidInstructionFeedback
          key={invalidInstructionIndex}
          invalidInstruction={invalidInstruction}
          root
          first={invalidInstructionIndex === 0}
          last={invalidInstructionIndex === props.invalidInstructions.length - 1}
        ></InvalidInstructionFeedback>
      ))}
    </List>
  );
};

export default InvalidInstructionsFeedback;
