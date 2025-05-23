document.addEventListener("DOMContentLoaded", function () {
  // Menu data with image paths
  const menuItems = [
    {
      id: 1,
      name: "Waffle",
      description: "Waffle with Berries",
      price: 6.5,
      image: "/public/images/image-waffle-desktop.jpg",
    },
    {
      id: 2,
      name: "Tiramisu",
      description: "Classic Tiramisu",
      price: 5.5,
      image: "/public/images/image-creme-brulee-desktop.jpg",
    },
    {
      id: 3,
      name: "Cake",
      description: "Red Velvet Cake",
      price: 4.5,
      image: "/public/images/image-macaron-desktop.jpg",
    },
    {
      id: 4,
      name: "Crème Brûlée",
      description: "Vanilla Bean Crème Brûlée",
      price: 7.0,
      image: " /public/images/image-tiramisu-desktop.jpg",
    },
    {
      id: 5,
      name: "Baklava",
      description: "Pistachio Baklava",
      price: 4.0,
      image: "/public/images/image-baklava-desktop.jpg",
    },
    {
      id: 6,
      name: "Brownie",
      description: "Salted Caramel Brownie",
      price: 5.5,
      image: "/public/images/image-meringue-desktop.jpg",
    },
    {
      id: 7,
      name: "Macaron",
      description: "Macaron Mix of Five",
      price: 8.0,
      image: "/public/images/image-cake-desktop.jpg",
    },
    {
      id: 8,
      name: "Pie",
      description: "Lemon Meringue Pie",
      price: 5.0,
      image: "/public/images/image-brownie-desktop.jpg",
    },
    {
      id: 9,
      name: "Panna Cotta",
      description: "Vanilla Panna Cotta",
      price: 6.5,
      image: "/public/images/image-panna-cotta-desktop.jpg",
    },
  ];

  // Cart state
  let cart = [];
  const menuContainer = document.getElementById("menu-items");
  const cartContainer = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const orderTotalElement = document.getElementById("order-total");
  const confirmOrderButton = document.getElementById("confirm-order");
  const orderModal = document.getElementById("order-modal");
  const closeModalButton = document.getElementById("close-modal");
  const newOrderButton = document.getElementById("new-order");
  const modalOrderSummary = document.getElementById("modal-order-summary");
  const modalTotalElement = document.getElementById("modal-total");
  const orderQuantity = document.getElementById("order-quantity");
  const cartItemcontainer = document.getElementById("cart-item-container");

  // Render menu items
  function renderMenu() {
    menuContainer.innerHTML = "";
    menuItems.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.className = "rounded-lg overflow-hidden transition duration-200";
      menuItem.innerHTML = `
        <div class="relative">
          <img src="${item.image}" alt="${item.name}" class="menu-item-image">
          <div class="p-4">
            <h3 class="font-medium text-lg text-gray-800">${item.name}</h3>
            <p class="text-gray-600 text-sm mb-2">${item.description}</p>
            <div class="flex justify-between items-center">
              <span class="font-semibold text-amber-600">$${item.price.toFixed(
                2
              )}</span>
            </div>
          </div>
          <!-- Button with icon -->
          <button 
            class="add-to-cart bg-white hover:bg-orange-800 text-black py-1 px-3 rounded-full transition duration-200 absolute flex items-center gap-2" 
            style="left: 33px; bottom: 98px;"
            data-id="${item.id}">
            <img src="/public/images/icon-add-to-cart.svg" alt="Cart" class="h-4 w-4">
            Add to cart
          </button>
        </div>
      `;
      menuContainer.appendChild(menuItem);
    });

    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", function () {
        const itemId = parseInt(this.getAttribute("data-id"));
        addToCart(itemId);
      });
    });
  }

  // Add item to cart
  function addToCart(itemId) {
    const item = menuItems.find((i) => i.id === itemId);
    if (!item) return;

    const existingItem = cart.find((i) => i.id === itemId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    updateCartCount(); // Add this line
    renderCart();
    updateOrderTotal();
  }

  // Remove item from cart
  function removeFromCart(itemId) {
    const itemIndex = cart.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return;

    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    updateCartCount(); // Add this line
    renderCart();
    updateOrderTotal();
  }

  // Render cart items
  function renderCart() {
    emptyCartMessage.classList.add("hidden");
    confirmOrderButton.disabled = false;
    confirmOrderButton.classList.remove("hidden");
    cartItemcontainer.classList.remove("hidden");
    cartContainer.innerHTML = "";
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.className =
        "cart-item bg-gray-50 rounded p-3 transition-all duration-300";
      cartItem.innerHTML = `
              <div class="flex gap-3">
                  <img src="${item.image}" alt="${
        item.name
      }" class="w-16 h-16 object-cover rounded">
                  <div class="flex-1">
                      <div class="flex justify-between items-start">
                          <div>
                              <h4 class="font-medium text-gray-800">${
                                item.name
                              }</h4>
                              <p class="text-sm text-gray-600">${
                                item.quantity
                              }x @$${item.price.toFixed(2)}</p>
                          </div>
                          <div class="flex items-center">
                              <span class="font-medium mr-3">$${(
                                item.quantity * item.price
                              ).toFixed(2)}</span>
                              <button class="remove-from-cart text-red-500 hover:text-red-700" data-id="${
                                item.id
                              }">
                                  <i class="fas fa-times"></i>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          `;
      cartContainer.appendChild(cartItem);
    });

    if (cart.length === 0) {
      emptyCartMessage.classList.remove("hidden");
      confirmOrderButton.disabled = true;
      cartItemcontainer.classList.add("hidden");
      confirmOrderButton.classList.add("hidden");
    }
    // Add event listeners to all "Remove from Cart" buttons
    document.querySelectorAll(".remove-from-cart").forEach((button) => {
      button.addEventListener("click", function () {
        const itemId = parseInt(this.getAttribute("data-id"));
        removeFromCart(itemId);
      });
    });
  }

  // Update cart count display
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    orderQuantity.textContent = totalItems;
  }

  // Update order total
  function updateOrderTotal() {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    orderTotalElement.textContent = `$${total.toFixed(2)}`;
  }

  // Show order confirmation modal with product images
  function showOrderConfirmation() {
    let summaryHTML = '<div class="space-y-3">';
    cart.forEach((item) => {
      summaryHTML += `
        <div class="flex items-center justify-between py-2 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <img src="${item.image}" alt="${
        item.name
      }" class="w-12 h-12 object-cover rounded-lg">
            <div>
              <h4 class="font-medium">${item.name}</h4>
              <p class="text-sm text-gray-500">${item.quantity}x</p>
            </div>
          </div>
          <span class="font-medium">$${(item.quantity * item.price).toFixed(
            2
          )}</span>
        </div>
      `;
    });
    summaryHTML += "</div>";

    modalOrderSummary.innerHTML = summaryHTML;
    modalTotalElement.textContent = orderTotalElement.textContent;
    orderModal.classList.remove("hidden");
  }

  // Clear cart and start new order
  function startNewOrder() {
    cart = [];
    renderCart();
    updateOrderTotal();
    orderModal.classList.add("hidden");
  }

  // Event listeners
  confirmOrderButton.addEventListener("click", showOrderConfirmation);
  closeModalButton.addEventListener("click", () =>
    orderModal.classList.add("hidden")
  );
  newOrderButton.addEventListener("click", startNewOrder);

  // Initialize the app
  renderMenu();
  // renderCart();
});
