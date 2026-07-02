import { gql, TypedDocumentNode } from '@apollo/client';
import type { Invoice } from '@repo/commons/types/forge-service-schema.type';

interface GetInvoiceResponse {
    getInvoiceForForge: Invoice;
}

interface GetInvoiceVariables {
    publicId: string;
}

interface GetInvoiceClientSecretResponse {
    getInvoiceClientSecretForForge: string;
}

interface GetInvoiceClientSecretVariables {
    publicId: string;
}

export const GET_INVOICE_FOR_FORGE: TypedDocumentNode<GetInvoiceResponse, GetInvoiceVariables> = gql`
    query GetInvoiceForForge($publicId: String!) {
        getInvoiceForForge(publicId: $publicId) {
            publicId
            externalBillId
            status
            amount
            dueAt
            paidAt
            paymentUrl
            invoicePdf
            items {
                publicId
                type
                description
                amount
                sortOrder
            }
            createdAt
        }
    }
`;

export const GET_INVOICE_CLIENT_SECRET_FOR_FORGE: TypedDocumentNode<
    GetInvoiceClientSecretResponse,
    GetInvoiceClientSecretVariables
> = gql`
    query GetInvoiceClientSecretForForge($publicId: String!) {
        getInvoiceClientSecretForForge(publicId: $publicId)
    }
`;

