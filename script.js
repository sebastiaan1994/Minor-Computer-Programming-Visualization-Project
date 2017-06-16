window.onload = function() {

	//Width and height
	var width = 800, height = 800;
	var logoWidth = 20, logoHeight = 20, logoAdjust = logoWidth / 2;

	var active = d3.select(null);

	//Define map projection
	var projection = d3.geo.mercator()
						   .center([ 5, 48 ])
						   .translate([ width/2, height/2 ])
						   .scale([width + 400]);

	//Define path generator
	var path = d3.geo.path()
					 .projection(projection);


	//Create SVG
	var svg = d3.select("#svg")
				.append("svg")
				.attr("id", "map")
				.attr("width", width)
				.attr("height", height);

	var g = svg.append("g")
    		   .style("stroke-width", "1.5px");

    queue()
		.defer(d3.json, "data/map.json")
		.defer(d3.json, "data/teams.json")
		.await(drawMap);

	var teamdata = {}

	queue()
		.defer(d3.csv, "data/playerdata.csv")
		.await(drawChart);
	 
	var table = $(document).ready(function() {
	    $('#table').DataTable( {
	        data: leagueTables,
	        lengthChange: false,
	        destroy: true,
	        columns: [
	            { title: "Position" },
	            { title: "League" },
	            { title: "Team" },
	            { title: "Played" },
	            { title: "Wins" },
	            { title: "Draws" },
	            { title: "Losses" },
	            { title: "Goals Scored" },
	            { title: "Goals Conceded" },
	            { title: "Difference" },
	            { title: "Points" }
	        ]
	    });
	});

	function drawChart(error, playerData) {

		playerData.forEach(function (d, i) {
			d.age = +d.age
			d.goals = +d.goals
			d.minutes = +d.minutes
			d.red = +d.red
			d.yellow = +d.yellow
			})

		var margin = { top: 50, right: 300, bottom: 50, left: 50 },
		    outerWidth = 1000,
		    outerHeight = 400,
		    chartWidth = outerWidth - margin.left - margin.right,
		    chartHeight = outerHeight - margin.top - margin.bottom;

		var x = d3.scale.linear()
		    .range([0, chartWidth]).nice();

		var y = d3.scale.linear()
		    .range([chartHeight, 0]).nice();

		var wCat = "name"
			xCat = "goals",
		    yCat = "minutes",
		    rCat = "age",
		    colorCat = "team";

		  var xMax = d3.max(playerData, function(d) { return d[xCat]; }) * 1.05,
		      xMin = d3.min(playerData, function(d) { return d[xCat]; }),
		      xMin = xMin > 0 ? 0 : xMin,
		      yMax = d3.max(playerData, function(d) { return d[yCat]; }) * 1.05,
		      yMin = d3.min(playerData, function(d) { return d[yCat]; }),
		      yMin = yMin > 0 ? 0 : yMin;

		  x.domain([xMin, xMax]);
		  y.domain([yMin, yMax]);

		  var xAxis = d3.svg.axis()
		      .scale(x)
		      .orient("bottom")
		      .tickSize(-chartHeight);

		  var yAxis = d3.svg.axis()
		      .scale(y)
		      .orient("left")
		      .tickSize(-chartWidth);

		  var color = d3.scale.category10();

		  var tip = d3.tip()
		      .attr("class", "d3-tip")
		      .offset([-10, 0])
		      .html(function(d) {
		        return wCat + ": " + d[wCat] + "<br>" + rCat + ": " + d[rCat] + "<br>" + colorCat + ": " + d[colorCat] + "<br>" + xCat + ": " + d[xCat] + "<br>" + yCat + ": " + d[yCat];
		      });

		  var zoomBeh = d3.behavior.zoom()
		      .x(x)
		      .y(y)
		      .scaleExtent([0, 500])
		      .on("zoom", zoom);

		  var chartSvg = d3.select("#chart")
		    .append("svg")
		      .attr("class", "scatter")
		      .attr("width", outerWidth)
		      .attr("height", outerHeight)
		    .append("g")
		      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		      .call(zoomBeh);

		  chartSvg.call(tip);

		  chartSvg.append("rect")
		      .attr("width", chartWidth)
		      .attr("height", chartHeight);

		  chartSvg.append("g")
		  	  .attr("id", "axis")
		      .classed("x axis", true)
		      .attr("transform", "translate(0," + chartHeight + ")")
		      .call(xAxis)
		    .append("text")
		      .classed("label", true)
		      .attr("x", chartWidth)
		      .attr("y", margin.bottom - 10)
		      .style("text-anchor", "end")
		      .text(xCat);

		  chartSvg.append("g")
		  	  .attr("id", "axis")
		      .classed("y axis", true)
		      .call(yAxis)
		    .append("text")
		      .classed("label", true)
		      .attr("transform", "rotate(-90)")
		      .attr("y", -margin.left)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end")
		      .text(yCat);

		  var objects = chartSvg.append("svg")
		      .classed("objects", true)
		      .attr("width", chartWidth)
		      .attr("height", chartHeight);

		  objects.append("svg:line")
		      .classed("axisLine hAxisLine", true)
		      .attr("x1", 0)
		      .attr("y1", 0)
		      .attr("x2", chartWidth)
		      .attr("y2", 0)
		      .attr("transform", "translate(0," + chartHeight + ")");

		  objects.append("svg:line")
		      .classed("axisLine vAxisLine", true)
		      .attr("x1", 0)
		      .attr("y1", 0)
		      .attr("x2", 0)
		      .attr("y2", chartHeight);

		  objects.selectAll(".dot")
		      .data(playerData)
		    .enter().append("circle")
		      .classed("dot", true)
		      .attr("r", function (d) { return 3 * Math.sqrt(d[rCat] / Math.PI); })
		      .attr("transform", transform)
		      .style("fill", function(d) { return color(d[colorCat]); })
		      .on("mouseover", tip.show)
		      .on("mouseout", tip.hide);

		  d3.select("input").on("click", change);

		    function change() {
			    xCat = "Goals";
			    xMax = d3.max(playerData, function(d) { return d[xCat]; });
			    xMin = d3.min(playerData, function(d) { return d[xCat]; });

			    zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

			    var svgChart = d3.select("#svgChart").transition();

			    svgChart.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

			    objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
			  }

			  function zoom() {
			    chartSvg.select(".x.axis").call(xAxis);
			    chartSvg.select(".y.axis").call(yAxis);

			    chartSvg.selectAll(".dot")
			        .attr("transform", transform);
			  }

			  function transform(d) {
			    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
			  }
	}

	function drawTable(league) {

		table = $('#table').DataTable().clear().draw();
		    $('#table').DataTable( {
		        data: league,
		        lengthChange: false,
		        destroy: true
		    });

	}

	function drawMap(error, map, teams) {
		//Bind data and create one path per GeoJSON feature
		g.selectAll("path")
	     .data(map.features)
	     .enter()
	     .append("path")
	     .attr("id", map.features.properties)
	     .attr("d", path)
	     .attr("stroke", "rgba(8, 81, 156, 0.2)")
	     .attr("fill", "rgba(8, 81, 156, 0.6)")
	     .on("click", clicked);

	  	teamdata = teams

		g.selectAll("#mark")//adding mark in the group
		 .data(teams)
		 .enter()
		 .append("image")
		 .attr('id', 'mark')
		 .attr('class', function(d) { return d.league})
		 .attr('x', -logoAdjust)
		 .attr('y', -logoAdjust)
		 .attr('width', logoWidth)
		 .attr('height', logoHeight)
		 .attr("xlink:href", function(d) { return d.crestUrl})
		 .attr("transform", function(d) {
		   return "translate(" + projection([d.longitude, d.latitude]) + ")";
		 })

	};
	function logoTransit(teamdata, league) {

		if (league == 'Premier.League'){
			d3.selectAll("." + league)
			.transition()
		 	.duration(750)
		 	.attr("transform", function(d) {
				 return "translate(" + 0 + "," + 0 + ")"})
		 	.attr("y", function(d, i) { return -3 + (i * 17) })
		 	.attr('width', logoWidth - 4)
			.attr('height', logoHeight - 4)
			.attr("x", "50");
		}

		if (league == 'Bundesliga'){
			d3.selectAll("." + league)
			.transition()
		 	.duration(750)
		 	.attr("transform", function(d) {
				 return "translate(" + 0 + "," + 0 + ")"})
		 	.attr("y", function(d, i) { return 228 + (i * 10) })
		 	.attr('width', logoWidth - 10)
			.attr('height', logoHeight - 10)
			.attr("x", "400");
		}

		if (league == 'Primera.Division'){
			d3.selectAll("." + league)
			.transition()
		 	.duration(750)
		 	.attr("transform", function(d) {
				 return "translate(" + 0 + "," + 0 + ")"})
		 	.attr("y", function(d, i) { return 620 + (i * 16) })
		 	.attr('width', logoWidth - 5)
			.attr('height', logoHeight - 5)
			.attr("x", "-65");
		}

		if (league == 'Serie.A'){
			d3.selectAll("." + league)
			.transition()
		 	.duration(750)
		 	.attr("transform", function(d) {
				 return "translate(" + 0 + "," + 0 + ")"})
		 	.attr("y", function(d, i) { return 430 + (i * 14) })
		 	.attr('width', logoWidth - 7)
			.attr('height', logoHeight - 7)
			.attr("x", "415");
		}

		d3.selectAll("#mark").on("click", function() {
		  d3.select(this)
		  	.transition()
			.duration(750)
			.attr("x", -logoAdjust)
			.attr("y", -logoAdjust)
			.attr("width", logoWidth)
			.attr("height", logoHeight)
			.attr("transform", function(d) {
	      return "translate(" + projection([d.longitude, d.latitude]) + ")"});
	  		})
		};
		
			
	
	function clicked(d) {
		if (active.node() === this) {
			d3.selectAll("#mark")
				.transition()
				.duration(750)
				.attr("x", -logoAdjust)
				.attr("y", -logoAdjust)
				.attr("width", logoWidth)
				.attr("height", logoHeight)
				.attr("transform", function(d) {
		      return "translate(" + projection([d.longitude, d.latitude]) + ")";
		    })
			return reset();
		}
		active.classed("active", false);
		active = d3.select(this).classed("active", true);

		if (d.properties.admin == 'United Kingdom') {
			svg.append('image')
		 	   .attr('class', 'logoLeague')
			   .attr('y', -200)
			   .attr('opacity', 0)
			   .transition()
			   .duration(1000)
			   .attr('y', -75)
			   .attr('opacity', 100)
			   .attr('width', 200)
			   .attr('height', 240)
			   .attr("xlink:href","https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg");

			logoTransit(teamdata, 'Premier.League')
			drawTable(premierLeague);
			
		}

		if (d.properties.admin == 'Germany') {
			svg.append('image')
		 	   .attr('class', 'logoLeague')
			   .attr('y', -200)
			   .attr('opacity', 0)
			   .transition()
			   .duration(1000)
			   .attr('y', 0)
			   .attr('opacity', 100)
			   .attr('width', 180)
			   .attr('height', 220)
			   .attr("xlink:href","https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg");

			logoTransit(teamdata, 'Bundesliga')
			drawTable(bundesliga);
		}

		if (d.properties.admin == 'Spain') {
			svg.append('image')
		 	   .attr('class', 'logoLeague')
			   .attr('y', -200)
			   .attr('opacity', 0)
			   .transition()
			   .duration(1000)
			   .attr('y', 0)
			   .attr('opacity', 100)
			   .attr('width', 180)
			   .attr('height', 220)
			   .attr("xlink:href","https://files.laliga.es/seccion_logos/laliga-v-600x600.png");

			logoTransit(teamdata, 'Primera.Division')
			drawTable(primeraDivision);
		}

		if (d.properties.admin == 'Italy') {
			svg.append('image')
		 	   .attr('class', 'logoLeague')
			   .attr('y', -200)
			   .attr('x', 600)
			   .attr('opacity', 0)
			   .transition()
			   .duration(1000)
			   .attr('y', 50)
			   .attr('opacity', 100)
			   .attr('width', 180)
			   .attr('height', 220)
			   .attr("xlink:href","https://upload.wikimedia.org/wikipedia/en/f/f7/LegaSerieAlogoTIM.png");

			logoTransit(teamdata, 'Serie.A')
			drawTable(serieA);
		}

		var bounds = path.bounds(d),
	    	dx = bounds[1][0] - bounds[0][0],
	    	dy = bounds[1][1] - bounds[0][1],
	    	x = (bounds[0][0] + bounds[1][0]) / 2,
	    	y = (bounds[0][1] + bounds[1][1]) / 2,
	    	scale = 1 / Math.max(dx / width, dy / height),
	    	translate = [width / 2 - scale * x, height / 2 - scale * y];

		g.transition()
	     .duration(750)
	     .style("stroke-width", 1.5 / scale + "px")
	     .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

	}

	function reset() {
		active.classed("active", false);
		active = d3.select(null);

		g.transition()
	     .duration(750)
	     .style("stroke-width", "1.5px")
	     .attr("transform", "");

	    d3.select('.logoLeague')
	      .transition()
	      .duration(1000)
	      .attr('y', -200)
	      .remove();


	}
}