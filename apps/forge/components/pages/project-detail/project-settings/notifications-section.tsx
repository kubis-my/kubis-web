'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { gql, TypedDocumentNode } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Switch } from '@/shadcn/components/switch';
import { Label } from '@/shadcn/components/label';
import { useProjectDetail } from '../project-detail-container';
import type {
    UpsertNotificationPreferenceInput,
    ProjectSetting,
} from '@repo/commons/types/forge-service-schema.type';

interface UpsertNotificationPreferenceResponse {
    upsertNotificationPreferenceForForge: Pick<ProjectSetting, 'publicId' | 'userPreference'>;
}

interface UpsertNotificationPreferenceVariables {
    input: UpsertNotificationPreferenceInput;
}

const UPSERT_NOTIFICATION_PREFERENCE: TypedDocumentNode<
    UpsertNotificationPreferenceResponse,
    UpsertNotificationPreferenceVariables
> = gql`
    mutation UpsertNotificationPreferenceForForge($input: UpsertNotificationPreferenceInput!) {
        upsertNotificationPreferenceForForge(input: $input) {
            publicId
            userPreference {
                clientMilestoneCompleted
                clientNewMessage
                devClientReplied
                emailEnabled
            }
        }
    }
`;

type NotificationState = {
    clientMilestoneCompleted: boolean;
    clientNewMessage: boolean;
    devClientReplied: boolean;
    emailEnabled: boolean;
};

export default function NotificationsSection() {
    const { project } = useProjectDetail();
    const [upsertNotificationPreference] = useMutation(UPSERT_NOTIFICATION_PREFERENCE);

    const [notifications, setNotifications] = useState<NotificationState>({
        clientMilestoneCompleted: project.projectSettings?.userPreference?.clientMilestoneCompleted ?? true,
        clientNewMessage: project.projectSettings?.userPreference?.clientNewMessage ?? true,
        devClientReplied: project.projectSettings?.userPreference?.devClientReplied ?? true,
        emailEnabled: project.projectSettings?.userPreference?.emailEnabled ?? false,
    });

    const toggle = async (key: keyof NotificationState) => {
        const newState = { ...notifications, [key]: !notifications[key] };
        setNotifications(newState);

        try {
            await upsertNotificationPreference({
                variables: {
                    input: {
                        projectPublicId: project.id,
                        notification: newState,
                    },
                },
            });
        } catch {
            setNotifications(notifications);
            toast.error('Failed to update notification preference.', { position: 'top-center' });
        }
    };

    return (
        <section className="bg-card overflow-hidden rounded-xl border shadow-sm">
            <div className="bg-muted/30 border-b px-4 py-3 sm:px-5">
                <h2 className="text-base font-semibold">Notifications</h2>
                <p className="text-muted-foreground mt-0.5 text-sm">
                    Your personal notification preferences for this project.
                </p>
            </div>

            <div className="px-4 py-5 sm:px-5">
                <div className="grid gap-5">
                    <div className="grid gap-3">
                        <NotificationRow
                            id="notif-milestone-completed"
                            label="Milestone completed"
                            description="Notify you when a milestone is marked as done."
                            checked={notifications.clientMilestoneCompleted}
                            onCheckedChange={() => toggle('clientMilestoneCompleted')}
                        />
                        <NotificationRow
                            id="notif-new-message"
                            label="New message in threads"
                            description="Notify you when a new message is posted in a thread."
                            checked={notifications.clientNewMessage}
                            onCheckedChange={() => toggle('clientNewMessage')}
                        />
                        <NotificationRow
                            id="notif-client-replied"
                            label="Client replies in threads"
                            description="Notify you when the client sends a message."
                            checked={notifications.devClientReplied}
                            onCheckedChange={() => toggle('devClientReplied')}
                        />
                        <NotificationRow
                            id="notif-email"
                            label="Notify via email"
                            description="Send all enabled notifications to your email address."
                            checked={notifications.emailEnabled}
                            onCheckedChange={() => toggle('emailEnabled')}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function NotificationRow({
    id,
    label,
    description,
    checked,
    onCheckedChange,
}: {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: () => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="grid gap-0.5">
                <Label htmlFor={id} className="cursor-pointer text-sm font-medium">
                    {label}
                </Label>
                <p className="text-muted-foreground text-xs">{description}</p>
            </div>
            <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
}
