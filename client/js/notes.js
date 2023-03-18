const newNoteForm = document.getElementById('new-note-form');
const newNoteInput = document.getElementById('note-content');
const noteList = document.getElementById('note-list');
const favNoteList = document.querySelector("#fav-note-list");

// event for favouriting note
document.addEventListener("click", function (e) {
  // if the click happened on a favourite btn
  if (e.target.classList.contains("btn-fav")) {
    const li = e.target.parentElement; // the List item
    const img = e.target.children[0] // the image element on btn

    // note Id
    const noteId = li.dataset.id;

    // looping over all the notes
    fetchedNotes.forEach(note => {
      // if note id matches to the one that was clicked on for favourite
      if (noteId == note.id) {
        // change it's favourite status and image
        note.favourite = !note.favourite
        if (note.favourite) {
          img.src = "images/star-active.svg"
        } else {
          img.src = "images/star-solid.svg"
        }
        // update db
        fetch(`https://notifly-api-pzft.onrender.com/api/notes/${noteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "Application/json",
            "Authorization": `Bearer ${userToken}`
          },
          body: JSON.stringify({ favourite: note.favourite })
        })
          .then(res => res.json())
          .then(() => fetchNotes()) // after updating fetching new updated notes from DB
      }
    })
  }
})

function createNoteElement(note) {
  const li = document.createElement('li');
  li.setAttribute('data-id', note.id);

  const favBtn = document.createElement("button");
  favBtn.classList.add("btn");
  favBtn.classList.add("btn-fav")
  const favBtnImg = document.createElement("img");
  favBtnImg.src = "images/star-" + (note.favourite ? "active" : "solid") + ".svg"

  favBtn.appendChild(favBtnImg);

  li.appendChild(favBtn);
  const noteText = document.createElement('span');
  noteText.textContent = note.description;
  li.appendChild(noteText);

  const buttonContainer = document.createElement('div');

  const editButton = document.createElement('button');
  editButton.classList.add("mr-1");
  // editButton.textContent = 'Edit'; //editButton.setAttribute('data-lang', 'edit-button'); Find a way to implement this one without bugs..
  editButton.dataset.lang = "edit-button";
  editButton.addEventListener('click', () => {
    editNoteElement(li);
  });
  buttonContainer.appendChild(editButton);

  const deleteButton = document.createElement('button');
  // deleteButton.textContent = 'Delete';
  deleteButton.dataset.lang = "delete-button";
  deleteButton.addEventListener('click', () => {
    deleteNoteElement(li);
  });
  buttonContainer.appendChild(deleteButton);

  callTranslate(currLang);

  li.appendChild(buttonContainer);

  return li;
}

// Function to add a new note to the list and the server
function addNote() {
  const note = newNoteInput.value;
  console.log(note)
  if (note !== '') {
    fetch('https://notifly-api-pzft.onrender.com/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify({ description: note, image: "image.png", favourite: false })
    })
      .then(res => res.text())
      .then(() => {
        newNoteInput.value = '';
        fetchNotes();
      })
      .catch(err => console.error(err));
  } else {
    const errorMsg = document.querySelector('.errorMsg');
    if (errorMsg) {
      errorMsg.remove();
    }
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorMsg');
    errorContainer.textContent = 'You have to write a note before you can add it.';
    noteList.appendChild(errorContainer);
  }
}

// Function to delete a note from the list and the server
function deleteNoteElement(noteElement) {
  const id = noteElement.getAttribute('data-id');
  fetch(`https://notifly-api-pzft.onrender.com/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "Application/json",
      "Authorization": `Bearer ${userToken}`
    }
  })
    .then(res => res.text())
    .then(() => {
      noteElement.remove();
    })
    .catch(err => console.error(err));
}

function editNoteElement(noteElement) {
  const id = noteElement.getAttribute('data-id');
  // removing the edit and delete button beforehand
  noteElement.querySelectorAll('button').forEach(button => button.remove());
  const noteText = noteElement.textContent;
  // getting the note that is being edited
  const editingNote = fetchedNotes.find(note => note.id == id);

  // making the favourites button anew
  const favBtn = document.createElement("button");
  favBtn.classList.add("btn");
  favBtn.classList.add("btn-fav")
  const favBtnImg = document.createElement("img");

  favBtnImg.src = "images/star-" + (editingNote.favourite ? "active" : "solid") + ".svg";
  favBtn.appendChild(favBtnImg);

  // Create an input field with the current note as the default value
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('value', noteText);

  // Replace the text with the input field
  noteElement.textContent = '';
  noteElement.appendChild(input);

  // making the Edit and delete button anew and then appending them to buttonContainer
  const buttonContainer = document.createElement('div');
  const span = document.createElement("span");
  span.textContent = noteText;
  const editButton = document.createElement('button');
  editButton.classList.add("mr-1")

  editButton.dataset.lang = "edit-button"; // this will determine which language to show for every button like this
  // not setting their text now, will set them by calling the translator function!
  editButton.addEventListener('click', () => {
    editNoteElement(noteElement);
  });
  buttonContainer.appendChild(editButton);
  const deleteButton = document.createElement('button');
  deleteButton.dataset.lang = "delete-button";
  // not setting their text now, will set them by calling the translator function!
  deleteButton.addEventListener('click', () => {
    deleteNoteElement(noteElement);
  });
  buttonContainer.appendChild(deleteButton);

  // setting the text to buttons by calling translate function throught the line below
  // callTranslate(currLang)

  // Add a 'Save' button to save the edited note
  const saveButton = document.createElement('button');
  saveButton.classList.add("mr-1")
  saveButton.dataset.lang = "save-button";

  // event for saving content
  saveButton.addEventListener('click', () => {
    const note = input.value;
    saveButton.disabled = true;
    fetch(`https://notifly-api-pzft.onrender.com/api/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ description: note })
    })
      .then(res => res.text())
      .then(() => {

        noteElement.textContent = ""

        // setting the text for buttons by calling this
        callTranslate(currLang);

        // adding the elements
        noteElement.appendChild(favBtn);

        noteElement.appendChild(span);

        noteElement.appendChild(buttonContainer);
      })
      .catch(err => console.error(err));
  });

  // Add a 'Cancel' button to cancel the edit
  const cancelButton = document.createElement('button');
  cancelButton.dataset.lang = "cancel-button";

  cancelButton.addEventListener('click', () => {
    noteElement.textContent = ""
    // setting the text for buttons by calling this
    callTranslate(currLang);

    // adding the elements
    noteElement.appendChild(favBtn);
    noteElement.appendChild(span);
    noteElement.appendChild(buttonContainer);
  });

  // setting the text for save and cancel button! :D
  callTranslate(currLang);


  // Add the save and cancel buttons to the note element
  noteElement.appendChild(saveButton);
  noteElement.appendChild(cancelButton);
}

// Function to fetch all notes from the server and display them in the UI
function fetchNotes() {
  fetch('https://notifly-api-pzft.onrender.com/api/notes', {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${userToken}`
    }
  })
    .then(res => res.json())
    .then(notes => {
      console.log(notes)
      noteList.innerHTML = '';
      fetchedNotes = notes.data;
      // add fav notes after fetching is successful
      addFavNotes(notes.data)
      notes.data.forEach((note) => {
        const noteElement = createNoteElement(note);
        noteList.appendChild(noteElement);
      });
    })
    .catch(err => console.error(err));
}

function addFavNotes(allNotes) {
  if (allNotes[0]) {
    favNoteList.textContent = "";
    const favNotes = allNotes.filter(note => note.favourite);
    favNotes[0] && favNotes.forEach(note => {
      const li = createNoteElement(note);
      favNoteList.appendChild(li);
    })
  }
}
// Add event listener for new note form submission
newNoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const errorMsg = document.querySelector('.errorMsg');
  if (errorMsg) {
    errorMsg.remove();
  }
  if (!userToken) {
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('errorMsg');
    errorContainer.textContent = 'You have to Login or Register first';
    noteList.appendChild(errorContainer);
    return;
  }
  addNote();
});

// Fetch all notes on page load
fetchNotes();