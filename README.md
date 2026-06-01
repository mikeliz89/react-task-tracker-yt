npm install json-server (or globally npm install -g json-server)

# React Life Saver App

Tämä projekti pohjautuu YouTube-tutoriaaliin: https://www.youtube.com/watch?v=w7ejDZ8SWv8&t=1730

## Ympäristön asennus

1. Asenna [Node.js](https://nodejs.org/)
2. Päivitä npm tarvittaessa:  
   npm install -g npm

## Käynnistys ja kehitys

### Kehityspalvelin
	npm start
Avaa selain osoitteeseen [http://localhost:3000](http://localhost:3000)

### Node.js 22+ ja Webpack 4
Jos käytät Node.js versiota 22 tai uudempaa, lisää ympäristömuuttuja:
	set NODE_OPTIONS=--openssl-legacy-provider && npm start
	set NODE_OPTIONS=--openssl-legacy-provider && npm run build

## JSON-server (mock backend)
Asenna:
	npm install json-server
Käynnistä:
	json-server --watch db.json -p 5000

## Rakennus tuotantoon
	npm run build
Tuotantorakennetta voi testata paikallisesti:
	npm install -g serve
	serve -s build -p 8000

## Testit
	npm test
Esimerkki (aja testit kerran ilman watch-tilaa):
	set CI=true && npm run test -- --watchAll=false
Esimerkki (aja vain DateTimeUtils-testi):
	set CI=true && npm run test -- --watchAll=false DateTimeUtils.test.js

## Eject (ei suositella)
	npm run eject
**Huom:** Eject on peruuttamaton toimenpide.

---

## Hyödyllisiä linkkejä ja ohjeita

- [Create React App dokumentaatio](https://facebook.github.io/create-react-app/docs/getting-started)
- [React dokumentaatio](https://reactjs.org/)
- [ES7 React/Redux/GraphQL/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)

### Firebase
Asenna:
	npm install --save firebase
	npm install -g firebase-tools

Luo .env.local-tiedosto ja lisää:
	REACT_APP_FIREBASE_API_KEY="[ApiKeyHere]"
	REACT_APP_FIREBASE_PROJECT_ID="[ProjectIdHere]"

Kirjaudu Firebaseen:
	firebase login

Deploy:
	firebase deploy

Projektin vaihto:
	firebase use [projectID]

### Hyödyllisiä Firebase-linkkejä
- [Firebase authentication video](https://www.youtube.com/watch?v=PKwu15ldZ7k)

### i18next (kielituki)
- [i18next getting started](https://react.i18next.com/getting-started)
- [i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector)
- [i18next-http-backend](https://github.com/i18next/i18next-http-backend)

### FontAwesome React v5
- [FontAwesome React v5 docs](https://fontawesome.com/v5/docs/web/use-with/react)
