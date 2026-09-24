import * as stylex from '@stylexjs/stylex'
import { colors, space, typeScale } from '../../styles/tokens.stylex'

type Crumb = { label: string; href?: string }

interface Props {
  items: Crumb[]
  /** Origin (e.g. SITE.url) used to build the Home crumb. */
  baseUrl: string
}

const styles = stylex.create({
  nav: {
    fontSize: typeScale.xs,
    color: colors.textFaint,
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: space['2'],
    rowGap: space['2'],
    marginBlock: 0,
    paddingInlineStart: 0,
    listStyle: 'none',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    columnGap: space['2'],
  },
  link: {
    color: colors.textFaint,
    textDecorationLine: 'none',
    textDecorationColor: colors.border,
    textUnderlineOffset: '4px',
    transition: 'color 0.15s ease',
    ':hover': {
      color: colors.text,
      textDecorationLine: 'underline',
    },
  },
  current: {
    color: colors.textDim,
    display: 'inline-block',
    maxWidth: 'min(20rem, 100%)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  separator: {
    color: colors.textFaint,
  },
})

export function Breadcrumbs({ items, baseUrl }: Props) {
  const trail: Crumb[] = [{ label: 'Home', href: `${baseUrl}/` }, ...items]
  const toAbsolute = (href: string) => {
    try {
      return new URL(href, baseUrl).href
    } catch {
      return href
    }
  }
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: toAbsolute(crumb.href) } : {}),
    })),
  }

  return (
    <>
      <nav {...stylex.props(styles.nav)} aria-label="Breadcrumb">
        <ol {...stylex.props(styles.list)}>
          {trail.map((crumb, i) => (
            <li key={`${crumb.label}-${i}`} {...stylex.props(styles.item)}>
              {crumb.href ? (
                <a {...stylex.props(styles.link)} href={crumb.href}>
                  {crumb.label}
                </a>
              ) : (
                <span aria-current="page" {...stylex.props(styles.current)}>
                  {crumb.label}
                </span>
              )}
              {i < trail.length - 1 && (
                <span aria-hidden="true" {...stylex.props(styles.separator)}>
                  &rsaquo;
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}