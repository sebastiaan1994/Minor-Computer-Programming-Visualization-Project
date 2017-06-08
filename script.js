window.onload = function() {

	//Width and height
	var width = 800, height = 800;

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
	var svg = d3.select("body")
				.append("svg")
				.attr("width", width)
				.attr("height", height);

	var g = svg.append("g")
    		   .style("stroke-width", "1.5px");

    queue()
		.defer(d3.json, "data/map.json")
		.defer(d3.json, "data/teams.json")
		.await(drawMap);



	function drawMap(error, map, teams) {

		//Bind data and create one path per GeoJSON feature
		g.selectAll("path")
	     .data(map.features)
	     .enter()
	     .append("path")
	     .attr("d", path)
	     .attr("stroke", "rgba(8, 81, 156, 0.2)")
	     .attr("fill", "rgba(8, 81, 156, 0.6)")
	     .on("click", clicked);


		g.selectAll(".mark")//adding mark in the group
		 .data(teams)
		 .enter()
		 .append("image")
		 .attr('class', 'mark')
		 .attr('width', 20)
		 .attr('height', 20)
		 .attr("xlink:href", function(d) { return d.crestUrl})
		 .attr("transform", function(d) {
		   return "translate(" + projection([d.longitude,d.latitude]) + ")";
		 })
		 .on("mouseover", function() {
		 	d3.select(this)
		 	  .transition()
		 	  .duration(750)
		 	  .attr("transform", function(d) {
				 return "translate(" + projection([(d.longitude - 1),d.latitude]) + ")";
			  })
		 })
		 .on("mouseout", function() {
		 	d3.select(this)
		 	  .transition()
		 	  .duration(750)
		 	  .attr("transform", function(d) {
				 return "translate(" + projection([d.longitude,d.latitude]) + ")";
			  })
		 });

	};

	function clicked(d) {
		if (active.node() === this) return reset();
		active.classed("active", false);
		active = d3.select(this).classed("active", true);

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
	}
}