"use client";

import { PendingInvitationsCard } from "@/root/components/pages/invitation/pending-invitations-card";
import { AcceptedInvitationsCard } from "@/root/components/pages/invitation/accepted-invitations-card";
import { ExpiredInvitationsCard } from "@/root/components/pages/invitation/expired-invitations-card";
import InvitationTable from "@/root/components/pages/invitation/invitation-table";
import InvitationContainer from "@/root/components/pages/invitation/invitation-container";

export default function page() {
    return (
        <InvitationContainer>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <PendingInvitationsCard />
                    <AcceptedInvitationsCard />
                    <ExpiredInvitationsCard />
                </div>
                <div className="mt-2">
                    <InvitationTable />
                </div>
            </div>
        </InvitationContainer>
    );
}
