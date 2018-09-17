'use strict';
(function() {
  const dom = document.querySelector('.searchResults');
  const divPastSelections = document.querySelector('.pastSelections');
  const apiLocation = 'https://api.unsplash.com/';
  const appID =
    '<put appID here>';
  const apiSecret =
    '<put apiSecret here>';
  const pageNo = '1';
  const itemsPerPage = '20';
  let state = {};
  // Insta Filter function
  function applyInstaFilter(imageSource, whichFilterToApply) {
    var canvas = document.createElement('canvas');
    canvas.width = imageSource.width;
    canvas.height = imageSource.height;
    var context = canvas.getContext('2d');
    context.drawImage(imageSource, 0, 0);
    imageSource.style.display = 'none';
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    var original = function() {
      // Do nothing
      // Empty function
    };
    var grayscale = function() {
      for (var i = 0; i < data.length; i += 4) {
        var average = (data[i] + data[i+1] + data[i+2])/3;
        data[i] = average; // Red
        data[i+1] = average; // Green
        data[i+2] = average; // Blue
      }
      /*
      for (var i = 0; i < data.length; i += 4) {
        var red = data[i];
        var green = data[i+1];
        var blue = data[i+2];
        var valueToSet = 0.2126*red + 0.7152*green + 0.0722*blue;
        data[i] = data[i+1] = data[i+2] = valueToSet;
      }
      */
      context.putImageData(imageData, 0, 0);
    };
    var invert = function() { // Also called 'negaposi'
      for (var i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];     // Red
        data[i+1] = 255 - data[i+1]; // Green
        data[i+2] = 255 - data[i+2]; // Blue
      }
      context.putImageData(imageData, 0, 0);
    };
    var enhance = function() {
      for (var i = 0; i < data.length; i += 4) {
        data[i] = data[i]*1.24;     // Red
        data[i+1] = data[i+1]*1.33; // Green
        data[i+2] = data[i+2]*1.21; // Blue
      }
      context.putImageData(imageData, 0, 0);
    };
    var sepia = function() {
      for (var i = 0; i < data.length; i += 4) {
        data[i] = data[i] * 1.07; // Red
        data[i+1] = data[i+1] * 0.74; // Green
        data[i+2] = data[i+2] * 0.43; // Blue
      }
      context.putImageData(imageData, 0, 0);
    };
    var opacity = function() {
      const val = 0.5; // Using a default value.
      for (var i = 0; i < data.length; i += 4) {
        data[i+3] = data[i+3] * val; // Opacity
      }
      context.putImageData(imageData, 0, 0);
    };
    var brighten = function() {
      const val = 50; // Using a default value.
      for (var i = 0; i < data.length; i += 4) {
        data[i] += val; // Red
        data[i+1] += val; // Green
        data[i+2] += val; // Blue
      }
      context.putImageData(imageData, 0, 0);
    };
    var darken = function() {
      const val = 50; // Using a default value.
      for (var i = 0; i < data.length; i += 4) {
        data[i] -= val; // Red
        data[i+1] -= val; // Green
        data[i+2] -= val; // Blue
      }
      context.putImageData(imageData, 0, 0);
    };
    eval(whichFilterToApply.valueOf().concat('()')); // This way I won't have to write 'if else' blocks.
    return canvas.toDataURL();
  };
  // Finished Instagram-like filter
  // Retrieve the images from local storage if any present
  if (localStorage.length > 0) {
    let pastSelectionsHeading = document.createElement('h6');
    pastSelectionsHeading.setAttribute('id', 'pastSelectionsHeading');
    let pastSelectionsHeadingTextNode = document.createTextNode(
      'All of the past selections are listed at the bottom',
    );
    pastSelectionsHeading.appendChild(pastSelectionsHeadingTextNode);
    document.querySelector('.pastSelectionsText').appendChild(pastSelectionsHeading);
  }
  for (var i = 0; i < localStorage.length; i++) {
    if (!(localStorage.key(i).includes('_fullSizeImage'))) {
      let thumbDiv = document.createElement('div');
      thumbDiv.setAttribute('class', 'pastSelectionShown');
      let thumbImg = document.createElement('img');
      thumbImg.setAttribute('src', localStorage.getItem(localStorage.key(i))); // i.toString() also works.
      thumbImg.setAttribute('alt', 'Past selection for background');
      thumbDiv.appendChild(thumbImg);
      divPastSelections.appendChild(thumbDiv);
    }
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
    document.querySelector('.pastSelectionsText').textContent = '';
    let clickTextHeading = document.createElement('h6');
    clickTextHeading.setAttribute('id', 'clickTextHeading');
    let clickTextNode = document.createTextNode(
      'Click on any image below to set it as the background. (Scroll to the right for more)',
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
    // Add the full size image to the local storage in order to process the filters on it.
    localStorage.setItem(localStorage.length.toString().concat('_fullSizeImage'),
      imageDiv.target.getAttribute('alt'),
    );
    // Retrieving the full size image from the local local storage.
    var imageSource = new Image();
    var filteredImage = new Image();
    var whichFilterToApply = '';
    // Asking user for an input
    var dialogBox = document.getElementById('dialog');
    var originalB = document.getElementById('original');
    var grayscaleB = document.getElementById('grayscale');
    var invertB = document.getElementById('invert');
    var enhanceB = document.getElementById('enhance');
    var sepiaB = document.getElementById('sepia');
    var opacityB = document.getElementById('opacity');
    var brightenB = document.getElementById('brighten');
    var darkenB = document.getElementById('darken');
    originalB.addEventListener('click', setFilterValue);
    grayscaleB.addEventListener('click', setFilterValue);
    invertB.addEventListener('click', setFilterValue);
    enhanceB.addEventListener('click', setFilterValue);
    sepiaB.addEventListener('click', setFilterValue);
    opacityB.addEventListener('click', setFilterValue);
    brightenB.addEventListener('click', setFilterValue);
    darkenB.addEventListener('click', setFilterValue);
    dialogBox.showModal();
    function setFilterValue() {
      whichFilterToApply = this.value.toLowerCase();
      dialogBox.close();
    };
    // Finished asking user for an input
    document.querySelectorAll('[type=button]').forEach(function(e) {
      e.addEventListener('click', buttonClicked);
    });
    function buttonClicked() {
      var imageSourceString = (localStorage.length-1).toString().concat('_fullSizeImage');
      imageSource.src = localStorage.getItem(imageSourceString);
      imageSource.crossOrigin = "Anonymous";
      imageSource.onload = function() {
        // Filter method call
        filteredImage.src = applyInstaFilter(this, whichFilterToApply);
      };
      filteredImage.onload = function() {
        document.body.style.backgroundImage = 'url(' + filteredImage.src + ')';
      };
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
}
  function failedResponse() {
    if (document.getElementById('clickTextHeading')) {
      var clickTH = document.getElementById('clickTextHeading');
      clickTH.parentNode.removeChild(clickTH);
    }
    document.querySelector('.pastSelectionsText').textContent =
      'Your query did not return any results. Please try a different one.';
  }
})();
