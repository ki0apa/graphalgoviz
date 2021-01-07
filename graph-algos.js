//number of nodes in the graph
var n;

//Test graph for Dijstra's
//var graph = [[[1, 3], [2, 1]], [[0, 3], [2, 1], [3, 2]], [[0, 1], [1, 1]], [[1, 2], [4, 6]], [[3, 6]]];

//Test graph for top sort
//var graph = [[], [[0, 1], [2, 1]], [[4, 1]], [[2, 1]], []];

var graph;
var edges = [];
var edgeMap;
var sleeptime = 3000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getWeight(edge){
	return parseInt(edge.label.replace("Weight: ", ""))
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
		var weight = getWeight(graphinfo["edges"][i]);
		graph[parseInt(graphinfo["edges"][i].source)].push([parseInt(graphinfo["edges"][i].target), weight]);
		edgeMap[parseInt(graphinfo["edges"][i].source)][parseInt(graphinfo["edges"][i].target)] = graphinfo["edges"][i];
		if(!directed){
			graph[parseInt(graphinfo["edges"][i].target)].push([parseInt(graphinfo["edges"][i].source), weight]);
			edgeMap[parseInt(graphinfo["edges"][i].target)][parseInt(graphinfo["edges"][i].source)] = graphinfo["edges"][i];
		}
	}
	console.log(edgeMap);	
}

function updateInstructions(str){
	instructions.innerHTML = str;
}

function updateArray(str){
	arraydata.innerHTML = str;
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
	if(!node) return;
	vgraph.updateItem(node, {
		style:{
			fill: "#ff0000"
		}
	})
}

function resetGraph(){
	for(var i = 1; i < nextID; i++){
		var node = vgraph.findById(i);
		if(!node) continue;
		if(node){
			vgraph.updateItem(node, {
				style:{
					fill: "#B0C4DE"
				}
			})		
		}
	}
}

async function selectNode(message){
	updateInstructions(message);
	startNode = -1;
	vgraph.setMode("startNode");
	while(startNode == -1) await sleep(100);
	console.log(startNode);
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
	while(q.length > 0){
		var cur = q[0];
		exitNode(cur);
		updateInstructions("Looking at the neighbors of node: " + cur.toString());
		q.shift();
		for(var edge in graph[cur]){
			var node = graph[cur][edge];
			if(!visited[node[0]]){
				visitNode(node[0]);
				visited[node[0]] = true;
				q.push(node[0]);
			}
		}
		await sleep(sleeptime);
	}
	resetGraph();
}

//depth first search starting at node s
async function dfs_recursive(s){
	updateInstructions("Entering node: " + s.toString());
	visitNode(s);
	dfsVisited[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		await sleep(sleeptime);
		updateInstructions("Looking at next neighbor of node: " + s.toString());
		if(!dfsVisited[node[0]])
			await dfs_recursive(node[0]);
	}
	await sleep(sleeptime);
	updateInstructions("Exit node: " + s.toString());
	exitNode(s);
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
	console.log(visit ? "#ff0000" : "B0C4DE");
	vgraph.updateItem(node, {
		label: id + "\ncost: " + (dist == inf ? "\u221e" : dist.toString()) + "\nprev:" + prev.toString(),
		style:{
			fill: visit ? "#ff0000" : "#B0C4DE"
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
			stroke: "#ff0000"
		}
	})
}

function useEdgeTmp(edge1){
	var edge = vgraph.findById(edge1.id);
	vgraph.updateItem(edge, {
		style:{
			stroke: "#00ff00"
		}
	})
}

function deleteEdge(edge1){
	var edge = vgraph.findById(edge1.id);
	vgraph.updateItem(edge, {
		style:{
			stroke: "#808080"
		}
	})
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
	await sleep(sleeptime);
	dist[s] = 0;
	updateGraphDij(dist, prev, visited);
	updateInstructions("Setting the distance at " + s.toString() + " to 0.");
	while(true){
		await sleep(sleeptime);
		var u = -1;
		for(var i = 0; i < n; i++){
			if(!visited[i] && (u == -1 || dist[i] < dist[u])) u = i;
		}
		if(u == -1) break;
		if(dist[u] == inf) break;
		updateInstructions("Visiting a unvisited node with minimum distance: node " + u.toString());
		visited[u] = true;
		updateGraphDij(dist, prev, visited);
		await sleep(sleeptime);
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
	t = await selectNode("Select end node to show shortest path.");
	while(prev[t] != -1){
		updateInstructions("Selecting edge based on the value at \"prev\"");
		useEdgePerm(edgeMap[prev[t]][t]);
		t = prev[t];
		await sleep(sleeptime);
	}
}


//topological sort
var topSortResult = [];
var topSortVisited = []
async function dfsTopSort(s){
	if(topSortVisited[s]) return;
	console.log(s);
	await sleep(sleeptime);
	updateInstructions("Visiting node: " + s.toString());
	visitNode(s);
	topSortVisited[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		if(!topSortVisited[node[0]]){
			var res = await dfsTopSort(node[0]);
		}
	}
	await sleep(sleeptime);
	updateInstructions("Exiting: " + s.toString() + ". Add " + s.toString() + " to beginning of array");
	topSortResult.unshift(s);
	updateArray(topSortResult.toString());
	exitNode(s);
}

async function algotopsort(){
	topSortResult = [];
	topSortVisited = Array(n);
	for(var i = 0; i < n; i++){
		topSortVisited[i] = false;
	}
	updateInstructions("Perform dfs on each node!")

	for(var i = 1; i < n; i++) if(!topSortVisited[i]) await dfsTopSort(i);
}

var parent;
function find(a){if(parent[a] == a) return a; return parent[a] = find(parent[a]);}

function comparefunc(a, b){
	return getWeight(a) - getWeight(b);
}

//minimum spanning tree
async function algomst(){
	parent = Array(edges.length);
	for(var i = 0; i < edges.length; i++){
		parent[i] = i;
	}
	edges.sort(comparefunc);
	for(var i = 0; i < edges.length	; i++){
		updateInstructions("Looking at the smallest weighted edge");
		useEdgeTmp(edges[i]);
		var a = find(parseInt(edges[i].source));
		var b = find(parseInt(edges[i].target));
		await sleep(sleeptime);
		if(a != b){
			updateInstructions("Adding edge to tree, since nodes are not connected");
			useEdgePerm(edges[i]);
			parent[a] = b;
		}else{
			updateInstructions("Nodes are already connected, so do not add edge to tree");
			deleteEdge(edges[i]);
		}
		await sleep(sleeptime);
	}
	updateInstructions("Done!");
}

//strongly connected components

var stackSCC;
var visitedSCC;

async function dfsSCC(s, b){
	await sleep(sleeptime);
	updateInstructions("Visiting node: " + s.toString());
	visitNode(s);
	visitedSCC[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		if(!visitedSCC[node[0]])
			await dfsSCC(node[0], b);
	}
	await sleep(sleeptime);
	if(!b) updateInstructions("Adding " + s.toString() + " to stack");
	else updateInstructions("Adding " + s.toString() + " to component");
	exitNode(s)
	stackSCC.push(s);
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
	stackSCC = [];
	visitedSCC = Array(n);
	for(var i = 1; i < n; i++) visitedSCC[i] = false;
	updateInstructions("Preforming dfs on graph");
	for(var i = 1; i < n; i++) if(!visitedSCC[i]) await dfsSCC(i, false);
	await sleep(sleeptime);
	resetGraph();
	var ngraph = Array(n);
	for(var i= 1; i < n; i++) ngraph[i] = [];
	for(var i = 1; i < n; i++){
		for(var j = 0; j < graph[i].length; j++){
			ngraph[graph[i][j][0]].push([i, graph[i][j][1]]);
		}
	}
	graph = ngraph;
	await sleep(sleeptime);
	updateInstructions("reverse each edge");
	reverseGraph();
	visitedSCC = Array(n);
	for(var i = 1; i < n; i++) visitedSCC[i] = false;
	lastStack = stackSCC;
	var idCombo = 1;
	console.log(lastStack);
	for(var i = n-2; i >= 0; i--){
		stackSCC = [];
		if(!visitedSCC[lastStack[i]]){
			await sleep(sleeptime);
			updateInstructions("Performing dfs on next node in the stack: " + lastStack[i].toString());
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
		}
	}
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

async function algomaxflow(){
	flow = Array(n);
	for(var i = 0; i < n; i++) {
		flow[i] = Array(n);
		for(var j = 0; j < n; j++){
			flow[i][j] = 0;
		}
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
		await sleep(sleeptime);
		updateInstructions("Add " + mi + " flow to edge edge on path");
		next = t;
		while(parent[next] != -1){
			flow[parent[next]][next] += mi;
			next = parent[next];
		}
		for(var i = 0; i < n; i++){
			for(var j = 0; j < n; j++){
				if(flow[i][j] > 0){
					updateLabelEdge(edgeMap[i][j].id, flow[i][j].toString() + "/" + getWeight(edgeMap[i][j]));
				}
			}
		}
		await sleep(sleeptime);
		next = t;
		while(parent[next] != -1){
			deleteEdge(edgeMap[parent[next]][next]);
			next = parent[next];
		}
	}
}