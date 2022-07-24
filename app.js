// Using Module Pattern

// Storage Controller

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    items: [
      { id: 0, name: "Steak Dinner", calories: 1200 },
      { id: 1, name: "Cookie", calories: 400 },
      { id: 2, name: "Eggs", calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  }

  // Public methods
  return {
    getItems: function () {
      return data.items;
    },
    logData: function () {
      return data;
    },
    addItem: function (name, calories) {
      // Create ID
      let id;
      if (data.items.length > 0) {
        id = data.items[data.items.length - 1].id + 1;
      } else {
        id = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(id, name, calories);

      data.items.push(newItem);

      return newItem;
    }
  }
})();

// UI Controller
const UICtrl = (function () {
  const UIelements = {
    itemList: document.getElementById("item-list"),
    addBtn: document.querySelector(".add-btn"),
    itemNameInput: document.getElementById("item-name"),
    itemCaloriesInput: document.getElementById("item-calories"),
  }

  // Public methods
  return {
    populateItemList: function (items) {

      let html = "";
      items.forEach(item => {
        html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          </li>
        `;
      });
      // Insert list items
      UIelements.itemList.innerHTML = html;
    },

    getElement: function (elem) {
      return UIelements[elem];
    },

    getItemInput: function () {
      return {
        name: UIelements.itemNameInput.value,
        calories: UIelements.itemCaloriesInput.value,
      }
    }
  }
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function () {
    // Add item event
    UICtrl.getElement("addBtn").addEventListener("click", itemAddSubmit);
  }

  // Add item submit
  const itemAddSubmit = function (e) {
    e.preventDefault();

    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    if (input.name && input.calories) {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
    }
  }

  // Public methods
  return {
    init: function () {
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Populate UI list with items
      UICtrl.populateItemList(items);

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

App.init();