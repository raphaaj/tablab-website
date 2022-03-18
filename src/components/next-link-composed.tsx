// https://mui.com/guides/routing/#next-js
import { styled } from '@mui/material/styles';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { forwardRef } from 'react';

const Anchor = styled('a')({});

interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Omit<NextLinkProps, 'href' | 'as'> {
  href?: NextLinkProps['href'];
  linkAs?: NextLinkProps['as'];
  to: NextLinkProps['href'];
}

export const NextLinkComposed = forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  function NextLinkComposed(props, ref) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { to, linkAs, href, replace, scroll, shallow, prefetch, locale, ...other } = props;

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
        <Anchor ref={ref} {...other} />
      </NextLink>
    );
  }
);

export default NextLinkComposed;
