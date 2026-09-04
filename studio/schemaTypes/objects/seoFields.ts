import { defineField, defineType } from 'sanity';

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.max(60).warning('Usahakan maksimal 60 karakter'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (r) => r.max(160).warning('Usahakan maksimal 160 karakter'),
    }),
    defineField({ name: 'socialImage', type: 'imageWithAlt' }),
  ],
});
