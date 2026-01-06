import { z } from 'zod'

const signUpSchema = z.object({
    name: z.string().min(1, '이름은 필수입니다.'),
    email: z.email('이메일 형식에 맞지 않습니다.'),
    password: z.string().min(8, '비밀번호는 8자리 이상이어야 합니다.')
})

const signInSchema = z.object({
    email: z.email('이메일 형식에 맞지 않습니다.'),
    password: z.string().min(8, '비밀번호는 8자리 이상이어야 합니다.')
})

const taskSchema = z.object({
    title: z.string().min(1, '일정을 추가해주세요!')
})

export { signUpSchema, signInSchema, taskSchema }