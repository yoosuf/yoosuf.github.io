import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    subTitle: z.string().optional(),
    /** Search/OG title when the visible headline is too long to display well. */
    seoTitle: z.string().optional(),
    author: z.string().default('Yoosuf Mohamed'),
    date: z.coerce.date(),
    /** Set when an existing post is meaningfully revised. Drives dateModified. */
    updated: z.coerce.date().optional(),
    excerpt: z.string().optional().default(''),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    layout: z.string().optional(),
    permalink: z.string(),
    published: z.boolean().optional().default(true),
    description: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    ID: z.number().optional(),
  }),
})

const pages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    permalink: z.string(),
    date: z.coerce.date().optional(),
  }),
})

export const collections = { blog, pages }
