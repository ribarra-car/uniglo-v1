const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const U=require('../core.js');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../catalogo.js'),'utf8'),context);
const catalog=context.window.UNIGLO_PRODUCTS;

test('catálogo completo y rutas de imágenes existentes',()=>{
  assert.equal(catalog.length,12);assert.equal(new Set(catalog.map(p=>p.id)).size,12);
  for(const p of catalog){assert.ok(fs.existsSync(path.join(__dirname,'..',p.image)));assert.ok(p.measurements&&p.defects&&p.alt);assert.ok(Number.isInteger(p.priceCents));}
});
test('búsqueda ignora acentos y mayúsculas; filtros se combinan',()=>{
  assert.deepEqual(Array.from(U.filterProducts(catalog,{search:'JEANS',size:'30',price:'200to400'}),p=>p.id),['U02']);
  assert.equal(U.filterProducts(catalog,{search:'grafica'}).length,1);
  assert.equal(U.filterProducts(catalog,{category:'Chamarras',size:'XS'}).length,0);
  assert.equal(U.filterProducts(catalog,{size:'XS'}).length,1);
});
test('rangos de precio sin huecos ni solapamientos en límites',()=>{
  const ps=[20000,20001,40000,40001].map((priceCents,i)=>({id:String(i),priceCents,name:'x',brand:'',size:'M',category:'x'}));
  assert.deepEqual(U.filterProducts(ps,{price:'under200'}).map(p=>p.id),['0']);
  assert.deepEqual(U.filterProducts(ps,{price:'200to400'}).map(p=>p.id),['1','2']);
  assert.deepEqual(U.filterProducts(ps,{price:'over400'}).map(p=>p.id),['3']);
});
test('precios válidos y rechazo de vacíos, negativos, exponentes y precisión excesiva',()=>{
  for(const v of ['',0,'-1','0.99','1.001','350.555','1e3','Infinity','999999','abc','NaN'])assert.equal(U.parseCents(v),null,String(v));
  assert.equal(U.parseCents('350'),35000);assert.equal(U.parseCents('350.50'),35050);assert.equal(U.parseCents('99999.99'),9999999);assert.equal(U.parseCents('1'),100);
});
test('comisión exacta del ejemplo y conservación de importes con redondeo al centavo',()=>{
  assert.deepEqual(U.commission(35000),{priceCents:35000,rate:.1,feeCents:3500,netCents:31500});
  assert.deepEqual(U.commission(35055),{priceCents:35055,rate:.1,feeCents:3506,netCents:31549});
  for(let p=100;p<100000;p+=17){const c=U.commission(p);assert.equal(c.feeCents+c.netCents,p);assert.ok(Math.abs(c.feeCents-p/10)<=.5);}
});
test('resumen distingue clics, contacto, cancelación, rechazo y comisión sin responder',()=>{
  const e=(type,data={})=>({id:type,at:'2026-10-28T18:00:00Z',type,data});
  const s={events:[e('product_viewed',{productId:'U01'}),e('product_viewed',{productId:'U01'}),e('interest_clicked',{productId:'U01'}),e('interest_clicked',{productId:'U01'}),e('contact_confirmed',{productId:'U01'}),e('contact_declined',{productId:'U02'}),e('interest_cancelled'),e('publication_started'),e('publication_completed',{priceCents:35000}),e('publication_completed',{priceCents:20000}),e('commission_answered',{answer:'no'}),e('trust_reasons',{reasons:['Medidas exactas']})]};
  const m=U.summarize(s);assert.equal(m.productViews,2);assert.equal(m.uniqueProductsViewed.length,1);assert.equal(m.interestClicks,2);assert.equal(m.contactConfirmations,1);assert.equal(m.contactDeclines,1);assert.equal(m.interestCancellations,1);assert.equal(m.publicationsCompleted,2);assert.equal(m.commissionAnswers.no,1);assert.equal(m.commissionUnanswered,1);assert.equal(m.trustReasons['Medidas exactas'],1);
});
test('CSV conserva comillas, acentos e importes y neutraliza fórmulas; JSON incluye contexto',()=>{
  const s={id:'sesion',participantId:'=1+1',segment:'estudiante',role:'ambos',startedAt:'2026-10-28T18:00:00Z',endedAt:null,catalogSnapshot:[],events:[{id:'e',at:'2026-10-28T18:01:00Z',type:'publication_completed',data:{priceCents:35000,feeCents:3500,netCents:31500,category:'Prenda, "ejemplo"'}}]};
  const csv=U.toCSV(s);assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes("'=1+1"));assert.ok(csv.includes('"35000","3500","31500"'));
  const line=csv.split('\r\n')[1],cells=[];let value='',quoted=false;
  for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(quoted&&line[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){cells.push(value);value='';}else value+=c;}cells.push(value);
  assert.equal(cells.length,20);assert.equal(JSON.parse(cells[19]).category,'Prenda, "ejemplo"');
  const exported=U.exportObject(s);assert.equal(exported.currency,'MXN');assert.equal(exported.moneyUnit,'centavos');assert.equal(exported.summary.publicationsCompleted,1);assert.equal(exported.session,s);
});
