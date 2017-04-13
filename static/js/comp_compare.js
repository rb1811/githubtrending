pircolors=["#2484c1","#0c6197","#4daa4b","#90c469","#daca61","#e4a14b","#e98125","#cb2121","#830909","#923e99","#ae83d5","#bf273e","#ce2aeb","#bca44a","#618d1b","#1ee67b","#b0ec44","#a4a0c9","#322849","#86f71a","#d1c87f","#7d9058","#44b9b0","#7c37c0","#cc9fb1","#e65414","#8b6834","#248838"]

piedata= {
  "header": {
    "title": {
      "text": "Programming Languages of ",
      "fontSize": 24,
      "font": "open sans"
    },
    "subtitle": {
      "text": "",
      "color": "#999999",
      "fontSize": 12,
      "font": "open sans"
    },
    "titleSubtitlePadding": 9
  },
  "footer": {
    "color": "#999999",
    "fontSize": 10,
    "font": "open sans",
    "location": "bottom-left"
  },
  "size": {
    "canvasWidth": 590,
    "pieOuterRadius": "90%"
  },
  "data": {
    "sortOrder": "value-desc",
    "content": []
  },
  "labels": {
    "outer": {
      "pieDistance": 32
    },
    "inner": {
      "hideWhenLessThanPercentage": 3
    },
    "mainLabel": {
      "fontSize": 11
    },
    "percentage": {
      "color": "#ffffff",
      "decimalPlaces": 0
    },
    "value": {
      "color": "#adadad",
      "fontSize": 11
    },
    "lines": {
      "enabled": true
    },
    "truncation": {
      "enabled": true
    }
  },
  "effects": {
    "pullOutSegmentOnClick": {
      "effect": "linear",
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "gradient": {
      "enabled": true,
      "percentage": 100
    }
  }
}




    function doublebarchart(data) {
      $("#comp_barchart").show();
    key_array=Object.keys(data[0])
     
        var labelArea = 150;
    var chart,
            width = 450,
            bar_height = 20,
            height = bar_height * data.length;
    var rightOffset = width + labelArea;
    var lCol = document.getElementById('list1').value
    var rCol  = document.getElementById('list2').value
   

        var chart = d3.select(".twosided")
                // .append('svg')
                // .attr('class', 'chart')
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
          
        }))
        .rangeBands([20, height]);    

         var yPosByIndex = function (d) {
         return y(d.languages);
         
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
                   
                })
                .attr("dy", ".20em")
                .attr("text-anchor", "middle")
                .attr('class', 'name')
                .text(function(d){
                  return d.languages;
               
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
           
                })
                .attr("dx", -5)
                .attr("dy", ".36em")
                .attr("text-anchor", "end")
                .attr('class', 'score')
                .text(function(d){return d[rCol];});    
       
        chart.append("text").attr("x",width/3).attr("y", 10).attr("class","title").text("");
        chart.append("text").attr("x",width/3+rightOffset).attr("y", 10).attr("class","title").text("");
        chart.append("text").attr("x",width+labelArea/3).attr("y", 10).attr("class","title").text("All Languages");

        pie1(data);
        pie2(data);


    }


function pie1(data)
{
  document.getElementById('pie1').innerHTML = "";
  piedata['header']['title']['text'] = piedata['header']['title']['text'] + document.getElementById('list1').value
fdata  = piedata;
for (i=0;i<data.length;i++)
  {
    temp_dict = {}

    if (data[i][document.getElementById('list1').value])
    {
      temp_dict['label'] = data[i]['languages'];
      temp_dict['value'] = data[i][document.getElementById('list1').value];
      temp_dict ['color'] = pircolors[i] ;
      fdata['data']['content'].push(temp_dict);
    }   
}

var pie = new d3pie("pie1", fdata);

piedata['data']['content']=[];
}


function pie2(data)
{document.getElementById('pie2').innerHTML = "";
  piedata['header']['title']['text'] = "Programming languages of "
  piedata['header']['title']['text'] = piedata['header']['title']['text'] + document.getElementById('list2').value
fdata  = piedata;
for (i=0;i<data.length;i++)
  {
    temp_dict = {}
    if (data[i][document.getElementById('list2').value])
    {
      temp_dict['label'] = data[i]['languages'];
      temp_dict['value'] = data[i][document.getElementById('list2').value];
      temp_dict ['color'] = pircolors[i] ;
      fdata['data']['content'].push(temp_dict);
    }   
}

var pie = new d3pie("pie2", fdata);
piedata['data']['content']=[];
}





function getdetials()
{
  
  if (document.getElementById('list1').value == document.getElementById('list2').value)
  {
    $("#alert_message").show();
    document.getElementById("alert_message").innerHTML= "Please pick 2 different companies";
    return;
  }
  else
  {
   $("#alert_message").hide();
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
             success: function(data) { 
              // d3.selectAll("svg > *").remove();
              pie1(data['data']);
              pie2(data['data']);
            },
              // doublebarchart(data['data']);},
             contentType: "application/json",
             dataType: 'json'
          });
  }

}




$(document).ready(function () {
    
$("#comp_barchart").hide();
});

   
