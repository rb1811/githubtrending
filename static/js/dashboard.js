function dashboardcallapi(current_lang){

        $("#firsttab").attr("class", "tab-pane fade");
        $("#secondtab").attr("class", "tab-pane fade in active");
    	
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
             success: function(data) { dashboard(data['data']);},
             contentType: "application/json",
             dataType: 'json'
          });
    }



function dashboard(fData){
  console.log("insdie dashboard")
  console.log(fData);

var table = d3.select("#area0").append("table");
 var header = table.append("thead").append("tr");
        header
                .selectAll("th")
                .data(["Paramters"])
                .enter()
                .append("th")
                .text(function(d) { return d; });
     var tablebody = table.append("tbody");
        rows = tablebody
                .selectAll("tr")
                .data(["1. Forks","2. Stargazers","3. Contributing Authors"])
                .enter()
                .append("tr")
        .text(function(d) { return d; })
        .on("click",click_row);
     cells = rows.selectAll("td")
            // each row has data associated; we get it and enter it for the cells.
                .data(["forks"])
                .enter()
                .append("td")
              ;
        
function click_row(d){
  //highlight(this);
  
  console.log(d[0]);
  if(d[0]=="1")
    hG.update(fData.map(function(v){ 
        temp_key  =  Object.values(v);
                return [temp_key[0],v.stats["forks"]];}),segColor(["forks"]));
  else if(d[0]=="2")
    hG.update(fData.map(function(v){ 
        temp_key  =  Object.values(v);
                return [temp_key[0],v.stats["stars"]];}),segColor(["stars"]));
  else
    hG.update(fData.map(function(v){ 
        temp_key  =  Object.values(v);
                return [temp_key[0],v.stats["contrib_auth"]];}),segColor(["contrib_auth"]));
  d3.selectAll("tr").style({"background-color": "#ffff99"});
  d3.select(this).style({"background-color": "#ffff1a"});
  //d3.select("this").classed("highlight", true);
  //highlight(this);
}



    var barColor = 'steelblue';
  
      
    function segColor(c){ return {forks:"#807dba", stars:"#e08214",contrib_auth:"#41ab5d"}[c]; }
    
    // compute total for each state.
    fData.forEach(function(d){d.total=d.stats.stars;});
    
    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 20, r: 0, b: 0, l: 60};
        hGDim.w = 1000 - hGDim.l - hGDim.r, 
        hGDim.h = 500 - hGDim.t - hGDim.b;
            
        //create svg for histogram.
        var hGsvg = d3.select('#area2').append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
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
            .attr("transform", "translate("+10+",0)")
            .call(yAxis);
        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");
        
        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor)
       //     .on("mouseover",mouseover)// mouseover is defined below.
         //   .on("mouseout",mouseout);// mouseout is defined below.
     
      .on("click",update_legend);
            
        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
      
            .attr("text-anchor", "middle");
      
     function update_legend(d){
        var st = fData.filter(function(s){ 
        temp_key  =  Object.values(s);
        return temp_key[0] == d[0];})[0],
                nD = d3.keys(st.stats).map(function(s){ return {type:s, stats:st.stats[s]};});
        leg.update(nD,Object.values(st));
     }

        
       /* function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected state.
            var st = fData.filter(function(s){ return s.State == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
               
            // call update functions of pie-chart and legend.    
            pC.update(nD);
            leg.update(nD);
        }
        
        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            pC.update(tF);
            leg.update(tF);
        }
        */
        // create function to update the bars. This will be used by pie-chart.
       hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
      
            y.domain([0, d3.max(nD, function(d) { return d[1]; })])
        .range([hGDim.h, 0]);
            
      //  y = d3.scale.linear().range([hGDim.h, 0])
            //    .domain([0, d3.max(nD, function(d) { return d[1]; })]);

        
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
    
    // function to handle pieChart.
   /* function pieChart(pD){
        var pC ={},    pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
                
        // create svg for pie chart.
        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
        
        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }        
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){ 
                return [v.State,v.freq[d.data.type]];}),segColor(d.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.State,v.total];}), barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    
        return pC;
    }*/
    
    // function to handle legend.
    function legend(lD){
        var leg = {};
            
        // create table for legend.
        var legend = d3.select('#area1').append("table").attr('class','legend');
        var header = legend.append("thead").append("tr");
        header
                .selectAll("th")
                .data(["Summary"])
                .enter()
                .append("th")
                .text(function(d) { return d; });
        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
            
        // create the first column for each segment.
      /*  tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
      .attr("fill",function(d){ return segColor(d.type); });
        */    
        // create the second column for each segment.
        tr.append("td").text(function(d){ return d.type;});

        // create the third column for each segment.
      /*  tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.freq);});
*/
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
        //pC = pieChart(tF), // create the pie-chart.
        var  leg= legend(tF),hG = histoGram(sF);  // create the legend.
  

}



