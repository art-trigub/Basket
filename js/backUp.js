var basketModule = (function() {
  var basket = [];
  return {
    name: "basket",

    createBasket: function() {
      let container = document.createElement('div');
      let descriptionItem = document.createElement('div');
      let img = document.createElement('img');
      let titleItem = document.createElement('div');
      let priceItem = document.createElement('div');
      let quantityItem = document.createElement('div');
      let button = document.createElement('input');
      let basketContainer = document.getElementById('basket-container');
      let ItemContainer = document.getElementById('basket_container-item')
      //basketContainer.removeChild(ItemContainer)

      
      for (var i = 0; i < basket.length; i++) {
        container.id = "basket_container-item";
        descriptionItem.id = "basket_description-item"
        img.id = "basket_product-image";
        titleItem.id = "basket_product-title";
        priceItem.id = "basket_product-price";
        quantityItem.id = "basket_product-quantity";
        button.id = "basket_button-remove-product" + basket.length;
        button.className = "basket_button-remove-product";

        button.setAttribute("data-active", basket[i].title)
        button.type = "button";
        button.value = "Remove";
        //button.onclick = () => this.send({title: this.title, price: this.price, image: this.image, quantity: 1}, this)

        titleItem.innerHTML = basket[i].title;
        priceItem.innerHTML = "$ " + basket[i].price;
        quantityItem.innerHTML ="quantity: " + basket[i].quantity;
        img.src = basket[i].image;

        container.appendChild(img);
        container.appendChild(descriptionItem);
        descriptionItem.appendChild(titleItem);
        descriptionItem.appendChild(priceItem);
        descriptionItem.appendChild(quantityItem);
        descriptionItem.appendChild(button);
        basketContainer.appendChild(container);
      }
    },

    addItem: function(data) {
      for(var i = 0; i < basket.length; i++) {
        if (basket[i].title === data.title) {
          basket[i].quantity +=1
          basketModule.getTotalCost();
          basketModule.createBasket()
          return;
        }
      }
      basket.push(data);
      basketModule.getTotalCost();
      basketModule.createBasket()
    },

    getCountItem: function() {
      return console.log('Товаров добавлено: ' + basket.length + ' шт.')
    },
    
    showBasketItem: function() {
      if(!basket.length) return "Ваша корзина пуста";
    },

    getTotalCost: function() {
      var totalCost = 0;
      var i = basket.length;
      while(i--) {
        console.log(basket[i].quantity)
        totalCost += basket[i].price * basket[i].quantity ;
      }
      let basketTotalCost = document.getElementById('basket_total')
      basketTotalCost.innerHTML = 'Total: ' + totalCost.toFixed(2);
    },

    clearBasket : function() {
      return (basket = [])
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

  button.setAttribute("data-active", this.title)
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

var item1 = new Item("Milk", 2.2, basketMediator, "img/Milk.png")
basketMediator.addUser(item1);

basketMediator.addUser(basketModule);
basketModule.mediator = basketModule;

var item2 = new Item("Rye bread", 1.7, basketMediator, "img/Rye bread.png")
basketMediator.addUser(item2);

var item3 = new Item("Free range eggs", 1.5, basketMediator, "img/Free range eggs.png")
basketMediator.addUser(item3);

var item4 = new Item("Canned peas", 3.5, basketMediator, "img/Canned peas.png")
basketMediator.addUser(item4);

var item5 = new Item("Beef steak", 1.2, basketMediator, "img/Beef steak.png")
basketMediator.addUser(item5);

var item6 = new Item("Beans", 4.7, basketMediator, "img/Beans.png")
basketMediator.addUser(item6);

item1.createItem();
item2.createItem();
item3.createItem();
item4.createItem();
item5.createItem();
item6.createItem();










