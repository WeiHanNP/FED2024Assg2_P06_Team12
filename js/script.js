const APIKEY = "6793b4d81128e05c4b6abe6c";
let memberdataList = [];

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
  if (!localStorage.getItem('')) {
    logoutBtn.style.display = 'none';
  }
});

//listing page

function limitText(text, limit) {
  if (text.length > limit) {
    return text.substring(0, limit) + '...';
  }
  return text;
}

document.addEventListener('DOMContentLoaded', function() {
  const selectedCat = localStorage.getItem('userSelectedCat');
  alert("hereinlisting")
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
    alert("hereinlisting2")
    productDiv.innerHTML = ''; // Clear previous listings
    alert(selectedCat);
    alert(userSelectedCat);
    let row;
    data.forEach((product, index) => {
      if (!selectedCat || product.catid === selectedCat) {
        if (index % 4 === 0) {
          row = document.createElement('div');
          row.className = 'row';
          productDiv.appendChild(row);
        }
        let col = document.createElement('div');
        col.className = 'col-lg-3 col-md-6 mb-4 w-60';
        col.innerHTML = `<div class="card h-100">
            <img src="${product.photo}" class="card-img-top" alt="${product.name}" style="height: 150px; object-fit: cover;">
            <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${limitText(product.description, 100)}</p>
          <p class="card-text"><small class="text-muted">${product.listdatetime}</small></p>
          <button id="like-${product._id}" class="btn btn-primary btn-sm">Like</button>
            </div>
          </div>`;
        row.appendChild(col);

        document.getElementById(`like-${product._id}`).addEventListener('click', function() {
          // Add product to liked array of the user
          this.innerHTML = 'Liked';
        });
      }
    });
  })
  .catch(error => console.error('Error:', error));
});
//get member data function
function getMemberData(userid) {
  return fetch(`https://mokesell1-2729.restdb.io/rest/member/${userid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    }
  })
  .then(response => response.json())
  .then(data => {

    memberdataList = [data._id,data.username,liked,followed,rating,about]
  })
  .catch(error => {
    console.error('Error:', error);
    throw error;
  });
}

function chooseCat(catid){
  userSelectedCat = "";
  localStorage.removeItem('userSelectedCat');
  localStorage.setItem('userSelectedCat', catid);
  
  userSelectedCat = catid;
  window.location.href = 'listing.html';
  alert(userSelectedCat);

}



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


//Initial check
if (window.innerWidth < 576) {
  document.getElementById('list').style.display = 'none';
}








