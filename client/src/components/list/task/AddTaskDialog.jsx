import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';

import { useState } from 'react';
import AddTaskForm from './AddTaskForm';
import { useForm, FormProvider } from 'react-hook-form'
import { taskSchema } from "../../../api/zodSchema"
import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../../api/axios';
import { useContext } from 'react';
import { TaskContext } from '../../../api/provider';
import { useNavigate } from 'react-router';
import { useAuth } from '../../../AuthContext';

export default function AddTaskDialog({ user }) {
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const { user } = useAuth()

    const { addTask } = useContext(TaskContext)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        methods.reset()
    };

    const methods = useForm({
        mode: 'onChange',
        defaultValues: { title: '' },
        resolver: zodResolver(taskSchema)
    })

    const handleAdd = async (data) => {
        // user 참조 관계 설정하고(session에서 가져오기), app.js 마무리 & handleAdd에 들어갈 함수호출 정리(reset, handleClose? 등)
        try {
            const task = {
                title: data.title,
                completed: false
            }
            // console.log(task, '//////', user)
            const result = await api.post('/tasks', task)
            console.log(result.data)
            addTask(result.data)
            handleClose()
        } catch (err) {
            if (err.isAuthError) {
                navigate('/signin')
            } else {
                console.error(err)
                // 이 경우는 아마 서버에서 낸 에러가 아니라 네트워크 에러일 가능성이 높음
                // 왜냐하면 axios.js에서 err.response?.status로 확인하는데 response가 있는 경우에 
                // isAuthError를 설정해놨음 -> 즉, response가 없다는 말이됨 => 이는 네트워크 에러라는 것
            }
        }
    }
    // 컴포넌트
    //    ↓ api.post('/tasks')
    // axios 요청
    //    ↓
    // 서버 응답 (401)
    //    ↓
    // interceptor 실행
    //    ↓
    // navigate('/signin')
    //    ↓
    // Promise.reject(err)
    //    ↓
    // 컴포넌트 catch 실행

    return (
        <>
            {user ?
                <>
                    <Box sx={{ display: 'flex' }}>
                        <Button sx={{ ml: 'auto' }} variant="outlined" onClick={handleClickOpen}>
                            Add Task
                        </Button>
                    </Box>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        disableRestoreFocus
                    >
                        <FormProvider {...methods}>
                            <form onSubmit={methods.handleSubmit(handleAdd)}>
                                <DialogTitle id="alert-dialog-title">
                                    What tasks will you add?
                                </DialogTitle>
                                <DialogContent>
                                    <AddTaskForm />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} autoFocus>
                                        Cancel
                                    </Button>
                                    <Button type='submit'>Add</Button>
                                </DialogActions>
                            </form>
                        </FormProvider>
                    </Dialog>
                </>
                :
                null
            }

        </>
    );
}
