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

/*This function is called when refreshing the page. It fetches the comments up
to the max amount determined by the max stored in session storage. It also
determines whether the user is logged in
or not and displays either a log out or log in link at the bottom of the page.
*/
function loadAllComments() {
  var loginStatus;
  loginStatus =
      fetch('/login')
          .then(response => (response.json()))
          .then((arrayString) => {
            loginStatus = arrayString;  // get login status
          })
          .then(() => {
            if (loginStatus === 'logout') {
              const commentElement = document.getElementById('login-container');
              const liTag = document.createElement('li');
              const aTag = document.createElement('a');
              aTag.appendChild(document.createTextNode('Click here to login.'));
              aTag.href = '/loginPage';  // link to login
              liTag.innerText = 'login';
              commentElement.appendChild(aTag);
            } else {
              const commentElement = document.getElementById('login-container');
              const liTag = document.createElement('li');
              const aTag = document.createElement('a');
              aTag.appendChild(
                  document.createTextNode('Click here to logout.'));
              aTag.href = '/loginPage';  // link to log out
              liTag.innerText = 'logout';
              commentElement.appendChild(aTag);
              document.getElementById('commentForm').style.display =
                  'block';  // display the add comment
              // form because they are logged in
            }
          });

  const url = '/load?numComments=' +
      sessionStorage.getItem('limit');  // print max number of comments
  fetch(url).then(response => response.json()).then((arrayString) => {
    const commentElement = document.getElementById('comment-container');
    var olTag = document.createElement('ol');
    var i;
    for (i = 0; i < arrayString.length; i++) {
      const oneComment = document.createElement('li');
      oneComment.className = 'comment';

      const titleElement = document.createElement('span');
      var commentCombined =
          '"' + arrayString[i].comment + '" -' + arrayString[i].commentName;
      titleElement.innerText = commentCombined;
      console.log('hi' + commentCombined);

      const deleteButtonElement = document.createElement('button');
      deleteButtonElement.setAttribute('style', 'margin: 10px');
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


google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {

  fetch('/chocolateData')
      .then(response => response.json())
      .then((chocolateVotes) => {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Chocolate');
        data.addColumn('number', 'Votes');
        Object.keys(chocolateVotes).forEach((chocolate) => {
          data.addRow([chocolate, chocolateVotes[chocolate]]);
        });

        const options = {
          'title': 'Favorite Kind of Chocolate',
          'width': 600,
          'height': 500,
        };

        const chart = new google.visualization.ColumnChart(
            document.getElementById('chart-container'));
        chart.draw(data, options);
      });
}

function deleteAllChocolate() {
  fetch('/delete-data-chocolate', {method: 'POST'}).then(response => {
    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Chocolate');
    data.addColumn('number', 'Votes');
    const options = {
      'title': 'Favorite Kind of Chocolate',
      'width': 600,
      'height': 500,
    };
    const chart = new google.visualization.ColumnChart(
        document.getElementById('chart-container'));
    chart.draw(data, options);
  });
}

function createMap(){
    const map = new google.maps.Map(
      document.getElementById('map'),
      {center: {lat: 42.3736, lng: -71.1097}, zoom: 16});
    
    var darwinsContent = '<p> I have been ordering sandwiches from Darwins for 14 years. At one point, I was ordering two sandwiches' +
                         ' from them a day! My favorite is the Rindge or the Memorial on a wrap. To learn more and see their menu, visit their webiste:' +
                         '<a href = "https://www.darwinsltd.com/"> https://www.darwinsltd.com/ </a>'; 

    var darwinsInfoWindow = new google.maps.InfoWindow({
        content: darwinsContent
    });
    
    var darwinsMarker = new google.maps.Marker({
        position: {lat: 42.3740, lng: -71.1251},
        map: map, 
        title: 'Favorite sandwich shop!'
    });

    darwinsMarker.addListener('click', function(){
        darwinsInfoWindow.open(map, darwinsMarker);
    });

    var jpContent = '<p> Whenever my brother is in town from NYC, we go to JP Licks every night. My favorite flavor is Brownie Brownie Batter or ' + 
                    'Black Raspberry with gummy bears on top. I also recently discovered their cookiewiches, which are super yummy. Visit their website ' +
                    'to see all of their cool flavors, cakes and frappes: <a href = "https://jplicks.com/#ice-cream"> https://jplicks.com/#ice-cream </a>';

    var jpInfoWindow = new google.maps.InfoWindow({
        content: jpContent
    });

    var jpMarker = new google.maps.Marker({
        position: {lat: 42.3729, lng: -71.1176}, 
        map: map,
        title: 'Favorite ice cream shop!'
    });

    jpMarker.addListener('click', function(){
        jpInfoWindow.open(map, jpMarker);
    });

    var flourContent = '<p> Flour Bakery opened in Harvard Square a few years ago and I have been obsessed ever since. My go to order is a chopped greek salad ' +
                       'with a chocolate muffin on the side. I wrote a profile for an english project in high school on the founder, Joanne Chang! To see all of their ' +
                       'yummy pastries, visit their website: <a href = "https://flourbakery.com/"> https://flourbakery.com/ </a>';

    var flourInfoWindow = new google.maps.InfoWindow({
        content: flourContent
    });

    var flourMarker = new google.maps.Marker({
        position: {lat: 42.373538, lng: -71.118957}, 
        map: map,
        title: 'Favorite bakery!'
    });

    flourMarker.addListener('click', function(){
        flourInfoWindow.open(map, flourMarker);
    });
}