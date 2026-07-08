export const ROUTE = {
    MY_ACCOUNT: {
        HOME: '/my-account',
        COMPANY: '/my-account/company',
        INVITATION: '/my-account/invitation',
        YOUR_DEVICE: '/my-account/your-device',
    },
    EXPLORE_APPS: '/explore-apps',
};

export const BRANCH_PAGINATION_SIZE = 10;
export const USER_ACCOUNT_PAGINATION_SIZE = 10;
export const COMPANY_EMPLOYEE_PAGINATION_SIZE = 10;
export const BRANCH_EVENT_PAGINATION_SIZE = 10;
export const AUDIT_LOG_PAGINATION_SIZE = 10;
export const COMPANY_PAGINATION_SIZE = 10;
export const CREDENTIAL_DEVICE_PAGINATION_SIZE = 10;
export const INVITATION_PAGINATION_SIZE = 10;

export const FALLBACK_SETUP_TELEGRAM_EXPIRE_MS = 10 * 60 * 1_000;

export const activityTypeConfig = {
    create: {
        variant: 'default' as const,
        className: 'bg-green-500 hover:bg-green-600',
        label: 'Create',
    },
    update: {
        variant: 'default' as const,
        className: 'bg-blue-500 hover:bg-blue-600',
        label: 'Update',
    },
    delete: { variant: 'destructive' as const, className: '', label: 'Delete' },
    login: {
        variant: 'default' as const,
        className: 'bg-purple-500 hover:bg-purple-600',
        label: 'Login',
    },
    revoke: { variant: 'destructive' as const, className: '', label: 'Revoke Access' },
    logout: {
        variant: 'default' as const,
        className: 'bg-orange-500 hover:bg-orange-600',
        label: 'Logout',
    },
};
