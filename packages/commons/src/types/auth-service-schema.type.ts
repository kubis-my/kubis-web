
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Credential {
    publicId: string;
    email: string;
    username?: Nullable<string>;
    isEnable2FA: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface IQuery {
    getCredential(publicId: string): Nullable<Credential> | Promise<Nullable<Credential>>;
}

export type DateTime = any;
type Nullable<T> = T | null;
