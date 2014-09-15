function renderTree(config, svgNode) {

  var dimentions = computeSvgSizeFromData(config),
    source = config.data,
    height = dimentions.height,
    width = dimentions.width,
    i=0;

  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { 
      return [d.y, d.x]; 
    });

  // Compute the new tree layout.
  var nodes = tree.nodes(source),
    links = tree.links(nodes);

  var svg = d3.select(svgNode);

  var group = svg.attr("width", width + config.margin.right + config.margin.left)
    .attr("height", height + config.margin.top + config.margin.bottom)
    .append("g")
    .attr("transform", "translate(" + config.margin.left + "," + config.margin.top + ")");
 
  source.x0 = height / 2;
  source.y0 = 0;
  
  // Normalize for fixed-depth.
  nodes.forEach(function(d) { 
    d.y = d.depth * 180; 
  });

  // Update the nodes…
  var node = group.selectAll("g.node")
    .data(nodes, function(d) { 
      return d.id || (d.id = ++i); 
    });

  var nodeEnter = node.enter().append("g")
    .attr("class", 'node')
    .attr("transform", function(d) { 
      return "translate(" + source.y0 + "," + source.x0 + ")"; 
    });
 
  nodeEnter.append("circle")
    .attr("r", 1e-6);
 
  nodeEnter.append("text")
    .attr("y", function(d) {
      return -20;
    })
    .attr("text-anchor", function(d) {
      return 'middle';
    })
    .text(function(d) { 
      return d.name; 
    })
    .style("fill-opacity", 1e-6);
   
  // Transition nodes to their new position.
  var nodeUpdate = node
    .attr("transform", function(d) { 
      return "translate(" + d.y + "," + (d.x + 10) + ")"; 
    });
   
  nodeUpdate.select("circle").attr("r", 15);
  nodeUpdate.select("text").style("fill-opacity", 1);
   
  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit()
    .attr("transform", function(d) { 
      return "translate(" + source.y + "," + source.x + ")"; 
    })
    .remove();
   
  nodeExit.select("circle").attr("r", 1e-6);
  nodeExit.select("text").style("fill-opacity", 1e-6);
   
  // Update the links…
  var link = group.selectAll("path.link")
    .data(links, function(d) { 
      return d.target.id; 
    });
   
  // // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o
      });
  });
   
  // Transition links to their new position.
  link.attr("d", diagonal);

}

function computeSvgSizeFromData(config){

  var tree = d3.layout.tree(),
    nodes = tree.nodes(config.data);

  var maxTreeChildrenHeight = {},
    maxTreeHeight = 0,
    maxTreeDepth = 0,
    minSvgWidth,
    minSvgHeight;
  
  // Compute the max tree depth(node which is the lowest leaf) 
  nodes.forEach(function(d) { 
      if(d.depth>maxTreeDepth){
          maxTreeDepth = d.depth;
      }

      if(!maxTreeChildrenHeight[d.depth]){
          maxTreeChildrenHeight[d.depth] = 0;
      }

      maxTreeChildrenHeight[d.depth] = maxTreeChildrenHeight[d.depth]+1;
  });

  // Compute maximum number of vertical at a level
  maxTreeHeight = _.max(_.values(maxTreeChildrenHeight));

  // Since this is a horizontal tree, compute the width
  // based upon the depth and the height based upon 
  // the number of nodes at a depth level
  minSvgWidth = maxTreeDepth*100 < config.width ? config.width : (maxTreeDepth+1)*100;
  minSvgHeight = maxTreeHeight*80 < config.height ? config.height : (maxTreeHeight+1)*80;

  return {
    width: minSvgWidth,
    height: minSvgHeight
  };
}

// Load the data then render the tree
d3.json("data/flare.json", function(error, data) {
  var svgNode = document.getElementById('reingold-tilford-tree'),
    config = {
      data: data,
      width : svgNode.parentNode.offsetWidth, // Width of the parent container
      height : svgNode.parentNode.offsetHeight, // Height of the parent container
      margin: { // Margins that we need within our SVG
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
      },
    };

  renderTree(config, svgNode);
});