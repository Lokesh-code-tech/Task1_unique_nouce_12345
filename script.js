(() => {
  const STORAGE_KEY = 'todo-app-tasks';
  const form = document.getElementById('todo-form');
  const input = document.getElementById('new-task');
  const list = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render() {
    const tasks = loadTasks();
    list.innerHTML = '';
    if (tasks.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      tasks.forEach(t => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (t.completed ? ' completed' : '');
        li.setAttribute('data-id', t.id);

        const title = document.createElement('span');
        title.className = 'task-name';
        title.textContent = t.text;

        const controls = document.createElement('div');
        controls.className = 'action-buttons';

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.textContent = t.completed ? 'Undo' : 'Complete';
        toggleBtn.setAttribute('aria-label', t.completed ? 'Mark as not done' : 'Mark as done');

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('aria-label', 'Delete task');

        controls.appendChild(toggleBtn);
        controls.appendChild(deleteBtn);

        li.appendChild(title);
        li.appendChild(controls);

        list.appendChild(li);
      });
    }
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const tasks = loadTasks();
    tasks.push({ id: Date.now(), text: trimmed, completed: false });
    saveTasks(tasks);
    render();
  }

  function toggleTask(id) {
    const tasks = loadTasks();
    const t = tasks.find(x => x.id === id);
    if (!t) return;
    t.completed = !t.completed;
    saveTasks(tasks);
    render();
  }

  function deleteTask(id) {
    let tasks = loadTasks();
    tasks = tasks.filter(x => x.id !== id);
    saveTasks(tasks);
    render();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(input.value);
    input.value = '';
    input.focus();
  });

  list.addEventListener('click', (e) => {
    const li = e.target.closest('li.todo-item');
    if (!li) return;
    const id = Number(li.getAttribute('data-id'));
    if (e.target.closest('.toggle-btn')) {
      toggleTask(id);
    } else if (e.target.closest('.delete-btn')) {
      deleteTask(id);
    }
  });

  render();
})();
