'use client'

/**
 * Sanity Studio Configuration
 * Used by the Studio mounted on `/app/studio/[[...tool]]/page.tsx`
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {table} from '@sanity/table'

import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
  name: "KS_Porfolio_Blog",
  title: "KS Portfolio & Blog",
  basePath: '/studio',
  projectId,
  dataset,

  // 🧩 All document and object schemas
  schema,

  // 🧰 Sanity Studio Plugins
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
    codeInput(), // 💻 Enables `type: 'code'` fields
    table(),     // 📊 Enables `type: 'table'` fields
  ],
})
