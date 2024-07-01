import heapq

def validate_state(state):
    expected = set(range(9))
    actual = set()
    for row in state:
        actual.update(row)
    if expected != actual:
        raise ValueError(f"State {state} is invalid. It should contain all numbers from 0 to 8.")

def heuristic(state, goal):
    # Manhattan distance heuristic
    distance = 0
    flat_goal = [num for row in goal for num in row]  # Flatten the goal state
    for i in range(3):
        for j in range(3):
            if state[i][j] != 0:
                goal_index = flat_goal.index(state[i][j])
                goal_i, goal_j = divmod(goal_index, 3)
                distance += abs(i - goal_i) + abs(j - goal_j)
    return distance

def a_star(initial, goal):
    validate_state(initial)
    validate_state(goal)

    initial = tuple(map(tuple, initial))
    goal = tuple(map(tuple, goal))

    frontier = [(heuristic(initial, goal), 0, initial, [])]
    explored = set()

    while frontier:
        _, cost, state, path = heapq.heappop(frontier)

        if state == goal:
            return path + [state]

        explored.add(state)

        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            x, y = next((x, y) for x, row in enumerate(state) for y, val in enumerate(row) if val == 0)
            nx, ny = x + dx, y + dy

            if 0 <= nx < 3 and 0 <= ny < 3:
                new_state = [list(row) for row in state]
                new_state[x][y], new_state[nx][ny] = new_state[nx][ny], new_state[x][y]
                new_state = tuple(map(tuple, new_state))

                if new_state not in explored:
                    heapq.heappush(frontier, (cost + 1 + heuristic(new_state, goal), cost + 1, new_state, path + [state]))

    return None
