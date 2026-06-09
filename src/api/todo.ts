import request from '@/utils/request'

import type { ApiResponse } from '@/types/apiResponseType'

export type Todo = {
  m_id: number;
  todo_content: string;
}
type TodoData = {
  todoList: Todo[]
}
// 获取待办事项
export const getTodo = (data: {
  warehouse_m_id: number;
}) => {
  return request.get('/todo', {
    params: data
  }) as Promise<ApiResponse<TodoData>>
}

// 添加待办事项
export const addTodo = (data: {
  warehouse_m_id: number;
  todo_content: string;
}) => {
  return request.post('/todo/add', {todo_content: data.todo_content}, {
    params: {
      warehouse_m_id: data.warehouse_m_id
    }
  }) as Promise<ApiResponse<null>>
}

// 删除待办事项
export const deleteTodo = (data: {
  warehouse_m_id: number;
  m_id: number;
}) => {
  return request.patch('/todo/delete', null, {
    params: data
  }) as Promise<ApiResponse<null>>
}
