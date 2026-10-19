// PAGES_SPEC 2.8. Heading over a section on the older pages.
// teams:   block pad 72 24 24, h2 36px/40 700 (24px/36 at 390), p 18px/28 400 white/.6, both max 520.
// windows: h2 20px/28 500 .2px white with a <br> and a second span (white/.6 by default).
export default function CenteredLead({ variant = 'teams', title, body, className = '', maxClass = 'max-w-[520px]', bodyClass = 'text-white/60' }) {
  if (variant === 'windows') {
    return (
      <h2 className={`mx-auto text-center text-[20px] font-medium leading-7 tracking-ui text-white ${maxClass} ${className}`}>
        {title}
        <br />
        <span className={bodyClass}>{body}</span>
      </h2>
    )
  }
  return (
    <div className={`px-6 pb-6 pt-[72px] text-center ${className}`}>
      <h2 className={`mx-auto text-[24px] font-bold leading-9 text-white sm:text-[36px] sm:leading-10 ${maxClass}`}>{title}</h2>
      {body && <p className={`mx-auto mt-4 text-[18px] leading-7 ${bodyClass} ${maxClass}`}>{body}</p>}
    </div>
  )
}
