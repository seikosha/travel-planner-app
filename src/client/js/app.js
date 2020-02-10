document.getElementById('submit').addEventListener('click', performAction);

function performAction(event) {
  event.preventDefault()

  //get the user input data
  let userLocation = document.getElementById('location').value
  let userDate = document.getElementById('date').value

  console.log('user location is', userLocation);
  console.log('user Date is', userDate);

  async function postUserData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  //post user data to the route
  postUserData('http://localhost:8000/travel', {location: userLocation, date: userDate})
  .then((data) => {
    console.log(data);
    updateUI(data);
  })

  //function to updateUI
  function updateUI(data = {}) {
    document.getElementById('summary').innerHTML = data.weathersummary;
    document.getElementById('hightemp').innerHTML = data.hightemp;
    document.getElementById('lowtemp').innerHTML = data.lowtemp;
    document.getElementById('countdowndays').innerHTML = data.countdowndays;
    document.getElementById('image').src = data.imagelink;
  }
};

export { performAction }





















