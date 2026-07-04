'use client';

import { getProjectNavMain, getProjectsNavMain } from '@/root/libs/dashboard-data';
import { PROJECT_PAGINATION_SIZE, ROUTE, STATUS_LABEL } from '@/root/libs/constants';
import { useDashboard02 } from '@/shadcn/dashboards/dashboard-02';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { Credential } from '@repo/commons/types/account-service-schema.type';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { SocketRoomEvent, ThreadEvent } from '@repo/commons/constant/web-socket';
import { useSocket } from '@/shadcn/providers/socket-provider';
import { Folder } from 'lucide-react';
import { GET_PROJECTS } from '@/root/components/pages/project-root/projects-container';

interface GetProjectUnreadResponse {
    getProjectForForge: { publicId: string; userOverview: { unreadCount: number } };
}

interface GetProjectUnreadVariables {
    publicId: string;
}

const GET_PROJECT_UNREAD: TypedDocumentNode<GetProjectUnreadResponse, GetProjectUnreadVariables> =
    gql`
        query GetProjectUnreadCount($publicId: String!) {
            getProjectForForge(publicId: $publicId) {
                publicId
                userOverview {
                    unreadCount
                }
            }
        }
    `;

export default function DashboardContainer({ children }: Readonly<{ children: React.ReactNode }>) {
    const currentPathname = usePathname();
    const params = useParams();

    const { authUser } = useAuth();
    const {
        updateUser,
        updateNavMain,
        updateWorkspaces,
        updateWorkspacesLoading,
        updateShowWorkspaceSwitcher,
    } = useDashboard02();

    const projectId = params?.projectId as string | undefined;

    const { emit, on, off, isConnected } = useSocket();

    const pathnameRef = useRef(currentPathname);
    useEffect(() => {
        pathnameRef.current = currentPathname;
    }, [currentPathname]);

    const { data: unreadData, refetch: refetchUnread } = useQuery(GET_PROJECT_UNREAD, {
        variables: { publicId: projectId! },
        skip: !projectId,
        fetchPolicy: 'cache-only',
    });

    const unreadCount = unreadData?.getProjectForForge?.userOverview?.unreadCount ?? 0;

    const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS, {
        variables: { pagination: { take: PROJECT_PAGINATION_SIZE } },
        skip: !projectId,
    });

    const workspaces = useMemo(() => {
        return (projectsData?.getProjectsForForge.data ?? [])
            .slice(0, 5)
            .filter(Boolean)
            .map((project) => ({
                id: project.publicId,
                name: project.name,
                logo: Folder,
                subtitle: STATUS_LABEL[project.status] ?? '',
                url: ROUTE.FORGE.PROJECT_DETAIL(project.publicId),
            }));
    }, [projectsData]);

    useEffect(() => {
        updateWorkspaces(workspaces);
    }, [workspaces, updateWorkspaces]);

    useEffect(() => {
        updateWorkspacesLoading(!!projectId && projectsLoading);
    }, [projectId, projectsLoading, updateWorkspacesLoading]);

    useEffect(() => {
        if (!isConnected || !projectId) return;

        const room = `thread:${projectId}`;

        const threadsPath = ROUTE.FORGE.PROJECT_THREADS(projectId);
        const onMessageSent = () => {
            if (pathnameRef.current === threadsPath) return;
            refetchUnread();
        };

        emit(SocketRoomEvent.JOIN_ROOM, { room });
        on(ThreadEvent.MESSAGE_SENT, onMessageSent);

        return () => {
            emit(SocketRoomEvent.LEAVE_ROOM, { room });
            off(ThreadEvent.MESSAGE_SENT, onMessageSent);
        };
    }, [isConnected, projectId, emit, on, off, refetchUnread]);

    useEffect(() => {
        if (!authUser) {
            updateUser(undefined);
        } else {
            updateUser({
                name: authUser.nickname!,
                email: (authUser.credential as Credential)?.email || '',
                avatar: authUser.profilePicture || '',
                avatarFallbackText: authUser.nickname!.at(0)?.toUpperCase() ?? '',
            });
        }
    }, [authUser, updateUser]);

    useEffect(() => {
        updateShowWorkspaceSwitcher(!!projectId);

        if (!projectId) {
            updateNavMain(
                getProjectsNavMain().map((item) => ({
                    ...item,
                    isActive:
                        currentPathname === item.url || currentPathname.startsWith(`${item.url}/`),
                })),
            );
            return;
        }

        const overviewUrl = ROUTE.FORGE.PROJECT_DETAIL(projectId);

        updateNavMain(
            getProjectNavMain(projectId, unreadCount).map((item) => ({
                ...item,
                isActive:
                    item.url === overviewUrl
                        ? currentPathname === item.url
                        : currentPathname === item.url ||
                        currentPathname.startsWith(`${item.url}/`),
            })),
        );
    }, [projectId, currentPathname, unreadCount, updateNavMain, updateShowWorkspaceSwitcher]);

    return children;
}
