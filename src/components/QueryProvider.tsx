import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React Query is only used by the dashboard and admin areas: this provider (and @tanstack/react-query) is loaded
// with those routes, not with the public pages.
const queryClient = new QueryClient();

const QueryProvider = ({ children }: { children: ReactNode }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

export default QueryProvider;
