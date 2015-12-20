var model = {
  board_size: 7,
  num_ships: 3,
  ship_length: 3,
  ships_sunk: 0,
  
  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }
  ],

  fire: function(guess) {
    for (var i = 0; i < this.num_ships; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);

      if (ship.hits[index] === "hit") {
        view.displayMessage("Oops, you already hit that location!");
        return true;
      } else if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");

        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.ships_sunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },

  isSunk: function(ship) {
    for (var i = 0; i < this.ship_length; i++)  {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
      return true;
  },

  generateShipLocations: function() {
    var locations;
    for (var i = 0; i < this.num_ships; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
    console.log("Ships array: ");
    console.log(this.ships);
  },

  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction === 1) { // horizontal
      row = Math.floor(Math.random() * this.board_size);
      col = Math.floor(Math.random() * (this.board_size - this.ship_length + 1));
    } else { // vertical
      row = Math.floor(Math.random() * (this.board_size - this.ship_length + 1));
      col = Math.floor(Math.random() * this.board_size);
    }

    var new_ship_locations = [];
    for (var i = 0; i < this.ship_length; i++) {
      if (direction === 1) {
        new_ship_locations.push(row + "" + (col + i));
      } else {
        new_ship_locations.push((row + i) + "" + col);
      }
    }
    return new_ship_locations;
  },

  collision: function(locations) {
    for (var i = 0; i < this.num_ships; i++) {
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
  
}; 


var view = {
  displayMessage: function(msg) {
    var message_area = document.getElementById("message_area");
    message_area.innerHTML = msg;
  },

  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },

  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }

}; 

var controller = {
  guesses: 0,

  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.ships_sunk === model.num_ships) {
          view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
      }
    }
  }
}


// helper function to parse a guess from the user

function parseGuess(guess) {
  var letters = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    var first_char = guess.charAt(0);
    var row = letters.indexOf(first_char);
    var column = guess.charAt(1);
    
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
    } else if (row < 0 || row >= model.board_size ||
               column < 0 || column >= model.board_size) {
      alert("Oops, that's off the board!");
    } else {
      return row + column;
    }
  }
  return null;
}


// event handlers

function handlefire_button() {
  var guess_input = document.getElementById("guess_input");
  var guess = guess_input.value.toUpperCase();

  controller.processGuess(guess);

  guess_input.value = "";
}

function handleKeyPress(e) {
  var fire_button = document.getElementById("fire_button");

  // in IE9 and earlier, the event object doesn't get passed
  // to the event handler correctly, so we use window.event instead.
  e = e || window.event;

  if (e.keyCode === 13) {
    fire_button.click();
    return false;
  }
}


// init - called when the page has completed loading

window.onload = init;

function init() {
  // Fire! button onclick handler
  var fire_button = document.getElementById("fire_button");
  fire_button.onclick = handlefire_button;

  // handle "return" key press
  var guess_input = document.getElementById("guess_input");
  guess_input.onkeypress = handleKeyPress;

  // place the ships on the game board
  model.generateShipLocations();
}
