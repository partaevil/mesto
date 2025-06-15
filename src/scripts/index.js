import '../pages/index.css';
import { initialCards } from './cards.js';
import { openModal, closeModal } from './modal.js';
import { createCard, deleteCard, likeCard } from './card.js';
import { enableValidation, clearValidation } from './validate.js';

const placesList = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup');

const profilePopup = document.querySelector('.popup_type_edit');
const profileEditButton = document.querySelector('.profile__edit-button');
const profileFormElement = document.forms['edit-profile'];
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

const cardPopup = document.querySelector('.popup_type_new-card');
const profileAddButton = document.querySelector('.profile__add-button');
const cardFormElement = document.forms['new-place'];
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_url');

const imagePopup = document.querySelector('.popup_type_image');
const popupImageElement = imagePopup.querySelector('.popup__image');
const popupCaptionElement = imagePopup.querySelector('.popup__caption');

const closeButtons = document.querySelectorAll('.popup__close');

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active',
};

function handleImageClick(cardData) {
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaptionElement.textContent = cardData.name;
  openModal(imagePopup);
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(profilePopup);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value
  };
  const newCardElement = createCard(newCardData, deleteCard, likeCard, handleImageClick);
  placesList.prepend(newCardElement);
  cardFormElement.reset();
  closeModal(cardPopup);
}

initialCards.forEach(function (cardData) {
  const cardElement = createCard(cardData, deleteCard, likeCard, handleImageClick);
  placesList.append(cardElement);
});

popups.forEach((popup) => {
  popup.classList.add('popup_is-animated');
});

profileEditButton.addEventListener('click', () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(profileFormElement, validationConfig);
  openModal(profilePopup);
});

profileAddButton.addEventListener('click', () => {
  cardFormElement.reset();
  clearValidation(cardFormElement, validationConfig);
  openModal(cardPopup);
});

profileFormElement.addEventListener('submit', handleProfileFormSubmit);
cardFormElement.addEventListener('submit', handleCardFormSubmit);

closeButtons.forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});

enableValidation(validationConfig);