var fData = [];
button_id ="1";

function dashboardcallapi(current_lang){

  // $("#firsttab").attr("class", "tab-pane fade");
  // $("#secondtab").attr("class", "tab-pane fade in active");

// $("#secondtab").trigger('click');
 $('.nav-tabs a[href="#secondtab"]').tab('show');  

  document.getElementById('dashboardchart_currlang').innerHTML= "Projects in "+current_lang ; 
  console.log("dashboard Callapi function called");
  postdata={
    title:"dashboard",
    lang:current_lang
  }
  var dataString = JSON.stringify(postdata);  
  $.ajax({

   url: 'http://127.0.0.1:5000/server',
   type: 'POST',
   data: dataString,
   success: function(data) {
    fData = data['data'];
    document.getElementById("area2").innerHTML = "";
    document.getElementById("area1").innerHTML = "";
    dashboard();},
    contentType: "application/json",
    dataType: 'json'
  });
}

var hG={};
var leg = {};
function click_row(button_id){
  //highlight(this);
  
  // console.log(d[0]);
  if(button_id=="1")
    hG.update(fData.map(function(v){ 
      temp_key  =  Object.values(v);
      return [temp_key[0],v.stats["forks"]];}),"#807dba");
  else if(button_id=="2")
    hG.update(fData.map(function(v){ 
      temp_key  =  Object.values(v);
      return [temp_key[0],v.stats["stars"]];}),"#e08214");
  else if(button_id=="4"){

    hG.update(fData.map(function(v){ 
      temp_key  =  Object.values(v);

      var diff = (new Date(v.stats["end_time"])).getTime() - (new Date(v.stats["start_time"])).getTime();
      var day = 1000 * 60 * 60 * 24;

      var days = Math.floor(diff/day);
      var months = Math.floor(days/31);


      return [temp_key[0],months];}),"#A93226");
  }
  else
    hG.update(fData.map(function(v){ 
      temp_key  =  Object.values(v);
      return [temp_key[0],v.stats["contrib_auth"]];}),"#41ab5d");
  
  //d3.select("this").classed("highlight", true);
  //highlight(this);
}




function dashboard()

{
  console.log("insdie dashboard")
  console.log(fData);

  var tF = ['Project Name','Project Id','Owner Type','Stars','Forks','Contributing Authors','Duration(Months)','Start Time','End Time'].map(function(d){ 
    return {type:d, stats: ""}; 
  });    

    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d){
      temp_key  =  Object.values(d);
      console.log(temp_key[0]);
      console.log(d.State);
      return [temp_key[0],d.total];});

    // create the histogram.
        var  leg= legend(tF),hG = histoGram(sF);  // create the legend.

        click_row("1");

      }




      var barColor = 'steelblue';

      
    // function segColor(c){ return {forks:"#807dba", stars:"#e08214",contrib_auth:"#41ab5d"}[c]; }
    
    // compute total for each state.
    fData.forEach(function(d){d.total=d.stats.stars;});
    
    // function to handle histogram.
    function histoGram(fD){


      hG={},    hGDim = {t: 20, r: 350, b: 0, l: 80};
      hGDim.w = screen.availWidth-300 - hGDim.l - hGDim.r, 
      hGDim.h = screen.availHeight-300 - hGDim.t - hGDim.b;

        //create svg for histogram.
        var hGsvg = d3.select('#area2').append("svg")
        .attr("width", hGDim.w + hGDim.l)
        .attr("height", hGDim.h + hGDim.t + hGDim.b + 160).append("g")

        .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
        
        .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
        .attr("transform", "translate(0," + hGDim.h + ")")

        .call(d3.svg.axis().scale(x).orient("bottom"))
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .style("text-anchor", "end")
        .style("font-size", "12px")

        .attr("transform", function(d) {
          return "rotate(-75)"              
        });

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
        .domain([0, d3.max(fD, function(d) { return d[1]; })])
        .nice();

        
        var yAxis = d3.svg.axis()
        .orient("left")
        .scale(y);

        hGsvg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+7+",0)")
        .call(yAxis);

	hGsvg.select(".y.axis")
		.selectAll("text")
        .style("font-size","1px");	
hGsvg.append("text")
    .attr("font","arial")
    .attr("font-size","8px")
    .attr("text-anchor", "end")
    .attr("x","-20%")
    .attr("y", "-15%")
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Count -->");

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
        .append("g").attr("class", "bar");
        
        //create the rectangles.
        bars.append("rect")
        .attr("x", function(d) { return (x(d[0])+2.5); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("width", x.rangeBand())
        .attr("height", function(d) { return hGDim.h - y(d[1]); })
        .attr('fill',barColor)
       //     .on("mouseover",mouseover)// mouseover is defined below.
         //   .on("mouseout",mouseout);// mouseout is defined below.

         .on("click",update_legend);

        //Create the frequency labels above the rectangles.
        // bars.append("text").text(function(d){ return d3.format(",")(d[1])})
        //     .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
        //     .attr("y", function(d) { return y(d[1])-5; })
        //       .attr("font-size","100px")
        //     .attr("text-anchor", "middle");

        function update_legend(d){

          var st = fData.filter(function(s){ 
            temp_key  =  Object.values(s);
            return temp_key[0] == d[0];})[0],
          nD = d3.keys(st.stats).map(function(s){ return {type:s, stats:st.stats[s]};});
          leg.update(nD,Object.values(st));
        }

        

        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.

            y.domain([0, d3.max(nD, function(d) { return d[1]; })])
            .range([hGDim.h, 0]);
            

            yAxis.scale(y);

            d3.select(".y")
            .transition()
            .call(yAxis);

            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);
            
            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
            .attr("y", function(d) {return y(d[1]); })
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
            .text(function(d){ return d3.format(",")(d[1])})

            .attr("y", function(d) {return y(d[1])-5; });   

          }        
          return hG;
        }
    // function to handle legend.
    function legend(lD){
      leg = {};

        // create table for legend.
        var legend = d3.select('#area1').append("table").attr('class','legend');
        var header = legend.append("thead").append("tr");
        header
        .selectAll("th")
        .data(["Description","Details"])
        .enter()
        .append("th")
        .text(function(d) { return d; });
        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        // create the second column for each segment.
        tr.append("td").text(function(d){ return d.type;});

        // create the third column for each segment.
        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
        .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD,name){
            // update the data attached to the row elements.
            var tp=Object.values(nD);
            console.log(tp[1].stats);

      //['contrib_auth','end_time','forks','owner_type','project_id','stars','start_time','Duration']
      
      var new_data=['Project Name','Project Id','Owner Type','Stars','Forks','Contributing Authors','Duration(Months)','Start Time','End Time'].map(function(d){ 
        return {type:d, stats: ""}; 
      }); 
      var diff = (new Date(tp[1].stats)).getTime() - (new Date(tp[6].stats)).getTime();
      var day = 1000 * 60 * 60 * 24;

      var days = Math.floor(diff/day);
      var months = Math.floor(days/31);
      console.log(months);
      console.log(nD);
      console.log(name[0]);

      new_data[0].stats=name[0];
      new_data[1].stats=tp[4].stats;
      new_data[2].stats=tp[3].stats;
      new_data[3].stats=tp[5].stats;
      new_data[4].stats=tp[2].stats;
      new_data[5].stats=tp[0].stats;
      new_data[6].stats=months;
      new_data[7].stats=tp[6].stats;
      new_data[8].stats=tp[1].stats;
      
      console.log(new_data);
      var l = legend.select("tbody").selectAll("tr").data(new_data);

            // update the frequencies.
           // l.select(".legendFreq").text(function(d){ console.log(d.stats); return d3.format(",")(d.stats);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,new_data);});        
          }

        function getLegend(d,aD){ // Utility function to compute percentage.
          return d.stats;
        }

        return leg;
      }



    // calculate total frequency by segment for all state.
    
