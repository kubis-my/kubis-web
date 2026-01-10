export const ROUTE = {
    MY_ACCOUNT: {
        HOME: "/my-account",
        PROFILE: "/my-account/profile",
        COMPANY: "/my-account/company",
        INVITATION: "/my-account/invitation",
        YOUR_DEVICE: "/my-account/your-device"
    }
}

export const BRANCH_PAGINATION_SIZE = 10;
export const USER_ACCOUNT_PAGINATION_SIZE = 10;
export const BRANCH_EVENT_PAGINATION_SIZE = 10;
export const AUDIT_LOG_PAGINATION_SIZE = 10;

export const activityTypeConfig = {
    create: { variant: "default" as const, className: "bg-green-500 hover:bg-green-600", label: "Create" },
    update: { variant: "default" as const, className: "bg-blue-500 hover:bg-blue-600", label: "Update" },
    delete: { variant: "destructive" as const, className: "", label: "Delete" },
    login: { variant: "default" as const, className: "bg-purple-500 hover:bg-purple-600", label: "Login" }
};