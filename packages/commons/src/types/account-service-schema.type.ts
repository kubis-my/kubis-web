// ============================================
// GraphQL Schema TypeScript Types
// Generated from schema.gql
// ============================================

// ============================================
// Scalars
// ============================================
export type DateTime = string; // ISO 8601 date-time string

// ============================================
// Enums
// ============================================
export enum DayOfWeek {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

// ============================================
// Types
// ============================================
export interface PageInfo {
  /** Cursor of the last item in the current page */
  endCursor: number | null;
  /** Whether there are more items available */
  hasNextPage: boolean;
  /** Total count of all items */
  total: number;
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
}

export interface UserAccount {
  publicId: string;
  user: User;
  company: Company;
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
  logo: string | null;
  user: User;
  userAccounts: UserAccount[];
  companyPhysicalAddresses: CompanyPhysicalAddress | null;
  companyBillingAddress: CompanyBillingAddress | null;
  branches: PaginatedBranch;
}

export interface Credential {
  publicId: string;
  email: string;
  username: string | null;
}

export interface User {
  publicId: string;
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  displayName: string | null;
  profilePicture: string | null;
  bod: DateTime | null;
  gender: string | null;
  createdAt: DateTime;
  updatedAt: DateTime;
  companies: Company[];
  userAccounts: UserAccount[];
  credential: Credential;
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

export interface Branch {
  publicId: string;
  name: string;
  code: string;
  email: string | null;
  phoneCode: string | null;
  phoneNumber: string | null;
  isActive: boolean;
  company: Company;
  branchPhysicalAddresses: BranchPhysicalAddress | null;
  branchBillingAddress: BranchBillingAddress | null;
  branchOperationHours: BranchOperationHours[];
  userAccounts: UserAccount[];
}

export interface PaginatedCompany {
  /** Array of companies for the current page */
  data: Company[];
  /** Pagination metadata */
  pageInfo: PageInfo;
}

export interface PaginatedBranch {
  /** Array of branches for the current page */
  data: Branch[];
  /** Pagination metadata */
  pageInfo: PageInfo;
}

// ============================================
// Input Types
// ============================================
export interface CompanyPaginationInput {
  /** Cursor pointing to the last item from previous page */
  cursor?: number | null;
  /** Number of items to fetch (max: 100) */
  take?: number; // Default: 10
}

export interface BranchPaginationInput {
  /** Cursor pointing to the last item from previous page */
  cursor?: number | null;
  /** Number of items to fetch (max: 100) */
  take?: number; // Default: 10
}

export interface CompleteProfileInput {
  firstName: string;
  lastName: string;
  nickname: string;
}

// ============================================
// Query & Mutation Response Types
// ============================================
export interface GetAuthUserResponse {
  getAuthUser: User;
}

export interface GetUserCompaniesResponse {
  getUserCompanies: PaginatedCompany;
}

export interface GetCompanyBranchesResponse {
  getCompanyBranches: PaginatedBranch;
}

export interface CompleteProfileResponse {
  completeProfile: User;
}

// ============================================
// Query Variables
// ============================================
export interface GetUserCompaniesVariables {
  pagination: CompanyPaginationInput;
}

export interface GetCompanyBranchesVariables {
  companyPublicId: string;
  pagination: BranchPaginationInput;
}

export interface CompleteProfileVariables {
  input: CompleteProfileInput;
}
