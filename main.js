d3.csv("data/movies.csv", function(data) {


    var nested_data = d3.nest().key(function(d) {
        if (d.content_rating === "") {
            return "No Content Rating Reported";
        }

        return d.content_rating;
    }).key(function(e) {
        if (e.imdb_score === "") {
            return "No IMDB Score Reported";
        }

        return e.imdb_score;
    }).key(function(z) {
        if (z.budget === "") {
            return "No Budget Reported.";
        }

        return "$" + z.budget;
    }).rollup(function(v) {
        return v.length;
    }).entries(data);

    nested_data = nested_data.sort(function(a, b) {
        return d3.sum(b.values, function(c) {
            return d3.sum(c.values, function(d) {
                return d.value;
            });
        }) - d3.sum(a.values, function(c) {
            return d3.sum(c.values, function(d) {
                return d.value;
            });
        });
    });

    nested_data.forEach((content_rating) => {
        content_rating.values.sort(function(a, b) {
            return d3.sum(b.values, function(t) {
                return t.value;
            }) - d3.sum(a.values, function(t) {
                return t.value;
            });
        });
        content_rating.values.forEach((imdb_score) => {
            imdb_score.values.sort(function(a,b) {
                return b.value - a.value;
            });
        });
    });

    nested_data = {"key": "MOVIES", "values": nested_data};
    nested_data = { "name": "MOVIES", "label": "MOVIES", "children":
        nested_data.values.map( function(content_rating) {
            return { "name": content_rating.key, "label": content_rating.key, "children":
              content_rating.values.map( function(imdb_score) {
                 return { "name": imdb_score.key, "label": imdb_score.key, "children":
                    imdb_score.values.map(function(budget) {
                        return {"name": budget.key, "label": budget.key, "size": budget.value}
                    })
                };
              })
            };
        })
    };


  var color = d3.scaleOrdinal()
  .domain(["Rated R", "Rated PG-13", "No Content Rating", "Rated PG", "Not Rated", "Rated TV-14", "Rated TV-MA", "Rated G", "Rated TV-PG", "Unrated",
    "Rated TV-G", "Rated TV-Y", "Rated NC-17", "Rated TV-Y7"])
  .range(["#69D2E7", "#A7DBDB", "#E0E4CC", "#F38630", "#FA6900", "#D0C91F", "#85C4B9",
    "#008BBA", "#E9514C", "#DC403B"]);

  var root = d3.hierarchy(nested_data);
    var width = 1040,
        height = 600;
    var div = d3.select("body").append("div")
    .attr("class","treemap")
    .style("position", "relative")
    .style("width", width + "px")
    .style("height", height + "px");



    // var tool = d3.select("body").append("div").attr("class", "toolTip");

    //         var treemap = d3.treemap()
    //         .size([width, height])

    //         const tree = treemap(root);

    //             div.selectAll(".node")
    //             .data(tree.leaves())
    //           .enter().append("div")
    //             .attr("class", "node")
    //             .style("left", function (d) { return d.x + "px"; })
    //             .style("top", function (d) { return d.y + "px"; })
    //             .style("width", function (d) { return Math.max(0, d.dx - 1) + "px"; })
    //             .style("height", function (d) { return Math.max(0, d.dy - 1) + "px"; })
    //             .style("background", function (d) { return d.children ? color(d.name) : null; })
    //             .text(function (d) { return d.name})
    //             .on("mousemove", function (d) {
    //                 tool.style("left", d3.event.pageX + 10 + "px")
    //                 tool.style("top", d3.event.pageY - 20 + "px")
    //                 tool.style("display", "inline-block");
    //                 tool.html(d.children ? null : d.name + "<br>");
    //             }).on("mouseout", function (d) {
    //                 tool.style("display", "none");
    //             });

  d3ZoomableTreemap('treemap', root, {
    sum_function: function(d) {
      if (!d.hasOwnProperty('children'))
        return d.size;
      else
        return 0.0;
    },
    height: 840,
    margin_top: 20,
    zoom_out_msg: " - Select here to zoom out.",
    zoom_in_msg: " - Select a category to zoom in.",
    fill_color: "#d3d3d3",
    color_scale: color,
    format_number: function (number) {
      switch (number) {
        case 1:
        return number + " entry";
        default:
        return number + " entries";
      }
    }
  });

  console.log(nested_data);


var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 900 - margin.left - margin.right,
    height = 840 - margin.top - margin.bottom;

  // append the svg object to the body of the page
var svg = d3.select("#bubbleplot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/movies.csv", function(data) {

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 10])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .append("text")
    .attr("class", "label")
    .attr("x", width -16)
    .attr("y", -6)
    .style("text-anchor", "end")
    .style("fill", "black")
    .text("IMDB Score");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 200000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .style("fill", "black")
    .text("Facebook Likes");


  svg.append("g")
    .append("text")
    .attr("class", "label")
    .attr("x", width + 14)
    .attr("y", 6)
    .style("text-anchor", "end")
    .style("fill", "black")
    .text("Bubble Size: Gross");

   svg.append("g")
    .append("text")
    .attr("class", "label")
    .attr("x", width + 20)
    .attr("y", 20)
    .style("text-anchor", "end")
    .style("fill", "black")
    .text("Color: Content Rating");

  // Add a scale for bubble size
  var z = d3.scaleLinear()
    .domain([200000, 1310000000])
    .range([ 4, 40]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
  .domain(["Rated R", "Rated PG-13", "No Content Rating", "Rated PG", "Not Rated", "Rated TV-14", "Rated TV-MA", "Rated G", "Rated TV-PG", "Unrated",
    "Rated TV-G", "Rated TV-Y", "Rated NC-17", "Rated TV-Y7"])
  .range(["#69D2E7", "#A7DBDB", "#E0E4CC", "#F38630", "#FA6900", "#D0C91F", "#85C4B9",
    "#008BBA", "#E9514C", "#DC403B"]);

  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#bubbleplot")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Movie: " + d.movie_title + "\n"
              + "Gross: " + d.gross)
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("cx", function (d) { return x(d.imdb_score); } )
      .attr("cy", function (d) { return y(d.movie_facebook_likes); } )
      .attr("r", function (d) { return z(d.gross); } )
      .style("fill", function (d) { return myColor(d.content_rating); } )
    // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

  })

})