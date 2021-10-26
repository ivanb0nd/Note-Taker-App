const textArea = document.querySelector('#form__textarea');
const formButtons = document.querySelectorAll('.form-btn');
const noteContainer = document.querySelector('.notes-container');
const notesContainer = document.querySelector('.notes-container');
const popupContainer = document.querySelector('.popup-container');

let viewAllButtons;
let globalNumberID = 0;

document.addEventListener('DOMContentLoaded', getNotes);
//Functions

function addNote() {
  const fullNoteText = textArea.value;
  const shortNoteText = reductionString(fullNoteText);

  if (fullNoteText !== '' && !/^\s+/.test(fullNoteText) || /\s+\w+/.test(fullNoteText)) {
    //Increase total amount of notes
    globalNumberID++;

    //Generate note ID variable
    const noteID = 'note-' + globalNumberID;

    //Create note-item
    const noteItem = document.createElement('div');
    noteItem.classList.add('note', 'grid-elem');
    noteItem.id = noteID;
    notesContainer.appendChild(noteItem);

    //Create note text
    const noteText = document.createElement('p');
    noteText.classList.add('note__text');
    noteText.innerText = shortNoteText;
    noteItem.appendChild(noteText);

    //Create view all button
    const viewAllButton = document.createElement('button');
    viewAllButton.classList.add('btn', 'btn-primary', 'btn-all', 'note__btn');
    viewAllButton.innerText = 'View All';
    noteItem.appendChild(viewAllButton);

    //Create popup
    addPopup(fullNoteText, noteID);

    //Updating viewAllButtons variable
    viewAllButtons = document.querySelectorAll('.btn-all');
    //Add events to all buttons
    viewAllButtons.forEach(function (btn) {
      btn.addEventListener('click', openPopup);
    });

    clearTextArea();

    //Add note in localStorage
    saveLocalStorage(fullNoteText, noteID);

  } else {
    alert('Empty string');
  }
}

function addPopup(noteText, noteID) {

  //Create popup-body
  const popupBody = document.createElement('div');
  popupBody.classList.add('popup__body');
  popupContainer.appendChild(popupBody);

  //Create popup
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.dataset.id = noteID;
  popupBody.appendChild(popup);

  //Create popup text
  const popupText = document.createElement('p');
  popupText.classList.add('popup__text');
  popupText.innerText = noteText;
  popup.appendChild(popupText);

  //Create buttons container
  const buttonsPopupContainer = document.createElement('div');
  buttonsPopupContainer.classList.add('popup__buttons');
  popup.appendChild(buttonsPopupContainer);

  //Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn', 'btn-danger', 'btn-delete', 'popup-btn');
  deleteButton.innerText = 'Delete';
  buttonsPopupContainer.appendChild(deleteButton);
  deleteButton.addEventListener('click', deleteNote);

  //Create back button
  const backButton = document.createElement('button');
  backButton.classList.add('btn', 'btn-secondary', 'btn-back', 'popup-btn');
  backButton.innerText = 'Back';
  buttonsPopupContainer.appendChild(backButton);
  backButton.addEventListener('click', closePopup);


}

function reductionString(str) {
  const amoutCharacters = 200;
  let shortString;

  if (str.length > amoutCharacters) {
    shortString = str.slice(0, amoutCharacters) + '...';
  } else {
    shortString = str;
  }

  return shortString;
}

function clearTextArea() {
  textArea.value = '';
}

function deleteNote() {
  let el = this;
  const currentPopup = el.parentElement.parentElement;
  const noteID = currentPopup.dataset.id;
  const noteList = notesContainer.children;

  let currentNote;

  for (let note of noteList) {
    if (note.id === noteID) {
      currentNote = note;
    }
  }

  document.body.classList.remove('modal-open');
  popupContainer.classList.remove('active');
  currentPopup.parentElement.classList.remove('visible');
  currentPopup.classList.remove('visible');

  removeLocalNotes(noteID);

  currentPopup.remove();
  currentNote.remove();


}

function closePopup() {
  let el = this;
  const currentPopup = el.parentElement.parentElement;

  document.body.classList.remove('modal-open');
  popupContainer.classList.remove('active');
  currentPopup.parentElement.classList.remove('visible');
  currentPopup.classList.remove('visible');
}

function openPopup() {
  const currentNote = this.parentElement;
  const currentNoteID = currentNote.id;
  const popupsList = document.querySelectorAll('.popup');

  let currentPopup;

  for (let popup of popupsList) {
    if (popup.dataset.id === currentNoteID) {
      currentPopup = popup;
    }
  }

  document.body.classList.add('modal-open');
  popupContainer.classList.add('active');
  currentPopup.parentElement.classList.add('visible');
  currentPopup.classList.add('visible');
}

function getNotes() {
  let notes;

  if (localStorage.getItem('notes') === null) {
    notes = [];
  } else {
    notes = JSON.parse(localStorage.getItem('notes'));
  }

  notes.forEach(function(note) {
    const fullNoteText = note.noteText;
    const shortNoteText = reductionString(fullNoteText);
    let currentNoteID = note.noteID.match(/\d+/)[0];

    //Setup globalNumberID
    globalNumberID = currentNoteID;

    //Generate note ID variable
    const noteID = 'note-' + currentNoteID;

    //Create note-item
    const noteItem = document.createElement('div');
    noteItem.classList.add('note', 'grid-elem');
    noteItem.id = noteID;
    notesContainer.appendChild(noteItem);

    //Create note text
    const noteText = document.createElement('p');
    noteText.classList.add('note__text');
    noteText.innerText = shortNoteText;
    noteItem.appendChild(noteText);

    //Create view all button
    const viewAllButton = document.createElement('button');
    viewAllButton.classList.add('btn', 'btn-primary', 'btn-all', 'note__btn');
    viewAllButton.innerText = 'View All';
    noteItem.appendChild(viewAllButton);

    //Create popup
    addPopup(fullNoteText, noteID);

    //Updating viewAllButtons variable
    viewAllButtons = document.querySelectorAll('.btn-all');
    //Add events to all buttons
    viewAllButtons.forEach(function (btn) {
      btn.addEventListener('click', openPopup);
    });
  });

}

function saveLocalStorage(noteText, noteID) {
  let notes;
  let note = {
    noteText,
    noteID
  };

  if (localStorage.getItem('notes') === null) {
    notes = [];
  } else {
    notes = JSON.parse(localStorage.getItem('notes'));
  }

  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));
}

function removeLocalNotes(noteID) {
  let notes;
  let noteIndex;

  if (localStorage.getItem('notes') === null) {
    notes = [];
  } else {
    notes = JSON.parse(localStorage.getItem('notes'));
  }

  for (let i = 0; i < notes.length; i++) {
    
    let obj = notes[i];

    for (let key in obj) {
      if (obj[key] === noteID) {
        noteIndex = i;
      }
    }
  }

  notes.splice(noteIndex, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  
}



// Close popup when you click outside the popup

popupContainer.addEventListener('click', function (e) {
  let currentElement = e.target;
  let popupBody;
  let popup;

  if (currentElement.classList.contains('popup-container')) {

    popupBody = currentElement.querySelector('.popup__body');
    popup = popupBody.querySelector('.popup');

    document.body.classList.remove('modal-open');
    currentElement.classList.remove('active');
    popupBody.classList.remove('visible');
    popup.classList.remove('visible');

  } else if (currentElement.classList.contains('popup__body')) {

    popupBody = currentElement;
    popup = popupBody.querySelector('.popup');

    document.body.classList.remove('modal-open');
    popupBody.parentElement.classList.remove('active');
    popupBody.classList.remove('visible');
    popup.classList.remove('visible');

  }
});

formButtons.forEach(function (btn) {

  if (btn.classList.contains('add-btn')) {
    btn.addEventListener('click', addNote);
  }

  if (btn.classList.contains('clear-btn')) {
    btn.addEventListener('click', clearTextArea);
  }
});