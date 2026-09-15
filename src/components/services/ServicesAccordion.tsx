import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import type { Service } from '../../data/services'
import { SERVICE_ICONS } from '../../data/services'
import { ReactIcon, type IconName } from '../ReactIcon'

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
    <div className="flex flex-col gap-3" id="ep-accordion">
      {services.map((service, index) => {
        const expanded = openIndex === index
        const iconName = (SERVICE_ICONS[service.tab] ?? 'lamp') as IconName
        const triggerId = `ep-summary-${index}`
        const panelId = `ep-panel-${index}`

        return (
          <div
            className={`svc-item ${expanded ? 'svc-item-open' : ''}`}
            key={service.tab}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={triggerId}
                ref={(el) => {
                  triggers.current[index] = el
                }}
                aria-expanded={expanded}
                aria-controls={panelId}
                className="svc-trigger"
                onClick={() => toggle(index)}
                onKeyDown={(event) => onTriggerKeyDown(event, index)}
              >
                <span className="svc-icon-chip" aria-hidden="true">
                  <ReactIcon name={iconName} size={15} />
                </span>
                <span className="svc-name">{service.name}</span>
                <ReactIcon
                  name="chevron-down"
                  size={16}
                  className={`svc-chevron ${expanded ? 'svc-chevron-open' : ''}`}
                />
              </button>
            </h3>

            {expanded && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="svc-panel"
              >
                <p className="svc-desc">{service.description}</p>

                <div className="svc-includes">
                  <p className="svc-label">What's included</p>
                  <ul className="svc-list">
                    {service.includes.map((item) => (
                      <li className="svc-list-item" key={item}>
                        <ReactIcon
                          name="check"
                          size={14}
                          className="svc-check"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="svc-footer">
                  <span className="svc-duration">
                    Typical engagement:{' '}
                    <strong>{service.duration}</strong>
                  </span>
                  <a
                    className="svc-cta"
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