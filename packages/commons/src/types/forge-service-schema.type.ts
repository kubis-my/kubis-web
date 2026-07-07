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

export enum AddOnCategory {
    STANDARD = 'STANDARD',
    OPTIONAL = 'OPTIONAL',
}

export enum InvoiceItemType {
    Plan = 'Plan',
    Addon = 'Addon',
    Service = 'Service',
}

export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    PAUSED = 'PAUSED',
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

export enum PinnedPlace {
    TOP = 'TOP',
    MIDDLE = 'MIDDLE',
    BOTTOM = 'BOTTOM',
}

export enum ProjectContextValueType {
    STRING = 'STRING',
    SECURE = 'SECURE',
}

export interface ThreadPaginationInput {
    cursor?: Nullable<number>;
    take: number;
}

export interface InvoicePaginationInput {
    cursor?: Nullable<number>;
    take: number;
    projectPublicId?: Nullable<string>;
    status?: Nullable<InvoiceStatus>;
}

export interface ProjectPaginationInput {
    cursor?: Nullable<number>;
    take: number;
    status?: Nullable<ProjectStatus>;
    includeProjectIds?: Nullable<string[]>;
    pinnedPlace?: Nullable<PinnedPlace>;
    keepCurrentPage?: Nullable<boolean>;
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

export interface UpdateProjectStatusInput {
    publicId: string;
    name: string;
    stagingUrl?: Nullable<string>;
    productionUrl?: Nullable<string>;
    status: ProjectStatus;
    startAt?: Nullable<DateTime>;
    expectedGoLiveAt?: Nullable<DateTime>;
}

export interface UpsertProjectContextEnvironmentInput {
    projectPublicId: string;
    entry: EnvironmentEntryInput;
}

export interface EnvironmentEntryInput {
    id?: Nullable<string>;
    key: string;
    type: ProjectContextValueType;
    value?: Nullable<string>;
    isDeleted?: Nullable<boolean>;
}

export interface UpgradeSubscriptionPlanInput {
    projectPublicId: string;
    planPublicId: string;
}

export interface UpdateProjectSettingVisibilityInput {
    projectPublicId: string;
    visibility: ProjectVisibilityInput;
    isOneTimePayOff?: Nullable<boolean>;
}

export interface ProjectVisibilityInput {
    brief?: Nullable<boolean>;
    milestones?: Nullable<boolean>;
    threads?: Nullable<boolean>;
    devNotes?: Nullable<boolean>;
}

export interface UpsertNotificationPreferenceInput {
    projectPublicId: string;
    notification: NotificationPreferenceInput;
}

export interface NotificationPreferenceInput {
    clientMilestoneCompleted?: Nullable<boolean>;
    clientNewMessage?: Nullable<boolean>;
    devClientReplied?: Nullable<boolean>;
    emailEnabled?: Nullable<boolean>;
}

export interface SendThreadMessageInput {
    projectPublicId: string;
    content: JSON;
    replyToPublicId?: Nullable<string>;
}

export interface CreateInvoiceInput {
    projectPublicId: string;
    amount: number;
    dueAt: DateTime;
    items: CreateInvoiceItemInput[];
}

export interface CreateInvoiceItemInput {
    type: InvoiceItemType;
    description: string;
    amount: number;
    sortOrder: number;
}

export interface UpdateInvoiceInput {
    publicId: string;
    amount?: Nullable<number>;
    dueAt?: Nullable<DateTime>;
    status?: Nullable<InvoiceStatus>;
    items?: Nullable<CreateInvoiceItemInput[]>;
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

export interface ProjectNotificationPreference {
    clientMilestoneCompleted: boolean;
    clientNewMessage: boolean;
    devClientReplied: boolean;
    emailEnabled: boolean;
}

export interface ProjectVisibility {
    brief: boolean;
    milestones: boolean;
    threads: boolean;
    devNotes: boolean;
}

export interface EnvironmentEntry {
    id: string;
    key: string;
    type: string;
    value: string;
    isAdminOwned: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface ProjectSetting {
    publicId: string;
    stagingUrl?: Nullable<string>;
    productionUrl?: Nullable<string>;
    visibility: ProjectVisibility;
    environment: EnvironmentEntry[];
    userPreference?: Nullable<ProjectNotificationPreference>;
    isOneTimePayOff: boolean;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface ProjectTeam {
    publicId: string;
    userPublicId: string;
    isActive: boolean;
    isOwner: boolean;
}

export interface AddOn {
    publicId: string;
    name: string;
    slug: string;
    category: AddOnCategory;
    sortOrder: number;
}

export interface InvoiceItem {
    publicId: string;
    type: InvoiceItemType;
    description: string;
    amount: number;
    sortOrder: number;
}

export interface Invoice {
    publicId: string;
    status: InvoiceStatus;
    amount: number;
    dueAt: DateTime;
    paidAt?: Nullable<DateTime>;
    externalBillId: string;
    paymentUrl: string;
    invoicePdf?: Nullable<string>;
    items: InvoiceItem[];
    createdAt: DateTime;
    updatedAt: DateTime;
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

export interface ProjectSubscription {
    publicId: string;
    status: SubscriptionStatus;
    plan?: Plan;
    addOns?: AddOn[];
    invoices: Invoice[];
    startedAt: DateTime;
    endedAt?: Nullable<DateTime>;
    createdAt: DateTime;
    updatedAt: DateTime;
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

export interface PaginatedInvoice {
    data: Invoice[];
    pageInfo: PageInfo;
}

export interface Company {
    publicId: string;
    name: string;
    logo?: Nullable<string>;
}

export interface Project {
    publicId: string;
    name: string;
    status: ProjectStatus;
    companies: Company[];
    createdAt: DateTime;
    updatedAt: DateTime;
    startAt?: Nullable<DateTime>;
    expectedGoLiveAt?: Nullable<DateTime>;
    brief?: Nullable<Brief>;
    projectTeams: ProjectTeam[];
    milestones: Milestone[];
    threads?: PaginatedThreadMessages;
    userOverview: UserProjectOverview;
    subscription?: Nullable<ProjectSubscription>;
    projectSettings?: Nullable<ProjectSetting>;
    projectInvoice?: PaginatedInvoice;
}

export interface PaginatedProject {
    data: Project[];
    pageInfo: PageInfo;
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
    revealProjectContextEnvironmentSecretForForge(
        projectPublicId: string,
        entryId: string,
    ): string | Promise<string>;
    getThreadMessagesForForge(
        projectPublicId: string,
        pagination: ThreadPaginationInput,
    ): PaginatedThreadMessages | Promise<PaginatedThreadMessages>;
    getInvoicesForForge(
        pagination: InvoicePaginationInput,
    ): PaginatedInvoice | Promise<PaginatedInvoice>;
    getInvoiceForForge(publicId: string): Invoice | Promise<Invoice>;
    getInvoiceClientSecretForForge(publicId: string): string | Promise<string>;
    getPackagePlan(): PackagePlan | Promise<PackagePlan>;
    getMilestonesForForge(projectPublicId: string): Milestone[] | Promise<Milestone[]>;
    getMilestoneForForge(publicId: string): Milestone | Promise<Milestone>;
}

export interface IMutation {
    createProjectForForge(input: CreateProjectInput): Project | Promise<Project>;
    addProjectTeamMember(input: AddProjectTeamMemberInput): ProjectTeam | Promise<ProjectTeam>;
    removeProjectTeamMember(projectTeamPublicId: string): ProjectTeam | Promise<ProjectTeam>;
    updateProjectStatusForForge(input: UpdateProjectStatusInput): Project | Promise<Project>;
    upsertProjectContextEnvironmentForForge(
        input: UpsertProjectContextEnvironmentInput,
    ): Project | Promise<Project>;
    upgradeSubscriptionPlanForForge(
        input: UpgradeSubscriptionPlanInput,
    ): ProjectSubscription | Promise<ProjectSubscription>;
    updateProjectSettingVisibilityForForge(
        input: UpdateProjectSettingVisibilityInput,
    ): ProjectSetting | Promise<ProjectSetting>;
    upsertNotificationPreferenceForForge(
        input: UpsertNotificationPreferenceInput,
    ): ProjectSetting | Promise<ProjectSetting>;
    sendThreadMessageForForge(
        input: SendThreadMessageInput,
    ): ThreadMessage | Promise<ThreadMessage>;
    deleteThreadMessageForForge(publicId: string): ThreadMessage | Promise<ThreadMessage>;
    restoreThreadMessageForForge(publicId: string): ThreadMessage | Promise<ThreadMessage>;
    markThreadMessageAsReadForForge(messagePublicId: string): boolean | Promise<boolean>;
    createInvoiceForForge(input: CreateInvoiceInput): Invoice | Promise<Invoice>;
    updateInvoiceForForge(input: UpdateInvoiceInput): Invoice | Promise<Invoice>;
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
