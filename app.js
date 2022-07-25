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

    getItemById: function (id) {
      let found;
      data.items.every(item => {
        if (item.id === id) {
          found = item;
          return false;
        }
        return true;
      });
      return found;
    },

    updateItem: function (name, calories) {
      calories = parseInt(calories);

      let found;
      data.items.every(item => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
          return false;
        }
        return true;
      });
      return found;

    },

    deleteItem: function (id) {
      const ids = data.items.map((item) => item.id),
        index = ids.indexOf(id);

      data.items.splice(index, 1);
    },

    clearAllItems: function () {
      data.items = [];
    },

    getTotalCalories: function () {
      let total = 0

      data.items.forEach(item => {
        total += item.calories;
      });

      data.totalCalories = total;

      return data.totalCalories;
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurrentItem: function () {
      return data.currentItem;
    }
  }
})();

// UI Controller
const UICtrl = (function () {
  const UIelements = {
    itemList: document.getElementById("item-list"),
    addBtn: document.querySelector(".add-btn"),
    updateBtn: document.querySelector(".update-btn"),
    deleteBtn: document.querySelector(".delete-btn"),
    backBtn: document.querySelector(".back-btn"),
    clearBtn: document.querySelector(".clear-btn"),
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

    updateListItem: function (item) {
      let listItems = document.querySelectorAll("#item-list li");

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemId = listItem.getAttribute("id");

        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
          `;
        }
      });
    },

    deleteListItem: function (id) {
      const itemId = `item-${id}`,
        item = document.getElementById(itemId);
      item.remove();
    },

    removeItems: function () {
      let listItems = document.querySelectorAll("#item-list li");
      listItems = Array.from(listItems);

      listItems.forEach(function (item) {
        item.remove();
      })

    },

    showTotalCalories: function (total) {
      UIelements.totalCalories.textContent = total;
    },

    clearInput: function () {
      UIelements.itemNameInput.value = "";
      UIelements.itemCaloriesInput.value = "";
    },

    clearEditState: function () {
      UICtrl.clearInput();
      UIelements.updateBtn.style.display = "none";
      UIelements.deleteBtn.style.display = "none";
      UIelements.backBtn.style.display = "none";
      UIelements.addBtn.style.display = "inline";
    },

    showEditState: function () {
      UIelements.updateBtn.style.display = "inline";
      UIelements.deleteBtn.style.display = "inline";
      UIelements.backBtn.style.display = "inline";
      UIelements.addBtn.style.display = "none";
    },

    addItemToForm: function () {
      UIelements.itemNameInput.value = ItemCtrl.getCurrentItem().name;
      UIelements.itemCaloriesInput.value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    }
  }
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function () {
    // Add item event
    UICtrl.getElement("addBtn").addEventListener("click", itemAddSubmit);
    UICtrl.getElement("itemList").addEventListener("click", itemEditClick);
    UICtrl.getElement("updateBtn").addEventListener("click", itemUpdateSubmit);
    UICtrl.getElement("backBtn").addEventListener("click", UICtrl.clearEditState);
    UICtrl.getElement("deleteBtn").addEventListener("click", itemDeleteSubmit);
    UICtrl.getElement("clearBtn").addEventListener("click", clearAllItemsClick);

    document.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        return false;
      }
    })
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

  const itemEditClick = function (e) {
    e.preventDefault()
    if (e.target.classList.contains("edit-item")) {
      let itemId = e.target.parentElement.parentElement.id;
      itemId = parseInt(itemId.split("-")[1]);

      const itemToEdit = ItemCtrl.getItemById(itemId);

      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
    }
  }

  const itemUpdateSubmit = function (e) {
    e.preventDefault();
    const input = UICtrl.getItemInput(),
      updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    UICtrl.updateListItem(updatedItem);
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    UICtrl.clearEditState();

  }

  const itemDeleteSubmit = function (e) {
    e.preventDefault();
    const currentItem = ItemCtrl.getCurrentItem();

    ItemCtrl.deleteItem(currentItem.id);
    UICtrl.deleteListItem(currentItem.id);
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    UICtrl.clearEditState();
  }

  const clearAllItemsClick = function () {
    ItemCtrl.clearAllItems();
    UICtrl.removeItems();
    UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
    UICtrl.clearEditState();
  }

  // Public methods
  return {
    init: function () {
      UICtrl.clearEditState();

      const items = ItemCtrl.getItems();

      UICtrl.populateItemList(items);
      UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());

      // Load event listeners
      loadEventListeners();
    }
  }
})(ItemCtrl, UICtrl);

App.init();