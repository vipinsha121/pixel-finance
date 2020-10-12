const joi = require('joi');
const universalFunction=require('../../lib/universal-function');
const appConstant = require("../../constant");
const constant = appConstant.constant;
const validateLogin=async (req)=> {
    let schema = joi.object().keys({
        email: joi.string().required(),
        password: joi.string().required()
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateRegister=async (req)=> {
    let schema = joi.object().keys({
        firstName:joi.string().regex(/^[a-zA-Z ]+$/).trim().optional(),
        lastName:joi.string().regex(/^[a-zA-Z ]+$/).trim().optional(),
        phoneNo:joi.string().regex(/^[0-9]+$/).min(5).optional(),
        countryCode:joi.string().regex(/^[0-9,+]+$/).trim().min(2).optional(),
        city: joi.string().optional().description('admin address city'),
        address: joi.string().optional().description('admin address city'),
        state: joi.string().optional().description('admin address state'),
        zipCode: joi.string().optional().description('zipcode of user address'),    
        email: joi.string().required(),
        password: joi.string().required()
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateUpdateSuperAdminProfile=async (req)=> {
    let schema = joi.object().keys({
        firstName:joi.string().regex(/^[a-zA-Z ]+$/).trim().optional(),
        lastName:joi.string().regex(/^[a-zA-Z ]+$/).trim().optional(),
        phoneNo:joi.string().regex(/^[0-9]+$/).min(5).optional(),
        countryCode:joi.string().regex(/^[0-9,+]+$/).trim().min(2).optional(),
        city: joi.string().optional().description('admin address city'),
        address: joi.string().optional().description('admin address city'),
        state: joi.string().optional().description('admin address state'),
        zipCode: joi.string().optional().description('zipcode of user address'),    
        email: joi.string().optional(),
        password: joi.string().optional()
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateChangePassword=async (req)=> {
    let schema = joi.object().keys({
        password: joi.string().required(),
        newPassword: joi.string().required()
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateForgotPassword=async (req)=> {
    let schema = joi.object().keys({
        email: joi.string().required()
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateForgotChangePassword=async (req)=> {
    let schema = joi.object().keys({
        passwordResetToken: joi.string().required(),
        password: joi.string().required()
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateNotificationId=async (req)=> {
    let schema = joi.object().keys({
        notificationId: joi.string().length(24).required()
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateNotificationIdWithPageNo=async (req)=> {
    let schema = joi.object().keys({
        notificationId: joi.string().length(24).optional(),
        pageNo:joi.number().min(1).optional(),
        isRead:joi.boolean().optional()
    });
    return await universalFunction.validateSchema(req.query,schema);
};
const validateVerifyOtpCode=async (req)=> {
    let schema = joi.object().keys({
        otpCode: joi.string().required(),
        phoneNo:joi.string().regex(/^[0-9]+$/).min(5).required(),
        countryCode:joi.string().regex(/^[0-9,+]+$/).trim().min(2).required()
    });
    return await universalFunction.validateSchema(req.body,schema);
};

const validateAddAdmin=async (req)=> {
    let schema = joi.object().keys({
        firstName:joi.string().regex(/^[a-zA-Z ]+$/).trim().optional(),
        lastName:joi.string().regex(/^[a-zA-Z ]+$/).trim().optional(),
        description:joi.string().optional(),
        phoneNo:joi.string().regex(/^[0-9]+$/).min(5).optional(),
        countryCode:joi.string().regex(/^[0-9,+]+$/).trim().min(2).optional(),
        city: joi.string().optional().description('admin address city'),
        address: joi.string().optional().description('admin address city'),
        state: joi.string().optional().description('admin address state'),
        zipCode: joi.string().optional().description('zipcode of user address'),
        email: joi.string().required(),
        password: joi.string().required()
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateUpdateAdminProfile=async (req)=> {
    let schema = joi.object().keys({
        adminId:joi.string().length(24).required().description('Admin id'),
        firstName:joi.string().regex(/^[a-zA-Z ]+$/).trim().optional(),
        lastName:joi.string().regex(/^[a-zA-Z ]+$/).trim().optional(),
        phoneNo:joi.string().regex(/^[0-9]+$/).min(5).optional(),
        description:joi.string().optional(),
        countryCode:joi.string().regex(/^[0-9,+]+$/).trim().min(2).optional(),
        city: joi.string().optional().description('admin address city'),
        address: joi.string().optional().description('admin address city'),
        state: joi.string().optional().description('admin address state'),
        zipCode: joi.string().optional().description('zipcode of user address'),
        gender:joi.string().optional().valid(['MALE','FEMALE','NO_PREFRENCE']),
        email: joi.string().optional(),
        password: joi.string().optional()
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateDeleteBlockUbBlockDeactivateAdmin=async (req)=> {
    let schema = joi.object().keys({
        adminId:joi.string().length(24).required().description('Admin id'),
        isBlocked: joi.boolean().optional(),
        isDeleted: joi.boolean().optional(),
        isActive: joi.boolean().optional(),
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validategetAdminProfile=async (req)=> {
    let schema = joi.object().keys({
        adminId:joi.string().length(24).required().description('Admin id')
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validategetAllAdminProfile=async (req)=> {
    let schema = joi.object().keys({
        pageNo: joi.number().min(1).optional(),
        search:joi.string().optional()
    });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateAddAppSetting=async (req)=> {
    let schema =  
        joi.object().keys({
            superAdminId:joi.string().length(24).trim().required(),
            isSmsEnabled:joi.boolean().optional(),
            isEmailEnabled:joi.boolean().optional(),
            isEmailEnabled:joi.boolean().optional(),
            isSuperForgotPasswordEnabled:joi.boolean().optional(),
            isAdminForgotPasswordEnabled:joi.boolean().optional(),
            isUserForgotPasswordEnabled:joi.boolean().optional(),
            isDriverForgotPasswordEnabled:joi.boolean().optional(),
            superAdminForGotPasswordUrl:joi.string().optional(),
            adminForGotPasswordUrl:joi.string().optional(),
            userForGotPasswordUrl:joi.string().optional(),
            driverForGotPasswordUrl:joi.string().optional(),
            isUserAutoVerifyEnabled:joi.boolean().optional(),
            isDriverAutoVerifyEnabled:joi.boolean().optional(),
            smsServiceCode:joi.number().optional(),
            emailSerivceCode:joi.number().optional(),
         });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateAddCredentialsSetting=async (req)=> {
    let schema =  
        joi.object().keys({
            superAdminId:joi.string().length(24).trim().required(),
            serviceType:joi.number().valid([constant.THIRD_PARTY_SERVICE_TYPE.EMAIL,
                constant.THIRD_PARTY_SERVICE_TYPE.SMS,
                constant.THIRD_PARTY_SERVICE_TYPE.PUSH]).required(),
            serviceCode:joi.number().valid([
                constant.THIRD_PARTY_SERVICE_CODE.TWILLO,
                constant.THIRD_PARTY_SERVICE_CODE.MANDRILL,
                constant.THIRD_PARTY_SERVICE_CODE.SEND_GRID,
                constant.THIRD_PARTY_SERVICE_CODE.FCM_USER,
                constant.THIRD_PARTY_SERVICE_CODE.FCM_DRIVER
            ]).required(),
            credentials:joi.object().required()
         });
    return await universalFunction.validateSchema(req.body,schema);
};
const validateActiveCredentials=async (req)=> {
    let schema = 
        joi.object().keys({
            superAdminId:joi.string().length(24).trim().required(),
            credentialId : joi.string().length(24).required(),
            isActive:joi.boolean().required(),
           
         });
    return await universalFunction.validateSchema(req.body,schema);
};

const validateAdminAddAppSetting=async (req)=> {
    let schema =  
         joi.object().keys({
            adminId:joi.string().length(24).trim().required(),
            isSmsEnabled:joi.boolean().optional(),
            isEmailEnabled:joi.boolean().optional(),
            isEmailEnabled:joi.boolean().optional(),
            isSuperForgotPasswordEnabled:joi.boolean().optional(),
            isAdminForgotPasswordEnabled:joi.boolean().optional(),
            isUserForgotPasswordEnabled:joi.boolean().optional(),
            isDriverForgotPasswordEnabled:joi.boolean().optional(),
            superAdminForGotPasswordUrl:joi.string().optional(),
            adminForGotPasswordUrl:joi.string().optional(),
            userForGotPasswordUrl:joi.string().optional(),
            driverForGotPasswordUrl:joi.string().optional(),
            isUserAutoVerifyEnabled:joi.boolean().optional(),
            isDriverAutoVerifyEnabled:joi.boolean().optional(),
            smsServiceCode:joi.number().optional(),
            emailSerivceCode:joi.number().optional(),
         })

    return await universalFunction.validateSchema(req.body,schema);
};
const validateAdminAddCredentialsSetting=async (req)=> {
    let schema =
         joi.object().keys({
            adminId:joi.string().length(24).trim().required(),
            serviceType:joi.number().valid([constant.THIRD_PARTY_SERVICE_TYPE.EMAIL,
                constant.THIRD_PARTY_SERVICE_TYPE.SMS,
                constant.THIRD_PARTY_SERVICE_TYPE.PUSH]).required(),
            serviceCode:joi.number().valid([
                constant.THIRD_PARTY_SERVICE_CODE.TWILLO,
                constant.THIRD_PARTY_SERVICE_CODE.MANDRILL,
                constant.THIRD_PARTY_SERVICE_CODE.SEND_GRID,
                constant.THIRD_PARTY_SERVICE_CODE.FCM_USER,
                constant.THIRD_PARTY_SERVICE_CODE.FCM_DRIVER
            ]).required(),
            credentials:joi.object().required()
         })
    return await universalFunction.validateSchema(req.body,schema);
};
const validateAdminActiveCredentials=async (req)=> {
    let schema =
         joi.object().keys({
            adminId:joi.string().length(24).trim().required(),
            credentialId : joi.string().length(24).required(),
            isActive:joi.boolean().required(),
         })
    return await universalFunction.validateSchema(req.body,schema);
};
module.exports = {
    validateLogin:validateLogin,
    validateRegister:validateRegister,
    validateUpdateSuperAdminProfile:validateUpdateSuperAdminProfile,
    validateChangePassword:validateChangePassword,
    validateForgotPassword:validateForgotPassword,
    validateForgotChangePassword:validateForgotChangePassword,
    validateVerifyOtpCode:validateVerifyOtpCode,
    validateNotificationId:validateNotificationId,
    validateNotificationIdWithPageNo:validateNotificationIdWithPageNo,
    validateAddAdmin:validateAddAdmin,
    validateUpdateAdminProfile:validateUpdateAdminProfile,
    validateDeleteBlockUbBlockDeactivateAdmin:validateDeleteBlockUbBlockDeactivateAdmin,
    validategetAdminProfile:validategetAdminProfile,
    validategetAllAdminProfile:validategetAllAdminProfile,
    validateAddAppSetting:validateAddAppSetting,
    validateAddCredentialsSetting:validateAddCredentialsSetting,
    validateActiveCredentials:validateActiveCredentials,
    validateAdminAddAppSetting:validateAdminAddAppSetting,
    validateAdminAddCredentialsSetting:validateAdminAddCredentialsSetting,
    validateAdminActiveCredentials:validateAdminActiveCredentials
};
