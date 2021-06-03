class EditTaskModal {

    constructor(ui) {
      this.ui = ui;
      const modalElement = document.getElementById('task-modal');
      this.modal = new bootstrap.Modal(modalElement);
  
      this.taskInput = document.getElementById('task-modal-input');
      this.taskIdInput = document.getElementById('task-modal-id');
    }
  
    openEditModal(task) {
      this.taskInput.value = task.name;
      this.taskIdInput.value = task.id;
      this.modal.show();
    }
  
    async onSaveTask() {
      const taskId = this.taskIdInput.value;
      const task = this.ui.storage.tasks.find(x => x.id == taskId);
      task.name = this.taskInput.value;
  
      await this.ui.storage.updateTask(task);
      this.ui.populateTasksTable();
  
      this.modal.hide();
    }
  }
  
  