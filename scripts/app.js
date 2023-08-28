// Mostrar o cerrar carrito de compras
const shoppingCart = document.querySelector(".shopping-cart");
const cart = document.querySelector(".cart");


shoppingCart.addEventListener("click", () => {
    cart.classList.toggle("hidden");
})



// Preguntas frecuentes
const qnaBox = document.querySelectorAll(".qna__box");
const qnaAnswer = document.querySelectorAll(".qna__answer");


for (let i = 0; i < qnaBox.length; i++) {
    qnaBox[i].addEventListener("click", () => {
        qnaAnswer[i].classList.toggle("hidden");
    })
    
}


// Renderizar productos

const cardList = document.querySelector(".store__cards");

plants.forEach((plant) => {
    const card = document.createElement("DIV");
    card.innerHTML = `
        <div class="card__img-div">
            <img class="card__img" src="${plant.image}">
        </div>
        <div class="card__title">
            <h6 class="card__name">${plant.name}</h6>
            <p class="card__sciName">${plant.sciName}</p>
        </div>
        <p class="card__description">
            ${plant.description}
        </p>
        <div class="card__features">
            <p class="card__size">Tamaño: ${plant.size}</p>
            <p class="card__lm">Necesidad lumínica: ${plant.lm}</p>
        </div>
        <div class="card__priceBtn">
            <p class="card__price">$${plant.price}</p>
            <button class="card__add-to-cartBtn">Añadir al carrito</button>
        </div>
    `
    cardList.appendChild(card);
    card.classList.add("card");
})