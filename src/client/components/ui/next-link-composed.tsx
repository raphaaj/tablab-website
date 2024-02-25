/**
 * Guide to use nextjs NextLink component with MUI 5:
 * * https://mui.com/guides/routing/#next-js
 * * https://github.com/mui/material-ui/blob/master/examples/material-ui-nextjs-pages-router-ts/src/Link.tsx
 */
import { styled } from '@mui/material/styles';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { forwardRef, memo } from 'react';

const Anchor = styled('a')({});

interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<NextLinkProps, 'href' | 'as' | 'passHref' | 'onMouseEnter' | 'onClick' | 'onTouchStart'> {
  linkAs?: NextLinkProps['as'];
  to: NextLinkProps['href'];
}

export const NextLinkComposed = forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  function NextLinkComposed(props, ref) {
    const {
      to,
      linkAs,
      replace,
      scroll,
      shallow,
      prefetch,
      legacyBehavior = true,
      locale,
      ...other
    } = props;

    return (
      <NextLink
        href={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref
        locale={locale}
        legacyBehavior={legacyBehavior}
      >
        <Anchor ref={ref} {...other} />
      </NextLink>
    );
  }
);

export default memo(NextLinkComposed);
