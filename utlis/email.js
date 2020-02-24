const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true,
    auth: {
        user: 'andrea_liqiquan@163.com', //邮箱的账号
        pass: 'andrea123'//授权密码
    }
})


function mailTo(eamil, code) {
    const mailOptions = {
        from: 'andrea_liqiquan@163.com', //邮件来源
        to: eamil, //邮件发送到哪里，多个邮箱使用逗号隔开
        subject: 'Easy-Task邮箱验证通知 ✔', // 邮件主题
        text: `您收到来自Easy-Task的邮箱验证码为: ${code}, 若非本人操作，请忽略邮件!`, // 存文本类型的邮件正文
    }

    // console.log(mailOptions)
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('?',error)
                reject()
            }else {
                console.log('Message %s sent: %s', info.messageId, info.response)
                resolve({
                    info,
                    success: true
                })
            }  
        })
    })
}

exports.mailTo =  mailTo