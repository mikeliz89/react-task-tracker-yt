# Käyttäjäkohtaisen datan migraatio

Sovellus lukee Realtime Database -tiedot polusta `/users/<Firebase Auth UID>/...`. Vanhoihin juuritason kokoelmiin ei pääse uusilla tietokantasäännöillä. Tee migraatio ja kuvien siirto ennen kuin otat uuden sovelluksen ja säännöt käyttöön.

## 1. Ota varmuuskopio ja tarkista UID-kartta

Vie Firebase Realtime Databasesta tuore JSON-varmuuskopio tiedostoon `D:\projects\react-task-tracker-yt\safe\backup.json` ja säilytä alkuperäinen palautusta varten. `safe`-kansio on `.gitignore`ssa, joten sen tiedostoja ei lisätä versionhallintaan.

Migraatio lukee `safe\email-to-uid.json`-tiedoston. Siinä `createdBy`-sähköposti vastaa Firebase Authenticationin UID:tä. `safe`-kansio on `.gitignore`ssa.

## 2. Luo `users.json` paikallisesti

Aja PowerShellissä projektin juuresta:

```powershell
cd D:\projects\react-task-tracker-yt
node .\scripts\migrate-user-data.js `
  ".\safe\backup.json" `
  ".\safe\email-to-uid.json" `
  ".\safe\users.json" `
  ".\safe\unresolved.json"
```

Tämä komento lukee varmuuskopion ja luo `safe`-kansioon `users.json`- ja `unresolved.json`-tiedostot. Se **ei muuta Firebase-tietokantaa**. `users.json` sisältää ylimpänä avaimena `users`:

```json
{ "users": { "<uid>": { "tasklists": {} } } }
```

Jos omistajaa ei voi päätellä, skripti käyttää varaomistajaa `miikako89@gmail.com` (UID `2R6C4xudIrgZGtSQvwBYW4sbfZH2`). Tämä koskee myös `createdBy`-sähköposteja, joille ei ole UID:tä kartassa. Skripti tulostaa varaomistajalle annettujen tietueiden määrän.

## 3. Tarkista tulos

```powershell
Get-Content .\safe\unresolved.json
Get-Content .\safe\users.json -TotalCount 10
```

`unresolved.json` on tavallisesti `[]`. Jos siinä on virheellisiä tietueita, skripti palauttaa exit-koodin 2. Tarkista myös varaomistajalle annettujen tietueiden määrä ennen tuontia.

Jos yksittäinen tietue kuuluu toiselle käyttäjälle, luo `safe\owner-overrides.json` esimerkiksi näin:

```json
{ "tasklists": { "old-list-id": "firebase-auth-uid" } }
```

Aja vaiheen 2 komento uudelleen ja lisää `".\safe\owner-overrides.json"` viimeiseksi eli viidenneksi argumentiksi. Päätietueen omistaja määrää myös siihen liittyvien alitietueiden omistajan.

## 4. Tuo tiedot Firebaseen

Kun varmuuskopio ja tulos on tarkistettu, tuo `users.json` tietokannan juureen:

```powershell
firebase database:update / .\safe\users.json --project lifesaver-production-new
```

Komento korvaa olemassa olevan `/users`-solmun, mutta säilyttää muut juuritason solmut. Älä käytä `firebase database:set /` -komentoa tähän tiedostoon, sillä se korvaisi koko tietokannan juuren. Varmista tuonnin jälkeen kahdella eri testitunnuksella, että kumpikin näkee vain omat tietonsa.

## Kuvat ja käyttöönotto

Vanhat Firebase Storage -kuvat on siirrettävä vanhoista juuripoluista polkuihin `/users/<uid>/...`, ja migroitujen tietueiden kuvaosoitteet on päivitettävä. Uudet Storage-säännöt estävät SDK:n pääsyn vanhoihin juuripolkuihin. Vanha latausosoite voi silti toimia sen tietävälle henkilölle, kunnes lataustunnus kumotaan tai vanha tiedosto poistetaan. Uudet profiilikuvat tallennetaan polkuun `/users/<uid>/avatar.png`.

Julkaise sovellus, Realtime Database -säännöt ja Storage-säännöt yhdessä vasta migraation ja kuvatarkistuksen jälkeen. Säilytä varmuuskopio, UID-kartta, mahdollinen override-tiedosto ja tuotetut JSON-tiedostot poissa versionhallinnasta, koska ne sisältävät henkilötietoja.
