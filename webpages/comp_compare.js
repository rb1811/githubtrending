    function doublebarchart(data) {
    key_array=Object.keys(data[0])
      // console.log(data1);
      // console.log(data);
      // // key_array=Object.keys(data[0])
        var labelArea = 150;
    var chart,
            width = 450,
            bar_height = 20,
            height = bar_height * data.length;
    var rightOffset = width + labelArea;

    var lCol = ''
    var rCol  = ''
    for ( i = 0; i < key_array.length;i++){
      if (key_array[i] != 'langauge' && !lCol)
      {
        lCol = key_array[i].toString();
      }
      else{

        rCol = key_array[i].toString();
      }
    }

    // console.log(lCol,rCol);

    // var lCol = "google";
    // var rCol = "tensorflow";
   

        var chart = d3.select(".twosided")
                .append('svg')
                .attr('class', 'chart')
                .attr('width', labelArea + width + width)
                .attr('height', height);

        var xFrom = d3.scale.linear()
       
            .domain([0, 50])
        .range([0, width]);

        var xTo = d3.scale.linear()
       
        .domain([0, 50])
        .range([0, width]);
       

        var y = d3.scale.ordinal()
        .domain(data.map(function (d){
            return d.languages
            // return d.langauge
        }))
        .rangeBands([20, height]);    

         var yPosByIndex = function (d) {
         return y(d.languages);
         // return y(d.langauge)
        };

         chart.selectAll("rect.left")
                .data(data)
                .enter().append("rect")
                .attr("x", function (d) {
                    
                    return width - xFrom(d[lCol]);
                    
                })
               
                .attr("y", yPosByIndex)
                .attr("class", "left")
                .attr("width", function (d) {
                    
                    return xFrom(d[lCol]);
            
                })
                .attr("height", y.rangeBand());
            
        chart.selectAll("text.leftscore")
                .data(data)
                .enter().append("text")
                .attr("x", function (d) {
                    return width - xFrom(d[lCol])-40;
                })
                .attr("y", function (d) {
                    return y(d.languages) + y.rangeBand() / 2;
                    // return y(d.langauge) + y.rangeBand() / 2;
                })
                .attr("dx", "20")
                .attr("dy", ".36em")
                .attr("text-anchor", "end")
                .attr('class', 'leftscore')
                .text(function(d){return d[lCol];});        

        chart.selectAll("text.name")
                .data(data)
                .enter().append("text")
                .attr("x", (labelArea / 2) + width)
                .attr("y", function (d) {
                    return y(d.languages) + y.rangeBand() / 2;
                    // return y(d.langauge) + y.rangeBand() / 2;
                })
                .attr("dy", ".20em")
                .attr("text-anchor", "middle")
                .attr('class', 'name')
                .text(function(d){
                  return d.languages;
                  // return d.langauge;
                });
       
        
         chart.selectAll("rect.right")
                .data(data)
                .enter().append("rect")
                .attr("x", rightOffset)
                .attr("y", yPosByIndex)
                .attr("class", "right")
                .attr("width", function (d) {
                   
                    return xTo(d[rCol]);
                    
                })
                .attr("height", y.rangeBand());
        
         chart.selectAll("text.score")
                .data(data)
                .enter().append("text")
                .attr("x", function (d) {
                    return xTo(d[rCol]) + rightOffset+40;
                })
                .attr("y", function (d) {
                    return y(d.languages) + y.rangeBand() / 2;
                    // return y(d.langauge) + y.rangeBand() / 2;
                })
                .attr("dx", -5)
                .attr("dy", ".36em")
                .attr("text-anchor", "end")
                .attr('class', 'score')
                .text(function(d){return d[rCol];});    
       
        chart.append("text").attr("x",width/3).attr("y", 10).attr("class","title").text(lCol);
        chart.append("text").attr("x",width/3+rightOffset).attr("y", 10).attr("class","title").text(rCol);
        chart.append("text").attr("x",width+labelArea/3).attr("y", 10).attr("class","title").text("languages");

        ringchart1();
        ringchart2();

    }



function ringchart1(){

var w = 200;
      var h = 300;

      var dataset = [ 5, 10, 20, 45, 6, 25 ];

      var outerRadius = w / 2;
      var innerRadius = w / 3;
      var arc = d3.svg.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius);
      
      var pie = d3.layout.pie();
      
      //Easy colors accessible via a 10-step ordinal scale
      var color = d3.scale.category10();

      //Create SVG element
      var svg = d3.select(".ringcompany1")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
      
      //Set up groups
      var arcs = svg.selectAll("g.arc")
              .data(pie(dataset))
              .enter()
              .append("g")
              .attr("class", "arc")
              .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
      
      //Draw arc paths
      arcs.append("path")
          .attr("fill", function(d, i) {
            return color(i);
          })
          .attr("d", arc);
      
      //Labels
      arcs.append("text")
          .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
          })
          .attr("text-anchor", "middle")
          .text(function(d) {
            return d.value.toString() ;
          });
      


}

function ringchart2(){

var w = 200;
      var h = 300;

      var dataset = [ 15, 10, 20, 45, 6, 2 ];

      var outerRadius = w / 2;
      var innerRadius = w / 3;
      var arc = d3.svg.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius);
      
      var pie = d3.layout.pie();
      
      //Easy colors accessible via a 10-step ordinal scale
      var color = d3.scale.category10();

      //Create SVG element
      var svg = d3.select(".ringcompany2")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
      
      //Set up groups
      var arcs = svg.selectAll("g.arc")
              .data(pie(dataset))
              .enter()
              .append("g")
              .attr("class", "arc")
              .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
      
      //Draw arc paths
      arcs.append("path")
          .attr("fill", function(d, i) {
            return color(i);
          })
          .attr("d", arc);
      
      //Labels
      arcs.append("text")
          .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
          })
          .attr("text-anchor", "middle")
          .text(function(d) {
            return d.value.toString() ;
          });
      


}


function getdetials()
{
  
  if (document.getElementById('list1').value == document.getElementById('list2').value)
  {
    alert("Please pick 2 different companies");
    return;
  }
  else
  {
  
    postdata={
            title:"twocompanies",
            company1 : document.getElementById('list1').value,
            company2 : document.getElementById('list2').value 
          }
          var dataString = JSON.stringify(postdata);
          

          $.ajax({
            
             url: 'http://127.0.0.1:5000/server',
             type: 'POST',
             data: dataString,
             success: function(data) {  doublebarchart(data['data']);},
             contentType: "application/json",
             dataType: 'json'
          });
  }

}




// $(document).ready(function () {
    
//     doublebarchart(datay);
//     ringchart1();
//     ringchart2();
// });

   
