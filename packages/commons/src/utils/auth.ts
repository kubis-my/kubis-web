import { Company } from '../types/account-service-schema.type';

export const hasSuperAdminAccess = (companies: Company[]): boolean => {
    return companies.some(comp => comp.isSuperAdmin);
};
