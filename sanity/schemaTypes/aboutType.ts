import { defineType, defineField, defineArrayMember } from 'sanity'
import { UserIcon, ImageIcon } from '@sanity/icons'

export const aboutType = defineType({
  name: 'about',
  title: 'About / What I Do',
  type: 'document',
  icon: UserIcon,

  fields: [
    defineField({
      name: 'items',
      title: 'About Cards',
      type: 'array',
      description: 'Add each area of expertise with mini logo/icon, title, and description.',
      of: [
        defineArrayMember({
          type: 'object',
          icon: ImageIcon,
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
              description: 'E.g., “Business Analytics & Data Visualization”',
            },
            {
              name: 'icon',
              title: 'Mini Logo / Preset Icon',
              type: 'string',
              description: 'Choose a portfolio mini logo matching the Apple-inspired design system.',
              options: {
                list: [
                  { title: '📊 Bar Chart (Business Analytics & BI)', value: 'bar-chart' },
                  { title: '📈 Line Chart (Trends & Time Series)', value: 'line-chart' },
                  { title: '🥧 Pie Chart (Proportions & Segments)', value: 'pie-chart' },
                  { title: '🧠 Brain (Machine Learning & AI)', value: 'brain' },
                  { title: '⚡ CPU (Neural Networks & Computing)', value: 'cpu' },
                  { title: '🤖 Bot (Automation & AI Agents)', value: 'bot' },
                  { title: '✨ Sparkles (Generative AI & LLMs)', value: 'sparkles' },
                  { title: '📋 Clipboard Check (Survey Programming & Research)', value: 'clipboard-check' },
                  { title: '📝 File Text (Questionnaires & Reporting)', value: 'file-text' },
                  { title: '🗄️ Database (SQL, Warehouses & ETL)', value: 'database' },
                  { title: '💻 Code (Python, R & Scripting)', value: 'code' },
                  { title: '⌨️ Terminal (Data Engineering & Automation)', value: 'terminal' },
                  { title: '🌐 Globe (Web Development & Deployment)', value: 'globe' },
                  { title: '☁️ Cloud (Cloud Infrastructure & Hosting)', value: 'cloud' },
                  { title: '🖥️ Server (Backend APIs & Microservices)', value: 'server' },
                  { title: '🔍 Search (Data Mining & Insights)', value: 'search' },
                  { title: '💓 Activity (Real-time Analytics & KPIs)', value: 'activity' },
                  { title: '🥞 Layers (Full-Stack Architecture)', value: 'layers' },
                  { title: '🛡️ Shield Check (Data Governance & Security)', value: 'shield-check' },
                  { title: '🔄 Workflow (Pipelines & CI/CD)', value: 'workflow' },
                  { title: '🎯 Target (Research Analytics & Precision)', value: 'target' },
                  { title: '📑 Dashboard (Executive BI & Dashboards)', value: 'layout-dashboard' },
                ],
                layout: 'dropdown',
              },
              initialValue: 'bar-chart',
            },
            {
              name: 'customIcon',
              title: 'Custom Icon / Mini Logo (Optional)',
              type: 'image',
              description: 'Upload a custom SVG or PNG icon to override the preset icon.',
              options: { hotspot: false },
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
              description: 'Concise summary of this expertise area.',
            },
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
              media: 'customIcon',
              iconName: 'icon',
            },
            prepare({ title, subtitle, media, iconName }) {
              return {
                title: title || 'Untitled Card',
                subtitle: iconName ? `[${iconName}] ${subtitle || ''}` : subtitle || '',
                media,
              }
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'About Section',
        subtitle: 'Contains service/expertise cards with mini logo options',
      }
    },
  },
})
