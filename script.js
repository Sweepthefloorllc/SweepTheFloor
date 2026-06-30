document.querySelectorAll('.faq-item').forEach(item=>{
  const ans=item.querySelector('.faq-a');
  if(ans) ans.style.maxHeight='0px';
});
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.parentElement;
    const ans=item.querySelector('.faq-a');
    const willOpen=!item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(open=>{
      if(open!==item){
        const a=open.querySelector('.faq-a');
        if(a) a.style.maxHeight='0px';
        open.classList.remove('open');
      }
    });
    if(willOpen){
      item.classList.add('open');
      if(ans) ans.style.maxHeight=ans.scrollHeight+'px';
    }else{
      if(ans) ans.style.maxHeight='0px';
      item.classList.remove('open');
    }
  });
});
window.addEventListener('resize',()=>{
  document.querySelectorAll('.faq-item.open .faq-a').forEach(a=>a.style.maxHeight=a.scrollHeight+'px');
});
const reveal=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform='translateY(0)';reveal.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll('.feature,.step,.card-img,.service-info,.portrait,.form-card,.side-card,.trust-grid div,.audience-grid div,.gallery-grid article,.why-photo,.service-area-card').forEach(el=>{el.style.opacity=.001;el.style.transform='translateY(18px)';el.style.transition='opacity .55s ease, transform .55s ease, box-shadow .24s ease';reveal.observe(el)});
