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
            v-bind:class="{completed:todo.completed, editing: todo.editing}"
            @dblclick="editTodo(index)">
          <div class="view">
            <input type="checkbox" class="toggle" v-model="todo.completed">
            <label>{{todo.content}}</label>
            <button class="destroy" @click="removeTodo(index)"></button>
          </div>
          <input type="text" class="edit" v-model="todo.contentForEditing"
              @keyup.enter="doneEdit(index)" @blur="doneEdit(index)"
              @keyup.esc="cancelEdit(index)">
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
  import {replace} from '../utils/array-utils';

  type TodoItem = {
    content: string,
    completed: boolean,
    editing?: boolean,
    contentForEditing?: string
  }

  type FilterType = {
    path: string,
    href: string,
    title: string,
    default: boolean,
    filter: (todos: TodoItem[]) => TodoItem[]
  }

  @Component({})
  export default class TodoMvc extends Vue {

    todos: TodoItem[] = [
      {content: "sdfsf", completed: true},
      {content: "wefsdf", completed: false},
      {content: "2fsdf89", completed: false}
    ];

    newTodo: string = '';

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
      return this.todos.filter(it => it.completed === false).length;
    }

    createTodo() {
      this.todos.push({
        content: this.newTodo,
        completed: false
      });
      this.newTodo = '';
    }

    removeTodo(index: number) {
      this.todos.splice(index, 1);
    }

    toggleAll() {
      if (this.todos.every(it => it.completed)) {
        this.todos.forEach(it => it.completed = false)
      } else {
        this.todos.forEach(it => it.completed = true)
      }
    }

    clearCompleted() {
      this.todos = this.todos.filter(it => !it.completed)
    }

    editTodo(index: number) {
      this.todos.forEach(it => delete it.editing);
      replace(this.todos, index, todo => {
        todo.editing = true;
        todo.contentForEditing = todo.content;
        return todo
      })
    }

    doneEdit(index: number) {
      replace(this.todos, index, todo => {
        delete todo.editing;
        if (todo.contentForEditing !== undefined) {
          todo.content = todo.contentForEditing.trim();
        }
        delete todo.contentForEditing;
        return todo.content ? todo : null
      });
    }

    cancelEdit(index: number) {
      replace(this.todos, index, todo => {
        delete todo.editing;
        delete todo.contentForEditing;
        return todo;
      })
    }

  }
</script>

<style scoped>
</style>
