// Initialize the Leaflet map
$(document).ready(function () {
  const map = L.map('map').setView([9.082, 8.6753], 6); // Centered on Nigeria (adjust coordinates as needed)

  // Set up the base map layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Define allowed locations as an array of objects
  const allowedLocations = [
    { name: 'Lagos', coords: [6.5244, 3.3792] },
    { name: 'Abuja', coords: [9.0765, 7.3986] },
    { name: 'Rivers', coords: [4.8156, 7.0498] },
  ];

  let selectedLocation = null;

  // Add markers for each allowed location
  allowedLocations.forEach((location) => {
    const marker = L.marker(location.coords)
      .addTo(map)
      .bindPopup(location.name);

    // Add click event listener to handle selection
    marker.on('click', () => {
      // Update the selected location
      selectedLocation = location;

      // Display the selection in a popup
      marker.openPopup();

      // Enable the confirmation button
      $('#confirm-location').prop('disabled', false);
    });
  });

  // Handle Confirm Selection button click
  $('#confirm-location').click(() => {
    if (selectedLocation) {
      alert(`You have selected: ${selectedLocation.name}`);

      // Submit the selected location to the server
      $.ajax({
        type: 'POST',
        url: '/select-location', // Make sure this matches your route in the backend
        data: { location: selectedLocation.name },
        success: function (response) {
          // Redirect to the next page or show a success message
          window.location.href = '/fill-details';
        },
        error: function (error) {
          console.error('Error selecting location:', error);
        },
      });
    }
  });
});
