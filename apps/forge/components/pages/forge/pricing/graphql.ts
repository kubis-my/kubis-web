import { gql, TypedDocumentNode } from '@apollo/client';
import type { PackagePlan } from '@repo/commons/types/forge-service-schema.type';

interface GetPackagePlanResponse {
    getPackagePlan: Required<PackagePlan>;
}

interface GetPlanVariables {
    locale?: string;
}

export const GET_PACKAGE_PLAN: TypedDocumentNode<GetPackagePlanResponse, GetPlanVariables> = gql`
    query GetPackagePlan($locale: String) {
        getPackagePlan {
            plans(locale: $locale) {
                publicId
                name
                priceAmount
                priceLabel
                description
                badge
                isCustomPricing
                sortOrder
                features(locale: $locale) {
                    id
                    label
                    sortOrder
                }
            }
            addons(locale: $locale) {
                publicId
                name
                slug
                category
                sortOrder
            }
        }
    }
`;
