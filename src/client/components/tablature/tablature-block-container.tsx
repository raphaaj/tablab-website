import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { FC } from 'react';

export type TablatureBlockAlignmentOption = 'left' | 'right' | 'center';

export interface TablatureBlockContainerProps {
  align?: TablatureBlockAlignmentOption;
  children?: React.ReactNode;
  fullWidth?: boolean;
  label: string;
}

const TablatureBlockContainer: FC<TablatureBlockContainerProps> = (props) => {
  const tablatureBlockAlignmentOption: TablatureBlockAlignmentOption = props.align ?? 'center';
  const fullWidthTablatureBlock = props.fullWidth ?? true;

  let tableMarginLeft: string | number = 'auto';
  let tableMarginRight: string | number = 'auto';
  if (tablatureBlockAlignmentOption === 'left') {
    tableMarginLeft = 0;
  } else if (tablatureBlockAlignmentOption === 'right') {
    tableMarginRight = 0;
  }

  return (
    <TableContainer sx={{ marginBottom: '1rem' }}>
      <Table
        sx={{
          width: fullWidthTablatureBlock ? '100%' : 'auto',
          marginLeft: tableMarginLeft,
          marginRight: tableMarginRight,
        }}
        aria-label={props.label}
        size="small"
      >
        <TableBody>{props.children}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablatureBlockContainer;
