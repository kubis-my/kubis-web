/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface AuditLogPaginationInput {
    cursor?: Nullable<number>;
    take: number;
    credentialId?: Nullable<string>;
    userId?: Nullable<string>;
    companyId?: Nullable<string>;
    branchId?: Nullable<string>;
}

export interface PageInfo {
    endCursor?: Nullable<number>;
    hasNextPage: boolean;
    total: number;
    currentPage: number;
    totalPages: number;
}

export interface User {
    publicId: string;
}

export interface Company {
    publicId: string;
    auditLogs?: PaginatedAuditLog;
}

export interface Branch {
    publicId: string;
    auditLogs?: PaginatedAuditLog;
}

export interface AuditLogAuthor {
    publicId: string;
    credentialId: string;
    userId?: Nullable<string>;
    companyId?: Nullable<string>;
    branchId?: Nullable<string>;
    user?: Nullable<User>;
    company?: Nullable<Company>;
    branch?: Nullable<Branch>;
}

export interface AuditLogResource {
    publicId: string;
    type: string;
    svc: string;
    parentId?: Nullable<string>;
}

export interface AuditLogMetaDataEntry {
    key: string;
    type: string;
    value: string;
}

export interface AuditLogMetaData {
    publicId: string;
    before?: Nullable<AuditLogMetaDataEntry[]>;
    after?: Nullable<AuditLogMetaDataEntry[]>;
    additional?: Nullable<JSON>;
}

export interface AuditLog {
    publicId: string;
    emittedAt: DateTime;
    type: string;
    description: string;
    createdAt: DateTime;
    auditLogAuthor?: Nullable<AuditLogAuthor>;
    auditLogResource?: Nullable<AuditLogResource>;
    auditLogMetaData?: Nullable<AuditLogMetaData>;
}

export interface AuditLogOverview {
    totalAction: number;
    totalWeekAction: number;
    lastActivity?: Nullable<string>;
}

export interface PaginatedAuditLog {
    data: AuditLog[];
    pageInfo: PageInfo;
    overview: AuditLogOverview;
}

export interface IQuery {
    getAuditLogs(
        pagination: AuditLogPaginationInput,
    ): PaginatedAuditLog | Promise<PaginatedAuditLog>;
}

export type JSON = any;
export type DateTime = any;
type Nullable<T> = T | null;
