import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as stylex from '@stylexjs/stylex'
import type { Service } from '../../data/services'
import { SERVICE_ICONS } from '../../data/services'
import { ReactIcon, type IconName } from '../ReactIcon'
import { servicesAccordionStyles } from './servicesAccordion.stylex'

interface ServicesAccordionProps {
  services: Service[]
}

/**
 * Accessible, exclusively-open accordion for service offerings.
 * - Buttons drive expansion; panels are `region`s labelled by the trigger.
 * - Roving tabindex + arrow/Home/End keyboard navigation (APG accordion pattern).
 */
export default function ServicesAccordion({ services }: ServicesAccordionProps): ReactNode {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const triggers = useRef<Array<HTMLButtonElement | null>>([])

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index))
  }

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null
    switch (event.key) {
      case 'ArrowDown':
        next = (index + 1) % services.length
        break
      case 'ArrowUp':
        next = (index - 1 + services.length) % services.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = services.length - 1
        break
      default:
        return
    }
    event.preventDefault()
    triggers.current[next]?.focus()
  }

  return (
    <div {...stylex.props(servicesAccordionStyles.stack)} id="ep-accordion">
      {services.map((service, index) => {
        const expanded = openIndex === index
        const iconName = (SERVICE_ICONS[service.tab] ?? 'lamp') as IconName
        const triggerId = `ep-summary-${index}`
        const panelId = `ep-panel-${index}`

        return (
          <div
            {...stylex.props(
              servicesAccordionStyles.item,
              expanded && servicesAccordionStyles.itemOpen,
            )}
            data-home-hook="svc-item"
            key={service.tab}
          >
            <h3 {...stylex.props(servicesAccordionStyles.heading)}>
              <button
                type="button"
                id={triggerId}
                ref={(el) => {
                  triggers.current[index] = el
                }}
                aria-expanded={expanded}
                aria-controls={panelId}
                {...stylex.props(servicesAccordionStyles.trigger)}
                onClick={() => toggle(index)}
                onKeyDown={(event) => onTriggerKeyDown(event, index)}
              >
                <span
                  {...stylex.props(
                    servicesAccordionStyles.iconChip,
                    expanded && servicesAccordionStyles.iconChipOpen,
                  )}
                  data-home-hook="svc-chip"
                  aria-hidden="true"
                >
                  <ReactIcon name={iconName} size={15} />
                </span>
                <span {...stylex.props(servicesAccordionStyles.name)} data-home-hook="svc-name">{service.name}</span>
                <span
                  {...stylex.props(
                    servicesAccordionStyles.chevron,
                    expanded && servicesAccordionStyles.chevronOpen,
                  )}
                  aria-hidden="true"
                >
                  <ReactIcon name="chevron-down" size={16} />
                </span>
              </button>
            </h3>

            {expanded && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                {...stylex.props(servicesAccordionStyles.panel)}
              >
                <p {...stylex.props(servicesAccordionStyles.desc)}>{service.description}</p>

                <div {...stylex.props(servicesAccordionStyles.includes)}>
                  <p {...stylex.props(servicesAccordionStyles.label)}>What's included</p>
                  <ul {...stylex.props(servicesAccordionStyles.list)}>
                    {service.includes.map((item) => (
                      <li {...stylex.props(servicesAccordionStyles.listItem)} key={item}>
                        <span {...stylex.props(servicesAccordionStyles.check)} aria-hidden="true">
                          <ReactIcon name="check" size={14} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div {...stylex.props(servicesAccordionStyles.footer)}>
                  <span {...stylex.props(servicesAccordionStyles.duration)}>
                    Typical engagement:{' '}
                    <strong {...stylex.props(servicesAccordionStyles.durationStrong)}>{service.duration}</strong>
                  </span>
                  <a
                    {...stylex.props(servicesAccordionStyles.cta)}
                    href="https://cal.com/yoosuf"
                    target="_blank"
                    rel="noopener"
                  >
                    {service.cta} →
                  </a>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
