"use client";

import { IconTrendingUp, IconBuilding } from "@tabler/icons-react"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/card"
import { Badge } from "@/shadcn/components/badge"
import { useMyAccount } from "./my-account-container";

export function CompaniesCard() {
    const ctx = useMyAccount()

    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>Companies</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {ctx.companyOverviewCard.activeCompanies} / {ctx.companyOverviewCard.inactiveCompanies}
                </CardTitle>
                <CardAction>
                    <Badge variant="outline">
                        <IconBuilding className="size-4" />
                        {ctx.companyOverviewCard.totalCompanies} total
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                    {ctx.companyOverviewCard.activeCompanies} active companies <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                    {ctx.companyOverviewCard.recentJoins} new company joined {ctx.companyOverviewCard.recentJoinTimeframe}
                </div>
            </CardFooter>
        </Card>
    )
}
