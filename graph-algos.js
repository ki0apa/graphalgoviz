//number of nodes in the graph
var n;

//Test graph for Dijstra's
//var graph = [[[1, 3], [2, 1]], [[0, 3], [2, 1], [3, 2]], [[0, 1], [1, 1]], [[1, 2], [4, 6]], [[3, 6]]];

//Test graph for top sort
//var graph = [[], [[0, 1], [2, 1]], [[4, 1]], [[2, 1]], []];

var graph;
var edges = [];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function convertGraph(){
	var graphinfo = vgraph.save();
	graph = new Array(nextID);
	n = nextID;
	for(var i = 0; i < nextID; i++){
		graph[i] = []
	}
	console.log(graphinfo["nodes"]);
	edges = graphinfo["edges"];
	for(var i = 0; i < graphinfo["edges"].length; i++){
		graph[parseInt(graphinfo["edges"][i].source)].push([parseInt(graphinfo["edges"][i].target), 0]);
		if(!directed){
			graph[parseInt(graphinfo["edges"][i].target)].push([parseInt(graphinfo["edges"][i].source), 0]);
		}
	}
	console.log(edges);
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

//breadth first search starting at node s
async function algobfs(){
	console.log(graph);
	var s = 1;
	var q = [s];
	var visited = [];
	for(var i = 0; i < n; i++){
		visited.push(false);
	}
	visited[s] = true;
	visitNode(s);
	while(q.length > 0){
		await sleep(1000);
		var cur = q[0];
		exitNode(cur);
		q.shift();
		for(var edge in graph[cur]){
			var node = graph[cur][edge];
			if(!visited[node[0]]){
				visitNode(node[0]);
				visited[node[0]] = true;
				q.push(node[0]);
			}
		}
	}
	resetGraph();
}

//depth first search starting at node s
async function dfs_recursive(s){
	console.log(s);
	await sleep(1000);
	visitNode(s);
	dfsVisited[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		if(!dfsVisited[node[0]])
			await dfs_recursive(node[0]);
	}
	exitNode(s);
}

var dfsVisited = []
function algodfs(){
	var s = 1;
	dfsVisited = Array(n);
	for(var i = 0; i < n; i++) dfsVisited[i] = false;
	dfs_recursive(s);
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

//dijkstra's starting at node s
var inf = 1e9;

async function algodijkstra(){
	s = 1;
	var dist = [];
	var prev = [];
	var visited = []
	for(var i = 0; i < n; i++){
		dist.push(inf);
		prev.push(-1);
		visited.push(false);
	}
	dist[s] = 0;
	updateGraphDij(dist, prev, visited);
	while(true){
		await sleep(1000);
		var u = -1;
		for(var i = 0; i < n; i++){
			if(!visited[i] && (u == -1 || dist[i] < dist[u])) u = i;
		}
		if(u == -1) break;
		visited[u] = true;


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
}


//topological sort
var topSortResult = [];
var topSortVisited = []
async function dfsTopSort(s, b){
	if(topSortVisited[s]) return;
	console.log(s);
	if(b) await sleep(1000);
	if(b) visitNode(s);
	topSortVisited[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		if(!topSortVisited[node[0]]){
			var res = await dfsTopSort(node[0], b);
		}
	}
	topSortResult.unshift(s);
	if(b) exitNode(s);
}

async function algotopsort(){
	topSortResult = [];
	topSortVisited = Array(n);
	for(var i = 0; i < n; i++){
		topSortVisited[i] = false;
	}
	for(var i = 0; i < n; i++) if(!topSortVisited[i]) await dfsTopSort(i, true);
}

var parent;
function find(a){if(parent[a] == a) return a; return parent[a] = find(parent[a]);}

function useEdge(edge1){
	edge = vgraph.findById(edge1.id);
	vgraph.updateItem(edge, {
		style:{
			stroke: "#ff0000"
		}
	})
}

//minimum spanning tree
async function algomst(){
	parent = Array(edges.length);
	for(var i = 0; i < edges.length; i++){
		parent[i] = i;
	}
	for(var i = 0; i < edges.length	; i++){
		console.log(parent);
		if(find(edges[i].source) != find(edges[i].target)){
			useEdge(edges[i]);
			parent[find(edges[i].source)] = find(edges[i].target);
		}
	}
}

//strongly connected components

var stackSCC;
var visitedSCC;

async function dfsSCC(s){
	console.log(s);
	visitedSCC[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		if(!visitedSCC[node[0]])
			dfsSCC(node[0]);
	}
	console.log(s);
	stackSCC.push(s);
}

async function algoscc(){
	stackSCC = [];
	visitedSCC = Array(n);
	for(var i = 1; i < n; i++) visitedSCC[i] = false;
	for(var i = 1; i < n; i++) if(!visitedSCC[i]) dfsSCC(i);
	var ngraph = Array(n);
	for(var i= 1; i < n; i++) ngraph[i] = [];
	for(var i = 1; i < n; i++){
		for(var j = 0; j < graph[i].length; j++){
			ngraph[graph[i][j][0]].push([i, graph[i][j][1]]);
		}
	}
	graph = ngraph;
	console.log(graph);
	visitedSCC = Array(n);
	for(var i = 1; i < n; i++) visitedSCC[i] = false;
	lastStack = stackSCC;
	var idCombo = 1;
	for(var i = n-2; i >= 0; i--){
		stackSCC = [];
		if(!visitedSCC[lastStack[i]]){
			dfsSCC(lastStack[i]);
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
		}
	}
	vgraph.data(vgraph.save());
	vgraph.render();
}

//Maximum flow
//bipartite matching