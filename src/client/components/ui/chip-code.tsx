import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import { FC, memo, useCallback } from 'react';

type ChipCodeClickHandler = (code: string) => void;

interface ChipCodeProps {
  code: string;
  hoverButtonIcon?: JSX.Element | null;
  onClick?: ChipCodeClickHandler;
}

const chipCodeHoverIconContainerClassName = 'ChipCode-hoverIconContainer';

const ChipCode: FC<ChipCodeProps> = ({ code, onClick, hoverButtonIcon }) => {
  const handleChipCodeClick = useCallback(() => {
    if (onClick) onClick(code);
  }, [code, onClick]);

  return (
    <Box
      component="span"
      sx={{
        position: 'relative',
        display: 'inline-block',
        fontSize: 'inherit',
        marginRight: hoverButtonIcon ? '2em' : null,
        [`&:hover .${chipCodeHoverIconContainerClassName}`]: {
          opacity: 1,
        },
      }}
    >
      <Chip
        component="code"
        size="small"
        label={code}
        onClick={onClick ? handleChipCodeClick : undefined}
        sx={(theme) => ({
          fontFamily: theme.fontFamilies.monospace,
          fontSize: 'inherit',
          userSelect: 'auto',
        })}
      ></Chip>

      {hoverButtonIcon && onClick && (
        <>
          <Box
            component="span"
            className={chipCodeHoverIconContainerClassName}
            sx={(theme) => ({
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: '-2em',
              opacity: 0,
              transition: theme.transitions.create(['opacity'], {
                duration: theme.transitions.duration.standard,
              }),
              '&:hover .MuiButtonBase-root': {
                transform: 'scale(1.2)',
              },
            })}
          >
            <IconButton
              onClick={handleChipCodeClick}
              size="small"
              aria-hidden="true"
              tabIndex={-1}
              sx={(theme) => ({
                fontSize: 'inherit',
                transition: theme.transitions.create(['transform'], {
                  duration: theme.transitions.duration.short,
                }),
              })}
            >
              {hoverButtonIcon}
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
};

export default memo(ChipCode);
