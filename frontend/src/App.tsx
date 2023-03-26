import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {Container} from "semantic-ui-react";
import Hovedmeny from "./components/menu/hovedmeny";
import Sokpage from "./pages/sokpage";
import {trpc} from "./api/trpcApi";
import {httpBatchLink} from "@trpc/react-query";
import "./App.scss";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url:
        process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000",
    }),
  ],
});

const App: React.FC = () => {
  return (
    <>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Container>
            <HashRouter>
              <Hovedmeny />
              <Switch>
                <Route path="/" exact component={Sokpage} />
                <Route path="/orgnr/:orgnr" exact component={Sokpage} />
                <Redirect from="*" to="/" />
              </Switch>
            </HashRouter>
          </Container>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
};

export default App;
