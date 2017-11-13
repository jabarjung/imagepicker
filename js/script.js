'use strict';
(function() {
  const dom = document.querySelector('.searchResults');
  const divPastSelections = document.querySelector('.pastSelections');
  const apiLocation = 'https://api.unsplash.com/';
  const appID =
    '168eb60857bcabe273a4b3fa67d8fb5a62e50f8dc39e0604e8443d00d6c963cf';
  const apiSecret =
    'ed02bb81fc67a17e13c5118ae29fa3954daaa3a7511a4905743e99ba80650893';
  const pageNo = '1';
  const itemsPerPage = '20';
  let state = {};
  // Retrieve the images from local storage if any present
  if (localStorage.length > 0) {
    let pastSelectionsHeading = document.createElement('h6');
    pastSelectionsHeading.setAttribute('id', 'pastSelectionsHeading');
    let pastSelectionsHeadingTextNode = document.createTextNode(
      'All of the past selections are listed at the bottom',
    );
    pastSelectionsHeading.appendChild(pastSelectionsHeadingTextNode);
    document
      .querySelector('.pastSelectionsText')
      .appendChild(pastSelectionsHeading);
  }
  var i;
  for (i = 0; i < localStorage.length; i++) {
    let thumbDiv = document.createElement('div');
    thumbDiv.setAttribute('class', 'pastSelectionShown');
    let thumbImg = document.createElement('img');
    thumbImg.setAttribute('src', localStorage.getItem(i.toString()));
    thumbImg.setAttribute('alt', 'Past selection for background');
    thumbDiv.appendChild(thumbImg);
    divPastSelections.appendChild(thumbDiv);
  }
  // Listen for the event when the user clicks on the 'Search' button
  document.querySelector('.queryButton').addEventListener(
    'click',
    function(e) {
      e.preventDefault();
      // Clearing the previous search results.
      document.body.style.backgroundImage = 'None';
      if (document.getElementById('clickTextHeading')) {
        var clickTH = document.getElementById('clickTextHeading');
        clickTH.parentNode.removeChild(clickTH);
      }
      if (document.querySelector('.searchResults')) {
        document.querySelector('.searchResults').textContent = '';
      }
      if (document.querySelectorAll('.searchResults div')) {
        document.querySelectorAll('.searchResults div').forEach(function(e) {
          dom.removeChild(e);
        });
      }
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
    // Clearing up the past selections
    if (document.getElementById('pastSelectionsHeading')) {
      var pSHeading = document.getElementById('pastSelectionsHeading');
      pSHeading.parentNode.removeChild(pSHeading);
    }
    if (document.querySelectorAll('.pastSelections div')) {
      document.querySelectorAll('.pastSelections div').forEach(function(e) {
        divPastSelections.removeChild(e);
      });
    }
    // Finished clearing up the past selections
    let clickTextHeading = document.createElement('h6');
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
      imgImg.setAttribute('alt', state.returnedImageFull); // To use as a background image if the image is clicked. It's a full version of the image.
      imgDiv.appendChild(imgImg);
      dom.appendChild(imgDiv);
    }
    document.querySelectorAll('.imageShown').forEach(function(e) {
      e.addEventListener('click', setBackground, false);
    });
  }
  function setBackground(imageDiv) {
    // Clearing up the page
    if (document.getElementById('clickTextHeading')) {
      var clickTH = document.getElementById('clickTextHeading');
      clickTH.parentNode.removeChild(clickTH);
    }
    if (document.querySelectorAll('.searchResults div')) {
      document.querySelectorAll('.searchResults div').forEach(function(e) {
        dom.removeChild(e);
      });
    }
    // Finished clearing up the page
    document.body.style.backgroundImage =
      'url(' + imageDiv.target.getAttribute('alt') + ')';
    // Add the respective thumbnail to the local storage.
    localStorage.setItem(
      localStorage.length.toString(),
      imageDiv.target.getAttribute('src'),
    );
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundPosition = 'center center';
    document.body.style.backgroundSize = 'cover'; // To scale the image to cover the screen fully
    // document.body.style.backgroundSize = 'contain'; // To fit the image fully
  }
  function failedResponse() {
    if (document.getElementById('clickTextHeading')) {
      var clickTH = document.getElementById('clickTextHeading');
      clickTH.parentNode.removeChild(clickTH);
    }
    document.querySelector('.searchResults').textContent =
      'Your query did not return any results. Please try a different one.';
  }
})();
