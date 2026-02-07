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
export const COMPANY_EMPLOYEE_PAGINATION_SIZE = 10;
export const BRANCH_EVENT_PAGINATION_SIZE = 10;
export const AUDIT_LOG_PAGINATION_SIZE = 10;
export const COMPANY_PAGINATION_SIZE = 10;
export const CREDENTIAL_DEVICE_PAGINATION_SIZE = 10;

export const activityTypeConfig = {
    create: { variant: "default" as const, className: "bg-green-500 hover:bg-green-600", label: "Create" },
    update: { variant: "default" as const, className: "bg-blue-500 hover:bg-blue-600", label: "Update" },
    delete: { variant: "destructive" as const, className: "", label: "Delete" },
    login: { variant: "default" as const, className: "bg-purple-500 hover:bg-purple-600", label: "Login" }
};

export const PHONE_CODES = [
    { value: '+1', label: '+1 (US/Canada)' },
    { value: '+44', label: '+44 (UK)' },
    { value: '+81', label: '+81 (Japan)' },
    { value: '+82', label: '+82 (South Korea)' },
    { value: '+86', label: '+86 (China)' },
    { value: '+91', label: '+91 (India)' },
    { value: '+60', label: '+60 (Malaysia)' },
    { value: '+65', label: '+65 (Singapore)' },
    { value: '+66', label: '+66 (Thailand)' },
    { value: '+62', label: '+62 (Indonesia)' },
    { value: '+63', label: '+63 (Philippines)' },
    { value: '+84', label: '+84 (Vietnam)' },
    { value: '+61', label: '+61 (Australia)' },
    { value: '+49', label: '+49 (Germany)' },
    { value: '+33', label: '+33 (France)' },
];