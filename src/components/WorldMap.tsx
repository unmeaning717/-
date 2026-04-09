import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

interface WorldMapProps {
  visitedCountries: string[];
  plannedCountries: string[];
}

export default function WorldMap({ visitedCountries, plannedCountries }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const projection = d3.geoMercator()
      .scale(dimensions.width / 6.5)
      .translate([dimensions.width / 2, dimensions.height / 1.4]);

    const path = d3.geoPath().projection(projection);

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data: any) => {
      const countries = topojson.feature(data, data.objects.countries) as any;

      svg.append('g')
        .selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', (d: any) => {
          const name = d.properties.name;
          if (visitedCountries.includes(name)) return '#ffffff';
          if (plannedCountries.includes(name)) return '#71717a'; // Muted gray for planned
          return '#18181b';
        })
        .attr('stroke', '#27272a')
        .attr('stroke-width', 0.5)
        .append('title')
        .text((d: any) => d.properties.name);
    });
  }, [dimensions, visitedCountries, plannedCountries]);

  return (
    <div ref={containerRef} className="w-full aspect-[2/1] bg-zinc-950 border border-zinc-900 overflow-hidden">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-full" />
    </div>
  );
}
