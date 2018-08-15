// DOM
const section1 = $('.big-pizza-section');
const btnSegunda = $('#btn-segunda');
const btnPromoPrincipal = $('#btn-patriotas');
const principal = $('.containerPrincipal');
const containerBig = $('.container-bigpizza');
const containerFamily = $('.container-familypizza');
const promoPrincipal = $('.promo-principal-section');
const back = $('.back');
const btnConfirmOrder = $('#config');
const backPrincipal = $('.back-principal');
const containerDetail = $('.detail-view');
const confirm2da = $('.btn-confirm-promo2');
const confirmPrincipal = $('.btn-confirm-promo-principal');
const totalPromo2da = $('#total-count-family');
let showTotal = $('#total');
let totalPromoPrincipal;
let totalFinal = 0;
let prueba = 0;
let delivery = 3.90;
let countPizzaTotal = 1;
let sizePizza = "Grande";
let favoritePizza;
let arrayPromociones = [];
let arrayBigPizza = [];
let arrayFamilyPizza = [];
let arrayAdicional = [];
let arrayBebidas = [];
let arrayFinaly = [];
let arrayPromoPrincipal = [];
let arraySend = [];

localStorage.setItem('totalFinal', totalFinal);
// ocultando las secciones
section1.hide();
promoPrincipal.hide();


// Desactivar boton confirmar al iniciar
desactiveButton(confirm2da);
desactiveButton(confirmPrincipal);

// Promocion segunda a 1 sol
btnSegunda.on('click', function () {
  section1.show();
  principal.hide();
  containerBig.show();
  containerFamily.hide();
  localStorage.setItem('promocion', 'segunda1sol');
  arrayBigPizza = [];
  arrayFinaly = [];
  localStorage.setItem('arrayBigPizza', arrayBigPizza);
  localStorage.setItem('arrayFinaly', arrayFinaly);

});

btnPromoPrincipal.on('click', function () {
  promoPrincipal.show();
  principal.hide();
  localStorage.setItem('promocion', 'principal');
  localStorage.setItem('arrayPromoPrincipal', []);
  resetPromoPrincipal();
  // Inicializacion de promo Favoritas
  initFavoritePizzas();
})

// regresar a la ventana principal
back.on('click', function () {
  section1.hide();
  principal.show();
  containerDetail.empty();
  arrayFinaly = [];
  showTotal.text(0);
  totalPromo2da.text(0);
  desactiveButton(btnConfirmOrder);
});

backPrincipal.on('click', function () {
  promoPrincipal.hide();
  principal.show();
  desactiveButton(btnConfirmOrder);
});

//Eventos + / -
$(document).on('click', '.increment', function () {
  let price = $(this).data('precio');
  let namePizza = $(this).data('name');
  let type = $(this).data('type');
  let detail = $(this).data('detail');
  let idNumber = $(this)[0].parentElement.previousElementSibling.id;
  incrementTotal(price, idNumber, namePizza, type, detail);
  let number = $(this)[0].parentElement.previousElementSibling;
  let btnDecrement = $(this)[0].parentElement.previousElementSibling.previousElementSibling.children[0].id;
  if ($(`#${idNumber}`).text() > 0) {
    $(`#${idNumber}`).css('color', '#009774');
    $(`#${btnDecrement}`).addClass('btn-active');
    $(this).addClass('btn-active');
  }

});

$(document).on('click', '.decrement', function () {
  let price = $(this).data('precio');
  let namePizza = $(this).data('name');
  let type = $(this).data('type');
  let detail = $(this).data('detail');
  let idNumber = $(this)[0].parentElement.nextElementSibling.id;
  decrementTotal(price, idNumber, namePizza, type, detail);
  let number = $(this)[0].parentElement.nextElementSibling;
  let btnDecrement = $(this)[0].parentElement.nextElementSibling.nextElementSibling.children[0].id;
  if ($(`#${idNumber}`).text() == 0) {
    $(`#${idNumber}`).css('color', '#009774');
    $(`#${btnDecrement}`).removeClass('btn-active');
    $(this).removeClass('btn-active');
  }
});

let decrementTotal = (price, idNumberBox, name, type, detail) => {
  let promo = localStorage.getItem('promocion');
  if (promo == "segunda1sol") {
    let totalPedido = localStorage.getItem('totalFinal');
    let number = $(`#${idNumberBox}`).text();
    number = parseInt(number) - 1;
    if (number >= 0) {
      $(`#${idNumberBox}`).text(number); // mostrando valores 
      // Encontrar el valor y eliminarlo
      let countPedido = JSON.parse(localStorage.arrayFinaly);
      // encontrar el valor y borrarlo 
      let arrayBigPizzaDelete = arrayBigPizza.filter(element => element.detalle !== name);
      let arrayFinalyDelete = arrayFinaly.filter(element => element.detalle !== name);
      localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizzaDelete));
      localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinalyDelete));

      countPedido = JSON.parse(localStorage.arrayFinaly);
      if (countPedido.length < 2 || countPedido.length > 2) {
        desactiveButton(confirm2da);
        $('.text-alert').text(' * Debes elegir solo 2 pizzas');
      } else {
        activeButton(confirm2da);
        $('.text-alert').text('');
      }
    }
  }
  if (promo == "principal") {
    let numberPrincipal = $(`#${idNumberBox}`).text();
    numberPrincipal = parseInt(numberPrincipal) - 1;

    if (numberPrincipal >= 0) {
      $(`#${idNumberBox}`).text(numberPrincipal); // mostrando valores   
      // Encontrar el valor y eliminarlo
      let countPedidoPromo = JSON.parse(localStorage.arrayPromoPrincipal);
      let arrayPrincipalDelete = arrayPromoPrincipal.filter(element => element.detalle !== name);
      localStorage.setItem('arrayPromoPrincipal', JSON.stringify(arrayPrincipalDelete));
    }

    countPromoFinal = JSON.parse(localStorage.arrayPromoPrincipal);
    if (countPizzaTotal == 2) {
      if (countPromoFinal.length > 2 || countPromoFinal.length < 2) {
        desactiveButton(confirmPrincipal);
        $('.text-alert-principal').text(' * Debes elegir solo 2 pizzas');
      } else {
        activeButton(confirmPrincipal);
        $('.text-alert-principal').text('');
      }

    }
    if (countPizzaTotal == 1) {
      if (countPromoFinal.length > 1 || countPromoFinal.length < 1) {
        desactiveButton(confirmPrincipal);
        $('.text-alert-principal').text(' * Debes elegir solo 1 pizza');
      } else {
        activeButton(confirmPrincipal)
        $('.text-alert-principal').text('');
      }
    }
  }
};

confirm2da.on('click', function () {
  prueba = 0;
  section1.hide();
  principal.show();
  containerDetail.empty();
  let arrayPromoSelect = JSON.parse(localStorage.arrayFinaly);
  let pizza1 = arrayPromoSelect[0];
  let pizza2 = arrayPromoSelect[1];

  if (pizza1.precio > pizza2.precio) {
    pizza2.precio = 1;
  }
  if (pizza1.precio < pizza2.precio) {
    pizza1.precio = 1;
  }
  if (pizza1.precio == pizza2.precio) {
    pizza1.precio = 1;

  }
  let promo = localStorage.getItem('promocion');
  arrayPromociones.push({
    promocion: promo,
    detalle: {
      pizza1: `${pizza1.detalle} ${pizza1.tamaño}  S/${pizza1.precio}`,
      pizza2: `${pizza2.detalle} ${pizza2.tamaño}  S/${pizza2.precio}`
    },
    total: pizza1.precio + pizza2.precio
  });

  localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));
  let totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
  totalPromo2da.text(totalPedidoPromo.length);
  totalPedidoPromo.forEach((element, index) => {
    templatePromoDetail(element, index);
    let tot = parseFloat(element.total);
    prueba += tot;
    localStorage.setItem('totalFinal', prueba);
  });

  showTotal.text(totalOrderDelivery());
  let totalPedidoPromoFinal = JSON.parse(localStorage.arrayPromociones);
  arraySend = [];
  let namePromo;
  totalPedidoPromoFinal.forEach(element => {
    if (element.promocion == "principal") {
      namePromo = "La Favorita + tu favorita"
    }
    if (element.promocion == "segunda1sol") {
      namePromo = "La 2da a 1 sol"
    }
    let e = `Promoción ${ namePromo  } : ${element.detalle.pizza1} , ${element.detalle.pizza2}  a S/ ${element.total}`;
    arraySend.push(e);
    localStorage.setItem('arraySend', JSON.stringify(arraySend));
  });
  let sendInfoDetailPromo = JSON.parse(localStorage.arraySend);
  // Guardar el input de envio por POST
  $('#resumen-pedido-promo2da').val(`${sendInfoDetailPromo.join("\n")  }`);
  $('#resumentotal').val(totalOrderDelivery());
  let countFinally = JSON.parse(localStorage.arrayPromociones);
  if (countFinally.length > 0) {
    activeButton(btnConfirmOrder);
  }
  if (countFinally.length == 0) {
    desactiveButton(btnConfirmOrder);
  }
  countPromo();
});

// Confirmar Promo Principal
confirmPrincipal.on('click', function () {
  promoPrincipal.hide();
  principal.show();
  containerDetail.empty();
  prueba = 0;
  let arrayPromoSelect = JSON.parse(localStorage.arrayPromoPrincipal);
  let precioPromoSelect = localStorage.totalPromoPrincipal;
  let convertPrice = parseFloat(precioPromoSelect);
  // showTotal.text(final.toFixed(1));
  if (arrayPromoSelect.length == 1) {
    let pizza1 = arrayPromoSelect[0];
    let promo = localStorage.getItem('promocion');
    arrayPromociones.push({
      promocion: promo,
      detalle: {
        pizza1: pizza1.detalle + ' ' + pizza1.tamaño,
        pizza2: ''
      },
      total: convertPrice
    });
    localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));
    let totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
    let totalArrayFinal = totalPedidoPromo.total;
    totalPedidoPromo.forEach((element, index) => {
      templatePromoDetail(element, index);
      let tot = parseFloat(element.total);
      prueba += tot;
      localStorage.setItem('totalFinal', prueba);
    });
  }
  if (arrayPromoSelect.length == 2) {
    let pizza1 = arrayPromoSelect[0];
    let pizza2 = arrayPromoSelect[1];
    let promo = localStorage.getItem('promocion');
    arrayPromociones.push({
      promocion: promo,
      detalle: {
        pizza1: pizza1.detalle + ' ' + pizza1.tamaño,
        pizza2: pizza2.detalle + ' ' + pizza2.tamaño
      },
      total: convertPrice
    });
    localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));
    let totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
    totalPedidoPromo.forEach((element, index) => {
      templatePromoDetail(element, index);
      let tot = parseFloat(element.total);
      prueba += tot;
      localStorage.setItem('totalFinal', prueba.toFixed(1));
      // containerDetail.append(templateView);
    });
  }
  showTotal.text(totalOrderDelivery());
  let totalPedidoPromoFinal = JSON.parse(localStorage.arrayPromociones);
  arraySend = [];
  let namePromo;
  totalPedidoPromoFinal.forEach(element => {
    if (element.promocion == "principal") {
      namePromo = "La favorita + tu favorita"
    }
    if (element.promocion == "segunda1sol") {
      namePromo = "La 2da a 1 sol"
    }
    let e = `Promoción ${ namePromo } : ${element.detalle.pizza1} , ${element.detalle.pizza2}  a S/ ${element.total}`;
    arraySend.push(e);
    localStorage.setItem('arraySend', JSON.stringify(arraySend));
  });
  let sendInfoDetailPromo = JSON.parse(localStorage.arraySend);
  // Guardar el input de envio por POST
  $('#resumen-pedido-promo2da').val(`${ sendInfoDetailPromo.join("\n")  }`);
  $('#resumentotal').val(totalOrderDelivery());

  let countFinally = JSON.parse(localStorage.arrayPromociones);
  if (countFinally.length > 0) {
    activeButton(btnConfirmOrder);
  }
  if (countFinally.length == 0) {
    desactiveButton(btnConfirmOrder);
  }
  countPromo();
});
// Valor de radio button Pizza Grande y Familiar

$('#radiotipo input').on('change', function () {
  typeHome = $('input[name=tipo]:checked', '#radiotipo').val();
  if (typeHome == 'Grande') {
    arrayBigPizza = [];
    arrayFinaly = [];
    localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
    localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
    // localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));
  
    containerBig.show();
    containerFamily.hide();
    desactiveButton(confirm2da);
  }
  if (typeHome == 'Familiar') {
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
$('#radiotipo2 input').on('change', function () {
  countPromoPrincipal = $('input[name=tipo]:checked', '#radiotipo2').val();
  if (countPromoPrincipal == 1) {
    countPizzaTotal = 1
  }
  if (countPromoPrincipal == 2) {
    countPizzaTotal = 2
  }
  let valueCount = localStorage.arrayPromoPrincipal;
  if (valueCount) {
    if (countPromoPrincipal == 1) {
      countPizzaTotal = 1;
      countPromoFinal = JSON.parse(localStorage.arrayPromoPrincipal);
      if (countPromoFinal.length != 1) {
        desactiveButton(confirmPrincipal);
        $('.text-alert-principal').text(' * Debes elegir solo 1 pizza');
      } else {
        activeButton(confirmPrincipal);
        $('.text-alert-principal').text('');
      }
    }

    if (countPromoPrincipal == 2) {
      countPizzaTotal = 2;
      countPromoFinal = JSON.parse(localStorage.arrayPromoPrincipal);
      if (countPromoFinal.length !== 2) {
        desactiveButton(confirmPrincipal);
        $('.text-alert-principal').text(' * Debes elegir solo 2 pizzas');
      } else {
        activeButton(confirmPrincipal);
        $('.text-alert-principal').text('');
      }

    }
  } else {
    desactiveButton(confirmPrincipal);
  }

  let totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
  localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));

});
// Seleccionando Tamaño
$('#radiotipo3 input').on('change', function () {
  sizePizza = $('input[name=tipo]:checked', '#radiotipo3').val();
  if (sizePizza == "Grande") {
    sizePizza = "Grande"
  }
  if (sizePizza == "Familiar") {
    sizePizza = "Familiar"
  }
  let totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
  localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));
});


// cantidad de Pizzas Favorita


$('#radiotipo5 input').on('change', function () {
  let count = $('input[name=tipo]:checked', '#radiotipo5').val();
  showSectionPizzasFavorites(count);
  if (count == 1) {
    countPizzaTotal = 1;
    oneFavorite(sizePizza);
  }
  if (count == 2) {
    countPizzaTotal = 2;
    if (favoritePizza) {
      twoFavoritesPizzas(sizePizza, favoritePizza);
    }
    desactiveButton(confirmPrincipal);


  }
  let totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
  localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));
});

$('#radiotipo6 input').on('change', function () {
  sizePizza = $('input[name=tipo]:checked', '#radiotipo6').val();
  if (sizePizza == "Grande") {
    sizePizza = "Grande"
  }
  if (sizePizza == "Familiar") {
    sizePizza = "Familiar"
  }

  if (countPizzaTotal == 1) {
    oneFavorite(sizePizza);
    let totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
    localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));
  }
  if (countPizzaTotal == 2) {
    twoFavoritesPizzas(sizePizza, favoritePizza);
    let totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
    localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));

  }

});


// Radio Button select Pizza Promo Principal - Favoritas
$('#radiotipo4 input').on('change', function () {

  let namePizza = $('input[name=tipo]:checked', '#radiotipo4').val();
  favoritePizza = namePizza;
  twoFavoritesPizzas(sizePizza, favoritePizza)
  let idElementBorder = $(this)[0].nextElementSibling.firstElementChild.id;
  activeBorderRadioButtonPizza(idElementBorder);
  $('html,body').animate({scrollTop: document.body.scrollHeight},1500);
  if (sizePizza) {
    activeButton(confirmPrincipal);
  } else {
    desactiveButton(confirmPrincipal);
  }
});

function moverseA() {
  location.hash = "#btn-confirm-favorita" ;
}

// Borrando items del detalle de pedido
$(document).on('click', '.btn-delete', function () {
  containerDetail.empty();
  let id = $(this)[0].id;
  let arrayLocalPromociones = arrayPromociones;
  let arrayFinal = JSON.parse(localStorage.arrayPromociones);
  let arraySendDelete = JSON.parse(localStorage.arraySend);

  deleteArrayIndex(arrayFinal, id);
  deleteArrayIndex(arraySendDelete, id);
  deleteArrayIndex(arrayLocalPromociones, id);

  localStorage.setItem('arrayPromociones', JSON.stringify(arrayFinal));
  localStorage.setItem('arraySend', JSON.stringify(arraySendDelete));

  let totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
  let totalSend = JSON.parse(localStorage.arraySend);

  $('#resumen-pedido-promo2da').val(`${ totalSend.join("\n")  }`);
  let prueba = 0;
  totalPedidoPromo.forEach((element, index) => {
    templatePromoDetail(element, index);
    let tot = parseFloat(element.total);
    prueba += tot;
    localStorage.setItem('totalFinal', prueba);

  });
  countPromo();

  if (totalPedidoPromo.length == 0) {
    showTotal.text(0);
    desactiveButton(btnConfirmOrder)
  } else {

    showTotal.text(totalOrderDelivery());
  }
});

function templatePromoDetail(element, index) {
  let namePromo;
  if (element.promocion == "principal") {
    namePromo = "La favorita"
  }
  if (element.promocion == "segunda1sol") {
    namePromo = "La Segunda a 1 sol "
  }
  if (!element.detalle.pizza2) {
    let templateView = `<div>
    <div class="row">
    <div class="col-9"> <p class="mb-0 title-promo">Promoción ${namePromo} = S/ ${element.total} </p></div>
    <div class="col-3 text-right"><button class="btn-delete" id=${index} data-id=${index}><i class="fas fa-times"></i></button></div>
    </div>
     
    <p class="mb-0">1 Pizza ${element.detalle.pizza1}</p>
    
    </div>`;
    containerDetail.append(templateView);
  } else {
    let templateView = `<div>
    <div class="row">
    <div class="col-9"> <p class="mb-0 title-promo">Promoción ${namePromo} = S/ ${element.total} </p></div>
    <div class="col-3 text-right"><button class="btn-delete" id=${index} data-id=${index}><i class="fas fa-times"></i></button></div>
    </div>
    <p class="mb-0">1 Pizza ${element.detalle.pizza1}</p>
    <p class="mb-0">1 Pizza ${element.detalle.pizza2}</p>
   
    </div>`;
    containerDetail.append(templateView);
  }
}

// Función que inserta los valores con el estilo determinado
let templateProducts = (element, container) => {
  let template = `<div class="col-6 pt-2 ">
  <div class="mb-2">
    <p class="mb-0 name-product text-center">${element.nombre}  </p>
    <p class="text-center mb-0 name-product">S/ ${element.precio}0</p>
    <p class="f14 text-center">${element.description}</p>
    <div class="row">
      <div class="col-4 offset-1 text-right">
        <button class=" decrement btn-subt" data-detail="${element.detail}"  data-name="${element.nombre}" data-precio=${element.precio} data-type=${element.type} id="${element.title}decrement" ><i class="fas fa-minus"></i></button>
      </div>
      <div class="col-2 text-center number-span" id=${element.title} >0</div>
      <div class="col-4">
        <button class="increment btn-subt" data-detail="${element.detail}" data-name="${element.nombre}" data-precio=${element.precio} data-type=${element.type} id="${element.title}aument"><i class="fas fa-plus"></i></button>
      </div>
    </div> 
    <div class="mt-2"><img class="img-fluid" src="${element.img}" ></div>
  </div>  
</div>`;
  container.append(template);
}

// funciòn que cuenta las promociones seleccionadas
function countPromo() {
  // Obtener el array de Promociones Finales
  let totalPedidoPromo = JSON.parse(localStorage.arrayPromociones);
  let count2da = 0;
  let countPrincipal = 0;
  if (totalPedidoPromo.length > 0) {
    totalPedidoPromo.forEach(element => {
      if (element.promocion == "segunda1sol") {
        count2da++;
        $('#total-count-2da').text(count2da);
      }
      if (element.promocion == "principal") {
        countPrincipal++;
        $('#total-count-principal').text(countPrincipal)
      }
      if (element.promocion == "principal" && totalPedidoPromo.length == 1) {
        $('#total-count-2da').text(0);
      }
      if (element.promocion == "segunda1sol" && totalPedidoPromo.length == 1) {
        $('#total-count-principal').text(0)
      }

    });
  } else {
    $('#total-count-2da').text(0);
    $('#total-count-principal').text(0)
  }

}

// Función que resetea los valores enviados
function resetPromo2da() {
  containerBig.empty();
  $.getJSON('https://api.myjson.com/bins/w94v6', function (data) {
    let pizzaBig = data.products.pizzas.grandes;
    let pizzaFamily = data.products.pizzas.familiares;
    pizzaBig.forEach(element => {
      templateProducts(element, containerBig);
    });
  });
}

// Funciones de Incrementar/Decrementar Precio
let incrementTotal = (price, idNumberBox, name, type, detail) => {
  let promo = localStorage.getItem('promocion');
  if (promo == "segunda1sol") {
    let totalPedido = localStorage.getItem('totalFinal');
    let number = $(`#${idNumberBox}`).text();
    number = parseInt(number) + 1; // valor del número central
    $(`#${idNumberBox}`).text(number); // mostrando valores

    // almacenando data de costo total
    arrayBigPizza.push({
      'detalle': name,
      'precio': price,
      'tamaño': type
    });
    arrayFinaly.push({
      'detalle': name,
      'precio': price,
      'tamaño': type
    });
    localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
    localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
    let countPedido = JSON.parse(localStorage.arrayFinaly);

    if (countPedido.length < 2 || countPedido.length > 2) {
      desactiveButton(confirm2da);
      $('.text-alert').text(' * Debes elegir solo 2 pizzas');
    } else {
      activeButton(confirm2da);
      $('.text-alert').text('');
    }
  }
  if (promo == "principal") {
    let totalPedido = localStorage.getItem('totalFinal');
    let numberPrincipal = $(`#${idNumberBox}`).text();
    numberPrincipal = parseInt(numberPrincipal) + 1; // valor del número central
    $(`#${idNumberBox}`).text(numberPrincipal); // mostrando valores
    arrayPromoPrincipal.push({
      'detalle': name,
      'tamaño': sizePizza
    });
    localStorage.setItem('arrayPromoPrincipal', JSON.stringify(arrayPromoPrincipal));

    let totalPricePromoPrincipal = validationPricePromoPrincipal(sizePizza, countPizzaTotal);
    localStorage.setItem('totalPromoPrincipal', JSON.stringify(totalPricePromoPrincipal));

    let countPromoFinal = JSON.parse(localStorage.arrayPromoPrincipal);
    if (countPizzaTotal == 2) {
      if (countPromoFinal.length !== 2) {
        desactiveButton(confirmPrincipal);
        $('.text-alert-principal').text(' * Debes elegir solo 2 pizzas');
      } else {
        activeButton(confirmPrincipal);
        $('.text-alert-principal').text('');
      }
    }
    if (countPizzaTotal == 1) {
      if (countPromoFinal.length !== 1) {
        desactiveButton(confirmPrincipal);
        $('.text-alert-principal').text(' * Debes elegir solo 1 pizza');
      } else {
        activeButton(confirmPrincipal);
        $('.text-alert-principal').text('');
      }
    }
  }
};

// VAlidaciòn de activar promociones por día
function validateDaysPromo() {
  let date = new Date();
  let today = date.getDay();
  if (today == 2 || today == 1) { // 4 es jueves y 2 martes
    $('.promo2da').css('color', '#807673')
    $('#btn-segunda').removeAttr('disabled');
    $('#btn-segunda').css('backgroundColor', '#807673');
    $('#total-count-2da').css('color', '#00977');

  } else {
    $('.promo2da').css('color', '#cfc9c7')
    $('#btn-segunda').attr('disabled', true);
    $('#btn-segunda').css('backgroundColor', '#cfc9c7');
    $('#total-count-2da').css('color', '#cfc9c7');
  }
}

// Funciones reutilizables

function inactivePromo() {
  $('.promobot').css('color', '#cfc9c7')
  $('#btn-bot').attr('disabled', true);
  $('#btn-bot').css('backgroundColor', '#cfc9c7');
  $('#total-count-bot').css('color', '#cfc9c7');
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
  $('.span-p').text(0);
  $('.decrement').removeClass('btn-active');
  $('.increment').removeClass('btn-active');
  desactiveButton(confirmPrincipal);
}

function deleteArrayIndex(array, id) {
  for (p = 0; p < array.length; p++) {
    if (id == p) {
      array.splice(p, 1);
    }
  };
}

function validationPricePromoPrincipal(sizePizza, countPizzaTotal) {
  let totalPromoPrincipal = 0;
  if (sizePizza == "Grande" && countPizzaTotal == 1) {
    totalPromoPrincipal = 39.90;
  } else if (sizePizza == "Familiar" && countPizzaTotal == 1) {
    totalPromoPrincipal = 44.90;
  } else if (sizePizza == "Grande" && countPizzaTotal == 2) {
    totalPromoPrincipal = 59.90;
  } else if (sizePizza == "Familiar" && countPizzaTotal == 2) {
    totalPromoPrincipal = 69.90;
  } else {
    totalPromoPrincipal = 0;
  }
  return totalPromoPrincipal;
}

function totalOrderDelivery() {
  let numberTotal = localStorage.getItem('totalFinal');
  let totalDelivery = parseFloat(numberTotal) + 3.90;
  return totalDelivery.toFixed(1);
}

function activeBorderRadioButtonPizza(id) {
  resetBorderGrey();
  $(`#${id}`).removeClass('border-b');
  $(`#${id}`).addClass('border-r');
}

function showSectionPizzasFavorites(count) {
  if (count == 1) {
    $('#box-pizza-favorite').hide();
    $('#title-favorite-selection').text('tu pizza')
  } else {
    $('#box-pizza-favorite').show();
    $('#title-favorite-selection').text('tu primera pizza')
  }
}

function initFavoritePizzas() {
  localStorage.setItem('totalPromoPrincipal', 39.90);
  sizePizza = "Grande";
  $('input[type=radio]').prop('checked', function () {
    return this.getAttribute('checked') == 'checked';
  });
  $('#box-pizza-favorite').hide();
  oneFavorite(sizePizza);
  activeButton(confirmPrincipal);
}

function resetBorderGrey() {
  $('.border-preview').removeClass('border-r');
  $('.border-preview').addClass('border-b');
}

function twoFavoritesPizzas(sizePizza, favoritePizza) {
  let arrayFavorita = [{
      'detalle': 'La Favorita de John',
      'tamaño': sizePizza
    },
    {
      'detalle': favoritePizza,
      'tamaño': sizePizza
    }
  ];
  localStorage.setItem('arrayPromoPrincipal', JSON.stringify(arrayFavorita));
}

function oneFavorite(sizePizza) {
  let arrayFavorita = [{
    'detalle': 'La Favorita de John',
    'tamaño': sizePizza
  }];
  localStorage.setItem('arrayPromoPrincipal', JSON.stringify(arrayFavorita));
}

inactivePromo();
