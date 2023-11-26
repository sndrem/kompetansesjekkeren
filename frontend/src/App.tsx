import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {httpBatchLink} from "@trpc/react-query";
import React from "react";
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import {Button, Container, Header, Message} from "semantic-ui-react";
import {trpc} from "./api/trpcApi";
import "./App.scss";
import Hovedmeny from "./components/menu/hovedmeny";
import Sokpage from "./pages/sokpage";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url:
        process.env.NODE_ENV === "production"
          ? `${window.location.origin}`
          : "http://localhost:3000",
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
              <Infomelding />
              <Hovedmeny />
              <Routes>
                <Route path="/" element={<Sokpage />} />
                <Route path="/orgnr/:orgnr" element={<Sokpage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </HashRouter>
          </Container>
        </QueryClientProvider>
      </trpc.Provider>
    </>
  );
};

function Infomelding() {
  const mutation = trpc.slack.message.useMutation();
  const onClick = async () =>
    mutation.mutate({
      message:
        "Det var dumt at Kompetansesjekkeren skal legges ned 🥲\nTakk for trofast tjeneste 🫡",
    });

  return (
    <Message color="red">
      <Header>Kompetansesjekkeren legges ned</Header>
      <p>
        Kompetansesjekkeren vil bli utilgjengelig fra 1.1.2024 pga. lite tid til
        vedlikehold.
      </p>
      <Button color="blue" onClick={onClick}>
        Det var dumt, jeg bruker Kompetansesjekkeren ofte 🥲
      </Button>
    </Message>
  );
}

export default App;
