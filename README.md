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

Mind a tíz szolgáltatás külön, statikus oldalt kapott magyar, szlovák és angol nyelven. A menü és a kategóriaoldalak ezekre mutatnak. Az oldalak előnyöket, szolgáltatási tartalmat, öt folyamatlépést, árpanelt, gyakori kérdéseket és ajánlatkérést tartalmaznak.

- Szövegek: `content/services.json`, nyelvenként a `pages` kulcs alatt.
- Árak: `content/service-prices.json`. Az `amount` értéke jelenleg `null`, ezért az oldalon „Egyedi ajánlat” jelenik meg. A végleges euróösszeget számként kell megadni; havi szolgáltatásnál automatikusan megjelenik a havi egység. Minden nyelv ugyanazt az összeget használja.
- Újragenerálás: `python3 scripts/build-service-pages.py`.
- Megjelenés: `service-page.css`. A generátor a meglévő kategóriaoldalak fejlécét használja, így a közös navigációt először azokban kell frissíteni.

A részletes oldalak HTML-fájljai generáltak; tartalmi módosításhoz a JSON-forrást és az újragenerálást használjuk. Az ajánlatkérő gombok a választott szolgáltatást a főoldali űrlaphoz továbbítják.
