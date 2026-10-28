import { defineType, defineField } from 'sanity'
import { BarChartIcon } from '@sanity/icons'

export const chartType = defineType({
  name: 'chart',
  title: 'Data Visualization Chart',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    // 🏷️ Chart Identification
    defineField({
      name: 'title',
      title: 'Chart Title',
      type: 'string',
      description: 'Clear, informative title for the visualization.',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Description (Optional)',
      type: 'string',
      description: 'Brief context or KPI takeaway.',
    }),
    defineField({
      name: 'chartType',
      title: 'Chart Type',
      type: 'string',
      description: 'Choose the visual representation appropriate for the data.',
      options: {
        list: [
          { title: '📊 Vertical Bar Chart', value: 'bar' },
          { title: '📏 Horizontal Bar Chart', value: 'horizontal-bar' },
          { title: '📈 Line Chart', value: 'line' },
          { title: '🏔️ Area Chart', value: 'area' },
          { title: '🥧 Pie Chart', value: 'pie' },
          { title: '🍩 Donut Chart', value: 'donut' },
          { title: '✨ Scatter Plot', value: 'scatter' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'bar',
      validation: (Rule) => Rule.required(),
    }),

    // 📋 Data Entry Mode
    defineField({
      name: 'dataSourceMode',
      title: 'Data Input Mode',
      type: 'string',
      description: 'Enter data by pasting CSV (fastest) or structured manual fields.',
      options: {
        list: [
          { title: 'CSV Text Input (Header row + rows)', value: 'csv' },
          { title: 'Structured Rows (Visual Table)', value: 'structured' },
        ],
        layout: 'radio',
      },
      initialValue: 'csv',
    }),

    // 📄 CSV Data Input
    defineField({
      name: 'csvData',
      title: 'CSV Data',
      type: 'text',
      rows: 6,
      description:
        'Paste CSV data. The first row must be column headers (e.g., Year,Revenue,Profit or Category,Count).',
      initialValue: 'Category,Value\nAlpha,45\nBeta,72\nGamma,58\nDelta,89\nEpsilon,64',
      hidden: ({ parent }) => parent?.dataSourceMode === 'structured',
    }),

    // 🧱 Structured Data Alternative
    defineField({
      name: 'dataRows',
      title: 'Structured Data Rows',
      type: 'array',
      description: 'Add individual data points manually.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'category', title: 'Category / X-Axis Label', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'value', title: 'Primary Value', type: 'number', validation: (Rule) => Rule.required() },
            { name: 'secondaryValue', title: 'Secondary Value (Optional)', type: 'number' },
          ],
          preview: {
            select: {
              category: 'category',
              value: 'value',
              secondaryValue: 'secondaryValue',
            },
            prepare({ category, value, secondaryValue }) {
              return {
                title: category || 'Untitled Data Point',
                subtitle: secondaryValue !== undefined ? `Value: ${value} | Secondary: ${secondaryValue}` : `Value: ${value}`,
              }
            },
          },
        },
      ],
      hidden: ({ parent }) => parent?.dataSourceMode !== 'structured',
    }),

    // 📐 Axis & Series Settings
    defineField({
      name: 'xAxisKey',
      title: 'Category / X-Axis Key Name',
      type: 'string',
      description: 'The CSV header or property name to use for categories on the X-axis (default: Category).',
      initialValue: 'Category',
    }),
    defineField({
      name: 'xAxisLabel',
      title: 'X-Axis Label (Optional)',
      type: 'string',
      description: 'Display label under the horizontal axis.',
    }),
    defineField({
      name: 'yAxisLabel',
      title: 'Y-Axis Label (Optional)',
      type: 'string',
      description: 'Display label alongside the vertical axis.',
    }),
    defineField({
      name: 'series',
      title: 'Custom Series Configuration (Optional)',
      type: 'array',
      description: 'Customize series names or colors. If left empty, series are inferred automatically from data.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'key', title: 'Data Key', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'name', title: 'Display Label', type: 'string' },
            { name: 'color', title: 'Hex Color (e.g. #0071e3)', type: 'string' },
          ],
          preview: {
            select: { key: 'key', name: 'name', color: 'color' },
            prepare({ key, name, color }) {
              return {
                title: name || key,
                subtitle: color ? `Color: ${color}` : 'Theme color',
              }
            },
          },
        },
      ],
    }),

    // 🎨 Presentation & Apple Styling
    defineField({
      name: 'colorPalette',
      title: 'Color Palette',
      type: 'string',
      description: 'Apple HIG-inspired accessible color palettes.',
      options: {
        list: [
          { title: '🔵 Apple System Blue', value: 'blue' },
          { title: '🟢 Emerald Teal', value: 'teal' },
          { title: '🟠 Warm Amber & Coral', value: 'warm' },
          { title: '⚪ Slate Monochrome', value: 'monochrome' },
          { title: '🌈 Multi-Color Categorical', value: 'multi' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'blue',
    }),
    defineField({
      name: 'height',
      title: 'Chart Height (Pixels)',
      type: 'number',
      description: 'Recommended height: 280px to 400px.',
      initialValue: 340,
      validation: (Rule) => Rule.min(200).max(600),
    }),
    defineField({
      name: 'showLegend',
      title: 'Show Legend',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showTooltip',
      title: 'Show Interactive Tooltip',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'valuePrefix',
      title: 'Value Prefix (e.g., $)',
      type: 'string',
    }),
    defineField({
      name: 'valueSuffix',
      title: 'Value Suffix (e.g., %, k, M)',
      type: 'string',
    }),
    defineField({
      name: 'yAxisMin',
      title: 'Y-Axis Minimum (Optional)',
      type: 'number',
    }),
    defineField({
      name: 'yAxisMax',
      title: 'Y-Axis Maximum (Optional)',
      type: 'number',
    }),

    // ♿ Documentation & Accessibility (WCAG 2.2 AA)
    defineField({
      name: 'accessibleDescription',
      title: 'Screen Reader Accessible Description (Required)',
      type: 'text',
      rows: 2,
      description: 'Describe the primary trend or conclusion for screen reader users and accessibility audits.',
      validation: (Rule) => Rule.required().min(10).warning('Please describe the key data takeaway for accessibility.'),
    }),
    defineField({
      name: 'caption',
      title: 'Chart Caption / Footnote',
      type: 'string',
      description: 'Explanatory footnote displayed below the chart.',
    }),
    defineField({
      name: 'dataSource',
      title: 'Data Source',
      type: 'string',
      description: 'E.g., "Q3 2026 Customer Retention Study, Sample size N=1,420".',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      chartType: 'chartType',
      caption: 'caption',
    },
    prepare({ title, chartType, caption }) {
      const typeIcons: Record<string, string> = {
        bar: '📊 Vertical Bar',
        'horizontal-bar': '📏 Horizontal Bar',
        line: '📈 Line Chart',
        area: '🏔️ Area Chart',
        pie: '🥧 Pie Chart',
        donut: '🍩 Donut Chart',
        scatter: '✨ Scatter Plot',
      }
      return {
        title: title || 'Data Visualization Chart',
        subtitle: `${typeIcons[chartType] || chartType || 'Chart'} • ${caption || 'Configured via CMS'}`,
        media: BarChartIcon,
      }
    },
  },
})
