const $ = q => document.querySelector(q);
let val = $('input').value;

$('input').addEventListener('focus', () => {
  $('.background').classList.add('zoom');
});

$('input').addEventListener('blur', () => {
  $('.background').style.top = '0';
  $('.background').style.left = '0';
  $('.background').classList.remove('zoom');
});

$('input').addEventListener('keyup', (ev) => {
  if (ev.target.value == val) return;
  $('.background').style.top = Math.random() * 20 - 10 + 'px';
  $('.background').style.left = Math.random() * 20 - 10 + 'px';
  val = ev.target.value;
});

addEventListener('load', () => $('input').focus());