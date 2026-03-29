/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum ProductType {
    SIMPLE = 'SIMPLE',
    VARIANT = 'VARIANT',
    DIGITAL = 'DIGITAL',
    SERVICE = 'SERVICE',
    BUNDLE = 'BUNDLE',
    CUSTOM = 'CUSTOM',
}

export enum ProductStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ARCHIVED = 'ARCHIVED',
}

export enum BundleProductionMode {
    WHOLE = 'WHOLE',
    INDEPENDENT = 'INDEPENDENT',
}

export interface ProductPaginationInput {
    cursor?: Nullable<number>;
    take: number;
    categoryPublicId?: Nullable<string>;
    type?: Nullable<ProductType>;
    status?: Nullable<ProductStatus>;
}

export interface SimpleProductInput {
    name: string;
    description?: Nullable<string>;
    categoryName: string;
    status: ProductStatus;
    sku: string;
    price: number;
}

export interface VariantProductInput {
    name: string;
    description?: Nullable<string>;
    categoryName: string;
    status: ProductStatus;
    variantAttributes: VariantAttributeInput[];
    productVariants: ProductVariantInput[];
}

export interface VariantAttributeInput {
    name: string;
    values: string[];
}

export interface ProductVariantInput {
    sku: string;
    price: number;
    attributeValues: string[];
}

export interface DigitalProductInput {
    name: string;
    description?: Nullable<string>;
    categoryName: string;
    status: ProductStatus;
    sku: string;
    price: number;
}

export interface ServiceProductInput {
    name: string;
    description?: Nullable<string>;
    categoryName: string;
    status: ProductStatus;
    sku: string;
    price: number;
}

export interface BundleProductInput {
    name: string;
    description?: Nullable<string>;
    categoryName: string;
    status: ProductStatus;
    sku: string;
    price: number;
    bundleProductionMode: BundleProductionMode;
    bundleItems: BundleItemInput[];
}

export interface BundleItemInput {
    productPublicId: string;
    qty: number;
}

export interface CustomProductInput {
    name: string;
    description?: Nullable<string>;
    categoryName: string;
    status: ProductStatus;
    estimatedPrice: number;
}

export interface UpdateSimpleProductInput {
    productPublicId: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
    categoryName?: Nullable<string>;
    status?: Nullable<ProductStatus>;
    sku?: Nullable<string>;
    price?: Nullable<number>;
}

export interface UpdateDigitalProductInput {
    productPublicId: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
    categoryName?: Nullable<string>;
    status?: Nullable<ProductStatus>;
    sku?: Nullable<string>;
    price?: Nullable<number>;
}

export interface UpdateServiceProductInput {
    productPublicId: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
    categoryName?: Nullable<string>;
    status?: Nullable<ProductStatus>;
    sku?: Nullable<string>;
    price?: Nullable<number>;
}

export interface UpdateCustomProductInput {
    productPublicId: string;
    name?: Nullable<string>;
    description?: Nullable<string>;
    categoryName?: Nullable<string>;
    status?: Nullable<ProductStatus>;
    estimatedPrice?: Nullable<number>;
}

export interface UpdateVariantProductInput {
    name: string;
    description?: Nullable<string>;
    categoryName: string;
    status: ProductStatus;
    publicId: string;
    variantAttributes: UpsertVariantAttributeInput[];
    productVariants: UpsertProductVariantInput[];
}

export interface UpsertVariantAttributeInput {
    publicId?: Nullable<string>;
    name: string;
    values: string[];
}

export interface UpsertProductVariantInput {
    publicId?: Nullable<string>;
    sku: string;
    price: number;
    attributeValues: string[];
}

export interface PageInfo {
    endCursor?: Nullable<number>;
    hasNextPage: boolean;
    total: number;
    currentPage: number;
    totalPages: number;
}

export interface Category {
    publicId: string;
    companyPublicId: string;
    name: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface VariantAttributeValue {
    publicId: string;
    value: string;
}

export interface VariantAttribute {
    publicId: string;
    name: string;
    values: VariantAttributeValue[];
    createdAt: DateTime;
    updatedAt: DateTime;
    deletedAt?: Nullable<DateTime>;
}

export interface ProductVariant {
    publicId: string;
    companyPublicId: string;
    sku: string;
    price?: Nullable<number>;
    attributeValues: VariantAttributeValue[];
    createdAt: DateTime;
    updatedAt: DateTime;
    deletedAt?: Nullable<DateTime>;
}

export interface BundleItem {
    publicId: string;
    qty: number;
    product: Product;
}

export interface Product {
    publicId: string;
    companyPublicId: string;
    name: string;
    description?: Nullable<string>;
    type: ProductType;
    status: ProductStatus;
    sku?: Nullable<string>;
    price?: Nullable<number>;
    estimatedPrice?: Nullable<number>;
    bundleProductionMode?: Nullable<BundleProductionMode>;
    archivedAt?: Nullable<DateTime>;
    createdAt: DateTime;
    updatedAt: DateTime;
    category: Category;
    attributes?: Nullable<VariantAttribute[]>;
    variants?: Nullable<ProductVariant[]>;
    bundleItems?: Nullable<BundleItem[]>;
}

export interface PaginatedProduct {
    data: Product[];
    pageInfo: PageInfo;
}

export interface IQuery {
    getCompanyCategories(companyPublicId: string): Category[] | Promise<Category[]>;
    getCompanyProducts(
        companyPublicId: string,
        pagination: ProductPaginationInput,
    ): PaginatedProduct | Promise<PaginatedProduct>;
}

export interface IMutation {
    createSimpleProductForOps(
        companyPublicId: string,
        input: SimpleProductInput,
    ): Product | Promise<Product>;
    createVariantProductForOps(
        companyPublicId: string,
        input: VariantProductInput,
    ): Product | Promise<Product>;
    createDigitalProductForOps(
        companyPublicId: string,
        input: DigitalProductInput,
    ): Product | Promise<Product>;
    createServiceProductForOps(
        companyPublicId: string,
        input: ServiceProductInput,
    ): Product | Promise<Product>;
    createBundleProductForOps(
        companyPublicId: string,
        input: BundleProductInput,
    ): Product | Promise<Product>;
    createCustomProductForOps(
        companyPublicId: string,
        input: CustomProductInput,
    ): Product | Promise<Product>;
    updateSimpleProductForOps(
        companyPublicId: string,
        input: UpdateSimpleProductInput,
    ): Product | Promise<Product>;
    updateDigitalProductForOps(
        companyPublicId: string,
        input: UpdateDigitalProductInput,
    ): Product | Promise<Product>;
    updateServiceProductForOps(
        companyPublicId: string,
        input: UpdateServiceProductInput,
    ): Product | Promise<Product>;
    updateCustomProductForOps(
        companyPublicId: string,
        input: UpdateCustomProductInput,
    ): Product | Promise<Product>;
    updateVariantProductForOps(
        companyPublicId: string,
        input: UpdateVariantProductInput,
    ): Product | Promise<Product>;
}

export type DateTime = any;
type Nullable<T> = T | null;
