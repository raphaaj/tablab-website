import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';

export interface TablatureBlockRowContainerProps {
  borderless?: boolean;
  children?: React.ReactNode;
  isLastRow: boolean;
}

const TablatureBlockRowContainer: FC<TablatureBlockRowContainerProps> = (props) => {
  const borderless = props.borderless ?? false;

  let borderBottom: string | undefined;
  if (borderless || props.isLastRow) {
    borderBottom = 'none';
  }

  return (
    <TableRow>
      <TableCell
        component="td"
        scope="row"
        sx={{
          borderBottom: borderBottom,
        }}
      >
        {props.children}
      </TableCell>
    </TableRow>
  );
};

export default TablatureBlockRowContainer;
