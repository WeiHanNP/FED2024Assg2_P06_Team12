const APIKEY = "6793b4d81128e05c4b6abe6c";

//userinfo for top of the page
document.addEventListener('DOMContentLoaded', function() {
  let userinfo = document.getElementsByClassName('userinfo');
  if (userinfo.length > 0) {
    var userid = localStorage.getItem('userid');
    var username = localStorage.getItem('username');
    if (userid) {
      userinfo[0].innerHTML = `<h5  style="text-align: end;">Welcome ${username}</h5>`;
    } else {
      userinfo[0].innerHTML = `<h5  style="text-align: end;"><a href="login.html">Login</a></h5>`;
    }
  let logoutBtn = document.createElement('button');
  logoutBtn.innerHTML = 'Logout';
  logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
  });
  userinfo[0].appendChild(logoutBtn);
  }
  if (!localStorage.getItem('userid')) {
    logoutBtn.style.display = 'none';
  }
});




// start of login and signup pages

// signup form (when user clicks on sign up)
// 1. change the button text to 'Sign Up'
// 2. add a confirm password field

function signupform() {
  let form = document.getElementById('cfmpassword');
  form.style.display = 'block';
  document.getElementById('signup-btn').innerHTML = 'Sign Up';
}
// sign up form (when user clicks on sign up)
// check if the password and confirm password fields match
// if they do, sign up the user (call the signup function)
// if they don't, alert the user that the passwords do not match
document.getElementById('signup-btn').addEventListener('click', function() {
    var username = document.getElementById('typeUsername');
    var passwordX = document.getElementById('typePasswordX');
    var passwordY = document.getElementById('typePasswordY');
    if (passwordX.value == "" || username.value == "") {
      alert('Please fill in all fields');
    }
    if (passwordY.value == ""){
      alert("here");
      login(username.value,passwordX.value);
    }
    else{
      if (passwordX.value == passwordY.value) {
        signup(username.value,passwordX.value);
      } else {
        alert('Passwords do not match');
      }
    }
});

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
    "liked": [0], //to keep listing ID
    "followed": [0], //to keep other member ID
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

  
  login(username,password);
}
// log the user in
// 1. get the username and password from the form
// 2. make a GET request to the database to get all the users
// 3. loop through the users and check if the username and password match
// 4. if they do, alert the user that they are logged in
function login(username, password) {
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
    let userFound = false;
    data.forEach(user => {
      if (user.username === username && user.password === password) {
        alert('Logged in');
        let userid = user._id;
        let serverUsername = user.username;
        loggedIn(userid, serverUsername);
        userFound = true;
      }
    });
    if (!userFound) {
      alert('Invalid username or password');
    }
  })
  .catch(error => console.error('Error:', error));
}


//save the user to the local storage
function loggedIn(userid,username) {
  localStorage.setItem('userid', userid);
  localStorage.setItem('username', username);
  alert(userid);
  alert(username);
  window.location.href = 'index.html';
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
    var productDiv = document.getElementById('card-container');
    productDiv.innerHTML = ''; // Clear previous listings
    let row;
    data.forEach((product, index) => {
      if (index % 4 === 0) {
        row = document.createElement('div');
        row.className = 'row';
        productDiv.appendChild(row);
      }
      let col = document.createElement('div');
      col.className = 'col-lg-3 col-md-6 mb-4 card';
      col.innerHTML = `  
          <img src="${product.photourl}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${limitText(product.description, 10)}</p>
            <p class="card-text"><small class="text-muted">${product.listdatetime}</small></p>
            <button id="like-${product._id}" class="btn btn-primary">Like</button>
          
        </div>
      `;
      row.appendChild(col);

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




//sellerprofile page
let followButton = document.getElementById('follow-button');
followButton.addEventListener('click', function() {
    if (followButton.textContent === 'Follow') {
      followButton.textContent = 'Following';
      followButton.style.backgroundColor = 'grey';
    } else {
      followButton.textContent = 'Follow';
      followButton.style.backgroundColor = ''; // Reset to default
    }
  });


// userprofile and sellerprofile page
function loadListing(sellerid) {
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
    var listings = document.getElementById('product-list');
    let listings = data.filter(listing => listing.sellerid === sellerid.value);
//console.log(listings);
    if (listings.length > 0) {
      let listing = listings[0];
      document.getElementById('listing-img').src = listing.photourl;    
      document.getElementById('listing-title').textContent = listing.title;
      document.getElementById('listing-price').textContent = listing.price;
      document.getElementById('listing-condition').textContent = listing.condition;
    } else {
      console.log('No listings found for this seller.');
    }
  })
  .catch(error => console.error('Error:', error));
}

// Call the function with the sellerid from localStorage
document.addEventListener('DOMContentLoaded', () => {
  profile();
  let sellerid = localStorage.getItem('sellerid');
  if (sellerid) {
    loadListing(sellerid);
  }
});


function profile() {
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
    let username = localStorage.getItem('username');
    let user = data.find(member => member.username === username);

    if (user) {
      document.getElementById('username').textContent = user.username;
      document.getElementById('rating').textContent = user.rating;
      document.getElementById('about').textContent = user.about;
      // document.getElementById('avatar').src = user.picture.medium;
    } else {
      console.log('User not found.');
    }
  })
  .catch(error => console.error('Error:', error));
}




//Initial check
if (window.innerWidth < 576) {
  document.getElementById('list').style.display = 'none';
}

