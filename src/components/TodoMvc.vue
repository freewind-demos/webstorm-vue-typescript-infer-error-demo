<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input autofocus="autofocus" autocomplete="off" placeholder="What needs to be done?"
          class="new-todo" @keyup.enter="createTodo" v-model="newTodo">
    </header>
    <section class="main" style="">
      <input id="toggle-all" type="checkbox" class="toggle-all" @click="toggleAll">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list" v-for="(todo, index) in filteredTodos">
        <li class="todo"
            v-bind:class="{completed:todo.completed, editing: todo === editingTodo}"
            @dblclick="editTodo(todo)">
          <div class="view">
            <input type="checkbox" class="toggle" v-bind:checked="todo.completed"
                @change="toggleTodo(index)">
            <label>{{todo.content}}</label>
            <button class="destroy" @click="removeTodo(index)"></button>
          </div>
          <input type="text" class="edit" v-model="editingContent"
              @keyup.enter="doneEdit(index)" @blur="doneEdit(index)"
              @keyup.esc="cancelEdit()">
        </li>
      </ul>
    </section>
    <footer class="footer" style=""><span class="todo-count"><strong>{{itemsLeft}}</strong> items left
				</span>
      <ul class="filters">
        <li v-for="filter in filters">
          <a v-bind:href="filter.href" v-bind:class="{selected: filter === currentFilter}">{{filter.title}}</a>
        </li>
      </ul>
      <button class="clear-completed" @click="clearCompleted">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {storeGetter, storeMutation, TodoItem} from '../store';

  type FilterType = {
    path: string,
    href: string,
    title: string,
    default: boolean,
    filter: (todos: TodoItem[]) => TodoItem[]
  }

  @Component({})
  export default class TodoMvc extends Vue {

    get todos(): TodoItem[] {
      return storeGetter(this.$store, 'todos')
    }

    newTodo: string = '';
    editingTodo: TodoItem | null = null;
    editingContent: string | null = null;

    filters: FilterType[] = [
      {
        path: '/all',
        href: '#/all',
        title: 'All',
        default: true,
        filter: todos => todos
      }, {
        path: '/active',
        href: '#/active',
        title: 'Active',
        default: false,
        filter: todos => todos.filter(it => !it.completed)
      }, {
        path: '/completed',
        href: '#/completed',
        title: 'Completed',
        default: false,
        filter: todos => todos.filter(it => it.completed)
      }
    ];

    @Prop() currentPath!: string;

    get currentFilter(): FilterType {
      return this.filters.find(it => it.path === this.currentPath) || this.defaultFilter;
    }

    get defaultFilter(): FilterType {
      return this.filters.find(it => it.default)!
    }

    get filteredTodos(): TodoItem[] {
      return this.currentFilter.filter(this.todos)
    }

    get itemsLeft(): number {
      return this.todos.filter(it => !it.completed).length
    }

    createTodo() {
      storeMutation(this.$store, 'addTodo', {
        content: this.newTodo,
        completed: false
      });
      this.newTodo = '';
    }

    removeTodo(index: number) {
      storeMutation(this.$store, 'removeTodo', index)
    }

    toggleAll() {
      storeMutation(this.$store, 'toggleAll', undefined);
    }

    clearCompleted() {
      storeMutation(this.$store, 'clearCompleted', undefined);
    }

    editTodo(todo: TodoItem) {
      this.editingTodo = todo;
      this.editingContent = todo.content;
    }

    doneEdit(index: number) {
      if (this.editingTodo === null) {
        return;
      }
      const newTodo: TodoItem = {...this.editingTodo};
      if (this.editingContent !== null) {
        newTodo.content = this.editingContent.trim()
      }
      this.editingTodo = null;
      this.editingContent = null;
      if (newTodo.content) {
        storeMutation(this.$store, 'updateTodo', {index, newTodo: newTodo});
      } else {
        storeMutation(this.$store, 'removeTodo', index);
      }
    }

    cancelEdit() {
      this.editingTodo = null;
      this.editingContent = null;
    }

    toggleTodo(index: number) {
      storeMutation(this.$store, 'toggleTodo', index)
    }
  }
</script>

<style scoped>
</style>
