import SignUpForm from '../up/SignUpForm'
import {
    Box,
    Container,
    Typography,
    Paper
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form'
import { signUpSchema, signInSchema } from '../../../api/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import SignInForm from '../in/SignInForm';


const renderForm = {
    signin: SignInForm,
    signup: SignUpForm
}

// const sendResolver = {
//     signin: signInSchema,
//     signup: signUpSchema
// }

const sendMethods = {
    signin: {
        defaultValues: { email: '', password: '' },
        resolver: zodResolver(signInSchema)
    },
    signup: {
        defaultValues: { name: '', email: '', password: '' },
        resolver: zodResolver(signUpSchema)
    }
}

// const renderForm = {
//     signin: <SignInForm />,
//     signup: <SignUpForm />
// }

// 여기서 <SignInForm/> 과 <SignUpForm/> 은 JSX를 즉시 렌더링한 값입니다.
// 즉 renderForm 객체가 생성될 때 이미 JSX가 만들어져 있어, props나 FormProvider 같은 context가 변경돼도 반영되지 않습니다.
// React에서는 컴포넌트를 변수로 할당할 때는 대문자 컴포넌트를 그대로 할당하고, JSX로 감싸는 건 렌더링 시점에서 해야 합니다.

export default function SignFormContainer({ label, type }) {
    // const {
    //   control,
    //   handleSubmit,
    //   reset,
    //   formState,
    //   formState: { isValid }
    // } = useForm({
    //   mode: 'onChange',
    //   defaultValues: { name: '', email: '' },
    //   resolver: zodResolver(userSchema)
    // })

    // const contextValue = useMemo(() => ({
    //   control, handleSubmit, reset, isValid, formState
    // }), [isValid, formState])

    // 위는 내가 직접 Context를 만들어서 memo로 감싸서 전달한것 
    // 아래는 RHF의 FormProvider (= React Hook Form이 제공하는 공식 Context Provider)를 사용하는것

    const methods = useForm({
        mode: 'onChange',
        ...sendMethods[type]
    })

    // console.log(methods)

    const FormComponent = renderForm[type] || <SignInForm />

    return (
        <Container maxWidth="lg" disableGutters>
            <Box sx={{ bgcolor: 'white', height: '100vh', }} >
                <Paper
                    variant="outlined"
                    sx={{
                        maxWidth: 450,
                        mx: 'auto',
                        mt: 4,
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 2
                    }}
                >
                    <Typography variant="h3" gutterBottom sx={{ mt: 3, textAlign: 'center' }}>
                        {label}
                    </Typography>
                    {/* <UserContext.Provider value={contextValue} >
                        <UserForm />
                    </UserContext.Provider> */}
                    <FormProvider {...methods} >
                        <FormComponent />
                    </FormProvider>
                </Paper>
            </Box>
        </Container>
    )
}