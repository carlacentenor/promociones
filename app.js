// DOM
const section1 = $('.big-pizza-section');
const btnSegunda = $('#btn-segunda');
const btnPromoPrincipal = $('#btn-patriotas');
const principal = $('.containerPrincipal');
const containerBig = $('.container-bigpizza');
const promoPrincipal = $('.promo-principal-section');
const back = $('.back');
const backPrincipal =$('.back-principal');
const containerDetail = $('.detail-view');
const confirm2da = $('.btn-confirm-promo2');
let showTotal = $('#total');
let totalFinal = 0;
let delivery = 3.90;
const totalPromo2da = $('#total-count-family');

// ocultando las secciones
section1.hide();
promoPrincipal.hide();
// Promocion segunda a 1 sol
btnSegunda.on('click', function () {
  section1.show();
  principal.hide();
});

btnPromoPrincipal.on('click',function(){
  promoPrincipal.show();
  principal.hide();
})

let arrayPromociones = [];
let arrayBigPizza = [];
let arrayFamilyPizza = [];
let arrayAdicional = [];
let arrayBebidas = [];
let arrayFinaly = [];

// regresar a la ventana principal
back.on('click', function () {
  section1.hide();
  principal.show();
  containerDetail.empty();
  arrayFinaly = [];
  showTotal.text(0);
  totalPromo2da.text(0);
  $('#config').attr('disabled', true);
  $('#config').css('backgroundColor', '#A39D9B');
});

backPrincipal.on('click',function(){
promoPrincipal.hide();
principal.show();

});

// renderizando información en la web
$.getJSON('https://api.myjson.com/bins/w94v6', function (data) {
  let pizzaBig = data.products.pizzas.grandes;
  let pizzaFamily = data.products.pizzas.familiares;
  pizzaBig.forEach(element => {
    templateProducts(element, containerBig);
  });


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

})


// Validacion de 2 pizzas 
confirm2da.attr('disabled', true);
confirm2da.css('backgroundColor', '#A39D9B');




// Funciones de Incrementar/Decrementar Precio
let incrementTotal = (price, idNumberBox, name, type, detail) => {
  let totalPedido = localStorage.getItem('totalFinal');
  let number = $(`#${idNumberBox}`).text();
  number = parseInt(number) + 1; // valor del número central
  $(`#${idNumberBox}`).text(number); // mostrando valores
  let final = parseFloat(price) + parseFloat(totalPedido);
  localStorage.setItem('totalFinal', final.toFixed(1));
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
    confirm2da.attr('disabled', true);
    confirm2da.css('backgroundColor', '#A39D9B');
    $('.text-alert').text(' * Debes elegir solo 2 pizzas');
  } else {
    confirm2da.removeAttr('disabled', 'disabled');
    confirm2da.css('backgroundColor', '#009774');
    $('.text-alert').text('');
  }
};




let decrementTotal = (price, idNumberBox, name, type, detail) => {

  let totalPedido = localStorage.getItem('totalFinal');
  let number = $(`#${idNumberBox}`).text();
  number = parseInt(number) - 1;
  if (number >= 0) {
    $(`#${idNumberBox}`).text(number); // mostrando valores 
    let final = parseFloat(totalPedido) - parseFloat(price);
    localStorage.setItem('totalFinal', final.toFixed(1));

    // Encontrar el valor y eliminarlo
    let countPedido = JSON.parse(localStorage.arrayFinaly);
    // encontrar el valor y borrarlo 
    for (j = 0; j < arrayBigPizza.length; j++) {
      if (name == arrayBigPizza[j].detalle) {
        arrayBigPizza.splice(j, 1);
      }
    }

    for (i = 0; i < arrayFinaly.length; i++) {
      if (name == arrayFinaly[i].detalle) {
        arrayFinaly.splice(i, 1);
      }
    }

    localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
    localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
    countPedido = JSON.parse(localStorage.arrayFinaly);
    if (countPedido.length < 2 || countPedido.length > 2) {
      confirm2da.attr('disabled', true);
      confirm2da.css('backgroundColor', '#A39D9B');
      $('.text-alert').text(' * Debes elegir solo 2 pizzas');
    } else {
      confirm2da.removeAttr('disabled', 'disabled');
      confirm2da.css('backgroundColor', '#009774');
      $('.text-alert').text('');
    }

  }


};



confirm2da.on('click', function () {
  section1.hide();
  principal.show();
  containerDetail.empty();

  let arrayPromoSelect = JSON.parse(localStorage.arrayFinaly);

  let pizza1 = arrayPromoSelect[0];
  let pizza2 = arrayPromoSelect[1];

  if (pizza1.precio > pizza2.precio) {

    pizza2.precio = 1;
    totalFinal = pizza1.precio + pizza2.precio + delivery;
    showTotal.text(totalFinal.toFixed(1));
    localStorage.setItem('totalFinal', totalFinal.toFixed(1));
    let templateView = `<div>
    <p class="mb-0 title-promo">Promoción la 2da a S/ 1 </p>
    <p class="mb-0">1 Pizza ${pizza2.detalle} ${pizza2.tamaño} a S/ ${pizza2.precio} </p>
    <p class="mb-0">1 Pizza ${pizza1.detalle} ${pizza1.tamaño} a S/ ${pizza1.precio} </p>
    </div>`;
    containerDetail.append(templateView);

  }
  if (pizza1.precio < pizza2.precio) {

    pizza1.precio = 1;
    totalFinal = pizza2.precio + pizza1.precio + delivery;
    localStorage.setItem('totalFinal', totalFinal.toFixed(1));
    showTotal.text(totalFinal.toFixed(1));
    let templateView = `<div>
    <p class="mb-0 title-promo">Promoción la 2da a S/ 1 </p>
    <p class="mb-0">1 Pizza ${pizza2.detalle} ${pizza2.tamaño} a S/ ${pizza2.precio} </p>
    <p class="mb-0">1 Pizza ${pizza1.detalle} ${pizza1.tamaño} a S/ ${pizza1.precio} </p>
  </div>`;
    containerDetail.append(templateView);
  }
  if (pizza1.precio == pizza2.precio) {

    pizza1.precio = 1;
    totalFinal = pizza2.precio + pizza1.precio + delivery;
    localStorage.setItem('totalFinal', totalFinal.toFixed(1));
    showTotal.text(totalFinal.toFixed(1));

    let templateView = `<div>
    <p class="mb-0 title-promo">Promoción la 2da a S/ 1 </p>
    <p class="mb-0">1 Pizza ${pizza1.detalle} ${pizza1.tamaño} a S/ ${pizza1.precio} </p>
    <p class="mb-0">1 Pizza ${pizza2.detalle} ${pizza2.tamaño} a S/ ${pizza2.precio} </p>
  </div>`;
    containerDetail.append(templateView);
  }

  arrayPromociones.push({
    pizza1,
    pizza2,
    total: pizza1.precio + pizza2.precio
  });
  totalPromo2da.text('1');

  localStorage.setItem('arrayPromociones', JSON.stringify(arrayPromociones));

  $('#resumen-pedido-promo2da').val(`1 pizza ${pizza1.detalle} ${pizza1.tamaño} S/${pizza1.precio} \n 1 pizza ${pizza2.detalle} ${pizza2.tamaño} S/ ${pizza2.precio}  `);
  $('#resumentotal').val(totalFinal);
  let countFinally = JSON.parse(localStorage.arrayPromociones);
  if (countFinally.length > 0) {
    $('#config').removeAttr('disabled');
    $('#config').css('backgroundColor', '#009774');
  }
  if (countFinally.length == 0) {

    $('#config').attr('disabled', true);
    $('#config').css('backgroundColor', '#A39D9B');
  }

});


// Valor de radio button Pizza Grande y Familiar

$('#radiotipo input').on('change', function () {
  typeHome = $('input[name=tipo]:checked', '#radiotipo').val();
  if (typeHome == 'Grande') {
    arrayBigPizza = [];
    arrayFinaly = [];
    localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
    localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
    containerBig.empty();
    $.getJSON('https://api.myjson.com/bins/w94v6', function (data) {
      let pizzaBig = data.products.pizzas.grandes;
      pizzaBig.forEach(element => {
        templateProducts(element, containerBig);
      });


    });
  }
  if (typeHome == 'Familiar') {
    arrayBigPizza = [];
    arrayFinaly = [];
    localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
    localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
    containerBig.empty();
    $.getJSON('https://api.myjson.com/bins/w94v6', function (data) {
      let pizzaFamily = data.products.pizzas.familiares;
      pizzaFamily.forEach(element => {
        templateProducts(element, containerBig);
      });


    });
  }
});





// Función que inserta los valores con el estilo determinado
let templateProducts = (element, container) => {
  let template = ` <div class="col-6 pt-2 ">
  <div class="mb-2">
    <p class="mb-0 name-product text-center">${element.nombre}  </p>
    <p class="text-center mb-0 name-product">S/ ${element.precio}0</p>
    <p class="f14 text-center">${element.description}</p>
    <div class="row">
    <div class="col-4 offset-1 text-right">
    <button class=" decrement btn-subt" data-detail="${element.detail}"  data-name="${element.nombre}" data-precio=${element.precio} data-type=${element.type} id="${element.title}decrement" ><i class="fas fa-minus"></i></button>
  </div>
  <div class="col-2 text-center number-span" id=${element.title} >0</div>
  <div class="col-4"><button class="increment btn-subt" data-detail="${element.detail}" data-name="${element.nombre}" data-precio=${element.precio} data-type=${element.type} id="${element.title}aument" ><i class="fas fa-plus"></i></button>
  
    </div>
   
  </div> 
    <div class="mt-2"><img class="img-fluid" src="${element.img}" ></div>
    
  </div>
  
  
</div>`;
  container.append(template);
}