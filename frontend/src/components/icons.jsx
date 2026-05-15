const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const StarIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3.5l2.7 5.6 6.2.9-4.5 4.3 1.1 6.1L12 17.6 6.5 20.4l1.1-6.1L3 10l6.2-.9L12 3.5z" />
  </svg>
);

export const ForkIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="5" r="2" />
    <circle cx="18" cy="5" r="2" />
    <circle cx="12" cy="19" r="2" />
    <path d="M6 7v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7" />
    <path d="M12 13v4" />
  </svg>
);

export const EyeIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IssueIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6" />
    <circle cx="12" cy="16.5" r="0.8" fill="currentColor" />
  </svg>
);

export const PrIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
    <path d="M6 8v8" />
    <path d="M14 6h2a2 2 0 0 1 2 2v8" />
  </svg>
);
