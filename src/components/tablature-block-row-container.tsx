import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';

export type TablatureBlockRowContainerProps = {
  children?: React.ReactNode;
  isLastRow: boolean;
};

const TablatureBlockRowContainer: FC<TablatureBlockRowContainerProps> = (props) => {
  return (
    <TableRow>
      <TableCell
        component="th"
        scope="row"
        sx={{
          borderBottom: props.isLastRow ? 'none' : undefined,
        }}
      >
        {props.children}
      </TableCell>
    </TableRow>
  );
};

export default TablatureBlockRowContainer;
