/* eslint linebreak-style: ["error", "windows"] */
const section1 = document.getElementById('big-pizza-section');
const viewPizzaBig = document.getElementById('big-pizza-section-only');
const viewPizzaFamily = document.getElementById('family-pizza-section-only');
const btnSegunda = document.getElementById('btn-segunda');
const btnPromoPrincipal = document.getElementById('btn-patriotas');
const btnPizzaBig = document.getElementById('btn-bigpizza');
const btnPizzaFamily = document.getElementById('btn-family');
const principal = document.querySelector('.containerPrincipal');
const containerBig = document.querySelector('.container-bigpizza');
const containerFamily = document.querySelector('.container-familypizza');
const promoPrincipal = document.getElementById('promo-principal-section');
const back = document.querySelector('.back');
const back1 = document.querySelector('.back-1');
const back2 = document.querySelector('.back-2');
const btnConfirmOrder = document.getElementById('config');
const backPrincipal = document.querySelector('.back-principal');
const containerDetail = document.getElementsByClassName('detail-view');
const confirm2da = document.getElementsByClassName('btn-confirm-promo2');
const confirmPrincipal = document.getElementsByClassName('btn-confirm-promo-principal');
const confirmBig = document.getElementsByClassName('confirm-big-js');
const confirmFamily = document.getElementsByClassName('confirm-family-js');
const totalPromo2da = document.getElementById('total-count-family');
const showTotal = document.getElementsByClassName('total');
const numberSpan = document.getElementsByClassName('number-span');
const promobot = document.getElementsByClassName('promobot');
const btnBot = document.getElementById('btn-bot');
const totalCountBot = document.getElementById('total-count-bot');
const spanNumberPrincipal = document.getElementsByClassName('span-p');
const btnDecrement = document.getElementsByClassName('decrement');
const btnIncrement = document.getElementsByClassName('increment');
const borderPreviewPromoFavorita = document.getElementsByClassName('border-preview');
// Inicializando Variables
const colorInactivePromo = '#cfc9c7';
const totalFinal = 0;
let countPizzaTotal = 1;
let sizePizza = 'Grande';
let favoritePizza;
const arrayPromociones = [];
let arrayBigPizza = [];
let arrayFinaly = [];
const arrayPromoPrincipal = [];
let arraySend = [];

// Funciones

function inactivePromo() {
  promobot.style.color = colorInactivePromo;
  btnBot.setAttribute('disabled', true);
  btnBot.style.backgroundColor = colorInactivePromo;
  totalCountBot.style.color = colorInactivePromo;
}

function desactiveButton(element) {
  element.attr('disabled', true);
  element.css('backgroundColor', '#A39D9B');
}

function activeButton(element) {
  element.removeAttr('disabled');
  element.css('backgroundColor', '#009774');
}

function resetPromoPrincipal() {
  spanNumberPrincipal.innerText = 0;
  btnDecrement.classList.remove('btn-active');
  btnIncrement.classList.remove('btn-active');
  desactiveButton(confirmPrincipal);
}

// function deleteArrayIndex(array, id) {
//   for (let p = 0; p < array.length; p += 1) {
//     if (id === p) {
//       array.splice(p, 1);
//     }
//   }
// }

function deleteArrayName(array, name) {
  for (let p = 0; p < array.length; p += 1) {
    if (array[p].detalle === name) {
      array.splice(p, 1);
    }
  }
}

function templatePizzasDetail(element) {
  element.forEach((product, index) => {
    const templateView = `
    <div>
  <div class="row">
  <div class="col-9"> <p class="mb-0">1 Pizza ${product} </p></div>
  <div class="col-3 text-right"><button class="btn-delete" id=${index} data-id=${index}><i class="fas fa-times"></i></button></div>
  </div>
  
  </div>
     `;
    containerDetail.append(templateView);
  });
}


function templateDetail(element) {
  const templateView = `<div>
  <div class="row">
  ${templatePizzasDetail(element.detalle)} 
  </div>`;
}


function validationPricePromoPrincipal(sizePizzaSelect, countPizzaTotalSelect) {
  let totalPromoPrincipal = 0;
  if (sizePizzaSelect === 'Grande' && countPizzaTotalSelect === 1) {
    totalPromoPrincipal = 39.90;
  } else if (sizePizzaSelect === 'Familiar' && countPizzaTotalSelect === 1) {
    totalPromoPrincipal = 44.90;
  } else if (sizePizzaSelect === 'Grande' && countPizzaTotalSelect === 2) {
    totalPromoPrincipal = 59.90;
  } else if (sizePizzaSelect === 'Familiar' && countPizzaTotalSelect === 2) {
    totalPromoPrincipal = 69.90;
  } else {
    totalPromoPrincipal = 0;
  }
  return totalPromoPrincipal;
}

function templatePromoDetail(element, index) {
  let namePromo;
  if (element.promocion === 'principal') {
    namePromo = 'Promoción La favorita';
  }
  if (element.promocion === 'segunda1sol') {
    namePromo = 'Promoción La Segunda a 1 sol';
  }
  if (!element.detalle.pizza2 && element.promocion === 'principal') {
    const templateView = `<div>
    <div class="row">
    <div class="col-9"> <p class="mb-0 title-promo"> ${namePromo} = S/ ${element.total} </p></div>
    <div class="col-3 text-right"><button class="btn-delete" id=${index} data-id=${index}><i class="fas fa-times"></i></button></div>
    </div>
     
    <p class="mb-0 detail-f">1 Pizza ${element.detalle.pizza1}</p>
    
    </div>`;
    containerDetail.append(templateView);
  }
  if ((element.detalle.pizza2 && element.promocion === 'segunda1sol') || (element.detalle.pizza2 && element.promocion === 'principal')) {
    const templateView = `<div>
    <div class="row">
    <div class="col-9"> <p class="mb-0 title-promo"> ${namePromo} = S/ ${element.total} </p></div>
    <div class="col-3 text-right"><button class="btn-delete" id=${index} data-id=${index}><i class="fas fa-times"></i></button></div>
    </div>
    <p class="mb-0 detail-f">1 Pizza ${element.detalle.pizza1}</p>
    <p class="mb-0 detail-f">1 Pizza ${element.detalle.pizza2}</p>
   
    </div>`;
    containerDetail.append(templateView);
  }
  if (element.promocion === 'carta') {
    templateDetail(element, index);
  }
}


// funciòn que cuenta las promociones seleccionadas
function countPromo() {
  // Obtener el array de Promociones Finales
  const totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
  let count2da = 0;
  let countPrincipal = 0;

  if (totalPedidoPromo.length > 0) {
    totalPedidoPromo.forEach((element) => {
      if (element.promocion === 'segunda1sol') {
        count2da = +1;
        document.querySelector('#total-count-2da').innerText = count2da;
      }
      if (element.promocion === 'principal') {
        countPrincipal += 1;
        document.querySelector('#total-count-principal').innerText = countPrincipal;
      }
      if (element.promocion === 'carta') {
        countPrincipal += 1;
        document.querySelector('#total-count-big').innerText = countPrincipal; // Falta que se cuente solo de carta Big
      }
      if (element.promocion === 'principal' && totalPedidoPromo.length === 1) {
        document.querySelector('#total-count-2da').innerText = 0;
      }
      if (element.promocion === 'segunda1sol' && totalPedidoPromo.length === 1) {
        document.querySelector('#total-count-principal').innerText = 0;
      }
    });
  } else {
    document.querySelector('#total-count-2da').innerText = 0;
    document.querySelector('#total-count-principal').innerText = 0;
  }
}


// Funciones de Incrementar/Decrementar Precio
const incrementTotal = (price, idNumberBox, name, type) => {
  const promo = localStorage.getItem('promocion');
  if (promo === 'segunda1sol') {
    let number = document.querySelector(`#${idNumberBox}`).value;
    number = parseInt(number, 10) + 1; // valor del número central
    document.querySelector(`#${idNumberBox}`).innerText = number;
    const countPedido1 = JSON.parse(localStorage.arrayFinaly);
    const countPedido2 = JSON.parse(localStorage.arrayBigPizza);
    // almacenando data de costo total
    countPedido2.push({
      detalle: name,
      precio: parseFloat(price),
      tamaño: type,
    });
    countPedido1.push({
      detalle: name,
      precio: parseFloat(price),
      tamaño: type,
    });
    localStorage.setItem('arrayBigPizza', JSON.stringify(countPedido2));
    localStorage.setItem('arrayFinaly', JSON.stringify(countPedido1));
    const countPedido = JSON.parse(localStorage.arrayFinaly);

    if (countPedido.length < 2 || countPedido.length > 2) {
      desactiveButton(confirm2da);
      document.querySelector('.text-alert').innerText = ' * Debes elegir solo 2 pizzas';
    } else {
      activeButton(confirm2da);
      document.querySelector('.text-alert').innerText = '';
    }
  }
  if (promo === 'principal') {
    let numberPrincipal = document.querySelector(`#${idNumberBox}`).value;
    numberPrincipal = parseInt(numberPrincipal, 10) + 1; // valor del número central
    document.querySelector(`#${idNumberBox}`).innerText = numberPrincipal; // mostrando valores
    arrayPromoPrincipal.push({
      detalle: name,
      tamaño: sizePizza,
    });
    localStorage.setItem('arrayPromoPrincipal', JSON.stringify(arrayPromoPrincipal));

    const totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
    localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));

    const countPromoFinal = JSON.parse(localStorage.arrayPromoPrincipal);
    if (countPizzaTotal === 2) {
      if (countPromoFinal.length !== 2) {
        desactiveButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = ' * Debes elegir solo 2 pizzas';
      } else {
        activeButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = '';
      }
    }
    if (countPizzaTotal === 1) {
      if (countPromoFinal.length !== 1) {
        desactiveButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = ' * Debes elegir solo 1 pizza';
      } else {
        activeButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = '';
      }
    }
  }
  if (promo === 'carta') {
    let numberPrincipal = document.querySelector(`#${idNumberBox}`).value;
    numberPrincipal = parseInt(numberPrincipal, 10) + 1; // valor del número central
    document.querySelector(`#${idNumberBox}`).innerText = numberPrincipal; // mostrando valores


    arrayBigPizza.push({
      detalle: name,
      precio: parseFloat(price),
      tamaño: type,
    });
    localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
  }
};

const decrementTotal = (idNumberBox, name) => {
  const promo = localStorage.getItem('promocion');
  if (promo === 'segunda1sol') {
    let number = document.querySelector(`#${idNumberBox}`).value;
    number = parseInt(number, 10) - 1;
    if (number >= 0) {
      document.querySelector(`#${idNumberBox}`).innerText = number; // mostrando valores
      // Encontrar el valor y eliminarlo
      let countPedido = JSON.parse(localStorage.arrayFinaly);
      const countPedido2 = JSON.parse(localStorage.arrayBigPizza);
      // encontrar el valor y borrarlo
      deleteArrayName(countPedido, name);
      deleteArrayName(countPedido2, name);

      localStorage.setItem('arrayBigPizza', JSON.stringify(countPedido));
      localStorage.setItem('arrayFinaly', JSON.stringify(countPedido2));

      countPedido = JSON.parse(localStorage.arrayFinaly);
      if (countPedido.length < 2 || countPedido.length > 2) {
        desactiveButton(confirm2da);
        document.querySelector('.text-alert').innerText = ' * Debes elegir solo 2 pizzas';
      } else {
        activeButton(confirm2da);
        document.querySelector('.text-alert').innerText = '';
      }
    }
  }
  if (promo === 'principal') {
    let numberPrincipal = document.querySelector(`#${idNumberBox}`).value;
    numberPrincipal = parseInt(numberPrincipal, 10) - 1;

    if (numberPrincipal >= 0) {
      document.querySelector(`#${idNumberBox}`).innerText = numberPrincipal; // mostrando valores
      // Encontrar el valor y eliminarlo
      // const countPedidoPromo = JSON.parse(localStorage.arrayPromoPrincipal);
      const arrayPrincipalDelete = arrayPromoPrincipal.filter(element => element.detalle !== name);
      localStorage.setItem('arrayPromoPrincipal', JSON.stringify(arrayPrincipalDelete));
    }

    const countPromoFinal = JSON.parse(localStorage.arrayPromoPrincipal);
    if (countPizzaTotal === 2) {
      if (countPromoFinal.length > 2 || countPromoFinal.length < 2) {
        desactiveButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = ' * Debes elegir solo 2 pizzas';
      } else {
        activeButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = '';
      }
    }
    if (countPizzaTotal === 1) {
      if (countPromoFinal.length > 1 || countPromoFinal.length < 1) {
        desactiveButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = ' * Debes elegir solo 1 pizza';
      } else {
        activeButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = '';
      }
    }
  }
};


// VAlidaciòn de activar promociones por día
// function validateDaysPromo() {
//   const date = new Date();
//   const today = date.getDay();
//   if (today == 2 || today == 1) { // 4 es jueves y 2 martes
//     $('.promo2da').css('color', '#807673');
//     $('#btn-segunda').removeAttr('disabled');
//     $('#btn-segunda').css('backgroundColor', '#807673');
//     $('#total-count-2da').css('color', '#00977');
//   } else {
//     $('.promo2da').css('color', '#cfc9c7');
//     $('#btn-segunda').attr('disabled', true);
//     $('#btn-segunda').css('backgroundColor', '#cfc9c7');
//     $('#total-count-2da').css('color', '#cfc9c7');
//   }
// }


function totalOrderDelivery() {
  const numberTotal = localStorage.getItem('totalFinal');
  const totalDelivery = parseFloat(numberTotal) + 3.90;
  return totalDelivery.toFixed(1);
}

function resetBorderGrey() {
  borderPreviewPromoFavorita.classList.remove('border-r');
  borderPreviewPromoFavorita.classList.add('border-b');
}

function activeBorderRadioButtonPizza(id) {
  resetBorderGrey();
  const elementSelectRadio = document.getElementById(`${id}`);
  elementSelectRadio.classList.remove('border-b');
  elementSelectRadio.classList.add('border-r');
}

function showSectionPizzasFavorites(count) {
  if (count === 1) {
    document.querySelector('#box-pizza-favorite').classList.add('hide');
    document.querySelector('#title-favorite-selection').innerText = 'tu pizza';
  } else {
    document.querySelector('#box-pizza-favorite').classList.add('show');
    document.querySelector('#title-favorite-selection').innerText = 'tu primera pizza';
  }
}

function oneFavorite(sizePizzaFavorite) {
  const arrayFavorita = [{
    detalle: 'La Favorita de John',
    tamaño: sizePizzaFavorite,
  }];
  localStorage.setItem('arrayPromoPrincipal', JSON.stringify(arrayFavorita));
}

function initFavoritePizzas() {
  localStorage.setItem('totalPromoPrincipal', 39.90);
  sizePizza = 'Grande';
  document.querySelector('input[type=radio]').setAttribute('checked', () => this.getAttribute('checked') === 'checked');
  document.querySelector('#box-pizza-favorite').classList.add('hide');
  oneFavorite(sizePizza);
  activeButton(confirmPrincipal);
}

function resetButtons() {
  numberSpan.innerText = 0;
  btnDecrement.classList.remove('btn-active');
  btnIncrement.classList.remove('btn-active');
}

function twoFavoritesPizzas(sizePizzaFav, favoritePizzaName) {
  const arrayFavorita = [{
    detalle: 'La Favorita de John',
    tamaño: sizePizzaFav,
  },
  {
    detalle: favoritePizzaName,
    tamaño: sizePizzaFav,
  },
  ];
  localStorage.setItem('arrayPromoPrincipal', JSON.stringify(arrayFavorita));
}

localStorage.setItem('totalFinal', totalFinal);
// ocultando las secciones
section1.classList.add('hide');
promoPrincipal.classList.add('hide');
viewPizzaBig.classList.add('hide');
viewPizzaFamily.classList.add('hide');


// Promocion segunda a 1 sol
btnSegunda.addEventListener('click', () => {
  section1.classList.toggle('hide');
  principal.classList.add('hide');
  containerBig.classList.add('show');
  containerFamily.classList.add('hide');
  localStorage.setItem('promocion', 'segunda1sol');
  arrayBigPizza = [];
  arrayFinaly = [];
  localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
  localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
  // resetButtons();
});


btnPromoPrincipal.addEventListener('click', () => {
  promoPrincipal.classList.add('show');
  principal.classList.add('hide');
  localStorage.setItem('promocion', 'principal');
  localStorage.setItem('arrayPromoPrincipal', []);
  resetPromoPrincipal();
  arrayBigPizza = [];
  localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
  // Inicializacion de promo Favoritas
  initFavoritePizzas();
});

btnPizzaBig.addEventListener('click', () => {
  viewPizzaBig.classList.add('show');
  principal.classList.add('hide');
  arrayBigPizza = [];
  arrayFinaly = [];
  localStorage.setItem('promocion', 'carta');
  localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
  localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
  resetButtons();
});

btnPizzaFamily.addEventListener('click', () => {
  viewPizzaFamily.classList.add('show');
  principal.classList.add('hide');
  arrayBigPizza = [];
  arrayFinaly = [];
  localStorage.setItem('promocion', 'carta');
  localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
  localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
  resetButtons();
});

// regresar a la ventana principal
back.addEventListener('click', () => {
  section1.classList.add('hide');
  principal.classList.add('show');
  containerDetail.empty();
  arrayFinaly = [];
  showTotal.innerText = 0;
  totalPromo2da.innerText = 0;
  desactiveButton(btnConfirmOrder);
});

backPrincipal.addEventListener('click', () => {
  promoPrincipal.classList.add('hide');
  principal.classList.add('show');
  desactiveButton(btnConfirmOrder);
});

back1.addEventListener('click', () => {
  principal.classList.add('show');
  viewPizzaBig.classList.add('hide');
});

back2.addEventListener('click', () => {
  principal.classList.add('show');
  viewPizzaFamily.classList.add('hide');
});


// Eventos + / -

document.addEventListener('click', (event) => {
  const arrayELements = event.path;
  for (let i = 0; i < arrayELements.length; i += 1) {
    if (arrayELements[i].localName === 'button') {
      const namePizza = arrayELements[i].dataset.name;
      const detailPizza = arrayELements[i].dataset.detail;
      const price = arrayELements[i].dataset.precio;
      const typePizza = arrayELements[i].dataset.type;
      if (arrayELements[i].classList[0] === 'increment') {
        const idNumber = arrayELements[i].parentElement.previousElementSibling.id;
        incrementTotal(price, idNumber, namePizza, typePizza, detailPizza);
        const number = arrayELements[i].parentElement.previousElementSibling;
        const btnDecrement = number.previousElementSibling.children[0].id;
        if (document.querySelector(`#${idNumber}`).value > 0) {
          document.querySelector(`#${idNumber}`).style.color = '#009774';
          $(`#${btnDecrement}`).addClass('btn-active');
          $(this).addClass('btn-active');
        }
      }
      if (arrayELements[i].classList[0] === 'decrement') {
        const idNumber = arrayELements[i].parentElement.nextElementSibling.id;
        decrementTotal(price, idNumber, namePizza);
        const number = arrayELements[i].parentElement.nextElementSibling;
        const btnDecrement = number.nextElementSibling.children[0].id;
        // if ($(`#${idNumber}`).text() == 0) {
        //   $(`#${idNumber}`).css('color', '#009774');
        //   $(`#${btnDecrement}`).removeClass('btn-active');
        //   $(this).removeClass('btn-active');
        // }
      }
    }
  }
});

// document.addEventListener('click', '.increment', () => {
//   const price = $(this).data('precio');
//   const namePizza = $(this).data('name');
//   const type = $(this).data('type');
//   const detail = $(this).data('detail');
//   const idNumber = $(this)[0].parentElement.previousElementSibling.id;
//   incrementTotal(price, idNumber, namePizza, type, detail);
//   const number = $(this)[0].parentElement.previousElementSibling;
//   const btnDecrement = number.previousElementSibling.children[0].id;
//   if ($(`#${idNumber}`).text() > 0) {
//     $(`#${idNumber}`).css('color', '#009774');
//     $(`#${btnDecrement}`).addClass('btn-active');
//     $(this).addClass('btn-active');
//   }
// });

// $(document).on('click', '.decrement', () => {
//   const price = $(this).data('precio');
//   const namePizza = $(this).data('name');
//   const type = $(this).data('type');
//   const detail = $(this).data('detail');
//   const idNumber = $(this)[0].parentElement.nextElementSibling.id;
//   decrementTotal(price, idNumber, namePizza, type, detail);
//   const number = $(this)[0].parentElement.nextElementSibling;
//   const btnDecrement = number.nextElementSibling.children[0].id;
//   if ($(`#${idNumber}`).text() == 0) {
//     $(`#${idNumber}`).css('color', '#009774');
//     $(`#${btnDecrement}`).removeClass('btn-active');
//     $(this).removeClass('btn-active');
//   }
// });

// confirmar pizzas grandes
confirmBig.on('click', () => {
  viewPizzaBig.hide();
  principal.show();
  containerDetail.empty();
  let prueba = 0;
  const promo = localStorage.getItem('promocion');
  const countPizzaBig = JSON.parse(localStorage.arrayBigPizza);
  const newDetail = [];
  let totalPrice = 0;
  countPizzaBig.forEach((element) => {
    const item = `${element.detalle} ${element.tamaño}  S/${element.precio}`;
    newDetail.push(item);
    localStorage.setItem('item', JSON.stringify(newDetail));
    const sum = parseFloat(element.precio);
    totalPrice += sum;
    localStorage.setItem('totalPrevio', totalPrice);
  });
  const totalItem = JSON.parse(localStorage.item);
  const totalBig = localStorage.getItem('totalPrevio');
  arrayPromociones.push({
    promocion: promo,
    detalle: totalItem,
    total: totalBig,
  });
  localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));
  const totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
  totalPedidoPromo.forEach((element, index) => {
    templatePromoDetail(element, index);
    const tot = parseFloat(element.total);
    prueba += tot;
    localStorage.setItem('totalFinal', prueba);
  });
  showTotal.text(totalOrderDelivery());
  const totalPedidoPromoFinal = JSON.parse(localStorage.arrayPromociones);
  arraySend = [];
  let namePromo;
  totalPedidoPromoFinal.forEach((element) => {
    if (element.promocion === 'principal') {
      namePromo = 'Promoción La Favorita + tu favorita';
      const e = ` ${namePromo} : ${element.detalle.pizza1} , ${element.detalle.pizza2}  a S/ ${element.total}`;
      arraySend.push(e);
    }
    if (element.promocion === 'segunda1sol') {
      namePromo = 'Promoción La 2da a 1 sol';
      const e = ` ${namePromo} : ${element.detalle.pizza1} , ${element.detalle.pizza2}  a S/ ${element.total}`;
      arraySend.push(e);
    }
    if (element.promocion === 'carta') {
      namePromo = 'Carta';
      const e = ` ${namePromo} : ${element.detalle}`;
      arraySend.push(e);
    }

    localStorage.setItem('arraySend', JSON.stringify(arraySend));
  });
  const sendInfoDetailPromo = JSON.parse(localStorage.arraySend);
  // Guardar el input de envio por POST
  document.querySelector('#resumen-pedido-promo2da').value = `${sendInfoDetailPromo.join('\n')}`;
  document.querySelector('#resumentotal').value = totalOrderDelivery();
  const countFinally = JSON.parse(localStorage.arrayPromociones);
  if (countFinally.length > 0) {
    activeButton(btnConfirmOrder);
  }
  if (countFinally.length === 0) {
    desactiveButton(btnConfirmOrder);
  }
  countPromo();
});


// confirmar pizzas family
confirmFamily.on('click', () => {
  viewPizzaFamily.hide();
  principal.show();
  containerDetail.empty();
  let prueba = 0;
  const promo = localStorage.getItem('promocion');
  const countPizzaBig = JSON.parse(localStorage.arrayBigPizza);
  const newDetail = [];
  let totalPrice = 0;
  countPizzaBig.forEach((element) => {
    const item = `${element.detalle} ${element.tamaño}  S/${element.precio}`;
    newDetail.push(item);
    localStorage.setItem('item', JSON.stringify(newDetail));
    const sum = parseFloat(element.precio);
    totalPrice += sum;
    localStorage.setItem('totalPrevio', totalPrice);
  });
  const totalItem = JSON.parse(localStorage.item);
  const totalBig = localStorage.getItem('totalPrevio');
  arrayPromociones.push({
    promocion: promo,
    detalle: totalItem,
    total: totalBig,
  });
  localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));
  const totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
  totalPedidoPromo.forEach((element, index) => {
    templatePromoDetail(element, index);
    const tot = parseFloat(element.total);
    prueba += tot;
    localStorage.setItem('totalFinal', prueba);
  });
  showTotal.text(totalOrderDelivery());
  const totalPedidoPromoFinal = JSON.parse(localStorage.arrayPromociones);
  arraySend = [];
  let namePromo;
  totalPedidoPromoFinal.forEach((element) => {
    if (element.promocion === 'principal') {
      namePromo = 'Promoción La Favorita + tu favorita';
      const e = ` ${namePromo} : ${element.detalle.pizza1} , ${element.detalle.pizza2}  a S/ ${element.total}`;
      arraySend.push(e);
    }
    if (element.promocion === 'segunda1sol') {
      namePromo = 'Promoción La 2da a 1 sol';
      const e = ` ${namePromo} : ${element.detalle.pizza1} , ${element.detalle.pizza2}  a S/ ${element.total}`;
      arraySend.push(e);
    }
    if (element.promocion === 'carta') {
      namePromo = 'Carta';
      const e = ` ${namePromo} : ${element.detalle}`;
      arraySend.push(e);
    }

    localStorage.setItem('arraySend', JSON.stringify(arraySend));
  });
  const sendInfoDetailPromo = JSON.parse(localStorage.arraySend);
  // Guardar el input de envio por POST
  document.querySelector('#resumen-pedido-promo2da').value = `${sendInfoDetailPromo.join('\n')}`;
  document.querySelector('#resumentotal').value = totalOrderDelivery();
  const countFinally = JSON.parse(localStorage.arrayPromociones);
  if (countFinally.length > 0) {
    activeButton(btnConfirmOrder);
  }
  if (countFinally.length === 0) {
    desactiveButton(btnConfirmOrder);
  }
  countPromo();
});


// confirmar 2da 1 sol
confirm2da.on('click', () => {
  let prueba = 0;
  section1.hide();
  principal.show();
  containerDetail.empty();
  const arrayPromoSelect = JSON.parse(localStorage.arrayFinaly);
  const pizza1 = arrayPromoSelect[0];
  const pizza2 = arrayPromoSelect[1];

  if (pizza1.precio > pizza2.precio) {
    pizza2.precio = 1;
  }
  if (pizza1.precio < pizza2.precio) {
    pizza1.precio = 1;
  }
  if (pizza1.precio === pizza2.precio) {
    pizza1.precio = 1;
  }
  const promo = localStorage.getItem('promocion');
  arrayPromociones.push({
    promocion: promo,
    detalle: {
      pizza1: `${pizza1.detalle} ${pizza1.tamaño}  S/${pizza1.precio}`,
      pizza2: `${pizza2.detalle} ${pizza2.tamaño}  S/${pizza2.precio}`,
    },
    total: pizza1.precio + pizza2.precio,
  });

  localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));
  const totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
  totalPromo2da.text(totalPedidoPromo.length);
  totalPedidoPromo.forEach((element, index) => {
    templatePromoDetail(element, index);
    const tot = parseFloat(element.total);
    prueba += tot;
    localStorage.setItem('totalFinal', prueba);
  });

  showTotal.text(totalOrderDelivery());
  const totalPedidoPromoFinal = JSON.parse(localStorage.arrayPromociones);
  arraySend = [];
  let namePromo;
  totalPedidoPromoFinal.forEach((element) => {
    if (element.promocion === 'principal') {
      namePromo = ' Promoción La Favorita + tu favorita';
      const e = ` ${namePromo} : ${element.detalle.pizza1} , ${element.detalle.pizza2}  a S/ ${element.total}`;
      arraySend.push(e);
    }
    if (element.promocion === 'segunda1sol') {
      namePromo = 'Promoción La 2da a 1 sol';
      const e = ` ${namePromo} : ${element.detalle.pizza1} , ${element.detalle.pizza2}  a S/ ${element.total}`;
      arraySend.push(e);
    }
    if (element.promocion === 'carta') {
      namePromo = 'Carta';
      const e = ` ${namePromo} : ${element.detalle}`;
      arraySend.push(e);
    }

    localStorage.setItem('arraySend', JSON.stringify(arraySend));
  });
  const sendInfoDetailPromo = JSON.parse(localStorage.arraySend);
  // Guardar el input de envio por POST
  document.querySelector('#resumen-pedido-promo2da').value = `${sendInfoDetailPromo.join('\n')}`;
  document.querySelector('#resumentotal').value = totalOrderDelivery();
  const countFinally = JSON.parse(localStorage.arrayPromociones);
  if (countFinally.length > 0) {
    activeButton(btnConfirmOrder);
  }
  if (countFinally.length === 0) {
    desactiveButton(btnConfirmOrder);
  }
  countPromo();
});

// Confirmar Promo Principal
confirmPrincipal.on('click', () => {
  promoPrincipal.hide();
  principal.show();
  containerDetail.empty();
  let prueba = 0;

  const arrayPromoSelect = JSON.parse(localStorage.arrayPromoPrincipal);
  const precioPromoSelect = localStorage.totalPromoPrincipal;
  const convertPrice = parseFloat(precioPromoSelect);

  // showTotal.text(final.toFixed(1));
  if (arrayPromoSelect.length === 1) {
    const pizza1 = arrayPromoSelect[0];
    const promo = localStorage.getItem('promocion');
    arrayPromociones.push({
      promocion: promo,
      detalle: {
        pizza1: `${pizza1.detalle} ${pizza1.tamaño}`,
        pizza2: '',
      },
      total: convertPrice,
    });
    localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));
    const totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
    totalPedidoPromo.forEach((element, index) => {
      templatePromoDetail(element, index);
      const tot = parseFloat(element.total);
      prueba += tot;
      localStorage.setItem('totalFinal', prueba);
    });
  }
  if (arrayPromoSelect.length === 2) {
    const pizza1 = arrayPromoSelect[0];
    const pizza2 = arrayPromoSelect[1];
    const promo = localStorage.getItem('promocion');
    arrayPromociones.push({
      promocion: promo,
      detalle: {
        pizza1: `${pizza1.detalle} ${pizza1.tamaño}`,
        pizza2: `${pizza2.detalle} ${pizza2.tamaño}`,
      },
      total: convertPrice,
    });
    localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));
    const totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
    totalPedidoPromo.forEach((element, index) => {
      templatePromoDetail(element, index);
      const tot = parseFloat(element.total);
      prueba += tot;
      localStorage.setItem('totalFinal', prueba.toFixed(1));
      // containerDetail.append(templateView);
    });
  }
  showTotal.text(totalOrderDelivery());
  const totalPedidoPromoFinal = JSON.parse(localStorage.arrayPromociones);
  arraySend = [];
  let namePromo;
  totalPedidoPromoFinal.forEach((element) => {
    if (element.promocion === 'principal') {
      namePromo = 'Promoción La Favorita + tu favorita';
      const e = ` ${namePromo} : ${element.detalle.pizza1} , ${element.detalle.pizza2}  a S/ ${element.total}`;
      arraySend.push(e);
    }
    if (element.promocion === 'segunda1sol') {
      namePromo = 'Promoción La 2da a 1 sol';
      const e = ` ${namePromo} : ${element.detalle.pizza1} , ${element.detalle.pizza2}  a S/ ${element.total}`;
      arraySend.push(e);
    }
    if (element.promocion === 'carta') {
      namePromo = 'Carta';
      const e = ` ${namePromo} : ${element.detalle}`;
      arraySend.push(e);
    }

    localStorage.setItem('arraySend', JSON.stringify(arraySend));
  });
  const sendInfoDetailPromo = JSON.parse(localStorage.arraySend);
  // Guardar el input de envio por POST
  document.querySelector('#resumen-pedido-promo2da').value = `${sendInfoDetailPromo.join('\n')}`;
  document.querySelector('#resumentotal').value = totalOrderDelivery();

  const countFinally = JSON.parse(localStorage.arrayPromociones);
  if (countFinally.length > 0) {
    activeButton(btnConfirmOrder);
  }
  if (countFinally.length === 0) {
    desactiveButton(btnConfirmOrder);
  }
  countPromo();
});
// Valor de radio button Pizza Grande y Familiar

document.querySelector('#radiotipo input').addEventListener('change', () => {
  const typeHome = document.querySelector('input[name=tipo]:checked', '#radiotipo').value;
  if (typeHome === 'Grande') {
    arrayBigPizza = [];
    arrayFinaly = [];
    localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
    localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
    // localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));

    containerBig.show();
    containerFamily.hide();
    desactiveButton(confirm2da);
  }
  if (typeHome === 'Familiar') {
    arrayBigPizza = [];
    arrayFinaly = [];
    localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
    localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
    // localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));

    containerBig.hide();
    containerFamily.show();
    desactiveButton(confirm2da);
  }
});


// Promoción principal
// Seleccionando cantidad
document.querySelector('#radiotipo2 input').addEventListener('change', () => {
  const countPromoPrincipal = document.querySelector('input[name=tipo]:checked', '#radiotipo2').value;
  if (countPromoPrincipal === 1) {
    countPizzaTotal = 1;
  }
  if (countPromoPrincipal === 2) {
    countPizzaTotal = 2;
  }
  const valueCount = localStorage.arrayPromoPrincipal;
  if (valueCount) {
    if (countPromoPrincipal === 1) {
      countPizzaTotal = 1;
      const countPromoFinal = JSON.parse(localStorage.arrayPromoPrincipal);
      if (countPromoFinal.length !== 1) {
        desactiveButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = ' * Debes elegir solo 1 pizza';
      } else {
        activeButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = '';
      }
    }

    if (countPromoPrincipal === 2) {
      countPizzaTotal = 2;
      const countPromoFinal = JSON.parse(localStorage.arrayPromoPrincipal);
      if (countPromoFinal.length !== 2) {
        desactiveButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = '* Debes elegir solo 2 pizzas';
      } else {
        activeButton(confirmPrincipal);
        document.querySelector('.text-alert-principal').innerText = '';
      }
    }
  } else {
    desactiveButton(confirmPrincipal);
  }

  const totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
  localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));
});
// Seleccionando Tamaño
document.querySelector('#radiotipo3 input').addEventListener('change', () => {
  sizePizza = document.querySelector('input[name=tipo]:checked', '#radiotipo3').value;
  if (sizePizza === 'Grande') {
    sizePizza = 'Grande';
  }
  if (sizePizza === 'Familiar') {
    sizePizza = 'Familiar';
  }
  const totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
  localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));
});


// cantidad de Pizzas Favorita


document.querySelector('#radiotipo5 input').addEventListener('change', () => {
  const count = document.querySelector('input[name=tipo]:checked', '#radiotipo5').value;
  showSectionPizzasFavorites(count);
  if (count === 1) {
    countPizzaTotal = 1;
    oneFavorite(sizePizza);
  }
  if (count === 2) {
    countPizzaTotal = 2;
    if (favoritePizza) {
      twoFavoritesPizzas(sizePizza, favoritePizza);
    }
    desactiveButton(confirmPrincipal);
  }
  const totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
  localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));
});

document.querySelector('#radiotipo6 input').addEventListener('change', () => {
  sizePizza = document.querySelector('input[name=tipo]:checked', '#radiotipo6').value;
  if (sizePizza === 'Grande') {
    sizePizza = 'Grande';
  }
  if (sizePizza === 'Familiar') {
    sizePizza = 'Familiar';
  }

  if (countPizzaTotal === 1) {
    oneFavorite(sizePizza);
    const totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
    localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));
  }
  if (countPizzaTotal === 2) {
    twoFavoritesPizzas(sizePizza, favoritePizza);
    const totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
    localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));
  }
});


// Radio Button select Pizza Promo Principal - Favoritas
document.querySelector('#radiotipo4 input').addEventListener('change', () => {
  const namePizza = document.querySelector('input[name=tipo]:checked', '#radiotipo4').value;
  favoritePizza = namePizza;
  twoFavoritesPizzas(sizePizza, favoritePizza);
  const idElementBorder = $(this)[0].nextElementSibling.firstElementChild.id;
  activeBorderRadioButtonPizza(idElementBorder);
  document.querySelector('html,body').animate({
    scrollTop: document.body.scrollHeight,
  }, 1500);
  if (sizePizza) {
    activeButton(confirmPrincipal);
  } else {
    desactiveButton(confirmPrincipal);
  }
});

function moverseA() {
  location.hash = '#btn-confirm-favorita';
}

// // Borrando items del detalle de pedido
// $(document).on('click', '.btn-delete', function () {
//   containerDetail.empty();
//   const id = $(this)[0].id;
//   const arrayLocalPromociones = arrayPromociones;
//   const arrayFinal = JSON.parse(localStorage.arrayPromociones);
//   const arraySendDelete = JSON.parse(localStorage.arraySend);

//   deleteArrayIndex(arrayFinal, id);
//   deleteArrayIndex(arraySendDelete, id);
//   deleteArrayIndex(arrayLocalPromociones, id);

//   localStorage.setItem('arrayPromociones', JSON.stringify(arrayFinal));
//   localStorage.setItem('arraySend', JSON.stringify(arraySendDelete));

//   const totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
//   const totalSend = JSON.parse(localStorage.arraySend);

//   $('#resumen-pedido-promo2da').val(`${totalSend.join('\n')}`);
//   let prueba = 0;
//   totalPedidoPromo.forEach((element, index) => {
//     templatePromoDetail(element, index);
//     const tot = parseFloat(element.total);
//     prueba += tot;
//     localStorage.setItem('totalFinal', prueba);
//   });
//   countPromo();

//   if (totalPedidoPromo.length == 0) {
//     showTotal.text(0);
//     desactiveButton(btnConfirmOrder);
//   } else {
//     showTotal.text(totalOrderDelivery());
//   }
// });


// Función que resetea los valores enviados


inactivePromo();
// Desactivar boton confirmar al iniciar
desactiveButton(confirm2da);
desactiveButton(confirmPrincipal);
