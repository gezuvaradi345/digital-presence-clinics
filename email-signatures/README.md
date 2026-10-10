# Roundcube e-mail-aláírás

A végleges HTML: `signature-varadisolutions.html`.
A logó publikus címe: https://varadisolutions.sk/assets/logo-signature.png

Statikus HTML/CSS/JavaScript projekt, framework és buildlépés nélkül. A gyökérben lévő `assets/` mappa közvetlenül szolgálja ki a PNG-t. A `.vercelignore` kizárja ezt az `email-signatures/` referenciamappát a Vercel-deployból; az aláírás nem kerül a weboldal felületére.

Roundcube: Beállítások → Identitások → ceo@varadisolutions.sk → HTML-aláírás. A szerkesztő forráskód nézetébe illeszd a HTML-fájl teljes tartalmát, majd mentsd. HTML-formátumú levélben ellenőrizd az eredményt.

Az aláírás táblázatos, inline stílusokkal, Arial/Helvetica betűtípussal, HTTPS PNG-vel és hagyományos e-mail-, web- és telefonlinkekkel készült. Outlook, Gmail és Apple Mail alapvető HTML-megjelenítéséhez igazodik. Valódi levelezőkliensekben küldési próbát nem végeztünk; egyes kliensek a külső képeket csak engedélyezés után töltik be.
