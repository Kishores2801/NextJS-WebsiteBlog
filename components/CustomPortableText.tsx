'use client'

import React, { useEffect, useState } from 'react'
import { PortableText, PortableTextComponents, PortableTextMarkComponentProps } from '@portabletext/react'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { useTheme } from 'next-themes'
import katex from 'katex'
import 'katex/dist/katex.min.css'

const CustomPortableText = ({ value }: { value: any }) => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const components: PortableTextComponents = {
    types: {
      image: ({ value }: { value: any }) => {
        if (!value?.asset?._ref) {
          return null
        }
        return (
          <figure className="my-10 text-center w-full group">
            <div className="overflow-hidden rounded-2xl shadow-xl transition-transform duration-500 hover:scale-[1.01]">
              <Image
                src={urlFor(value).width(2400).fit('max').auto('format').url()}
                alt={value.alt || 'Image'}
                width={1200}
                height={700}
                className="object-cover w-full h-auto max-h-[80vh]"
              />
            </div>
            {value.caption && (
              <figcaption className="text-sm text-[var(--muted-foreground)] mt-3 italic tracking-wide">
                {value.caption}
              </figcaption>
            )}
          </figure>
        )
      },

      codeBlock: ({ value }: { value: any }) => (
        <div className="my-10 rounded-xl overflow-hidden shadow-2xl border border-[var(--border)] bg-[#282c34]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#21252b] border-b border-white/10">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {value.filename && (
              <span className="text-xs text-gray-400 font-mono opacity-80">
                {value.filename}
              </span>
            )}
          </div>
          <SyntaxHighlighter
            language={value.language || 'javascript'}
            style={atomOneDark}
            showLineNumbers
            wrapLongLines
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              background: 'transparent',
              fontSize: '0.9rem',
              lineHeight: '1.6',
            }}
          >
            {value.code || ''}
          </SyntaxHighlighter>
        </div>
      ),

      callout: ({ value }: { value: any }) => {
        const toneStyles: Record<string, string> = {
          info: 'bg-blue-500/5 border-blue-500/30 text-blue-700 dark:text-blue-300',
          warning: 'bg-amber-500/5 border-amber-500/30 text-amber-700 dark:text-amber-300',
          success: 'bg-emerald-500/5 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
          error: 'bg-rose-500/5 border-rose-500/30 text-rose-700 dark:text-rose-300',
        }
        const toneIcon: Record<string, string> = {
          info: 'ℹ️',
          warning: '⚠️',
          success: '✅',
          error: '🚫',
        }
        
        return (
          <div
            className={`my-8 p-5 border rounded-xl flex gap-4 ${
              toneStyles[value.tone] || toneStyles.info
            }`}
          >
             <span className="text-xl select-none">{toneIcon[value.tone] || 'ℹ️'}</span>
             <div className="leading-relaxed">{value.body}</div>
          </div>
        )
      },

      videoEmbed: ({ value }: { value: any }) => (
        <div className="my-10">
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-[var(--border)]">
            <iframe
              src={value.url}
              title={value.caption || 'Video Embed'}
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          {value.caption && (
            <p className="text-sm text-[var(--muted-foreground)] text-center mt-3 italic tracking-wide">
              {value.caption}
            </p>
          )}
        </div>
      ),

      table: ({ value }: { value: any }) => (
        <div className="my-10 overflow-hidden rounded-xl border border-[var(--border)] shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-[var(--foreground)]">
              <thead className="bg-[var(--muted)]/50 text-[var(--foreground)]/90 font-semibold border-b border-[var(--border)]">
                {value.rows?.length > 0 && (
                  <tr>
                    {value.rows[0]?.cells?.map((cell: string, j: number) => (
                      <th
                        key={j}
                        className="p-4 text-left first:pl-6 last:pr-6"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {value.rows?.slice(1).map((row: any, i: number) => (
                  <tr
                    key={i}
                    className="hover:bg-[var(--muted)]/30 transition-colors"
                  >
                    {row?.cells?.map((cell: string, j: number) => (
                      <td key={j} className="p-4 first:pl-6 last:pr-6">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ),

      latex: ({ value }: { value: any }) => {
        const formula = value.formula?.trim() || ''
        const cleanedFormula = formula.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/^\s*\${1,2}\s*|\s*\${1,2}\s*$/g, '')
        
        let html = ''
        try {
          html = katex.renderToString(cleanedFormula, {
            displayMode: true,
            throwOnError: false,
          })
        } catch (error) {
          console.error('KaTeX error:', error)
          html = `<span class="text-red-500">Error rendering formula</span>`
        }

        return (
          <div className="my-8 py-4 px-2 overflow-x-auto text-center">
            <div dangerouslySetInnerHTML={{ __html: html }} />
            {value.caption && (
              <p className="text-sm text-[var(--muted-foreground)] mt-3 italic">
                {value.caption}
              </p>
            )}
          </div>
        )
      },

      latexInline: ({ value }: { value: any }) => {
        const formula = value.formula?.trim() || ''
        const cleanedFormula = formula.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/^\s*\${1,2}\s*|\s*\${1,2}\s*$/g, '')
        
        let html = ''
        try {
          html = katex.renderToString(cleanedFormula, {
            displayMode: false,
            throwOnError: false,
          })
        } catch (error) {
          console.error('KaTeX error:', error)
          html = `<span class="text-red-500">Error</span>`
        }

        return (
          <span 
            className="inline-block align-baseline px-1 leading-none"
            dangerouslySetInnerHTML={{ __html: html }} 
          />
        )
      },
    },

    block: {
      h1: ({ children, value }: { children?: React.ReactNode; value?: any }) => (
        <h1
          id={value?._key}
          className="scroll-mt-28 text-4xl md:text-5xl font-extrabold mt-12 mb-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent tracking-tight"
        >
          {children}
        </h1>
      ),
      h2: ({ children, value }: { children?: React.ReactNode; value?: any }) => (
        <h2
          id={value?._key}
          className="scroll-mt-28 text-3xl md:text-4xl font-bold mt-10 mb-5 text-[var(--foreground)] tracking-tight border-b border-[var(--border)] pb-2"
        >
          {children}
        </h2>
      ),
      h3: ({ children, value }: { children?: React.ReactNode; value?: any }) => (
        <h3
          id={value?._key}
          className="scroll-mt-28 text-2xl md:text-3xl font-semibold mt-8 mb-4 text-[var(--foreground)]"
        >
          {children}
        </h3>
      ),
      h4: ({ children, value }: { children?: React.ReactNode; value?: any }) => (
        <h4
          id={value?._key}
          className="scroll-mt-28 text-xl md:text-2xl font-medium mt-6 mb-3 text-[var(--foreground)]"
        >
          {children}
        </h4>
      ),
      normal: ({ children }: { children?: React.ReactNode }) => (
        <p className="text-base md:text-lg leading-relaxed mb-6 text-[var(--foreground)]/90">{children}</p>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-4 border-[var(--color-primary)] bg-[var(--muted)]/30 py-4 px-6 rounded-r-lg italic text-[var(--muted-foreground)] my-8">
          {children}
        </blockquote>
      ),
    },

    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-bold text-[var(--foreground)]">{children}</strong>
      ),
      em: ({ children }: { children?: React.ReactNode }) => (
        <em className="italic text-[var(--muted-foreground)]">{children}</em>
      ),
      underline: ({ children }: { children?: React.ReactNode }) => (
        <span className="underline decoration-[var(--color-accent)] decoration-2 underline-offset-2">{children}</span>
      ),
      code: ({ children }: { children?: React.ReactNode }) => (
        <code className="bg-[var(--muted)] text-[var(--color-primary)] px-1.5 py-0.5 rounded-md text-sm font-mono border border-[var(--border)]">
          {children}
        </code>
      ),
      highlight: ({ children }: { children?: React.ReactNode }) => (
        <mark className="bg-yellow-300/40 dark:bg-yellow-500/20 text-[var(--foreground)] px-1 rounded-md">
          {children}
        </mark>
      ),
      link: ({ value, children }: PortableTextMarkComponentProps<any>) => {
        const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
        return (
          <a
            href={value?.href}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className="text-[var(--color-primary)] font-medium hover:text-[var(--color-accent)] underline decoration-transparent hover:decoration-[var(--color-accent)] transition-all duration-300"
          >
            {children}
          </a>
        )
      },
    },
  }

  return (
    <div className="prose prose-invert max-w-none text-[var(--foreground)] transition-colors duration-300">
      <PortableText value={value} components={components} />
    </div>
  )
}

export default CustomPortableText