
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum CredentialDeviceStatus {
    CURRENT = "CURRENT",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export interface CredentialDevicePaginationInput {
    cursor?: Nullable<number>;
    take: number;
}

export interface RevokeAccessInput {
    accessTokenPublicId: string;
}

export interface PageInfo {
    endCursor?: Nullable<number>;
    hasNextPage: boolean;
    total: number;
    currentPage: number;
    totalPages: number;
}

export interface Credential {
    publicId: string;
    email: string;
    username?: Nullable<string>;
    isEnable2FA: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface CredentialDevice {
    publicId: string;
    os: string;
    browser: string;
    deviceType: string;
    deviceLabel: string;
    ipAddress: string;
    city?: Nullable<string>;
    country?: Nullable<string>;
    lastSeenAt: DateTime;
    status: CredentialDeviceStatus;
    createdAt: DateTime;
}

export interface CredentialDeviceOverview {
    currentDevice?: Nullable<CredentialDevice>;
    totalDevices: number;
    activeInLast24h: number;
    deviceTypeCount: number;
    isEnable2FA: boolean;
}

export interface PaginatedCredentialDevice {
    data: CredentialDevice[];
    pageInfo: PageInfo;
    overview: CredentialDeviceOverview;
}

export interface IQuery {
    getCredential(publicId: string): Nullable<Credential> | Promise<Nullable<Credential>>;
    getCredentialDevices(pagination: CredentialDevicePaginationInput): PaginatedCredentialDevice | Promise<PaginatedCredentialDevice>;
}

export interface IMutation {
    signOutAllOtherDevices(): CredentialDevice[] | Promise<CredentialDevice[]>;
    revokeAccess(input: RevokeAccessInput): CredentialDevice | Promise<CredentialDevice>;
}

export type DateTime = any;
type Nullable<T> = T | null;
