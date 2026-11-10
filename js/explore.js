/* Explore: live DOM-generated cards, search, mood/price filters, sort, favorites. */
document.addEventListener('DOMContentLoaded',()=>{
  'use strict';
  const data=window.NightShiftData;
  const grid=document.getElementById('activity-grid');
  const search=document.getElementById('search-input');
  const budget=document.getElementById('budget-filter');
  const sort=document.getElementById('sort-filter');
  const empty=document.getElementById('empty-state');
  const params=new URLSearchParams(location.search);
  let activeCategory=['slow','social','outside'].includes(params.get('category'))?params.get('category'):'all';
  search.value=(params.get('search')||'').slice(0,60);
  let favorites=NS.read('ns-favorites',[]);
  if(!Array.isArray(favorites))favorites=[];
  function cardFor(item){
    const article=document.createElement('article');article.className='activity-card';
    const visual=document.createElement('div');visual.className='activity-visual';
    const img=document.createElement('img');img.src=item.image;img.alt=`Illustration of ${item.label.toLowerCase()}`;img.loading='lazy';img.width=1200;img.height=760;visual.append(img);
    const tag=document.createElement('span');tag.className='activity-category';tag.textContent=item.emoji+' '+NS.categoryName(item.category).toUpperCase();visual.append(tag);
    const favorite=document.createElement('button');favorite.type='button';favorite.className='favorite-btn';favorite.dataset.id=item.id;favorite.textContent=favorites.includes(item.id)?'♥':'♡';favorite.setAttribute('aria-label',`${favorites.includes(item.id)?'Remove':'Save'} ${item.name} ${favorites.includes(item.id)?'from':'to'} favorites`);favorite.setAttribute('aria-pressed',String(favorites.includes(item.id)));visual.append(favorite);
    const info=document.createElement('div');info.className='activity-info';
    const label=document.createElement('span');label.className='eyebrow';label.style.margin='0';label.style.fontSize='.64rem';label.textContent=item.label;
    const title=document.createElement('h3');title.textContent=item.name;
    const description=document.createElement('p');description.textContent=item.description;
    const meta=document.createElement('div');meta.className='activity-meta';
    const price=document.createElement('strong');price.textContent=item.price?NS.money(item.price)+' / person':'Free';
    const time=document.createElement('span');time.textContent=item.minutes+' min';meta.append(price,time);
    const link=document.createElement('a');link.className='activity-card-link';link.href='compare.html?add='+encodeURIComponent(item.id);link.textContent='Add to my plan ↗';
    info.append(label,title,description,meta,link);article.append(visual,info);return article;
  }
  function updateFavorites(){document.getElementById('favorite-count').textContent=favorites.length;}
  function render(){
    let items=data.filter(item=>{
      const query=search.value.trim().toLowerCase();
      return (activeCategory==='all'||item.category===activeCategory) &&
       (budget.value==='all'||String(item.budget)===budget.value) &&
       (!query||`${item.name} ${item.description} ${item.label} ${NS.categoryName(item.category)}`.toLowerCase().includes(query));
    });
    const kinds={"price-asc":(a,b)=>a.price-b.price,"duration-asc":(a,b)=>a.minutes-b.minutes,name:(a,b)=>a.name.localeCompare(b.name),featured:(a,b)=>a.featured-b.featured};
    items.sort(kinds[sort.value]||kinds.featured);
    const fragment=document.createDocumentFragment();items.forEach(item=>fragment.append(cardFor(item)));
    grid.replaceChildren(fragment);document.getElementById('result-count').textContent=items.length;
    if(items.length){empty.hidden=true;$(grid).stop(true,true).css('opacity',.4).fadeTo(180,1);} // jQuery fade effect
    else{grid.style.opacity='1';empty.hidden=false;}
    document.querySelectorAll('.tab-chip').forEach(button=>{
      const active=button.dataset.category===activeCategory;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
    });
    updateFavorites();
  }
  function reset(){search.value='';budget.value='all';sort.value='featured';activeCategory='all';render();}
  [search,budget,sort].forEach(input=>input.addEventListener(input===search?'input':'change',render));
  document.querySelectorAll('.tab-chip').forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.category;render();}));
  document.getElementById('reset-filters').addEventListener('click',reset);
  document.getElementById('empty-reset').addEventListener('click',reset);
  grid.addEventListener('click',event=>{
    const button=event.target.closest('button.favorite-btn');if(!button)return;
    const id=button.dataset.id;
    favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];
    NS.save('ns-favorites',favorites);button.setAttribute('aria-pressed',String(favorites.includes(id)));
    button.textContent=favorites.includes(id)?'♥':'♡';const item=data.find(x=>x.id===id);
    button.setAttribute('aria-label',`${favorites.includes(id)?'Remove':'Save'} ${item.name} ${favorites.includes(id)?'from':'to'} favorites`);updateFavorites();
  });
  render();
});
