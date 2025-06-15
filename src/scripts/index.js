import '../pages/index.css';
import { openModal, closeModal } from './modal.js';
import { createCard } from './card.js';
import { enableValidation, clearValidation } from './validate.js';
import { 
  getUserInfo, 
  getInitialCards, 
  updateUserInfo, 
  addNewCard, 
  deleteCard as apiDeleteCard,
  addLike,
  removeLike,
  updateUserAvatar
} from './api.js';

const placesList = document.querySelector('.places__list');
const popups = document.querySelectorAll('.popup');
const closeButtons = document.querySelectorAll('.popup__close');

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const profileEditButton = document.querySelector('.profile__edit-button');

const profilePopup = document.querySelector('.popup_type_edit');
const profileFormElement = document.forms['edit-profile'];
const nameInput = profileFormElement.querySelector('.popup__input_type_name');
const jobInput = profileFormElement.querySelector('.popup__input_type_description');

const cardPopup = document.querySelector('.popup_type_new-card');
const profileAddButton = document.querySelector('.profile__add-button');
const cardFormElement = document.forms['new-place'];
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardFormElement.querySelector('.popup__input_type_url');

const avatarPopup = document.querySelector('.popup_type_edit-avatar');
const avatarFormElement = document.forms['edit-avatar'];
const avatarLinkInput = avatarFormElement.querySelector('.popup__input_type_avatar-url');
const avatarEditButton = document.querySelector('.profile__image-container');

const imagePopup = document.querySelector('.popup_type_image');
const popupImageElement = imagePopup.querySelector('.popup__image');
const popupCaptionElement = imagePopup.querySelector('.popup__caption');

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active',
};

let userId;

function handleImageClick(cardData) {
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaptionElement.textContent = cardData.name;
  openModal(imagePopup);
}

function handleDeleteCard(cardId, cardElement) {
  apiDeleteCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(`Ошибка при удалении карточки: ${err}`);
    });
}

function handleLikeCard(cardId, likeButton, likeCounter) {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const likeAction = isLiked ? removeLike(cardId) : addLike(cardId);

    likeAction
        .then(updatedCard => {
            likeButton.classList.toggle('card__like-button_is-active');
            likeCounter.textContent = updatedCard.likes.length;
        })
        .catch(err => {
            console.log(`Ошибка при обновлении лайка: ${err}`);
        });
}

function renderLoading(isLoading, button, buttonText = 'Сохранить', loadingText = 'Сохранение...') {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = buttonText;
  }
}

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton);

  updateUserInfo({
    name: nameInput.value,
    description: jobInput.value
  })
    .then(userData => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModal(profilePopup);
    })
    .catch((err) => {
      console.log(`Ошибка при обновлении профиля: ${err}`);
    })
    .finally(() => {
      renderLoading(false, submitButton);
    });
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton, 'Создать', 'Создание...');
  
  addNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value
  })
    .then(newCardData => {
      const newCardElement = createCard(newCardData, handleDeleteCard, handleLikeCard, handleImageClick, userId);
      placesList.prepend(newCardElement);
      cardFormElement.reset();
      closeModal(cardPopup);
    })
    .catch((err) => {
      console.log(`Ошибка при добавлении карточки: ${err}`);
    })
    .finally(() => {
      renderLoading(false, submitButton, 'Создать');
    });
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  renderLoading(true, submitButton);

  updateUserAvatar({
    avatar: avatarLinkInput.value
  })
    .then(userData => {
      profileImage.style.backgroundImage = `url('${userData.avatar}')`;
      closeModal(avatarPopup);
    })
    .catch((err) => {
      console.log(`Ошибка при обновлении аватара: ${err}`);
    })
    .finally(() => {
      renderLoading(false, submitButton);
    });
}

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cardsData]) => {
    userId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;

    cardsData.forEach(cardData => {
      const cardElement = createCard(cardData, handleDeleteCard, handleLikeCard, handleImageClick, userId);
      placesList.append(cardElement);
    });
  })
  .catch((err) => {
    console.log(`Ошибка при загрузке данных: ${err}`);
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

avatarEditButton.addEventListener('click', () => {
  avatarFormElement.reset();
  clearValidation(avatarFormElement, validationConfig);
  openModal(avatarPopup);
});

profileFormElement.addEventListener('submit', handleProfileFormSubmit);
cardFormElement.addEventListener('submit', handleCardFormSubmit);
avatarFormElement.addEventListener('submit', handleAvatarFormSubmit);

closeButtons.forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});

enableValidation(validationConfig);