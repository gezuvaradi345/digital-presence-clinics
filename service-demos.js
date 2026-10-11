(() => {
  const root = document.querySelector('[data-service-demo]');
  if (!root) return;
  const copy = JSON.parse(document.getElementById('service-demo-copy').textContent);
  const key = root.dataset.serviceDemo;
  const kind = ({'m-web':'web','o-web':'web','m-social':'social','m-ads':'ads','m-care':'care','m-content':'content','o-shop':'shop','o-landing':'landing','o-brand':'brand','o-audit':'audit','o-business':'business'})[key];
  const c = copy[kind];
  const assets = root.dataset.assets;
  const photos = ['pottery-process.jpg', 'ceramic-collection.jpg', 'studio-story.jpg'];
  const e = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initial = () => ({tab:0, step:0, active:false, followed:false, liked:[false,false,false], saved:[false,false,false], cart:[], palette:0, font:0, improved:false, sent:false, modalIndex:0});
  let state = initial();
  const button = (label, action, index, extra = '') => `<button type="button" data-action="${action}"${index === undefined ? '' : ` data-index="${index}"`} ${extra}>${e(label)}</button>`;
  const photo = (index, alt, cls = '') => `<img class="${cls}" src="${assets}${photos[index]}" alt="${e(alt)}" loading="lazy" />`;
  const tabs = (labels, action = 'tab', selected = state.tab) => `<div class="demo-tabs">${labels.map((label,i)=>button(label,action,i,`aria-pressed="${i===selected}"`)).join('')}</div>`;
  const form = () => `<form class="demo-form"><label>${e(copy.web.name)}<input name="demo-name" autocomplete="off" placeholder="${e(copy.web.name)}" maxlength="60" /></label><label>${e(copy.web.message)}<textarea name="demo-message" rows="2" maxlength="300" placeholder="${e(copy.web.message)}"></textarea></label><button class="demo-primary" type="submit">${e(copy.web.send)}</button><p class="demo-confirm" role="status">${state.sent ? e(copy.web.sent) : ''}</p></form>`;
  const web = () => {
    let content = '';
    if(state.tab===0) content = `<div class="sample-hero"><span class="demo-eyebrow">${e(copy.web.brand)}</span><h3>${e(c.titles[0])}</h3><p>${e(c.copy[0])}</p><div class="demo-controls">${button(c.cta,'web-contact',undefined,'class="demo-primary"')}${button(c.more,'tab',1)}</div><div class="sample-hero-art" aria-hidden="true"><i></i><i></i><i></i></div></div>`;
    if(state.tab===1) content = `<h3>${e(c.titles[1])}</h3><p>${e(c.copy[1])}</p><div class="sample-cards">${c.cards.map((title,i)=>`<article><span>0${i+1}</span><h4>${e(title)}</h4>${button(c.cta,'web-contact')}</article>`).join('')}</div>`;
    if(state.tab===2) content = `<h3>${e(c.titles[2])}</h3><p>${e(c.copy[2])}</p><div class="sample-proof"><div class="sample-wireframe" aria-hidden="true"><i></i><i></i><i></i></div><div><h4>${e(c.project)}</h4><p>${e(c.proof)}</p>${button(c.cta,'web-contact')}</div></div>`;
    if(state.tab===3) content = `<h3>${e(c.titles[3])}</h3><p>${e(c.copy[3])}</p>${form()}`;
    return `${tabs(c.tabs)}<div class="demo-canvas">${content}</div><div class="demo-footnote">${e(key==='m-web'?c.rental:c.owned)}</div>`;
  };
  const social = () => `<div class="demo-phone"><div class="phone-speaker" aria-hidden="true"></div><div class="phone-bar"><span>9:41</span><span aria-hidden="true">● ▰</span></div><div class="insta-top"><strong>Instagram</strong><span>forma.studio</span></div><div class="insta-profile"><button class="insta-avatar" data-action="story" data-index="0" aria-label="${e(c.story)}">F</button><div class="insta-stats">${['3','1 280','146'].map((n,i)=>`<div><strong>${n}</strong><span>${e(c.counts[i])}</span></div>`).join('')}</div></div><div class="insta-bio"><strong>${e(c.name)}</strong><p>${e(c.bio).replace(/\n/g,'<br>')}</p>${button(state.followed?c.following:c.follow,'follow',undefined,`class="demo-primary" aria-pressed="${state.followed}"`)}</div><div class="insta-stories">${c.stories.map((title,i)=>`<button type="button" data-action="story" data-index="${i}"><span>${photo(i,title)}</span><small>${e(title)}</small></button>`).join('')}</div><div class="insta-grid">${c.captions.map((alt,i)=>`<button type="button" data-action="post" data-index="${i}" aria-label="${e(c.post)}: ${e(c.stories[i])}">${photo(i,alt)}</button>`).join('')}</div><p class="insta-note">${e(c.ai)}</p></div>`;
  const ads = () => `${tabs(c.tabs)}<div class="demo-canvas"><div class="demo-dashboard-head"><h3>${e(c.title)}</h3><span class="demo-status ${state.active?'is-active':''}">${e(state.active?c.active:c.draft)}</span></div><div class="ad-preview"><span class="demo-eyebrow">${e(copy.web.brand)}</span><h4>${e(c.copy[state.tab])}</h4><div class="ad-chart" aria-hidden="true">${[28,43,35,64,57,80,70].map((n,i)=>`<i style="height:${n+state.tab*4}%;animation-delay:${i*.05}s"></i>`).join('')}</div></div><div class="demo-metrics"><div><span>${e(c.metrics[state.tab])}</span><strong>${e(c.values[state.tab])}</strong></div><div><span>${e(c.budget)}</span><strong>300 €</strong></div></div><p class="demo-footnote">${e(c.note)}</p>${button(state.active?c.stop:c.start,'campaign',undefined,'class="demo-primary"')}</div>`;
  const care = () => `<div class="demo-canvas"><h3>${e(c.title)}</h3><div class="care-progress" role="progressbar" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${state.step}" aria-label="${e(c.title)}"><span style="width:${state.step/3*100}%"></span></div><div class="care-tasks">${c.tasks.map((name,i)=>`<article><span class="care-number">${i<state.step?'✓':`0${i+1}`}</span><div><h4>${e(name)}</h4><p>${e(i<state.step?c.done:c.pending)}</p></div>${button(c.buttons[i],'care',i,`${i!==state.step?'disabled':''}`)}</article>`).join('')}</div></div>`;
  const content = () => `<div class="demo-canvas"><h3>${e(c.title)}</h3><label class="seo-editor">${e(c.label)}<input data-seo-title maxlength="90" value="${e(c.value)}" /></label><div class="demo-controls">${button(c.before,'seo',0)}${button(c.after,'seo',1)}</div><div class="search-result"><span>www.vasa-firma.example</span><h4 data-seo-preview>${e(c.value)}</h4><p>${e(c.desc)}</p></div><p class="demo-footnote"><span data-seo-count>${c.value.length}</span> / 90 ${e(c.count)}</p></div>`;
  const shop = () => `<div class="demo-canvas"><div class="demo-dashboard-head"><h3>${e(c.title)}</h3>${button(`${c.cart} (${state.cart.length})`,'cart',undefined,'class="demo-primary"')}</div><div class="shop-demo-grid">${c.products.map((title,i)=>`<article>${photo([1,0,2][i],title)}<h4>${e(title)}</h4><p>${e(c.price)} · ${[24,38,62][i]} €</p>${button(c.detail,'product',i)}</article>`).join('')}</div><p class="demo-footnote">${e(copy.social.ai)}</p></div>`;
  const landing = () => `<div class="demo-canvas"><div class="landing-preview"><span class="demo-eyebrow">${e(copy.web.brand)}</span><h3>${e(c.title)}</h3><p>${e(c.copy)}</p>${button(c.cta,'landing-form',undefined,'class="demo-primary"')}</div><h4>${e(c.why)}</h4><div class="landing-reasons">${c.reasons.map((r,i)=>`<span><b>0${i+1}</b>${e(r)}</span>`).join('')}</div></div>`;
  const brand = () => {const colors=['#285ee0','#a04c35','#376554'];return `<div class="demo-canvas"><h3>${e(c.title)}</h3>${tabs(c.palettes,'palette',state.palette)}${tabs(c.fonts,'font',state.font)}<div class="brand-preview" style="--sample-color:${colors[state.palette]};--sample-font:${state.font?'Georgia, serif':'Manrope, sans-serif'}"><div class="brand-web"><span>${e(copy.web.brand)}</span><h4>${e(c.sample)}</h4><p>${e(c.copy)}</p></div><div class="brand-post"><span>F.</span><p>${e(c.sample)}</p></div><div class="brand-signature"><b>F.</b><span>${e(c.signature)}<small>hello@example.com</small></span></div></div></div>`;};
  const audit = () => `${tabs(c.tabs)}<div class="demo-canvas"><span class="demo-eyebrow">${e(c.priority)}</span><h3>${e(c.title)}</h3><div class="audit-sample ${state.improved?'is-improved':''}"><span class="audit-symbol" aria-hidden="true">${state.improved?'✓':'!'}</span><h4>${e((state.improved?c.solutions:c.problems)[state.tab])}</h4><div class="audit-visual" aria-hidden="true">${Array.from({length:state.improved?3:7},(_,i)=>`<i style="width:${state.improved?28:10+i*4}%"></i>`).join('')}</div></div>${button(state.improved?c.back:c.toggle,'improve',undefined,`class="demo-primary" aria-pressed="${state.improved}"`)}</div>`;
  const business = () => {
    let preview = '';
    if(state.tab===0) preview = `<div class="brand-web"><span>${e(copy.web.brand)}</span><h4>${e(c.titles[0])}</h4><p>${e(copy.web.copy[0])}</p></div>`;
    if(state.tab===1) preview = `<div class="search-result"><span>your-business.example</span><h4>${e(copy.content.value)}</h4><p>${e(copy.content.desc)}</p></div>`;
    if(state.tab===2) preview = `<div class="bundle-social">${['Facebook','Instagram','TikTok'].map((name,i)=>`<article><b>${name}</b><span>${e(copy.web.brand)}</span><p>${e(i===2?c.video:c.first)}</p></article>`).join('')}</div>`;
    if(state.tab===3) preview = `<div class="bundle-logo"><span aria-hidden="true">F.</span><strong>${e(copy.web.brand)}</strong></div>`;
    if(state.tab===4) preview = `<div class="brand-signature"><b aria-hidden="true">F.</b><span>${e(c.name)} · ${e(c.role)}<small>hello@example.com · www.example.com</small></span></div>`;
    if(state.tab===5) preview = `<div class="bundle-print"><div><small>${e(c.card)}</small><b>${e(c.name)}</b><span>${e(c.role)}</span><small>hello@example.com</small></div><div class="bundle-stamp"><small>${e(c.stamp)}</small><b>${e(c.role)}</b><span>www.example.com</span></div></div>`;
    return `${tabs(c.tabs)}<div class="demo-canvas"><h3>${e(c.titles[state.tab])}</h3><div class="bundle-preview" style="--sample-color:#285ee0;--sample-font:Manrope,sans-serif">${preview}</div><p>${e(c.guide[state.tab])}</p></div>`;
  };
  const renderers = {web,social,ads,care,content,shop,landing,brand,audit,business};
  const guideText = () => kind==='web'?c.copy[state.tab]:kind==='care'?c.guide[state.step]:kind==='business'?c.guide[state.tab]:c.guide;
  root.innerHTML = `<div class="demo-layout ${kind==='social'?'demo-layout--social':''}"><div class="demo-stage"></div><aside class="demo-guide"><span class="demo-eyebrow">${e(copy.guide)}</span><p data-demo-explanation aria-live="polite"></p><span class="demo-disclaimer">${e(copy.demo)}</span>${button(copy.reset,'reset')}</aside></div><dialog class="demo-dialog" aria-labelledby="demo-dialog-title"><div class="demo-dialog-head"><h3 id="demo-dialog-title"></h3>${button(copy.close,'close')}</div><div class="demo-dialog-body"></div></dialog>`;
  const stage = root.querySelector('.demo-stage');
  const guide = root.querySelector('[data-demo-explanation]');
  const dialog = root.querySelector('dialog');
  let invoker;
  const explain = text => {guide.textContent=text;};
  const render = (restore = true) => {
    const active = document.activeElement;
    const action = active?.dataset.action, index = active?.dataset.index;
    const body = renderers[kind]();
    stage.innerHTML = kind==='social'?body:`<div class="demo-browser"><div class="demo-browser-chrome"><span class="browser-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="browser-address">${kind}.example / ${e(copy.demo)}</span></div>${body}</div>`;
    explain(guideText());
    if (restore && action) {
      const candidate = [...stage.querySelectorAll('[data-action]')].find(el=>el.dataset.action===action&&el.dataset.index===index&&!el.disabled);
      if(candidate) candidate.focus({preventScroll:true});
    }
  };
  const openDialog = (title, body, source) => {
    dialog.querySelector('h3').textContent=title;
    dialog.querySelector('.demo-dialog-body').innerHTML=body;
    if(!dialog.open){invoker=source;dialog.showModal();}
  };
  const socialDialog = (type,index,source) => {
    state.modalIndex=index;
    const controls = type==='story'?`<div class="demo-controls story-controls">${button(copy.prev,'story-prev',undefined,index===0?'disabled':'')}<span>${index+1} / 3</span>${button(copy.next,'story-next',undefined,index===2?'disabled':'')}</div>`:`<div class="demo-controls">${button(state.liked[index]?c.liked:c.like,'like',index,`aria-pressed="${state.liked[index]}"`)}${button(state.saved[index]?c.saved:c.save,'save',index,`aria-pressed="${state.saved[index]}"`)}</div>`;
    openDialog(c.stories[index],`<div class="social-media-view ${type==='story'?'story-view':''}">${photo(index,c.captions[index])}${type==='story'?`<div class="story-caption">${e(c.captions[index])}</div>`:''}</div>${controls}${type==='post'?`<p>${e(c.captions[index])}</p>`:''}<p class="demo-dialog-explanation">${e(type==='story'?c.storyGuide:c.likeGuide)}</p>`,source);
    explain(type==='story'?c.storyGuide:c.captions[index]);
  };
  const showCart = source => openDialog(c.cart,`<div class="demo-cart">${state.cart.length?state.cart.map((index,pos)=>`<div><span>${e(c.products[index])} · ${[24,38,62][index]} €</span>${button(c.remove,'remove',pos)}</div>`).join(''):`<p>${e(c.empty)}</p>`}</div>${state.cart.length?button(c.checkout,'checkout',undefined,'class="demo-primary"'):''}`,source);
  root.addEventListener('click',event=>{
    const target=event.target.closest('button[data-action]');if(!target||target.disabled)return;
    const action=target.dataset.action,index=Number(target.dataset.index);
    if(action==='close'){dialog.close();return;}
    if(action==='reset'){state=initial();if(dialog.open)dialog.close();render(false);return;}
    if(action==='tab'){state.tab=index;state.sent=false;state.improved=false;render();return;}
    if(action==='web-contact'){state.tab=3;state.sent=false;render(false);stage.querySelector('input').focus({preventScroll:true});return;}
    if(action==='follow'){state.followed=!state.followed;render();return;}
    if(action==='post'||action==='story'){socialDialog(action,index,target);return;}
    if(action==='story-next'||action==='story-prev'){socialDialog('story',Math.max(0,Math.min(2,state.modalIndex+(action==='story-next'?1:-1))),target);(dialog.querySelector(`[data-action="${action}"]:not(:disabled)`) || dialog.querySelector('[data-action="story-prev"]:not(:disabled)') || dialog.querySelector('[data-action="story-next"]:not(:disabled)')).focus();return;}
    if(action==='like'||action==='save'){const field=action==='like'?'liked':'saved';state[field][index]=!state[field][index];target.textContent=state[field][index]?c[field]:c[action];target.setAttribute('aria-pressed',String(state[field][index]));explain(c.likeGuide);return;}
    if(action==='campaign'){state.active=!state.active;render();return;}
    if(action==='care'){state.step=Math.min(3,state.step+1);render(false);(stage.querySelector('[data-action="care"]:not(:disabled)')||root.querySelector('[data-action="reset"]')).focus({preventScroll:true});return;}
    if(action==='seo'){const input=stage.querySelector('[data-seo-title]');input.value=index?c.value:c.generic;input.dispatchEvent(new Event('input',{bubbles:true}));return;}
    if(action==='product'){openDialog(c.products[index],`${photo([1,0,2][index],c.products[index],'product-dialog-image')}<p>${e(c.desc)}</p><p>${e(c.price)} · ${[24,38,62][index]} €</p>${button(c.add,'add',index,'class="demo-primary"')}`,target);return;}
    if(action==='add'){state.cart.push(index);dialog.close();render(false);stage.querySelector('[data-action="cart"]').focus({preventScroll:true});return;}
    if(action==='cart'){showCart(target);return;}
    if(action==='remove'){state.cart.splice(index,1);render(false);showCart(target);(dialog.querySelector('[data-action="remove"]')||dialog.querySelector('[data-action="close"]')).focus();return;}
    if(action==='checkout'){state.cart=[];render(false);openDialog(c.cart,`<p class="demo-confirm" role="status">${e(c.success)}</p>`,target);dialog.querySelector('[data-action="close"]').focus();return;}
    if(action==='landing-form'){state.sent=false;openDialog(c.cta,form(),target);return;}
    if(action==='palette'||action==='font'){state[action]=index;render();return;}
    if(action==='improve'){state.improved=!state.improved;render();return;}
  });
  root.addEventListener('input',event=>{
    if(!event.target.matches('[data-seo-title]'))return;
    stage.querySelector('[data-seo-preview]').textContent=event.target.value;
    stage.querySelector('[data-seo-count]').textContent=event.target.value.length;
  });
  root.addEventListener('submit',event=>{
    if(!event.target.matches('.demo-form'))return;
    event.preventDefault();state.sent=true;
    event.target.querySelector('.demo-confirm').textContent=copy.web.sent;
    explain(copy.web.copy[3]);
  });
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{if(invoker?.isConnected)invoker.focus({preventScroll:true});else stage.querySelector('button')?.focus({preventScroll:true});});
  render(false);
})();
