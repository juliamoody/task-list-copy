class Task {
    constructor(id, task, completed, dateCompleted) {
      this.id = id;
      this.name = task;
      this.completed = completed;
      this.dateCompleted = dateCompleted ? new Date(dateCompleted) : null;
    }
  }