// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random fact to the page.
 */
function addRandomFact() {
  const facts = [
    'I have four baby teeth I cannot lose.',
    'My favorite breakfast is oatmeal.', 'I am scared of heights.',
    'I am learning to bake.',
    'I have watched Greys Anatomy all the way through at least five times.',
    'I love dark chocolate.'
  ];

  // Pick a random fact.
  var fact = facts[Math.floor(Math.random() * facts.length)];

  // Ensure that the same fact isn't repeated.
  const factContainer = document.getElementById('fact-container');
  while (factContainer.innerHTML === fact) {
    fact = facts[Math.floor(Math.random() * facts.length)];
  }

  // Add to page.
  factContainer.innerText = fact;
}

// Add nav bar to each page
function addNavBar() {
  // Get the template from the HTML file.
  let template = document.getElementById('nav-bar');
  // Add to top of page.
  let templateContent = document.importNode(template.content, true);
  document.body.prepend(templateContent);
}

function createList(text) {
  const liElement = document.createElement('li');
  liElement.innerText = text;
  return liElement;
}

/* This function is called upon clicking submit limit. It will set the limit for
the max number of comments and save it in the session storage. */
function loadComments() {
  numberComments = document.getElementById('max').value;
  sessionStorage.setItem('limit', numberComments);
}

/*This function is called when refreshing the page. It fetches the comments up to the max amount
determined by the max stored in session storage. It also determines whether the user is logged in 
or not and displays either a log out or log in link at the bottom of the page. */
function loadAllComments(){
    var loginStatus;
    loginStatus = fetch("/login").then(response => (response.json())).then((arrayString) => {
        loginStatus = arrayString; //get login status 
    }).then(() =>{
        if (loginStatus === "logout"){
            const commentElement = document.getElementById('login-container');
            const liTag = document.createElement('li');
            const aTag = document.createElement('a');
            aTag.appendChild(document.createTextNode("Click here to login."));
            aTag.href = "/loginPage"; //link to login
            liTag.innerText = "login";
            commentElement.appendChild(aTag);
        } else {
            const commentElement = document.getElementById('login-container');
            const liTag = document.createElement('li');
            const aTag = document.createElement('a');
            aTag.appendChild(document.createTextNode("Click here to logout."));
            aTag.href = "/loginPage"; //link to log out
            liTag.innerText = "logout";
            commentElement.appendChild(aTag);
            document.getElementById('commentForm').style.display = "block"; //display the add comment
            //form because they are logged in 
        }
 });
   
    const url = "/load?numComments="+sessionStorage.getItem("limit"); //print max number of comments
    fetch(url).then(response => response.json()).then((arrayString) =>
    {
        const commentElement = document.getElementById('comment-container');
        var olTag = document.createElement('ol');
        var i;
        for (i = 0; i < arrayString.length; i++){
            const oneComment = document.createElement('li');
            oneComment.className = 'comment';

            const titleElement = document.createElement('span');
            var commentCombined = "\"" + arrayString[i].comment + "\" -" + 
                arrayString[i].commentName; 
            titleElement.innerText = commentCombined;

            const deleteButtonElement = document.createElement('button');
            deleteButtonElement.setAttribute('style', "margin: 10px");
            deleteButtonElement.innerText = 'Delete Comment';
            var commentToDelete = arrayString[i];
            deleteButtonElement.addEventListener('click', () => {

                deleteOneComment(commentToDelete);

                oneComment.remove();
            });

        oneComment.appendChild(titleElement);
        oneComment.appendChild(deleteButtonElement);
        olTag.appendChild(oneComment);
    }
    commentElement.appendChild(olTag);
  })
}

// This function deletes all comments.
function deleteAllComments() {
  fetch('/delete-data-all', {method: 'POST'}).then(response => {
    const commentElement = document.getElementById('comment-container');
    commentElement.innerHTML = '';
  });
}

// This function deletes one comment.
function deleteOneComment(commentToDelete) {
  const params = new URLSearchParams();
  params.append('id', commentToDelete.id);
  fetch('/delete-data-individual', {method: 'POST', body: params});
}
