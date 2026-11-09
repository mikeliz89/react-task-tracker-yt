# AI-ohjeet: asiakaskohtaiset tehtävälistat

Tämä dokumentti ohjaa Codexia ja muita tekoälyavustajia, kun Lifesaver-sovellukseen suunnitellaan tai
toteutetaan asiakaskohtaista tehtävien hallintaa. Se kuvaa tavoitellun käyttötavan ja tärkeät
toteutusperiaatteet; se ei tarkoita, että ominaisuus olisi jo toteutettu.

## Tavoite

Lifesaveriin halutaan kevyt huolto- ja tehtävienhallinta, jossa käyttäjä voi:

- liittää asiakkaan olemassa olevaan **Ihmiset**-osioon
- hallita asiakkaan tehtäviä nykyisten tehtävälistojen ja tehtävien avulla
- lisätä tehtäviä valmiista tehtäväpohjista, esimerkiksi “Tarkista palovaroittimet”
- asettaa tehtävälle määräpäivän ja merkitä sen valmiiksi
- nostaa muistutuksissa esiin tehtävät, joiden määräpäivä on tänään
- lähettää käyttäjälle sähköpostimuistutuksen avoimista, tänään erääntyvistä tehtävistä
- tarkastella tehtäviä asiakaskohtaisesti tai kaikkia asiakkaita yhdessä
- järjestää yhteisen tehtävänäkymän määräpäivän mukaan niin, että myöhässä olevat ja lähestyvät tehtävät erottuvat.

Tämän käyttötavan ensisijainen ratkaisu on liittää tehtävälista asiakkaaseen. Listan tehtävät kuuluvat
siten samalle asiakkaalle ilman, että jokaiselle tehtävälle tarvitaan erillinen asiakasviittaus.
Tehtäväpohjasta luodaan tavallinen muokattava tehtävä asiakkaan listalle.

## Nykyinen sovellus

Ennen muutoksia tarkista koodi ja varmista, että olet ymmärtänyt ajantasaisen rakenteen. Sovellus on
React-sovellus, jossa käytetään React Routeria, Bootstrapia, i18nextiä ja Firebasea.

- Tehtävälistojen ja tehtävien toteutus on pääosin `src/components/TaskList/`-hakemistossa.
- Tehtävälistat ja tehtävät tallennetaan Firebaseen `src/utils/Constants.js`-tiedoston `DB`-polkujen avulla.
- Henkilöihin liittyvät näkymät ja tietomallit löytyvät `src/components/People/`-hakemistosta, jos hakemiston rakenne on edelleen sama.
- Reitit määritellään `src/routes/AppRoutes.js`-tiedostossa.
- Kielitekstit ovat i18next-resursseissa; tue vähintään suomea ja englantia.

Tarkista todelliset hakemistot ja tietomallit ennen oletuksia. Älä kopioi henkilötietoja tehtäviin
tarpeettomasti, vaan tallenna viittaus henkilön tunnisteeseen. Varmista myös, miten sovelluksen
käyttäjäkohtaiset Firebase-polut ja tietoturvasäännöt toimivat.

## Tuote- ja UX-periaatteet

1. **Säilytä nykyinen tehtävälistamalli.** Asiakaslinkki kuuluu ensisijaisesti tehtävälistaan. Lisää
   tehtävätason asiakasviittaus vain, jos olemassa oleva käyttö vaatii eri asiakkaiden tehtäviä samalla
   listalla.
2. **Tehtäväpohjat ovat lähtökohtia, eivät suorituksia.** Pohjan käyttäminen luo uuden tehtävän.
   Asiakkaan tehtävän päivämäärän, tilan tai tekstin muuttaminen ei saa muuttaa pohjaa.
3. **Määräpäivä ohjaa kiireellisyysjärjestystä.** Älä lisää erillistä kiireellisyysarvoa ilman
   perusteltua tarvetta. Näytä vähintään myöhässä olevat, tänään erääntyvät ja tulevat avoimet tehtävät
   selkeästi.
4. **Nosta tämän päivän tehtävät muistutuksiin.** Avoimet tehtävät, joiden määräpäivä on tänään, pitää
   nostaa muistutusnäkymässä selkeästi esiin. Valmiita tehtäviä ei nosteta avoimien tehtävien
   muistutukseen. Tarkista ensin sovelluksen nykyinen muistutusmekanismi ja sovita toiminta siihen.
5. **Tue sähköpostimuistutuksia turvallisesti.** Käyttäjä voi ottaa käyttöön sähköpostimuistutukset
   avoimista tänään erääntyvistä tehtävistä ja määrittää sopivan lähetysajan, jos järjestelmä tukee
   ajastusta. Lähetä viestit palvelinpuolisesta taustatoiminnosta sähköpostipalvelun kautta; älä
   lähetä sähköpostia suoraan React-sovelluksesta tai paljasta palvelun salaisuuksia selaimelle.
   Noudata käyttäjän asetuksia ja aikavyöhykettä. Estä saman tehtävämuistutuksen tahaton
   uudelleenlähetys ja ohita valmiit tehtävät. Selvitä ensin, onko projektissa jo taustapalvelu tai
   sähköpostipalvelu käytössä; älä oleta push-ilmoituksia tai ajastettua toimintoa, jos niitä ei ole.
6. **Valmis työ pitää voida tarkistaa myöhemmin.** Älä kadota valmistuneita töitä oletusnäkymän
   suodatuksessa tai arkistoinnissa. Säilytä valmistumis- ja asiakasyhteys sovelluksen nykyisten
   arkistointikäytäntöjen mukaisesti.
7. **Pidä näkymät yksinkertaisina.** Aloita asiakaskohtaisesta näkymästä ja kaikkien asiakkaiden
   määräpäivän mukaan järjestetystä tehtävälistasta. Kuukausikalenteriruudukko on jatkokehitysaskel,
   ellei sitä nimenomaisesti pyydetä.
8. **Tee valinnat saavutettaviksi ja käännettäviksi.** Käytä olemassa olevia
   käyttöliittymäkomponentteja, teemoja ja i18next-avaimia; älä lisää käyttöliittymään vain
   suomenkielisiä kovakoodattuja tekstejä.

## Toteutusohjeita

- Selvitä ensin tehtävälistan luonti- ja muokkauslomakkeet, henkilöiden tietomalli, tehtävän päiväyksen nykyinen formaatti sekä listojen arkistointi.
- Suosi pientä, olemassa oleviin rakenteisiin sopivaa muutosta. Vältä rinnakkaisen asiakas- tai tehtäväjärjestelmän rakentamista.
- Asiakasviittauksen tulee kestää tilanteet, joissa henkilö poistetaan tai ei enää ole saatavilla.
  Näytä tarvittaessa, että asiakaslinkki puuttuu; älä kaada listanäkymää.
- Määrittele päivämäärän lajittelu ja suodatus yksiselitteisesti. Tyhjällä määräpäivällä olevat
  tehtävät näytetään johdonmukaisesti esimerkiksi päivämäärällisten jälkeen.
- Noudata käyttäjäkohtaista tietojen eristystä. Asiakas- ja tehtävätietoja ei saa lukea tai kirjoittaa toisen käyttäjän polkuun.
- Älä muuta tietoturvasääntöjä löyhemmiksi ominaisuuden helpottamiseksi.
- Huomioi vanhat tietueet: uuden asiakasviittauksen puuttuminen ei saa rikkoa olemassa olevia tehtävälistoja.
- Jos tehtäväpohjat tallennetaan Firebaseen, varmista että nekin ovat käyttäjäkohtaisia ja että
  luodusta tehtävästä kopioidaan vain tarkoituksenmukaiset kentät.

## Hyväksymiskriteerit ominaisuutta toteutettaessa

- Tehtävälistan voi liittää olemassa olevaan henkilöön ja linkin voi nähdä listalla.
- Tehtävälistan tehtävät näkyvät kyseisen asiakkaan tehtävinä.
- Käyttäjä voi lisätä tehtävän pohjasta muuttamatta pohjaa.
- Tehtävälle voi asettaa tai vaihtaa määräpäivän ja merkitä sen valmiiksi.
- Avoimet tänään erääntyvät tehtävät nostetaan muistutuksissa esiin, eikä valmiita tehtäviä näytetä
  avoimien tehtävien muistutuksina.
- Käyttäjä voi ottaa sähköpostimuistutukset käyttöön ja määrittää lähetysajan, jos ajastettu lähetys
  toteutetaan.
- Sähköpostimuistutukset lähetetään palvelinpuolisesti käyttäjän asetuksia ja aikavyöhykettä
  noudattaen; valmiista tehtävistä ei lähetetä muistutuksia eikä samaa muistutusta lähetetä
  toistuvasti vahingossa.
- Yhteisnäkymä kokoaa asiakkaiden avoimet tehtävät ja lajittelee ne määräpäivän mukaan.
- Käyttäjä voi rajata näkymän asiakkaaseen ja määräpäivään tai päivämääräväliin.
- Vanhat listat ilman asiakaslinkkiä toimivat edelleen.
- Käyttöliittymätekstit ovat käännettävissä suomeksi ja englanniksi, ja näkymä toimii sovelluksen
  nykyisillä teemoilla.
- Firebase-käyttö noudattaa nykyistä käyttäjäkohtaista polkurakennetta ja tietoturvasääntöjä.

## Työskentelytapa tekoälyavustajalle

Kun käyttäjä pyytää ominaisuuden toteutusta, älä tyydy tämän dokumentin lukemiseen: tarkasta nykyinen
koodi ja noudata projektin mahdollisia `AGENTS.md`-ohjeita. Tee rajattu toteutussuunnitelma, säilytä
yhteensopivuus nykyisten tietojen kanssa ja kerro lopuksi muuttuneet tiedostot sekä mahdolliset
rajoitteet. Älä väitä ominaisuutta valmiiksi testaamatta sitä, jos käyttäjä pyytää testausta tai
varmennusta.
