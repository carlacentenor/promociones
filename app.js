// DOM
const section1 = $('.big-pizza-section');
const btnSegunda = $('#btn-segunda');
const principal = $('.containerPrincipal');
const containerBig = $('.container-bigpizza');
const back = $('.back');
const confirm2da = $('.btn-confirm-promo2');
let price1 = 0;
let price2 = 0;
// ocultando las secciones
section1.hide();
// Promocion segunda a 1 sol
btnSegunda.on('click', function () {
  section1.show();
  principal.hide();
});

let arrayBigPizza = [];
let arrayFamilyPizza = [];
let arrayAdicional = [];
let arrayBebidas = [];
let arrayFinaly = [];

// regresar a la ventana principal
back.on('click', function () {
  section1.hide();
  principal.show();
});

// renderizando información en la web
$.getJSON('https://my-json-server.typicode.com/carlacentenor/webview/db', function (data) {
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






// Funciones de Incrementar/Decrementar Precio
let incrementTotal = (price, idNumberBox, name, type, detail) => {
  let totalPedido = localStorage.getItem('totalFinal');
  let number = $(`#${idNumberBox}`).text();
  number = parseInt(number) + 1; // valor del número central
  $(`#${idNumberBox}`).text(number); // mostrando valores
  let final = parseFloat(price) + parseFloat(totalPedido);
  localStorage.setItem('totalFinal', final.toFixed(1));
  // almacenando data de costo total
  arrayBigPizza.push({'detalle': detail ,'precio':price });
  arrayFinaly.push({'detalle': detail ,'precio':price });
  localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
  localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
  let countPedido = JSON.parse(localStorage.arrayFinaly);
  

  


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
      
      let index = arrayBigPizza.indexOf(detail);
      let indexDetail = arrayFinaly.indexOf(detail);//for
      arrayBigPizza.splice(index, 1);
      arrayFinaly.splice(indexDetail, 1);
      localStorage.setItem('arrayBigPizza', JSON.stringify(arrayBigPizza));
      localStorage.setItem('arrayFinaly', JSON.stringify(arrayFinaly));
     

    
    }

  
};







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