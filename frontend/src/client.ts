import {createTRPCProxyClient, httpBatchLink} from "@trpc/client";
import type {AppRouter} from "../../app";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:2022",
    }),
  ],
});
