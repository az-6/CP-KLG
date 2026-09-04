import groq from 'groq';
import { sanityFixtures } from '../../data/sanity-fixtures';
import type { ProductCategoryDocument, ProductDocument } from '../../types/sanity';
import { sanityClient } from './client';
import { isSanityFixtureMode } from './config';

export interface ProductCatalog {
  categories: ProductCategoryDocument[];
  products: ProductDocument[];
}

export const PRODUCT_CATALOG_QUERY = groq`{
  "categories": *[_type == "productCategory" && isActive == true] | order(order asc, name asc){
    _id,
    name,
    "slug": slug.current,
    description,
    order,
    isActive
  },
  "products": *[
    _type == "product" &&
    isActive == true &&
    defined(slug.current)
  ] | order(order asc, name asc){
    _id,
    name,
    "slug": slug.current,
    "categoryId": category->_id,
    "categoryName": category->name,
    "categorySlug": category->slug.current,
    scientificName,
    excerpt,
    description,
    images,
    sizes,
    forms,
    condition,
    packaging,
    volume,
    availabilityStatus,
    order,
    isActive,
    seo
  }
}`;

const byOrderThenName = <T extends { order: number; name: string }>(left: T, right: T) =>
  left.order - right.order || left.name.localeCompare(right.name, 'id');

export function normalizeCatalog(
  categories: ProductCategoryDocument[],
  products: ProductDocument[],
): ProductCatalog {
  const activeCategories = new Map(
    categories.filter((category) => category.isActive).map((category) => [category._id, category]),
  );

  const visibleProducts = products
    .filter((product) => product.isActive && activeCategories.has(product.categoryId))
    .map((product) => {
      const category = activeCategories.get(product.categoryId)!;
      return {
        ...product,
        categoryName: category.name,
        categorySlug: category.slug,
      };
    })
    .sort(byOrderThenName);

  const usedCategoryIds = new Set(visibleProducts.map((product) => product.categoryId));
  const visibleCategories = [...activeCategories.values()]
    .filter((category) => usedCategoryIds.has(category._id))
    .sort(byOrderThenName);

  return { categories: visibleCategories, products: visibleProducts };
}

export async function getProductCatalog(): Promise<ProductCatalog> {
  const catalog = isSanityFixtureMode(import.meta.env, process.env)
    ? { categories: sanityFixtures.categories, products: sanityFixtures.products }
    : await sanityClient.fetch<ProductCatalog>(PRODUCT_CATALOG_QUERY);

  return normalizeCatalog(catalog.categories, catalog.products);
}

export async function getActiveProducts(): Promise<ProductDocument[]> {
  return (await getProductCatalog()).products;
}
