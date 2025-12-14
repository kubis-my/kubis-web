import { env } from "@repo/commons/constant/env";
import { graphql } from "@repo/commons/lib/graphql-api-route";

const api = graphql(env.NEXT_PUBLIC_ACCOUNT_GRAPHQL_URL);

export const GET = api.fetch
export const POST = api.fetch