# Pathfinding Algorithms Visualised

Click [here](https://archi-71.github.io/pathfinding-visualisation/) to see the project.

This project is an educational visualiser website which allows the user to see how a variety of graph traversal algorithms operate in a grid of cells to find a path between a start and end point.

Pathfinding algorithms operate on a 2D grid of cells, where empty cells (dark grey) represent a node in a graph, and obstructed cells (white) represent the absence of a node. Empty cells have edges to adjacent empty cells along which the algorithms can traverse the graph. Different grid layouts can be generated by the user by selecting between different generation schemes. The 'Blank' generation is an empty grid with no obstructions, the 'Random' generation is a random grid where each cell has a 1 in 4 chance to be obstructed and is empty otherwise, and finally the 'Maze' generation creates a random maze containing loops. Each generation scheme randomly positions the start (green) and end (red) cells for the search. Further, the user can click and drag the mouse to draw/erase obstructions in the grid, as well as dragging the start/end points to different positions.

Leaving the 'Allow diagonal connections?' checkbox unchecked means adjacent nodes are considered to be just the 4 orthogonal cells around a cell, whilst checking the box means the 8 surrounding cells are considered, allowing for diagonal movements.

Users can select between 3 different pathfinding algorithms; breadth-first search, depth-first search, and the A* search algorithm. Depth first search uses a stack data structure to explore as far down one path as possible before backtracking, whilst breadth-first search uses a queue data structure meaning it explores cells equidistantly from the start point by prioritising nearest cells first. The A* algorithm improves breadth-first search with an additional heuristic measure based on the distance from the end-point, which generally guides the search in the right direction. By clicking the 'Pathfind' button, the algorithm is ran one operation at a time at a speed adjustable with the speed slider.

Cells are coloured yellow to represent explored cells, orange to represent the 'frontier' (i.e. those somewhere in the queue to be explored next), and finally light blue to show the path found upon completion of the algorithm. Breadth-first search and the A* algorithm guarantee the shortest path to be found, whilst depth-first search does not. If obstructions make any path from start to end impossible, the pathfinding algorithms will fail, with an appropriate message, but otherwise the lenghth of the shortest path is displayed. Additionally a running total is kept of the total number of explored cells during a search, which is displayed to allow the efficiency of algorithms to be compared.

<img width="1512" alt="image" src="https://github.com/archi-71/PathfindingVisualisation/assets/70474549/c46478ff-1c65-4e72-8de3-783d37644ef5">
<img width="1512" alt="image" src="https://github.com/archi-71/PathfindingVisualisation/assets/70474549/e479ec26-8755-4bcd-ad49-693bfe428efb">
<img width="1512" alt="image" src="https://github.com/archi-71/PathfindingVisualisation/assets/70474549/d35e3ad7-b59e-41c2-b048-6bbf5fa0f6f8">
<img width="1512" alt="image" src="https://github.com/archi-71/PathfindingVisualisation/assets/70474549/9db7e1f4-db1d-4029-b7ad-4e8cea2844b1">
<img width="1512" alt="image" src="https://github.com/archi-71/PathfindingVisualisation/assets/70474549/6df9be3d-233e-4d41-8eec-41a6525a023b">
<img width="1512" alt="image" src="https://github.com/archi-71/PathfindingVisualisation/assets/70474549/6c76ef85-7c26-4330-9c4b-0da8af1d0484">
