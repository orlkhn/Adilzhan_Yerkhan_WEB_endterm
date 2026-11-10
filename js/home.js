/* Home: two interactive features — mood recommendation and random picker. */
document.addEventListener('DOMContentLoaded',()=>{
  'use strict';
  const data=window.NightShiftData;
  let previousId='';
  const moodResult=document.getElementById('mood-result');
  function showMood(mood){
    const matches=data.filter(item=>item.category===mood);
    const item=matches[Math.floor(Math.random()*matches.length)];
    document.getElementById('mood-result-name').textContent=item.emoji+'  '+item.name;
    document.getElementById('mood-result-desc').textContent=item.description;
    document.getElementById('mood-result-link').href='explore.html?category='+encodeURIComponent(mood);
    NS.reveal(moodResult,260); // jQuery effect 2: fadeIn on contextual recommendation.
    document.querySelectorAll('.mood-card').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.mood===mood)));
  }
  document.querySelectorAll('.mood-card').forEach(button=>{
    button.setAttribute('aria-pressed','false');
    button.addEventListener('click',()=>showMood(button.dataset.mood));
  });
  document.getElementById('surprise-btn').addEventListener('click',()=>{
    let candidates=data.filter(item=>item.id!==previousId);
    const chosen=candidates[Math.floor(Math.random()*candidates.length)];previousId=chosen.id;
    const card=$('#surprise-card');
    // jQuery effect 3: chained fadeOut/fadeIn; stop clears fast repeated clicks.
    card.stop(true,true).fadeOut(150,()=>{
      document.getElementById('surprise-name').textContent=chosen.emoji+'  '+chosen.name;
      document.getElementById('surprise-description').textContent=chosen.description;
      const link=document.getElementById('surprise-link');link.href='explore.html?search='+encodeURIComponent(chosen.name);link.textContent='Explore this idea ↗';
      card.fadeIn(260);
    });
  });
});
