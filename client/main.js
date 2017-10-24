const init = () => {
  UIinit();
  cardsInit();
  
  sendGet(null, 'HEAD');
};

window.onload = init;