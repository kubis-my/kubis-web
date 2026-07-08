import { Company } from '../types/account-service-schema.type';
import axios from 'axios';
import { getToken, ACCESS_TOKEN_KEY } from './storage-helpers';

export const hasSuperAdminAccess = (companies: Company[]): boolean => {
    return companies.some((comp) => comp.isSuperAdmin);
};

export const createAuthDriver = () => {
    const accessToken = getToken(ACCESS_TOKEN_KEY);

    return axios.create({
        headers: { Authorization: `Bearer ${accessToken}` },
    });
};
