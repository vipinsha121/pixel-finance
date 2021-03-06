module.exports = {
    FORGOT_PASSWORD_LINK:{
        ADMIN:'http://abc.com?passwordResetToken',
        SUPER_ADMIN:'http://abc.com?passwordResetToken',
        CUSTOMER:'http://abc.com?passwordResetToken',
        DRIVER:'http://abc.com?passwordResetToken'
    },
    ROLE:{
        MANAGER:1,
        ANALYST:2
    },
    DEVICE_TYPE:{
        DEFAULT:0,
        ANDROID:1,
        IOS:2,
        WEB:3
    },
    LANGUAGE_TYPE:{
        DEFAULT:'en',
        ENGLISH:'en',
        ARABIC:'ar'
    },
    SMS_MESSAGE_TYPE:{
        DEFAULT:0,
        FORGOT_PASSWORD:1
    },
    EMAIL_MESSAGE_TYPE:{
        DEFAULT:0,
        FORGOT_PASSWORD:1
    },
    PUSH_MESSAGE_TYPE:{
        DEFAULT:0,
        FORGOT_PASSWORD:1
    },
    THIRD_PARTY_SERVICE_TYPE:{
        DEFAULT:0,
        SMS:1,
        EMAIL:2,
        PUSH:3
    },
    THIRD_PARTY_SERVICE_CODE:{
        DEFAULT:0,
        TWILLO:1,
        MANDRILL:2,
        SEND_GRID:3,
        FCM_USER:4,
        FCM_DRIVER:5
    },
    EVENT_TYPE:{
        DEFAULT:'DEFAULT'
    },
    SOCKET_TYPE:{
        BROAD_CAST:'BROAD_CAST',
        USER:'USER',
        ADMIN:'ADMIN'
    },
    PAYMENT_MODE:{
        CASH:'CASH',
        CARD:'CARD',
        WALLET:'WALLET'
    },
    PAYMENT_STATUS:{
        PENDING:'PENDING',
        COMPLETED:'COMPLETED'
    },
    BOOKING_STATUS:{
        PENDING:'PENDING',
        ACCEPTED:'ACCEPTED',
        COMPLETED:'COMPLETED',
        ARRIVED:'ARRIVED',
        STARTED:'STARTED',
        ONGOING:'ONGOING',
        CANCELED:'CANCELED'
    },
    FILE_PATH:{
        ADMIN:'/static/admin',
        SUPER_ADMIN:'/static/super_admin',
        USER:'/static/user'
    },
    SMS_EVENT_TYPE:{
        SEND_OTP:'SEND_OTP'
    },
    DEFAULT_LIMIT:10,
    DEFAULT_SKIP:0
    
};
