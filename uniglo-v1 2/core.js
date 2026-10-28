/* Funciones de datos, sin red ni dependencias. Los importes usan centavos enteros. */
(function (root) {
  'use strict';
  const VERSION = '1.0.1';
  const EVENT_LABELS = {
    session_started:'Sesión iniciada', session_ended:'Sesión finalizada',
    section_viewed:'Navegación', product_viewed:'Detalle consultado', filter_changed:'Filtro utilizado',
    filters_cleared:'Filtros limpiados', search_performed:'Búsqueda realizada',
    interest_clicked:'Me interesa', contact_confirmed:'Solicitaría contacto',
    contact_declined:'Todavía no', interest_cancelled:'Interés cancelado',
    trust_reasons:'Información necesaria', publication_started:'Publicación iniciada',
    publication_completed:'Publicación simulada completada', publication_abandoned:'Publicación abandonada',
    commission_answered:'Respuesta de comisión'
  };
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  function filterProducts(products, {search='',category='',size='',price=''} = {}) {
    const query = normalize(search);
    return products.filter(p => (!query || normalize(p.name+' '+p.brand).includes(query)) &&
      (!category || p.category===category) && (!size || p.size===size) &&
      (!price || (price==='under200' && p.priceCents<=20000) ||
        (price==='200to400' && p.priceCents>20000 && p.priceCents<=40000) ||
        (price==='over400' && p.priceCents>40000)));
  }
  function parseCents(value) {
    const raw=String(value).trim();
    if(!/^\d+(\.\d{1,2})?$/.test(raw)) return null;
    const [whole,part='']=raw.split('.');
    const cents=Number(whole)*100+Number(part.padEnd(2,'0'));
    return Number.isSafeInteger(cents) && cents>=100 && cents<=9999999 ? cents : null;
  }
  function commission(priceCents) {
    if(!Number.isSafeInteger(priceCents) || priceCents<0) throw new TypeError('Precio inválido');
    const feeCents=Math.round(priceCents/10);
    return {priceCents,rate:0.10,feeCents,netCents:priceCents-feeCents};
  }
  const money=cents=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',minimumFractionDigits:cents%100?2:0,maximumFractionDigits:2}).format(cents/100);
  function summarize(session) {
    const events=session.events||[];
    const count=type=>events.filter(e=>e.type===type).length;
    const unique=type=>[...new Set(events.filter(e=>e.type===type).map(e=>e.data.productId).filter(Boolean))];
    const reasons={};
    events.filter(e=>e.type==='trust_reasons').forEach(e=>(e.data.reasons||[]).forEach(r=>{reasons[r]=(reasons[r]||0)+1;}));
    const answers={si:0,no:0,depende:0};
    events.filter(e=>e.type==='commission_answered').forEach(e=>{if(e.data.answer in answers) answers[e.data.answer]++;});
    const publications=events.filter(e=>e.type==='publication_completed').map(e=>({...e.data}));
    return {
      productViews:count('product_viewed'),uniqueProductsViewed:unique('product_viewed'),
      filterChanges:count('filter_changed'),filterResets:count('filters_cleared'),searches:count('search_performed'),
      interestClicks:count('interest_clicked'),interestedProducts:unique('interest_clicked'),
      contactConfirmations:count('contact_confirmed'),contactDeclines:count('contact_declined'),
      interestCancellations:count('interest_cancelled'),
      publicationsStarted:count('publication_started'),publicationsCompleted:count('publication_completed'),
      publicationsAbandoned:count('publication_abandoned'),proposedPricesCents:publications.map(p=>p.priceCents),
      commissionAnswers:answers,commissionUnanswered:Math.max(0,publications.length-count('commission_answered')),
      trustReasons:reasons,totalEvents:events.length
    };
  }
  function exportObject(session) {
    return {schemaVersion:1,app:'UNIGLO',appVersion:VERSION,exportedAt:new Date().toISOString(),
      currency:'MXN',moneyUnit:'centavos',
      interpretation:'Interacciones e intenciones declaradas en una simulación. No son transacciones ni ventas. Las búsquedas no contienen texto libre.',
      session,summary:summarize(session)};
  }
  function csvCell(value) {
    let s=value==null?'':typeof value==='object'?JSON.stringify(value):String(value);
    // Evita fórmulas al abrir el archivo en una hoja de cálculo.
    if(/^[=+@\-\t\r]/.test(s)) s="'"+s;
    return '"'+s.replace(/"/g,'""')+'"';
  }
  function toCSV(session) {
    const header=['schema_version','app_version','session_id','participant_id','segment','role','session_started_at_utc','session_ended_at_utc','event_id','event_at_utc','event_type','event_label','product_id','publication_id','price_cents_mxn','commission_cents_mxn','net_cents_mxn','commission_answer','trust_reasons','details_json'];
    const rows=session.events.map(e=>[1,VERSION,session.id,session.participantId,session.segment,session.role,session.startedAt,session.endedAt,e.id,e.at,e.type,EVENT_LABELS[e.type]||e.type,e.data.productId,e.data.publicationId,e.data.priceCents,e.data.feeCents,e.data.netCents,e.data.answer,e.data.reasons?.join(' | '),e.data]);
    return '\uFEFF'+[header,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
  }
  const api={VERSION,EVENT_LABELS,normalize,filterProducts,parseCents,commission,money,summarize,exportObject,toCSV};
  root.UNIGLO=api;
  if(typeof module!=='undefined' && module.exports) module.exports=api;
})(globalThis);
