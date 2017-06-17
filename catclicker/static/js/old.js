var selectedName = document.getElementById('catName');
var selectedImg = document.getElementById('catImg');
var selectedRes = document.getElementById('catRes');
var catList = document.getElementById('catList');

var catnames = ['Anderson', 'Paul', 'Maurice', 'Ron', 'Angelica'];
var catclicks = [0,0,0,0,0,0];

var selectedCat = 5;

for (var i = 0; i < catnames.length; i++) {
  var elem = document.createElement('p');
  var name = catnames[i];
  elem.textContent = name;
  catList.appendChild(elem);
  elem.addEventListener('click', (function(numCopy){
    return function(){
      // Moves the cat to the selected cat
      selectedName.innerHTML = catnames[numCopy];
      selectedImg.src = "static/img/cat" + (numCopy+1) + ".jpg";
      selectedRes.innerHTML = catclicks[numCopy];
      selectedCat = numCopy;

    };
  })(i));
}

selectedImg.addEventListener('click', function(){
  catclicks[selectedCat] += 1;
  selectedRes.innerHTML = catclicks[selectedCat];
});
