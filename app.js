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
    items: [],
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
    },

    getTotalCalories: function () {
      let total = 0

      data.items.forEach(item => {
        total += item.calories;
      });

      data.totalCalories = total;

      return data.totalCalories;
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
    totalCalories: document.querySelector(".total-calories"),
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
    },

    addListItem: function (item) {
      // Create li element
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      `;

      // Insert item
      UIelements.itemList.insertAdjacentElement("beforeend", li);
    },

    showTotalCalories: function (total) {
      UIelements.totalCalories.textContent = total;
    },

    clearInput: function () {
      UIelements.itemNameInput.value = "";
      UIelements.itemCaloriesInput.value = "";
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
      // Add item to data structure
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);
      // Clear input fields
      UICtrl.clearInput();

      // Get total calories
      UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    }
  }

  // Public methods
  return {
    init: function () {
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Populate UI list with items
      UICtrl.populateItemList(items);
      UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

App.init();