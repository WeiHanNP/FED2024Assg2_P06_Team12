// const APIKEY = "6793b4d81128e05c4b6abe6c";
// const APIKEY2 = "67a70fe2ecf91b27b74d1173";//for member
// const APIKEY2URLMEMBER = "https://mokesell3-33ea.restdb.io/rest/member" //for member
// const APIKEY3 = "67a728794d87449d37828004"
// const APIKEY3URL = "https://mokesell-9086.restdb.io/rest/listing"
// const APIKEY4 = "67a825953c2ab936526e0dbd"
// const APIKEY4URL = "https://mokesell4-bf40.restdb.io/rest/listing"


const APIKEY = "67a8b8c599fb60a7dce983ea";
const APIKEYURL = "https://mokesell5-7439.restdb.io/rest"

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

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('index.html')) {
    loadindexlistings();
  }
  if (window.location.pathname.includes('listing.html')) {
    loadListings();
    load_category();
    //localStorage.removeItem('userSelectedCat');
  }
  if (window.location.pathname.includes('userprofile.html')) {
    if (localStorage.getItem('userid')) {
      userProfile();
    } else {
      window.location.href = 'login.html';
    }
  }
  if (window.location.pathname.includes('sellerprofile.html')) {
    loadSellerProfile();  
    sellerProfiles();
  }
  if (window.location.pathname.includes('favorite.html')) {
    loadFavoriteListings();
  }
  if (window.location.pathname.includes('feedback.html')) {
    feedback();
  }
  if (window.location.pathname.includes('createlisting.html')) {
    createListing();
  }
  if (window.location.pathname.includes('editprofile.html')) {
    editProfile();
  }
});

function load_category() {
  fetch(`${APIKEYURL}/category`, {
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
  fetch(`${APIKEYURL}/listing`, {
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
        col.innerHTML = `<div class="card h-100 p-2">
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
        //change text to liked and change color to red
        document.getElementById(`like-${product._id}`).addEventListener('click', function() {
          this.innerHTML = 'Liked';
          this.style.backgroundColor = 'red';
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
  // localStorage.removeItem('userSelectedCat');
}

// Helper function to limit text length
function limitText(text, limit) {
  return text.length > limit ? text.substring(0, limit) + '...' : text;
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
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    },
    body: JSON.stringify(jsondata),
    beforeSend: function() {
      document.getElementById('signup').innerHTML = 'Loading...';
    
    }
  };

  fetch(`${APIKEYURL}/member`, settings)
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
  fetch(`${APIKEYURL}/member`, {
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
        localStorage.setItem('likedProducts', JSON.stringify(user.liked));
        alert(user.liked);
        localStorage.setItem('followedUsers', JSON.stringify(user.followed));
        localStorage.setItem('userRating', user.rating);
        localStorage.setItem('userAbout', user.about);
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
  document.querySelectorAll('body > *:not(#lottie-container)').forEach(element => {
    element.style.display = 'none';
  });
  document.getElementById('lottie-container').style.display = 'block';
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
  console.log('Fetching data from:', `${APIKEYURL}/listing`);

  fetch(`${APIKEYURL}/listing`, {
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
      throw new Error(`Network response was not ok. Status: ${response.status}`);
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

    if (!data || data.length === 0) {
      productDiv.innerHTML = '<div class="alert alert-info">No listings found.</div>';
      return;
    }

    let row;
    let displayedProductCount = 0;
    const columnsPerRow = 4;
    const memberdataList = JSON.parse(localStorage.getItem('likedProducts')) || [];

    data.forEach(product => {
      console.log('Product:', product);

      if (displayedProductCount % columnsPerRow === 0) {
        row = document.createElement('div');
        row.className = 'row';
        productDiv.appendChild(row);
      }

      const col = document.createElement('div');
      col.className = 'col-lg-3 col-md-6 mb-4';
      col.innerHTML = `
        <div class="card h-100">
          <img src="${product.photourl}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">$${product.listprice}</p>
            <p class="card-text">${limitText(product.description, 100)}</p>
            <p class="card-text">Condition: ${product.condition}</p>
            <p class="card-text"><small class="text-muted">${product.listdatetime}</small></p>
            <button id="like-${product._id}" class="btn btn-primary btn-sm like-button" data-product-id="${product._id}">
              ${memberdataList.includes(product._id) ? 'Liked' : 'Like'}
            </button>
            <button id="view-${product._id}" class="btn btn-primary btn-sm">View</button>
          </div>
        </div>`;

      row.appendChild(col);
      displayedProductCount++;

      // Add event listeners for like and view buttons
      document.getElementById(`like-${product._id}`).addEventListener('click', () => {
        handleLike(product._id);
      });
      document.getElementById(`view-${product._id}`).addEventListener('click', () => {
        window.location.href = `/product-details.html?id=${product._id}`;
      });
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    const productDiv = document.getElementById('index-card-container');
    if (productDiv) {
      productDiv.innerHTML = '<div class="alert alert-danger">Failed to load listings. Please try again later.</div>';
    }
  });
}

function handleLike(productId) {
  let likedProducts = JSON.parse(localStorage.getItem('likedProducts')) || [];
  if (likedProducts.includes(productId)) {
    likedProducts = likedProducts.filter(id => id !== productId);
  } else {
    likedProducts.push(productId);
  }
  localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
  updateLikeButton(productId, likedProducts.includes(productId));
}

function updateLikeButton(productId, isLiked) {
  const likeButton = document.getElementById(`like-${productId}`);
  if (likeButton) {
    likeButton.textContent = isLiked ? 'Liked' : 'Like';
  }
}

function limitText(text, limit) {
  return text.length > limit ? text.substring(0, limit) + '...' : text;
}


// Helper function to limit text length
function limitText(text, limit) {
  return text.length > limit ? text.substring(0, limit) + '...' : text;
}



function loadSellerProfile() {
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
  fetch(`${APIKEYURL}/member/${userid}`, {
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
  // alert(sellerid+"hehe");
  if (sellerid) {
    fetch(`${APIKEYURL}/member/${sellerid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-apikey": APIKEY,
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
      fetch(`${APIKEYURL}/member/${userid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data) {
          let followed = data.followed || [];
          if (!followed.includes(sellerid)) {
            followed.push(sellerid);

            fetch(`${APIKEYURL}/member/${userid}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                "x-apikey": APIKEY,
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
  // alert("Seller ID:"+ sellerid);

  // Validate seller ID
  if (!sellerid || typeof sellerid !== 'string' || sellerid.trim() === '') {
    console.error('Invalid seller ID provided.');
    return;
  }

  // Fetch listings from API
  fetch(`${APIKEYURL}/listing`, {
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
      // alert("Product Seller ID:"+ product.sellerid); // Debugging log

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
//favorite page

function loadFavoriteListings() {
  const userid = localStorage.getItem('userid');
  if (!userid) {
    console.error('Error: User ID not found in localStorage');
    return;
  }

  console.log('Fetching user data from:', `${APIKEYURL}/member/${userid}`); // Debugging: Log the API URL
  fetch(`${APIKEYURL}/member/${userid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    }
  })
  .then(response => {
    console.log('User data response:', response); // Debugging: Log the response
    if (!response.ok) {
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }
    return response.json();
  })
  .then(user => {
    if (!user) {
      console.error('Error: User data not found');
      return;
    }

    const liked = user.liked || [];
    if (liked.length === 0) {
      console.log('No liked products found for the user.');
      const productDiv = document.getElementById('card-container');
      if (productDiv) {
        productDiv.innerHTML = '<div class="alert alert-info">No favorite listings found.</div>';
      }
      return;
    }

    
    fetch(`${APIKEYURL}/listing`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      }
    })
    .then(response => {
      console.log('Listings response:', response); // Debugging: Log the response
      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(listings => {
      if (!listings || listings.length === 0) {
        console.error('Error: No listings found');
        return;
      }

      const productDiv = document.getElementById('card-container');
      if (!productDiv) {
        console.error('Error: card-container not found');
        return;
      }
      productDiv.innerHTML = ''; // Clear previous listings

      let row;
      let displayedProductCount = 0;

      liked.forEach(likedId => {
        const likedProduct = listings.find(product => product._id === likedId);
        if (likedProduct) {
          if (displayedProductCount % 4 === 0) {
            row = document.createElement('div');
            row.className = 'row';
            productDiv.appendChild(row);
          }

          const col = document.createElement('div');
          col.className = 'col-lg-3 col-md-6 mb-4';
          col.innerHTML = `<div class="card h-100">
              <img src="${likedProduct.photourl}" class="card-img-top" alt="${likedProduct.name}" style="height: 250px; object-fit: cover;">
              <div class="card-body">
                <h5 class="card-title">${likedProduct.name}</h5>
                <p class="card-text">$${likedProduct.listprice}</p>
                <p class="card-text">${limitText(likedProduct.description, 100)}</p>
                <p class="card-text">Condition: ${likedProduct.condition}</p>
                <p class="card-text"><small class="text-muted">${likedProduct.listdatetime}</small></p>
                <button id="like-${likedProduct._id}" class="btn btn-primary btn-sm like-button" data-product-id="${likedProduct._id}">Liked</button>
                <button id="view-${likedProduct._id}" class="btn btn-primary btn-sm view-button" data-seller-id="${likedProduct.sellerid}">View</button>
              </div>
            </div>`;

          row.appendChild(col);
          displayedProductCount++;
        }
      });

      // Add event listeners for like and view buttons using event delegation
      productDiv.addEventListener('click', function(event) {
        const likeButton = event.target.closest('.like-button');
        const viewButton = event.target.closest('.view-button');

        if (likeButton) {
          const productId = likeButton.getAttribute('data-product-id');
          fetch(`${APIKEYURL}/member/${userid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              "x-apikey": APIKEY,
              "cache-control": "no-cache"
            }
          })
          .then(response => response.json())
          .then(user => {
            if (user) {
              let liked = user.liked || [];
              if (liked.includes(productId)) {
                liked = liked.filter(id => id !== productId);
                likeButton.innerHTML = 'Like';
              } else {
                liked.push(productId);
                likeButton.innerHTML = 'Liked';
              }

              fetch(`${APIKEYURL}/member/${userid}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  "x-apikey": APIKEY,
                  "cache-control": "no-cache"
                },
                body: JSON.stringify({ liked: liked })
              })
              .then(response => response.json())
              .then(updatedUser => {
                console.log('Updated user:', updatedUser);
                localStorage.setItem('likedProducts', JSON.stringify(liked));
              })
              .catch(error => console.error('Error:', error));
            }
          })
          .catch(error => console.error('Error:', error));
        }

        if (viewButton) {
          const sellerId = viewButton.getAttribute('data-seller-id');
          localStorage.setItem('sellerid', sellerId);
          window.location.href = 'sellerprofile.html';
        }
      });
    })
    .catch(error => {
      console.error('Error fetching listings:', error);
      const productDiv = document.getElementById('card-container');
      if (productDiv) {
        productDiv.innerHTML = '<div class="alert alert-danger">Failed to load listings.</div>';
      }
    });
  })
  .catch(error => {
    console.error('Error fetching user data:', error);
    const productDiv = document.getElementById('card-container');
    if (productDiv) {
      productDiv.innerHTML = '<div class="alert alert-danger">Failed to load user data.</div>';
    }
  });
}


//bump page
function bumpagelist(listingID){
  fetch(`${APIKEYURL}/listing`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "x-apikey": APIKEY,
      "cache-control": "no-cache"
    }
  })
  .then(response => response.json())
  .then(data => {
    const matchedListing = data.find(listing => listing._id === listingID);
    if (matchedListing) {
      const listingDiv = document.getElementById('container');
      listingDiv.innerHTML = `
        <div class="card split" style="width: 30rem;">
            <img src="${matchedListing.photourl}" class="card-img-top" alt="${matchedListing.name}">
            <div class="card-body">
            <h5 class="card-title">"${matchedListing.name}"</h5>
            <p class="card-text">$"${matchedListing.listprice}" <br><br>
                Condition: ${matchedListing.condition} <br><br>
                Category: ${matchedListing.category} <br><br>
                Description: ${matchedListing.description}<br>
            </p>
            </div>
        </div>`;
    } else {
      console.error('Listing not found.');
    }
  })
  .catch(error => console.error('Error:', error));
}


// // Call the function with the sellerid from localStorage
function sellerProfilePage() {
  document.addEventListener('DOMContentLoaded', () => {
    profile();
    let sellerid = localStorage.getItem('sellerid');
    if (sellerid) {
      loadListing(sellerid);
    }
  });
}


//createlisting.html
function createListing() {
  document.getElementById('submit-listing').addEventListener('click', function() {
    const image = document.getElementById('item-image').files[0];
    const name = document.getElementById('item-name').value;
    const listprice = document.getElementById('item-price').value;
    const condition = document.getElementById('item-condition').value;
    const category = document.getElementById('item-cat').value;
    const description = document.getElementById('description').value;
    const sellerid = localStorage.getItem('userid');
    alert('Listing created successfully');
    // Validation
    if (!name || !listprice || !condition || !category || !description || !image || !sellerid) {
      alert('Please fill in all fields');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = function() {
      const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');

      const jsondata = {
        name,
        listprice,
        condition,
        category,
        description,
        photourl: base64String,
        sellerid
      };

      const settings = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "x-apikey": APIKEY,
          "cache-control": "no-cache"
        },
        body: JSON.stringify(jsondata)
      };

      fetch(`${APIKEYURL}/listing`, settings)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Created listing:', data);
          alert('Listing created successfully');
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to create listing. Please try again later.');
        });
    };

    reader.readAsDataURL(image);
  });
}


//edit profile page
function editProfile() {
  const userid = localStorage.getItem('userid');
  if (!userid) {
    console.error('Error: User ID not found in localStorage');
    return;
  }

  fetch(`${APIKEYURL}/member/${userid}`, {
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
    if (data) {
      document.getElementById('username').value = data.username || '';
      document.getElementById('password').value = data.password || '';
      document.getElementById('about').value = data.about || '';
    } else {
      console.log('User not found.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to load user profile. Please try again later.');
  });
  document.getElementById('username').placeholder = data.username || '';
  document.getElementById('about').placeholder = data.about || '';
  document.getElementById('update-profile').addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const about = document.getElementById('about').value;

    if (!username || !rating || !about) {
      alert('Please fill in all fields');
      return;
    }

    fetch(`${APIKEYURL}/member/${userid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      body: JSON.stringify({ username, rating, about })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Updated user:', data);
      alert('Profile updated successfully');
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to update profile. Please try again later.');
    });
  });
}

// feedback.html
function feedback() {
  const feedbackButton = document.getElementById('submit-feedback');
  const feedbackInput = document.getElementById('fbk-desc');
  const feedbackCat = document.getElementById('fbk-cat');

  if (!feedbackButton || !feedbackInput || !feedbackCat) {
    console.error('Error: Required elements not found');
    return;
  }

  feedbackButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior
    alert('Fed');

    const feedbackText = feedbackInput.value.trim();
    const feedbackCategory = feedbackCat.value;

    // Validate feedback input
    if (!feedbackText) {
      alert('Please enter your feedback before submitting.');
      return;
    }

    // Prepare JSON data for the API request
    const jsondata = {
      userid: localStorage.getItem('userid'),
      detail: feedbackText,
      feedbackcat: feedbackCategory,
      status: "Pending"
    };

    // API request settings
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      body: JSON.stringify(jsondata)
    };

    console.log('Submitting feedback:', jsondata); // Debugging: Log the feedback data

    // Make the API request
    fetch("https://mokesell3-33ea.restdb.io/rest/feedback", settings)
      .then(response => {
        console.log('API response:', response); // Debugging: Log the response
        if (!response.ok) {
          throw new Error(`Network response was not ok. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Feedback submitted successfully:', data); // Debugging: Log the success response
        alert('Feedback submitted successfully');
        feedbackInput.value = ''; // Clear the feedback input field
      })
      .catch(error => {
        console.error('Error submitting feedback:', error); // Debugging: Log the error
        alert('Failed to submit feedback. Please try again.');
      });
  });
}

  
//Search function
async function searchDatabase(query) {
  try {
      // Construct the query string (e.g., searching for "name" or "description")
      const queryString = query ? `?q=${JSON.stringify({ $text: query })}` : '';

      // Make the GET request to RESTDB with the query string
      const response = await fetch(APIKEY + queryString, 
      {
        'Content-Type': 'application/json',
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      });

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      // Parse the response JSON
      const data = await response.json();

      // Display or use the search results
      console.log(data);
  } catch (error) {
      console.error('Error:', error);
  }

}