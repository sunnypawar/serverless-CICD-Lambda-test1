const sgmail = require('@sendgrid/mail')
// const sendgridAPIKey = ''


sgmail.setApiKey(process.env.SENDGRID_API_KEY)
// sgmail.setApiKey(secrets.SENDGRID_API_KEY)

// sgmail.send({
//     to: 'sunny.s.pawar@gmail.com',
//     from :'sunny.s.pawar@gmail.com',
//     'subject' : 'This is My First Creation',
//     'text' : 'message'
// })

const sendWelcomeEmail = (email, name) => {
    sgmail.send({
        to:email,
        from: 'sunny.s.pawar@gmail.com',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancelationEmail = (email, name) => {
    sgmail.send({
        to:email,
        from: 'sunny.s.pawar@gmail.com',
        subject: 'GoodBye Email',
        text: `GoodBye ${name}. Let us know what we could have done to stop you!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}