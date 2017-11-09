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
      // Clearing the previous search results.
      if (document.getElementById('clickTextHeading')) {
        var clickTH = document.getElementById('clickTextHeading');
        clickTH.parentNode.removeChild(clickTH);
      }
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
    let clickTextHeading = document.createElement('h5');
    clickTextHeading.setAttribute('id', 'clickTextHeading');
    let clickTextNode = document.createTextNode(
      'Click on any image below to set it as the background.',
    );
    clickTextHeading.appendChild(clickTextNode);
    document.querySelector('.clickText').appendChild(clickTextHeading);
    for (var i = 0; i < parseInt(itemsPerPage); i++) {
      //Assuming there are at least 20 search results. Secondly I am only displaying 20 results on the web page.
      state = {
        returnedImageThumb: response.results[i].urls.thumb,
        returnedImageFull: response.results[i].urls.full,
      };
      let imgDiv = document.createElement('div');
      imgDiv.setAttribute('class', 'imageShown');
      let imgImg = document.createElement('img');
      imgImg.setAttribute('src', state.returnedImageThumb);
      imgImg.setAttribute('alt', state.returnedImageFull); // To use as a background image if the image is clicked.
      // imgImg.setAttribute('alt', 'Unsplash Image');
      imgDiv.appendChild(imgImg);
      dom.appendChild(imgDiv);
    }
    document.querySelectorAll('.imageShown').forEach(function(e) {
      e.addEventListener('click', setBackground, false);
    });
  }
  function setBackground(imageDiv) {
    let testDiv = document.createElement('div');
    testDiv.setAttribute('class', 'imageb');
    let imgb = document.createElement('img');
    imgb.setAttribute('src', imageDiv.target.getAttribute('alt')); // 'imageDiv.target.src' works as well but this is more formal.
    imgb.setAttribute('alt', 'B Image');
    testDiv.appendChild(imgb);
    dom.appendChild(testDiv);
  }
  function failedResponse() {
    document.querySelector('.searchResults').textContent =
      'Error processing your request.';
  }
})();
