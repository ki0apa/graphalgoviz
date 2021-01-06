
var vgraph;
var nextID = 1;
var nextLabel = 1;
var labelToID = new Map();
var algotype;
var directed = false;
var weighted = false;
var currdata;


function weightUpdate(){
  vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight = parseInt(document.querySelector('#newweight').value);
  vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.label = "Weight: " + vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.weight.toString();
  currdata = vgraph.save();
  currdata.edges[currdata.edges.length - 1].label = vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.label
  console.log(currdata.edges[currdata.edges.length - 1].label);
  vgraph.read(currdata);
  //currdata.edges[currdata.edges.length - 1] = vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.label;
  //vgraph.read(currdata);
  //console.log(vgraph.cfg.edges[(vgraph.cfg.edges).length - 1]._cfg.label);
  //console.log(vgraph.cfg.edges);
  //console.log(vgraph);
  

}


function clearGraph(){
  vgraph.clear();
  nextLabel = 1;
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
  nextLabel = nodenum+1;
  vgraph.data(data);
  vgraph.render();

}

// x: 100 to 1200
// y: 40 to 500

function newDirectedGraph() {
  directed = true;
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
  directed = false;
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
            const self = this;
            // Add a new node
            vgraph.addItem('node', {
              size: 60,
              x: ev.canvasX,
              y: ev.canvasY,
              id: `${nextID}`, // Generate the unique id
              label: nextLabel
            });
            labelToID[nextLabel] = nextID;
            nextID++;
            nextLabel++;
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
                label: "Weight: 0"
              });

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
            var label = node.getModel().label;
            vgraph.removeItem(node);
            for(var i = label+1; i < nextLabel; i++){
                var nextNode = vgraph.findById(labelToID[i]);
                vgraph.updateItem(nextNode, {
                  label: i-1
                });
                labelToID[i-1] = labelToID[i]
                labelToID[i] = -1 
            }
            nextLabel--;
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
            const self = this;
            const edge = ev.item;
            const graph = self.graph;
            console.log("LETSGOBABY")
            console.log(edge);
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
            weight: ['click-weight', 'click-select']
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
              console.log(obj);
              func();
              curSelectedTop[type].classList.remove("selected-top");
              obj.classList.add("selected-top");
              curSelectedTop[type] = obj;
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
        dijkstra.onclick = topSelectorOnClickType(function(){algotype = algodijkstra}, "algo",  dijkstra);
        const bfs = document.getElementById('bfs');
        bfs.onclick = topSelectorOnClickType(function(){algotype = algobfs}, "algo", bfs);
        const dfs = document.getElementById('dfs');
        dfs.onclick = topSelectorOnClickType(function(){algotype = algodfs}, "algo", dfs);
        const topsort = document.getElementById('topsort');
        topsort.onclick = topSelectorOnClickType(function(){algotype = algotopsort}, "algo", topsort);
        const mst = document.getElementById('mst');
        mst.onclick = topSelectorOnClickType(function(){algotype = algomst}, "algo", mst);
        const scc = document.getElementById('scc');
        scc.onclick = topSelectorOnClickType(function(){algotype = algoscc}, "algo", scc);
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


