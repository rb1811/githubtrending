var json = {
     "name": "languages",
     "children": [
     ]
}

function callapi(){
          console.log("Callapi function called");
          postdata={
            title:"languages"
          }
          var dataString = JSON.stringify(postdata);
          // console.log(dataString);

          $.ajax({
            
             url: 'http://127.0.0.1:5000/server',
             type: 'POST',
             data: dataString,
             success: function(data) {  makeGraph(data);},
             contentType: "application/json",
             dataType: 'json'
          });

  }

function makeGraph(data){
 // console.log(data);

for (i =0;i<data['data'].length;i++){
  json['children'].push({"name": data['data'][i][0],"size":data['data'][i][1].toString()})
}
 // console.log(json['children'].length);


var bleed = 100,
    width = 960,
    height = 960;

var pack = d3.layout.pack()
    .sort(null)
    .size([width, height + bleed * 2])
    .padding(2);

var svg = d3.select(".bubbleChart").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(0," + -bleed + ")");


  var node = svg.selectAll(".node")
      .data(pack.nodes(flatten(json))
        .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.name+ ": " +d.value });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .on("click", function(d) {
        alert("on click" );
    });

  node.append("text")
      .text(function(d) { return d.name; })
      .style("font-size", function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
      .attr("dy", ".35em");


// Returns a flattened hierarchy containing all leaf nodes under the root.
function flatten(root) {
  var nodes = [];

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    else nodes.push({name: node.name, value: node.size});
  }

  recurse(root);
  return {children: nodes};
}
}

// Ruk call kar raa
$(document).ready(function () {
  
  callapi();
});
