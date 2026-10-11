# Gejza Váradi - Digital Solutions

Portfólió és bemutatkozó weboldal a Gejza Váradi - Digital Solutions számára.

Élő oldal: https://varadisolutions.sk/

## Fő fókusz

- weboldalak és webshopok készítése
- közösségi jelenlét és hirdetéskezelés
- digitális karbantartás és gondozás
- kiemelt saját projekt: Vecora apróhirdető platform

## Slogan

„Komplex diagnosztika és célzott terápia vállalkozása digitális jelenlétéhez.”

## Technológia

Statikus HTML, CSS és JavaScript alapú oldal, Vercelre vagy más statikus tárhelyre azonnal deployolható.

## Nyelvi változatok

- Magyar: `/`
- Szlovák: `/sk/`
- Angol: `/en/`

Mindhárom változat tartalmazza a főoldalt és az interaktív weboldalbemutatót. A fejléc nyelvváltója ugyanazon aloldal másik nyelvi változatára vezet. A főoldali űrlap visszajelzései is a kiválasztott nyelven jelennek meg.

## Szolgáltatásoldalak

Mind a tizenegy szolgáltatás külön, statikus oldalt kapott magyar, szlovák és angol nyelven. A menü és a kategóriaoldalak ezekre mutatnak. Az oldalak előnyöket, szolgáltatási tartalmat, öt folyamatlépést, árpanelt, gyakori kérdéseket és ajánlatkérést tartalmaznak.

- Szövegek: `content/services.json`, nyelvenként a `pages` kulcs alatt.
- Árak: `content/service-prices.json`. Az `amount` értéke jelenleg `null`, ezért az oldalon „Egyedi ajánlat” jelenik meg. A végleges euróösszeget számként kell megadni; havi szolgáltatásnál automatikusan megjelenik a havi egység. Minden nyelv ugyanazt az összeget használja.
- Újragenerálás: `python3 scripts/build-service-pages.py`.
- Megjelenés: `service-page.css`. A generátor a meglévő kategóriaoldalak fejlécét használja, így a közös navigációt először azokban kell frissíteni.

A részletes oldalak HTML-fájljai generáltak; tartalmi módosításhoz a JSON-forrást és az újragenerálást használjuk. Az ajánlatkérő gombok a választott szolgáltatást a főoldali űrlaphoz továbbítják.

## Interaktív szolgáltatásbemutatók

Minden szolgáltatásoldal saját, helyben működő bemutatót tartalmaz. A weboldal- és bérleti mintában szekciók és űrlap, a közösségimédia-mintában telefonos profil, posztok és lapozható storyk, a webshopban termékek és kosár próbálható ki. A többi szolgáltatáshoz kampánycél-választó, karbantartási lépéssor, keresési előnézet, kampányoldali űrlap, arculatválasztó és előtte–utána auditminta tartozik.

- Fordítások és magyarázatok: `content/service-demos.json`.
- Működés és stílus: `service-demos.js`, `service-demos.css`.
- Beépítés: `scripts/build-service-pages.py`, ugyanazzal az újragenerálási paranccsal.
- AI-képek és generálási promptok: `assets/service-demos/README.md`.

A minták nem küldenek űrlapot, nem indítanak valódi kampányt és nem hoznak létre rendelést. Az adatok, reakciók és kosárállapot kizárólag az adott oldal helyi bemutatóállapotában élnek. A felugró ablakok Escape-pel bezárhatók, a bemutatók az Újrakezdés gombbal alaphelyzetbe állíthatók.

A „Komplett üzleti arculat” (`o-business`, `komplett-uzleti-arculat.html`) egyszeri csomagként szerepel a kínálatban. Saját bemutatója végigveszi a weboldalt, SEO-t, közösségi indulást, logót, email-aláírást és a nyomtatott arculat terveit. A „Csak most” panel szövege a szolgáltatás `offerLabel`, `offerTitle`, `offerText` mezőiben szerkeszthető.
