import {storeGetter, storeMutation, TodoItem} from '../store';
import {Vue} from 'vue-property-decorator';

export default class Working extends Vue {

  get todos(): TodoItem[] {
    return storeGetter(this.$store, 'todos')
  }

  removeTodo(index: number) {
    storeMutation(this.$store, 'removeTodo', index)
  }

}
