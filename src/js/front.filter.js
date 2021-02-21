libAttribute.push(
    {'attr': 'filter', 'func': 'bindFilter'}
);

var target;

function bindFilter(el) {
  target = el;
}

function filter(){
  var e = event && (event.target || event.srcElement);
  var filter = e.value.toUpperCase();

  var children = _.getChildren(target);

  for(i = 0; i < children.length; i++){
    
    if (children[i].childElementCount > 0) {
      var child = _.getChildren(children[i]);
      
      for(j = 0; j < child.length; j++) {
        if (child[j].hasAttribute('filteron')) {
          if (child[j].textContent.toUpperCase().indexOf(filter) > -1)
            children[i].style.display = "";
          else
            children[i].style.display = "none";
        }
      }
    }
  
  }

}