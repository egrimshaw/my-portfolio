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
  const facts =
      ['I have four baby teeth I cannot lose.', 'My favorite breakfast is oatmeal.', 'I am scared of heights.',
       'I am learning to bake.', 'I have watched Greys Anatomy all the way through at least five times.', 
       'I love dark chocolate.'];

  // Pick a random fact.
  var fact = facts[Math.floor(Math.random() * facts.length)];

  // Ensure that the same fact isn't repeated. 
  const factContainer = document.getElementById('fact-container');
  while (factContainer.innerHTML === fact){
    fact = facts[Math.floor(Math.random() * facts.length)];
  }
 
  //Add to page.
  factContainer.innerText = fact;
}

//Add nav bar to each page
function addNavBar(){
    //Get the template from the HTML file.
    let template = document.getElementById('nav-bar');
    //Add to top of page. 
    let templateContent = document.importNode(template.content, true);
    document.body.prepend(templateContent);
}

function addHello(){
    fetch('/data').then(response => response.text()).then(response =>
    response.replace("<h1>", ' '). replace("</h1>", ' ')).then((greeting) =>
    {document.getElementById('hello-container').innerText = greeting; 
    });
}
