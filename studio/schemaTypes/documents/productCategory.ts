import { defineField, defineType } from 'sanity';

export const productCategory = defineType({
  name: 'productCategory',
  title: 'Kategori Produk',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nama kategori', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 80 }, validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Deskripsi', type: 'text', rows: 3 }),
    defineField({ name: 'order', title: 'Urutan', type: 'number', initialValue: 0, validation: (rule) => rule.required().integer().min(0) }),
    defineField({ name: 'isActive', title: 'Tampilkan di website', type: 'boolean', initialValue: true, validation: (rule) => rule.required() }),
  ],
});
