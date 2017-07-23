
var initialdata = [
  {
        name:"Tabby2",
        img: "img/cat1.jpg",
        nicks: [{name:"Goldylocks"},
                {name:"Upking"},
                {name: "Teddytalks"}]
  },
  {
        name:"Shooby",
        img: "img/cat2.jpg",
        nicks: [{name:"CaptainShoob"},
                {name:"Candymeow"},
                {name:"StarPurr"}]
  }
]

var Cat = function(data){
  this.clickCount = ko.observable(0);
  this.name = ko.observable(data.name);
  this.imgSrc = ko.observable(data.img);
  this.level = ko.computed(function(){
    if (this.clickCount() > 30){
      return "MEGACAT!!!";
    } else if (this.clickCount() > 15){
      return "Intermediate";
    } else {
      return "Baby";
    }
  }, this)

  this.nicks = ko.observableArray(data.nicks)

}


var ViewModel = function() {
  self = this;

  this.catList = ko.observableArray([]);

  initialdata.forEach(function(catItem){
    self.catList.push(new Cat(catItem));
  });

  self.currentCat = ko.observable( this.catList()[0] );

  this.incrementCounter = function(){
    this.clickCount(this.clickCount()+1);
  };

  self.setcurrentCat = function(){
    console.log("changing cat..")
    self.currentCat(this);
  }
}

ko.applyBindings(new ViewModel());
