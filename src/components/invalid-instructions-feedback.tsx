import InvalidInstructionFeedback, {
  InvalidInstruction,
} from '@components/invalid-instruction-feedback';
import List from '@mui/material/List';
import { FC } from 'react';

export type InvalidInstructionsFeedbackProps = {
  invalidInstructions: InvalidInstruction[];
};

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
