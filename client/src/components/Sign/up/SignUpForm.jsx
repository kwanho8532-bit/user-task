import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Controller, useFormContext } from 'react-hook-form'
import api from '../../../api/axios';
import { useNavigate } from 'react-router';


export default function SignUpForm() {
    const navigate = useNavigate()
    // const { control, handleSubmit, reset, isValid, formState } = useContext(UserContext)
    const { control, handleSubmit, reset, formState: { isValid } } = useFormContext()

    const handleSignUp = async (data) => {
        console.log(data)
        // fetch처럼 headers를 지정하지 않아도 axios가 알아서 처리함
        // 즉 넘길 데이터(body)만 작성하면됨 
        const result = await api.post('/signup', data)
        console.log(result)
        reset()
        navigate('/list') // 내일 list컴포넌트를 gpt 문제대로 만들고 이후 필요한 것들 추가공부
    }

    return (
        <form onSubmit={handleSubmit(handleSignUp)}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center' // 기본값은 stretch (부모의 가로 폭을 꽉 채움)
            }}>
                <Controller
                    name='name'
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <TextField
                                {...field}
                                sx={{ mt: 3 }}
                                id="name"
                                label="Name"
                                variant="outlined"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )
                    }}
                />
                <Controller
                    name='email'
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <TextField
                                {...field}
                                sx={{ mt: 3 }}
                                id="email"
                                label="Email"
                                variant="outlined"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )
                    }}
                />
                <Controller
                    name='password'
                    control={control}
                    render={({ field, fieldState }) => {
                        return (
                            <TextField
                                {...field}
                                sx={{ mt: 3 }}
                                id="password"
                                label="Password"
                                type='password'
                                variant="outlined"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )
                    }}
                />

                <Button type='submit' disabled={!isValid} sx={{ mt: 3 }} variant="outlined">Submit</Button>
            </Box>
        </form >
    )
}