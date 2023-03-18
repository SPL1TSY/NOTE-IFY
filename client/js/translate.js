// Load the translations for the selected language
function loadTranslations(lang) {
  return fetch(`./translations/${lang}.json`)
    .then(res => res.json());
}

// Translate all elements with a data-lang attribute
function translateElements(translations) {
  const elements = document.querySelectorAll('[data-lang]');
  elements.forEach(element => {
    const key = element.getAttribute('data-lang');
    const translation = translations[key];
    if (translation) {
      element.textContent = translation;
    }
  });
}

// Add event listener for language selection
const languageSelect = document.getElementById('language-select');
languageSelect.addEventListener('change', (event) => {
  const lang = event.target.value;
  currLang = lang;
  callTranslate(lang);
});

// Load the translations and translate all elements on page load

// function for calling loadtranslations and then applying it to make the code more dry
function callTranslate(lang) {  
  loadTranslations(lang)
  .then(translateElements)
  .catch(err => console.error(err));
}

callTranslate("en");
