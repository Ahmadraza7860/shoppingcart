// Common functions

// Function to get data from the API using Fetch
async function getDataFromAPI(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }
  
  // Function to get the logged-in user from local storage
  function getLoggedInUser() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return loggedInUser;
  }
  
  // Function to display a message if the user is not logged in
  function checkLoggedInUser() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      alert('Please log in to access this page.');
      location.href = 'login.html';
    }
  }
  
  // Login Page
  document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Implement login logic using local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find((user) => user.email === email && user.password === password);
  
    if (user) {
      const token = generateToken();
      localStorage.setItem('loggedInUser', JSON.stringify({ email, token }));
      location.href = 'shop.html';
    } else {
      alert('Invalid email or password.');
    }
  });
  
  // Signup Page
  document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    // Implement signup logic using local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find((user) => user.email === email);
  
    if (existingUser) {
      alert('This email is already registered. Please use a different email.');
    } else if (password !== confirmPassword) {
      alert('Passwords do not match.');
    } else {
      const newUser = { firstName, lastName, email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Signup successful. Please login.');
      location.href = 'login.html';
    }
  });
  
  // Generate a random 16-byte token
  function generateToken() {
    let token = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 16;
  
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return token;
  }
  
  // Shop Page
  document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search');
    const productContainer = document.getElementById('product-container');
  
    // Function to display products in the shop page
    async function displayProducts() {
      const products = await getDataFromAPI('https://fakestoreapi.com/products');
      products.forEach((product) => {
        const productCard = createProductCard(product);
        productContainer.appendChild(productCard);
      });
    }
  
    // Create a product card element
    function createProductCard(product) {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.dataset.name = product.title.toLowerCase();
  
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>Price: $${product.price}</p>
        <p>Rating: ${product.rating.rate}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
  
      return productCard;
    }
  
    // Search functionality implementation
    searchInput.addEventListener('input', function () {
      const searchTerm = this.value.toLowerCase();
      const products = document.querySelectorAll('.product-card');
  
      products.forEach((product) => {
        const productName = product.dataset.name;
        if (productName.toLowerCase().includes(searchTerm)) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    });
  
    // Add item to the cart
    function addToCart(productId) {
      const product = products.find((product) => product.id === productId);
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      cartItems.push(product);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      alert('Item added to cart.');
    }
  
    displayProducts();
  });
  
  // Cart Page
  document.addEventListener('DOMContentLoaded', function () {
    const cartItemsContainer = document.getElementById('cart-items');
  
    // Display cart items
    function displayCartItems() {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      cartItemsContainer.innerHTML = '';
  
      cartItems.forEach((item) => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
      });
    }
  
    // Create a cart item element
    function createCartItemElement(item) {
      const cartItemElement = document.createElement('div');
      cartItemElement.classList.add('cart-item');
  
      cartItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>Price: $${item.price}</p>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      `;
  
      return cartItemElement;
    }
  
    // Remove item from the cart
    function removeFromCart(productId) {
      let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      cartItems = cartItems.filter((item) => item.id !== productId);
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      displayCartItems();
      alert('Item removed from cart.');
    }
  
    displayCartItems();
  });
  
  // Checkout Functionality
  function handleCheckout() {
    // Implement checkout functionality here
    // For example, you can use a payment gateway like Razorpay
  
    // After successful payment, clear the cart items
    localStorage.removeItem('cartItems');
    alert('Items purchased. Cart cleared.');
  }
  
  // Profile Page
  document.addEventListener('DOMContentLoaded', function () {
    const profileDetails = document.getElementById('profile-details');
  
    // Function to display user profile details
    function displayUserProfile() {
      const loggedInUser = getLoggedInUser();
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find((user) => user.email === loggedInUser.email);
  
      if (user) {
        profileDetails.innerHTML = `
          <h3>Name: ${user.firstName} ${user.lastName}</h3>
          <p>Email: ${user.email}</p>
          <button onclick="editProfile()">Edit Profile</button>
        `;
      } else {
        profileDetails.innerHTML = `<p>Profile not found. Please log in again.</p>`;
      }
    }
  
    // Edit Profile
    function editProfile() {
      const loggedInUser = getLoggedInUser();
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find((user) => user.email === loggedInUser.email);
  
      const updatedFirstName = prompt('Enter updated first name:', user.firstName);
      const updatedLastName = prompt('Enter updated last name:', user.lastName);
  
      if (updatedFirstName && updatedLastName) {
        user.firstName = updatedFirstName;
        user.lastName = updatedLastName;
        localStorage.setItem('users', JSON.stringify(users));
        displayUserProfile();
        alert('Profile updated successfully.');
      } else {
        alert('Invalid input. Profile update canceled.');
      }
    }
  
    displayUserProfile();
  });
  
  // Initial setup for each page
  document.addEventListener('DOMContentLoaded', function () {
    const currentPage = location.pathname.split('/').pop().split('.')[0];
  
    if (currentPage === 'cart') {
      checkLoggedInUser();
    } else if (currentPage === 'profile') {
      checkLoggedInUser();
    }
  });
  