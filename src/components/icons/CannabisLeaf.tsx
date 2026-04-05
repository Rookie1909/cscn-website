import React, { useId } from 'react';

interface CannabisLeafProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/**
 * Cannabis leaf icon using the generated flat-design PNG.
 *
 * Technique: The PNG has a WHITE background + BLACK leaf.
 * The SVG filter pipeline:
 *   1. feColorMatrix  → extract only dark pixels (invert luminance → alpha)
 *   2. feComposite    → use that alpha to mask a currentColor rectangle
 *
 * Result: The leaf silhouette appears in `currentColor`, background is transparent.
 */
export const CannabisLeaf: React.FC<CannabisLeafProps> = ({
  size = 24,
  className = '',
  ...props
}) => {
  const uid = useId().replace(/:/g, '');
  const filterId = `clf-${uid}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      overflow="visible"
      {...props}
    >
      <defs>
        <filter id={filterId} x="0" y="0" width="100%" height="100%"
                colorInterpolationFilters="sRGB">
          {/*
            Step 1 – Turn the dark pixels into the alpha channel.
            The leaf is black (R≈0,G≈0,B≈0) on white (R≈1,G≈1,B≈1).
            We want alpha = 1 where the image is dark and 0 where it's white.
            Formula per pixel: alpha_out = 1 – (R+G+B)/3   (inverted luminance)
          */}
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            result="alphaFromDark"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                   -0.333 -0.333 -0.333 0 1"
          />
          {/*
            Step 2 – Flood the whole region with the icon colour (currentColor).
            Because SVG filters work in sRGB we use a fixed colour here; the
            actual tinting is done by "color" CSS property via fill on the <image>.
          */}
          <feFlood floodColor="currentColor" result="colour" />
          {/*
            Step 3 – Composite: paint `colour` only where `alphaFromDark` > 0.
          */}
          <feComposite in="colour" in2="alphaFromDark" operator="in" />
        </filter>
      </defs>

      {/*
        The <image> element loads the PNG and runs it through the filter above.
        `color: inherit` makes `currentColor` inside the filter resolve correctly.
      */}
      <image
        href="/icons/cannabis-leaf.png"
        x="0" y="0"
        width="100" height="100"
        preserveAspectRatio="xMidYMid meet"
        filter={`url(#${filterId})`}
        style={{ color: 'inherit' }}
      />
    </svg>
  );
};
