const cardTemplate = document.querySelector('#card-template').content;

function createCard(cardData, deleteCallback, likeCallback, imageClickCallback, userId) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = cardData.likes.length;

  const isOwner = cardData.owner._id === userId;
  if (!isOwner) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      deleteCallback(cardData._id, cardElement);
    });
  }

  const isLiked = cardData.likes.some(user => user._id === userId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    likeCallback(cardData._id, likeButton, likeCounter);
  });

  cardImage.addEventListener('click', () => {
    imageClickCallback(cardData);
  });

  return cardElement;
}

function deleteCard(event) {
  const card = event.target.closest('.card');
  card.remove();
}

function likeCard(event) {
    event.target.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard, likeCard };