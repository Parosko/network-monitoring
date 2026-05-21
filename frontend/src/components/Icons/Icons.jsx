const iconProps = {
   width: 16,
   height: 16,
   fill: 'none',
   stroke: 'currentColor',
   strokeWidth: 2,
   strokeLinecap: 'round',
   strokeLinejoin: 'round',
   'aria-hidden': true,
};

export function IconDot({ className }) {
   return (
      <svg className={className} viewBox="0 0 16 16" width={8} height={8} aria-hidden>
         <circle cx="8" cy="8" r="4" fill="currentColor" />
      </svg>
   );
}

export function IconInfo({ className }) {
   return (
      <svg className={className} viewBox="0 0 16 16" {...iconProps}>
         <circle cx="8" cy="8" r="6" />
         <path d="M8 7v4M8 5h.01" strokeWidth={2.5} />
      </svg>
   );
}

export function IconActivity({ className }) {
   return (
      <svg className={className} viewBox="0 0 16 16" {...iconProps}>
         <path d="M2 8h2l2-5 2 10 2-5h4" />
      </svg>
   );
}

export function IconBarChart({ className }) {
   return (
      <svg className={className} viewBox="0 0 16 16" {...iconProps}>
         <path d="M3 13V7M8 13V3M13 13v-4" />
      </svg>
   );
}

export function IconClose({ className }) {
   return (
      <svg className={className} viewBox="0 0 16 16" {...iconProps}>
         <path d="M4 4l8 8M12 4l-8 8" />
      </svg>
   );
}
