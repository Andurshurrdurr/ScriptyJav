var model = {
  currentCat : null,
  cats : [
    { name: 'Anderson',
      clicks: 0,
      imgSrc: "static/img/cat1.jpg"},
    { name: 'Paul',
      clicks: 0,
      imgSrc: "static/img/cat2.jpg" },
    { name: 'Maurice',
      clicks: 0,
      imgSrc: "static/img/cat3.jpg" },
    { name: 'Ron',
      clicks: 0,
      imgSrc: "static/img/cat4.jpg" },
    { name: 'Angelica',
      clicks: 0,
      imgSrc: "static/img/cat5.jpg" },
  ]
}

var controller = {
  // Init, getcurrentcat, get cats, set current cat, increment catcounter
  init : function() {
    console.log("Contoller initializing!")
    // We start by setting the initial cat
    model.currentCat = model.cats[0];

    // Next we initialize the views
    catView.init();
    catListView.init();
    catControlView.init();
  },

  getCurrentCat : function() {
    return model.currentCat;
  },

  getCatList : function(){
    return model.cats;
  },

  setCurrentCat : function(cat){
    model.currentCat = cat;
  },

  incrementCatCounter : function(){
    model.currentCat.clicks++;
    catView.render();
  },
  // Methods for changing stuff in the model
  editCurrentCat : function(cat){
    console.log("editing cat" + cat)

    // Next we search the model for the cat we want to edit
    function getcat(cats, index){
      return cats.name === model.currentCat.name
    }
    var index = model.cats.findIndex(getcat)
    console.log("queried model.. index for cat: " + index)
    // We change the model to reflect our edits
    model.currentCat = cat;
    model.cats[index] = cat;
    // Finally we rerender the views
    catListView.render();
    catView.render();
  }

}

var catView = {
  // init function and render (new cat when selected from list)
  init : function(){
    console.log("catView initializing!")
    this.catNameElem = document.getElementById('catName');
    this.catImg = document.getElementById('catImg');
    this.catClicks = document.getElementById('catClicks');

    this.catImg.addEventListener("click", function() {
      controller.incrementCatCounter();
    })

    this.render();
  },

  render : function(){
    var currentCat = controller.getCurrentCat()
    console.log(currentCat.name)
    this.catNameElem.innerHTML = currentCat.name;
    this.catImg.src = currentCat.imgSrc;
    this.catClicks.innerHTML = currentCat.clicks;
  }
}

var catListView = {
  // Init function to render list and render list function. Add event listener
  init : function() {
    // First we get teh DOM element
    this.catListElem = document.getElementById('catList');
    // Then we render the list of cats
    this.render();
    },
  render : function() {
    var cat, i, elem;
    this.catListElem.innerHTML = "<ul>"
    // Next we get the cats from the model
    var cats = controller.getCatList();
    // And iterate over them
    for ( i = 0 ; i < cats.length ; i++ ) {
      console.log(cats[i].name)
      cat = cats[i]
      // First we add the html for the cat
      elem = document.createElement('li')
      elem.textContent = cat.name;
      // Then we get the DOM element
      console.log("Setting eventlistener for " + cat.name)
      console.log(elem)
      // Finally we add an eventlistener for the dom element
      elem.addEventListener("click", (function(catCopy){
        return function(){
          console.log(catCopy.name + " has been pressed!");
          controller.setCurrentCat(catCopy);
          catView.render();
        };
      })(cat));
      this.catListElem.appendChild(elem);
    }
  }
}

var catControlView = {
  init : function() {
    console.log("init for admin form initialized");
    // We get the elements in DOM
    this.editbutton = document.getElementById("btn-editCat");
    this.editform = document.getElementById("form-editCat");

    this.editname = document.getElementById("editcat-name");
    this.editimg = document.getElementById("editcat-img");
    this.editclicks = document.getElementById("editcat-clicks");
    this.editsubmit = document.getElementById("editcat-submit");
    // And we add the eventlistener for rendering
    this.editbutton.addEventListener("click", function(){
      console.log("buttion pressed");
      catControlView.render();
    });
    // And eventlistener for editing cat
    this.editsubmit.addEventListener("click", function(){
      controller.editCurrentCat({
        name : catControlView.editname.value,
        clicks : catControlView.editclicks.value,
        imgSrc : catControlView.editimg.value
      });
    })
  },

  render : function() {
    console.log("admin button pressed")
    var currentStyle = this.editform.style.display
    // Toggles the form display
    if (currentStyle === "none"){
      console.log("Rendering form..")
      this.editform.style.display = ""
      // Gets the values from current cat
      currcat = controller.getCurrentCat();
      this.editname.value = currcat.name;
      this.editimg.value = currcat.imgSrc;
      this.editclicks.value = currcat.clicks;
    } else{
      console.log("Hiding form..")
      this.editform.style.display = "none"
    }
  }
}

// initialize!
controller.init();
