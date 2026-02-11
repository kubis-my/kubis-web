"use client";

import { INVITATION_PAGINATION_SIZE } from "@/root/libs/constants";
import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type InvitationStatus = "PENDING_INVITATION" | "ACTIVE" | "EXPIRED_INVITATION";

export interface MockInvitation {
    publicId: string;
    companyName: string;
    branchName: string;
    branchCode: string;
    position: string;
    invitedBy: { name: string; email: string };
    invitedAt: string;
    status: InvitationStatus;
}

export interface InvitationOverview {
    pendingCount: number;
    acceptedCount: number;
    expiredCount: number;
}

export interface PaginatedMockInvitation {
    data: MockInvitation[];
    pageInfo: {
        endCursor: number | null;
        hasNextPage: boolean;
        total: number;
        currentPage: number;
        totalPages: number;
    };
    overview: InvitationOverview;
}

const MOCK_INVITATIONS: MockInvitation[] = [
    {
        publicId: "inv-001",
        companyName: "Acme Corporation",
        branchName: "Kuala Lumpur HQ",
        branchCode: "KL-HQ",
        position: "Software Engineer",
        invitedBy: { name: "Ahmad Razak", email: "ahmad@acme.com" },
        invitedAt: "2025-12-15T09:30:00.000Z",
        status: "PENDING_INVITATION",
    },
    {
        publicId: "inv-002",
        companyName: "TechVentures Sdn Bhd",
        branchName: "Penang Branch",
        branchCode: "PG-01",
        position: "Frontend Developer",
        invitedBy: { name: "Sarah Lim", email: "sarah@techventures.com" },
        invitedAt: "2025-12-10T14:00:00.000Z",
        status: "PENDING_INVITATION",
    },
    {
        publicId: "inv-003",
        companyName: "Global Solutions",
        branchName: "Johor Bahru Office",
        branchCode: "JB-01",
        position: "Project Manager",
        invitedBy: { name: "Ravi Kumar", email: "ravi@globalsolutions.com" },
        invitedAt: "2025-11-28T10:15:00.000Z",
        status: "ACTIVE",
    },
    {
        publicId: "inv-004",
        companyName: "DataSync Inc",
        branchName: "Singapore Office",
        branchCode: "SG-01",
        position: "Data Analyst",
        invitedBy: { name: "Mei Ling Tan", email: "meiling@datasync.com" },
        invitedAt: "2025-11-20T08:00:00.000Z",
        status: "ACTIVE",
    },
    {
        publicId: "inv-005",
        companyName: "CloudNine Systems",
        branchName: "Cyberjaya Campus",
        branchCode: "CJ-01",
        position: "DevOps Engineer",
        invitedBy: { name: "Jason Tan", email: "jason@cloudnine.com" },
        invitedAt: "2025-10-05T11:30:00.000Z",
        status: "EXPIRED_INVITATION",
    },
    {
        publicId: "inv-006",
        companyName: "Nexus Digital",
        branchName: "Shah Alam Branch",
        branchCode: "SA-01",
        position: "UI/UX Designer",
        invitedBy: { name: "Nurul Aisyah", email: "nurul@nexusdigital.com" },
        invitedAt: "2025-12-18T16:45:00.000Z",
        status: "PENDING_INVITATION",
    },
    {
        publicId: "inv-007",
        companyName: "Pinnacle Group",
        branchName: "Ipoh Branch",
        branchCode: "IP-01",
        position: "Backend Developer",
        invitedBy: { name: "Chong Wei", email: "chongwei@pinnacle.com" },
        invitedAt: "2025-11-15T13:20:00.000Z",
        status: "ACTIVE",
    },
    {
        publicId: "inv-008",
        companyName: "Swift Logistics",
        branchName: "Port Klang Depot",
        branchCode: "PK-01",
        position: "IT Support",
        invitedBy: { name: "Amir Hassan", email: "amir@swiftlogistics.com" },
        invitedAt: "2025-09-22T07:00:00.000Z",
        status: "EXPIRED_INVITATION",
    },
    {
        publicId: "inv-009",
        companyName: "GreenTech Solutions",
        branchName: "Putrajaya Office",
        branchCode: "PJ-01",
        position: "System Administrator",
        invitedBy: { name: "Farah Idris", email: "farah@greentech.com" },
        invitedAt: "2025-12-20T10:00:00.000Z",
        status: "PENDING_INVITATION",
    },
    {
        publicId: "inv-010",
        companyName: "Horizon Labs",
        branchName: "Petaling Jaya Lab",
        branchCode: "PJ-02",
        position: "QA Engineer",
        invitedBy: { name: "David Wong", email: "david@horizonlabs.com" },
        invitedAt: "2025-10-30T15:10:00.000Z",
        status: "EXPIRED_INVITATION",
    },
    {
        publicId: "inv-011",
        companyName: "Acme Corporation",
        branchName: "Melaka Branch",
        branchCode: "ML-01",
        position: "Full Stack Developer",
        invitedBy: { name: "Ahmad Razak", email: "ahmad@acme.com" },
        invitedAt: "2025-12-22T09:00:00.000Z",
        status: "PENDING_INVITATION",
    },
    {
        publicId: "inv-012",
        companyName: "ByteCraft Studios",
        branchName: "Bangsar South",
        branchCode: "BS-01",
        position: "Mobile Developer",
        invitedBy: { name: "Priya Nair", email: "priya@bytecraft.com" },
        invitedAt: "2025-11-05T12:30:00.000Z",
        status: "ACTIVE",
    },
];

function computeOverview(invitations: MockInvitation[]): InvitationOverview {
    return {
        pendingCount: invitations.filter((i) => i.status === "PENDING_INVITATION").length,
        acceptedCount: invitations.filter((i) => i.status === "ACTIVE").length,
        expiredCount: invitations.filter((i) => i.status === "EXPIRED_INVITATION").length,
    };
}

function paginateInvitations(invitations: MockInvitation[], page: number, pageSize: number): PaginatedMockInvitation {
    const total = invitations.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    const data = invitations.slice(start, start + pageSize);
    const hasNextPage = currentPage < totalPages;
    const endCursor = hasNextPage ? start + pageSize : null;

    return {
        data,
        pageInfo: {
            endCursor,
            hasNextPage,
            total,
            currentPage,
            totalPages,
        },
        overview: computeOverview(invitations),
    };
}

export type InvitationContextType = {
    paginatedInvitation: PaginatedMockInvitation;
    isLoading: boolean;
    acceptInvitation: (id: string) => void;
    declineInvitation: (id: string) => void;
    goToPage: (page: number) => void;
    currentPage: number;
    pageSize: number;
};

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

export default function InvitationContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const { updateBreadcrumbList } = useDashboard01();

    const [invitations, setInvitations] = useState<MockInvitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = INVITATION_PAGINATION_SIZE;

    useEffect(() => {
        updateBreadcrumbList([{ name: "Invitations" }]);
        return () => {
            updateBreadcrumbList([]);
        };
    }, [updateBreadcrumbList]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setInvitations([...MOCK_INVITATIONS]);
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const paginatedInvitation = useMemo(
        () => paginateInvitations(invitations, currentPage, pageSize),
        [invitations, currentPage, pageSize],
    );

    const acceptInvitation = useCallback((id: string) => {
        setInvitations((prev) =>
            prev.map((inv) =>
                inv.publicId === id ? { ...inv, status: "ACTIVE" as const } : inv,
            ),
        );
        toast.success("Invitation accepted", { position: "top-center" });
    }, []);

    const declineInvitation = useCallback((id: string) => {
        setInvitations((prev) => prev.filter((inv) => inv.publicId !== id));
        toast.success("Invitation declined", { position: "top-center" });
    }, []);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const contextValue = useMemo(
        () => ({
            paginatedInvitation,
            isLoading,
            acceptInvitation,
            declineInvitation,
            goToPage,
            currentPage,
            pageSize,
        }),
        [paginatedInvitation, isLoading, acceptInvitation, declineInvitation, goToPage, currentPage, pageSize],
    );

    return (
        <InvitationContext.Provider value={contextValue}>
            {children}
        </InvitationContext.Provider>
    );
}

export function useInvitation() {
    const context = useContext(InvitationContext);
    if (context === undefined) {
        throw new Error("useInvitation must be used within an InvitationContainer");
    }
    return context;
}
