var ViewModel = function() {
  this.clickCount = ko.observable(0);
  this.name = ko.observable("Tabby");
  this.imgSrc = ko.observable("img/cat1.jpg");
  this.level = ko.computed(function(){
    if (this.clickCount() > 30){
      return "MEGACAT!!!";
    } else if (this.clickCount() > 15){
      return "Intermediate";
    } else {
      return "Baby";
    }
  }, this)

  this.incrementCounter = function(){
    this.clickCount(this.clickCount()+1);
  };
}

ko.applyBindings(new ViewModel());
