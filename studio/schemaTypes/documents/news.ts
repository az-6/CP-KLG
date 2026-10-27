import { defineField, defineType } from 'sanity';
import { englishGroup } from '../objects/english';
import { englishContentField } from '../objects/portableContent';

export const news = defineType({
  name: 'news',
  title: 'Berita',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Judul', type: 'string', validation: (rule) => rule.required().min(5) }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: 'publishedAt', title: 'Tanggal terbit', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (rule) => rule.required() }),
    defineField({ name: 'excerpt', title: 'Ringkasan', type: 'text', rows: 3, validation: (rule) => rule.required().min(40).max(240) }),
    defineField({ name: 'coverImage', title: 'Gambar sampul', type: 'imageWithAlt', validation: (rule) => rule.required() }),
    defineField({ name: 'body', title: 'Isi berita', type: 'portableContent', validation: (rule) => rule.required() }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
    defineField({ name: 'isActive', title: 'Tampilkan di website', type: 'boolean', initialValue: true, validation: (rule) => rule.required() }),
    englishGroup([
      defineField({ name: 'title', title: 'Title', type: 'string' }),
      defineField({ name: 'excerpt', title: 'Summary', type: 'text', rows: 3, validation: (rule) => rule.max(240) }),
      englishContentField('body', 'Article body'),
      defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
    ]),
  ],
});
