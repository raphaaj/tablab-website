import TypographyFontMonospace from '@components/typography-font-monospace';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { FC } from 'react';

export type TablatureBlockProps = {
  block: string[];
  label: string;
};

const TablatureBlock: FC<TablatureBlockProps> = (props) => {
  const tabBlockRowPrefixLength = Math.trunc(1 + (props.block.length - 2) / 10) + 2;

  return (
    <TableContainer sx={{ marginBottom: '1rem' }}>
      <Table aria-label={props.label} size="small">
        <TableBody>
          {props.block.map((tabBlockRow, tabBlockRowIndex) => (
            <TableRow key={tabBlockRowIndex}>
              <TableCell
                component="th"
                scope="row"
                sx={{
                  borderBottom: tabBlockRowIndex === props.block.length - 1 ? 'none' : undefined,
                }}
              >
                <TypographyFontMonospace variant="body1" component="pre">
                  {tabBlockRowIndex === 0 || tabBlockRowIndex === props.block.length - 1
                    ? ''.padStart(tabBlockRowPrefixLength, ' ')
                    : `${tabBlockRowIndex}) `.padStart(tabBlockRowPrefixLength, ' ')}
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

export default TablatureBlock;
