//number of nodes in the graph
var n;

//Test graph for Dijstra's
//var graph = [[[1, 3], [2, 1]], [[0, 3], [2, 1], [3, 2]], [[0, 1], [1, 1]], [[1, 2], [4, 6]], [[3, 6]]];

//Test graph for top sort
//var graph = [[], [[0, 1], [2, 1]], [[4, 1]], [[2, 1]], []];

var graph;

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
	for(var i = 0; i < graphinfo["edges"].length; i++){
		graph[parseInt(graphinfo["edges"][i].source)].push([parseInt(graphinfo["edges"][i].target), 0]);
		if(!directed){
			graph[parseInt(graphinfo["edges"][i].target)].push([parseInt(graphinfo["edges"][i].source), 0]);
		}
	}
	console.log(graph);
}

function visitNode(id){
	var node = vgraph.findById(id);
	vgraph.updateItem(node, {
		style:{
			fill: "#00ff00"
		}
	})
}

function exitNode(id){
	var node = vgraph.findById(id);
	vgraph.updateItem(node, {
		style:{
			fill: "#ff0000"
		}
	})
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
}

//depth first search starting at node s
function dfs_recursive(s){
	dfsVisited[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		if(!dfsVisited[node[0]])
			dfs_recursive(node[0]);
	}
}

var dfsVisited = []
function algodfs(s){
	dfsVisited = Array(n);
	for(var i = 0; i < n; i++) dfsVisited[i] = false;
	dfs_recursive(s);
}

//dijkstra's starting at node s
var inf = 1e9;

function algodijkstra(s){
	var dist = [];
	var prev = [];
	var visited = []
	for(var i = 0; i < n; i++){
		dist.push(inf);
		prev.push(-1);
		visited.push(false);
	}
	dist[s] = 0;
	while(true){
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
	}
}


//topological sort
var topSortResult = [];
var topSortVisited = []
function dfsTopSort(s){
	if(topSortVisited[s]) return;
	topSortVisited[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		if(!topSortVisited[node[0]])
			dfsTopSort(node[0]);
	}
	topSortResult.unshift(s);
}

function algotopsort(){
	topSortResult = [];
	topSortVisited = Array(n);
	for(var i = 0; i < n; i++){
		topSortVisited[i] = false;
	}
	for(var i = 0; i < n; i++) dfsTopSort(i);
	console.log(topSortResult);
}