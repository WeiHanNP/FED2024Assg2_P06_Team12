const APIKEY = "6793b4d81128e05c4b6abe6c";
const APIKEY2 = "67a70fe2ecf91b27b74d1173";//for member
const APIKEY2URLMEMBER = "https://mokesell3-33ea.restdb.io/rest/member" //for member
const APIKEY3 = "67a728794d87449d37828004"
const APIKEY3URL = "https://mokesell-9086.restdb.io/rest/listing"
let memberdataList = [];

// userinfo for top of the page
document.addEventListener('DOMContentLoaded', function () {
  let userinfo = document.getElementsByClassName('userinfo');
  let login = document.getElementsByClassName('login');
  let logoutBtn = document.getElementsByClassName('logout');

  if (userinfo.length > 0) {
    let userid = localStorage.getItem('userid');
    let username = localStorage.getItem('username');

    if (username && username.length > 0) {
      // User is logged in
      logoutBtn[0].style.display = 'block';
      userinfo[0].innerHTML = `<a href="#"><h5 class="logout">Logout</h5></a><a href="userprofile.html"><h5 class="login">Welcome ${username}</h5></a>`;

    } else {
      // User is not logged in
      userinfo[0].innerHTML = `<a href="login.html"><h5 class="login">Login</h5></a>`;
      //logoutBtn[0].style.display = 'none'; // Hide logout button
      
      if (login.length > 0) {
        login[0].style.display = 'block'; // Show login button
      }
    }

    // Add event listener to logout button
    if (logoutBtn.length > 0) {
      logoutBtn[0].addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default link behavior
        localStorage.removeItem('userid');
        localStorage.removeItem('username');
        window.location.href = 'index.html'; // Redirect to homepage after logout
      });
    }
  }
});
//listing page

function limitText(text, limit) {
  if (text.length > limit) {
    return text.substring(0, limit) + '...';
  }
  return text;
}
//  
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('index.html')) {
    loadindexlistings();
    
  }
});

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('listing.html')) {
    loadListings();
    load_category();
    //localStorage.removeItem('userSelectedCat');
  }
});
//load userprofile
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('userprofile.html')) {
    alert("userprofile");
    userProfile();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('sellerprofile.html')) {
    sellerProfiles();
  }
});


function load_category() {
  fetch("https://mokesell1-2729.restdb.io/rest/category", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const selectedCat = localStorage.getItem('userSelectedCat');
    var categoryDiv = document.getElementById('ls-category');
    categoryDiv.innerHTML = ''; // Clear previous content

    let col = document.createElement('div');
    col.className = 'col-lg-3 col-md-6 mb-4 w-60';

    if (selectedCat) {
      // If a specific category is selected, find and display it
      let matchedCategory = null;

      // Find the category that matches the selectedCat
      data.forEach((category) => {
        if (category.catid.trim().toUpperCase() === selectedCat.trim().toUpperCase()) {
          matchedCategory = category.category;
        }
      });

      if (matchedCategory) {
        // If a matching category is found, display it
        col.innerHTML = `<h5 class="card-title">${matchedCategory}</h5>`;
      } else {
        // Display a message if no matching category is found
        col.innerHTML = `<h5 class="card-title">Category not found</h5>`;
      }
    } else {
      // If no specific category is selected, display "All Categories"
      col.innerHTML = `<h5 class="card-title">All Categories</h5>`;
    }

    // Append the single element to the categoryDiv
    categoryDiv.appendChild(col);

    // Clear the selected category from localStorage after use (optional)
    localStorage.removeItem('userSelectedCat');
  })
  .catch(error => {
    console.error('Error:', error);
    // Display an error message to the user
    const categoryDiv = document.getElementById('ls-category');
    categoryDiv.innerHTML = `<p class="text-danger">Failed to load categories. Please try again later.</p>`;
  });
}



function loadListings() {
  const selectedCat = localStorage.getItem('userSelectedCat');
  fetch("https://mokesell1-2729.restdb.io/rest/listing", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    var productDiv = document.getElementById('card-container');
    productDiv.innerHTML = ''; // Clear previous listings
    let row;
    let displayedProductCount = 0; // Track the number of displayed products

    data.forEach((product) => {
      // Check if the product category matches the selected category
      if (!selectedCat || (product.catid && product.catid.trim().toUpperCase() === selectedCat.trim().toUpperCase())) {
        // Create a new row for every 4 displayed products
        if (displayedProductCount % 4 === 0) {
          row = document.createElement('div');
          row.className = 'row';
          productDiv.appendChild(row);
        }

        // Create the column for the product
        let col = document.createElement('div');
        col.className = 'col-lg-3 col-md-6 mb-4 w-60';
        col.innerHTML = `<div class="card h-100">
            <img src="${product.photourl}" class="card-img-top" alt="${product.name}" style="height: 150px; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">$${product.listprice}</p>
              <p class="card-text">${limitText(product.description, 100)}</p>
              <p class="card-text">Condition: ${product.condition}</p>
              <p class="card-text"><small class="text-muted">${product.listdatetime}</small></p>
              <button id="like-${product._id}" class="btn btn-primary btn-sm">Like</button>
              <button id="view-${product._id}" class="btn btn-primary btn-sm">View</button>

            </div>
          </div>`;
        row.appendChild(col);

        // Add event listener to the "Like" button
        document.getElementById(`like-${product._id}`).addEventListener('click', function() {
          this.innerHTML = 'Liked';
        });
        document.getElementById(`view-${product._id}`).addEventListener('click', function() {
          localStorage.setItem('sellerid', product.sellerid);
          window.location.href = 'sellerprofile.html';
        });

        // Increment the displayed product count
        displayedProductCount++;
      }
    });
  })
  .catch(error => {
    console.error('Error:', error);
    // Optionally, display an error message to the user
  });

  // Clear the selected category from localStorage after use
  //localStorage.removeItem('userSelectedCat');
}

// Helper function to limit text length
function limitText(text, limit) {
  return text.length > limit ? text.substring(0, limit) + '...' : text;
}


//get member data function
function getMemberData(userid) {
  return fetch(`${APIKEY2URLMEMBER}/${userid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY2,
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
  //alert(userSelectedCat);

}



// start of login and signup pages

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('login.html')) {
    let username = localStorage.getItem('username');
    if (username && username.length > 0) {
      window.location.href = 'userprofile.html';
    }
  }
});


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
      //alert("here");
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
  //alert(username+password);
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
      "x-apikey": APIKEY2,
      "cache-control": "no-cache"
    },
    body: JSON.stringify(jsondata),
    beforeSend: function() {
      document.getElementById('signup').innerHTML = 'Loading...';
    
    }
  };

  fetch(APIKEY2URLMEMBER, settings)
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
  fetch(APIKEY2URLMEMBER, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY2,
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
  // alert(userid);
  // alert(username);
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


//index page

function loadindexlistings() {
  console.log('Loading listings...');

  fetch("https://mokesell1-2729.restdb.io/rest/listing", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    }
  })
  .then(response => {
    console.log('Response:', response);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('API Data:', data);

    const productDiv = document.getElementById('index-card-container');
    if (!productDiv) {
      console.error('Error: index-card-container not found');
      return;
    }
    productDiv.innerHTML = '';

    if (data.length === 0) {
      productDiv.innerHTML = '<div class="alert alert-info">No listings found.</div>';
      return;
    }

    let row;
    let displayedProductCount = 0;

    data.forEach((product) => {
      console.log('Product:', product);

      if (displayedProductCount % 4 === 0) {
        row = document.createElement('div');
        row.className = 'row';
        productDiv.appendChild(row);
      }
      
      const col = document.createElement('div');
      col.className = 'col-lg-3 col-md-6 mb-4';
      col.innerHTML = `<div class="card h-100">
            <img src="${product.photourl}" class="card-img-top" alt="${product.name}" style="height: 40%; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">$${product.listprice}</p>
              <p class="card-text">${limitText(product.description, 100)}</p>
              <p class="card-text">Condition: ${product.condition}</p>
              <p class="card-text"><small class="text-muted">${product.listdatetime}</small></p>
              <button id="like-${product._id}" class="btn btn-primary btn-sm">Like</button>
              <button id="view-${product._id}" class="btn btn-primary btn-sm">View</button>

            </div>
          </div>`;

      row.appendChild(col);
      displayedProductCount++;
    });

    document.querySelectorAll('.like-button').forEach(button => {
      button.addEventListener('click', function() {
        this.innerHTML = 'Liked';
      });
    });
  })
  .catch(error => {
    console.error('Error:', error);
    const productDiv = document.getElementById('index-card-container');
    if (productDiv) {
      productDiv.innerHTML = '<div class="alert alert-danger">Failed to load product listings.</div>';
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  loadindexlistings();
});


// Helper function to limit text length
function limitText(text, limit) {
  return text.length > limit ? text.substring(0, limit) + '...' : text;
}





//userprofile.html
function userProfile() {
  // Retrieve user ID from local storage
  let userid = localStorage.getItem('userid')?.trim(); // Use optional chaining to avoid errors if userid is null

  if (!userid) {
    console.log('No user ID found in local storage.');
    return; // Exit the function if no user ID is found
  }

  // Fetch user data from the API
  fetch(`${APIKEY2URLMEMBER}/${userid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY2,
      "cache-control": "no-cache"
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        // Update the DOM with user data
        document.getElementById('username').textContent = data.username || 'N/A';
        document.getElementById('rating').textContent = data.rating || 'N/A';
        document.getElementById('about').textContent = data.about || 'N/A';
        // Add more fields as needed
      } else {
        console.log('User not found.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Optionally, display an error message to the user
      alert('Failed to load user profile. Please try again later.');
    });

    loadListing(userid);
}

//sellerprofile.html
function sellerProfiles() {
  let sellerid = localStorage.getItem('sellerid').trim();
  alert(sellerid+"hehe");
  if (sellerid) {
    fetch(`${APIKEY2URLMEMBER}/${sellerid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-apikey": APIKEY2,
        "cache-control": "no-cache"
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data) {
        document.getElementById('username').textContent = data.username;
        document.getElementById('rating').textContent = data.rating;
        document.getElementById('about').textContent = data.about;
        // Add more fields as needed
      } else {
        console.log('User not found.');
      }
    })
    .catch(error => console.error('Error:', error));
  } else {
    console.log('No user ID found in local storage.');
  }
  document.getElementById('follow-button').addEventListener('click', function() {
    let followButton = this;
    let userid = localStorage.getItem('userid').trim();
    let sellerid = localStorage.getItem('sellerid').trim();

    if (userid && sellerid) {
      fetch(`${APIKEY2URLMEMBER}/${userid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-apikey": APIKEY2,
          "cache-control": "no-cache"
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data) {
          let followed = data.followed || [];
          if (!followed.includes(sellerid)) {
            followed.push(sellerid);

            fetch(`${APIKEY2URLMEMBER}/${userid}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                "x-apikey": APIKEY2,
                "cache-control": "no-cache"
              },
              body: JSON.stringify({ followed: followed })
            })
            .then(response => response.json())
            .then(updatedData => {
              followButton.textContent = 'Following';
              followButton.style.backgroundColor = 'grey';
            })
            .catch(error => console.error('Error:', error));
          }
        } else {
          console.log('User not found.');
        }
      })
      .catch(error => console.error('Error:', error));
    } else {
      console.log('No user ID or seller ID found in local storage.');
    }
  });
}

// // userprofile and sellerprofile page (LISTINGS)
function loadListing(sellerid) {
  alert("Seller ID:"+ sellerid);

  // Validate seller ID
  if (!sellerid || typeof sellerid !== 'string' || sellerid.trim() === '') {
    console.error('Invalid seller ID provided.');
    return;
  }

  // Fetch listings from API
  fetch("https://mokesell1-2729.restdb.io/rest/listing", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    }
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    console.log("Fetched Data:", data); // Debugging log

    if (!Array.isArray(data)) {
      console.error("Invalid response format. Expected an array.");
      return;
    }

    const productDiv = document.getElementById('card-container');
    productDiv.innerHTML = ''; // Clear previous listings

    let row;
    let displayedProductCount = 0;

    // Filter and display products
    data.forEach(product => {
      alert("Product Seller ID:"+ product.sellerid); // Debugging log

      if (product.sellerid && String(sellerid).trim().toUpperCase() === String(product.sellerid).trim().toUpperCase()) {
        if (displayedProductCount % 4 === 0) {
          row = document.createElement('div');
          row.className = 'row';
          productDiv.appendChild(row);
        }

        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-6 mb-4';
        col.innerHTML = `<div class="card h-100">
            <img src="${product.photourl}" class="card-img-top" alt="${product.name}" style="height: 250px; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text cardp">$${product.listprice}</p>
              <p class="card-text">${limitText(product.description, 100)}</p>
              <p class="card-text">Condition: ${product.condition}</p>
              <p class="card-text"><small class="text-muted">${product.listdatetime}</small></p>
              <button id="like-${product._id}" class="btn btn-primary btn-sm">Like</button>
              <button id="view-${product._id}" class="btn btn-primary btn-sm">View</button>

            </div>
          </div>`;

        row.appendChild(col);

        const likeButton = col.querySelector(`#like-${product._id}`);
        likeButton.addEventListener('click', function () {
          this.innerHTML = 'Liked';
        });

        displayedProductCount++;
      }
    });

    if (displayedProductCount === 0) {
      productDiv.innerHTML = '<p>No listings found for this seller.</p>';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('card-container').innerHTML = '<p>Failed to load listings. Please try again later.</p>';
  });
}



//createlisting.html
// add photo URl to images folder
let photoURL = document.getElementById('item-photo').value;
let itemName = document.getElementById('item-name').value;
let itemPrice = document.getElementById('item-price').value;
let itemCondition = document.getElementById('item-condition').value;
let itemCategory = document.getElementById('item-cat').value;
let itemDescription = document.getElementById('item-description').value;

let listingImg = document.getElementById('listing-img').value;
let listingTitle = document.getElementById('listing-title').value;
let listingPrice = document.getElementById('listing-price').value;
let listingCondition = document.getElementById('listing-condition').value;
let listingCategory = document.getElementById('listing-category').value;
let listingDescription = document.getElementById('listing-description').value;


document.getElementById('create-listing').addEventListener('click', function() {
  listingImg = photoURL;
  listingTitle = itemName;
  listingPrice = itemPrice;
  listingCondition = itemCondition;
  listingCategory = itemCategory;
  listingDescription = itemDescription;

  let jsondata = {
    "photo": listingImg,
    "name": listingTitle,
    "price": listingPrice,
    "condition": listingCondition,
    "category": listingCategory,    
    "description": listingDescription,
  };

  let settings = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    },
    body: JSON.stringify(jsondata)
  };

  fetch("https://mokesell1-2729.restdb.io/rest/listing", settings)
  .then(response => response.json())
  .then(data => {
    
    console.log(data);
    alert('Listing created successfully');
  })
  .catch(error => console.error('Error:', error));
});
