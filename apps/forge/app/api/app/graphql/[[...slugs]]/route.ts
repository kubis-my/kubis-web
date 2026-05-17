import { env } from '@repo/commons/constant/env';
import { graphql } from '@repo/commons/lib/graphql-api-route';

const api = graphql(env.NEXT_PUBLIC_FORGE_SERVICE_GRAPHQL_URL, '/api/app/graphql');

export const GET = api.fetch;
export const POST = api.fetch;
