import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    STRIPE_API_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
    COZE_TOKEN: z.string().min(1).optional(),
    COZE_WORKFLOW_ID: z.string().min(1).optional(),
    COZE_API_BASE: z.string().url().optional(),
    // Optional: customize parameter key names expected by your Coze workflow
    COZE_PARAM_PROMPT_TYPE: z.string().min(1).optional(),
    COZE_PARAM_USER_QUERY: z.string().min(1).optional(),
    COZE_PARAM_IMAGE_ID: z.string().min(1).optional(),
    COZE_PARAM_IMAGE_URL: z.string().min(1).optional(),
    COZE_FILES_ENDPOINT: z.string().min(1).optional(),
    COZE_WORKFLOW_ENDPOINT: z.string().min(1).optional(),
    COZE_AUTH_SCHEME: z.string().min(1).optional(),
    COZE_IMAGE_ID_AS_JSON: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_BUSINESS_PRODUCT_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  },
  runtimeEnv: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    COZE_TOKEN: process.env.COZE_TOKEN,
    COZE_WORKFLOW_ID: process.env.COZE_WORKFLOW_ID,
    COZE_API_BASE: process.env.COZE_API_BASE,
    COZE_PARAM_PROMPT_TYPE: process.env.COZE_PARAM_PROMPT_TYPE,
    COZE_PARAM_USER_QUERY: process.env.COZE_PARAM_USER_QUERY,
    COZE_PARAM_IMAGE_ID: process.env.COZE_PARAM_IMAGE_ID,
    COZE_PARAM_IMAGE_URL: process.env.COZE_PARAM_IMAGE_URL,
    COZE_FILES_ENDPOINT: process.env.COZE_FILES_ENDPOINT,
    COZE_WORKFLOW_ENDPOINT: process.env.COZE_WORKFLOW_ENDPOINT,
    COZE_AUTH_SCHEME: process.env.COZE_AUTH_SCHEME,
    COZE_IMAGE_ID_AS_JSON: process.env.COZE_IMAGE_ID_AS_JSON,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID,
    NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
    NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_PRODUCT_ID:
      process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRODUCT_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PRICE_ID,
    NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID:
      process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PRICE_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
});
