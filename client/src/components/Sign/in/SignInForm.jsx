import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { Controller, useFormContext } from 'react-hook-form'
import api from '../../../api/axios';
import { useNavigate } from 'react-router'
import { useAuth } from '../../../AuthContext';

export default function SignInForm() {
    const { setUser } = useAuth()
    const navigate = useNavigate()
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isValid }
    } = useFormContext()

    const handleSignIn = async (data) => {
        // console.log(data)
        try {
            const result = await api.post('/signin', data)
            console.log(result)
            setUser(result.data.user)
            reset()
            navigate('/list')
        } catch (err) {
            if (err.response?.status === 401) {
                setError('root', { // 특정 input이 아닌 전체 form에러 (로그인 실패 등)
                    type: 'server',
                    message: err.response?.data?.message ?? '이메일 또는 비밀번호가 올바르지 않습니다.',
                    koreaMessage: '이메일 또는 비밀번호가 올바르지 않습니다.'
                    // err.response.data.message가 null/undefined 라면 뒤에 문자열을 반환
                    // data는 app.js에서 설정한 {message: info.message}임
                })
                reset({}, { keepErrors: true })
                // 첫번째 인자로 빈 객체를 주면 defaultValue를 지정한 경우에는 해당 값으로, 그렇지 않다면 undefined로 값을 초기화함
                document.activeElement.blur() // 포커스 제거 -> 이거 없으면 마지막 인풋에 포커스가 되어있음(주로 password) 
            }
            console.error(err)
        }
    }

    // 그러니까 흐름을 보면 signinform컴포넌트에서 사용자의 입력값을 받아서
    // handleSubmit(handleSignin)을 통해 서버에 값을 보내는데 서버에서 
    // passport.authenticate("local", callback)을 통해 값을 처리하는 중 
    // DB에 입력받은 email이나 password가 일치하는 것이 없으면 401에러를 발생시키고 
    // 이는 axios.interceptors에 의해 
    //  err => {
    //         const status = err.response?.status
    //         if (status === 401) {
    //             err.isAuthError = true // 프로퍼티 생성
    //             err.redirectUrl = '/signin'
    //         }
    //         // if (status === 403) {
    //         //     // 권한 없음 관련 로직
    //         // }
    //         return Promise.reject(err) // 이게 없으면 에러가 났는데 성공한 것처럼 처리됨
    //         // axios가 Promise 기반으로 동작하기 때문에 throw보단 Promise.reject()를 사용하는 것이 의미상 맞음
    //     }
    // 이렇게 되고 이후 다시 컴포넌트로 돌아오는데 catch에 걸리게 되면서 
    // setError()를 호출하게 되고 이 setError로인해 컴포넌트가 재렌더링 됨
    // 이때 setError()는 RHF 내부 state를 변경하게 되는데 중요한것은 해당 컴포넌트(signinform)에서 errors를 사용하는 부분만 재렌더링된다.
    // 그래서 이 JSX가 다시 평가됨
    // {errors.root && (
    //   <Alert severity="error">
    //     {errors.root.message}
    //   </Alert>
    // )}

    // 이전: errors.root === undefined → 렌더 안 됨
    // 이후: errors.root 존재 → Alert 나타남

    return (
        <form onSubmit={handleSubmit(handleSignIn)} >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Controller
                    control={control}
                    name='email'
                    render={({ field, fieldState }) => {
                        return (
                            <TextField
                                {...field}
                                sx={{ mt: 3 }}
                                id="email"
                                label="email"
                                variant="outlined"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )
                    }}
                />
                <Controller
                    control={control}
                    name='password'
                    render={({ field, fieldState }) => {
                        return (
                            <TextField
                                {...field}
                                sx={{ mt: 3 }}
                                id="password"
                                label="password"
                                type='password'
                                variant="outlined"
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )
                    }}
                />
                {errors.root &&
                    <Alert severity="error" sx={{ mt: 3 }}>
                        {errors.root.koreaMessage}
                    </Alert>
                }
                <Button type='submit' disabled={!isValid} sx={{ mt: 3 }} variant="outlined">Sign In</Button>
            </Box>
        </form>
    )
}