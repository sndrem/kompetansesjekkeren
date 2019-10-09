import ReactGA from 'react-ga';

if (process.env.NODE_ENV === "production") {
    ReactGA.initialize('UA-132749138-2');
    ReactGA.pageview(window.location.pathname + window.location.search);
}

export { ReactGA };
