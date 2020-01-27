import ReactGA from 'react-ga';
import { Lenke } from '../types/domain';

if (process.env.NODE_ENV === "production") {
    ReactGA.initialize('UA-132749138-2');
} else {
    console.info("Initializer ikke Google Analytics i utvikling");
}

export function loggKlikk(lenke: Lenke) {
    ReactGA.event({
        category: "Lenker",
        action: `Bruker trykket på lenke ${lenke.tekst} for url=${lenke.url}`
    });
}

export { ReactGA };
