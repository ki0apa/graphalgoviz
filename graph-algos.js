//number of nodes in the graph
var n;

//Test graph for Dijstra's
//var graph = [[[1, 3], [2, 1]], [[0, 3], [2, 1], [3, 2]], [[0, 1], [1, 1]], [[1, 2], [4, 6]], [[3, 6]]];

//Test graph for top sort
//var graph = [[], [[0, 1], [2, 1]], [[4, 1]], [[2, 1]], []];

var graph;
var edges = [];
var edgeMap;
var sleeptime = 1000;
var lastVisited;

function sleep() {
	var value = parseInt(document.getElementById("speedRange").value);
	var ms = (101-value)*50;
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getWeight(edge){
	var pos = edge.label.indexOf('/');
	return parseInt(edge.label.substring(pos+1));
}

function convertGraph(){
	var graphinfo = vgraph.save();
	graph = new Array(nextID);
	n = nextID;
	edgeMap = Array(n);
	for(var i = 0; i < nextID; i++){
		edgeMap[i] = Array(n);
		graph[i] = []
	}
	edges = graphinfo["edges"];
	for(var i = 0; i < graphinfo["edges"].length; i++){
		var weight;
		if(isweighted) weight = getWeight(graphinfo["edges"][i]);
		else weight = 1;
		graph[parseInt(graphinfo["edges"][i].source)].push([parseInt(graphinfo["edges"][i].target), weight]);
		edgeMap[parseInt(graphinfo["edges"][i].source)][parseInt(graphinfo["edges"][i].target)] = graphinfo["edges"][i];
		if(!isdirected){
			graph[parseInt(graphinfo["edges"][i].target)].push([parseInt(graphinfo["edges"][i].source), weight]);
			edgeMap[parseInt(graphinfo["edges"][i].target)][parseInt(graphinfo["edges"][i].source)] = graphinfo["edges"][i];
		}
	}
	updateInstructions("");
	updateArray("");
}

function updateInstructions(str){
	instructions1.innerHTML = str;
}

function updateArray(str){
	instructions2.innerHTML = str;
}

function visitNode(id){
	var node = vgraph.findById(id);
	if(!node) return;
	vgraph.updateItem(node, {
		style:{
			fill: "#00ff00"
		}
	})
}

function exitNode(id){
	var node = vgraph.findById(id);
	console.log(id, node);
	if(!node) return;
	vgraph.updateItem(node, {
		style:{
			fill: "#ff3300"
		},
		type: 'circle-animate'
	})
	if(lastVisited && lastVisited != id){
		var last = vgraph.findById(lastVisited);
		vgraph.updateItem(last, {
			type: 'circle'
		})
	}
	lastVisited = id;
}

function resetGraph(){
	for(var i = 1; i < nextID; i++){
		var node = vgraph.findById(i);
		if(!node) continue;
		if(node){
			vgraph.updateItem(node, {
				style:{
					fill: "#c6e5ff"
				},
				type: "circle",
				comboId: false
			})		
		}
	}
	var combos = vgraph.cfg.combos;
	for(var i = 0; i < combos.length; i++){
		combos[i].hide();
	}	
}

async function selectNode(message){
	updateInstructions(message);
	startNode = -1;
	vgraph.setMode("startNode");
	while(startNode == -1) await sleep(100);
	return startNode;
}

//breadth first search starting at node s
async function algobfs(){
	var s = await selectNode("Select starting node");
	var q = [s];
	var visited = [];
	for(var i = 0; i < n; i++){
		visited.push(false);
	}
	visited[s] = true;
	visitNode(s);
	await sleep();
	while(q.length > 0){
		var cur = q[0];
		exitNode(cur);
		updateInstructions("Exiting node: " + cur.toString());
		await sleep();
		updateInstructions("Visiting the neighbors of node: " + cur.toString());
		q.shift();
		for(var edge in graph[cur]){
			var node = graph[cur][edge];
			if(!visited[node[0]]){
				visitNode(node[0]);
				visited[node[0]] = true;
				q.push(node[0]);
			}
		}
		await sleep();
	}
	resetGraph();
}

//depth first search starting at node s
async function dfs_recursive(s){
	exitNode(s);
	dfsVisited[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		updateInstructions("Visiting the next neighbor of node: " + s.toString());
		exitNode(s);
		if(!dfsVisited[node[0]]){
			await sleep();
			await dfs_recursive(node[0]);
		}
	}
	updateInstructions("Exiting node: " + s.toString());
	exitNode(s);
	await sleep();
}

var dfsVisited = []
async function algodfs(){
	var s = await selectNode("Select starting node");
	dfsVisited = Array(n);
	for(var i = 0; i < n; i++) dfsVisited[i] = false;
	await dfs_recursive(s);
	updateInstructions("Done!");
	resetGraph();
}

function updateNodeDij(id, dist, prev, visit){
	var node = vgraph.findById(id);
	if(!node) return;	
	vgraph.updateItem(node, {
		label: id + "\ncost: " + (dist == inf ? "\u221e" : dist.toString()) + "\nprev:" + prev.toString(),
		style:{
			fill: visit ? "#ff3300" : "#c6e5ff"
		}
	});
}

function updateGraphDij(dist, prev, visited){
	for(var i = 1; i < n; i++){
			updateNodeDij(i.toString(), dist[i], prev[i], visited[i]);
	}
}

function useEdgePerm(edge1){
	var edge = vgraph.findById(edge1.id);
	vgraph.updateItem(edge, {
		style:{
			stroke: "#ff3300"
		}
	});
}

function useEdgeTmp(edge1){
	var edge = vgraph.findById(edge1.id);
	vgraph.updateItem(edge, {
		style:{
			stroke: "#00ff00"
		}
	});
}

function deleteEdge(edge1){
	var edge = vgraph.findById(edge1.id);
	console.log(edge1);
	vgraph.updateItem(edge, {
		style:{
			stroke: "#e2e2e2"
		}
	});
}

function resetGraphDij(){
	for(var i = 1; i < nextID; i++){
		var node = vgraph.findById(i);
		if(!node) continue;
		if(node){
			vgraph.updateItem(node, {
				label: i.toString(),
				style:{
					fill: "#c6e5ff"
				},
				type: "circle"
			})		
		}
	}
	for(var i = 0; i < edges.length; i++){
		deleteEdge(edges[i]);
	}
}

//dijkstra's starting at node s
var inf = 1e9;

async function algodijkstra(){
	s = await selectNode("Select starting node.");
	var dist = [];
	var prev = [];
	var visited = []
	for(var i = 0; i < n; i++){
		dist.push(inf);
		prev.push(-1);
		visited.push(false);
	}
	updateGraphDij(dist, prev, visited);
	updateInstructions("Initializing all distances to \u221e");
	await sleep();
	dist[s] = 0;
	updateGraphDij(dist, prev, visited);
	updateInstructions("Setting the distance of node " + s.toString() + " to 0.");
	while(true){
		await sleep();
		var u = -1;
		for(var i = 0; i < n; i++){
			if(!visited[i] && (u == -1 || dist[i] < dist[u])) u = i;
		}
		if(u == -1) break;
		if(dist[u] == inf) break;
		updateInstructions("Visiting a unvisited node with minimum distance: node " + u.toString());
		exitNode(u);
		visited[u] = true;
		updateGraphDij(dist, prev, visited);
		await sleep();
		updateInstructions("Updating " + u.toString() + "'s neighbors' distances and \"previous node\"");

		for(var x in graph[u]){
			var node = graph[u][x];
			var nextDist = dist[u] + node[1];
			if(nextDist < dist[node[0]]){
				dist[node[0]] = nextDist;
				prev[node[0]] = u;
			}
		}
		updateGraphDij(dist, prev, visited);
	}
	resetGraph();
	t = await selectNode("Select end node to show shortest path.");
	while(prev[t] != -1){
		updateInstructions("Selecting edge based on the value at \"prev\"");
		useEdgePerm(edgeMap[prev[t]][t]);
		t = prev[t];
		await sleep();
	}
	resetGraphDij();
}


var dagVisited = [];
function DAGdfs(s){
	for(var edge in graph[s]){
		var node = graph[s][edge];
		if(dagVisited[node[0]]){
			return false;
		}else{
			dagVisited[node[0]] = true;
			return DAGdfs(node[0]);
		}
	}
	return true;
}

function isDAG(){
	if(!isdirected) return false;
	for(var i = 1; i < n; i++){
		dagVisited = Array(n)
		for(var j = 0; j < n; j++) dagVisited[j] = false;
		if(!DAGdfs(i)) return false;
	}
	return true;
}


//topological sort
var topSortResult = [];
var topSortVisited = []
async function dfsTopSort(s){
	if(topSortVisited[s]) return;
	console.log(s);
	topSortVisited[s] = true;
	exitNode(s);
	for(var edge in graph[s]){
		var node = graph[s][edge];
		updateInstructions("Looking at the next neighbor of node: " + s.toString());
		exitNode(s);
		if(!topSortVisited[node[0]]){
			await sleep();
			var res = await dfsTopSort(node[0]);
		}
	}
	exitNode(s);
	updateInstructions("Exiting: " + s.toString() + ". Adding " + s.toString() + " to beginning of array");
	topSortResult.unshift(s);
	updateArray(topSortResult.toString());
	await sleep();
}

async function algotopsort(){
	if(!isDAG()){ 
		updateInstructions("Graph must be a DAG (directed acyclic graph)!");
		return;
	}
	topSortResult = [];
	topSortVisited = Array(n);
	for(var i = 0; i < n; i++){
		topSortVisited[i] = false;
	}
	updateInstructions("Perform dfs on each node!")
	await sleep();
	for(var i = 1; i < n; i++) if(!topSortVisited[i]) await dfsTopSort(i);
	resetGraph();
	updateInstructions("Done!");
}

var parent;
function find(a){if(parent[a] == a) return a; return parent[a] = find(parent[a]);}

function comparefunc(a, b){
	return getWeight(a) - getWeight(b);
}

//minimum spanning tree
async function algomst(){
	if(!isweighted){ 
		updateInstructions("Graph must be weighted!")
		return;
	}
	if(isdirected){ 
		updateInstructions("Graph must be undirected!")
		return;
	}
	parent = Array(edges.length);
	for(var i = 0; i < edges.length; i++){
		parent[i] = i;
	}
	edges.sort(comparefunc);
	for(var i = 0; i < edges.length	; i++){
		updateInstructions("Looking at the next smallest weighted edge");
		useEdgeTmp(edges[i]);
		var a = find(parseInt(edges[i].source));
		var b = find(parseInt(edges[i].target));
		await sleep();
		if(a != b){
			updateInstructions("Adding edge to tree, since nodes are not connected");
			useEdgePerm(edges[i]);
			parent[a] = b;
		}else{
			updateInstructions("Nodes are already connected, so do not add edge to tree");
			deleteEdge(edges[i]);
		}
		await sleep();
	}
	updateInstructions("Done!");
	await sleep();
	for(var i = 0; i < edges.length; i++){
		deleteEdge(edges[i]);
	}
}

//strongly connected components

var stackSCC;
var visitedSCC;

async function dfsSCC(s, b){
	visitNode(s);
	visitedSCC[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		updateInstructions("Looking at next neighbor of node : " + s.toString());
		exitNode(s)
		if(!visitedSCC[node[0]]){
			await sleep();
			await dfsSCC(node[0], b);
		}
	}
	if(!b) updateInstructions("Exiting node: " + s.toString() + ". Adding " + s.toString() + " to stack");
	else updateInstructions("Exiting node: " + s.toString() + ". Adding " + s.toString() + " to component");
	exitNode(s)
	stackSCC.push(s);
	await sleep();
}

function reverseGraph(){
	var graphinfo = vgraph.save();
	for(var i = 0; i < graphinfo["edges"].length; i++){
		var edge = vgraph.findById(graphinfo["edges"][i].id);
		vgraph.removeItem(edge);
		var tmp = graphinfo["edges"][i].source;
		graphinfo["edges"][i].source = graphinfo["edges"][i].target;
		graphinfo["edges"][i].target = tmp;
		vgraph.addItem('edge', graphinfo["edges"][i]);
	}
}

async function algoscc(){
	if(!isdirected){ 
		updateInstructions("Graph must be directed!");
		return;
	}
	stackSCC = [];
	visitedSCC = Array(n);
	for(var i = 1; i < n; i++) visitedSCC[i] = false;
	updateInstructions("Preforming dfs on graph");
	await sleep();
	for(var i = 1; i < n; i++) if(!visitedSCC[i]) await dfsSCC(i, false);
	await sleep();
	resetGraph();
	var ngraph = Array(n);
	for(var i= 1; i < n; i++) ngraph[i] = [];
	for(var i = 1; i < n; i++){
		for(var j = 0; j < graph[i].length; j++){
			ngraph[graph[i][j][0]].push([i, graph[i][j][1]]);
		}
	}
	graph = ngraph;
	await sleep();
	updateInstructions("Reverse each edge");
	reverseGraph();
	visitedSCC = Array(n);
	for(var i = 1; i < n; i++) visitedSCC[i] = false;
	lastStack = stackSCC;
	var idCombo = 1;
	console.log(lastStack);
	for(var i = n-2; i >= 0; i--){
		stackSCC = [];
		if(!visitedSCC[lastStack[i]]){
			await sleep();
			updateInstructions("Performing dfs on next node in the stack: " + lastStack[i].toString());
			await sleep();
			await dfsSCC(lastStack[i], true);
			combo = {id: "combo" + idCombo.toString(), nodes:[]};
			for(var j = 0; j < stackSCC.length; j++){
				combo.nodes.push({id: stackSCC[j].toString()});
				var node = vgraph.findById(stackSCC[j]);
				vgraph.updateItem(node, {
					comboId: "combo" + idCombo.toString()
				});
			}
			idCombo++;
			console.log(combo);
			vgraph.addItem('combo', combo);
			console.log(vgraph.save());
			console.log(stackSCC);
			vgraph.data(vgraph.save());
			vgraph.render();
			updateInstructions("Done with dfs, forming the component.");
			await sleep();
		}
	}
	await sleep();
	updateInstructions("Done!");
	resetGraph();
	reverseGraph();
}

//Maximum flow

var flow;

async function maxflowBFS(s, t){
	visited = Array(n);
	parent = Array(n);
	for(var i = 0; i < n; i++){
		visited[i] = false;
		parent[i] = -1;
	}
	q = [s];
	visited[s] = true;
	while(q.length > 0){
		var cur = q[0];
		q.shift();
		if(cur == t){
			return parent;
		}
		for(var i = 0; i < graph[cur].length; i++){
			var e = graph[cur][i][0];
			if(!visited[e] && flow[cur][e] < graph[cur][i][1]){
				visited[e] = true;
				parent[e] = cur;
				q.push(e);
			}
		}
	}
	return false;
}

function updateLabelEdge(id, l){
	var edge = vgraph.findById(id);
	vgraph.updateItem(edge, {
		label: l
	})
}

function min(a, b){
	if(a < b) return a;
	return b;
}

function clearGraphFlow(){
	for(var i = 0; i < edges.length; i++){
		deleteEdge(edges[i]);
		vgraph.updateItem(edges[i].id, {
			label: getWeight(edges[i]).toString()
		})
	}
}
	
async function algomaxflow(){
	if(!isdirected){ 
		updateInstructions("Graph must be directed!");
		return;
	}
	if(!isweighted){ 
		updateInstructions("Graph must be weighted!");
		return;
	}
	flow = Array(n);
	for(var i = 0; i < n; i++) {
		flow[i] = Array(n);
		for(var j = 0; j < n; j++){
			flow[i][j] = 0;
		}
	}
	for(var i = 0; i < edges.length; i++){
		updateLabelEdge(edges[i].id, flow[parseInt(edges[i].source)][parseInt(edges[i].target)].toString() + "/" + getWeight(edges[i]));
	}
	s = await selectNode("Select source");
	t = await selectNode("Select sink");
	while(parent = await maxflowBFS(s, t)){
		var next = t;
		var mi = 1e9;
		while(parent[next] != -1){
			mi = min(mi, getWeight(edgeMap[parent[next]][next]) - flow[parent[next]][next]);
			useEdgePerm(edgeMap[parent[next]][next]);
			next = parent[next];
		}
		updateInstructions("Find a valid path from source to sink");
		await sleep();
		updateInstructions("Add " + mi + " flow to each edge on path");
		next = t;
		while(parent[next] != -1){
			flow[parent[next]][next] += mi;
			next = parent[next];
		}
		for(var i = 0; i < edges.length; i++){
			updateLabelEdge(edges[i].id, flow[parseInt(edges[i].source)][parseInt(edges[i].target)].toString() + "/" + getWeight(edges[i]));
		}
		await sleep();
		next = t;
		while(parent[next] != -1){
			deleteEdge(edgeMap[parent[next]][next]);
			next = parent[next];
		}
	}
	updateInstructions("Done!");
	await sleep();
	clearGraphFlow();
}