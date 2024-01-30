import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { FC } from 'react';

interface InstructionSyntaxPresentationProps {
  children?: React.ReactNode;
}

const InstructionSyntaxPresentation: FC<InstructionSyntaxPresentationProps> = ({ children }) => (
  <Paper
    variant="outlined"
    sx={(theme) => ({
      my: 2,
      backgroundColor: theme.palette.grey[100],
    })}
  >
    <Box
      component="pre"
      sx={{
        m: 0,
        p: 1,
        textAlign: 'center',
        overflowX: 'auto',
      }}
    >
      <Box component="code" sx={(theme) => ({ fontFamily: theme.fontFamilies.monospace })}>
        {children}
      </Box>
    </Box>
  </Paper>
);

export default InstructionSyntaxPresentation;
