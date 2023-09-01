/*
Mostrar o cerrar carrito de compras / Menú despegable
*/
const shoppingCart = document.querySelector(".shopping-cart");
const cart = document.querySelector(".cart");
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".navbar__links-mq");

// Mostrar/ocultar según elemento activo para menú despegable y carrito
const toggleHidden = (toggle, active) => {
    if(active.classList.contains("hidden")){
        toggle.classList.toggle("hidden");
        return;
    } else {
        active.classList.toggle("hidden");
        toggle.classList.toggle("hidden");
    }
}

// -------------------------------------------------------------------

/*
Preguntas frecuentes
*/
const qnaBox = document.querySelectorAll(".qna__box");
const qnaAnswer = document.querySelectorAll(".qna__answer");

for(let i = 0; i < qnaBox.length; i++) {
    qnaBox[i].addEventListener("click", () => {
        qnaAnswer[i].classList.toggle("hidden");
    });
}

// -------------------------------------------------------------------

/*
Renderizar productos
*/
const cardList = document.querySelector(".store__cards");
const filtersBtn = document.querySelectorAll(".store__filters-btn");


// Filtrar los productos
const filterProducts = () => {
    for (let i = 0; i < filtersBtn.length; i++) {
        filtersBtn[i].addEventListener("click", () => {
            console.log(filtersBtn[i].dataset.size);

            renderStoreProducts(filtersBtn[i].dataset.size);
        })
    }
}
filterProducts();

const renderStoreProducts = (filter) => {
    let filteredProducts = plants.filter(plant => plant.size === filter);

    if(filteredProducts.length === 0) {
        plants.map((plant) => {
            renderProductForStore(plant);
        });
        return;
    } else {
        renderProductForStore(filteredProducts);
    }

    console.log(filteredProducts);



}


const renderProductForStore = (arr) => {
    let {image,name,sciName,description,size,lm,price,id} = arr;

    const card = document.createElement("DIV");
    card.innerHTML = `
        <div class="card__img-div">
            <img class="card__img" src="${image}">
        </div>
        <div class="card__title">
            <h6 class="card__name">${name}</h6>
            <p class="card__sciName">${sciName}</p>
        </div>
        <p class="card__description">
            ${description}
        </p>
        <div class="card__features">
            <p class="card__size">Tamaño: ${size}</p>
            <p class="card__lm">Necesidad lumínica: ${lm}</p>
        </div>
        <div class="card__priceBtn">
            <p class="card__price">$${price}</p>
            <button onclick="addItemToCart(${id})" class="card__add-to-cartBtn">Añadir al carrito</button>
        </div>
    `
    cardList.appendChild(card);
    card.classList.add("card");
    return;
}

// -------------------------------------------------------------------

/*
Carrito
*/
const cartItems = document.querySelector(".cart__items");

// Crear lista de items del carrito
let cartList = JSON.parse(localStorage.getItem('cartItems')) || [];


// Chequear si el carrito está vacío
const cartIsEmpty = () => {if(cartList.length === 0) return true;}




const displayCart = () => {
    let j = 0;
    let subtotal = 0;
    let total = 0;
    if(cartIsEmpty()) {
        cartItems.innerHTML = "<h6>El carrito está vacío</h6>";
    } else {
        cartItems.innerHTML = cartList.map((item)=> {
            let {name,image,price,quantity,id} = item;

            const subtotalValue = document.querySelector(".subtotal");
            const totalValue = document.querySelector(".cart__info-box-totalPrice");

            subtotal = subtotal + (price * quantity);
            total = subtotal + 1100;
            subtotalValue.innerHTML = `$${subtotal}`;
            totalValue.innerHTML = `$${total}`;

            return (
                `
                <div class="cart__item">
                    <div class="cart__item-img-info">
                        <div class="cart__item-img-div">
                            <img src="${image}" alt="jacinto.png" class="cart__item-img">
                        </div>
                        <div class="cart__item-info">
                            <p class="cart__item-info-pName">${name}</p>
                            <p class="cart__item-info-pPrice">$${price}</p>
                            <button class="cart__item-info-delBtn" onclick="delElement(${j++})">Borrar item</button>
                        </div>
                    </div>
                    <div class="cart__item-buttons">
                        <button onclick="addQuantity(${id})" class="cart__item-buttons-addBtn">+</button>
                        <div class="cart__item-buttons-quantity">${quantity}</div>
                        <button onclick="susQuantity(${id})" class="cart__item-buttons-minBtn">-</button>
                    </div>
                </div>
                `
            )
        }).join('');
    }
}



// Añadir productos cuando se está dentro del carrito
const addQuantity = (id) => {
    cartList.map(item => {
        if(item.id === id) {
            item.quantity++;
        }
    })
    refreshCart();
}
// Sacar productos cuando se está dentro del carrito (sin eliminar)
const susQuantity = (id) => {
    cartList.forEach(item => {
        if(item.quantity !== 1 && item.id === id) {
            item.quantity--; 
        }
    })
    refreshCart();
}

// Añadir productos al carrito desde la store
const addItemToCart = (id) => {
    plants.map(plant => {
        if(cartList.some((cL) => cL.id === plant.id)) {
            return;
        }

        if (id === plant.id) {
            console.log(cartList.some((cL) => cL.id === plant.id))

            cartList.push(plant);
            console.log(cartList);
            refreshCart();
            changeShoppingCartValue();
            return;
        }
    })
}


// Eliminar productos del carrito
const delElement = (j) => {
    plants.map(plant => {
        if(j === plant.id) {
            cartList.splice(j, 1);
            console.log(cartList);
        }
    })
    refreshCart();
}


// Cambiar la cantidad de productos en total en el carrito
const shoppingCartValue = document.querySelector(".shopping-cart__number");

const changeShoppingCartValue = () => {
    shoppingCartValue.innerHTML = `${cartList.length}`;
    displayCart();
}





// Borrar todos los productos del carrito
const deleteBtn = document.querySelector(".cart__delete-button");

const deleteItems = () => {
    cartList = [];
    refreshCart();
    console.log(cartList);
}



// Función para refrescar el carrito
const refreshCart = () => {
    displayCart();
    changeShoppingCartValue();
}










// Init App
const initApp = () => {
    // Renderizar productos de la tienda
    renderStoreProducts();

    // Cambiar el valor de cantidad de productos dentro del carrito del navbar
    changeShoppingCartValue();

    // EvLi - Carrito de compras
    shoppingCart.addEventListener("click", () => {toggleHidden(cart, menu)});

    // EvLi - Menú despegable
    hamburger.addEventListener("click", () => {toggleHidden(menu, cart)});

    // Borrar todos los items del carrito
    deleteBtn.addEventListener("click", () => {deleteItems()});
}

initApp();


