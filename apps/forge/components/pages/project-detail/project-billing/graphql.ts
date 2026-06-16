import { gql, TypedDocumentNode } from '@apollo/client';
import type {
    PaginatedInvoice,
    InvoicePaginationInput,
    Invoice,
    CreateInvoiceInput,
} from '@repo/commons/types/forge-service-schema.type';

interface GetInvoicesResponse {
    getInvoicesForForge: PaginatedInvoice;
}

interface GetInvoicesVariables {
    pagination: InvoicePaginationInput;
}

interface CreateInvoiceResponse {
    createInvoiceForForge: Invoice;
}

interface CreateInvoiceVariables {
    input: CreateInvoiceInput;
}

export const CREATE_INVOICE_FOR_FORGE: TypedDocumentNode<
    CreateInvoiceResponse,
    CreateInvoiceVariables
> = gql`
    mutation CreateInvoiceForForge($input: CreateInvoiceInput!) {
        createInvoiceForForge(input: $input) {
            publicId
            status
            amount
            dueAt
            paymentUrl
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

export const GET_INVOICES_FOR_FORGE: TypedDocumentNode<
    GetInvoicesResponse,
    GetInvoicesVariables
> = gql`
    query GetInvoicesForForge($pagination: InvoicePaginationInput!) {
        getInvoicesForForge(pagination: $pagination) {
            data {
                publicId
                status
                amount
                dueAt
                paidAt
                paymentUrl
                items {
                    publicId
                    type
                    description
                    amount
                    sortOrder
                }
                createdAt
            }
            pageInfo {
                endCursor
                hasNextPage
                total
                currentPage
                totalPages
            }
        }
    }
`;
