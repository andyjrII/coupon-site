$(document).ready(function () {
  let selectedLocation = null;
  let userId = null; // Store the userId after details submission

  // Initialize the map
  const map = L.map('map').setView([9.082, 8.6753], 6); // Center map on Nigeria
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Allowed locations
  const allowedLocations = [
    { name: 'Lagos', coords: [6.5244, 3.3792] },
    { name: 'Abuja', coords: [9.0765, 7.3986] },
    { name: 'Port Harcourt', coords: [4.8156, 7.0498] },
  ];

  // Add markers and handle selection
  allowedLocations.forEach((location) => {
    const marker = L.marker(location.coords)
      .addTo(map)
      .bindPopup(location.name);

    marker.on('click', () => {
      selectedLocation = location.name;
      $('#location').val(selectedLocation);
      $('#location').text(`${selectedLocation}`);
      enableSubmitButton();
    });
  });

  // Enable submit button if the form and location are filled
  function enableSubmitButton() {
    const formValid =
      $('#name').val() &&
      $('#email').val() &&
      $('#phone').val() &&
      $('#location').val();
    if (formValid) {
      $('#form-submit').prop('disabled', false);
    }
  }

  // Attach keyup and change event to the form fields to enable submit button
  $('#details-form input').on('keyup change', enableSubmitButton);

  // Handle form submission
  $('#details-form').submit(function (e) {
    e.preventDefault();
    const userDetails = {
      name: $('#name').val(),
      email: $('#email').val(),
      phone: $('#phone').val(),
      location: selectedLocation,
    };

    // Submit form data via AJAX
    $.ajax({
      type: 'POST',
      url: '/submit-details', // Define this route on the backend
      data: userDetails,
      success: function (response) {
        if (response.success) {
          userId = response.user.id; // Save the userId for later use

          // Show success alert
          alert('Details submitted successfully!');

          // Show coupon div and scroll to it
          $('#coupon-title').removeClass('hidden');
          $('#coupon-div').removeClass('hidden');
          $('html, body').animate(
            {
              scrollTop: $('#coupon-title').offset().top,
            },
            1000
          );
        } else {
          alert('A user with this email already exists.');
        }
      },
      error: function (error) {
        alert(
          'An error occurred while submitting your details. Please try again.'
        );
        console.error('Error submitting form:', error);
      },
    });
  });

  // Door Animation and Popup
  $('.door').on('click', function () {
    if (!userId) {
      alert('Please submit your details before selecting a door.');
      return;
    }

    const $door = $(this); // Get the clicked door element
    const doorNumber = $(this).data('door-id');
    const img = $door.find('img'); // Get the image inside the door div

    // Zoom in effect
    $door.addClass('clicked');

    // Change image to the door-opening gif
    img.attr('src', '/images/door-opening.gif');

    // After 4 seconds (4000ms), switch to the door-opened image and show modal
    setTimeout(function () {
      img.attr('src', '/images/door-opened.png');

      // Send request to backend to get the coupon details
      $.ajax({
        url: '/select-door',
        type: 'POST',
        data: { doorId: doorNumber, userId: parseInt(userId) },
        success: function (response) {
          if (response.success) {
            const { couponCode, discount } = response;

            // Show coupon details in modal
            $('#coupon-code').text(couponCode);
            $('#discount-percentage').text(discount);

            // Display the modal
            $('#coupon-modal').css('display', 'block');
          } else {
            alert(response.message);
          }
        },
        error: function () {
          alert('An error occurred while selecting the door.');
        },
      });
    }, 4000); // 4 seconds for gif to finish
  });

  // Close the modal when the close button is clicked
  $('.close').on('click', function () {
    $('#coupon-modal').css('display', 'none');
    $('#coupon-title').addClass('hidden');
    $('#coupon-div').addClass('hidden');
  });

  // Close the modal when the OK button is clicked
  $('#ok-button').on('click', function () {
    $('#coupon-modal').css('display', 'none');
    $('#coupon-title').addClass('hidden');
    $('#coupon-div').addClass('hidden');
  });
});
