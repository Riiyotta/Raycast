import { useId, useState } from 'react'
import { Icon, SectionTitle } from './shared.jsx'

/* PAGES_SPEC 2.4
   heading: '20' (default SectionTitle) | '48' (/pro) | '18' (/windows single h2, gap 48)
   sheen: /pro list wrapper (pt 48, bg-top-sheen, top hairline). Multiple items may be open. */
function Item({ q, a }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <div className="faq-item">
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-8 py-[39px] text-left text-[16px] font-semibold leading-6 text-white"
        >
          {q}
          <Icon name="chevron-down" size={16} className={`flex-none text-white transition-transform duration-400 ${open ? 'rotate-180' : ''}`} />
        </button>
      </h4>
      <div
        id={id}
        role="region"
        className="grid transition-[grid-template-rows,opacity] duration-200"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-[15px] leading-[22px] text-fg-300">{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FaqAccordion({ items, title, subtitle, heading = '20', sheen = false, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-[700px] pb-16 ${className}`}>
      {heading === '18' ? (
        <h2 className="text-center text-[18px] font-semibold leading-[25.2px] text-white">{title}</h2>
      ) : heading === '48' ? (
        <SectionTitle size={48} className="mx-auto max-w-[482px]" title={title} subtitle={subtitle} subClass="text-grey-200" />
      ) : (
        <SectionTitle title={title} subtitle={subtitle} />
      )}
      <div className={`${heading === '18' ? 'mt-12' : 'mt-16'} ${sheen ? 'faq-top bg-top-sheen pt-12' : ''}`}>
        <div className="pt-px">
          {items.map(([q, a]) => (
            <Item key={q} q={q} a={a} />
          ))}
        </div>
      </div>
    </div>
  )
}
