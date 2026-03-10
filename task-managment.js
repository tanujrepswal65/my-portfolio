
    // Initial data
    const defaultTasks = [
      {
        id: '1',
        title: 'Design homepage mockup',
        description: 'Create wireframes and high-fidelity designs for the landing page',
        priority: 'high',
        category: 'design',
        status: 'inprogress',
        dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        completed: false,
        createdAt: Date.now()
      },
      {
        id: '2',
        title: 'Set up project repository',
        description: 'Initialize Git repo, add README and contribution guidelines',
        priority: 'medium',
        category: 'development',
        status: 'done',
        dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        completed: true,
        createdAt: Date.now() - 172800000
      },
      {
        id: '3',
        title: 'Write API documentation',
        description: 'Document all REST endpoints with examples',
        priority: 'low',
        category: 'development',
        status: 'todo',
        dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        completed: false,
        createdAt: Date.now() - 86400000
      },
      {
        id: '4',
        title: 'User research interviews',
        description: 'Conduct 5 user interviews for the new feature',
        priority: 'high',
        category: 'research',
        status: 'todo',
        dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        completed: false,
        createdAt: Date.now()
      },
      {
        id: '5',
        title: 'Fix navigation bug',
        description: 'Mobile menu not closing on route change',
        priority: 'medium',
        category: 'development',
        status: 'inprogress',
        dueDate: new Date(Date.now()).toISOString().split('T')[0],
        completed: false,
        createdAt: Date.now() - 43200000
      }
    ];

    const categories = [
      { id: 'development', name: 'Development', color: '#3b82f6' },
      { id: 'design', name: 'Design', color: '#ec4899' },
      { id: 'research', name: 'Research', color: '#8b5cf6' },
      { id: 'marketing', name: 'Marketing', color: '#f59e0b' },
      { id: 'other', name: 'Other', color: '#6b7280' }
    ];

    // State
    let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || defaultTasks;
    let currentFilter = 'all';
    let currentPriority = 'all';
    let searchQuery = '';
    let editingTaskId = null;
    let draggedTask = null;

    // DOM Elements
    const elements = {
      addTaskBtn: document.getElementById('addTaskBtn'),
      taskModal: document.getElementById('taskModal'),
      closeModal: document.getElementById('closeModal'),
      cancelBtn: document.getElementById('cancelBtn'),
      taskForm: document.getElementById('taskForm'),
      searchInput: document.getElementById('searchInput'),
      todoList: document.getElementById('todoList'),
      inprogressList: document.getElementById('inprogressList'),
      doneList: document.getElementById('doneList'),
      todoCount: document.getElementById('todoCount'),
      inprogressCount: document.getElementById('inprogressCount'),
      doneCount: document.getElementById('doneCount'),
      allCount: document.getElementById('allCount'),
      totalCount: document.getElementById('totalCount'),
      completedCount: document.getElementById('completedCount'),
      progressBar: document.getElementById('progressBar'),
      progressPercent: document.getElementById('progressPercent'),
      categoryList: document.getElementById('categoryList'),
      taskCategory: document.getElementById('taskCategory'),
      modalTitle: document.getElementById('modalTitle'),
      submitBtnText: document.getElementById('submitBtnText')
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      renderCategories();
      renderTasks();
      updateStats();
      setupEventListeners();
    });

    // Render categories
    function renderCategories() {
      elements.categoryList.innerHTML = categories.map(cat => `
        <div class="sidebar-link" data-category="${cat.id}">
          <span class="w-3 h-3 rounded-full" style="background: ${cat.color};"></span>
          ${cat.name}
          <span class="ml-auto text-xs" style="color: var(--muted);">${tasks.filter(t => t.category === cat.id).length}</span>
        </div>
      `).join('');

      elements.taskCategory.innerHTML = categories.map(cat => 
        `<option value="${cat.id}">${cat.name}</option>`
      ).join('');
    }

    // Get filtered tasks
    function getFilteredTasks() {
      return tasks.filter(task => {
        // Search filter
        if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Priority filter
        if (currentPriority !== 'all' && task.priority !== currentPriority) {
          return false;
        }
        
        // Status/view filter
        switch (currentFilter) {
          case 'today':
            const today = new Date().toISOString().split('T')[0];
            return task.dueDate === today;
          case 'important':
            return task.priority === 'high';
          case 'completed':
            return task.completed;
          default:
            return true;
        }
      });
    }

    // Render tasks
    function renderTasks() {
      const filteredTasks = getFilteredTasks();
      
      const todoTasks = filteredTasks.filter(t => t.status === 'todo' && !t.completed);
      const inprogressTasks = filteredTasks.filter(t => t.status === 'inprogress' && !t.completed);
      const doneTasks = filteredTasks.filter(t => t.status === 'done' || t.completed);

      elements.todoList.innerHTML = renderTaskList(todoTasks);
      elements.inprogressList.innerHTML = renderTaskList(inprogressTasks);
      elements.doneList.innerHTML = renderTaskList(doneTasks);

      // Update counts
      elements.todoCount.textContent = todoTasks.length;
      elements.inprogressCount.textContent = inprogressTasks.length;
      elements.doneCount.textContent = doneTasks.length;

      // Setup drag and drop
      setupDragAndDrop();
    }

    // Render task list
    function renderTaskList(taskList) {
      if (taskList.length === 0) {
        return `
          <div class="empty-state">
            <svg class="w-12 h-12 mx-auto mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <p class="text-sm">No tasks here</p>
          </div>
        `;
      }

      return taskList.map((task, index) => {
        const category = categories.find(c => c.id === task.category) || categories[4];
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
        
        return `
          <div class="task-card priority-${task.priority} ${task.completed ? 'completed' : ''}" 
               data-id="${task.id}" 
               draggable="true"
               style="animation: fadeUp 0.3s ease-out forwards; animation-delay: ${index * 0.05}s; opacity: 0;">
            <div class="flex items-start gap-3">
              <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                   onclick="toggleTask('${task.id}')"
                   role="checkbox"
                   aria-checked="${task.completed}"
                   tabindex="0">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="task-title font-medium text-sm mb-1">${task.title}</h3>
                ${task.description ? `<p class="text-xs mb-2 line-clamp-2" style="color: var(--muted);">${task.description}</p>` : ''}
                <div class="flex flex-wrap items-center gap-2">
                  <span class="category-pill" style="background: ${category.color}22; color: ${category.color};">
                    ${category.name}
                  </span>
                  ${task.dueDate ? `
                    <span class="text-xs ${isOverdue ? 'text-red-400' : ''}" style="color: ${isOverdue ? 'var(--danger)' : 'var(--muted)'};">
                      <svg class="w-3 h-3 inline mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      ${formatDate(task.dueDate)}
                    </span>
                  ` : ''}
                </div>
              </div>
              <div class="flex gap-1">
                <button class="btn-ghost p-1" onclick="editTask('${task.id}')" aria-label="Edit task">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="btn-ghost p-1" onclick="deleteTask('${task.id}')" aria-label="Delete task">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Format date
    function formatDate(dateStr) {
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (dateStr === today.toISOString().split('T')[0]) return 'Today';
      if (dateStr === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Update stats
    function updateStats() {
      const total = tasks.length;
      const completed = tasks.filter(t => t.completed).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      elements.allCount.textContent = total;
      elements.totalCount.textContent = total;
      elements.completedCount.textContent = completed;
      elements.progressBar.style.width = `${percent}%`;
      elements.progressPercent.textContent = `${percent}%`;
    }

    // Setup event listeners
    function setupEventListeners() {
      // Add task button
      elements.addTaskBtn.addEventListener('click', () => openModal());

      // Close modal
      elements.closeModal.addEventListener('click', closeModal);
      elements.cancelBtn.addEventListener('click', closeModal);
      elements.taskModal.addEventListener('click', (e) => {
        if (e.target === elements.taskModal) closeModal();
      });

      // Form submit
      elements.taskForm.addEventListener('submit', handleSubmit);

      // Search
      elements.searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTasks();
      });

      // Priority filters
      document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          currentPriority = tab.dataset.priority;
          renderTasks();
        });
      });

      // Sidebar filters
      document.querySelectorAll('.sidebar-link[data-filter]').forEach(link => {
        link.addEventListener('click', () => {
          document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          currentFilter = link.dataset.filter;
          renderTasks();
        });
      });

      // Category filters
      elements.categoryList.addEventListener('click', (e) => {
        const link = e.target.closest('.sidebar-link[data-category]');
        if (link) {
          // Filter by category
          const category = link.dataset.category;
          searchQuery = '';
          elements.searchInput.value = '';
          currentPriority = 'all';
          document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
          document.querySelector('.filter-tab[data-priority="all"]').classList.add('active');
          
          tasks = tasks.map(t => ({ ...t }));
          const filteredTasks = tasks.filter(t => t.category === category);
          // For now, just highlight the category
          document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });

      // Keyboard support
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.taskModal.classList.contains('open')) {
          closeModal();
        }
      });

      // Checkbox keyboard support
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const checkbox = e.target.closest('.task-checkbox');
          if (checkbox) {
            e.preventDefault();
            checkbox.click();
          }
        }
      });
    }

    // Modal functions
    function openModal(task = null) {
      editingTaskId = task ? task.id : null;
      
      if (task) {
        elements.modalTitle.textContent = 'Edit Task';
        elements.submitBtnText.textContent = 'Update Task';
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskCategory').value = task.category;
        document.getElementById('taskDueDate').value = task.dueDate || '';
        document.getElementById('taskId').value = task.id;
      } else {
        elements.modalTitle.textContent = 'New Task';
        elements.submitBtnText.textContent = 'Create Task';
        elements.taskForm.reset();
        document.getElementById('taskId').value = '';
      }
      
      elements.taskModal.classList.add('open');
      document.getElementById('taskTitle').focus();
    }

    function closeModal() {
      elements.taskModal.classList.remove('open');
      elements.taskForm.reset();
      editingTaskId = null;
    }

    // Form submit
    function handleSubmit(e) {
      e.preventDefault();
      
      const title = document.getElementById('taskTitle').value.trim();
      const description = document.getElementById('taskDescription').value.trim();
      const priority = document.getElementById('taskPriority').value;
      const category = document.getElementById('taskCategory').value;
      const dueDate = document.getElementById('taskDueDate').value;
      const taskId = document.getElementById('taskId').value;

      if (!title) return;

      if (taskId) {
        // Update existing task
        tasks = tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, title, description, priority, category, dueDate };
          }
          return t;
        });
      } else {
        // Create new task
        const newTask = {
          id: Date.now().toString(),
          title,
          description,
          priority,
          category,
          status: 'todo',
          dueDate,
          completed: false,
          createdAt: Date.now()
        };
        tasks.unshift(newTask);
      }

      saveTasks();
      renderTasks();
      renderCategories();
      updateStats();
      closeModal();
    }

    // Task actions
    function toggleTask(id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.completed = !task.completed;
        if (task.completed) {
          task.status = 'done';
          createConfetti(event.target.closest('.task-card'));
        }
        saveTasks();
        renderTasks();
        updateStats();
      }
    }

    function editTask(id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        openModal(task);
      }
    }

    function deleteTask(id) {
      if (confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
        renderCategories();
        updateStats();
      }
    }

    // Drag and drop
    function setupDragAndDrop() {
      const taskCards = document.querySelectorAll('.task-card');
      const columns = document.querySelectorAll('.task-column');

      taskCards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
          draggedTask = card;
          card.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
          card.classList.remove('dragging');
          draggedTask = null;
          columns.forEach(col => col.classList.remove('drag-over'));
        });
      });

      columns.forEach(column => {
        column.addEventListener('dragover', (e) => {
          e.preventDefault();
          column.classList.add('drag-over');
        });

        column.addEventListener('dragleave', () => {
          column.classList.remove('drag-over');
        });

        column.addEventListener('drop', (e) => {
          e.preventDefault();
          column.classList.remove('drag-over');
          
          if (draggedTask) {
            const taskId = draggedTask.dataset.id;
            const newStatus = column.dataset.status;
            
            tasks = tasks.map(t => {
              if (t.id === taskId) {
                return { ...t, status: newStatus, completed: newStatus === 'done' };
              }
              return t;
            });
            
            saveTasks();
            renderTasks();
            updateStats();
          }
        });
      });
    }

    // Confetti effect
    function createConfetti(element) {
      if (!element) return;
      
      const colors = ['#00e5a0', '#7c3aed', '#f59e0b', '#ec4899', '#3b82f6'];
      const rect = element.getBoundingClientRect();
      
      for (let i = 0; i < 12; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
          position: fixed;
          left: ${rect.left + rect.width / 2}px;
          top: ${rect.top + rect.height / 2}px;
          background: ${colors[i % colors.length]};
          animation-delay: ${i * 0.05}s;
          transform: translate(${(Math.random() - 0.5) * 100}px, 0);
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 1000);
      }
    }

    // Save to localStorage
    function saveTasks() {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    }