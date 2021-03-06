
var vgraph;
var nextID = 1;
var algotype;
var isdirected = false;
var isweighted = false;
var currdata;
var algorithm;
var instrutions1;
var instrutions2;
var startNode;
var weightIndex;
var width;
var height;
var whitened = "NewNode";
var left;
var right;


function changeWhite(buttonid){
  document.getElementById(whitened).classList.remove('active');
  document.getElementById(buttonid).classList.add('active');
  whitened = buttonid;
  
}



function weightUpdate(){
  /*



  vgraph.cfg.edges[weightIndex]._cfg.weight = parseInt(document.querySelector('#newweight').value);
  vgraph.cfg.edges[weightIndex]._cfg.label = vgraph.cfg.edges[weightIndex]._cfg.weight.toString();
  currdata = vgraph.save();
  currdata.edges[weightIndex].weight = parseInt(document.querySelector('#newweight').value);
  currdata.edges[weightIndex].label = vgraph.cfg.edges[weightIndex]._cfg.label
  console.log(currdata.edges[weightIndex].label);
  vgraph.read(currdata);
  console.log(currdata);
  vgraph.cfg.edges[weightIndex]._cfg.weight = parseInt(document.querySelector('#newweight').value);
  vgraph.cfg.edges[weightIndex]._cfg.label = vgraph.cfg.edges[weightIndex]._cfg.weight.toString();
  document.getElementById('weightcounter').innerHTML = "Current Weight: " + parseInt(document.querySelector('#newweight').value);
  */
  currdata = vgraph.save();
  var edge = vgraph.findById(currdata.edges[weightIndex].id);
  vgraph.updateItem(edge, {
    label: document.querySelector('#newweight').value
  })
}


function clearGraph(){
  vgraph.clear();
  nextID = 1;
}

function match(edges, edgeinfo){
  for(var i = 0; i < edges.length; i++){
    console.log(edges[i], edgeinfo)
    if(edges[i].source == edgeinfo.source && edges[i].target == edgeinfo.target) return edges[i].id;
    if(!isdirected && edges[i].source == edgeinfo.target && edges[i].target == edgeinfo.source) return edges[i].id;
  }
  return false;
}

function randomizeGraph(){
  clearGraph();
  var nodenum = parseInt(document.querySelector('#nodenum').value);
  var edgenum = parseInt(document.querySelector('#edgenum').value);
  if(edgenum > nodenum*(nodenum-1)/2){
    edgenum = nodenum*(nodenum-1)/2;
  }
  var minweight = -1;
  var maxweight = -1;
  if(isweighted){
    minweight = parseInt(document.querySelector('#minweight').value);
    maxweight = parseInt(document.querySelector('#maxweight').value);
  }
  

  var i;
  var data = {nodes:[], edges:[]};
  var r = width / 3;
  if(height / 3 < r) r = height / 3;
  for (i = 1; i <= nodenum; i++) {
    data.nodes.push({
      id: i.toString(),
      label: i.toString(),
      x: width / 2 + r*Math.cos(2 * Math.PI * i / nodenum),
      y: height / 2 + r*Math.sin(2 * Math.PI * i / nodenum),
      size: 60
    })
  }
  var s;
  var d;
  for (i = 0; i < edgenum; i++){
    do{
      s = Math.floor(Math.random() * (nodenum) + 1).toString();
      d = Math.floor(Math.random() * (nodenum) + 1).toString();
      var edgeinfo = {
        source: s,
        target: d,
        weight: 0,
        curveOffset: 0,
      } 
      if(isweighted){
        var weight = Math.floor(Math.random() * (maxweight - minweight+1) + minweight).toString();
        edgeinfo.label = weight;
      }
    } while (s == d && match(data.edges, edgeinfo));
    data.edges.push(edgeinfo);
  }
  nextID = nodenum+1;
  vgraph.data(data);
  vgraph.render();

}

// x: 100 to 1200
// y: 40 to 500

function newDirectedGraph() {
  isdirected = true;
  clearGraph();
  
  vgraph.set('defaultEdge',{
      type: "line",
      style: {
        lineWidth: 5,
        endArrow:{
          path: G6.Arrow.triangle(10, 10, 10),
          d: 10,
        }
      },
      labelCfg:{
        style:{
          fontFamily: "Garamond",
          fontSize: 15
        }
      },
    }
  );
}

function newUndirectedGraph(){
  isdirected = false;
  clearGraph();

  vgraph.set('defaultEdge',{
      type: "line",
      style: {
        lineWidth: 5,
        endArrow:false
      },
      labelCfg:{
        style:{
          fontFamily: "Garamond",
          fontSize: 15
        }
      }
    }
  );
}

function newWeightedGraph(){
  console.log(document.getElementById("Weights").style.display);
  isweighted = true;
  document.getElementById("Weights").style.display = "block";
}

function newUnweightedGraph(){
  isweighted = false;
  document.getElementById("Weights").style.display = "none";
}

window.onload = function(){
        document.getElementById(whitened).classList.add('active');

        console.log(document.getElementById(whitened));
        algorithm = document.getElementById("algorithm");
        instructions1 = document.getElementById("instructions1");
        instructions2 = document.getElementById("instructions2");
        left = document.getElementById("left");
        right = document.getElementById("right");

        // Register a custom behavior: add a node when user click the blank part of canvas
        G6.registerBehavior('click-add-node', {
          // Set the events and the corresponding responsing function for this behavior
          getEvents() {
            // The event is canvas:click, the responsing function is onClick
            return {
              'canvas:click': 'onClick',
            };
          },
          // Click event
          onClick(ev) {
            console.log(nextID);
            const self = this;
            // Add a new node
            vgraph.addItem('node', {
              size: 60,
              x: ev.canvasX,
              y: ev.canvasY,
              id: `${nextID}`, // Generate the unique id
              label: nextID
            });
            nextID++;
          },
        });
        G6.registerBehavior('click-start-node', {
          // Set the events and the corresponding responsing function for this behavior
          getEvents() {
            // The event is canvas:click, the responsing function is onClick
            return {
              'node:click': 'onClick',
            };
          },
          // Click event
          onClick(ev) {
            const self = this;
            const node = ev.item;
            startNode = parseInt(node.getModel().id);
          },
        });
        // Register a custom behavior: click two end nodes to add an edge
        // Register a custom behavior: click two end nodes to add an edge
        G6.registerBehavior('click-add-edge', {
          // Set the events and the corresponding responsing function for this behavior
          getEvents() {
            return {
              'node:click': 'onClick', // The event is canvas:click, the responsing function is onClick
              mousemove: 'onMousemove', // The event is mousemove, the responsing function is onMousemove
              'edge:click': 'onEdgeClick', // The event is edge:click, the responsing function is onEdgeClick
            };
          },
          // The responsing function for node:click defined in getEvents
          onClick(ev) {
            const self = this;
            const node = ev.item;
            // The position where the mouse clicks
            const point = { x: ev.x, y: ev.y };
            const model = node.getModel();
            if (self.addingEdge && self.edge) {
              var edges = vgraph.save().edges;
              var edge = {source: self.edge.getModel().source, target: model.id};
              if(match(edges, edge)){
                vgraph.removeItem(self.edge);
                instructions1.innerHTML = "You cannot have double edges";
              }
              else if(edge1 = match(edges, {source: edge.target, target: edge.source})){
                var otheredge = vgraph.findById(edge1);
                vgraph.updateItem(self.edge, {
                  target: model.id,
                  type: 'quadratic'
                });
                vgraph.updateItem(otheredge, {
                  type: 'quadratic'
                });
              }
              else{
                vgraph.updateItem(self.edge, {
                  target: model.id,
                });
              }
              if(isweighted){
                document.getElementById('newweight').value = "";
                document.getElementById('newweight').focus();
              }


              self.edge = null;
              self.addingEdge = false;
            } else {

              // Add anew edge, the end node is the current node user clicks
              var edgejson = {
                  source: model.id,
                  target: model.id,
                  weight: 0
              };
              if(isweighted){
                edgejson.label = "0";
              }
              self.edge = vgraph.addItem('edge', edgejson);
                     
              
              self.addingEdge = true;


              if(isweighted){
                //EDGEWEIGHT
                weightIndex = (vgraph.cfg.edges).length - 1;
                vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight = 0;
                vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.label = vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight.toString();          
              }
            }
          },
          // The responsing function for mousemove defined in getEvents
          onMousemove(ev) {
            const self = this;
            // The current position the mouse clicks
            const point = { x: ev.x, y: ev.y };
            if (self.addingEdge && self.edge) {
              // Update the end node to the current node the mouse clicks
              vgraph.updateItem(self.edge, {
                target: point,
              });
            }
          },
          // The responsing function for edge:click defined in getEvents
          onEdgeClick(ev) {
            const self = this;
            const currentEdge = ev.item;
            
            if (self.addingEdge && self.edge === currentEdge) {
              vgraph.removeItem(self.edge);
              self.edge = null;
              self.addingEdge = false;
            }
          },
        });

        G6.registerBehavior('click-delete', {
          // Set the events and the corresponding responsing function for this behavior
          getEvents() {
            return {
              'node:click': 'onNodeClick', // The event is canvas:click, the responsing function is onClick
              'edge:click': 'onEdgeClick', // The event is edge:click, the responsing function is onEdgeClick
            };
          },
          // The responsing function for node:click defined in getEvents
          onNodeClick(ev) {
            const self = this;
            const node = ev.item;
            // The position where the mouse clicks
            var id = parseInt(node.getModel().id);
            var ngraph = {nodes: [], edges: []};
            var data = vgraph.save();
            vgraph.clear();
            for(var i = 0; i < data["nodes"].length; i++){
                if(data["nodes"][i].id > id){
                  var next = parseInt(data["nodes"][i].id)-1;
                  data["nodes"][i].label = next;
                  data["nodes"][i].id = next.toString();
                  ngraph.nodes.push(data["nodes"][i]);
                }else if(data["nodes"][i].id < id) ngraph.nodes.push(data["nodes"][i]);
            }
            for(var i = 0; i < data["edges"].length; i++){
              var source = parseInt(data["edges"][i].source);
              var target = parseInt(data["edges"][i].target);
              if(source == id) continue;
              else if(source > id) data["edges"][i].source = (source - 1).toString();
              if(target == id) continue;
              else if(target > id) data["edges"][i].target  = (target - 1).toString();
              ngraph.edges.push(data["edges"][i]);
            }
            vgraph.data(ngraph);
            vgraph.render();
            nextID--;
          },
          onEdgeClick(ev){
            const self = this;
            const edge = ev.item;
            const graph = self.graph;
            // The position where the mouse clicks
            vgraph.removeItem(edge);
          }
        });

        //REGISTERS BEHAVIOR FOR CHANGING EDGE WEIGHT

        G6.registerBehavior('click-weight', {
          // Set the events and the corresponding responsing function for this behavior
          getEvents() {
            return {
              'edge:click': 'onEdgeClick', // The event is edge:click, the responsing function is onEdgeClick
              'beforemodechange': 'modechange'
            };
          },
          // The responsing function for node:click defined in getEvents
          onEdgeClick(ev){
            //EDGEWEIGHT2
            currdata = vgraph.save();
            const self = this;
            if(self.lastedge){
              console.log("test");
              var le = vgraph.findById(self.lastedge)
              vgraph.updateItem(le, {
                type: self.lasttype
              });
            }
            const edge = ev.item;
            const graph = self.graph;
            weightIndex = vgraph.cfg.edges.indexOf(edge);
            self.lastedge = edge.getModel().id;
            self.lasttype = edge.getModel().type;
            console.log(self.lasttype + "-dash");
            vgraph.updateItem(edge, {
              type: self.lasttype + "-dash"
            });
            if(isweighted){
              document.getElementById('newweight').value = "";
              document.getElementById('newweight').focus();
            }

            // The position where the mouse clicks
            /*
            vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight = 0;
            vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.label = "Weight: " + vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight.toString();
            self.addingEdge = true;
            document.querySelector('.weightform').style.display = 'flex';              
            document.getElementById('weightcounter').innerHTML = "Current Weight: " + vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight.toString();
            */
          },
          modechange(){
            const self = this;
            if(self.lastedge){
              var le = vgraph.findById(self.lastedge)
              vgraph.updateItem(le, {
                type: self.lasttype
              });
            }
          }
        });
        const lineDash = [4, 4, 4, 4];
        var registerDash = function(type){
          G6.registerEdge(
            type + '-dash',
            {
              afterDraw(cfg, group) {
                const shape = group.get('children')[0];
                var x = 0;
                // Define the animation
                shape.animate(
                  () => {
                    var w = 10*(-x*x+2*x)+5;
                    if(w < 5) x = 0;
                    else x+=.015;
                    const res = {
                      lineWidth: w
                    };
                    // Returns the configurations to be modified in this frame. Here the return value contains lineDash and lineDashOffset
                    return res;
                  },
                  {
                    repeat: true, // whether executed repeatly
                    duration: 3000, // animation's duration
                  },
                );
              },
            },
            type
          );
        }
        registerDash('line');
        registerDash('quadratic');

        G6.registerNode(
          'circle-animate',
          {
            afterDraw(cfg, group) {
              const shape = group.get('children')[0];

              shape.animate(
                (ratio) => {
                  const diff = ratio <= 0.5 ? ratio * 10 : (1 - ratio) * 10;
                  let radius = cfg.size;
                  if (isNaN(radius)) radius = radius[0];
                  return {
                    r: radius / 2 + diff,
                  };
                },
                {
                  repeat: true, 
                  duration: 1000, 
                  easing: 'easeCubic',
                },
              );
            },
          },
          'circle',
        );





        const container = document.getElementById('container');


        width = container.scrollWidth;
        height = (container.scrollHeight || 500);
        vgraph = new G6.Graph({
          container: 'container',
          width,
          height,
          // The sets of behavior modes
          modes: {
            // Defualt mode
            move: ['drag-node', 'click-select'],
            // Adding node mode
            addNode: ['click-add-node', 'click-select'],
            // Adding edge mode
            addEdge: ['click-add-edge', 'click-select'],
            trash: ['click-delete', 'click-select'],
            weight: ['click-weight', 'click-select'],
            startNode: ['click-start-node', 'click-select']
          },
          defaultEdge: {
            type: "line",
            labelCfg:{
              style:{
                fontFamily: "Garamond",
                fontSize: 15
              }
            },
            style: {
              lineWidth: 5,
              endarrow: false
            }
          },
          defaultNode:{
            labelCfg:{
                style:{
                  fontFamily: "Garamond",
                  fontSize: 20,
                  fill: '#000'
                }
              }
          },
          defaultCombo: {
            type: 'circle',
            labelCfg: {
              position: 'top',
            }
          }
        });
        vgraph.render();

        var curSelectedLeft;

        var leftSelectorOnClick = function(type, obj){
          return function(){
            vgraph.setMode(type);
            if((type == "weight" || type == "addEdge") && isweighted){
              console.log(document.getElementById("weightform"));
              document.getElementById("weightform").style.maxHeight = "50px";
            }else{
              document.getElementById("weightform").style.maxHeight = "0";
            }
          }
        }

        const newNode = document.getElementById('NewNode');
        newNode.onclick = leftSelectorOnClick("addNode", newNode);
        const newEdge = document.getElementById('NewEdge');
        newEdge.onclick = leftSelectorOnClick("addEdge", newEdge);
        const move = document.getElementById('Move');
        move.onclick = leftSelectorOnClick("move", move);
        const trash = document.getElementById('Trash');
        trash.onclick = leftSelectorOnClick("trash", trash);
        const weightchange = document.getElementById('Weights');
        weightchange.onclick = leftSelectorOnClick("weight", weightchange);

        vgraph.setMode("addNode");
        curSelectedLeft = newNode;


        var curSelectedTop = new Map();
        var topSelectorOnClickType = function(func, type, obj){
            return function(){
              func();
              curSelectedTop[type].classList.remove("selected-top");
              obj.classList.add("selected-top");
              curSelectedTop[type] = obj;
            }
        }

        algomap = {
          dijkstra: {
            func: algodijkstra,
            name: "Dijkstra's algorithm",
            description: "Algorithm for finding shortest path between nodes in a graph. <a href=\"https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm\">Learn more</a>",
            requirements: "Weighted graph recommended.",
          },
          bfs: {
            func: algobfs,
            name: "Breadth First Search",
            description: "An algorithm for traversing a graph. <a href=\"https://en.wikipedia.org/wiki/Breadth-first_search\">Learn more</a>",
            requirements: "None, works on any graph",
          },
          dfs:{
            func: algodfs,
            name: "Depth First Search",
            description: "An algorithm for traversing a graph. <a href=\"https://en.wikipedia.org/wiki/Depth-first_search\">Learn more</a>",
            requirements: "None, works on any graph",
          },
          topsort:{
            func: algotopsort,
            name: "Topological Sort",
            description: "Sorts nodes such that if an edge exists from u to v, u comes before v in the array. <a href=\"https://en.wikipedia.org/wiki/Topological_sorting\">Learn more</a>",
            requirements: "Must be a DAG (directed acyclic graph)",
          },
          mst:{
            func: algomst,
            name: "Minimum Spanning Tree",
            description: "Selects a subset of edges such that the resultant graph is a tree and the sum of the weights of the edges is minimized. <a href=\"https://en.wikipedia.org/wiki/Minimum_spanning_tree\">Learn more</a>",
            requirements: "Weight undirected graph",
          },
          scc:{
            func: algoscc,
            name: "Strongly Connected Components",
            description: "A strongly connected graph is a graph where every vertex is reachable from every other vertex. This algorithm divides the graph into strongly connected components. <a href=\"https://en.wikipedia.org/wiki/Strongly_connected_component\">Learn more</a>",
            requirements: "Directed graph",
          },
          maxflow:{
            func: algomaxflow,
            name: "Maximum Flow/Minimum Cut",
            description: "Each edge is assigned a \"flow\" up to the edges capacity (weight). All incoming flow needs to equal all outcoming flow on a node. Calculates the maximum flow from a source node to a sink node. <a href=\"https://en.wikipedia.org/wiki/Maximum_flow_problem\">Learn more</a>",
            requirements: "Directed graph",
          }
        };

        var selectAlgorithm = function(name){
          return function(){
            algotype = algomap[name].func;
            algorithm.innerHTML = algomap[name].name; 
            instructions1.innerHTML = "Description: " + algomap[name].description;
            instructions2.innerHTML =  "Requirements: " + algomap[name].requirements;
          }
        }

        var doNothing = function(){}

        var showForm = function(){
          document.getElementById("randomform").style["max-height"] = "300px";
        }

        var unshowForm = function(){
          document.getElementById("randomform").style["max-height"] = "0";
        }

        var showWeight = function(){
          document.getElementById("weightedinfo").style.display = "block";

        }

        var unshowWeight = function(){
          document.getElementById("weightedinfo").style.display = "none";

        }

        const directed = document.getElementById('directed');
        directed.onclick = topSelectorOnClickType(doNothing, "direction", directed);
        const undirected = document.getElementById('undirected');
        undirected.onclick = topSelectorOnClickType(doNothing, "direction", undirected);
        const weighted = document.getElementById('weighted');
        weighted.onclick = topSelectorOnClickType(showWeight, "weight", weighted);
        const unweighted = document.getElementById('unweighted');
        unweighted.onclick = topSelectorOnClickType(unshowWeight, "weight", unweighted);
        const blank = document.getElementById('blank');
        blank.onclick = topSelectorOnClickType(unshowForm, "type", blank);
        const random = document.getElementById('random');
        random.onclick = topSelectorOnClickType(showForm, "type", random);
        const dijkstra = document.getElementById('dijkstra');
        dijkstra.onclick = topSelectorOnClickType(selectAlgorithm("dijkstra"), "algo",  dijkstra);
        const bfs = document.getElementById('bfs');
        bfs.onclick = topSelectorOnClickType(selectAlgorithm("bfs"), "algo", bfs);
        const dfs = document.getElementById('dfs');
        dfs.onclick = topSelectorOnClickType(selectAlgorithm("dfs"), "algo", dfs);
        const topsort = document.getElementById('topsort');
        topsort.onclick = topSelectorOnClickType(selectAlgorithm("topsort"), "algo", topsort);
        const mst = document.getElementById('mst');
        mst.onclick = topSelectorOnClickType(selectAlgorithm("mst"), "algo", mst);
        const scc = document.getElementById('scc');
        scc.onclick = topSelectorOnClickType(selectAlgorithm("scc"), "algo", scc);
        const maxflow = document.getElementById('maxflow');
        maxflow.onclick = topSelectorOnClickType(selectAlgorithm("maxflow"), "algo", maxflow);
        var d = document.getElementById("submit")
        console.log(d);
        d.onclick = function(){
          if(curSelectedTop["direction"] == undirected) newUndirectedGraph();
          else newDirectedGraph();
          if(curSelectedTop["weight"] == unweighted) newUnweightedGraph();
          else newWeightedGraph();
          if(curSelectedTop["type"] == random) randomizeGraph();
        }

        const field = document.querySelector('#newweight');
        field.addEventListener('input', weightUpdate);


        curSelectedTop["direction"] = undirected;
        curSelectedTop["weight"] = unweighted;
        curSelectedTop["type"] = blank;
        curSelectedTop["algo"] = dijkstra;
        algotype = algobfs;

        const run = document.getElementById("runbtn");
        var toShow = document.getElementsByClassName("toShow")
        run.onclick = async function(){ 
          run.style.display = "none";
          for(var i = 0; i < toShow.length; i++) toShow[i].style.display = "inline-block";
          left.style.visibility = "hidden";
          right.style.visibility = "hidden";
          convertGraph(); 
          await algotype();
          run.style.display = "flex";
          for(var i = 0; i < toShow.length; i++) toShow[i].style.display = "none";
          left.style.visibility = "visible";
        };

        

        // Listen to the selector, change the mode when the selector is changed
        /*selector.addEventListener('change', (e) => {
          const value = e.target.value;
          // change the behavior mode
          graph.setMode(value);
        });*/

          container.onresize = () => {
            if (!vgraph || vgraph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            vgraph.changeSize(container.scrollWidth, container.scrollHeight);
          };

      }


