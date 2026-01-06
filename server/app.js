import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import MongoStore from 'connect-mongo'

import User from './models/user.js'
import Task from './models/task.js'
import user from './models/user.js'

import ExpressError from './utils/ExpressError.js'
import { isLoggedIn, isAuthority } from './utils/middleware.js'

// import.meta.url은 현재 app.js(모듈)의 실제 위치(url형태)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// mongoose.connect(process.env.MONGODB_URL)
mongoose.connect(process.env.MONGO_ATLAS_URI)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection Error: '))
db.once('open', () => {
    console.log('Database Connected!')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const sessionConfig = {
    name: 'session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_ATLAS_URI,
        collectionName: 'sessions', // 세션에 저장할 MongoDB컬렉션 이름을 기재 (보통은 그냥 sessions를 사용)
        ttl: 60 * 60 * 24 // 초 단위 / 보통은 maxAge와 값을 맞춤
        // maxAge는 브라우저 기준으로 쿠키가 언제 삭제될지를 지정
        // ttl은 DB기준으로 세션 문서가 언제 삭제될지를 지정

        // ⚠️ 둘이 다르면 어떻게 되냐?
        // 상황	                    결과
        // cookie 만료, ttl 남음	DB에 세션은 남아있지만 접근 불가
        // ttl 만료, cookie 남음	쿠키는 있지만 세션 없음 → 로그아웃
        // 둘 다 같음	            👍 가장 이상적
    }),
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}

app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())

// passport.use(new LocalStrategy(User.authenticate())) 
// 이건 그냥 passport-local의 기본 전략, 아무 옵션도 안줌

// 내부 동작

// new LocalStrategy(
//   {
//     usernameField: 'username', // ❗ 기본값
//     passwordField: 'password',
//   },
//   verifyFn
// )

// 👉 문제는 여기 ❌
// passport는 req.body.username을 찾음
// 하지만 네 앱은 email을 보냄
// 그래서 항상 실패 → 401

passport.use(User.createStrategy())
// passport-local-mongoose가 제공하는 전용 헬퍼
// 내부에서 LocalStrategy를 직접 생성
// 스키마 plugin 옵션을 자동 반영

// 내부적으로 하는 일 (개념적으로)

// new LocalStrategy(
//   {
//     usernameField: 'email',   // plugin 옵션 반영
//     passwordField: 'password',
//   },
//   User.authenticate()
// )

// 👉 즉,
// usernameField: 'email' ✔
// salt / hash / bcrypt 비교 ✔
// missing credentials 처리 ✔
// 전부 자동

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

function catchAsync(func) {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}

const baseURL = 'https://user-task-hdik.onrender.com' || '/api'

app.get(`${baseURL}/me`, (req, res) => {
    if (!req.isAuthenticated()) {
        return res.json({ user: null })
    }

    res.json({ user: req.user })
})

app.get('/api/users', catchAsync(async (req, res) => {
    const users = await User.find()
    res.status(200).json(users)
}))

app.get('/api/tasks', catchAsync(async (req, res, next) => {
    const tasks = await Task.find().populate('user')
    res.status(200).json(tasks)
}))

app.post('/api/signup', catchAsync(async (req, res, next) => {
    console.log(req.body)
    const { name, email, password } = req.body
    const user = new User({ name, email })
    const newUser = await User.register(user, password)
    req.login(newUser, (err) => {
        if (err) return next(err)
        return res.status(201).json({
            message: 'User created and Logged in',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        })
    })
}))

app.post('/api/signin', (req, res, next) => {
    console.log('in server', req.body)
    // passport(LocalStrategy)가 알아서 req.body를 읽고 username/password를 추출
    // 근데 나는 usernameField: 'email'로 지정해서 email/password를 추출

    // (err, user, info) ===> err = 시스템 에러 (DB, 서버문제) / user = 인증 성공 시 사용자 객체 / info = 실패 이유 메세지
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err) // 이는 LocalStrategy 실행 단계에서의 에러를 핸들링(인증 로직 중 시스템 에러)

        if (!user) {
            return res.status(401).json({ message: info.message })
        }

        req.login(user, (err) => {
            if (err) return next(err) // 이는 req.login()과정에서의 에러를 핸들링(세션 처리 중 시스템 에러)
            return res.status(200).json({ user })
        })
    })(req, res, next) // 이건 즉시실행함수임 -> 정석은 변수로 받아서 호출하는건데 이렇게 사용하면 미들웨어임을 바로 인식할 수 있음

    // passport.authenticate('local')은
    // req.body의 아이디/비밀번호를 Strategy에 전달
    // → DB에서 유저 조회 → 비밀번호 검증 
    // → 성공 시 user 객체를 req.login으로 넘겨주는 함수다.
})

app.get('/api/signout', (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.json({ message: '로그인이 되어있지 않습니다.' })
    } else {
        req.logout((err) => {
            if (err) return next(err)
            return res.status(200).json({ message: '로그아웃 되었습니다.' })
        })
    }
})

app.post('/api/tasks', isLoggedIn, catchAsync(async (req, res, next) => {
    const task = {
        ...req.body,
        user: req.user._id
    }
    console.log(task)
    const newTask = await new Task(task).save()
    console.log(newTask)
    await newTask.populate('user')
    res.status(201).json(newTask)
}))

app.patch('/api/tasks/:id', isAuthority, catchAsync(async (req, res, next) => {
    const { id } = req.params
    // console.log(req.params)
    const task = await Task.findByIdAndUpdate(id, [{
        $set: { completed: { $not: "$completed" } }
    }], { updatePipeline: true, new: true }).populate('user') // 이렇게 지정해줘야함(updatePipeline: true)
    // 위의 구문 => []는 업데이트 파이프라인문법(기존 필드 값을 참조해서 계산 가능)
    // $set은 새 값으로 설정(없으면 생성, 있으면 덮어씀)
    // $not은 부정 / '$completed'는 현재 문서의 completed값
    console.log(task)
    res.status(200).json(task)
}))

app.delete('/api/tasks/:id', isAuthority, catchAsync(async (req, res, next) => {
    const { id } = req.params
    const delTask = await Task.findByIdAndDelete(id)
    console.log(delTask)
    res.status(204).json(delTask)
}))

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).json(err)
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on the ${port} port`)
})

// SPA의 정석
// 1. 사용자가 주소창에 /posts/123 입력
// 2. 브라우저 → GET /posts/123 (서버)
// 3. Express:
//    - /api 아님
//    - 정적 파일 아님
//    - → index.html 반환
// 4. 브라우저:
//    - index.html 로드
//    - React 실행
// 5. React Router:
//    - URL = /posts/123 인식
//    - <PostDetail /> 렌더링
// 6. PostDetail 컴포넌트:
//    - 필요한 데이터가 있으면
//    - fetch('/api/posts/123') 실행

// 개발 중에는 vite를 통해 가짜 서버에서 build되어 index.html이 반환된다.
// 이후 배포환경에서는 express가 dist/index.html을 반환한다.