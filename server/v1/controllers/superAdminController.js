const mongoose = require('mongoose');
const _ = require('lodash');
const randomstring = require('randomstring');
const moment = require('moment');
const bcrypt = require('bcrypt');

const Model = require('../../models/index');
const Service = require('../../services/index');
const Validation = require('../Validations/index');
const universalFunction = require('../../lib/universal-function');
const appConstant = require("../../constant");
const statusCodeList = require("../../statusCodes");
const messageList = require("../../messages");

const constant = appConstant.constant;
const statusCode = statusCodeList.statusCodes.STATUS_CODE;
const messages = messageList.messages.MESSAGES;

exports.register = register;
exports.login = login;
exports.logout = logout;
exports.getProfile = getProfile;
exports.updateSuperAdminProfile = updateSuperAdminProfile;
exports.changePassword = changePassword;
exports.forgotPassword = forgotPassword;
exports.uploadFile = uploadFile;
exports.forgotChangePassword = forgotChangePassword;
exports.getAllNotification = getAllNotification;
exports.clearNotification = clearNotification;
exports.clearAllNotification = clearAllNotification;
exports.addAdmin = addAdmin;
exports.updateAdminProfile = updateAdminProfile;
exports.deleteBlockUnBlockDeactivateAdminProfile = deleteBlockUnBlockDeactivateAdminProfile;
exports.getAdminProfile = getAdminProfile;
exports.getAllAdminProfile = getAllAdminProfile;
exports.addCredentials = addCredentials;
exports.addAppSetting = addAppSetting;
exports.activeCredentials = activeCredentials;
exports.addAdminCredentials = addAdminCredentials;
exports.addAdminAppSetting = addAdminAppSetting;
exports.activeAdminCredentials = activeAdminCredentials;
exports.addBorrower = addBorrower
exports.updateBorrowerProfile = updateBorrowerProfile
exports.adminAllBorrower = adminAllBorrower
exports.superAminAllBorrower = superAminAllBorrower
exports.loginAdmin = loginAdmin
exports.loan = loan
exports.updateLoan = updateLoan
exports.getApprovedLoad = getApprovedLoad
exports.getPendingLoan =  getPendingLoan
exports.getBorrowerLoan = getBorrowerLoan
exports.deleteAdmin = deleteAdmin
exports.deleteLoan = deleteLoan
exports.getDetails = getDetails
exports.superAminAPendingBorrower = superAminAPendingBorrower
exports.superAminApprovedBorrower = superAminApprovedBorrower
exports.addExpenses = addExpenses
exports.updateExpenses = updateExpenses
exports.getExpenses = getExpenses
exports.getAllExpenses = getAllExpenses
exports.AdminPendingBorrower = AdminPendingBorrower
exports.adminApprovedBorrower =adminApprovedBorrower

    /*
    ADMIN API'S
    */


async function register(req, res) {
    try {
        // const valid = await Validation.isSuperAdminValidate.validateRegister(req);
        // console.log('valid',valid);
        // if (valid) {
        //     return universalFunction.validationError(res, valid);
        // }
        let superAdminData = await Model.SuperAdmin.findOne({
            email: req.body.email,
            isDeleted: false
        });
        if (superAdminData)
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.EMAIL_ALREDAY_EXIT);
        const password = await universalFunction.hashPasswordUsingBcrypt(req.body.password);
        req.body.password = password;
        superAdminData = await Model.SuperAdmin(req.body).save();
        let accessToken = await universalFunction.jwtSign(superAdminData);
        console.log('access token', accessToken);
        superAdminData = await Model.SuperAdmin.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(superAdminData._id)
        }, {
            $set: {
                accessToken: accessToken
            }
        })
        superAdminData.accessToken = accessToken;
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUPER_ADMIN_REGISTER_SUCCESSFULLY, superAdminData);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function login(req, res) {
    try {
        // const valid = await Validation.isSuperAdminValidate.validateLogin(req);
        // if (valid) {
        //     return universalFunction.validationError(res, valid);
        // }
        let superAdminData = await Model.SuperAdmin.findOne({
            email: req.body.email,
            isDeleted: false
        });
        if (!superAdminData)
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.INVALID_EMAIL_PASSWORD);
        if (superAdminData && superAdminData.isBlocked)
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.SUPER_ADMIN_BLOCKED);
        let password = await universalFunction.comparePasswordUsingBcrypt(req.body.password, superAdminData.password);
        if (!password) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.INVALID_PASSWORD);
        }
        let accessToken = await universalFunction.jwtSign(superAdminData);
        superAdminData.accessToken = accessToken;
        await Model.SuperAdmin.findOneAndUpdate({
            _id: superAdminData._id
        }, {
            $set: {
                accessToken: accessToken
            }
        });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUPER_ADMIN_LOGIN_SUCCESSFULLY, superAdminData);
    } catch (error) {
        console.log('err', error);
        universalFunction.exceptionError(res);
    }
};
async function logout(req, res) {
    try {
        let accessToken = await universalFunction.jwtSign(req.user);
        await Model.SuperAdmin.findOneAndUpdate({
            _id: req.user._id
        }, {
            accessToken: accessToken
        }, {});
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUPER_ADMIN_LOGOUT_SUCCESSFULLY, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function getProfile(req, res) {
    try {
        const superAdminData = await Model.SuperAdmin.findOne({
            _id: req.user._id
        });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESS, superAdminData);
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function updateSuperAdminProfile(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateUpdateSuperAdminProfile(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        let setObj = req.body;
        if (setObj.password) {
            let superAdminData = await Model.SuperAdmin.findOne({
                _id: req.user._id
            });
            let passwordValid = await universalFunction.comparePasswordUsingBcrypt(req.body.password, superAdminData.password);
            if (passwordValid) {
                return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.SAME_PASSWORD_NOT_ALLOWED);
            }
            const password = await universalFunction.hashPasswordUsingBcrypt(req.body.password);
            req.body.password = password;

        }
        if (setObj.email) {
            let superAdminData = await Model.SuperAdmin.findOne({
                _id: {
                    $nin: [req.user._id]
                },
                email: req.body.email,
                isDeleted: false
            });
            if (superAdminData)
                return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.EMAIL_ALREDAY_EXIT);
        }
        await Model.SuperAdmin.findOneAndUpdate({
            _id: req.user._id
        }, {
            $set: setObj
        });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUPER_ADMIN_PROFILE_UPDATED_SUCCESSFULLY, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function changePassword(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateChangePassword(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        let setObj = req.body;
        const superAdminData = await Model.SuperAdmin.findOne({
            _id: req.user._id
        });
        let passwordValid = await universalFunction.comparePasswordUsingBcrypt(req.body.password, superAdminData.password);
        if (!passwordValid) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.OLD_PASSWORD_NOT_MATCH);
        }
        const password = await universalFunction.hashPasswordUsingBcrypt(req.body.newPassword);
        req.body.password = password;
        await Model.SuperAdmin.findOneAndUpdate({
            _id: req.user._id
        }, {
            $set: setObj
        });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUPER_ADMIN_CHANGED_PASSWORD_SUCCESSFULLY, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function forgotPassword(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateForgotPassword(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        const superAdminData = await Model.SuperAdmin.findOne({
            email: req.body.email,
            isDeleted: false,
            isBlocked: false
        });
        if (!superAdminData)
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.EMAIL_ID_DOES_NOT_EXISTS);

        const passwordResetToken = await universalFunction.generateRandomString(20);
        await Model.SuperAdmin.findOneAndUpdate({
            _id: superAdminData._id
        }, {
            $set: {
                passwordResetToken: passwordResetToken,
                passwordResetTokenDate: new Date()
            }
        });
        let passwordResetLink = constant.FORGOT_PASSWORD_LINK.SUPER_ADMIN;
        const payloadData = {
            superAdminId: superAdminData._id,
            email: req.body.email,
            messageType: constant.EMAIL_MESSAGE_TYPE.FORGOT_PASSWORD,
            passwordResetToken: passwordResetToken,
            variableData: {
                passwordResetLink: passwordResetLink,
                passwordResetToken: passwordResetToken
            }
        }
        Service.EmailService.sendEmail(payloadData);
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.PASSWORD_RESET_LINK_SEND_YOUR_EMAIL, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function forgotChangePassword(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateForgotChangePassword(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        const superAdminData = await Model.SuperAdmin.findOne({
            passwordResetToken: req.body.passwordResetToken
        });
        if (!superAdminData)
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.INVALID_PASSWORD_RESET_TOKEN);
        const passwordResetToken = await universalFunction.generateRandomString(20);
        const password = await universalFunction.hashPasswordUsingBcrypt(req.body.password);
        await Model.SuperAdmin.updateOne({
            _id: superAdminData._id
        }, {
            $set: {
                password: password,
                passwordResetToken: passwordResetToken
            }
        })
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.PASSWORD_CHANGED_SUCCESSFULLY, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function uploadFile(req, res) {
    try {
        let data = {};
        if (req.file && req.file.filename) {
            data.orignal = `${constant.FILE_PATH.SUPER_ADMIN}/${req.file.filename}`;
            data.thumbNail = `${constant.FILE_PATH.SUPER_ADMIN}/${req.file.filename}`;
        }
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.FILE_UPLOADED_SUCCESSFULLY, data);
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
/*
NOTIFICATION API'S
*/
async function getAllNotification(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateNotificationIdWithPageNo(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        let skip = parseInt(req.query.pageNo - 1) || 0;
        let limit = constant.DEFAULT_LIMIT;
        skip = skip * limit

        let criteria = {
            isDeleted: false
        }
        let dataToSend = {};
        let pipeline = [{
                $match: {
                    receiverId: req.user._id
                }
            },
            {
                $match: {
                    isDeleted: false
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: 'admins',
                    localField: 'adminId',
                    foreignField: '_id',
                    as: 'adminData'
                }
            },
            {
                $project: {
                    adminId: 1,
                    _id: 1,
                    adminData: 1,
                    message: 1,
                    isRead: 1
                }
            }
        ];
        if (req.query.isRead != undefined) {
            pipeline.push({
                $match: {
                    isRead: false
                }
            });
            criteria.isRead = false;
        }
        if (req.query.notificationId != undefined) {
            pipeline.push({
                $match: {
                    _id: req.query.notificationId
                }
            });
            criteria._id = req.query.notificationId;
        }
        const count = await Model.SuperAdminNotification.countDocuments(criteria);
        const notificationData = await Model.SuperAdminNotification.aggregate(pipeline);
        dataToSend.notificationData = notificationData;
        dataToSend.totalPages = Math.ceil(count / limit) || 0;
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESS, dataToSend);
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function clearNotification(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateNotificationId(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        await Model.SuperAdminNotification.findOneAndUpdate({
            _id: req.body.notificationId
        }, req.body);
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUPER_ADMIN_CLEAR_NOTIFICATION, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function clearAllNotification(req, res) {
    try {
        await Model.SuperAdminNotification.update({
            receiverId: req.user._id
        }, req.body, {
            multi: true
        });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUPER_ADMIN_CLEAR_ALL_NOTIFICATION, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function addAppSetting(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateAddAppSetting(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        const superAdminData = await Model.SuperAdmin({
            _id: req.body.superAdminId,
            isDeleted: false
        }, { _id: 1 })
        if (!superAdminData) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.ADMIN_NOT_FOUND);
        }
        const appSettingData = await Model.AppSetting.findOne({
            superAdminId: req.body.superAdminId,
            isDeleted: false
        })
        if (appSettingData) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.APP_SETTING_ALREADY_EXIST);
        }
        const appSetting = await Model.AppSetting(req.body).save();
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.APP_SETTING_ADDED_SUCESSFULLY, appSetting);

    } catch (error) {

        universalFunction.exceptionError(res);
    }
}
async function addCredentials(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateAddCredentialsSetting(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        req.body.isBlocked = false;
        req.body.isDeleted = false;
        req.body.isActive = false;
        const superAdminData = await Model.SuperAdmin({
            _id: req.body.superAdminId,
            isDeleted: false
        }, { _id: 1 })

        if (!superAdminData) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.ADMIN_NOT_FOUND);
        }
        await Model.Credentials.findOneAndUpdate({
            superAdminId: req.body.superAdminId,
            serviceType: req.body.serviceType,
            serviceCode: req.body.serviceCode
        }, { $set: req.body }, { upsert: true });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.CREDENTIALS_ADDED_SUCESSFULLY, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
}
async function activeCredentials(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateActiveCredentials(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        let criteria = {};
        const findCredentials = await Model.Credentials.findOne({ _id: req.body.credentialId, isDeleted: false })
        if (!findCredentials) return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.CREDENTIALS_NOT_FOUND);
        criteria = {
            superAdminId: req.body.superAdminId
        }
        const superAdminData = await Model.SuperAdmin({
            _id: req.body.superAdminId,
            isDeleted: false
        }, { _id: 1 })
        if (!superAdminData) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.ADMIN_NOT_FOUND);
        }
        const findActiveCredentials = await Model.Credentials.findOne({
            superAdminId: req.body.superAdminId,
            serviceType: req.body.serviceType,
            serviceCode: req.body.serviceCode,
            isDeleted: false
        })
        if (findActiveCredentials && findActiveCredentials.isActive && findActiveCredentials.isActive == req.body.isActive) {
            return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.CURRENT_CREDENTIALS_ALREADY_ACTIVE);
        } else if (findActiveCredentials && !findActiveCredentials.isActive && findActiveCredentials.isActive == req.body.isActive) {
            return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.CURRENT_CREDENTIALS_ALREADY_ACTIVE);
        }
        let message = messages.CREDENTIALS_UN_ACTIVE_SUCESSFULLY;
        if (req.body.isActive)
            message = messages.CREDENTIALS_ACTIVE_SUCESSFULLY;

        const credentials = await Model.Credentials.update(criteria, { isActive: req.body.isActive })
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, message, credentials);
    } catch (error) {
        universalFunction.exceptionError(res);
    }
}
/*
ADMIN API'S
*/
async function addAdmin(req, res) {
    try {
        // const valid = await Validation.isSuperAdminValidate.validateAddAdmin(req);
        // if (valid) {
        //     return universalFunction.validationError(res, valid);
        // }
        const emailUser = await Model.Admin.findOne({
            email: req.body.email,
            isDeleted: false
        });
        if (emailUser) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.EMAIL_ALREDAY_EXIT);
        }

        if (req.body.latitude && req.body.longitude) {
            let location = {
                type: "point",
                coordinates: [req.body.latitude, req.body.longitude]
            }
            req.body.location = location
        }
        req.body.image = '';
        if (req.file && req.file.filename) {
            req.body.image = `${constant.FILE_PATH.USER}/${req.file.filename}`;
        }
        const password = await universalFunction.hashPasswordUsingBcrypt(req.body.password);
        req.body.password = password;
        let adminData = await new Model.Admin(req.body).save();
        let accessToken = await universalFunction.jwtSign(adminData);
        adminData = await Model.Admin.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(adminData._id)
        }, {
            $set: {
                accessToken: accessToken
            }
        })
        adminData.accessToken = accessToken;
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.ADMIN_ADD_SUCCESSFULLY, adminData);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};

async function loginAdmin(req, res) {
    try {
        // const valid = await Validation.isSuperAdminValidate.validateLogin(req);
        // if (valid) {
        //     return universalFunction.validationError(res, valid);
        // }
        let adminData = await Model.Admin.findOne({
            email: req.body.email,
            isDeleted: false
        });
        console.log('admin', adminData);
        if (!adminData)
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.INVALID_EMAIL_PASSWORD);
        if (adminData && adminData.isBlocked)
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.SUPER_ADMIN_BLOCKED);
        let password = await universalFunction.comparePasswordUsingBcrypt(req.body.password, adminData.password);
        console.log('password', password);
        if (!password) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.INVALID_PASSWORD);
        }
        let accessToken = await universalFunction.jwtSign(adminData);
        adminData.accessToken = accessToken;
        await Model.Admin.findOneAndUpdate({
            _id: adminData._id
        }, {
            $set: {
                accessToken: accessToken
            }
        });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUPER_ADMIN_LOGIN_SUCCESSFULLY, adminData);
    } catch (error) {
        console.log('err', error);
        universalFunction.exceptionError(res);
    }
};

async function updateAdminProfile(req, res) {
    try {
        // const valid = await Validation.isSuperAdminValidate.validateUpdateAdminProfile(req);
        // if (valid) {
        //     return universalFunction.validationError(res, valid);
        // }
        let setObj = req.body;
        let adminData = await Model.Admin.findOne({
            _id: req.body.adminId
        });
        if (setObj.password) {
            let passwordValid = await universalFunction.comparePasswordUsingBcrypt(req.body.password, adminData.password);
            if (passwordValid) {
                return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.SAME_PASSWORD_NOT_ALLOWED);
            }
            const password = await universalFunction.hashPasswordUsingBcrypt(req.body.password);
            req.body.password = password;
        }
        if (setObj.email) {
            adminData = await Model.Admin.findOne({
                _id: {
                    $nin: [req.body.adminId]
                },
                email: req.body.email,
                isDeleted: false
            });
            if (userData)
                return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.EMAIL_ALREDAY_EXIT);
        }

        if (req.file && req.file.filename) {
            setObj.image = `${constant.FILE_PATH.USER}/${req.file.filename}`;
        }
        await Model.Admin.findOneAndUpdate({
            _id: req.body.adminId
        }, {
            $set: setObj
        });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.ADMIN_PROFILE_UPDATED_SUCCESSFULLY, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function deleteBlockUnBlockDeactivateAdminProfile(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateDeleteBlockUbBlockDeactivateAdmin(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        let setObj = {};
        let message = null;
        if (req.body.isBlocked != undefined) {
            setObj.isBlocked = req.body.isBlocked;
            message = req.body.isBlocked ? messages.ADMIN_BLOCKED : messages.ADMIN_UN_BLOCKED;
        }
        if (req.body.isDeleted != undefined) {
            setObj.isDeleted = req.body.isDeleted;
            message = messages.ADMIN_DELETED;
        }
        if (req.body.isActive != undefined) {
            setObj.isActive = req.body.isActive;
            message = req.body.isActive ? messages.ADMIN_ACTIVE : messages.ADMIN_UN_ACTIVE;
        }
        const adminData = await Model.Admin.findOne({
            _id: req.body.adminId,
            isDeleted: false
        });
        if (!adminData) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.ADMIN_NOT_FOUND);
        }
        await Model.Admin.findOneAndUpdate({
            _id: req.body.adminId
        }, {
            $set: setObj
        });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, message, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function getAdminProfile(req, res) {
    try {
        // const valid = await Validation.isSuperAdminValidate.validategetAdminProfile(req);
        // if (valid) {
        //     return universalFunction.validationError(res, valid);
        // }
        const adminData = await Model.Admin.findOne({
            _id: req.body.adminId
        });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESS, adminData);
    } catch (error) {
        console.log('errr',error);
        universalFunction.exceptionError(res);
    }
};
async function getAllAdminProfile(req, res) {
    try {
        let dataToSend = {};
        let criteria = { isDeleted: false };
        // const valid = await Validation.isSuperAdminValidate.validategetAllAdminProfile(req);
        // if (valid) {
        //     return universalFunction.validationError(res, valid);
        // }
        let skip = parseInt(req.body.pageNo - 1) || constant.DEFAULT_SKIP;
        let limit = constant.DEFAULT_LIMIT;
        skip = skip * limit;
        // if(req.body.search !=undefined){
        //     criteria.$or = [
        //         {
        //             firstName: {
        //             $regex: req.body.search,
        //             $options: 'i',
        //           },
        //         },
        //         {
        //             lastName: {
        //             $regex: req.body.search,
        //             $options: 'i',
        //           },
        //         },
        //         {
        //             userName: {
        //             $regex: req.body.search,
        //             $options: 'i',
        //           },
        //         },
        //         {
        //           email: {
        //             $regex: req.body.search,
        //             $options: 'i',
        //           },
        //         },
        //       ];
        // }
        // const count = await Model.Admin.countDocuments(criteria);
        // const adminData = await Model.Admin.find(criteria).limit(limit).skip(skip).sort({createdAt: -1});
        // dataToSend.adminData=adminData || [];
        // dataToSend.totalPages =Math.ceil(count/limit) || 0;
        const adminData = await Model.Admin.find(criteria).sort({ createdAt: -1 });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESS, adminData);
    } catch (error) {
        console.log('err', error);
        universalFunction.exceptionError(res);
    }
};
async function addAdminAppSetting(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateAdminAddAppSetting(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        const superAdminData = await Model.SuperAdmin({
            _id: req.body.superAdminId,
            isDeleted: false
        }, { _id: 1 })
        if (!superAdminData) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.ADMIN_NOT_FOUND);
        }
        const appSettingData = await Model.AppSetting.findOne({
            superAdminId: req.body.superAdminId,
            isDeleted: false
        })
        if (appSettingData) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.APP_SETTING_ALREADY_EXIST);
        }

        const appSetting = await Model.AppSetting(req.body).save();
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.APP_SETTING_ADDED_SUCESSFULLY, appSetting);

    } catch (error) {

        universalFunction.exceptionError(res);
    }
}
async function addAdminCredentials(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateAdminAddCredentialsSetting(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        req.body.isBlocked = false;
        req.body.isDeleted = false;
        req.body.isActive = false;
        const adminData = await Model.Admin.findOne({
            _id: req.body.adminId,
            isDeleted: false
        }, { _id: 1 })

        if (!adminData) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.ADMIN_NOT_FOUND);
        }
        await Model.Credentials.findOneAndUpdate({
            adminId: req.body.adminId,
            serviceType: req.body.serviceType,
            serviceCode: req.body.serviceCode
        }, { $set: req.body }, { upsert: true });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.CREDENTIALS_ADDED_SUCESSFULLY, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
}
async function activeAdminCredentials(req, res) {
    try {
        const valid = await Validation.isSuperAdminValidate.validateAdminActiveCredentials(req);
        if (valid) {
            return universalFunction.validationError(res, valid);
        }
        let criteria = {};
        const findCredentials = await Model.Credentials.findOne({ _id: req.body.credentialId, isDeleted: false })
        if (!findCredentials) return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.CREDENTIALS_NOT_FOUND);

        criteria = {
            adminId: req.body.adminId
        }
        const adminData = await Model.Admin({
            _id: req.body.adminId,
            isDeleted: false
        }, { _id: 1 })
        if (!adminData) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.ADMIN_NOT_FOUND);
        }
        const findActiveCredentials = await Model.Credentials.findOne({
            adminId: req.body.adminId,
            serviceType: req.body.serviceType,
            serviceCode: req.body.serviceCode,
            isDeleted: false
        })
        if (findActiveCredentials && findActiveCredentials.isActive && findActiveCredentials.isActive == req.body.isActive) {
            return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.CURRENT_CREDENTIALS_ALREADY_ACTIVE);
        } else if (findActiveCredentials && !findActiveCredentials.isActive && findActiveCredentials.isActive == req.body.isActive) {
            return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.CURRENT_CREDENTIALS_ALREADY_ACTIVE);
        }

        let message = messages.CREDENTIALS_UN_ACTIVE_SUCESSFULLY;
        if (req.body.isActive)
            message = messages.CREDENTIALS_ACTIVE_SUCESSFULLY;

        const credentials = await Model.Credentials.update(criteria, { isActive: req.body.isActive })
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, message, credentials);
    } catch (error) {
        universalFunction.exceptionError(res);
    }
}
async function addBorrower(req, res) {
    try {
        // const valid = await Validation.isSuperAdminValidate.validateAddAdmin(req);
        // if (valid) {
        //     return universalFunction.validationError(res, valid);
        // }
        const emailUser = await Model.Borrower.findOne({
            email: req.body.email,
            isDeleted: false
        });
        if (emailUser) {
            return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.EMAIL_ALREDAY_EXIT);
        }

        if (req.body.latitude && req.body.longitude) {
            let location = {
                type: "point",
                coordinates: [req.body.latitude, req.body.longitude]
            }
            req.body.location = location
        }
        req.body.image = '';
        if (req.file && req.file.filename) {
            req.body.image = `${constant.FILE_PATH.USER}/${req.file.filename}`;
        }
        req.body.adminId = req.admin._id
        let BorrowerData = await new Model.Borrower(req.body).save();
        let accessToken = await universalFunction.jwtSign(BorrowerData);
        BorrowerData = await Model.Borrower.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(BorrowerData._id)
        }, {
            $set: {
                accessToken: accessToken
            }
        })
        BorrowerData.accessToken = accessToken;
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.ADMIN_ADD_SUCCESSFULLY, BorrowerData);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function updateBorrowerProfile(req, res) {
    try {
        // const valid = await Validation.isSuperAdminValidate.validateUpdateAdminProfile(req);
        // if (valid) {
        //     return universalFunction.validationError(res, valid);
        // }
        let setObj = req.body;
        let bowworerData = await Model.Borrower.findOne({
            _id: req.body.BorrowerId
        });
        if (setObj.password) {
            let passwordValid = await universalFunction.comparePasswordUsingBcrypt(req.body.password, bowworerData.password);
            if (passwordValid) {
                return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.SAME_PASSWORD_NOT_ALLOWED);
            }
            const password = await universalFunction.hashPasswordUsingBcrypt(req.body.password);
            req.body.password = password;
        }
        if (setObj.email) {
            bowworerData = await Model.bowworerData.findOne({
                _id: {
                    $nin: [req.body.BorrowerId]
                },
                email: req.body.email,
                isDeleted: false
            });
            if (userData)
                return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.EMAIL_ALREDAY_EXIT);
        }

        if (req.file && req.file.filename) {
            setObj.image = `${constant.FILE_PATH.USER}/${req.file.filename}`;
        }
        await Model.Borrower.findOneAndUpdate({
            _id: req.body.BorrowerId
        }, {
            $set: setObj
        });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESSFULLY_UPDATED, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function adminAllBorrower(req, res) {
    try {
        let dataToSend = {};
        let criteria = { isDeleted: false, adminId: req.admin._id };
        let skip = parseInt(req.body.pageNo - 1) || constant.DEFAULT_SKIP;
        let limit = constant.DEFAULT_LIMIT;
        skip = skip * limit;

        const BorrowerData = await Model.Borrower.find(criteria).sort({ createdAt: -1 });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESS, BorrowerData);
    } catch (error) {
        console.log('err', error);
        universalFunction.exceptionError(res);
    }
};
async function superAminAllBorrower(req, res) {
    try {
        let dataToSend = {};
        let criteria = { isDeleted: false };
        let skip = parseInt(req.body.pageNo - 1) || constant.DEFAULT_SKIP;
        let limit = constant.DEFAULT_LIMIT;
        skip = skip * limit;

        const BorrowerData = await Model.Borrower.find(criteria).sort({ createdAt: -1 });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESS, BorrowerData);
    } catch (error) {
        console.log('err', error);
        universalFunction.exceptionError(res);
    }
};
async function loan(req, res) {
    try {
       const findBorrower = await Model.Borrower.findOne({_id:req.body.borrowerId})
       if(!findBorrower){
        return universalFunction.sendResponse(req, res, statusCode.ERROR, messages.INVALID_BORROWER_ID);

       }
        req.body.adminId = req.admin._id
        let loanData = await new Model.Loan(req.body).save();
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.LOAN_ADD_SUCCESSFULLY, loanData);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function updateLoan(req, res) {
    try {
       const findLoad = await Model.Loan.findOne({_id:req.body.loanId})
       if(!findLoad){
        return universalFunction.sendResponse(req, res, statusCode.ERROR, messages.INVALID_LOAN_ID);
       }
        let loanData = await  Model.Loan.findOneAndUpdate({_id:req.body.loanId},req.body);
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESSFULLY_UPDATED);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function getApprovedLoad(req, res) {
    try {
       const findLoan = await Model.Loan.find({status:"approved",isDeleted:"false"})
       console.log('findoad',findLoan);
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.FETCHED_SUCCESSFULLY,findLoan);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function getPendingLoan(req, res) {
    try {
       const findLoan = await Model.Loan.find({status:"pending",isDeleted:"false"})
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.FETCHED_SUCCESSFULLY,findLoan);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function getBorrowerLoan(req, res) {
    try {
       const findLoan = await Model.Loan.find({borrowerId:req.body.borrowerId})
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.FETCHED_SUCCESSFULLY,findLoan);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function deleteAdmin(req, res) {
    try {
       const findLoan = await Model.Admin.update({_id:req.body.adminId},{isDeleted:true})
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.ADMIN_DELETED_ACCOUNT_SUCCESSFULLY);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function deleteLoan(req, res) {
    try {
       const findLoad = await Model.Loan.findOne({_id:req.body.loanId})
       if(!findLoad){
        return universalFunction.sendResponse(req, res, statusCode.ERROR, messages.INVALID_LOAN_ID);
       }
        let loanData = await  Model.Loan.findOneAndUpdate({_id:req.body.loanId},{isDeleted:true});
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESSFULLY_DELETED);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function getDetails(req, res) {
    try {
       const findLoan = await Model.Loan.find({status:"pending",isDeleted:"false"})
       const findBorrower = await Model.Borrower.find({isDeleted:"false"})
       const findBranches = await Model.Admin.find({isDeleted:"false"})

        console.log('find loan',findLoan);
       let pendingLoan = 0
       findLoan.map((data=>{
           console.log("add changes",data);
           pendingLoan = pendingLoan+ data.principleAmount

       }))
       let finalRes ={
        pendingLoan : pendingLoan,
        Borrower:findBorrower.length,
        Branches : findBranches.length
       }
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.FETCHED_SUCCESSFULLY,finalRes);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function superAminAPendingBorrower(req, res) {
    try {
        let dataToSend = {};
        let criteria = { isDeleted: false,isApproved:false };
        let skip = parseInt(req.body.pageNo - 1) || constant.DEFAULT_SKIP;
        let limit = constant.DEFAULT_LIMIT;
        skip = skip * limit;

        const BorrowerData = await Model.Borrower.find(criteria).sort({ createdAt: -1 });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESS, BorrowerData);
    } catch (error) {
        console.log('err', error);
        universalFunction.exceptionError(res);
    }
};
async function superAminApprovedBorrower(req, res) {
    try {
        let dataToSend = {};
        let criteria = { isDeleted: false,isApproved:true };
        let skip = parseInt(req.body.pageNo - 1) || constant.DEFAULT_SKIP;
        let limit = constant.DEFAULT_LIMIT;
        skip = skip * limit;

        const BorrowerData = await Model.Borrower.find(criteria).sort({ createdAt: -1 });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESS, BorrowerData);
    } catch (error) {
        console.log('err', error);
        universalFunction.exceptionError(res);
    }
};
async function addExpenses(req, res) {
    try {
        req.body.adminId = req.admin._id
        let ExpensesData = await new Model.Expenses(req.body).save();

        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.ADMIN_ADD_SUCCESSFULLY, ExpensesData);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function updateExpenses(req, res) {
    try {
        // const valid = await Validation.isSuperAdminValidate.validateUpdateAdminProfile(req);
        // if (valid) {
        //     return universalFunction.validationError(res, valid);
        // }
        let setObj = req.body;
        let bowworerData = await Model.Borrower.findOne({
            _id: req.body.BorrowerId
        });
        if (setObj.password) {
            let passwordValid = await universalFunction.comparePasswordUsingBcrypt(req.body.password, bowworerData.password);
            if (passwordValid) {
                return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.SAME_PASSWORD_NOT_ALLOWED);
            }
            const password = await universalFunction.hashPasswordUsingBcrypt(req.body.password);
            req.body.password = password;
        }
        if (setObj.email) {
            bowworerData = await Model.bowworerData.findOne({
                _id: {
                    $nin: [req.body.BorrowerId]
                },
                email: req.body.email,
                isDeleted: false
            });
            if (userData)
                return universalFunction.sendResponse(req, res, statusCode.BAD_REQUEST, messages.EMAIL_ALREDAY_EXIT);
        }

        if (req.file && req.file.filename) {
            setObj.image = `${constant.FILE_PATH.USER}/${req.file.filename}`;
        }
        await Model.Expenses.findOneAndUpdate({
            _id: req.body.expensesId
        }, {
            $set: setObj
        });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESSFULLY_UPDATED, {});
    } catch (error) {
        universalFunction.exceptionError(res);
    }
};
async function getExpenses(req, res) {
    try {
        req.body.adminId = req.admin._id
        let ExpensesData = await  Model.Expenses.find({adminId:req.admin._id});

        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.FETCHED_SUCCESSFULLY, ExpensesData);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function getAllExpenses(req, res) {
    try {
        let ExpensesData = await  Model.Expenses.find({}).populate('adminId');

        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.FETCHED_SUCCESSFULLY, ExpensesData);
    } catch (error) {
        console.log('error', error);
        universalFunction.exceptionError(res);
    }
};
async function adminApprovedBorrower(req, res) {
    try {
        let dataToSend = {};
        let criteria = { isDeleted: false,isApproved:true,adminId:req.admin._id };
        let skip = parseInt(req.body.pageNo - 1) || constant.DEFAULT_SKIP;
        let limit = constant.DEFAULT_LIMIT;
        skip = skip * limit;

        const BorrowerData = await Model.Borrower.find(criteria).sort({ createdAt: -1 });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESS, BorrowerData);
    } catch (error) {
        console.log('err', error);
        universalFunction.exceptionError(res);
    }
};
async function AdminPendingBorrower(req, res) {
    try {
        let dataToSend = {};
        let criteria = { isDeleted: false,isApproved:false,adminId:req.admin._id };
        let skip = parseInt(req.body.pageNo - 1) || constant.DEFAULT_SKIP;
        let limit = constant.DEFAULT_LIMIT;
        skip = skip * limit;

        const BorrowerData = await Model.Borrower.find(criteria).sort({ createdAt: -1 });
        return universalFunction.sendResponse(req, res, statusCode.SUCCESS, messages.SUCCESS, BorrowerData);
    } catch (error) {
        console.log('err', error);
        universalFunction.exceptionError(res);
    }
};



