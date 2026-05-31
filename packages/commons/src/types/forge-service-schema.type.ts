/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum MilestoneStatus {
    UPCOMING = 'UPCOMING',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
    CANCELLED = 'CANCELLED',
}

export enum ProjectStatus {
    PENDING_REVIEW = 'PENDING_REVIEW',
    DISCOVERY = 'DISCOVERY',
    MVP_BUILD = 'MVP_BUILD',
    VALIDATION = 'VALIDATION',
    PRODUCTION = 'PRODUCTION',
    ON_HOLD = 'ON_HOLD',
    CANCELLED = 'CANCELLED',
}

export enum AddOnCategory {
    STANDARD = 'STANDARD',
    OPTIONAL = 'OPTIONAL',
}

export interface ThreadPaginationInput {
    cursor?: Nullable<number>;
    take: number;
}

export interface ProjectPaginationInput {
    cursor?: Nullable<number>;
    take: number;
    status?: Nullable<ProjectStatus>;
}

export interface CreateProjectInput {
    name: string;
    companyIds: string[];
    background?: Nullable<string>;
    problem: JSON;
    systemNeeds: JSON;
    references?: Nullable<string>;
    expectedUsers?: Nullable<string>;
    notes?: Nullable<JSON>;
}

export interface AddProjectTeamMemberInput {
    projectPublicId: string;
    userPublicId: string;
}

export interface SendThreadMessageInput {
    projectPublicId: string;
    content: JSON;
    replyToPublicId?: Nullable<string>;
}

export interface CreateMilestoneInput {
    projectPublicId: string;
    name: string;
    estimatedAt?: Nullable<DateTime>;
    order?: Nullable<number>;
}

export interface UpdateMilestoneInput {
    name?: Nullable<string>;
    status?: Nullable<MilestoneStatus>;
    estimatedAt?: Nullable<DateTime>;
    order?: Nullable<number>;
}

export interface AddMilestoneNoteInput {
    milestonePublicId: string;
    content: JSON;
    date: DateTime;
}

export interface PageInfo {
    endCursor?: Nullable<number>;
    hasNextPage: boolean;
    total: number;
    currentPage: number;
    totalPages: number;
}

export interface Brief {
    publicId: string;
    background?: Nullable<string>;
    problem: JSON;
    systemNeeds: JSON;
    references?: Nullable<string>;
    expectedUsers?: Nullable<string>;
    notes?: Nullable<JSON>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface MilestoneNote {
    publicId: string;
    content: JSON;
    date: DateTime;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface Milestone {
    publicId: string;
    name: string;
    status: MilestoneStatus;
    estimatedAt?: Nullable<DateTime>;
    order: number;
    createdAt: DateTime;
    updatedAt: DateTime;
    notes: MilestoneNote[];
}

export interface ProjectTeam {
    publicId: string;
    userPublicId: string;
    isActive: boolean;
    isOwner: boolean;
}

export interface ThreadMessage {
    publicId: string;
    senderId: string;
    senderName: string;
    senderInitials: string;
    content: JSON;
    replyToId?: Nullable<string>;
    deletedAt?: Nullable<DateTime>;
    createdAt: DateTime;
}

export interface ThreadPageInfo {
    endCursor?: Nullable<number>;
    hasMore: boolean;
    total: number;
}

export interface PaginatedThreadMessages {
    data: ThreadMessage[];
    pageInfo: ThreadPageInfo;
}

export interface UserProjectOverview {
    unreadCount: number;
    lastSeenThreadMessagePublicId?: Nullable<string>;
}

export interface Project {
    publicId: string;
    name: string;
    status: ProjectStatus;
    stagingUrl?: Nullable<string>;
    companyIds: string[];
    createdAt: DateTime;
    updatedAt: DateTime;
    brief?: Nullable<Brief>;
    projectTeams: ProjectTeam[];
    milestones: Milestone[];
    threads?: PaginatedThreadMessages;
    userOverview: UserProjectOverview;
}

export interface PaginatedProject {
    data: Project[];
    pageInfo: PageInfo;
}

export interface PlanFeature {
    id: string;
    label: string;
    sortOrder: number;
}

export interface Plan {
    publicId: string;
    name: string;
    priceAmount: number;
    priceLabel: string;
    description: string;
    badge?: Nullable<string>;
    isCustomPricing: boolean;
    sortOrder: number;
    features?: PlanFeature[];
}

export interface AddOn {
    publicId: string;
    name: string;
    slug: string;
    category: AddOnCategory;
    sortOrder: number;
}

export interface PackagePlan {
    plans?: Plan[];
    addons?: AddOn[];
}

export interface IQuery {
    health(): string | Promise<string>;
    getProjectsForForge(
        pagination: ProjectPaginationInput,
    ): PaginatedProject | Promise<PaginatedProject>;
    getProjectForForge(publicId: string): Project | Promise<Project>;
    getThreadMessagesForForge(
        projectPublicId: string,
        pagination: ThreadPaginationInput,
    ): PaginatedThreadMessages | Promise<PaginatedThreadMessages>;
    getMilestonesForForge(projectPublicId: string): Milestone[] | Promise<Milestone[]>;
    getMilestoneForForge(publicId: string): Milestone | Promise<Milestone>;
    getPackagePlan(): PackagePlan | Promise<PackagePlan>;
}

export interface IMutation {
    createProjectForForge(input: CreateProjectInput): Project | Promise<Project>;
    addProjectTeamMember(input: AddProjectTeamMemberInput): ProjectTeam | Promise<ProjectTeam>;
    removeProjectTeamMember(projectTeamPublicId: string): ProjectTeam | Promise<ProjectTeam>;
    sendThreadMessageForForge(
        input: SendThreadMessageInput,
    ): ThreadMessage | Promise<ThreadMessage>;
    deleteThreadMessageForForge(publicId: string): ThreadMessage | Promise<ThreadMessage>;
    restoreThreadMessageForForge(publicId: string): ThreadMessage | Promise<ThreadMessage>;
    markThreadMessageAsReadForForge(messagePublicId: string): boolean | Promise<boolean>;
    createMilestoneForForge(input: CreateMilestoneInput): Milestone | Promise<Milestone>;
    updateMilestoneForForge(
        publicId: string,
        input: UpdateMilestoneInput,
    ): Milestone | Promise<Milestone>;
    addMilestoneNoteForForge(input: AddMilestoneNoteInput): MilestoneNote | Promise<MilestoneNote>;
}

export type JSON = any;
export type DateTime = any;
type Nullable<T> = T | null;
