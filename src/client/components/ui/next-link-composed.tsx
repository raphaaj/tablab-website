/**
 * Guide to use nextjs NextLink component with MUI 5:
 * * https://mui.com/guides/routing/#next-js
 * * https://github.com/mui/material-ui/blob/master/examples/nextjs-with-typescript/src/Link.tsx
 */
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { forwardRef, memo } from 'react';

interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<NextLinkProps, 'href' | 'as' | 'onClick' | 'onMouseEnter' | 'onTouchStart'> {
  linkAs?: NextLinkProps['as'];
  to: NextLinkProps['href'];
}

export const NextLinkComposed = forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  function NextLinkComposed(props, ref) {
    const { to, linkAs, replace, scroll, shallow, prefetch, locale, ...other } = props;

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
      >
        <a ref={ref} {...other}></a>
      </NextLink>
    );
  }
);

export default memo(NextLinkComposed);
