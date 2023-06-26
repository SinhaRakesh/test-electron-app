// Make a GET request to the /api/users endpoint
fetch("http://localhost:3000")
  .then((response) => response.json())
  .then((data) => {
    // Process the data returned from the API
    console.log(data);
    alert("Data");
  })
  .catch((error) => {
    // Handle any errors that occur during the request
    console.error(error);
  });
