'use strict';
(function() {
  const dom = document.querySelector('.searchResults');
  const apiLocation = 'https://api.unsplash.com/';
  const appID =
    '168eb60857bcabe273a4b3fa67d8fb5a62e50f8dc39e0604e8443d00d6c963cf';
  const apiSecret =
    'ed02bb81fc67a17e13c5118ae29fa3954daaa3a7511a4905743e99ba80650893';
  const pageNo = '1';
  const itemsPerPage = '20';
  let state = {};
  // Listen for the event when the user clicks on the 'Search' button
  document.querySelector('.queryButton').addEventListener(
    'click',
    function(e) {
      e.preventDefault();
      // Clear the previous search results.
      document.querySelectorAll('.searchResults div').forEach(function(e) {
        dom.removeChild(e);
      });
      const queryField = document.querySelector('#queryField').value;
      // Empting the search box
      document.querySelector('#queryField').value = '';
      // Getting response from Unsplash
      fetch(
        apiLocation +
          'search/photos/?page=' +
          pageNo +
          '&per_page=' +
          itemsPerPage +
          '&query=' +
          queryField +
          '&client_id=' +
          appID,
      )
        .then(function(response) {
          return response.json();
        })
        .then(function(response) {
          successfulResponse(response);
        })
        .catch(function() {
          failedResponse();
        });
    },
    false,
  );
  function successfulResponse(response) {
    console.log('It works'); // If the request is successful.
    for (var i = 0; i < 20; i++) {
      //Assuming there are atleast 20 search results. Secondly I am only displaying 20 results on a page.
      state = {
        returnedImage: response.results[i].urls.thumb,
      };
      let imgDiv = document.createElement('div');
      imgDiv.setAttribute('class', 'imageShown');
      let imgImg = document.createElement('img');
      imgImg.setAttribute('src', state.returnedImage);
      imgImg.setAttribute('alt', 'Unsplash Image');
      imgDiv.appendChild(imgImg);
      dom.appendChild(imgDiv);
    }
  }
  function failedResponse() {
    console.log("Doesn't work"); // If the request failed.
    document.querySelector('.searchResults').textContent =
      'Error processing your request.';
  }
})();
