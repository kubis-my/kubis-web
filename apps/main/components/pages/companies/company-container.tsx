"use client";

import { useDashboard01 } from "@/shadcn/dashboards/dashboard-01";
import { useEffect } from "react";

export default function CompanyContainer({ children }: Readonly<{ children: React.ReactNode; }>) {
    const { updateBreadcrumbList } = useDashboard01();

    useEffect(() => {
        updateBreadcrumbList([
            {
                name: "List of Companies"
            }
        ]);
    }, [updateBreadcrumbList])

    return children
}
