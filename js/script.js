const APIKEY = "6793b4d81128e05c4b6abe6c";

document.addEventListener('DOMContentLoaded', function() {
    var footer = document.createElement('footer');
    footer.innerHTML = `<footer style="background-color: #ffede7;">
    <div class="container p-4">
      <div class="row">
        <div class="col-lg-3 col-md-6 mb-4">
          <h5 class="mb-3" style="letter-spacing: 2px; color: #7f4722;">shopping online</h5>
          <ul class="list-unstyled mb-0">
            <li class="mb-1">
              <a href="#!" style="color: #4f4f4f;">frequently asked questions</a>
            </li>
          </ul>
        </div>
        <div class="col-lg-3 col-md-6 mb-4">
          <h5 class="mb-3" style="letter-spacing: 2px; color: #7f4722;">git cards</h5>
          <ul class="list-unstyled mb-0">
            <li class="mb-1">
              <a href="#!" style="color: #4f4f4f;">frequently asked questions</a>
            </li>
          </ul>
        </div>
        <div class="col-lg-3 col-md-6 mb-4">
          <h5 class="mb-3" style="letter-spacing: 2px; color: #7f4722;">company</h5>
          <ul class="list-unstyled mb-0">
            <li class="mb-1">
              <a href="#!" style="color: #4f4f4f;">buy a gift card</a>
            </li>
          </ul>
        </div>
        <div class="col-lg-3 col-md-6 mb-4">
          <h5 class="mb-3" style="letter-spacing: 2px; color: #7f4722;">diamond club</h5>
          <ul class="list-unstyled mb-0">
            <li class="mb-1">
              <a href="#!" style="color: #4f4f4f;">registration</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2);">
      <a class="text-dark" href="#"> MokeSell</a>
    </div>
    <!-- Copyright -->
  </footer>`;
    document.body.appendChild(footer);
});

// start of login and signup pages

// signup form (when user clicks on sign up)
// 1. change the button text to 'Sign Up'
// 2. add a confirm password field
function signupform() {
    var signupDiv = document.getElementById('signup');
    
    signupDiv.innerHTML = `<div data-mdb-input-init class="form-outline form-white mb-4">
      <input type="password" id="typePasswordY" class="form-control form-control-lg" />
      <label class="form-label" for="typePasswordY">Confirm Password</label> 
      </div>`;
    
    var signup = document.getElementsByClassName('btn-lg')
    signup[0].innerHTML = 'Sign Up';
    signup[0].id = 'sign-up';

    var hide = document.getElementById('hideSignup');
    hide.style.display = 'none';
}


// sign up form (when user clicks on sign up)
// check if the password and confirm password fields match
// if they do, sign up the user (call the signup function)
// if they don't, alert the user that the passwords do not match
function loginSignup(){
    var username = document.getElementById('typeUsername');
    var passwordX = document.getElementById('typePasswordX');
    var passwordY = document.getElementById('typePasswordY');

    if(passwordX.value != passwordY.value){
        alert('Passwords do not match');
    }
    else{
        signup(username.value,passwordY.value);//sign up the user
    }
}

// sign up the user
// 1. get the username and password from the form
// 2. create a new user object with the username, password, liked and followed properties
// 3. make a POST request to the database to add the new user
// 4. log the user in
function signup(username,password) {
  alert(username+password);
  let jsondata = {
    "username": username,
    "password": password,
    "liked": [0],
    "followed": [0],
  };

  let settings = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    },
    body: JSON.stringify(jsondata),
    beforeSend: function() {
      document.getElementById('signup').innerHTML = 'Loading...';
    
    }
  };

  fetch("https://mokesell1-2729.restdb.io/rest/member", settings)
  .then(respond => respond.json())
  .then(data => {
    console.log(data);
    document.getElementById('signup').innerHTML = 'Sign Up';
  });
  loggedIn();
}
// log the user in
// 1. get the username and password from the form
// 2. make a GET request to the database to get all the users
// 3. loop through the users and check if the username and password match
// 4. if they do, alert the user that they are logged in
function login() {
  var username = document.getElementById('typeUsername');
  var password = document.getElementById('typePasswordX');

  fetch("https://mokesell1-2729.restdb.io/rest/member", {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
      }
  })
  .then(response => response.json())
  .then(data => {
      data.forEach(user => {
          if(user.username == username.value && user.password == password.value) {
              alert('Logged in');
          }
      });
  })
  .catch(error => console.error('Error:', error));
}


//save the user to the local storage (not done)
function loggedIn(){
}
// end of login and signup pages

// listing page
// 1. get all the products from the database
// 2. loop through the products and display them on the page
// 3. add a like button to each product
// 4. add an event listener to each like button
// 5. when the like button is clicked, add the product to the liked array of the user
// 6. change the like button to 'liked'
document.addEventListener('DOMContentLoaded', function() {
  listing();
});


function listing() {
  fetch("https://mokesell1-2729.restdb.io/rest/listing", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    }
  })
  .then(response => response.json())
  .then(data => {
    data.forEach(product => {
      var productDiv = document.getElementById('card-deck');
      
      productDiv.innerHTML = `<div class="card" style="width: 18rem;">
        <img src="${product.photo}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text">$${product.listprice}</p>
          <p class="card-text"><small class="text-muted">${product.listdatetime}</small></p>
          <button id="like-${product._id}" class="btn btn-primary">Like</button>
        </div>
      </div>`;
      document.body.appendChild(productDiv);

      document.getElementById(`like-${product._id}`).addEventListener('click', function() {
        // Add product to liked array of the user
        this.innerHTML = 'Liked';
      });
    });
  })
  .catch(error => console.error('Error:', error));
};

//bump page
window.addEventListener('resize', function() {
  var list = document.getElementById('list');
  if (window.innerWidth < 576) {
    list.style.display = 'none';
  } else {
    list.style.display = 'block';
    
  }
});

function showBumpMenu() {
  var list = document.getElementById('list');
  list.style.display = 'block';
}


// Initial check
if (window.innerWidth < 576) {
  document.getElementById('list').style.display = 'none';
}


