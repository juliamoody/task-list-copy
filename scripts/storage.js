class StorageService {
    constructor() {
      this.db = firebase.firestore();
  
      this.tasks = [];
    }
  
    async fetchTasksFromFireStore() {
      let tasks = [];
  
      try {
        const snapshot = await this.db.collection('tasks').get();
  
        for (let doc of snapshot.docs) {
          const data = doc.data();
          const task = new Task(
            doc.id,
            data.name,
            data.completed,
            data.dateCompleted ? data.dateCompleted.toDate() : null
          );
          tasks.push(task);
        }
      } catch (err) {
        console.log(err);
      }
  
      this.tasks = tasks;
    }
  
    async addTask(task) {
      try {
        const docRef = await this.db.collection('tasks').add({
          name: task.name,
          completed: task.completed,
          dateCompleted: task.dateCompleted
        });
        task.id = docRef.id;
        this.tasks.push(task);
        console.log(this.tasks);
      } catch (err) {
        console.log(err);
      }
    }
  
    async updateTask(task) {
      try {
        await this.db
        .collection('tasks')
        .doc(task.id)
        .update({
          name: task.name,
          completed: task.completed,
          dateCompleted: task.dateCompleted
        });

        const updatedTasks = [];

        for (let currTask of this.tasks){
            if (currTask.id == task.id){
                updatedTasks.push(task);
            } else {
                updatedTasks.push(currTask);
            }
        }
        this.tasks = updatedTasks;
  
        // this.tasks = this.tasks.map(x => {    --> above is simplifed version of this
        //    return x.id == task.id ? task : x;
        // });

      } catch (err) {
        console.log(err);
      }
    }
  
    async removeTask(id) {
      try {
        await this.db.collection('tasks').doc(id).delete();
        this.tasks = this.tasks.filter(x => x.id != id);
      } catch(err) {
        console.log(err);
      }
    }
  }
  
  