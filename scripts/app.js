/*
Crear las variables del documento
*/

// Preguntas frecuentes
const qnaBox = document.querySelectorAll(".qna__box");
const qnaAnswer = document.querySelectorAll(".qna__answer");
// Menú hamburguesa y menú
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".navbar__links-mq");
// Store (Filtros)
const selectElement = document.querySelector(".store__filters-orderBy-select");
const sizeFiltersBtn = document.querySelectorAll(".store__filters-sizeBtn");
const lmFiltersBtn = document.querySelectorAll(".store__filters-lmBtn");
const seeAllBtn = document.querySelector(".store__filters-seeAllBtn");
const cardList = document.querySelector(".store__cards");
// Carrito (Exterior)
const cart = document.querySelector(".cart");
const shoppingCart = document.querySelector(".shopping-cart");
const shoppingCartValue = document.querySelector(".shopping-cart__number");
// Carrito (Interior)
const cartItems = document.querySelector(".cart__items");
const deleteBtn = document.querySelector(".cart__delete-button");
// Contacto
const contactForm = document.querySelector(".contactUs__form");
const nameInput = document.querySelector(".contactUs__form-nameInput");
const emailInput = document.querySelector(".contactUs__form-emailInput");
const msgInput = document.querySelector(".contactUs__form-msgInput");
const contactError = document.querySelector(".contactUs__error");
const contactBtn = document.querySelector(".contactUs__form-btn");





// -------------------------------------------------------------------

// Crear lista de items del carrito
let cartList = JSON.parse(localStorage.getItem('cartItems')) || [];

// Guardar la lista de items en el localStorage
const saveToLocalStorage = () => {
    localStorage.setItem('cartItems', JSON.stringify(cartList));
}


// -------------------------------------------------------------------

/*
Mostrar o cerrar carrito de compras / Menú despegable
*/

// Mostrar/ocultar según elemento activo para menú despegable y carrito
const toggleHidden = (toggle, active) => {
    if (active.classList.contains("hidden")) {
        toggle.classList.toggle("hidden");
    } else {
        active.classList.toggle("hidden");
        toggle.classList.toggle("hidden");
    }
}
// (!cart.contains(e.target) && e.target !== shoppingCart)
// (!menu.contains(e.target) && e.target !== hamburger)

const returnShoppingCartChildren = () => {
    for (let i = 0; i < shoppingCart.childNodes.length; i++) {
        const papa = shoppingCart.childNodes[i];
        return papa;
    }
}




// -------------------------------------------------------------------

/*
Preguntas frecuentes
*/

// Abre y cierra el box de Q&A
for(let i = 0; i < qnaBox.length; i++) {
    qnaBox[i].addEventListener("click", () => {
        qnaAnswer[i].classList.toggle("hidden");
    });
}





// -------------------------------------------------------------------

/*
Filtrado de productos
*/

// Filtrar los productos según tamaño e iluminación
const filterProducts = () => {
    for (let i = 0; i < sizeFiltersBtn.length; i++) {
        sizeFiltersBtn[i].addEventListener("click", () => {
            renderStoreProducts(sizeFiltersBtn[i].dataset.size);
        });
        lmFiltersBtn[i].addEventListener("click", () => {
            renderStoreProducts(lmFiltersBtn[i].dataset.lm);
        });
    }
    seeAllBtn.addEventListener("click", () => {
        renderStoreProducts(plants);
    })

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






// EvLi - Manejar el selector de orden de precios
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


/*
Renderizado de productos de la store
*/

// Template de productos de la tienda
const storeProductTemplate = (arr) => {
    let {image, name, sciName, description, size, lm, price, id} = arr;

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
}



// Renderizar productos en la tienda (según filtros aplicados)
const renderStoreProducts = (filter) => {
    let filteredProducts = plants.filter(plant => plant.size === filter || plant.lm === filter);
    cardList.innerHTML = '';

    if(filteredProducts.length === 0) {
        cardList.innerHTML = '';
        plants.map((plant) => {
            storeProductTemplate(plant);
        })
        return;
    }

    filteredProducts.forEach((filteredProduct) => {
        storeProductTemplate(filteredProduct);
    });
}
renderStoreProducts();





// -------------------------------------------------------------------

/*
Carrito
*/

// Renderizar items del carrito
const renderCartItems = () => {
    let subtotal = 0;
    let total = 0;
    if(cartList.length === 0) {
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
                            <button class="cart__item-info-delBtn" onclick="delElement(${id})">Borrar item</button>
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
        saveToLocalStorage();
    }
}



// Traer el botón de añadir al carrito después de renderizado el producto (gracias Alba)
const addToCartBtn = document.querySelectorAll(".card__add-to-cartBtn");

// Añadir productos al carrito desde la store
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
            return;
        }
        if(item.quantity === 1  && item.id === id) {
            delElement(item.id);
        }
    })
    refreshCart();
}



// Restablecer la cantidad de productos en el carrito
const resetQuantity = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        arr[i].quantity = 1;
    }
}



// Eliminar producto del carrito
const delElement = (productId) => {
    const index = cartList.findIndex(item => item.id === productId);

    if (index !== -1) {
        cartList.splice(index, 1);
        
        const productIndex = plants.findIndex(plant => plant.id === productId);
        if (productIndex !== -1) {
            const btn = addToCartBtn[productIndex];
            btn.innerHTML = "Añadir al carrito";
            btn.classList.remove("card__add-to-cartBtn-added");
        }
        refreshCart();
    }
}



// Borrar todos los productos del carrito
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
    saveToLocalStorage();
}





// -------------------------------------------------------------------

/*
Contacto
*/

// Mostrar mensaje de error según el input
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



// Checkear los errores de cada input y mostrar el respectivo mensaje
const checkInputs = () => {
    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const msgValue = msgInput.value.trim();

    // Para el nombre
    nameValue === '' ? showFormError(nameInput,"Por favor, ingrese su nombre") : showSuccess(nameInput);
    nameValue.length < 3 ? showFormError(nameInput, "Su nombre no puede tener menos de 3 caracteres") : showSuccess(nameInput);

    // Para el email
    emailValue === '' ? showFormError(emailInput,"Por favor, ingrese su email") : showSuccess(emailInput);
    emailValue.length < 6 ? showFormError(emailInput,"Su email debería contener mas de 6 caracteres") : showSuccess(emailInput);

    // Para el textarea (mensaje)
    msgValue === '' ? showFormError(msgInput,"Por favor, escriba su mensaje o consulta") : showSuccess(msgInput);
    msgValue.length <= 10 ? showFormError(msgInput,"Su consulta debe de superar los 10 caracteres") : showSuccess(msgInput);
}

























// Init App
const initApp = () => {

    // Cambiar el valor de cantidad de productos dentro del carrito del navbar
    changeShoppingCartValue();

    // EvLi - Carrito de compras
    shoppingCart.addEventListener("click", () => {
        toggleHidden(cart, menu)
    });

    // EvLi - Menú despegable
    hamburger.addEventListener("click", () => {
        toggleHidden(menu, cart)
    });

    // Borrar todos los items del carrito
    deleteBtn.addEventListener("click", () => {
        deleteItems()
    });

    // Validación del formulario
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        checkInputs();
    })

    // Cierra el menú al hacer click fuera de este
    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && e.target !== hamburger) {
            menu.classList.add("hidden");
            console.log("Hola");
        }
    })
}





initApp();