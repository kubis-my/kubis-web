"use client";

import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/card"
import { Badge } from "@/shadcn/components/badge"
import { useCompany } from "./company-container";

export function OverviewCard() {
    const ctx = useCompany();

    return (
        <>
            {/*
                Card 1: Active and Deactivated Companies
                - Total companies: 156 active + 12 deactivated = 168
                - Retention rate: (156 / 168) × 100 = 92.9%
                - Deactivation rate: (12 / 168) × 100 = 7.1%
                - Badge shows deactivation rate as negative trend
            */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Active Companies</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {ctx.paginatedCompany.overview.activeCompanies} / {ctx.paginatedCompany.overview.deactivatedCompanies}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingDown />
                            {ctx.paginatedCompany.overview.deactivationRate.toFixed(2)}%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {ctx.paginatedCompany.overview.retentionRate.toFixed(2)}% retention rate <IconTrendingDown className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        {ctx.paginatedCompany.overview.companiesDeactivatedThisMonth} companies deactivated this month
                    </div>
                </CardFooter>
            </Card>
            {/*
                Card 2: Branch Companies
                - Current branches: 45
                - Previous branches: 45 - 6 = 39
                - Growth rate: (6 / 39) × 100 = 15.4%
                - Badge shows quarterly growth percentage
            */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Branch Companies</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {ctx.paginatedCompany.overview.totalBranches}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />
                            {ctx.paginatedCompany.overview.branchGrowthRate.toFixed(2)}%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {ctx.paginatedCompany.overview.newBranchesThisQuarter} new branches this quarter <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">{ctx.paginatedCompany.overview.newBranchesThisMonth} branches opened this month</div>
                </CardFooter>
            </Card>
            {/*
                Card 3: Total Staff
                - Current staff: 2,847
                - Previous staff: 2,847 - 342 = 2,505
                - Growth rate: (342 / 2,505) × 100 = 13.7%
                - Average per branch: 2,847 / 45 = 63.3 ≈ 63
                - Badge shows quarterly hiring growth percentage
            */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Staff</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {ctx.paginatedCompany.overview.totalStaff}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <IconTrendingUp />
                            {ctx.paginatedCompany.overview.staffGrowthRate.toFixed(2)}%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {ctx.paginatedCompany.overview.newStaffThisQuarter} employees this quarter <IconTrendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">Average {ctx.paginatedCompany.overview.averageStaffPerBranch} staff per branch</div>
                </CardFooter>
            </Card>
        </>
    )
}
