import { defineArrayMember, defineType } from 'sanity';

export const portableContent = defineType({
  name: 'portableContent',
  title: 'Isi',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Subjudul', value: 'h2' },
        { title: 'Sub-subjudul', value: 'h3' },
      ],
    }),
    defineArrayMember({ type: 'imageWithAlt' }),
  ],
  validation: (r) => r.required().min(1),
});
