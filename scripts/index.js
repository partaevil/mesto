const cardTemplate = document.querySelector('#card-template').content;

const placesList = document.querySelector('.places__list');

const profilePopup = document.querySelector('.popup_type_edit');
const cardPopup = document.querySelector('.popup_type_new-card');
const imagePopup = document.querySelector('.popup_type_image');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const closeButtons = document.querySelectorAll('.popup__close');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const profileFormElement = document.forms['edit-profile'];
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');

const cardFormElement = document.forms['new-place'];
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_url');

const popupImageElement = imagePopup.querySelector('.popup__image');
const popupCaptionElement = imagePopup.querySelector('.popup__caption');

function openModal(popup) {
  popup.classList.add('popup_is-opened');
}

function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
}

function createCard(cardData) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  deleteButton.addEventListener('click', deleteCard);
  
  likeButton.addEventListener('click', function(evt) {
    evt.target.classList.toggle('card__like-button_is-active');
  });

  cardImage.addEventListener('click', function() {
    popupImageElement.src = cardData.link;
    popupImageElement.alt = cardData.name;
    popupCaptionElement.textContent = cardData.name;
    openModal(imagePopup);
  });

  return cardElement;
}

function deleteCard(event) {
  const card = event.target.closest('.card');
  card.remove();
}

function handleProfileFormSubmit(evt) {
    evt.preventDefault(); 
    const newName = nameInput.value;
    const newJob = jobInput.value;

    profileTitle.textContent = newName;
    profileDescription.textContent = newJob;

    closeModal(profilePopup);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };

  const newCardElement = createCard(newCardData);
  placesList.prepend(newCardElement);
  
  cardFormElement.reset();
  closeModal(cardPopup);
}

initialCards.forEach(function(cardData) {
  const cardElement = createCard(cardData);
  placesList.append(cardElement);
});

profileEditButton.addEventListener('click', function () {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openModal(profilePopup);
});

profileAddButton.addEventListener('click', function() {
  cardFormElement.reset(); 
  openModal(cardPopup);
});

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

cardFormElement.addEventListener('submit', handleCardFormSubmit);

closeButtons.forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});