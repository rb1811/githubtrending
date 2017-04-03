function dashboardcallapi(current_lang){

        $("#firsttab").attr("class", "tab-pane fade");
        $("#secondtab").attr("class", "tab-pane fade in active");
    	
          console.log("dashboard Callapi function called");
          postdata={
            title:"dashboard",
            lang:current_lang
          }
          var dataString = JSON.stringify(postdata);
          // console.log(dataString);

          $.ajax({
            
             url: 'http://127.0.0.1:5000/server',
             type: 'POST',
             data: dataString,
             success: function(data) {  dashboardmakeGraph(data);},
             contentType: "application/json",
             dataType: 'json'
          });
    }
function dashboardmakeGraph(data)
{
	console.log(data);
}


