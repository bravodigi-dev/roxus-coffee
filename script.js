const cart = [];
const products = [
  "Midnight Espresso","Golden Sunrise","Velvet Vanilla","Mocha Truffle",
  "Coconut Cloud","Heritage Blend","Roxus Mini One","Roxus Barista Pro",
  "Roxus Atelier X","Butter Croissant","Roxus Tiramisu","Burnt Cheesecake","Berry Danish"
];

const cartDrawer = document.getElementById("cartDrawer");
const backdrop = document.getElementById("backdrop");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

function money(value){ return `RM ${value.toFixed(2)}`; }
function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}
function openCart(){
  cartDrawer.classList.add("open");
  backdrop.classList.add("show");
  document.body.classList.add("locked");
}
function closeCart(){
  cartDrawer.classList.remove("open");
  backdrop.classList.remove("show");
  document.body.classList.remove("locked");
}
function renderCart(){
  cartCount.textContent = cart.length;
  cartTotal.textContent = money(cart.reduce((sum,item) => sum + item.price, 0));
  if(!cart.length){
    cartItems.innerHTML = '<p class="empty">Your cart is empty.</p>';
    return;
  }
  cartItems.innerHTML = cart.map((item,index) => `
    <div class="cart-item">
      <div><p>${item.name}</p><small>${money(item.price)}</small></div>
      <button data-remove="${index}">Remove</button>
    </div>`).join("");
  document.querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => {
      cart.splice(Number(button.dataset.remove),1);
      renderCart();
    });
  });
}
document.querySelectorAll(".add").forEach(button => {
  button.addEventListener("click", () => {
    cart.push({name:button.dataset.name,price:Number(button.dataset.price)});
    renderCart();
    showToast(`${button.dataset.name} added to cart`);
  });
});
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);
document.getElementById("checkoutBtn").addEventListener("click", () => {
  showToast(cart.length ? "Demo checkout ready for payment integration" : "Your cart is empty");
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll("#coffeeGrid .product-card").forEach(card => {
      card.classList.toggle("hidden",button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter);
    });
  });
});

const mainNav = document.getElementById("mainNav");
document.getElementById("mobileToggle").addEventListener("click", () => mainNav.classList.toggle("open"));
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => mainNav.classList.remove("open")));

const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
document.getElementById("searchBtn").addEventListener("click", () => {
  searchPanel.classList.add("open");
  document.body.classList.add("locked");
  searchInput.focus();
});
document.getElementById("closeSearch").addEventListener("click", () => {
  searchPanel.classList.remove("open");
  document.body.classList.remove("locked");
});
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase().trim();
  const found = products.filter(item => item.toLowerCase().includes(value));
  searchResults.innerHTML = value ? found.map(item => `<div class="search-result">${item}</div>`).join("") || '<div class="search-result">No products found.</div>' : "";
});

document.querySelectorAll(".plan-btn").forEach(button => {
  button.addEventListener("click", () => showToast(`${button.dataset.plan} selected`));
});

document.getElementById("postcodeForm").addEventListener("submit", event => {
  event.preventDefault();
  const postcode = document.getElementById("postcode").value.trim();
  document.getElementById("postcodeResult").textContent =
    /^\d{5}$/.test(postcode) ? "Great news — delivery is available in your area." : "Please enter a valid 5-digit postcode.";
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
