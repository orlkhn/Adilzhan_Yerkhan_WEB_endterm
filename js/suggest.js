/* Suggest: six-field validated form, live errors, clear-on-success, private local suggestions.
   jQuery effects: sliding tips and fading success. Email is never saved. */
document.addEventListener('DOMContentLoaded',()=>{
  'use strict';
  const form=document.getElementById('suggest-form');
  const inputs=[...form.querySelectorAll('input,select,textarea')];
  const fields=Object.fromEntries(inputs.map(el=>[el.id,el]));
  let suggestions=NS.read('ns-suggestions',[]);
  if(!Array.isArray(suggestions))suggestions=[];
  const success=document.getElementById('suggest-success');
  function errorFor(input){const text=input.value.trim();switch(input.id){
    case 'visitor-name':if(!text)return 'Please enter your name.';if(text.length<2||text.length>60||/\d/.test(text))return 'Use at least 2 letters, without numbers.';return '';
    case 'email':if(!text)return 'Please enter your email.';if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text))return 'Enter a valid email, for example you@example.com.';return '';
    case 'spot-name':if(!text)return 'Please enter the spot name.';if(text.length<2)return 'Spot name must have at least 2 characters.';return '';
    case 'category':return text?'':'Please choose a category.';
    case 'spot-budget':if(!text)return 'Enter an estimated price (0 for free).';if(!Number.isFinite(Number(text))||Number(text)<0||Number(text)>50000)return 'Use a price from ₸0 to ₸50,000.';return '';
    case 'reason':if(!text)return 'Tell us why this spot is special.';if(text.length<20)return 'Please write at least 20 characters.';return '';
    default:return '';
  }}
  function validate(input){const message=errorFor(input);const field=document.getElementById(input.id+'-error');field.textContent=message;input.classList.toggle('is-invalid',Boolean(message));input.classList.toggle('is-valid',!message&&Boolean(input.value));input.setAttribute('aria-invalid',String(Boolean(message)));return !message;}
  function renderSaved(){
    const list=document.getElementById('suggestions-list');list.replaceChildren();
    if(!suggestions.length){const empty=document.createElement('div');empty.className='suggestion-empty';empty.textContent='No local suggestions yet. Share the first one above!';list.append(empty);return;}
    suggestions.forEach(item=>{
      const article=document.createElement('article');article.className='suggestion-item';
      const category=document.createElement('small');category.textContent=NS.categoryName(item.category).toUpperCase()+' · '+NS.money(Number(item.budget)||0);
      const title=document.createElement('h3');title.textContent=item.name;
      const reason=document.createElement('p');reason.textContent=item.reason;
      article.append(category,title,reason);list.append(article);
    });
  }
  inputs.forEach(input=>{
    input.addEventListener('blur',()=>validate(input));
    input.addEventListener('input',()=>{if(input.classList.contains('is-invalid')||input.classList.contains('is-valid'))validate(input);if(input.id==='reason')document.getElementById('reason-count').textContent=input.value.length;});
    input.addEventListener('change',()=>{if(input.classList.contains('is-invalid')||input.classList.contains('is-valid'))validate(input);});
  });
  form.addEventListener('submit',event=>{
    event.preventDefault();let valid=true;let firstInvalid=null;
    inputs.forEach(input=>{if(!validate(input)){valid=false;if(!firstInvalid)firstInvalid=input;}});
    if(!valid){success.hidden=true;firstInvalid.focus();return;}
    const suggestion={name:fields['spot-name'].value.trim(),category:fields['category'].value,budget:Number(fields['spot-budget'].value),reason:fields['reason'].value.trim().slice(0,500)};
    const newList=[suggestion,...suggestions].slice(0,5);
    if(!NS.save('ns-suggestions',newList)){success.hidden=false;success.classList.add('error');success.textContent='Local storage is unavailable. Nothing was saved.';return;}
    suggestions=newList;renderSaved();form.reset();document.getElementById('reason-count').textContent='0';
    inputs.forEach(input=>{input.classList.remove('is-valid','is-invalid');input.removeAttribute('aria-invalid');document.getElementById(input.id+'-error').textContent='';});
    success.classList.remove('error');success.textContent='✳  Suggestion saved locally! Thanks for sharing. Your form is clear and ready for the next idea.';
    NS.reveal(success,300); // jQuery fade effect, not an alert.
  });
  document.getElementById('clear-suggestions').addEventListener('click',()=>{suggestions=[];NS.save('ns-suggestions',suggestions);renderSaved();success.hidden=true;});
  document.getElementById('tips-toggle').addEventListener('click',event=>{
    const button=event.currentTarget;const panel=document.getElementById('tips-content');const closing=button.getAttribute('aria-expanded')==='true';button.setAttribute('aria-expanded',String(!closing));
    if(closing)$(panel).stop(true,true).slideUp(220,()=>panel.hidden=true);
    else{panel.hidden=false;$(panel).stop(true,true).hide().slideDown(240);}
  });
  renderSaved();
});
