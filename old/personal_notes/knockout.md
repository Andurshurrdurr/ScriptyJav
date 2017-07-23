# Knockout Js
*Personal notes*

## Knockout what?
Knockout is a javascript framework for creating a MVVM in the browser. It grants the ability to create observable objects which change the view as data is changed in the application.

For example we may set an observable variable equal to an input field in our application as the submit button is pressed. When the submit button is pressed, the variable is updated - and this gets transmitted to the rest of the view where the variable is being used. This enables the Model-View-ViewModel pattern.

**Features:**
- Observables and observable arrays which autoupdates the view
- Makes markup easy to read using `data-link=""` attribute to an html element
- Grants control flow in view with `foreach`, `if, else` and `with` statements
- And more, but I will just go into these things for now

**Sources for confusion:**
- Observables are called like functions, eg: if meal attribute is an observable we may do:
  `meal().price` to get the price in our view or something
- A good rule is to initiate the self variable when calling a class and using that instead of `this`. Like so: `var self = this;` self only changes then if you write code to change it, while this always points to the object it is called for, which may result in some issues
- When calling a `$root.function` from a foreach statement in the view, the current object will be passed as a parameter to the function from the view

**Typical workflow:**
1. First we identify in our view where we want data links to be, we ask ourselves how/what data we wish to present. Particularly:
  * Do we need a foreach element somewhere
  * Are we taking the input from somewhere and presenting it somewhere else
2. After analysis of what our application does we set up the initial javascript
  * We create classes with desired obeservables as its attributes
  * We create a class for the viewmodel. This should have initial data from db.
  * In the VM we create an object initiated from the classes for our data
  * Next we create operations to add and alter the object/data in our VM
  * And we let our classes (for the data) have getters and setters as we desire

  This may be easier to explain with some psuedocode -> here for a class:
        Class seatReservation(name, meal){
          // Initial values
          self.name = name, self.meal=ko.observable(meal)
          // Price calculated
          self.price = ko.computed(function(){
              price = self.meal().price
              return price
            })
        }

  Next for our View Model:

        Class ReservationViewModel(){
          // declare the self attribute(do this in the above class too)
          self = this;
          // data from database
          self.data = [{mealName: "nomnom", price:4321}]
          // Editable data
          self.seats = ko.observableArray[]
          // Operators
          self.addseats = function(){self.seats.push(name, data[0])}
        }

    Finally apply the bindings:

    `ko.applyBindings(new ReservationsViewModel());`

  3. In our view we may now easily add and alter our model from the view by calling the appropriate codes in `data-bind=""`
