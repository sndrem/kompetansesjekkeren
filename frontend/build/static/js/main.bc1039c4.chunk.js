(window.webpackJsonpkompetansesjekkeren=window.webpackJsonpkompetansesjekkeren||[]).push([[0],{166:function(e,t,r){e.exports=r(296)},171:function(e,t,r){},273:function(e,t,r){},295:function(e,t,r){},296:function(e,t,r){"use strict";r.r(t);var n=r(0),a=r.n(n),l=r(33),s=r.n(l),o=r(306),i=(r(171),r(96)),c=r(307),u=r(313),d=r(310),E=r(305),g=r(304),m=r(309),f=r(314),p=r(311),h=r(308);var A=function(){var e=Object(n.useContext)(w);if(!e.enhetsregisterResult)return null;var t=e.enhetsregisterResult;return a.a.createElement(p.a,null,a.a.createElement(h.a,null,a.a.createElement(h.a.Content,null,a.a.createElement(h.a.Header,null,t.navn," - Orgnr: ",t.organisasjonsnummer),a.a.createElement(h.a.Meta,null,t.organisasjonsform.beskrivelse),a.a.createElement(h.a.Description,null,a.a.createElement("dl",null,a.a.createElement("dt",null,"Registrert i MVA-registeret?"),a.a.createElement("dd",null,t.registrertIMvaregisteret?"Ja \u2705":"Nei \u274c"),a.a.createElement("dt",null,"Jobber med:"),a.a.createElement("dd",null,t.naeringskode1.beskrivelse.toLowerCase()),a.a.createElement("dt",null,"Antall ansatte:"),a.a.createElement("dd",null,t.antallAnsatte),a.a.createElement("dt",null,"Forretningsadresse"),a.a.createElement("dd",null,t.forretningsadresse.adresse[0],", ",t.forretningsadresse.postnummer," ",t.forretningsadresse.poststed),a.a.createElement("dt",null,"Ble stiftet:"),a.a.createElement("dd",null,t.stiftelsesdato))))))};var k=function(e){var t=e.erOkStatus?"green":"red";return e.erOkStatus,a.a.createElement(m.a,{color:t},a.a.createElement(m.a.Header,null,e.tittel),e.children)};var R=function(e){var t=Object(n.useContext)(w);if(t.loading)return a.a.createElement(g.a,{active:t.loading});var r=t.enhetsregisterResult;if(!r)return a.a.createElement(m.a,{color:"grey"},a.a.createElement(m.a.Header,null,"Enhetsregisteret"),a.a.createElement("p",null,"Fant ingen data for ",e.orgnr," i Enhetsregisteret"));var l=r.registrertIMvaregisteret,s="".concat(r.navn,l?" er registrert i MVA-registeret \u2705":" er ikke registrert i MVA-registeret \u274c");return a.a.createElement(k,{orgnr:e.orgnr,tittel:"MVA-register",erOkStatus:!!l},a.a.createElement("p",null,s))},T="/arbeidstilsynet",b="/sentralgodkjenning",O="/enhetsregisteret",N={error:"",loading:!1,submitted:!1,enhetsregisterResult:null,arbeidstilsynResult:null,sentralGodkjenningResultat:null},j=r(144),v=r(145),S=r.n(v);function _(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function y(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?_(r,!0).forEach(function(t){Object(j.a)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):_(r).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}function D(e,t){switch(t.type){case"DATA/HENTER_DATA":return y({},e,{loading:!0});case"DATA/SUBMITTED_FORM":return y({},e,{submitted:!0,loading:!0,error:""});case"ENHETSREGISTER/HENTET_FRA_ENHETSREGISTER_OK":return y({},e,{enhetsregisterResult:t.data,submitted:!0,loading:!1,error:""});case"ARBEIDSTILSYNET/HENTET_FRA_ARBEIDSTILSYNET_OK":return y({},e,{arbeidstilsynResult:t.data,submitted:!0,loading:!1,error:""});case"SENTRAL_GODKJENNING/HENTET_FRA_SENTRAL_GODKJENNING_OK":return y({},e,{sentralGodkjenningResultat:t.data,submitted:!0,loading:!1,error:""});case"DATA/HENTING_AV_DATA_ERROR":return y({},e,{loading:!1,error:t.error,submitted:!0});default:return S()(t),e}}var H=function(e){var t=Object(n.useContext)(w).arbeidstilsynResult;if(!t)return a.a.createElement(m.a,{color:"grey"},a.a.createElement(m.a.Header,null,"Arbeidstilsynet"),a.a.createElement("p",null,"Fant ingen data for ",e.orgnr," hos Arbeidstilsynet."));var r=t.RecordStatus.Valid?"".concat(t.Organisation.Name," har status: ").concat(t.RecordStatus.Status," - ").concat(t.RecordStatus.Description):"".concat(t.Organisation.Name," er ikke godkjent i renholdsregisteret.");return a.a.createElement(k,{tittel:"Renholdsregisteret",erOkStatus:t.RecordStatus.Valid,orgnr:e.orgnr},a.a.createElement("p",null,r))};var I=function(e){var t=Object(n.useContext)(w).sentralGodkjenningResultat;if(!t)return a.a.createElement(m.a,{color:"grey"},a.a.createElement(m.a.Header,null,"Sentral godkjenning"),a.a.createElement("p",null,"Fant ingen data for ",e.orgnr," hos Sentral godkjenning."));var r=t.status.approved?"".concat(t.enterprise.name," finnes i Sentral godkjenning \u2705"):"".concat(t.enterprise.name," er ikke sentralt godkjent \u274c.");return a.a.createElement(k,{tittel:"Sentral godkjenning",erOkStatus:t.status.approved,orgnr:e.orgnr},a.a.createElement("p",null,r),a.a.createElement("p",null,a.a.createElement("a",{href:t.status.approval_certificate},"Lenke til sertifikat")))},w=(r(273),a.a.createContext(N)),G=a.a.createContext({});var K=function(){var e=Object(n.useState)(""),t=Object(i.a)(e,2),r=t[0],l=t[1],s=Object(n.useReducer)(D,N),o=Object(i.a)(s,2),p=o[0],h=o[1];return a.a.createElement(G.Provider,{value:h},a.a.createElement(w.Provider,{value:p},a.a.createElement("div",{className:"sokeside"},a.a.createElement(c.a,{className:"sokeform",action:"#",onSubmit:function(e){return e.preventDefault()}},a.a.createElement(u.a,{as:"h1"},"Kompetansesjekk"),a.a.createElement("p",null,"Sjekk organisasjon opp mot ",a.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://www.brreg.no/"},"Br\xf8nn\xf8ysundregisteret (Enhetsregisteret)"),", ",a.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://sgregister.dibk.no/"},"Sentral godkjenning")," og Arbeidstilsynet sitt ",a.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:"https://www.arbeidstilsynet.no/registre/renholdsregisteret/sok/"},"renholdsregister"),"."),a.a.createElement(c.a.Field,null,a.a.createElement("label",null,"S\xf8k p\xe5 organisasjonsnummer"),a.a.createElement("input",{placeholder:"Organisasjonsnummer - 9 siffer",value:r,onChange:function(e){return l(e.currentTarget.value)},type:"text",id:"orgnr",maxLength:9,required:!0,"aria-describedby":"orgnr-sok"})),a.a.createElement(d.a,{primary:!0,className:"cta-btn",onClick:function(){9===r.length&&(h({type:"DATA/HENTER_DATA"}),fetch("".concat(O,"?organisasjonsnummer=").concat(r)).then(function(e){return e.json()}).then(function(e){var t=JSON.parse(e);h({type:"ENHETSREGISTER/HENTET_FRA_ENHETSREGISTER_OK",data:t._embedded.enheter.length>0?t._embedded.enheter[0]:null})}).catch(function(e){h({type:"DATA/HENTING_AV_DATA_ERROR",error:"Klarte ikke hente data fra Enhetsregisteret. Pr\xf8v igjen om en liten stund."})})),9===r.length&&(h({type:"DATA/HENTER_DATA"}),fetch("".concat(T,"?organisasjonsnummer=").concat(r)).then(function(e){return e.json()}).then(function(e){var t=JSON.parse(e);h({type:"ARBEIDSTILSYNET/HENTET_FRA_ARBEIDSTILSYNET_OK",data:t.length>0?t[0]:null})}).catch(function(e){h({type:"DATA/HENTING_AV_DATA_ERROR",error:"Klarte ikke hente data fra Arbeidstilsynet .Pr\xf8v igjen om en liten stund."})})),9===r.length&&(h({type:"DATA/HENTER_DATA"}),fetch("".concat(b,"?organisasjonsnummer=").concat(r)).then(function(e){return e.json()}).then(function(e){if(e){var t=JSON.parse(e);h({type:"SENTRAL_GODKJENNING/HENTET_FRA_SENTRAL_GODKJENNING_OK",data:t["dibk-sgdata"]})}}).catch(function(e){h({type:"DATA/HENTING_AV_DATA_ERROR",error:"Klarte ikke hente data fra Sentral godkjenning. Pr\xf8v igjen om en liten stund."})}))}},"S\xf8k"))),a.a.createElement(E.a,null),p.loading&&a.a.createElement(g.a,{active:p.loading}),p.error&&a.a.createElement(m.a,{color:"red"},a.a.createElement(m.a.Header,null,"Oisann ",a.a.createElement("span",{role:"img","aria-label":"Oisann-ikon"},"\ud83d\ude48")),p.error),p.enhetsregisterResult&&a.a.createElement(u.a,{as:"h3"},"Du har s\xf8kt p\xe5 ",p.enhetsregisterResult.navn," med orgnr: ",p.enhetsregisterResult.organisasjonsnummer),a.a.createElement(f.a,null,a.a.createElement(f.a.Column,{width:10},p.submitted&&a.a.createElement(R,{orgnr:r}),p.submitted&&a.a.createElement(H,{orgnr:r}),p.submitted&&a.a.createElement(I,{orgnr:r})),a.a.createElement(f.a.Column,{width:5},a.a.createElement(A,null)))))},P=function(){return a.a.createElement(o.a,null,a.a.createElement(K,null))};r(295);s.a.render(a.a.createElement(P,null),document.getElementById("root"))}},[[166,1,2]]]);
//# sourceMappingURL=main.bc1039c4.chunk.js.map