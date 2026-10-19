import { Badge, Icon } from './shared.jsx'

/* PAGES_SPEC 2.6. Text column + visual. Below lg the two stack (visual after the text unless `visualFirst`).
   gridClass sets the >=lg layout (flex row by default; pass a grid template for the /teams and AI rows). */
export default function SplitFeature({
  reverse = false,
  visualFirst = false,
  visual,
  children,
  className = '',
  layoutClass = 'lg:flex-row lg:items-center',
  gapClass = 'gap-10',
  textClass = '',
  visualClass = '',
}) {
  return (
    <div className={`flex flex-col ${layoutClass} ${reverse ? 'lg:flex-row-reverse' : ''} ${gapClass} ${className}`}>
      <div className={`relative ${textClass}`}>{children}</div>
      <div className={`relative ${visualFirst ? 'order-first lg:order-none' : ''} ${visualClass}`}>{visual}</div>
    </div>
  )
}

/* Heading styles reused across instances */
// 20px pair: white h2 run-in with a #9c9c9d h5, optional Badge
export function PairHead({ title, sub, badge, badgeIcon = 'spark', children }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[20px] font-medium leading-normal tracking-ui">
        <span className="text-white">{title}</span> <span className="text-grey-200">{sub}</span>
      </p>
      {children}
      {badge && <Badge icon={badgeIcon}>{badge}</Badge>}
    </div>
  )
}

// /teams highlight: blue eyebrow with icon, 30px/36 600 h4 (20px/30 at 390), two paragraphs, arrow link
export function TeamsHead({ eyebrow, icon = 'users', title, p1, p2, link }) {
  return (
    <div className="flex flex-col">
      <strong className="flex items-center gap-3 text-[16px] font-medium leading-6 text-brand-blue">
        <Icon name={icon} size={16} />
        {eyebrow}
      </strong>
      <h4 className="mt-4 text-[20px] font-semibold leading-[30px] text-white sm:text-[30px] sm:leading-9">{title}</h4>
      <p className="mt-4 text-[16px] font-medium leading-6 text-white/60">{p1}</p>
      {p2 && <p className="mt-4 text-[16px] font-medium leading-6 text-white/60">{p2}</p>}
      {link && (
        <a href="#" className="group mt-6 inline-flex items-center gap-2 self-start text-[14px] font-medium leading-4 tracking-ui text-white">
          {link}
          <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-[2px]" />
        </a>
      )}
    </div>
  )
}
