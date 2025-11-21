"use client";

import { Button } from "@/shadcn/components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shadcn/components/dropdown-menu";
import { DashboardProvider } from "@/shadcn/dashboards/dashboard-01"
import { SidebarMenuAction } from "@/shadcn/dashboards/dashboard-01/sidebar";
import { NavigationItem, NavUserItem, BreadcrumbItem } from "@/shadcn/dashboards/dashboard-01/types";
import {
  IconCamera,
  IconChartBar,
  IconCreditCard,
  IconDashboard,
  IconDatabase,
  IconDots,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconLogout,
  IconMail,
  IconNotification,
  IconReport,
  IconSearch,
  IconSettings,
  IconShare3,
  IconTrash,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react"

const ExampleAction01 = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction
          showOnHover
          className="data-[state=open]:bg-accent rounded-sm"
        >
          <IconDots />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-24 rounded-lg"
        side="right"
        align="start"
      >
        <DropdownMenuItem>
          <IconFolder />
          <span>Open</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconShare3 />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconTrash />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const ExampleAction02 = () => {
  return (
    <Button
      size="icon"
      className="size-8 group-data-[collapsible=icon]:opacity-0"
      variant="outline"
    >
      <IconMail />
      <span className="sr-only">Inbox</span>
    </Button>
  )
}

const navigations: NavigationItem[] = [
  {
    id: "app",
    items: [
      {
        id: "app-dashboard",
        title: "Dashboard",
        url: "#",
        icon: <IconDashboard />,
        isActive: true,
        actionButton: <ExampleAction02 />
      },
      {
        id: "app-lifecycle",
        title: "Lifecycle",
        url: "#",
        icon: <IconListDetails />,
        isActive: false
      },
      {
        id: "app-Analytics",
        title: "Analytics",
        url: "#",
        icon: <IconChartBar />,
        isActive: false
      },
      {
        id: "app-Projects",
        title: "Projects",
        url: "#",
        icon: <IconFolder />,
        isActive: false
      },
      {
        id: "app-item",
        title: "Team",
        url: "#",
        icon: <IconUsers />,
        isActive: false
      },
    ]
  },
  {
    id: "documents",
    label: "Documents",
    props: {
      className: "group-data-[collapsible=icon]:hidden"
    },
    items: [
      {
        id: "documents-data",
        title: "Data Library",
        url: "#",
        icon: <IconDatabase />,
        isActive: false,
        actionButton: <ExampleAction01 />
      },
      {
        id: "app-report",
        title: "Reports",
        url: "#",
        icon: <IconReport />,
        isActive: false,
        actionButton: <ExampleAction01 />
      },
      {
        id: "app-word",
        title: "Word Assistant",
        url: "#",
        icon: <IconFileWord />,
        isActive: false,
        actionButton: <ExampleAction01 />
      },
    ]
  },
  {
    id: "footer",
    props: {
      className: "mt-auto"
    },
    items: [
      {
        id: "footer-setting",
        title: "Settings",
        url: "#",
        icon: <IconSettings />,
        isActive: false
      },
      {
        id: "footer-help",
        title: "Get Help",
        url: "#",
        icon: <IconHelp />,
        isActive: false
      },
      {
        id: "footer-help",
        title: "Search",
        url: "#",
        icon: <IconSearch />,
        isActive: false
      },
    ]
  }
];

const navigationUserItem: NavUserItem[] = [
  {
    id: "account",
    name: "Account",
    icon: <IconUserCircle />,
    async action(e) {

    },
  },
  {
    id: "Billing",
    name: "Billing",
    icon: <IconCreditCard />,
    async action(e) {

    },
  },
  {
    id: "Notifications",
    name: "Notifications",
    icon: <IconNotification />,
    async action(e) {

    },
  },
  {
    id: "Log out",
    name: "Log out",
    icon: <IconLogout />,
    separator: true,
    async action(e) {

    },
  },
]


export default function Page() {
  return (
    <DashboardProvider navigations={navigations} userCardItems={navigationUserItem} appName="My Account">
      Hello world!
    </DashboardProvider>
  )
}
