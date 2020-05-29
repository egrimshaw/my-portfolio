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
 * Adds a random greeting to the page.
 */
function addRandomFact() {
  const facts =
      ['I have four baby teeth I cannot lose.', 'My favorite breakfast is oatmeal.', 'I am scared of heights.',
       'I am learning to bake.', 'I have watched Greys Anatomy all the way through at least five times.', 
       'I love dark chocolate.'];

  // Pick a random greeting.
  var fact = facts[Math.floor(Math.random() * facts.length)];

  // Add it to the page.
  const factContainer = document.getElementById('fact-container');
  while (factContainer.innerHTML === fact){
    fact = facts[Math.floor(Math.random() * facts.length)];
  }
  factContainer.innerText = fact;
}

function addNavBar(){
    let template = document.getElementById('nav-bar');
    console.log(template);
    let templateContent = document.importNode(template.content, true);
    document.body.prepend(templateContent);
}
