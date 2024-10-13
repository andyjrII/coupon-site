$(document).ready(function () {
  const map = L.map('map').setView([9.082, 8.6753], 6); // Center map on Nigeria

  // Set up base map layer
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

  let selectedLocation = null;
  let userId = null; // Store the userId after details submission

  // Add markers and handle selection
  allowedLocations.forEach((location) => {
    const marker = L.marker(location.coords)
      .addTo(map)
      .bindPopup(location.name);
    marker.on('click', () => {
      selectedLocation = location.name;
      $('#confirm-location').text(`${selectedLocation}`);
      enableSubmitButton();
    });
  });

  // Check if both form and location are filled to enable the submit button
  function enableSubmitButton() {
    const formValid =
      $('#name').val() && $('#email').val() && $('#phone').val();
    if (formValid && selectedLocation) {
      $('#form-submit').prop('disabled', false); // Enable submit button
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
          $('#coupon-div').removeClass('hidden');
          $('html, body').animate(
            {
              scrollTop: $('#coupon-div').offset().top,
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

  // Handle door selection and coupon reveal
  $('.door').on('click', function () {
    if (!userId) {
      alert('Please submit your details before selecting a door.');
      return;
    }

    const doorNumber = $(this).data('door');

    // Send request to backend to get the coupon details
    $.ajax({
      url: '/select-door',
      type: 'POST',
      data: { doorId: doorNumber, userId: parseInt(userId) },
      success: function (response) {
        if (response.success) {
          const { couponCode, discount } = response;

          // Open the door visually
          $('.door').removeClass('open').addClass('closed');
          $(this).removeClass('closed').addClass('open');

          // Show coupon details in modal
          $('#couponCode').text(couponCode);
          $('#discountPercentage').text(discount);
          $('#couponModal').modal('show');
        } else {
          alert(response.message);
        }
      }.bind(this), // Keep 'this' in the correct context
      error: function () {
        alert('An error occurred while selecting the door.');
      },
    });
  });
});
