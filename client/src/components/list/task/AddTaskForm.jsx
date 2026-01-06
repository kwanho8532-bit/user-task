import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form'
import api from '../../../api/axios';

export default function AddTaskForm() {
    const { control } = useFormContext()


    return (
        <Controller
            control={control}
            name='title'
            render={({ field, fieldState }) => {
                return (
                    <TextField
                        autoFocus
                        {...field}
                        sx={{ mt: 1 }}
                        id="title"
                        label="Title"
                        variant="outlined"
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                )
            }}
        />
    )
}