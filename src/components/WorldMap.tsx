import React, { useEffect, useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { motion, useReducedMotion } from 'motion/react';

interface WorldMapProps {
  visitedCountries: string[];
  plannedCountries: string[];
}

interface CountryPath {
  name: string;
  d: string;
  centroid: [number, number];
}

export default function WorldMap({ visitedCountries, plannedCountries }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [features, setFeatures] = useState<any[] | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetWidth * 0.5,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then((r) => r.json())
      .then((topo: any) => {
        if (cancelled) return;
        const fc: any = feature(topo, topo.objects.countries);
        setFeatures(fc.features);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const paths = useMemo<CountryPath[] | null>(() => {
    if (!features || dimensions.width === 0) return null;
    const projection = geoMercator()
      .scale(dimensions.width / 6.5)
      .translate([dimensions.width / 2, dimensions.height / 1.4]);
    const path = geoPath(projection);
    return features.map((f: any) => ({
      name: f.properties.name as string,
      d: path(f) ?? '',
      centroid: path.centroid(f) as [number, number],
    }));
  }, [features, dimensions]);

  const visitedPaths = useMemo(
    () => paths?.filter((p) => visitedCountries.includes(p.name)) ?? [],
    [paths, visitedCountries]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[2/1] bg-zinc-950 border border-zinc-900 overflow-hidden"
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full block"
      >
        {paths?.map((p, i) => {
          const visited = visitedCountries.includes(p.name);
          const planned = plannedCountries.includes(p.name);
          return (
            <motion.path
              key={p.name}
              d={p.d}
              className="world-country"
              data-state={visited ? 'visited' : planned ? 'planned' : 'default'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: reduce ? 0 : Math.min(i * 0.004, 0.6),
                ease: 'easeOut',
              }}
            >
              <title>{p.name}</title>
            </motion.path>
          );
        })}
        {visitedPaths.map((p, i) => (
          <g key={`pin-${p.name}`} transform={`translate(${p.centroid[0]}, ${p.centroid[1]})`}>
            <circle
              className="world-pin-pulse"
              r={3}
              style={reduce ? undefined : { animationDelay: `${i * 0.5}s` }}
            />
            <motion.circle
              className="world-pin"
              r={2.5}
              initial={reduce ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: reduce ? 0 : 0.7 + i * 0.2, type: 'spring', stiffness: 300, damping: 15 }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
