//number of nodes in the graph
var n = 5;

//Test graph for Dijstra's
//var graph = [[[1, 3], [2, 1]], [[0, 3], [2, 1], [3, 2]], [[0, 1], [1, 1]], [[1, 2], [4, 6]], [[3, 6]]];

//Test graph for top sort
//var graph = [[], [[0, 1], [2, 1]], [[4, 1]], [[2, 1]], []];

//breadth first search starting at node s
function BFS(s){
	var q = [s];
	var visited = [];
	for(var i = 0; i < n; i++){
		visited.push(false);
	}
	visited[s] = true;
	while(q.length > 0){
		var cur = q[0];
		console.log(q);
		q.shift();
		for(var edge in graph[cur]){
			var node = graph[cur][edge];
			if(!visited[node[0]]){
				visited[node[0]] = true;
				q.push(node[0]);
			}
		}
	}
}

//depth first search starting at node s
function DFS_recursive(s){
	dfsVisited[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		if(!dfsVisited[node[0]])
			DFS_recursive(node[0]);
	}
}

var dfsVisited = []
function DFS(s){
	dfsVisited = Array(n);
	for(var i = 0; i < n; i++) dfsVisited[i] = false;
	DFS_recursive(s);
}

//dijkstra's starting at node s
var inf = 1e9;

function dijkstra(s){
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
function DFSTopSort(s){
	if(topSortVisited[s]) return;
	topSortVisited[s] = true;
	for(var edge in graph[s]){
		var node = graph[s][edge];
		if(!topSortVisited[node[0]])
			DFSTopSort(node[0]);
	}
	topSortResult.unshift(s);
}

topologicalSort();

function topologicalSort(){
	topSortResult = [];
	topSortVisited = Array(n);
	for(var i = 0; i < n; i++){
		topSortVisited[i] = false;
	}
	for(var i = 0; i < n; i++) DFSTopSort(i);
	console.log(topSortResult);
}