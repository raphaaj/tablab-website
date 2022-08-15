import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { FC } from 'react';

export type TablatureBlockContainerProps = {
  children?: React.ReactNode;
  label: string;
};

const TablatureBlockContainer: FC<TablatureBlockContainerProps> = (props) => {
  return (
    <TableContainer sx={{ marginBottom: '1rem' }}>
      <Table aria-label={props.label} size="small">
        <TableBody>{props.children}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablatureBlockContainer;
