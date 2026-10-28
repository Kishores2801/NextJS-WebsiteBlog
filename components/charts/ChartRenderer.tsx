"use client";

import React, { useState, useMemo } from "react";
import { useTheme } from "next-themes";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Table, EyeOff, AlertCircle } from "lucide-react";

export interface ChartProps {
  _type?: "chart";
  title: string;
  subtitle?: string;
  chartType:
    | "bar"
    | "horizontal-bar"
    | "line"
    | "area"
    | "pie"
    | "donut"
    | "scatter";
  dataSourceMode?: "csv" | "structured";
  csvData?: string;
  dataRows?: Array<{
    category: string;
    value: number;
    secondaryValue?: number;
  }>;
  xAxisKey?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  series?: Array<{
    key: string;
    name?: string;
    color?: string;
  }>;
  colorPalette?: "blue" | "teal" | "warm" | "monochrome" | "multi";
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  yAxisMin?: number;
  yAxisMax?: number;
  accessibleDescription?: string;
  caption?: string;
  dataSource?: string;
}

// 🎨 Apple-inspired Accessible Color Palettes
const PALETTES: Record<string, string[]> = {
  blue: ["#0071e3", "#2997ff", "#64d2ff", "#0040dd", "#0a84ff"],
  teal: ["#00c7be", "#30b0c7", "#34c759", "#32d74b", "#28cd41"],
  warm: ["#ff9500", "#ff3b30", "#ff2d55", "#ff6482", "#ff9f0a"],
  monochrome: ["#636366", "#8e8e93", "#aeaeb2", "#c7c7cc", "#48484a"],
  multi: ["#0071e3", "#34c759", "#ff9500", "#af52de", "#ff2d55", "#5856d6"],
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    dataKey?: string;
    value?: number | string;
    color?: string;
  }>;
  label?: string | number;
  valuePrefix?: string;
  valueSuffix?: string;
}

// Declared outside render to avoid recreation during render
const CustomTooltip = ({
  active,
  payload,
  label,
  valuePrefix = "",
  valueSuffix = "",
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="apple-glass rounded-lg border border-border/80 p-2.5 shadow-lg text-xs min-w-[120px]">
        <p className="font-semibold text-foreground mb-1">{String(label ?? "")}</p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name || entry.dataKey}:
              </span>
              <span className="font-semibold text-foreground">
                {typeof entry.value === "number"
                  ? `${valuePrefix}${entry.value.toLocaleString()}${valueSuffix}`
                  : String(entry.value ?? "")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function ChartRenderer(props: ChartProps) {
  const {
    title,
    subtitle,
    chartType = "bar",
    dataSourceMode = "csv",
    csvData,
    dataRows,
    xAxisKey = "Category",
    xAxisLabel,
    yAxisLabel,
    series: customSeries,
    colorPalette = "blue",
    height = 340,
    showLegend = true,
    showTooltip = true,
    valuePrefix = "",
    valueSuffix = "",
    yAxisMin,
    yAxisMax,
    accessibleDescription,
    caption,
    dataSource,
  } = props;

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showTable, setShowTable] = useState(false);

  // 1. Parse and sanitize data (CSV vs Structured)
  const { data, keys, parseError } = useMemo<{
    data: Record<string, string | number>[];
    keys: string[];
    parseError: string | null;
  }>(() => {
    try {
      if (dataSourceMode === "structured" && Array.isArray(dataRows) && dataRows.length > 0) {
        const rows: Record<string, string | number>[] = dataRows.map((r) => ({
          Category: String(r.category || ""),
          Value: typeof r.value === "number" ? r.value : Number(r.value) || 0,
          ...(r.secondaryValue !== undefined
            ? { Secondary: typeof r.secondaryValue === "number" ? r.secondaryValue : Number(r.secondaryValue) || 0 }
            : {}),
        }));
        const valKeys = ["Value"];
        if (dataRows.some((r) => r.secondaryValue !== undefined)) {
          valKeys.push("Secondary");
        }
        return { data: rows, keys: valKeys, parseError: null };
      }

      // Parse CSV Data
      if (csvData && typeof csvData === "string") {
        const lines = csvData
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0);

        if (lines.length < 2) {
          return { data: [], keys: [], parseError: "CSV must include a header line and at least one data row." };
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
        const parsedRows: Record<string, string | number>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
          const rowObj: Record<string, string | number> = {};

          headers.forEach((hdr, idx) => {
            const rawVal = cells[idx] ?? "";
            const numVal = Number(rawVal);
            rowObj[hdr] = !isNaN(numVal) && rawVal !== "" ? numVal : rawVal;
          });

          parsedRows.push(rowObj);
        }

        // Numeric keys (excluding xAxisKey)
        const activeXKey = headers.find((h) => h.toLowerCase() === xAxisKey.toLowerCase()) || headers[0];
        const numericKeys = headers.filter((h) => h !== activeXKey);

        return { data: parsedRows, keys: numericKeys, parseError: null };
      }

      return { data: [], keys: [], parseError: "No chart data configured." };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to parse chart data.";
      return { data: [], keys: [], parseError: msg };
    }
  }, [dataSourceMode, dataRows, csvData, xAxisKey]);

  // Palette & Series Configuration
  const palette = PALETTES[colorPalette] || PALETTES.blue;
  const activeXAxisKey = useMemo(() => {
    if (data.length === 0) return "Category";
    const available = Object.keys(data[0]);
    return available.find((k) => k.toLowerCase() === xAxisKey.toLowerCase()) || available[0];
  }, [data, xAxisKey]);

  // Format Value Helper
  const formatValue = (val: unknown) => {
    if (typeof val === "number") {
      return `${valuePrefix}${val.toLocaleString()}${valueSuffix}`;
    }
    return String(val ?? "");
  };

  // Fallback for Parsing Errors
  if (parseError || data.length === 0) {
    return (
      <figure className="my-8 rounded-xl border border-border/60 bg-muted/20 p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
          <AlertCircle size={18} className="text-amber-500" />
          <h4 className="text-sm font-semibold text-foreground">{title || "Data Visualization"}</h4>
        </div>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          {parseError || "Chart data is currently being updated in Sanity Studio."}
        </p>
      </figure>
    );
  }

  // Common styling props
  const gridStroke = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  const axisColor = isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)";

  return (
    <figure
      role="region"
      aria-label={title}
      className="my-8 rounded-2xl border border-border/70 bg-card text-card-foreground p-4 sm:p-6 shadow-xs overflow-hidden transition-colors"
    >
      {/* 🏷️ Header: Title, Subtitle & Accessibility Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-5 pb-3 border-b border-border/40">
        <div>
          <h4 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Accessible Data Table Toggle Button */}
        <button
          type="button"
          onClick={() => setShowTable((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted border border-border/50 transition-colors self-start sm:self-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-expanded={showTable}
          aria-label={showTable ? "Hide accessible data table" : "View accessible data table"}
        >
          {showTable ? <EyeOff size={13} /> : <Table size={13} />}
          <span>{showTable ? "View Chart" : "Data Table"}</span>
        </button>
      </div>

      {/* Screen Reader Summary for WCAG 2.2 AA */}
      {accessibleDescription && (
        <p className="sr-only">{accessibleDescription}</p>
      )}

      {/* 📊 Interactive Visualization Render */}
      {!showTable ? (
        <div style={{ height: `${height}px`, width: "100%" }} className="w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "horizontal-bar" ? (
              <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridStroke} />
                <XAxis
                  type="number"
                  stroke={axisColor}
                  tick={{ fontSize: 11 }}
                  tickFormatter={formatValue}
                  domain={[yAxisMin ?? "auto", yAxisMax ?? "auto"]}
                  label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined}
                />
                <YAxis
                  type="category"
                  dataKey={activeXAxisKey}
                  stroke={axisColor}
                  tick={{ fontSize: 11 }}
                  width={90}
                />
                {showTooltip && (
                  <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />} />
                )}
                {showLegend && <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />}
                {keys.map((k, idx) => (
                  <Bar
                    key={k}
                    dataKey={k}
                    name={customSeries?.[idx]?.name || k}
                    fill={customSeries?.[idx]?.color || palette[idx % palette.length]}
                    radius={[0, 4, 4, 0]}
                  />
                ))}
              </BarChart>
            ) : chartType === "line" ? (
              <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey={activeXAxisKey} stroke={axisColor} tick={{ fontSize: 11 }} />
                <YAxis
                  stroke={axisColor}
                  tick={{ fontSize: 11 }}
                  tickFormatter={formatValue}
                  domain={[yAxisMin ?? "auto", yAxisMax ?? "auto"]}
                />
                {showTooltip && (
                  <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />} />
                )}
                {showLegend && <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />}
                {keys.map((k, idx) => (
                  <Line
                    key={k}
                    type="monotone"
                    dataKey={k}
                    name={customSeries?.[idx]?.name || k}
                    stroke={customSeries?.[idx]?.color || palette[idx % palette.length]}
                    strokeWidth={2.5}
                    dot={{ r: 3.5, strokeWidth: 1.5 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            ) : chartType === "area" ? (
              <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <defs>
                  {keys.map((k, idx) => {
                    const color = customSeries?.[idx]?.color || palette[idx % palette.length];
                    return (
                      <linearGradient key={`grad-${k}`} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey={activeXAxisKey} stroke={axisColor} tick={{ fontSize: 11 }} />
                <YAxis
                  stroke={axisColor}
                  tick={{ fontSize: 11 }}
                  tickFormatter={formatValue}
                  domain={[yAxisMin ?? "auto", yAxisMax ?? "auto"]}
                />
                {showTooltip && (
                  <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />} />
                )}
                {showLegend && <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />}
                {keys.map((k, idx) => {
                  const color = customSeries?.[idx]?.color || palette[idx % palette.length];
                  return (
                    <Area
                      key={k}
                      type="monotone"
                      dataKey={k}
                      name={customSeries?.[idx]?.name || k}
                      stroke={color}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#grad-${k})`}
                    />
                  );
                })}
              </AreaChart>
            ) : chartType === "pie" || chartType === "donut" ? (
              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                {showTooltip && (
                  <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />} />
                )}
                {showLegend && <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />}
                <Pie
                  data={data}
                  dataKey={keys[0] || "Value"}
                  nameKey={activeXAxisKey}
                  cx="50%"
                  cy="50%"
                  innerRadius={chartType === "donut" ? "55%" : 0}
                  outerRadius="80%"
                  paddingAngle={chartType === "donut" ? 3 : 1}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={palette[index % palette.length]}
                      stroke={isDark ? "#1c1c1e" : "#ffffff"}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            ) : chartType === "scatter" ? (
              <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis
                  dataKey={activeXAxisKey}
                  name={activeXAxisKey}
                  stroke={axisColor}
                  tick={{ fontSize: 11 }}
                  label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined}
                />
                <YAxis
                  dataKey={keys[0]}
                  name={keys[0]}
                  stroke={axisColor}
                  tick={{ fontSize: 11 }}
                  tickFormatter={formatValue}
                  label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
                />
                {showTooltip && (
                  <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />} />
                )}
                {showLegend && <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />}
                <Scatter
                  name={title}
                  data={data}
                  fill={palette[0]}
                />
              </ScatterChart>
            ) : (
              /* Default: Vertical Bar Chart */
              <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis
                  dataKey={activeXAxisKey}
                  stroke={axisColor}
                  tick={{ fontSize: 11 }}
                  label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined}
                />
                <YAxis
                  stroke={axisColor}
                  tick={{ fontSize: 11 }}
                  tickFormatter={formatValue}
                  domain={[yAxisMin ?? "auto", yAxisMax ?? "auto"]}
                  label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
                />
                {showTooltip && (
                  <Tooltip content={<CustomTooltip valuePrefix={valuePrefix} valueSuffix={valueSuffix} />} />
                )}
                {showLegend && <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />}
                {keys.map((k, idx) => (
                  <Bar
                    key={k}
                    dataKey={k}
                    name={customSeries?.[idx]?.name || k}
                    fill={customSeries?.[idx]?.color || palette[idx % palette.length]}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        /* ♿ Accessible Fallback Data Table (WCAG 2.2 AA) */
        <div className="overflow-x-auto my-3 border border-border/50 rounded-lg">
          <table className="w-full text-xs text-left">
            <thead className="bg-secondary text-secondary-foreground uppercase tracking-wider font-semibold border-b border-border/50">
              <tr>
                <th scope="col" className="px-3.5 py-2.5">
                  {activeXAxisKey}
                </th>
                {keys.map((k) => (
                  <th key={k} scope="col" className="px-3.5 py-2.5">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3.5 py-2 font-medium text-foreground">
                    {String(row[activeXAxisKey] ?? "")}
                  </td>
                  {keys.map((k) => (
                    <td key={k} className="px-3.5 py-2 text-muted-foreground">
                      {formatValue(row[k])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📄 Caption & Data Source */}
      {(caption || dataSource) && (
        <figcaption className="mt-3 pt-2.5 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-muted-foreground">
          {caption && <span className="italic">{caption}</span>}
          {dataSource && (
            <span className="font-mono text-[10px] text-muted-foreground/80">
              Source: {dataSource}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
