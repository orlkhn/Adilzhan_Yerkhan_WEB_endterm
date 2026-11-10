/* Shared menu, safe local storage, number format, and real jQuery FAQ effects. */
(function(){
  'use strict';
  const money = value => '₸' + new Intl.NumberFormat('en-US').format(value);
  const localDate = (offset=0) => {const d=new Date();d.setDate(d.getDate()+offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const read = (key,fallback) => {try {const saved=JSON.parse(localStorage.getItem(key));return saved===null?fallback:saved;}catch{return fallback;}};
  const save = (key,value) => {try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}};
  const reveal = (element,duration=230) => {element.hidden=false;$(element).stop(true,true).hide().fadeIn(duration);};
  const categoryName = category => ({slow:'Slow down',social:'Get together',outside:'Step outside'})[category] || 'All ideas';
  window.NS = {money,localDate,read,save,reveal,categoryName};
  document.addEventListener('DOMContentLoaded',()=>{
    const toggle=document.getElementById('menu-toggle');
    const nav=document.getElementById('site-nav');
    if(toggle && nav){
      toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.classList.toggle('open',!open);});
      nav.addEventListener('click',event=>{if(event.target.closest('a')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
    }
    // jQuery effect 1: an accessible slide accordion; stop(true,true) prevents queues on repeated clicks.
    document.querySelectorAll('.faq-trigger').forEach(button=>button.addEventListener('click',()=>{
      const panel=document.getElementById(button.getAttribute('aria-controls'));
      if(!panel)return;
      const closing=button.getAttribute('aria-expanded')==='true';
      button.setAttribute('aria-expanded',String(!closing));
      if(closing){$(panel).stop(true,true).slideUp(220,()=>panel.hidden=true);}
      else{panel.hidden=false;$(panel).stop(true,true).hide().slideDown(240);}
    }));
  });
})();
