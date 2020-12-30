window.onload = function(){
          let nextID = 1;
          let nextLabel = 1;
          let labelToID = new Map();
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
            const graph = self.graph;
            // Add a new node
            graph.addItem('node', {
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
            const graph = self.graph;
            // The position where the mouse clicks
            const point = { x: ev.x, y: ev.y };
            const model = node.getModel();
            if (self.addingEdge && self.edge) {
              graph.updateItem(self.edge, {
                target: model.id,
              });

              self.edge = null;
              self.addingEdge = false;
            } else {
              // Add anew edge, the end node is the current node user clicks
              self.edge = graph.addItem('edge', {
                source: model.id,
                target: model.id,
              });
              self.addingEdge = true;
            }
          },
          // The responsing function for mousemove defined in getEvents
          onMousemove(ev) {
            const self = this;
            // The current position the mouse clicks
            const point = { x: ev.x, y: ev.y };
            if (self.addingEdge && self.edge) {
              // Update the end node to the current node the mouse clicks
              self.graph.updateItem(self.edge, {
                target: point,
              });
            }
          },
          // The responsing function for edge:click defined in getEvents
          onEdgeClick(ev) {
            const self = this;
            const currentEdge = ev.item;
            if (self.addingEdge && self.edge === currentEdge) {
              self.graph.removeItem(self.edge);
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
            const graph = self.graph;
            // The position where the mouse clicks
            var label = node.getModel().label;
            graph.removeItem(node);
            for(var i = label+1; i < nextLabel; i++){
                var nextNode = graph.findById(labelToID[i]);
                graph.updateItem(nextNode, {
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
            graph.removeItem(edge);
          }
        });

        const container = document.getElementById('container');


        const width = container.scrollWidth;
        const height = (container.scrollHeight || 500) - 30;
        const graph = new G6.Graph({
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
            trash: ['click-delete', 'click-select']
          },
          // The node styles in different states
          nodeStateStyles: {
            // The node styles in selected state
            selected: {
              stroke: '#666',
              lineWidth: 2,
              fill: 'steelblue',
            },
          },
          defaultEdge: {
            style: {
              lineWidth: 10
            }
          }
        });
        graph.render();

        var cur;

        var selectorOnClick = function(type, obj){
          return function(){
            graph.setMode(type);
            cur.classList.remove("selected");
            obj.classList.add("selected");
            cur = obj;
          }
        }

        // Add a selector to DOM
        const newNode = document.getElementById('NewNode');
        newNode.onclick = selectorOnClick("addNode", newNode);
        const newEdge = document.getElementById('NewEdge');
        newEdge.onclick = selectorOnClick("addEdge", newEdge);
        const move = document.getElementById('Move');
        move.onclick = selectorOnClick("move", move);
        const trash = document.getElementById('Trash');
        trash.onclick = selectorOnClick("trash", trash);
        graph.setMode("addNode");
        cur = newNode;

        // Listen to the selector, change the mode when the selector is changed
        /*selector.addEventListener('change', (e) => {
          const value = e.target.value;
          // change the behavior mode
          graph.setMode(value);
        });*/

        if (typeof window !== 'undefined')
          window.onresize = () => {
            if (!graph || graph.get('destroyed')) return;
            if (!container || !container.scrollWidth || !container.scrollHeight) return;
            graph.changeSize(container.scrollWidth, container.scrollHeight - 30);
          };
      }