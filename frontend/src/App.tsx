import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {Container} from "semantic-ui-react";
import "./App.scss";
import Feedback from "./components/feedback/feedback";
import Hovedmeny from "./components/menu/hovedmeny";
import Head2Head from "./pages/head2head";
import Sokpage from "./pages/sokpage";
import {trpc} from "./api/trpcApi";
import {httpBatchLink} from "@trpc/react-query";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:2022",
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
                <Route path="/sammenligning" exact component={Head2Head} />
                <Redirect from="*" to="/" />
              </Switch>
            </HashRouter>
            <Feedback />
          </Container>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
};

export default App;
