"""Build the 30 static service pages: python3 scripts/build-service-pages.py."""
from pathlib import Path
import json
import re
from html import escape

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'content/services.json').read_text())
PRICES = json.loads((ROOT / 'content/service-prices.json').read_text())
ROUTES = {
    'm-web': 'weboldalberles.html', 'm-social': 'kozossegimedia-kezeles.html',
    'm-ads': 'hirdeteskezeles.html', 'm-care': 'weboldalkarbantartas.html',
    'm-content': 'tartalom-es-seo.html', 'o-web': 'weboldalkeszites.html',
    'o-shop': 'webshopkeszites.html', 'o-landing': 'kampanyoldal.html',
    'o-brand': 'digitalis-arculat.html', 'o-audit': 'digitalis-audit.html',
}
CATEGORIES = {'m': 'havi-szolgaltatasok.html', 'o': 'egyszeri-szolgaltatasok.html'}
UI = {
 'hu': dict(home='Főoldal', benefit='Miért érdemes belevágni?', audience='Kinek ajánljuk?', includes='Mit tartalmaz a szolgáltatás?', process='Így dolgozunk együtt', processLead='Lépésről lépésre, egyeztetett feladatokkal és jóváhagyási pontokkal.', pricing='Árak és ajánlat', price='Egyedi ajánlat', monthly='Havi díj', once='Egyszeri projektdíj', unit=' / hó', priceIntro='A díj az Ön igényeihez igazodik. Az alábbi szempontok alapján állítjuk össze a pontos ajánlatot.', factors='Mi határozza meg az árat?', scope='Amit előre tisztázunk', priceNote='A végleges ajánlatban rögzítjük a pontos tartalmat, a díjat és a fizetési feltételeket.', faq='Még felmerülhet Önben', q1='Hogyan indul az együttműködés?', a1='Írja meg röviden, mire van szüksége. Átbeszéljük a célt, a meglévő anyagokat és az elvárt határidőt, majd ezek alapján készítünk ajánlatot.', q2='Mikor készül el, illetve mikor indul a munka?', a2='Az ütemezést a feladat mérete, a hozzáférések, a tartalmak és a jóváhagyások alapján egyeztetjük. A vállalt lépéseket és határidőket az ajánlatban rögzítjük.', promo='Kezdjük azzal, amire vállalkozásának valóban szüksége van.', promoText='Mondja el a célját. Segítünk meghatározni a megfelelő tartalmat, a következő lépéseket és a hozzájuk tartozó díjat.', proof='Nézze meg munkáinkat', details='Részletes bemutatás', other='Más konstrukciót keres?', otherRental='Weboldal havi díjas bérléssel', otherOwn='Weboldal saját tulajdonba', nav='Az oldal tartalma', plan='Az együttműködés alapja', facts='Személyre szabott tartalom|Egyeztetett munkafolyamat|Átlátható ajánlat'),
 'sk': dict(home='Úvod', benefit='Prečo sa do toho pustiť?', audience='Pre koho je služba?', includes='Čo služba zahŕňa?', process='Ako spolupracujeme', processLead='Krok za krokom, s dohodnutými úlohami a schvaľovaním.', pricing='Cena a ponuka', price='Individuálna ponuka', monthly='Mesačný poplatok', once='Jednorazová cena projektu', unit=' / mesiac', priceIntro='Cena sa prispôsobí vašim potrebám. Presnú ponuku pripravíme podľa nasledujúcich kritérií.', factors='Čo určuje cenu?', scope='Čo si vopred ujasníme', priceNote='V konečnej ponuke stanovíme presný rozsah, cenu a platobné podmienky.', faq='Časté otázky', q1='Ako sa začína spolupráca?', a1='Stručne nám napíšte, čo potrebujete. Preberieme cieľ, dostupné podklady a požadovaný termín a pripravíme ponuku.', q2='Kedy bude práca hotová alebo kedy sa začne?', a2='Termíny dohodneme podľa rozsahu, prístupov, obsahu a schvaľovania. Kroky a termíny uvedieme v ponuke.', promo='Začnime tým, čo vaše podnikanie skutočne potrebuje.', promoText='Povedzte nám svoj cieľ. Pomôžeme určiť vhodný rozsah, ďalšie kroky a cenu.', proof='Pozrite si naše práce', details='Podrobný prehľad', other='Hľadáte inú formu spolupráce?', otherRental='Web na mesačný prenájom', otherOwn='Web do vlastného vlastníctva', nav='Obsah stránky', plan='Základ spolupráce', facts='Rozsah podľa potrieb|Dohodnutý postup|Prehľadná ponuka'),
 'en': dict(home='Home', benefit='Why take the next step?', audience='Who is it for?', includes='What is included?', process='How we work together', processLead='Step by step, with agreed tasks and approval points.', pricing='Pricing and proposal', price='Tailored quote', monthly='Monthly fee', once='One-time project fee', unit=' / month', priceIntro='The fee reflects your needs. We use the following factors to prepare an accurate proposal.', factors='What determines the price?', scope='What we agree upfront', priceNote='Your final proposal specifies the exact scope, fee and payment terms.', faq='Questions you may have', q1='How does the collaboration start?', a1='Briefly tell us what you need. We discuss the goal, available materials and desired deadline, then prepare a proposal.', q2='When will the work be completed or started?', a2='We agree on a schedule based on scope, access, content and approvals. The proposal sets out the steps and deadlines.', promo='Start with what your business actually needs.', promoText='Tell us your goal. We will help define the right scope, next steps and associated fee.', proof='Explore our work', details='Full service details', other='Looking for another arrangement?', otherRental='Rent a website monthly', otherOwn='Own your website', nav='On this page', plan='The basis of our partnership', facts='Scope tailored to you|An agreed process|A clear proposal'),
}

def esc(value):
    return escape(str(value), quote=True)

def pairs(value):
    return [part.split('~', 1) for part in value.split('|')]

def update_links(text):
    for key, route in ROUTES.items():
        plan, service = key.split('-')
        text = text.replace(f'href="{CATEGORIES[plan]}#{service}"', f'href="{route}" data-service="{key}"')
    return text

def create_page(lang, key, item, template):
    d, ui, content = DATA[lang], UI[lang], DATA[lang]['pages'][key]
    plan = key[0]
    route = ROUTES[key]
    _, name, description, included = item
    category = d['monthly' if plan == 'm' else 'once']
    prefix = '' if lang == 'hu' else '../'
    enquiry = f'index.html?service={key}#contact'
    header = re.search(r'<header\b.*?</header>', template, re.S)[0]
    header = update_links(header)
    for l in DATA:
        path = '' if l == 'hu' else l + '/'
        header = header.replace(f'href="/{path}{CATEGORIES[plan]}"', f'href="/{path}{route}"')
    head = template[:template.index('<body')]
    head = re.sub(r'<title>.*?</title>', f'<title>{esc(name)} — Gejza Váradi - Digital Solutions</title>', head)
    head = re.sub(r'(<meta\s+name="description"\s+content=")[^"]*', lambda m: m[1] + esc(description), head)
    head = head.replace(CATEGORIES[plan], route)
    head = head.replace('</head>', f'  <link rel="stylesheet" href="{prefix}service-page.css?v=1" />\n  </head>')
    benefits = ''.join(f'<article class="detail-panel glass"><span class="panel-index" aria-hidden="true">0{i}</span><h3>{esc(title)}</h3><p>{esc(body)}</p></article>' for i, (title, body) in enumerate(pairs(content['benefits']), 1))
    steps = ''.join(f'<li><span class="step-number" aria-hidden="true">0{i}</span><div><h3>{esc(title)}</h3><p>{esc(body)}</p></div></li>' for i, (title, body) in enumerate(pairs(content['steps']), 1))
    inclusions = ''.join(f'<li>{esc(value)}</li>' for value in included.split('|'))
    factors = ''.join(f'<li>{esc(value)}</li>' for value in content['factors'].split('|'))
    facts = ''.join(f'<li>{esc(value)}</li>' for value in ui['facts'].split('|'))
    amount = PRICES[key]['amount']
    # No invented prices: empty amounts render as a tailored-quote label.
    price = ui['price'] if amount is None else f'{esc(amount)} €' + (ui['unit'] if plan == 'm' else '')
    crosslink = ''
    if key in ('m-web', 'o-web'):
        other = 'o-web' if plan == 'm' else 'm-web'
        crosslink = f'<p class="alternative-plan">{ui["other"]} <a href="{ROUTES[other]}">{ui["otherOwn" if plan == "m" else "otherRental"]}</a></p>'
    example = f'<a class="text-link" href="weboldalak.html">{d["examples"]} ↗</a>' if key in ('m-web', 'o-web', 'o-shop', 'o-landing') else ''
    return f'''{head}
<body class="service-detail-page">
  <div class="ambient" aria-hidden="true"><span class="orb orb--blue"></span><span class="orb orb--mint"></span><span class="grain"></span></div>
  {header}
  <main class="detail-main">
    <nav class="section-shell detail-breadcrumb" aria-label="{ui['nav']}"><a href="index.html">{ui['home']}</a><span aria-hidden="true">/</span><a href="{CATEGORIES[plan]}">{category}</a></nav>
    <section class="section-shell detail-hero">
      <div class="detail-hero__copy">
        <span class="kicker">{esc(name)}</span>
        <h1>{esc(content['headline'])}</h1>
        <p class="detail-lead">{esc(description)}</p>
        <div class="detail-actions"><a class="button button--primary" href="{enquiry}">{d['cta']} →</a><a class="text-link" href="#pricing">{ui['pricing']}</a></div>
      </div>
      <aside class="detail-overview glass">
        <span class="kicker">{ui['plan']}</span><h2>{category}</h2>
        <ul class="detail-checklist">{facts}</ul>
        <p>{esc(content['audience'])}</p><a class="text-link" href="#process">{ui['process']} ↓</a>
      </aside>
    </section>
    <nav class="section-shell detail-jumps" aria-label="{ui['nav']}"><a href="#benefits">{ui['benefit']}</a><a href="#included">{ui['includes']}</a><a href="#process">{ui['process']}</a><a href="#pricing">{ui['pricing']}</a></nav>
    <section class="section-shell detail-section" id="benefits">
      <div class="detail-heading"><span class="kicker">{esc(name)}</span><h2>{ui['benefit']}</h2><p>{esc(content['explanation'])}</p></div>
      <div class="detail-benefits">{benefits}</div>
    </section>
    <section class="section-shell detail-section detail-delivery" id="included">
      <div class="detail-panel glass"><span class="kicker">{ui['includes']}</span><h2>{esc(name)}</h2><ul class="detail-checklist">{inclusions}</ul>{example}</div>
      <div class="detail-panel detail-scope"><h2>{ui['scope']}</h2><p>{esc(content['scope'])}</p>{crosslink}</div>
    </section>
    <section class="section-shell detail-section" id="process">
      <div class="detail-heading"><span class="kicker">01 — 05</span><h2>{ui['process']}</h2><p>{ui['processLead']}</p></div>
      <ol class="detail-process">{steps}</ol>
    </section>
    <section class="section-shell detail-section detail-pricing glass" id="pricing">
      <div class="price-summary"><span class="kicker">{ui['pricing']}</span><h2>{ui['monthly' if plan == 'm' else 'once']}</h2>
        <!-- Price source: content/service-prices.json → {key}.amount -->
        <p class="price-value" data-price-service="{key}">{price}</p><p>{ui['priceIntro']}</p><a class="button button--primary" href="{enquiry}">{d['cta']} →</a>
      </div>
      <div class="price-factors"><h3>{ui['factors']}</h3><ul class="detail-checklist">{factors}</ul><p>{ui['priceNote']}</p></div>
    </section>
    <section class="section-shell detail-section detail-faq"><h2>{ui['faq']}</h2><details><summary>{ui['q1']}</summary><p>{ui['a1']}</p></details><details><summary>{ui['q2']}</summary><p>{ui['a2']}</p></details></section>
    <section class="section-shell detail-promo"><span class="kicker">Gejza Váradi · Digital Solutions</span><h2>{ui['promo']}</h2><p>{ui['promoText']}</p><div class="detail-actions"><a class="button" href="{enquiry}">{d['cta']} →</a><a class="text-link" href="index.html#work">{ui['proof']}</a></div></section>
  </main>
  <footer class="footer section-shell"><a href="{CATEGORIES[plan]}">{category}</a><p>© <span id="year"></span> Gejza Váradi - Digital Solutions</p></footer>
  <script src="{prefix}script.js?v=9"></script>
</body>
</html>
'''

for lang, d in DATA.items():
    folder = ROOT if lang == 'hu' else ROOT / lang
    for plan in ('m', 'o'):
        template = (folder / CATEGORIES[plan]).read_text()
        for item in d[plan]:
            key = plan + '-' + item[0]
            (folder / ROUTES[key]).write_text(create_page(lang, key, item, template))

# Route the existing menus, home-page lists and category cards to the detail pages.
for lang in DATA:
    folder = ROOT if lang == 'hu' else ROOT / lang
    for filename in ('index.html', 'weboldalak.html', *CATEGORIES.values()):
        path = folder / filename
        text = update_links(path.read_text()).replace('script.js?v=8', 'script.js?v=9')
        if filename in CATEGORIES.values():
            plan = next(key for key, value in CATEGORIES.items() if value == filename)
            for service, title, _, _ in DATA[lang][plan]:
                key = plan + '-' + service
                title_markup = f'<h2>{title}</h2>'
                text = text.replace(title_markup, f'<h2><a href="{ROUTES[key]}">{title}</a></h2>')
                marker = f'<a class="text-link" href="index.html?service={key}#contact">'
                detail = f'<a class="text-link service-detail-link" href="{ROUTES[key]}">{UI[lang]["details"]} →</a>'
                if detail not in text:
                    text = text.replace(marker, detail + marker)
        path.write_text(text)
print('Built 30 service pages and updated navigation in all three languages.')
