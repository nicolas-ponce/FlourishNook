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

const sizeFiltersBtn = document.querySelectorAll(".store__filters-sizeBtn");
const lmFiltersBtn = document.querySelectorAll(".store__filters-lmBtn");

// Filtrar los productos
const filterProducts = () => {
    for (let i = 0; i < sizeFiltersBtn.length; i++) {
        sizeFiltersBtn[i].addEventListener("click", () => {
            renderStoreProducts(sizeFiltersBtn[i].dataset.size);
        });
        lmFiltersBtn[i].addEventListener("click", () => {
            renderStoreProducts(lmFiltersBtn[i].dataset.lm);
        });
    }
}
filterProducts();



// Ordenar según precio
const orderByPrice = (order) => {
    if (order === "asc") {
        plants.sort((a, b) => a.price - b.price);
    } else {
        plants.sort((a, b) => b.price - a.price);
    }
    cardList.innerHTML = '';
    plants.map((plant) => {
        storeProductTemplate(plant);
    });
};



// Manejar el selector de orden de precios
const selectElement = document.querySelector(".store__filters-orderBy-select");

selectElement.addEventListener("change", () => {
    const selectedOption = selectElement.value;
    switch (selectedOption) {
        case "---":
            break;
        case "Precio: Menor a mayor":
            orderByPrice("asc");
            break;
        case "Precio: Mayor a menor":
            orderByPrice("desc");
            break;
        default:
            break;
    }
});


// Template de productos de la tienda
const storeProductTemplate = (arr) => {
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
    `;
    cardList.appendChild(card);
    card.classList.add("card");
    return;
}






// Renderizar productos en la tienda (según filtros aplicados)
const renderStoreProducts = (filter) => {
    let filteredProducts = plants.filter(plant => plant.size === filter || plant.lm === filter);


    if(filteredProducts.length === 0) {
        plants.map((plant) => {
            storeProductTemplate(plant);
        });
        return;
    }
    cardList.innerHTML = '';
    filteredProducts.map((filteredProduct) => {
        storeProductTemplate(filteredProduct);
    });
}
renderStoreProducts();




// -------------------------------------------------------------------

/*
Carrito
*/
const cartItems = document.querySelector(".cart__items");

// Crear lista de items del carrito
let cartList = JSON.parse(localStorage.getItem('cartItems')) || [];


// Chequear si el carrito está vacío
const cartIsEmpty = () => {if(cartList.length === 0) return true;}



// Renderizar items del carrito
const renderCartItems = () => {
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

// Añadir productos al carrito desde la store
const addToCartBtn = document.querySelectorAll(".card__add-to-cartBtn");

const addItemToCart = (id) => {
    plants.map(plant => {
        if(cartList.some((cL) => cL.id === plant.id)) {
            return;
        }

        if (id === plant.id) {
            let btn = addToCartBtn[id-1];
            btn.innerHTML = "Añadido!";
            btn.classList.add("card__add-to-cartBtn-added");

            cartList.push(plant);
            refreshCart();
            changeShoppingCartValue();
            return;
        }
    })
}

// Cambiar la cantidad de productos en total del ícono del carrito
const shoppingCartValue = document.querySelector(".shopping-cart__number");

const changeShoppingCartValue = () => {
    shoppingCartValue.innerHTML = `${cartList.length}`;
    renderCartItems();
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

// Resetear cantidad de productos en el carrito
const resetQuantity = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].quantity = 1;
    }
}


// Eliminar producto del carrito
const delElement = (j) => {
    plants.map(plant => {
        if(j === plant.id) {
            let btn = addToCartBtn[j-1];
            btn.innerHTML = "Añadir al carrito";
            btn.classList.remove("card__add-to-cartBtn-added");

            resetQuantity(cartList);
            cartList.splice(j, 1);
        }
    })
    refreshCart();
}




// Borrar todos los productos del carrito
const deleteBtn = document.querySelector(".cart__delete-button");

const deleteItems = () => {
    for (let i = 0; i < plants.length; i++) {
        let btn = addToCartBtn[i];
        btn.innerHTML = "Añadir al carrito";
        btn.classList.remove("card__add-to-cartBtn-added");
    }
    resetQuantity(cartList);
    cartList = [];
    refreshCart();
}



// Refrescar el carrito
const refreshCart = () => {
    renderCartItems();
    changeShoppingCartValue();
}








/*
Contacto
*/
const contactForm = document.querySelector(".contactUs__form");

const contactError = document.querySelector(".contactUs__error");

const nameInput = document.querySelector(".contactUs__form-nameInput");
const emailInput = document.querySelector(".contactUs__form-emailInput");
const msgInput = document.querySelector(".contactUs__form-msgInput");

const contactBtn = document.querySelector(".contactUs__form-btn");



// Chekear los errores de cada input
const checkInputs = () => {
    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const msgValue = msgInput.value.trim();

    nameValue === '' ? showFormError(nameInput,"Por favor, ingrese su nombre") : showSuccess(nameInput);
    nameValue.length < 3 ? showFormError(nameInput, "Su nombre no puede tener menos de 3 caracteres") : showSuccess(nameInput);

    emailValue === '' ? showFormError(emailInput,"Por favor, ingrese su email") : showSuccess(emailInput);
    emailValue.length < 6 ? showFormError(emailInput,"Su email debería contener mas de 6 caracteres") : showSuccess(emailInput);

    msgValue === '' ? showFormError(msgInput,"Por favor, escriba su mensaje o consulta") : showSuccess(msgInput);
    msgValue.length <= 10 ? showFormError(msgInput,"Su consulta debe de superar los 10 caracteres") : showSuccess(msgInput);
}

// Mostrar mensaje de error segpun el input
const showFormError = (input, message) => {
    const formControl = input.parentElement;
    const small = formControl.querySelector("small");
    formControl.className = "form-control error";
    small.innerText = message;
}

// Mostrar éxito en la validación del input del formulario
const showSuccess = (input) => {
    const formControl = input.parentElement;
    formControl.className = "form-control success";
}






















// Init App
const initApp = () => {
    // Renderizar productos de la tienda


    // Cambiar el valor de cantidad de productos dentro del carrito del navbar
    changeShoppingCartValue();

    // EvLi - Carrito de compras
    shoppingCart.addEventListener("click", () => {toggleHidden(cart, menu)});

    // EvLi - Menú despegable
    hamburger.addEventListener("click", () => {toggleHidden(menu, cart)});

    // Borrar todos los items del carrito
    deleteBtn.addEventListener("click", () => {deleteItems()});

    // Validación del formulario
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        checkInputs();
    })
}

initApp();


