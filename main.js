const apiSectionTweetContainer = document.getElementById('apiSectionTweetContainer');
const tweetTemplate = document.getElementById('tweet-template');
const verUsuarioBtn = document.getElementById('verUsuario-btn');
const radioContainer = document.getElementById('radio-container');
const commentTemplate = document.getElementById('comment-template'); 

let userName;
let userEmail;
let user = 1;

const getUserData = async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${user}`);
  const userData = await response.json();
  userName = userData.name;
  userEmail = userData.email;
  const responsePosts = await fetch(`https://jsonplaceholder.typicode.com/users/${userData.id}/posts`);

  const postsData = await responsePosts.json();
  postsData.forEach((postData, indice) => {
    const tweetClone = document.importNode(tweetTemplate.content, true);
    
    tweetClone.querySelector('.nameApi').textContent = userName;
    tweetClone.querySelector('.emailApi').textContent = userEmail;
    tweetClone.querySelector('.titleApi').textContent = postData.title;
    tweetClone.querySelector('.bodyApi').textContent = postData.body;
    tweetClone.querySelector('.comentarios-container').id = `comentarios-container-${indice}`;

    const commentContainer = tweetClone.querySelector('.comment-container');

    commentContainer.id = `comment-${indice}`;

    apiSectionTweetContainer.appendChild(tweetClone);
  })

}

const listUser = () => {
  fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(usersData => {
  
    radioContainer.innerHTML = '';

    usersData.forEach((user, index) => {
      const userId = user.id;
      const radioInput = document.createElement('input');
      const radioLabel = document.createElement('label');

      radioInput.type = 'radio';
      radioInput.className = 'btn-check';
      radioInput.name = 'btnradio';
      radioInput.id = `btnradio${index}`;
      radioInput.autocomplete = 'off';

      radioLabel.className = 'btn btn-outline-primary getUser-btn';
      radioLabel.htmlFor = `btnradio${index}`;
      radioLabel.textContent = `${userId}`;

      radioContainer.appendChild(radioInput);
      radioContainer.appendChild(radioLabel);
    });

    
    const firstRadio = radioContainer.querySelector('input[type="radio"]');
    if (firstRadio) {
      firstRadio.checked = true;
    }
  })
  .catch(error => {
    console.error('Error al cargar los datos desde la API:', error);
  });
}

const changeUser = async () => {
  while (apiSectionTweetContainer.firstChild) {
    apiSectionTweetContainer.removeChild(apiSectionTweetContainer.firstChild);
  }

  await getUserData();
  showComments();
}

const selectUser = (event) => {
  if (event.target && event.target.type === 'radio') {
    const label = document.querySelector(`label[for="${event.target.id}"]`);
    if (label) {
      const labelText = label.textContent;
      user = labelText;
    }
  }      
}

const showComments = () => {

  for( let i = 0 ; i<10;i++ ){
    const button = document.getElementById( `comentarios-container-${i}`);

    button.addEventListener('click', async ()=>{
      const commentContainer = document.getElementById(`comment-${i}`);
      commentContainer.classList.toggle('d-none');
  
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${user}/comments`);
      const comentarios = await response.json();

      comentarios.forEach(commentData => {
        const commentClone = document.importNode(commentTemplate.content, true);

        const nameComentElement = commentClone.querySelector('.nameComent');
        const emailComentElement = commentClone.querySelector('.emailComent');
        const bodyComentElement = commentClone.querySelector('.bodyComent');

        const emailApi = commentData.email;
        const emailSplit = emailApi.split('@');
        const name = emailSplit[0]; 
        const email = `@${emailSplit[1]}`;

        nameComentElement.textContent = name;
        emailComentElement.textContent = email;
        bodyComentElement.textContent = commentData.body;

        commentContainer.appendChild(commentClone);
      })

    })
  }
}



document.addEventListener('DOMContentLoaded', async ()=>{
  await getUserData();
  listUser();
  showComments();
});

verUsuarioBtn.addEventListener('click', changeUser);
radioContainer.addEventListener('change', selectUser);




