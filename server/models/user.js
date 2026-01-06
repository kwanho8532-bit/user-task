import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
// passport-local-mongoose는 완전한 ESM 패키지가 아니라 commonJS기반이라서 
// import로 가져오면 require로 가져올 때와 다르게 약간씩 차이가 발생 
// 콘솔에 passportLocalMongoose 찍어보고 default에 function이면 .default붙여서 플러그인에 사용

// import * as passportLocalMongoose from 'passport-local-mongoose'

// | 구분   | 일반 import                                                 | namespace import                      
// | ------ | ----------------------------------------------------------- | ------------------------------------- 
// | 결과   | 모듈이 default일 수도, 객체일 수도 있음 (환경 따라 달라짐)    | 항상 객체, 실제 default는 `.default`에 있음     
// | 안정성 | 낮음 (환경마다 동작 달라질 수 있음)                          | 높음 (항상 `.default` 접근)                 
// | 코드   | `passportLocalMongoose.default` 필요할 수도 있음             | 항상 `passportLocalMongoose.default` 필요 

// console.log(passportLocalMongoose)
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

userSchema.plugin(passportLocalMongoose.default, {
    usernameField: 'email'
    // 이렇게 하면 register할 때 username을 email로 설정하여
    // email과 password를 전달하면 register됨
})

export default mongoose.model('User', userSchema)