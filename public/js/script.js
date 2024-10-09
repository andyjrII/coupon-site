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
    { name: 'Rivers', coords: [4.8156, 7.0498] },
  ];

  let selectedLocation = null;

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
        // Show coupon div and scroll to it
        $('#coupon-div').removeClass('hidden');
        $('html, body').animate(
          {
            scrollTop: $('#coupon-div').offset().top,
          },
          1000
        );
      },
      error: function (error) {
        console.error('Error submitting form:', error);
      },
    });
  });
});
