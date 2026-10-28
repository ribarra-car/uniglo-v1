(function () {
  'use strict';
  const U=window.UNIGLO, products=window.UNIGLO_PRODUCTS;
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const KEY='uniglo.research.v1';
  const segments={estudiante:'Estudiante universitario',trabajador:'Joven trabajador',otro:'Otro joven del mercado objetivo'};
  const roles={comprador:'Comprador',vendedor:'Vendedor',ambos:'Ambos'};
  const answers={si:'Sí',no:'No',depende:'Depende del servicio que ofrezca'};
  const reasons=['Más fotografías','Medidas exactas','Información sobre el estado','Mayor confianza en el vendedor','Posibilidad de revisar la prenda','Otra razón'];
  const emptyState=()=>({schemaVersion:1,activeId:null,sessions:[]});
  let persistent=true, memory=emptyState(), boundId=null, selectedId=null;
  let category='',searchTimer,toastTimer,currentProduct=null,interestPending=false,sellerPending=false;
  let lastSearch='',publication=null,resetting=false;
  const uuid=()=>window.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12);
  const now=()=>new Date().toISOString();
  const localDate=iso=>new Date(iso).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'});
  function warning(message){$('storageWarning').textContent=message;$('storageWarning').hidden=false;}
  function validState(s){return s?.schemaVersion===1 && Array.isArray(s.sessions) && s.sessions.every(x=>typeof x.id==='string'&&Array.isArray(x.events)&&x.events.every(e=>typeof e.type==='string'&&e.data&&typeof e.data==='object'));}
  function read(){
    if(!persistent)return memory;
    try{
      const raw=localStorage.getItem(KEY);
      if(!raw)return emptyState();
      const s=JSON.parse(raw);
      if(!validState(s))throw new Error('Formato de registro incompatible');
      memory=s;return s;
    }catch(e){persistent=false;warning('El registro local no está disponible o no se puede leer. Esta pestaña guarda temporalmente en memoria: exporta antes de cerrarla.');return memory;}
  }
  function write(state){
    memory=state;
    if(persistent){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){persistent=false;warning('No se pudo guardar en este navegador. Tus acciones siguen en esta pestaña: exporta antes de cerrarla o recargar.');updateStatus();}}
    return state;
  }
  const event=(type,data={})=>({id:uuid(),at:now(),type,data});
  function record(type,data={}){
    const state=read(),s=state.sessions.find(x=>x.id===boundId);
    if(!U.EVENT_LABELS[type]||!s||s.endedAt||state.activeId!==boundId)return false;
    s.events.push(event(type,data));write(state);return true;
  }
  function activeSession(){const state=read();return state.sessions.find(s=>s.id===boundId&&s.id===state.activeId&&!s.endedAt);}
  function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>{$('toast').hidden=true;},4500);}
  function openDialog(id){$(id).showModal();document.body.classList.add('modal-open');}
  function closeDialog(id){$(id).close();}
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.dataset.close)));
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');});
  });
  $('openPrivacy').addEventListener('click',()=>openDialog('privacyDialog'));

  // Catálogo: datos de ejemplo editables en catalogo.js; nunca se mezclan con las publicaciones simuladas.
  const categories=[...new Set(products.map(p=>p.category))];
  function renderCategories(){
    $('categoryFilters').innerHTML=['',...categories].map(c=>`<button type="button" data-category="${esc(c)}" aria-pressed="${category===c}">${esc(c||'Todas las prendas')}</button>`).join('');
  }
  const filters=()=>({search:$('search').value,category,size:$('sizeFilter').value,price:$('priceFilter').value});
  function renderProducts(){
    const shown=U.filterProducts(products,filters());
    $('productGrid').innerHTML=shown.map(p=>`<article class="product-card"><button type="button" class="product-open" data-product="${esc(p.id)}" aria-label="Ver ${esc(p.name)}, ${esc(U.money(p.priceCents))} MXN, talla ${esc(p.size)}"><div class="product-image"><img src="${esc(p.image)}" width="720" height="900" loading="lazy" decoding="async" alt="${esc(p.alt)}"><span class="demo-badge">DEMO / ${esc(p.id)}</span><span class="view-cue">Ver prenda <span aria-hidden="true">↗</span></span></div><div class="product-meta"><h3>${esc(p.name)}</h3><span class="product-price">${esc(U.money(p.priceCents))}</span></div><p class="product-subtitle"><span>Talla ${esc(p.size)}</span><span aria-hidden="true">·</span><span>${esc(p.condition)}</span></p></button></article>`).join('');
    $('resultCount').textContent=shown.length+' de '+products.length+' prendas · MXN';
    $('emptyState').hidden=shown.length>0;return shown;
  }
  function flushSearch(){
    clearTimeout(searchTimer);
    const q=$('search').value.trim();
    if(q===lastSearch)return;
    lastSearch=q;
    record('search_performed',{queryLength:q.length,cleared:!q,matchedProductIds:U.filterProducts(products,filters()).map(p=>p.id)});
  }
  $('filtersForm').addEventListener('submit',e=>{e.preventDefault();flushSearch();});
  $('search').addEventListener('input',()=>{renderProducts();clearTimeout(searchTimer);searchTimer=setTimeout(flushSearch,650);});
  $('search').addEventListener('blur',flushSearch);
  $('categoryFilters').addEventListener('click',e=>{
    const b=e.target.closest('[data-category]');if(!b||b.dataset.category===category)return;
    flushSearch();category=b.dataset.category;renderCategories();const shown=renderProducts();
    record('filter_changed',{filter:'category',value:category||'todas',matchedProductIds:shown.map(p=>p.id)});
  });
  ['sizeFilter','priceFilter'].forEach(id=>$(id).addEventListener('change',()=>{
    flushSearch();const shown=renderProducts();record('filter_changed',{filter:id==='sizeFilter'?'size':'price',value:$(id).value||'todos',matchedProductIds:shown.map(p=>p.id)});
  }));
  function resetFilters(track=true){clearTimeout(searchTimer);if(track)flushSearch();$('filtersForm').reset();category='';lastSearch='';renderCategories();renderProducts();if(track)record('filters_cleared');}
  $('clearFilters').addEventListener('click',()=>resetFilters());$('emptyReset').addEventListener('click',()=>resetFilters());
  $('productGrid').addEventListener('click',e=>{const b=e.target.closest('[data-product]');if(b)showProduct(b.dataset.product);});
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>record('section_viewed',{section:a.getAttribute('href').slice(1)})));

  function renderDetail(){
    const p=currentProduct;
    $('productContent').innerHTML=`<div class="product-detail"><img class="detail-image" src="${esc(p.image)}" width="720" height="900" alt="${esc(p.alt)}"><div class="detail-copy"><span class="outlined-tag">PRENDA FICTICIA / ${esc(p.id)}</span><h2 id="productTitle">${esc(p.name)}</h2><p class="detail-price">${esc(U.money(p.priceCents))} <small>MXN</small></p><p class="detail-description">${esc(p.description)}</p><dl class="detail-data"><dt>Marca</dt><dd>${esc(p.brand)}</dd><dt>Talla</dt><dd>${esc(p.size)}</dd><dt>Medidas</dt><dd>${esc(p.measurements)}</dd><dt>Estado</dt><dd>${esc(p.condition)}</dd><dt>Detalles</dt><dd>${esc(p.defects)}</dd></dl><p class="contact-info">En una versión futura podrías solicitar contacto con la persona vendedora para resolver dudas y acordar una posible transacción. Aquí solo simulamos tu interés.</p><button id="showInterest" class="button primary full">Me interesa esta prenda <span aria-hidden="true">↗</span></button><p class="image-note">Fotografía de referencia. Las medidas, el precio y el estado son ficticios. No hay un vendedor real.</p></div></div>`;
    $('showInterest').addEventListener('click',showInterest);
  }
  function showProduct(id){flushSearch();currentProduct=products.find(p=>p.id===id);if(!currentProduct)return;interestPending=false;renderDetail();record('product_viewed',{productId:id});openDialog('productDialog');}
  function showInterest(){
    interestPending=true;record('interest_clicked',{productId:currentProduct.id});
    $('productContent').innerHTML=`<div class="interest-flow"><p class="eyebrow">UN PASO MÁS, SOLO PARA PROBAR</p><h2 id="productTitle">¿Darías el siguiente paso?</h2><p>Es una simulación de interés. No se realiza una compra ni se envía ningún mensaje.</p><p class="interest-product">${esc(currentProduct.name)} · ${esc(U.money(currentProduct.priceCents))} MXN</p><form id="interestForm"><fieldset><legend>¿Te gustaría avanzar hacia el contacto con quien la vende?</legend><label class="choice-line"><input type="radio" name="contact" value="si" required><span>Sí, solicitaría contacto</span></label><label class="choice-line"><input type="radio" name="contact" value="no" required><span>Todavía no</span></label></fieldset><fieldset><legend>¿Qué necesitarías para sentir más confianza? <span class="field-hint">Opcional. Puedes elegir varias razones.</span></legend><div class="reasons-grid">${reasons.map((r,i)=>`<label class="check-line"><input type="checkbox" name="reason" value="${i}"><span>${esc(r)}</span></label>`).join('')}</div></fieldset><button type="submit" class="button primary full">Confirmar respuesta <span aria-hidden="true">→</span></button></form><div class="button-row"><button id="backToDetail" class="text-link">Volver al detalle</button></div></div>`;
    $('interestForm').addEventListener('submit',e=>{
      e.preventDefault();const form=new FormData(e.target),choice=form.get('contact');if(!['si','no'].includes(choice))return;
      const selected=form.getAll('reason').map(i=>reasons[Number(i)]).filter(Boolean);
      const saved=record(choice==='si'?'contact_confirmed':'contact_declined',{productId:currentProduct.id});
      if(selected.length)record('trust_reasons',{productId:currentProduct.id,reasons:selected});
      interestPending=false;
      $('productContent').innerHTML=`<div class="interest-flow"><span class="success-mark" aria-hidden="true">✓</span><p class="eyebrow">RESPUESTA ${saved?'REGISTRADA':'SIMULADA'}</p><h2 id="productTitle">Gracias por probarlo.</h2><p>${choice==='si'?'Indicaste que solicitarías contacto con la persona vendedora.':'Indicaste que todavía no solicitarías contacto.'}</p><p>No se envió ningún mensaje. ${saved?'Esta respuesta quedó en la sesión anónima de este navegador.':'Para registrar respuestas de una prueba, inicia una sesión en Modo investigador.'}</p><button id="continueBrowsing" class="button primary full">Seguir explorando <span aria-hidden="true">→</span></button></div>`;
      $('continueBrowsing').addEventListener('click',()=>closeDialog('productDialog'));$('continueBrowsing').focus();
    });
    $('backToDetail').addEventListener('click',()=>{record('interest_cancelled',{productId:currentProduct.id,reason:'volver_al_detalle'});interestPending=false;renderDetail();$('showInterest').focus();});
    $('interestForm').querySelector('input').focus();
  }
  $('productDialog').addEventListener('close',()=>{if(interestPending&&!resetting)record('interest_cancelled',{productId:currentProduct?.id,reason:'cerrar_sin_responder'});interestPending=false;});

  function startSelling(){
    publication={id:'L-'+uuid(),answered:false};sellerPending=true;$('sellerForm').reset();$('sellerPrice').setCustomValidity('');$('sellerForm').hidden=false;$('sellerPreview').hidden=true;
    $('sellerTitle').textContent='Simula tu anuncio.';record('publication_started',{publicationId:publication.id});openDialog('sellerDialog');
  }
  $('startSelling').addEventListener('click',startSelling);
  $('sellerPrice').addEventListener('input',()=>{$('sellerPrice').setCustomValidity('');});
  $('sellerForm').addEventListener('submit',e=>{
    e.preventDefault();const cents=U.parseCents($('sellerPrice').value);
    if(cents===null){$('sellerPrice').setCustomValidity('Escribe un precio de $1 a $99,999.99 con hasta dos decimales.');$('sellerPrice').reportValidity();return;}
    const name=$('sellerName').value.trim();if(!name){$('sellerName').value='';$('sellerName').reportValidity();return;}
    const data={publicationId:publication.id,category:$('sellerCategory').value,size:$('sellerSize').value,condition:$('sellerCondition').value,...U.commission(cents)};
    publication.data=data;sellerPending=false;const saved=record('publication_completed',data);
    $('sellerForm').hidden=true;$('sellerPreview').hidden=false;$('sellerTitle').textContent='Así se vería tu anuncio.';
    $('sellerPreview').innerHTML=`<div class="preview-card"><span class="outlined-tag">VISTA PREVIA FICTICIA</span><h3>${esc(name)}</h3><p>${esc(data.category)} · Talla ${esc(data.size)} · ${esc(data.condition)}</p><div class="commission-box"><p><span>Precio de venta propuesto</span><strong>${esc(U.money(cents))} MXN</strong></p><p><span>Comisión hipotética · 10%</span><strong>${esc(U.money(data.feeCents))} MXN</strong></p><p><span>Recibirías</span><strong>${esc(U.money(data.netCents))} MXN</strong></p></div><p class="field-hint" style="margin-top:12px">Si se concretara la venta, sin considerar otros cargos. No se realiza ningún cobro.</p></div><p class="field-hint" style="margin-top:12px">Publicación simulada ${saved?'registrada en esta sesión':'completada en exploración libre'}. No aparece en el catálogo. Tu interés por vender cuenta aunque no aceptes la comisión.</p><form id="commissionForm" class="commission-form"><fieldset><legend>Si UNIGLO te ayudara a encontrar un comprador, ¿aceptarías esta comisión?</legend><label class="choice-line"><input type="radio" name="commission" value="si" required><span>Sí</span></label><label class="choice-line"><input type="radio" name="commission" value="no" required><span>No</span></label><label class="choice-line"><input type="radio" name="commission" value="depende" required><span>Depende del servicio que ofrezca</span></label></fieldset><button class="button primary full" type="submit">Guardar respuesta</button></form><div id="commissionResult" hidden></div><p class="field-hint" style="margin-top:16px">Esta pregunta explora tu disposición a aceptar una comisión. No demuestra rentabilidad ni implica un compromiso.</p><div class="button-row" style="margin-top:18px"><button id="finishSelling" class="text-link" type="button">Terminar simulación</button></div>`;
    $('commissionForm').addEventListener('submit',answerCommission);$('finishSelling').addEventListener('click',()=>closeDialog('sellerDialog'));
    $('sellerDialog').scrollTop=0;$('sellerTitle').setAttribute('tabindex','-1');$('sellerTitle').focus();
  });
  function answerCommission(e){
    e.preventDefault();if(!publication||publication.answered)return;
    const answer=new FormData(e.target).get('commission');if(!Object.hasOwn(answers,answer))return;
    const saved=record('commission_answered',{...publication.data,answer});publication.answered=true;
    $('commissionForm').hidden=true;$('commissionResult').hidden=false;$('commissionResult').className='saved-response';
    $('commissionResult').textContent=`Respuesta ${saved?'registrada':'simulada'}: ${answers[answer]}. Tu publicación simulada ya estaba completada; no se realizó ningún cobro.`;
    $('finishSelling').focus();
  }
  $('sellerDialog').addEventListener('close',()=>{if(sellerPending&&!resetting)record('publication_abandoned',{publicationId:publication?.id});sellerPending=false;$('sellerForm').reset();$('sellerPreview').innerHTML='';publication=null;});

  // Sesiones locales. Ningún texto libre entra al registro ni a las exportaciones.
  function newParticipantCode(){let code;const ids=read().sessions.map(s=>s.participantId);do{code='P-'+uuid().replace(/-/g,'').slice(-8).toUpperCase();}while(ids.includes(code));return code;}
  function updateStatus(){
    const s=activeSession();$('researchStatus').classList.toggle('recording',Boolean(s));
    $('sessionIndicator').textContent=s?`${persistent?'Registrando':'Registro temporal'} · ${s.participantId} · ${roles[s.role]}`:'Exploración libre · sin registro';
  }
  function resetExperience(){
    resetting=true;clearTimeout(searchTimer);interestPending=false;sellerPending=false;
    ['productDialog','sellerDialog'].forEach(id=>{if($(id).open)$(id).close();});
    $('sellerForm').reset();$('sellerPreview').innerHTML='';publication=null;currentProduct=null;resetFilters(false);
    location.hash='inicio';window.scrollTo({top:0,behavior:'instant'});resetting=false;
  }
  function finishSession(reason='finalizada'){
    flushSearch();
    if(interestPending){record('interest_cancelled',{productId:currentProduct?.id,reason:'fin_de_sesion'});interestPending=false;}
    if(sellerPending){record('publication_abandoned',{publicationId:publication?.id});sellerPending=false;}
    const state=read(),s=state.sessions.find(x=>x.id===boundId);
    if(s&&!s.endedAt&&state.activeId===boundId){s.events.push(event('session_ended',{reason}));s.endedAt=now();state.activeId=null;write(state);selectedId=s.id;}
    boundId=null;resetExperience();updateStatus();
  }
  function openResearch(){
    flushSearch();$('participantId').value=newParticipantCode();renderResearch();
    $('newSessionDetails').open=!read().sessions.length;openDialog('researchDialog');
  }
  $('openResearch').addEventListener('click',openResearch);$('statusResearch').addEventListener('click',openResearch);
  $('sessionForm').addEventListener('submit',e=>{
    e.preventDefault();const segment=$('participantSegment').value,role=$('participantRole').value;
    if(!segments[segment]||!roles[role]||!$('localConsent').checked)return;
    finishSession('nuevo_participante');
    const state=read();
    // Cierra también una sesión que otra pestaña haya dejado activa, antes de cambiar de participante.
    const previous=state.sessions.find(s=>s.id===state.activeId&&!s.endedAt);
    if(previous){previous.endedAt=now();previous.events.push(event('session_ended',{reason:'nuevo_participante'}));}
    const id=uuid();const s={id,participantId:$('participantId').value||newParticipantCode(),segment,role,startedAt:now(),endedAt:null,
      appVersion:U.VERSION,catalogSnapshot:products.map(p=>({id:p.id,name:p.name,category:p.category,size:p.size,priceCents:p.priceCents})),events:[event('session_started')]};
    state.sessions.push(s);state.activeId=id;write(state);boundId=id;selectedId=id;
    $('sessionForm').reset();$('newSessionDetails').open=false;closeDialog('researchDialog');updateStatus();toast(`Sesión ${s.participantId} iniciada. Puedes explorar.`);
  });
  function renderResearch(){
    const state=read(),active=activeSession();
    $('activeSessionInfo').innerHTML=active?`<div class="session-info"><div><strong>En curso · ${esc(active.participantId)}</strong><p>${esc(segments[active.segment])} · ${esc(roles[active.role])}</p></div><button id="endSession" class="button secondary" type="button">Finalizar sesión</button></div>`:state.activeId?'<p class="no-session">Hay una sesión activa en otra pestaña. Aquí no se registra. Puedes iniciar un participante nuevo para cerrar la anterior.</p>':'<p class="no-session">No hay una sesión activa. La exploración libre no se registra.</p>';
    if($('endSession'))$('endSession').addEventListener('click',()=>{finishSession();renderResearch();toast('Sesión finalizada. Ya puedes exportar sus resultados.');});
    $('savedCount').textContent=state.sessions.length+' guardada'+(state.sessions.length===1?'':'s');
    if(!state.sessions.some(s=>s.id===selectedId))selectedId=boundId||state.sessions.at(-1)?.id||null;
    $('sessionSelect').innerHTML=state.sessions.length?[...state.sessions].reverse().map(s=>`<option value="${esc(s.id)}" ${selectedId===s.id?'selected':''}>${esc(s.participantId)} · ${esc(segments[s.segment])} · ${s.endedAt?'Finalizada':'En curso'}</option>`).join(''):'<option value="">Aún no hay sesiones</option>';
    renderSummary();
  }
  function metric(n,label){return `<div class="metric"><strong>${n}</strong><span>${esc(label)}</span></div>`;}
  function renderSummary(){
    const s=read().sessions.find(s=>s.id===selectedId);$('exportActions').hidden=!s;$('eventDetails').hidden=!s;
    if(!s){$('sessionSummary').innerHTML='<p class="session-meta">Inicia una sesión para registrar acciones y exportar resultados.</p>';$('eventsBody').innerHTML='';return;}
    const m=U.summarize(s),names=ids=>ids.map(id=>s.catalogSnapshot?.find(p=>p.id===id)?.name||id).join(', ')||'Sin registros';
    $('sessionSummary').innerHTML=`<p class="session-meta">${esc(s.participantId)} · ${esc(segments[s.segment])} · ${esc(roles[s.role])}<br>Inicio: ${esc(localDate(s.startedAt))} · ${s.endedAt?'Fin: '+esc(localDate(s.endedAt)):'En curso (exportación parcial)'}</p><div class="metrics-grid">${metric(m.productViews,'Consultas de detalle')}${metric(m.uniqueProductsViewed.length,'Prendas distintas consultadas')}${metric(m.searches,'Búsquedas (sin texto)')}${metric(m.filterChanges,'Cambios de filtro')}${metric(m.interestClicks,'Clics en “Me interesa”')}${metric(m.contactConfirmations,'Solicitaría contacto')}${metric(m.contactDeclines,'Todavía no')}${metric(m.interestCancellations,'Interés cerrado sin respuesta')}${metric(m.publicationsStarted,'Publicaciones iniciadas')}${metric(m.publicationsCompleted,'Publicaciones simuladas completas')}${metric(m.publicationsAbandoned,'Publicaciones abandonadas')}${metric(m.commissionAnswers.si,'Respuestas “Sí” a comisión')}</div><div class="summary-notes"><p><strong>Prendas que generaron interés:</strong> ${esc(names(m.interestedProducts))}</p><p><strong>Barreras de confianza:</strong> ${Object.entries(m.trustReasons).map(([r,n])=>esc(r)+' ('+n+')').join(' · ')||'Sin motivos seleccionados'}</p><p><strong>Precios propuestos:</strong> ${m.proposedPricesCents.map(c=>esc(U.money(c))+' MXN').join(' · ')||'Sin registros'}</p><p><strong>Comisión:</strong> Sí: ${m.commissionAnswers.si} · No: ${m.commissionAnswers.no} · Depende: ${m.commissionAnswers.depende} · Sin respuesta: ${m.commissionUnanswered}</p><p>Son conteos de acciones de una sola persona, que puede repetirlas. No son ventas ni tasas de conversión. Compara segmentos con varias sesiones; estas hipótesis aún no están validadas.</p></div>`;
    $('eventsBody').innerHTML=s.events.map(e=>`<tr><td>${esc(new Date(e.at).toLocaleTimeString('es-MX'))}</td><td>${esc(U.EVENT_LABELS[e.type]||e.type)}</td><td>${esc(eventDetail(e,s))}</td></tr>`).join('');
  }
  function eventDetail(e,s){
    const d=e.data;
    if(d.productId)return (s.catalogSnapshot?.find(p=>p.id===d.productId)?.name||d.productId)+(d.reasons?' · '+d.reasons.join(', '):'');
    if(e.type==='search_performed')return `${d.queryLength} caracteres · ${(d.matchedProductIds||[]).length} resultados · texto omitido`;
    if(e.type==='filter_changed')return `${({category:'Categoría',size:'Talla',price:'Precio'})[d.filter]||d.filter}: ${({under200:'Hasta $200', '200to400':'$200.01 a $400',over400:'Más de $400',todas:'Todas',todos:'Todos'})[d.value]||d.value}`;
    if(d.answer)return answers[d.answer]+' · '+U.money(d.priceCents)+' MXN';
    if(d.priceCents)return U.money(d.priceCents)+' MXN';
    return ({nuevo_participante:'Cambio de participante',finalizada:'Fin de prueba'})[d.reason]||d.reason||d.section||d.publicationId||'—';
  }
  $('sessionSelect').addEventListener('change',()=>{selectedId=$('sessionSelect').value;renderSummary();});
  function download(format){
    flushSearch();const session=read().sessions.find(s=>s.id===selectedId);if(!session)return;
    const content=format==='json'?JSON.stringify(U.exportObject(session),null,2):U.toCSV(session);
    const blob=new Blob([content],{type:format==='json'?'application/json;charset=utf-8':'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`UNIGLO-${session.participantId}-${session.startedAt.slice(0,10)}.${format}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('Archivo '+format.toUpperCase()+' generado con la sesión seleccionada.');
  }
  $('exportJSON').addEventListener('click',()=>download('json'));$('exportCSV').addEventListener('click',()=>download('csv'));
  $('showDelete').addEventListener('click',()=>{$('deleteConfirm').hidden=false;$('confirmDelete').focus();});
  $('cancelDelete').addEventListener('click',()=>{$('deleteConfirm').hidden=true;$('showDelete').focus();});
  $('confirmDelete').addEventListener('click',()=>{
    boundId=null;selectedId=null;resetExperience();memory=emptyState();
    try{localStorage.removeItem(KEY);persistent=true;$('storageWarning').hidden=true;}catch(e){persistent=false;warning('Almacenamiento local no disponible. El registro temporal de esta pestaña se borró.');}
    $('deleteConfirm').hidden=true;$('sessionForm').reset();$('participantId').value=newParticipantCode();$('newSessionDetails').open=true;renderResearch();updateStatus();toast('Se borraron las sesiones de prueba de este navegador.');
  });
  window.addEventListener('storage',e=>{
    if(e.key!==KEY&&e.key!==null)return;
    const state=read();
    if(state.activeId!==boundId){boundId=null;selectedId=null;resetExperience();updateStatus();toast('La sesión cambió en otra pestaña. Aquí se detuvo el registro para evitar mezclar participantes.');}
    if($('researchDialog').open)renderResearch();
  });
  window.addEventListener('pagehide',flushSearch);
  const initial=read();boundId=initial.sessions.some(s=>s.id===initial.activeId&&!s.endedAt)?initial.activeId:null;selectedId=boundId;
  renderCategories();renderProducts();updateStatus();
})();
