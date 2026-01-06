import Task from "../models/task.js"

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ // 여기서 req-res 사이클이 끝남. 즉, 이후 미들웨어 실행 안됨
            message: '로그인이 필요합니다.',
            redirectUrl: '/signin'
        })
    }
    next()
}

async function isAuthority(req, res, next) {
    const { id } = req.params
    const task = await Task.findById(id).populate('user')
    // delete & toggle
    if (req.user?._id !== task.user.id) {
        return res.status(403).json({ message: '접근 권한이 없습니다.' })
    }
    return next()
}

export { isLoggedIn, isAuthority }