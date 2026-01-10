
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum DayOfWeek {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY"
}

export enum UserAccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING_INVITATION = "PENDING_INVITATION",
  EXPIRED_INVITATION = "EXPIRED_INVITATION"
}

export interface UserAccountPaginationInput {
  cursor?: Nullable<number>;
  take: number;
  branchPublicId?: Nullable<string>;
}

export interface CompanyEmployeePaginationInput {
  cursor?: Nullable<number>;
  take: number;
}

export interface BranchPaginationInput {
  cursor?: Nullable<number>;
  take: number;
}

export interface BranchEventPaginationInput {
  cursor?: Nullable<number>;
  take: number;
  branchPublicId?: Nullable<string>;
}

export interface CompanyPaginationInput {
  cursor?: Nullable<number>;
  take: number;
}

export interface CompleteProfileInput {
  firstName: string;
  lastName: string;
  nickname: string;
}

export interface PageInfo {
  endCursor?: Nullable<number>;
  hasNextPage: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface CompanyPhysicalAddress {
  publicId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneCode: string;
  phoneNumber: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  company: Company;
}

export interface CompanyBillingAddress {
  publicId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneCode: string;
  phoneNumber: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  company: Company;
}

export interface Company {
  publicId: string;
  name: string;
  registrationNo: string;
  isUnclassified: boolean;
  isActive: boolean;
  logo?: Nullable<string>;
  createdAt: DateTime;
  updatedAt: DateTime;
  totalActiveEmployee: number;
  totalActiveBranch: number;
  user: User;
  userAccounts?: PaginatedUserAccount;
  companyEmployees?: PaginatedCompanyEmployee;
  companyPhysicalAddresses?: Nullable<CompanyPhysicalAddress>;
  companyBillingAddress?: Nullable<CompanyBillingAddress>;
  branches?: PaginatedBranch;
}

export interface CompanyEmployee {
  publicId: string;
  internalId: number;
  position: string;
  phoneCode?: Nullable<string>;
  phoneNumber?: Nullable<string>;
  dateOfBirth?: Nullable<DateTime>;
  user: User;
  company: Company;
}

export interface BranchPhysicalAddress {
  publicId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneCode: string;
  phoneNumber: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface BranchBillingAddress {
  publicId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneCode: string;
  phoneNumber: string;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface BranchOperationHours {
  publicId: string;
  dayOfWeek: DayOfWeek;
  openTime: DateTime;
  closeTime: DateTime;
  isClosed: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;
  branch: Branch;
}

export interface PaginatedBranchEvent {
  data: BranchEvent[];
  pageInfo: PageInfo;
}

export interface PaginatedUserAccount {
  data: UserAccount[];
  pageInfo: PageInfo;
}

export interface Branch {
  publicId: string;
  name: string;
  code: string;
  email?: Nullable<string>;
  phoneCode?: Nullable<string>;
  phoneNumber?: Nullable<string>;
  isActive: boolean;
  totalOfEmployee: number;
  company: Company;
  branchPhysicalAddresses?: Nullable<BranchPhysicalAddress>;
  branchBillingAddress?: Nullable<BranchBillingAddress>;
  branchOperationHours: BranchOperationHours[];
  branchEvents?: PaginatedBranchEvent;
  userAccounts?: PaginatedUserAccount;
}

export interface UserAccount {
  publicId: string;
  status: UserAccountStatus;
  joinedAt?: Nullable<DateTime>;
  companyEmployeePublicId: string;
  branchPublicId: string;
  companyEmployee: CompanyEmployee;
  branch: Branch;
}

export interface Credential {
  publicId: string;
  email: string;
  username?: Nullable<string>;
}

export interface User {
  publicId: string;
  firstName?: Nullable<string>;
  lastName?: Nullable<string>;
  nickname?: Nullable<string>;
  displayName?: Nullable<string>;
  profilePicture?: Nullable<string>;
  bod?: Nullable<DateTime>;
  gender?: Nullable<string>;
  createdAt: DateTime;
  updatedAt: DateTime;
  companies: Company[];
  userAccounts: UserAccount[];
  credential: Credential;
}

export interface BranchEvent {
  publicId: string;
  name: string;
  type: string;
  description?: Nullable<string>;
  startDate: DateTime;
  endDate: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime;
  branch: Branch;
}

export interface CompaniesOverview {
  totalCompanies: number;
  activeCompanies: number;
  deactivatedCompanies: number;
  companiesDeactivatedThisMonth: number;
  retentionRate: number;
  deactivationRate: number;
  totalBranches: number;
  newBranchesThisMonth: number;
  newBranchesThisQuarter: number;
  branchGrowthRate: number;
  totalStaff: number;
  newStaffThisQuarter: number;
  staffGrowthRate: number;
  averageStaffPerBranch: number;
}

export interface PaginatedCompany {
  data: Company[];
  pageInfo: PageInfo;
  overview: CompaniesOverview;
}

export interface PaginatedCompanyEmployee {
  data: CompanyEmployee[];
  pageInfo: PageInfo;
}

export interface PaginatedBranch {
  data: Branch[];
  pageInfo: PageInfo;
}

export interface IQuery {
  getAuthUser(): User | Promise<User>;
  getUserCompanies(pagination: CompanyPaginationInput): PaginatedCompany | Promise<PaginatedCompany>;
  getCompanyDetail(companyPublicId: string): Company | Promise<Company>;
  getCompanyUserAccounts(companyPublicId: string, pagination: UserAccountPaginationInput): PaginatedUserAccount | Promise<PaginatedUserAccount>;
  getCompanyEmployees(companyPublicId: string, pagination: CompanyEmployeePaginationInput): PaginatedCompanyEmployee | Promise<PaginatedCompanyEmployee>;
  getCompanyBranches(companyPublicId: string, pagination: BranchPaginationInput): PaginatedBranch | Promise<PaginatedBranch>;
  getBranchDetail(branchPublicId: string): Branch | Promise<Branch>;
  getCompanyBranchEvent(companyPublicId: string, pagination: BranchEventPaginationInput): PaginatedBranchEvent | Promise<PaginatedBranchEvent>;
}

export interface IMutation {
  completeProfile(input: CompleteProfileInput): User | Promise<User>;
}

export type DateTime = any;
type Nullable<T> = T | null;
