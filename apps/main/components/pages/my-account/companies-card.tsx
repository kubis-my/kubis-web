"use client";

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/card"
import { useMyAccount } from "./my-account-container";

export function CompaniesCard() {
    const ctx = useMyAccount()

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Companies</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {ctx.companyOverviewCard?.activeCompanies ?? 0} / {ctx.companyOverviewCard?.deactivatedCompanies ?? 0}
                </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {(ctx.companyOverviewCard?.retentionRate ?? 0).toFixed(2)}% retention rate
                </div>
                <div className="text-muted-foreground">
                    {ctx.companyOverviewCard?.companiesDeactivatedThisMonth ?? 0} companies deactivated this month
                </div>
            </CardFooter>
        </Card>
    )
}
