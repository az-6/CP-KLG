import { defineArrayMember, defineField, defineType } from 'sanity';

const stringListField = (name: 'sizes' | 'forms' | 'condition' | 'packaging', title: string) => defineField({
  name,
  title,
  type: 'array',
  of: [defineArrayMember({ type: 'string' })],
});

export const product = defineType({
  name: 'product',
  title: 'Produk',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nama produk', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: 'category', title: 'Kategori', type: 'reference', to: [{ type: 'productCategory' }], options: { filter: 'isActive == true' }, validation: (rule) => rule.required() }),
    defineField({ name: 'scientificName', title: 'Nama ilmiah', type: 'string' }),
    defineField({ name: 'excerpt', title: 'Ringkasan', type: 'text', rows: 3, validation: (rule) => rule.required().min(30).max(240) }),
    defineField({ name: 'description', title: 'Deskripsi lengkap', type: 'portableContent', validation: (rule) => rule.required() }),
    defineField({ name: 'images', title: 'Foto produk', type: 'array', of: [defineArrayMember({ type: 'imageWithAlt' })], validation: (rule) => rule.required().min(1) }),
    stringListField('sizes', 'Ukuran / grade'),
    stringListField('forms', 'Bentuk produk'),
    stringListField('condition', 'Kondisi'),
    stringListField('packaging', 'Pengemasan'),
    defineField({ name: 'volume', title: 'Volume', type: 'string' }),
    defineField({
      name: 'availabilityStatus',
      title: 'Status ketersediaan',
      type: 'string',
      options: { list: ['Tersedia berdasarkan konfirmasi', 'Musiman', 'Tidak ditampilkan'] },
      initialValue: 'Tersedia berdasarkan konfirmasi',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'order', title: 'Urutan', type: 'number', initialValue: 0, validation: (rule) => rule.required().integer().min(0) }),
    defineField({ name: 'isActive', title: 'Tampilkan di website', type: 'boolean', initialValue: true, validation: (rule) => rule.required() }),
    defineField({ name: 'seo', title: 'SEO', type: 'seoFields' }),
  ],
});
