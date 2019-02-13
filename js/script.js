var basketModule = (function() {
  var basket = [];
  return {
    name: "basket",

    createBasket: function() {
      let basketContainer = document.getElementById('product-container');
      basketContainer.innerHTML = ''
      
      for( var i = 0; i < basket.length; i++) {
        let container = document.createElement('div');
        let descriptionItem = document.createElement('div');
        let img = document.createElement('img');
        let titleItem = document.createElement('div');
        let priceItem = document.createElement('div');
        let quantityItem = document.createElement('div');
        let buttonPlus = document.createElement('input');
        let buttonMinus = document.createElement('input');
        let button = document.createElement('input');

        container.id = "basket_container-item"
        container.className = "basket_container-item"
        descriptionItem.id = "basket_description-item"
        img.id = "basket_product-image";
        titleItem.id = "basket_product-title";
        priceItem.id = "basket_product-price";
        quantityItem.id = "basket_product-quantity"
        button.id = "basket_button-remove-product"
        buttonPlus.id = "basket_button-increase-product";
        buttonMinus.id = "basket_button-reduce-product";
         
        button.setAttribute("data-active", basket[i].title)
        buttonPlus.setAttribute("data-active", basket[i].title)
        buttonMinus.setAttribute("data-active", basket[i].title)
        buttonPlus.type = "button";
        buttonMinus.type = "button";
        button.type = "button";
        buttonPlus.value = "+";
        buttonMinus.value = "-";
        button.value = "Remove";
        titleItem.innerHTML = basket[i].title;
        priceItem.innerHTML = "$ " + basket[i].price;
        quantityItem.innerHTML ="quantity: " + basket[i].quantity;
        img.src = basket[i].image;
        buttonPlus.addEventListener('click', basketModule.increaseItem)
        buttonMinus.addEventListener('click', basketModule.reduceItem)
        button.addEventListener('click', basketModule.removeItem)

        container.appendChild(img);
        container.appendChild(descriptionItem);
        descriptionItem.appendChild(titleItem);
        descriptionItem.appendChild(priceItem);
        descriptionItem.appendChild(quantityItem);
        descriptionItem.appendChild(buttonPlus);
        descriptionItem.appendChild(buttonMinus);
        descriptionItem.appendChild(button);
        basketContainer.appendChild(container);
      }      
    },

    addItem: function(data) {
      for(var i = 0; i < basket.length; i++) {
        if (basket[i].title === data.title) return;
      }
      basket.push(data);
      basketModule.getTotalCost();
      basketModule.createBasket()
    },

    removeItem: function(event) {
      var target = event.target;
      var targetTitleItem = target.getAttribute("data-active")
      for(var i = 0; i < basket.length; i++) {
        if(basket[i].title == targetTitleItem) basket.splice(i, 1)
      }
      basketModule.createBasket()
      basketModule.getTotalCost();
    },

    increaseItem: function(event) {
      var target = event.target;
      var targetTitleItem = target.getAttribute("data-active")
      for(var i = 0; i < basket.length; i++) {
        if(basket[i].title == targetTitleItem) basket[i].quantity += 1;
      }
      basketModule.createBasket()
      basketModule.getTotalCost();
    },

    reduceItem: function(event) {
      var target = event.target;
      var targetTitleItem = target.getAttribute("data-active")
      for(var i = 0; i < basket.length; i++) {
        if(basket[i].title == targetTitleItem) basket[i].quantity -= 1;
        if(basket[i].quantity == 0) return basketModule.removeItem(event);
      }
      basketModule.createBasket()
      basketModule.getTotalCost();
    },

    getTotalCost: function() {
      var totalCost = 0;
      var i = basket.length;
      while(i--) {
        console.log(basket[i].quantity)
        totalCost += basket[i].price * basket[i].quantity ;
      }
      let basketTotalCost = document.getElementById('basket_total')
      basketTotalCost.innerHTML = 'Total: ' + totalCost.toFixed(2) + ' $';
    },
    
    removeItemFromBasket: function(name) {
      for(var i = 0; i < basket.length; i++) {
        if(basket[i].title == name) basket.splice(i, 1);
      }
    },

    sendMessage: function(msg) {
      mediator.sendMessage(msg, this)
    },

    recieve: function(msg) {
      basketModule.addItem(msg);
    }
  }
})()

var basketMediator = {
  channels: [],
  addUser: function (obj) {
    this.channels.push(obj);
  },
  sendMessage: function (msg, obj) {
    for(var i = 0; i < this.channels.length; i++) {
      if(this.channels[i].name != obj.name) {
        this.channels[i].recieve(msg);
      }
    }
  }
};

var Item = function( title, price, mediator, image) {
  this.title = title;
  this.price = price;
  this.mediator = mediator;
  this.image = image;
  this.name = "products"
}

Item.prototype.send = function(msg, obj) {
  this.mediator.sendMessage(msg, obj)
}

Item.prototype.recieve = function(msg) {
  console.log(this.title + ' recieve:' + msg)
}

Item.prototype.createItem = function() {
  let container = document.createElement('div');
  let img = document.createElement('img');
  let titleItem = document.createElement('div');
  let priceItem = document.createElement('div');
  let button = document.createElement('input');
  let productList = document.getElementById('product-list')

  container.id = "content-block";
  img.id = "product-image";
  titleItem.id = "product-title";
  priceItem.id = "product-price";
  button.id = "button-add-product";

  button.type = "button";
  button.value = "add to basket";
  button.onclick = () => this.send({title: this.title, price: this.price, image: this.image, quantity: 1}, this)

  titleItem.innerHTML = this.title;
  priceItem.innerHTML = "$ " + this.price;
  img.src = this.image;

  container.appendChild(img);
  container.appendChild(titleItem);
  container.appendChild(priceItem);
  container.appendChild(button);
  productList.appendChild(container);
}

basketMediator.addUser(basketModule);
basketModule.mediator = basketModule;

var item1 = new Item("Milk", 2.2, basketMediator, "img/Milk.png")
basketMediator.addUser(item1);

var item2 = new Item("Rye bread", 1.7, basketMediator, "img/Rye bread.png")
basketMediator.addUser(item2);

var item3 = new Item("Free range eggs", 1.5, basketMediator, "img/Free range eggs.png")
basketMediator.addUser(item3);

var item4 = new Item("Canned peas", 3.5, basketMediator, "img/Canned peas.png")
basketMediator.addUser(item4);

var item5 = new Item("Beef steak", 6.5, basketMediator, "img/Beef steak.png")
basketMediator.addUser(item5);

var item6 = new Item("Beans", 2.4, basketMediator, "img/Beans.png")
basketMediator.addUser(item6);

item1.createItem();
item2.createItem();
item3.createItem();
item4.createItem();
item5.createItem();
item6.createItem();










