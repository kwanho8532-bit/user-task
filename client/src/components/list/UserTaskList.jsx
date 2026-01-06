import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';

import { useState, useContext } from 'react';
import { UserContext, TaskContext } from '../../api/provider';
import { useAuth } from '../../AuthContext'

export default function UserTaskList({ user, toggle, deleteTask }) {
    const { user: authUser } = useAuth()
    const { tasks } = useContext(TaskContext)
    console.log(user, '///////', tasks)
    console.log(authUser)

    const userTask = tasks.filter(task => task.user._id === user._id)

    console.log(userTask)



    return (
        <div>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {userTask.length === 0 ?
                    <Typography variant="subtitle2" gutterBottom>
                        일정이 없습니다! 추가해보세요!
                    </Typography>
                    :
                    userTask.map(task => {
                        const labelId = `checkbox-list-label-${task.title}`;

                        return (
                            authUser?._id === task.user._id ?
                                <ListItem
                                    key={task._id}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="comments" onClick={() => deleteTask(task._id)} >
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                    disablePadding
                                >
                                    <ListItemButton role={undefined} onClick={() => toggle(task._id)} dense>
                                        <ListItemIcon>
                                            <Checkbox
                                                edge="start"
                                                checked={task.completed}
                                                tabIndex={-1}
                                                disableRipple
                                                slotProps={{
                                                    input: { 'aria-labelledby': labelId }
                                                }}
                                            // onChange={() => toggle(task._id)}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={task.title} />
                                    </ListItemButton>
                                </ListItem>
                                :
                                <Alert severity="warning" key={task._id}>
                                    접근 권한이 없습니다!
                                </Alert>
                        );
                    })}

            </List>
        </div >
    )
}
