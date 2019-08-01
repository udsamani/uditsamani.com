---
date: 2019-04-29
title: 'Graphs: Representation & Traversals'
template: post
thumbnail: '../thumbnails/graph.png'
slug:
categories:
  - Programming

tags:
  - node
  - data Structures
  - algorithms
---

Graph is one of the most commonly used data structure. It consists of a set of vertices, together with a set of unordered pairs of these vertices for an undirected graph or a pair of ordered pairs for a directed graph. Thus as we observe we have two types of graphs:
- Directed graphs
- Undirected graphs

## Undirected Graphs

Mathematically defining an undirected graph $G = (V,E)$ is a set of vertices $V$ and a set of edges $E$, where $E \subseteq V\times V$. Moreover, this relation is symmetric and irrfelexive. By symmetric we mean that if an edge $(U,V) \in E$ then $(V,U) \in E$. On other hand, irreflexive means that $(U,U) \notin E$ .i.e. self loops do not exist. It is a common trend of not having self loops. The main reason behind this is that all algorithms  related to graph consider graphs not having self loops. However, if you requirement demands you to have self loops in your graph data structure, you can always have them and make changes to the algorithms accordingly.

In an undirected graph a path from vertex $U$ to vertex $V$ is a sequence of distinct vertices $V_1, V_2, ..., V_k$ where $V_1 = U$ and $V_k = V$, also $\{V_i,V_{i+1}\} \in E\text{  ,} \forall\text{ } 1 \leq i \leq k-1$. The length of the path is nothing but the number of edges .i.e $k-1$

Now that we have a basic understanding of what are undirected graphs let us look over different ways of representing them.

### Representation

There are two ways of representing graphs :
- Adjacency Matrix
- Adjacency List

A graph $G = (V,E)$, where $V = \{1,2,...n\}$ and $|E| = m$ can be represented as follows

- A $n \times n$ matrix $A$ such that $A[i,j] = 1$ if $\{i,j\} \in E$ and $A[i,j] = 0$ if $\{i,j\} \notin E$. The advantage of an adjacency matrix is that we can check if $\{i,j\} \in E$ in $O(1)$ time. However the trade off is space. We need $O(n^2)$ space even if $m < n^2$.
- In adjacency list, for each vertex $u \in V$, $Adj[u]$ is a lost of all $v$ such that $\{u,v\} \in E$. The advantage here is that the space requried is $O(n+m)$. However the tradeoff is that we cannot easily determine that $\{i,j\} \in E$ or not.

The adjacency lists can be either outgoing adjacency list or incoming adjaceny list. Since we are talking about undirected graphs here it does not matter, however when we start talking about directed graphs we will get a clearer picture.

## Directed Graphs

Mathematically defining an undirected graph $G = (V,E)$ is a set of vertices $V$ and a set of edges $E$, where $E \subseteq V\times V$. Moreover, this relation is irrfelexive. Compared to undirected graphs we no longer have the condition of the relation being symmetric.

Similar to path for undirected graphs we have a directed path for directed graphs. A directed path from $u$ to $v$ is nothing but a sequence of distinct vertices $V_1, V_2, ..., V_k$ where $V_1 = U$ and $V_k = V$, also $\{V_i,V_{i+1}\} \in E\text{  ,} \forall\text{ } 1 \leq i \leq k-1$. The length of the path is nothing but the number of edges .i.e $k-1$.

The representation of directed graphs is similar to undirected graphs. The only difference is that now we no longer have a symmetric relations. Thus in case of adjacency lists we can have to types of adjacency lists:
- $Adj[u]$ is a list of all $v$ such that $\{u,v\} \in E$. Such type of list is called outgoing adjacency list.
- $Adj[u]$ is a list of all $v$ such that $\{v,u\} \in E$. Such type of list called an incoming adjacency list.

```cpp

class DirectedGraph
{
    typedef vector<vector<int>> adjList;

    adjList createGraph(int numVertex, vector<vector<int>> edges)
    {
        adjList graph(numVertex);
        for(auto edge: edges)
        {
            graph[edge[0]].push_back(edge[1]);
        }

        return graph;
    }
}
```
## Traversal

All graph algorithms surround this basic idea of how can we visit all vertices of the graph. To get a broader idea we consider the following traverse algorithm:

```cpp

traverse(int u)
{
    vector<int> visited(numVertex);
    for(int i=0 ;i<numVertex ; ++i)
    {
        visited[i] = false;
    }
    bag g;
    g.push(u)

    while(!g.empty())
    {
        int curr = g.remove();
        if(visited[curr] == false)
        {
            visited[curr] = true;
        }

        for(int v: adjList[curr])
        {
            g.push(v);
        }
    }
}
```
The traversal of a graph can be done in two ways:
- Breadth First Search
- Depth First Search

Depending upon our requrirement we decide upon the traversal we choose. The bag is chosen according to our type of traversal. If we decide to do breadth first seach the bag is nothing but a queue, whereas if we decide to do depth first search, the bag is nothing but a stack. These traversals help us find a variety of features of the graph. For example, for any vertex $u$ we obtain a list of all vertices which we can reach from $u$. This can be useful in cases like airlines where we are trying to determine if there is a flight from one location to other. It can be either via connections or a direct flight.
