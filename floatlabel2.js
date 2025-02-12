const nameDom=document.querySelector('#sp1');
const mailDom=document.querySelector('#sp2');
const phoneDom=document.querySelector('#sp3');
const nameInput=document.querySelector('#nameinput');
const mailInput=document.querySelector('#emailinput');
const phoneInput=document.querySelector('#phoneinput');

nameInput.addEventListener('focus',()=>{
    nameDom.style.top='-20px';
});
nameInput.addEventListener('blur',()=>{

if(nameInput.value!=''){
    nameDom.style.top='-20px';
}
else{
    nameDom.style.top='10px';
    nameDom.style.left='10px';
}
});

mailInput.addEventListener('focus',()=>{
    mailDom.style.top='-20px';
});
mailInput.addEventListener('blur',()=>{

if(mailInput.value!=''){
    mailDom.style.top='-20px';
}
else{
    mailDom.style.top='10px';
    mailDom.style.left='10px';
}
});

phoneInput.addEventListener('focus',()=>{
phoneDom.style.top='-20px';
});
phoneInput.addEventListener('blur',()=>{

if(phoneInput.value!=''){
    phoneDom.style.top='-20px';
}
else{
    phoneDom.style.top='10px';
    phoneDom.style.left='10px';
}
});