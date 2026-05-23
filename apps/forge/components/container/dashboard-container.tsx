'use client';

import { getNavigationList, getProjectNavigationList } from '@/root/libs/dashboard-data';
import { ROUTE } from '@/root/libs/constants';
import { useDashboard01 } from '@/shadcn/dashboards/dashboard-01';
import { useAuth } from '@/shadcn/providers/auth-provider';
import { useParams, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Credential } from '@repo/commons/types/account-service-schema.type';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { SocketRoomEvent, ThreadEvent } from '@repo/commons/constant/web-socket';
import { useSocket } from '@/shadcn/providers/socket-provider';

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
    const { updateUser, updateNavigationList } = useDashboard01();

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
        const navList = projectId
            ? getProjectNavigationList(projectId, unreadCount)
            : getNavigationList();

        updateNavigationList(() =>
            navList.map((group) => ({
                ...group,
                items: group.items.map((item) => ({
                    ...item,
                    isActive: projectId
                        ? currentPathname === item.url
                        : item.url === ROUTE.FORGE.HOME
                            ? currentPathname === item.url
                            : currentPathname.startsWith(item.url),
                })),
            })),
        );
    }, [projectId, currentPathname, unreadCount, updateNavigationList]);

    return children;
}
