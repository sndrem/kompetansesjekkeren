import {createTRPCReact} from "@trpc/react-query";
import type {AppRouter} from "../../../app";

export const trpc = createTRPCReact<AppRouter>();
