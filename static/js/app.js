'use strict';
// Conference identity and fixed navigation. Editable records come from Excel.
const FIXED_CONFERENCE={
  "site": {
    "title": "GDN 2027",
    "full_title": "27th International Conference on Group Decision and Negotiation",
    "date_label": "6–9 June 2027",
    "location": "Chengdu, China",
    "email": "gdn2027@gdnconference.org",
    "hero_image": "static/images/tourism/kuanzhai.jpg",
    "venue_image": "static/images/scu-wangjiang-gate.png",
    "venue_status": "pending"
  },
  "pages": [
    {
      "page_id": "scope",
      "title": "Scope",
      "menu_group": "About",
      "order": 10,
      "intro": ""
    },
    {
      "page_id": "committees",
      "title": "Committees",
      "menu_group": "About",
      "order": 20,
      "intro": "",
      "visible": false
    },
    {
      "page_id": "call-for-papers",
      "title": "Call for Papers",
      "menu_group": "Submission",
      "order": 10,
      "intro": ""
    },
    {
      "page_id": "streams",
      "title": "Streams",
      "menu_group": "Submission",
      "order": 20,
      "intro": ""
    },
    {
      "page_id": "doctoral-consortium-2",
      "title": "Doctoral Consortium",
      "menu_group": "Submission",
      "order": 30,
      "intro": ""
    },
    {
      "page_id": "paper-submission-2",
      "title": "Paper Submission",
      "menu_group": "Submission",
      "order": 40,
      "intro": ""
    },
    {
      "page_id": "important-dates-2",
      "title": "Important Dates",
      "menu_group": "Submission",
      "order": 50,
      "intro": ""
    },
    {
      "page_id": "springer-proceedings",
      "title": "Springer Proceedings",
      "menu_group": "Proceedings",
      "order": 10,
      "intro": ""
    },
    {
      "page_id": "local-proceedings",
      "title": "Local Proceedings",
      "menu_group": "Proceedings",
      "order": 20,
      "intro": ""
    },
    {
      "page_id": "venue",
      "title": "Venue",
      "menu_group": "Hotel & Travel",
      "order": 20,
      "intro": ""
    },
    {
      "page_id": "hotel-information",
      "title": "Hotel Information",
      "menu_group": "Hotel & Travel",
      "order": 30,
      "intro": ""
    },
    {
      "page_id": "tourism-info",
      "title": "Explore Chengdu & Sichuan",
      "menu_group": "Hotel & Travel",
      "order": 10,
      "intro": ""
    },
    {
      "page_id": "travel",
      "title": "Travel",
      "menu_group": "Hotel & Travel",
      "order": 40,
      "intro": ""
    },
    {
      "page_id": "schedule",
      "title": "Schedule",
      "menu_group": "Programme",
      "order": 10,
      "intro": ""
    },
    {
      "page_id": "keynote-speakers",
      "title": "Invited Speakers",
      "menu_group": "Programme",
      "order": 20,
      "intro": ""
    },
    {
      "page_id": "gallery",
      "title": "Gallery",
      "menu_group": "Programme",
      "order": 30,
      "intro": ""
    },
    {
      "page_id": "registration",
      "title": "Registration",
      "menu_group": "Registration",
      "order": 10,
      "intro": ""
    },
    {
      "page_id": "visa-information",
      "title": "Visa Information",
      "menu_group": "Hotel & Travel",
      "order": 50,
      "intro": ""
    }
  ],
  "sponsors": []
};
const $ = (s, r=document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let db, program, activeDay, activeSpeaker, activeSchedule='programme';
const main=$('#main');
function safeUrl(value){
 const url=String(value||'').trim();
 return /^(https?:\/\/|mailto:|static\/|#)/i.test(url) ? url : '#';
}
function href(value){
 const u=String(value||'');
 if(/gdnconference\.org\/gdn2027\/registration-2\//.test(u))return '#registration';
 const match=u.match(/gdnconference\.org\/gdn2027\/([^/?#]+)\/?$/);
 if(match&&db.pages.some(p=>p.page_id===match[1]))return '#'+match[1];
 return safeUrl(u);
}
function linkAttrs(value){const u=href(value);return `href="${esc(u)}"${/^https?:/.test(u)?' target="_blank" rel="noopener noreferrer"':''}`;}
function md(value){
 let s=esc(value);
 s=s.replace(/\[([^\]]+)\]\(([^\s]+)\)/g,(_,text,url)=>`<a ${linkAttrs(url.replace(/&amp;/g,'&'))}>${text}</a>`);
 return s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g,'<em>$1</em>').replace(/~~([^~]+)~~/g,'<del>$1</del>').replace(/\n/g,'<br>');
}
function visiblePages(){return db.pages.filter(p=>p.visible!==false);}
function isVenueConfirmed(){return db.site.venue_status==='confirmed';}
function nav(){
 const order=['About','Submission','Programme','Proceedings','Hotel & Travel','Registration'];
 $('#navigation').innerHTML='<a href="#home" data-nav="home">Home</a>'+order.map(group=>{
  const pages=visiblePages().filter(p=>p.menu_group===group).sort((a,b)=>a.order-b.order);
  if(!pages.length)return '';
  if(pages.length===1)return `<a href="#${pages[0].page_id}" data-nav="${pages[0].page_id}">${esc(group)}</a>`;
  return `<details name="main-navigation" data-group="${esc(group)}"><summary>${esc(group)}</summary><div class="dropdown">${pages.map(p=>`<a href="#${p.page_id}" data-nav="${p.page_id}">${esc(p.title)}</a>`).join('')}</div></details>`;
 }).join('')+`<a href="mailto:${esc(db.site.email)}" aria-label="Contact the organizers by email">Contact</a>`;
 $('#footer').innerHTML=`<div class="container"><div class="footer-top"><div><a class="wordmark" href="#home">GDN<span>2027</span></a><p>${esc(db.site.full_title)}</p></div><div class="footer-links"><a href="#schedule">Programme</a><a href="#paper-submission-2">Submission</a><a href="#travel">Travel</a><a href="mailto:${esc(db.site.email)}">Contact</a></div></div><div class="footer-bottom"><span>${esc(db.site.date_label)} · ${esc(db.site.location)}</span></div></div>`;
}
function isProgramPublished(){return db.settings.program_status==='published' && program.status==='published';}
function pending(title,body){return `<div class="coming-soon"><span class="status-pill">To be announced</span><h2>${esc(title)}</h2><p>${esc(body)}</p></div>`;}
function pdfLink(){return db.settings.program_pdf?`<a class="btn" ${linkAttrs(db.settings.program_pdf)}>Download programme PDF</a>`:'<p class="program-note">The programme PDF will be added when available.</p>';}
function latestNews(){
 const rows=[...(db.news||[])].filter(n=>n.status==='published').sort((a,b)=>a.order-b.order);
 if(!rows.length)return '<aside class="welcome-news empty-news"><span class="eyebrow">Stay informed</span><h2>Latest news</h2><div class="news-empty-space" aria-hidden="true"></div></aside>';
 return `<aside class="welcome-news"><span class="eyebrow">Stay informed</span><h2>Latest news</h2>${rows.map(n=>`<article class="news-item">${n.date?`<time datetime="${esc(n.date)}">${dateLabel(n.date)}</time>`:''}<h3>${esc(n.title)}</h3><p>${md(n.summary)}</p>${n.url?`<a class="text-link" ${linkAttrs(n.url)}>Read more <span aria-hidden="true">→</span></a>`:''}</article>`).join('')}</aside>`;
}
function home(){
 const s=db.site,news=latestNews();
 const topics=[['Methodological Foundations','Methods for shared decisions and negotiation.'],['Theoretical Foundations','Models of preferences, bargaining and conflict.'],['Technological Foundations','Intelligent tools and decision support systems.'],['Behavioural Aspects','People, communication and collective choice.'],['Systems Design and Use','Designing support for collaboration.'],['Applications','Research connected to real decisions.']];
 const conferenceDays=['2027-06-06','2027-06-07','2027-06-08','2027-06-09'];
 return `<section class="hero"><img src="${esc(s.hero_image)}" alt="Kuanzhai Alleys in Chengdu"><div class="container hero-inner"><h1><span class="conference-prefix">27th International Conference on</span>Group Decision<br><em>and Negotiation</em></h1><p>Connecting research, perspectives and practice in collective decision making.</p><div class="hero-meta"><span><strong>${esc(s.date_label)}</strong><small>Four days of research and exchange</small></span><span><strong>${esc(s.location)}</strong><small>Venue to be confirmed</small></span></div><div class="actions"><a class="btn" href="#call-for-papers">Call for papers</a><a class="btn light" href="#schedule">Conference programme</a><a class="btn outline" href="#hotel-information">Plan your stay</a></div></div></section>
 <div class="quickbar"><div class="container quick-grid"><a href="#call-for-papers"><small>RESEARCH</small><strong>Call for papers & streams</strong></a><a href="#important-dates-2"><small>DEADLINES</small><strong>Important dates</strong></a><a href="#hotel-information"><small>PLAN YOUR VISIT</small><strong>Hotels & travel</strong></a></div></div>
 <section class="section"><div class="container welcome-grid ${news?'':'no-news'}"><div class="welcome"><span class="eyebrow">Welcome to Chengdu</span><h2>A meeting place for<br>ideas and collaboration.</h2><p>The 27th International Conference on Group Decision and Negotiation brings the international GDN community to Chengdu, China, from <strong>6 to 9 June 2027</strong>.</p><p>The GDN conference series has brought researchers and practitioners together in cities including Glasgow, Toronto, Toulouse, Nanjing and Loughborough, with recent editions in Tokyo (2023), Porto (2024), Zaragoza (2025) and Katowice (2026). Continuing this tradition in Chengdu, participants will exchange advances in group decision and negotiation, discuss emerging methods and applications, and develop ideas through dialogue and constructive feedback.</p><p>A dedicated doctoral track gives students an opportunity to present work in progress and receive guidance from experienced researchers.</p><p>The conference venue in Chengdu is <strong>to be confirmed</strong>. Venue details and arrival instructions will be announced.</p></div>${news}</div></section>
 <section class="section alt scope-section"><div class="container"><div class="section-heading"><div><span class="eyebrow">Many perspectives. A shared conversation.</span><h2>Conference scope</h2></div><a href="#scope">Explore the full scope</a></div><div class="scope-grid">${topics.map((t,i)=>`<article class="scope-card"><span class="scope-number">${String(i+1).padStart(2,'0')}</span><h3>${t[0]}</h3><p>${t[1]}</p></article>`).join('')}</div></div></section>
 ${db.settings.speakers_status==='published'?`<section class="section"><div class="container"><div class="section-heading"><div><span class="eyebrow">Ideas that move the field</span><h2>Invited speakers</h2></div><a href="#keynote-speakers">Talks & biographies</a></div>${db.speakers.length?`<div class="speaker-grid">${[...db.speakers].sort((a,b)=>a.order-b.order).map(p=>`<a class="speaker-card" href="#keynote-speakers?speaker=${encodeURIComponent(p.speaker_id)}">${p.image?`<div class="portrait"><img loading="lazy" src="${esc(safeUrl(p.image))}" alt="${esc(p.name)}"></div>`:''}<h3>${esc(p.name)}</h3><div class="affiliation">${esc(p.affiliation)}</div><div class="talk">${esc(p.talk_title)}</div></a>`).join('')}</div>`:pending('Speakers to be announced','The invited speakers and their talks will be introduced here.')}</div></section>`:""}
 ${isProgramPublished()?`<section class="section alt"><div class="container"><div class="section-heading"><div><span class="eyebrow">6–9 June 2027</span><h2>Conference programme</h2></div><a href="#schedule">Programme & social events</a></div>${isProgramPublished()?`<div class="day-overview">${conferenceDays.map(date=>{const rows=program.sessions.filter(p=>p.date===date);const featured=rows.filter(p=>['keynote','plenary','doctoral'].includes(p.type));return `<a href="#schedule?day=${date}"><span>${dayLabel(date).short}</span><strong>${dayLabel(date).long}</strong><p>${featured.length?featured.map(p=>esc(p.title)).join('<br>'):'View the day’s programme'}</p></a>`;}).join('')}</div><p class="program-note">All times are local to Chengdu (${esc(db.settings.timezone_label)}).</p>`:pending('Programme to be announced','The detailed programme for 6–9 June 2027 will be published here.')} </div></section>`:""}`;
}
function dayLabel(date){const d=new Date(date+'T12:00:00Z');return {short:d.toLocaleDateString('en-GB',{weekday:'long',timeZone:'UTC'}),long:d.toLocaleDateString('en-GB',{day:'numeric',month:'long',timeZone:'UTC'})};}
function dateLabel(date,year=true){return new Date(date+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',...(year?{year:'numeric'}:{}),timeZone:'UTC'});}
function templateHtml(id){return document.getElementById(id)?.innerHTML.trim()||'';}
function richText(text){return String(text||'').split(/\n\s*\n/).filter(t=>t.trim()).map(t=>t.startsWith('- ')?`<ul>${t.split('\n').map(line=>`<li>${md(line.replace(/^- /,''))}</li>`).join('')}</ul>`:`<p>${md(t)}</p>`).join('');}
function groupedRows(rows){const groups=new Map();for(const row of [...rows].sort((a,b)=>a.group_order-b.group_order||a.order-b.order)){if(!groups.has(row.group))groups.set(row.group,[]);groups.get(row.group).push(row);}return [...groups];}
function committees(){
 return `<div class="committee-directory">${groupedRows(db.committees).map(([group,people],i)=>`<section class="committee-role role-${i%5} ${people.length===1?'single-role':''} ${group==='Program Committee'?'pc-role':''}"><header class="committee-role-heading"><h2>${esc(group)}</h2></header><div class="committee-members">${people.map(p=>`<article class="committee-person"><h3>${md(p.name)}</h3><p>${md(p.affiliation)}</p></article>`).join('')}</div></section>`).join('')}</div>`;
}
function importantDates(){if(!db.dates.length)return pending('Important dates','The submission and registration deadlines will be announced.');return groupedRows(db.dates).map(([group,rows],i)=>`<h2>${esc(group)}</h2><ul>${rows.map(r=>`<li>${esc(r.event)}: ${r.previous_date?`<del>${dateLabel(r.previous_date)}</del> `:''}${r.date_prefix?esc(r.date_prefix)+' ':''}${r.date?dateLabel(r.date):'<strong>To be announced</strong>'}</li>`).join('')}</ul>${i===0?templateHtml('date-notes-stream-proposals'):''}`).join('');}
function programmeHtml(date){
 const rows=program.sessions.filter(s=>s.date===date&&s.type!=='social'),times=[...new Set(rows.map(s=>s.start))].sort();
 return times.map(time=>`<div class="time-slot"><div class="slot-time"><strong>${esc(time)}</strong></div><div class="session-grid">${rows.filter(s=>s.start===time).map(s=>{
 const papers=program.papers.filter(p=>p.session_id===s.session_id).sort((a,b)=>a.order-b.order);
 return `<article class="session-card kind-${esc(s.type)}"><div class="session-top"><span class="session-kind">${esc(s.type==='session'?'Parallel session':s.type)}</span><span class="session-room">${esc(s.room)}</span></div><h3>${esc(s.title)}</h3>${s.end?`<span class="session-duration">${esc(s.start)}–${esc(s.end)}</span>`:''}${s.chair?`<p class="session-chair">Chair${s.chair.includes(',')?'s':''}: ${esc(s.chair)}</p>`:''}${s.details?`<p>${esc(s.details)}</p>`:''}${s.url?`<a ${linkAttrs(s.url)}>Join the session</a>`:''}${papers.length?`<details class="session-papers"><summary>${papers.length} paper${papers.length===1?'':'s'} · view presentations</summary><ol>${papers.map(p=>`<li><span class="paper-number">#${esc(p.paper_id)}</span><strong>${esc(p.title)}</strong><span class="paper-authors">${esc(p.authors)}</span></li>`).join('')}</ol></details>`:''}</article>`;
 }).join('')}</div></div>`).join('');
}
function programme(){
 if(!isProgramPublished())return pending('Programme to be announced','The detailed GDN 2027 programme for 6–9 June will be published here. All times will use Chengdu local time (UTC+8).');
 const days=[...new Set(program.sessions.filter(s=>s.type!=='social').map(s=>s.date))].sort();
 if(!days.includes(activeDay))activeDay=days[0];
 return `<div class="programme-actions"><p>All times are local to Chengdu (${esc(db.settings.timezone_label)}).${program.updated?`<br><span>Programme updated ${dateLabel(program.updated)}</span>`:''}</p>${pdfLink()}</div><div class="day-tabs" role="tablist" aria-label="Programme day">${days.map(d=>`<button role="tab" id="day-${d}" aria-selected="${d===activeDay}" aria-controls="day-programme" tabindex="${d===activeDay?'0':'-1'}" data-day="${d}"><span>${dayLabel(d).short}</span><strong>${dayLabel(d).long}</strong></button>`).join('')}</div><div class="program-legend"><span class="legend-keynote">Invited talks & plenaries</span><span class="legend-session">Parallel sessions</span><span class="legend-doctoral">Doctoral consortium</span><span class="legend-break">Breaks & meetings</span></div><div id="day-programme" role="tabpanel" aria-labelledby="day-${activeDay}">${programmeHtml(activeDay)}</div><details class="programme-info"><summary>Venue & session access</summary><div>${templateHtml('schedule-programme-info')}</div></details>`;
}
function schedule(){
 const views=[['programme','Programme'],['social','Social Events'],['gala','Gala Dinner']];
 if(!views.some(([id])=>id===activeSchedule))activeSchedule='programme';
 const rows=isProgramPublished()?program.sessions.filter(s=>s.type==='social'&&(activeSchedule==='gala'?/gala/i.test(s.title):!/gala/i.test(s.title))).sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start)):[];
 const info=rows.map(s=>`<article class="social-event"><div class="social-timing"><strong>${esc(s.title)}</strong><span>${dateLabel(s.date)} · ${esc(s.start)}${s.end?'–'+esc(s.end):''}</span><span>${esc(s.room)}</span></div>${s.details?`<p>${md(s.details)}</p>`:''}${s.url?`<a ${linkAttrs(s.url)}>Event information</a>`:''}</article>`).join('');
 const body=activeSchedule==='programme'?programme():info||`<div class="event-information">${templateHtml('schedule-'+activeSchedule)}</div>`;
 return `<div class="schedule-tabs" role="tablist" aria-label="Schedule sections">${views.map(([id,title])=>`<button type="button" role="tab" id="schedule-tab-${id}" data-schedule-tab="${id}" aria-selected="${id===activeSchedule}" aria-controls="schedule-panel" tabindex="${id===activeSchedule?'0':'-1'}">${title}</button>`).join('')}</div><section id="schedule-panel" role="tabpanel" aria-labelledby="schedule-tab-${activeSchedule}">${body}</section>`;
}
function hotels(){
 const rows=[...(db.hotels||[])].sort((a,b)=>a.order-b.order);
 if(!rows.length)return pending('Hotel information','Accommodation options will be added here.');
 return `<div class="hotel-grid">${rows.map(h=>`<article class="hotel-card"><div class="hotel-heading"><span class="hotel-stars">${'★'.repeat(Number(h.stars))}<small>${Number(h.stars)}-star category</small></span></div><h2>${esc(h.name)}</h2><p>${esc(h.area)}</p><dl><dt>Address</dt><dd>${esc(h.address)}</dd><dt>Getting to the venue</dt><dd>${esc(isVenueConfirmed()?h.transport:'Venue and arrival route to be confirmed.')}</dd><dt>Conference rate</dt><dd>${esc(h.rate_note||'To be announced')}</dd></dl>${h.note?`<p class="hotel-note">${md(h.note)}</p>`:''}<div class="hotel-links">${h.booking_url?`<a class="btn" ${linkAttrs(h.booking_url)}>Hotel & booking</a>`:''}${h.category_source?`<a class="text-link" ${linkAttrs(h.category_source)}>Category source</a>`:''}</div></article>`).join('')}</div>`;
}
function speakerPanel(speaker){
 return `<div class="speaker-profile">${speaker.image?`<img src="${esc(safeUrl(speaker.image))}" alt="${esc(speaker.name)}">`:""}<div><h2>${esc(speaker.name)}</h2><p class="speaker-position">${md(speaker.position||speaker.affiliation)}</p>${speaker.award?`<p class="speaker-award">${esc(speaker.award)}</p>`:''}</div></div><h2 class="speaker-talk-title">${esc(speaker.talk_title)}</h2><div class="speaker-description">${speaker.abstract?'<h3>Abstract</h3>'+richText(speaker.abstract):''}${speaker.bio?'<h3>Bio</h3>'+richText(speaker.bio):''}</div>`;
}
function speakers(){
 const rows=[...db.speakers].sort((a,b)=>a.order-b.order);
 if(!rows.some(s=>s.speaker_id===activeSpeaker))activeSpeaker=rows[0]?.speaker_id;
 const speaker=rows.find(s=>s.speaker_id===activeSpeaker);
 if(!speaker)return pending('Invited speakers','The GDN 2027 invited speakers will be announced here.');
 return `<div class="speaker-tabs" role="tablist" aria-label="Invited speakers">${rows.map((s,i)=>`<button type="button" role="tab" id="speaker-tab-${esc(s.speaker_id)}" data-speaker="${esc(s.speaker_id)}" aria-controls="speaker-panel" aria-selected="${s.speaker_id===activeSpeaker}" tabindex="${s.speaker_id===activeSpeaker?'0':'-1'}"><span class="speaker-tab-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span>${esc(s.name)}</button>`).join('')}</div><section id="speaker-panel" role="tabpanel" aria-labelledby="speaker-tab-${esc(activeSpeaker)}">${speakerPanel(speaker)}</section>`;
}
function detail(page){
 let body=templateHtml('page-'+page.page_id);
 if(page.visible===false)body=pending(page.page_id==='venue'?'Venue to be confirmed':'Committee information to be announced','This information will be published when available.');
 else if(page.page_id==='schedule')body=schedule();
 else if(page.page_id==='keynote-speakers')body=speakers();
 else if(page.page_id==='committees')body=committees();
 else if(page.page_id==='important-dates-2')body=importantDates();
 else if(page.page_id==='hotel-information')body=body.replace('<div id="hotel-list"></div>',hotels());
 else if(page.page_id==='registration' && db.fees.length)body=`<div class="table-scroll"><table><thead><tr><th>Fees (${esc(db.settings.currency)})</th><th>Early bird${db.settings.early_bird_until?'<br>until '+dateLabel(db.settings.early_bird_until,false):''}</th><th>Regular${db.settings.regular_until?'<br>until '+dateLabel(db.settings.regular_until,false):''}</th></tr></thead><tbody>${db.fees.map(f=>`<tr><td>${esc(f.category)}</td><td>${Number(f.early_amount).toFixed(2)}</td><td>${Number(f.regular_amount).toFixed(2)}</td></tr>`).join('')}</tbody></table></div>`+body.replace(/<div class="coming-soon">.*?<\/div>/s,'');
 return `<div class="page-head"><div class="container"><h1>${esc(page.title)}</h1></div></div><div class="page-content ${page.page_id==='schedule'?'programme-content':''}">${body}</div>`;
}
function render(){
 const requested=(location.hash.slice(1)||'home').split('?')[0];
 const hidden=db.pages.some(p=>p.page_id===requested&&p.visible===false);
 const route=hidden?'home':requested;
 if(hidden)history.replaceState(null,'','#home');
 if(route==='contact-us'){history.replaceState(null,'','#home');render();return;}
 const params=new URLSearchParams(location.hash.split('?')[1]||'');
 const day=params.get('day');if(day)activeDay=day;
 const speaker=params.get('speaker');if(speaker)activeSpeaker=speaker;
 if(route==='schedule')activeSchedule=params.get('view')||'programme';
 const page=visiblePages().find(p=>p.page_id===route);
 main.innerHTML=route==='home'?home():page?detail(page):`<div class="container loading"><h1>Page not found</h1><p><a href="#home">Return to the conference homepage</a></p></div>`;
 document.title=(page?page.title+' · ':'')+'GDN 2027 · Chengdu';
 document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===route));
 document.querySelectorAll('nav details').forEach(d=>{d.classList.toggle('active',d.dataset.group===page?.menu_group);d.open=false;});
 $('#navigation').classList.remove('open');$('#menu-toggle').setAttribute('aria-expanded','false');
 window.scrollTo({top:0,behavior:'instant'});
}
document.addEventListener('click',e=>{
 const menuSummary=e.target.closest('#navigation > details > summary');
 if(menuSummary){
  const currentMenu=menuSummary.parentElement;
  document.querySelectorAll('#navigation > details[open]').forEach(menu=>{if(menu!==currentMenu)menu.open=false;});
 }
 const scheduleTab=e.target.closest('[data-schedule-tab]');if(scheduleTab){activeSchedule=scheduleTab.dataset.scheduleTab;history.replaceState(null,'','#schedule?view='+activeSchedule+(activeDay?'&day='+activeDay:''));const scroll=window.scrollY;main.innerHTML=detail(db.pages.find(p=>p.page_id==='schedule'));$('[data-schedule-tab="'+activeSchedule+'"]').focus({preventScroll:true});window.scrollTo({top:scroll,behavior:'instant'});return;}
 const speaker=e.target.closest('[data-speaker]');if(speaker){activeSpeaker=speaker.dataset.speaker;history.replaceState(null,'','#keynote-speakers?speaker='+encodeURIComponent(activeSpeaker));const scroll=window.scrollY;main.innerHTML=detail(db.pages.find(p=>p.page_id==='keynote-speakers'));$('[data-speaker="'+activeSpeaker+'"]').focus({preventScroll:true});window.scrollTo({top:scroll,behavior:'instant'});return;}
 const day=e.target.closest('[data-day]');if(day){activeDay=day.dataset.day;activeSchedule='programme';history.replaceState(null,'','#schedule?view=programme&day='+activeDay);const scroll=window.scrollY;main.innerHTML=detail(db.pages.find(p=>p.page_id==='schedule'));$('[data-day="'+activeDay+'"]').focus({preventScroll:true});window.scrollTo({top:scroll,behavior:'instant'});return;}
 const img=e.target.closest('[data-view]');if(img){const viewer=$('#image-viewer');$('img',viewer).src=img.dataset.view;$('img',viewer).alt=img.alt;$('p',viewer).textContent=img.alt;viewer.showModal();}
 if(!e.target.closest('nav details'))document.querySelectorAll('nav details[open]').forEach(d=>d.open=false);
});
document.addEventListener('keydown',e=>{
 if(e.target.matches('[data-schedule-tab]')&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
  e.preventDefault();const tabs=[...document.querySelectorAll('[data-schedule-tab]')];let i=tabs.indexOf(e.target);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[i].click();
 }
 if(e.target.matches('[data-speaker]')&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
  e.preventDefault();const tabs=[...document.querySelectorAll('[data-speaker]')];let i=tabs.indexOf(e.target);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[i].click();
 }
 if(e.target.matches('[data-day]')&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
  e.preventDefault();const tabs=[...document.querySelectorAll('[data-day]')];let i=tabs.indexOf(e.target);i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[i].click();
 }
 if(e.key==='Escape')document.querySelectorAll('nav details[open]').forEach(d=>d.open=false);
});
$('#menu-toggle').addEventListener('click',()=>{const open=$('#navigation').classList.toggle('open');$('#menu-toggle').setAttribute('aria-expanded',String(open));});
$('#close-viewer').addEventListener('click',()=>$('#image-viewer').close());
$('#image-viewer').addEventListener('click',e=>{if(e.target===$('#image-viewer'))$('#image-viewer').close();});
Promise.all([fetch('static/data/conference.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Conference data unavailable');return r.json();}),fetch('static/data/program.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Programme data unavailable');return r.json();})]).then(([a,b])=>{db={...FIXED_CONFERENCE,...a,site:{...FIXED_CONFERENCE.site,program_pdf:a.settings.program_pdf}};program=b;nav();render();window.addEventListener('hashchange',render);}).catch(()=>{main.innerHTML='<div class="container loading"><h1>Conference information is temporarily unavailable</h1><p>Please reload this page, or contact <a href="mailto:gdn2027@gdnconference.org">the conference organizers</a>.</p><button class="btn" onclick="location.reload()">Reload page</button></div>';});
