class UserInterface {
    constructor() {
      this.modal = new EditTaskModal(this);
      this.storage = new StorageService();
      this.table = document.getElementById('table-body');
      this.taskInput = document.getElementById('task-input');
    }
  
    async initialize() {
      this.initializeFormSubmitListener();
  
      await this.storage.fetchTasksFromFireStore();
  
      this.populateTasksTable();
    }
  
    initializeFormSubmitListener() {
      const taskForm = document.getElementById('task-form');
      taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
  
        this.createTaskFromInput();
        this.clearFormInputs();
      });
    }
  
    async createTaskFromInput() {
      const taskName = this.taskInput.value;
  
      const task = new Task(null, taskName, false, null);
      await this.storage.addTask(task);
  
      this.populateTasksTable();
    }
  
    populateTasksTable() {
      this.clearTable();
  
      for (const task of this.storage.tasks) {
        this.addTaskToTable(task);
      }
    }
  
    clearTable() {
      let length = this.table.children.length;
      for (let i = 0; i < length; i++) {
        const row = this.table.children[0];
        row.remove();
      }
    }
  
    addTaskToTable(task) {
      const row = document.createElement('tr');
  
      row.innerHTML = `
        <td>${task.name}</td>
        <td>${this.getCompleteIconHtml(task)}</td>
        <td>${this.formatDate(task.dateCompleted)}</td>
        <td>
          <i id="edit-${task.id}" class="bi bi-pencil pointer me-2"></i>
          <i id="delete-${task.id}" class="bi bi-trash pointer"></i>
        </td>
      `;
  
      this.table.append(row);
      this.addCompleteTaskListenerToRow(task);
      this.addEditTaskListenerToRow(task);
      this.addDeleteListenerToRow(task);
    }
  
    getCompleteIconHtml(task) {
      if (task.completed) {
        return `<i id="complete-${task.id}" class="bi bi-circle-fill green pointer"></i>`
      } else {
        return `<i id="complete-${task.id}" class="bi bi-circle green pointer"></i>`
      }
    }
  
    formatDate(date) {
      if (!date) { return ''; }
  
      let year = date.getFullYear();
      let month = (date.getMonth() + 1 + '').padStart(2, '0');
      let day = (date.getDate() + '').padStart(2, '0');
  
      return `${year}/${month}/${day}`;
    }
  
    addCompleteTaskListenerToRow(task) {
      document.getElementById('complete-' + task.id).addEventListener('click', async () => {
        task.completed = !task.completed;
        task.dateCompleted = task.completed ? new Date() : null;
        await this.storage.updateTask(task);
        this.populateTasksTable();
      })
    }
  
    addEditTaskListenerToRow(task) {
      document.getElementById('edit-' + task.id).addEventListener('click', () => {
        this.modal.openEditModal(task);
      })
    }
  
    addDeleteListenerToRow(task) {
      document.
      getElementById('delete-' + task.id).
      addEventListener('click', () => this.onDeleteTaskClicked(task)); 

    }

    async onDeleteTaskClicked(task) {
        await this.storage.removeTask(task.id);
        this.populateTasksTable();
    }
  
    clearFormInputs() {
      this.taskInput.value = '';
    }
  }