import type { StructureResolver } from 'sanity/structure'
import { EyeOpenIcon } from '@sanity/icons'
import {Iframe} from 'sanity-plugin-iframe-pane'  // ✅ default export, not destructured

/**
 * Custom Desk Structure for Blog
 * Adds a live Preview tab for each post
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Blog')
    .items([
      // 📰 Posts with Preview Tab
      S.listItem()
        .title('Posts')
        .icon(EyeOpenIcon)
        .child(
          S.documentTypeList('post')
            .title('Posts')
            .child((documentId) =>
              S.document()
                .schemaType('post')
                .documentId(documentId)
                .views([
                  // ✏️ Default editing form
                  S.view.form(),

                  // 👁️ Live Preview (no JSX, pure config)
                  S.view
                    .component(Iframe)
                    .options({
                      url: (doc: any) => {
                      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
                      const secret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET || 'my-secret'
                      const slug = doc?.slug?.current
                      return slug
                        ? `${baseUrl}/api/preview?secret=${secret}&slug=${slug}`
                        : `${baseUrl}/api/preview?secret=${secret}`
                    },

                      reload: { button: true },
                    })
                    .title('Preview')
                    .icon(EyeOpenIcon),
                ])
            )
        ),

      // 📂 Categories
      S.documentTypeListItem('category').title('Categories'),

      // ✍️ Authors
      S.documentTypeListItem('author').title('Authors'),

      // Divider + Remaining Schemas
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !['post', 'category', 'author'].includes(item.getId()!)
      ),
    ])
