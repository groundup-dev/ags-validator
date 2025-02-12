import { useCallback, useEffect, useMemo, useState } from "react";
import { Theme } from "@glideapps/glide-data-grid";
import { useTheme } from "next-themes";

export const useGridTheme = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [cssUpdated, setCssUpdated] = useState(0);

  // watch for class changes on document.documentElement
  // this is a hack to force a recalculation of CSS variables
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setCssUpdated((prev) => prev + 1);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const getCSSVariable = useCallback(
    (variableName: string, opacity?: number) => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();

      if (value.match(/^\d/)) {
        const [h, s, l] = value.split(" ");

        const formattedH = h;
        const formattedS = s.endsWith("%") ? s : `${s}%`;
        const formattedL = l.endsWith("%") ? l : `${l}%`;

        const result =
          opacity !== undefined
            ? `hsla(${formattedH}, ${formattedS}, ${formattedL}, ${opacity})`
            : `hsl(${formattedH}, ${formattedS}, ${formattedL})`;

        console.log(`Getting CSS var ${variableName}:`, {
          rawValue: value,
          opacity,
          result,
          components: { h: formattedH, s: formattedS, l: formattedL },
        });

        return result;
      }

      return value;
    },
    [cssUpdated]
  );

  const gridTheme: Partial<Theme> = useMemo(() => {
    const theme = {
      // base colors and backgrounds
      bgCell: getCSSVariable("--background"),
      bgCellMedium: getCSSVariable("--muted", 0.1),
      bgHeader: getCSSVariable("--secondary"),
      bgHeaderHasFocus: getCSSVariable("--secondary"),
      bgHeaderHovered: getCSSVariable("--muted", 0.2),
      bgSearchResult: getCSSVariable("--warning", 0.2),
      bgIconHeader: getCSSVariable("--secondary"),

      // text
      textDark: getCSSVariable("--foreground"),
      textMedium: getCSSVariable("--muted-foreground"),
      textLight: getCSSVariable("--muted-foreground"),
      textBubble: getCSSVariable("--foreground"),
      textHeader: getCSSVariable("--secondary-foreground"),
      textHeaderSelected: getCSSVariable("--primary-foreground"),
      textGroupHeader: getCSSVariable("--secondary-foreground"),

      // icon colors
      fgIconHeader: getCSSVariable("--secondary-foreground"),

      // accent and selection
      accentColor: getCSSVariable("--primary"),
      accentLight: getCSSVariable("--primary", 0.2),
      accentFg: getCSSVariable("--primary-foreground"),

      // borders
      borderColor: getCSSVariable("--border"),
      horizontalBorderColor: getCSSVariable("--border"),
      drilldownBorder: getCSSVariable("--border"),

      // links
      linkColor: getCSSVariable("--primary"),

      // fonts and sizing
      //   fontFamily: "inherit",
    };

    return theme;
  }, [isDark, getCSSVariable, cssUpdated]);

  return {
    theme: gridTheme,
  };
};
