import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useEffect } from 'react';
import api from '../../api/axios';
import UserAccordion from './UserAccordion';
import { TaskContext } from '../../api/provider';
import { useReducer } from 'react';
import Alert from '@mui/material/Alert';


function taskReducer(state, action) {
    switch (action.type) {
        case 'SET_TASK':
            return action.payload
        case 'ADD_TASK':
            return [...state, action.payload]
        case 'TOGGLE_TASK':
            return state.map(task => (
                task._id === action.payload._id ?
                    action.payload : task
            ))
        case 'DELETE_TASK':
            return state.filter(task => task._id !== action.payload)
        default:
            return state
    }
}

export default function ListApp() {
    const [users, setUsers] = useState([])
    // const [tasks, setTasks] = useState([])
    const [tasks, dispatch] = useReducer(taskReducer, [])

    const [error, setError] = useState(null)
    // error 상태와 Context 통합 고려
    // 지금은 ListApp에서만 error 상태를 관리하고 있음
    // 권한/인증 관련 에러를 Context에서 처리하면 여러 컴포넌트에서 일관된 에러 처리 가능

    useEffect(() => {
        async function getUsers() {
            const users = await api.get('/users')
            setUsers(users.data)
        }
        async function getTasks() {
            const tasks = await api.get('/tasks')
            // setTasks(tasks.data)
            dispatch({ type: 'SET_TASK', payload: tasks.data })
        }
        getUsers()
        getTasks()
    }, [])

    useEffect(() => {
        if (!error) return;

        const timer = setTimeout(() => {
            setError(null)
        }, 2000)

        return () => clearTimeout(timer)
    }, [error])

    console.log(users, '///', tasks)

    const addTask = (task) => {
        // setTasks(prevTasks => {
        //     return [...prevTasks, task]
        // })
        dispatch({ type: 'ADD_TASK', payload: task })
    }

    // toggle 권한 제어
    const toggle = async (id) => {
        try {
            const result = await api.patch(`/tasks/${id}`)
            console.log(result.data)
            const updatedTask = result.data

            // setTasks(prevTasks => {
            //     return prevTasks.map(task => {
            //         return task._id === updatedTask._id ? updatedTask : task
            //     })
            // })
            dispatch({ type: 'TOGGLE_TASK', payload: updatedTask })
        } catch (err) {
            if (err.isAuthorityError) {
                setError('접근권한이 없습니다.')
            }
            console.error(err)
        }
    }

    const deleteTask = async (id) => {
        try {
            const result = await api.delete(`/tasks/${id}`)

            // setTasks(prevTasks => {
            //     return prevTasks.filter(task => task._id !== id)
            // })
            dispatch({ type: 'DELETE_TASK', payload: id })
        } catch (err) {
            if (err.status === 403) {
                setError('접근 권한이 없습니다.')
            }
            console.error(err)
        }
    }

    return (
        <div>
            {error &&
                <Alert severity="error">
                    {error}
                </Alert>

            }
            <Paper
                variant="outlined"
                sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    mt: 4,
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 2
                }}
            >
                <Typography sx={{ textAlign: 'center' }} variant='h2' gutterBottom>
                    UserList
                </Typography>
                <TaskContext.Provider value={{ tasks, addTask }}>
                    {users?.map(user => <UserAccordion key={user._id} user={user} toggle={toggle} deleteTask={deleteTask} />)}
                </TaskContext.Provider>
            </Paper>
            {/* Context는 읽기 전용을 사용하는 것이 바람직 & 위 처럼 선택된 user는 props로 전달하는 것이 바람직 */}

        </div>
    );
}
