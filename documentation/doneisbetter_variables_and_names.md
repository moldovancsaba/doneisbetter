Backend Variables and Names

Environment Variables (.env)
	•	MONGO_URI:
	•	Description: MongoDB Atlas connection string.
	•	Value: mongodb+srv://thanperfect:CuW54NNNFKnGQtt6@doneisbetter.49s2z.mongodb.net/doneisbetter?retryWrites=true&w=majority
	•	PORT:
	•	Description: Port on which the backend server runs.
	•	Value: 5001

Server (server.js)
	•	app:
	•	Description: Express application instance.
	•	server:
	•	Description: HTTP server created using Express.
	•	io:
	•	Description: Socket.io server instance for real-time communication.
	•	Task:
	•	Description: Mongoose model representing tasks.
	•	socket:
	•	Description: Socket.io connection object for each connected user.

Mongoose Model (models/Task.js)
	•	TaskSchema:
	•	todo:
	•	Type: Array
	•	Description: List of tasks to be done.
	•	inProgress:
	•	Type: Array
	•	Description: List of tasks currently in progress.
	•	done:
	•	Type: Array
	•	Description: List of completed tasks.

API Routes
	•	GET /tasks:
	•	Description: Fetches the latest tasks document.
	•	Response:

{
  todo: [],
  inProgress: [],
  done: []
}


	•	POST /tasks:
	•	Description: Adds a new task to the todo list.
	•	Request Body:

{
  task: "New Task"
}


	•	Response:

{
  message: "Task added successfully"
}

Frontend Variables and Names

Environment Variables (.env.local)
	•	NEXT_PUBLIC_API_URL:
	•	Description: Base URL for API requests.
	•	Value: http://localhost:5001

State and Variables (index.js)
	•	task:
	•	Description: Input value for the new card.
	•	tasks:
	•	Description: Object holding three arrays for card management:
	•	todo: Array of tasks to be done.
	•	inProgress: Array of tasks currently in progress.
	•	done: Array of completed tasks.
	•	setTask:
	•	Description: Function to update the task state.
	•	setTasks:
	•	Description: Function to update the tasks state.

Functions (index.js)
	•	fetchTasks():
	•	Description: Fetches tasks from the backend and updates the state.
	•	addTask():
	•	Description: Sends a POST request to add a new card.
	•	useEffect():
	•	Description: Initializes tasks fetching and sets up Socket.io listener for real-time updates.

Socket.io (index.js and server.js)
	•	tasksUpdated:
	•	Description: Event triggered when tasks are added or updated.
	•	Usage: Real-time synchronization across all connected clients.

JSX Component Structure (index.js)
	•	Home():
	•	Root component that renders:
	•	Input field for adding new cards.
	•	List of cards displayed as separate divs under:
	•	todo
	•	inProgress
	•	done

Summary of Naming Conventions
	•	Task: Consistent name across model, state, and API endpoints.
	•	tasksUpdated: Consistent event name for real-time synchronization.
	•	todo, inProgress, done: Consistent keys for categorizing cards.

This list reflects the current state and naming conventions of variables, states, and API endpoints. If you want any renaming, refactoring, or additional variables, we can proceed accordingly.