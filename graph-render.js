
var vgraph;
var nextID = 1;
var algotype;
var isdirected = false;
var isweighted = false;
var currdata;
var instructions;
var arraydata;
var requirements;
var startNode;
var weightIndex;


function weightUpdate(){
  console.log("called");
  vgraph.cfg.edges[weightIndex]._cfg.weight = parseInt(document.querySelector('#newweight').value);
  vgraph.cfg.edges[weightIndex]._cfg.label = "Weight: " + vgraph.cfg.edges[weightIndex]._cfg.weight.toString();
  currdata = vgraph.save();
  currdata.edges[weightIndex].weight = parseInt(document.querySelector('#newweight').value);
  currdata.edges[weightIndex].label = vgraph.cfg.edges[weightIndex]._cfg.label
  console.log(currdata.edges[weightIndex].label);
  vgraph.read(currdata);
  console.log(currdata);
  vgraph.cfg.edges[weightIndex]._cfg.weight = parseInt(document.querySelector('#newweight').value);
  vgraph.cfg.edges[weightIndex]._cfg.label = "Weight: " + vgraph.cfg.edges[weightIndex]._cfg.weight.toString();
  document.getElementById('weightcounter').innerHTML = "Current Weight: " + parseInt(document.querySelector('#newweight').value);


}


function clearGraph(){
  vgraph.clear();
  nextID = 1;
}

function randomizeGraph(){
  clearGraph();
  var nodenum = parseInt(document.querySelector('#nodenum').value);
  var edgenum = parseInt(document.querySelector('#edgenum').value);
  

  var i;
  var data = {nodes:[], edges:[]};
  for (i = 1; i <= nodenum; i++) {
    data.nodes.push({
      id: i.toString(),
      label: i.toString(),
      x: Math.floor(Math.random() * (1200 - 100 + 1) + 100),
      y: Math.floor(Math.random() * (500 - 40 + 1) + 40),
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
        label: 'Weight: 0',
        curveOffset: 0,
      } 
    } while (s == d && (data.edges.includes(edgeinfo) == false));
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
      style: {
        lineWidth: 10,
        endArrow:{
          path: G6.Arrow.triangle(10, 15, 10),
          d: 10,
        }
      }
    }
  );
}

function newUndirectedGraph(){
  isdirected = false;
  clearGraph();

  vgraph.set('defaultEdge',{
      style: {
        lineWidth: 10,
        endArrow:false
      }
    }
  );
}

function newWeightedGraph(){

}

function newUnweightedGraph(){

}

window.onload = function(){

        instructions = document.getElementById("instructions");
        arraydata = document.getElementById("arraydata");
        requirements = document.getElementById("requirements");

        var forma = document.getElementById("weightform");
        function handleForm(event) { 
          event.preventDefault(); 
        } 
        forma.addEventListener('submit', handleForm);

        var form = document.getElementById("randomgraph");
        function handleForm(event) { 
          event.preventDefault(); 
        } 
        form.addEventListener('submit', handleForm);
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
            console.log("E", node);  
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
              vgraph.updateItem(self.edge, {
                target: model.id,
              });

              self.edge = null;
              self.addingEdge = false;
            } else {

              // Add anew edge, the end node is the current node user clicks
              self.edge = vgraph.addItem('edge', {
                source: model.id,
                target: model.id,
                label: "Weight: 0",
                weight: 0
              });
              //EDGEWEIGHT
              weightIndex = (vgraph.cfg.edges).length - 1;
              vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight = 0;
              vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.label = "Weight: " + vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight.toString();
                     
              
              self.addingEdge = true;
              document.querySelector('.weightform').style.display = 'flex';              
              document.getElementById('weightcounter').innerHTML = "Current Weight: " + vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight.toString();

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
            };
          },
          // The responsing function for node:click defined in getEvents
          onEdgeClick(ev){
            //EDGEWEIGHT2
            currdata = vgraph.save();
            const self = this;
            const edge = ev.item;
            const graph = self.graph;
            console.log("LETSGOBABY")
            weightIndex = vgraph.cfg.edges.indexOf(edge);
            document.getElementById('weightcounter').innerHTML = "Current Weight: " + currdata.edges[weightIndex].weight.toString();

            // The position where the mouse clicks
            /*
            vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight = 0;
            vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.label = "Weight: " + vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight.toString();
            self.addingEdge = true;
            document.querySelector('.weightform').style.display = 'flex';              
            document.getElementById('weightcounter').innerHTML = "Current Weight: " + vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight.toString();
            */
          }
        });





        const container = document.getElementById('container');


        const width = container.scrollWidth;
        const height = (container.scrollHeight || 500) - 30;
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
            style: {
              lineWidth: 10,
              endarrow: false
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
            curSelectedLeft.classList.remove("selected-left");
            obj.classList.add("selected-left");
            curSelectedLeft = obj;
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
            name: "Dijksta's algorithm",
            description: "Algorithm for finding shortest path between nodes in a graph.",
            requirements: "Weighted graph recommended",
          },
          bfs: {
            func: algobfs,
            name: "Breadth First Search",
            description: "An algorithm for traversing a graph.",
            requirements: "None, works on any graph",
          },
          dfs:{
            func: algodfs,
            name: "Depth First Search",
            description: "An algorithm for traversing a graph.",
            requirements: "None, works on any graph",
          },
          topsort:{
            func: algotopsort,
            name: "Topological Sort",
            description: "Sorts nodes such that if an edge exists from u to v, u comes before v in the array.",
            requirements: "Must be a DAG (directed acyclic graph)",
          },
          mst:{
            func: algomst,
            name: "Minimum Spanning Tree",
            description: "Selects a subset of edges such that the resulting graph is a tree and the sum of the weights of the edges in minimized",
            requirements: "Weight undirected graph",
          },
          scc:{
            func: algoscc,
            name: "Strongly Connected Components",
            description: "A strongly connected graph is a graph where every vertex is reachable from every other vertex. This algorithm divides the graph into strongly connected components.",
            requirements: "Directed graph",
          },
          maxflow:{
            func: algomaxflow,
            name: "Maximum Flow/Minimum Cut",
            description: "Each edge is assigned a \"flow\" up to the edges capacity (weight). All incoming flow needs to equal all outcoming flow on a node. Calculates the maximum flow from a source node to a sink node.",
            requirements: "Directed graph",
          }
        };

        var selectAlgorithm = function(name){
          return function(){
            algotype = algomap[name].func;
            instructions.innerHTML = "Name: " + algomap[name].name; 
            arraydata.innerHTML = "Description: " + algomap[name].description;
            requirements.innerHTML =  "Requirements: " + algomap[name].requirements;
          }
        }

        const directed = document.getElementById('directed');
        directed.onclick = topSelectorOnClickType(newDirectedGraph, "direction", directed);
        const undirected = document.getElementById('undirected');
        undirected.onclick = topSelectorOnClickType(newUndirectedGraph, "direction", undirected);
        const weighted = document.getElementById('weighted');
        weighted.onclick = topSelectorOnClickType(newWeightedGraph, "weight", weighted);
        const unweighted = document.getElementById('unweighted');
        unweighted.onclick = topSelectorOnClickType(newUnweightedGraph, "weight", unweighted);
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

        const field = document.querySelector('#newweight');
        field.addEventListener('input', weightUpdate);


        curSelectedTop["direction"] = undirected;
        curSelectedTop["weight"] = unweighted;
        curSelectedTop["algo"] = dijkstra;
        algotype = algobfs;

        const run = document.getElementById("runbtn");
        run.onclick = function(){ convertGraph(); algotype();};

        

        // Listen to the selector, change the mode when the selector is changed
        /*selector.addEventListener('change', (e) => {
          const value = e.target.value;
          // change the behavior mode
          graph.setMode(value);
        });*/

        if (typeof window !== 'undefined')
          window.onresize = () => {
            if (!vgraph || vgraph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            vgraph.changeSize(container.scrollWidth, container.scrollHeight - 30);
          };

      }


