import TypographyFontMonospace from '@components/typography-font-monospace';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';

type TabBlockProps = {
  label: string;
  tabBlock: string[];
};

const TabBlock: FC<TabBlockProps> = (props) => {
  return (
    <TableContainer sx={{ marginBottom: '1.5rem' }}>
      <Table aria-label={props.label} size="small">
        <TableBody>
          {props.tabBlock.map((tabBlockRow, tabBlockRowIndex) => (
            <TableRow key={tabBlockRowIndex}>
              <TableCell
                component="th"
                scope="row"
                sx={{
                  borderBottom: tabBlockRowIndex === props.tabBlock.length - 1 ? 'none' : undefined,
                }}
              >
                <TypographyFontMonospace variant="body1" component="pre">
                  {`${tabBlockRowIndex + 1}) `}
                  {tabBlockRow}
                </TypographyFontMonospace>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TabBlock;
