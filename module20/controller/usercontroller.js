import express from 'express'
import User from '../models/User.js'
import UserVerification from '../models/UserVerification.js'
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import path from 'path';
import { error } from 'console';
import dotenv from "dotenv";
dotenv.config();
import JWT from 'jsonwebtoken'; // Assuming JWT module is imported
import { comparePassword } from '../helpers/authHelper.js';



//nodemailer transporter
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
});

//testing success
transporter.verify((error, success) => {
    if (error) {
        console.log(error)
    } else {
        console.log('Ready for message');
        console.log(success)
    }
})

export const registerController = (req, res) => {
    let { shopname, email, password, phone, address } = req.body;
    shopname = shopname.trim()
    email = email.trim()
    password = password.trim()
    phone = phone.trim()
    address = address.trim()

    if (shopname == "" || email == "" || password == "" || phone == "" || address == "") {
        res.json({
            status: "Failed",
            message: "Empty Input fields"
        });
    } else if (!/^[a-zA-z ]*$/.test(shopname)) {
        res.json({
            status: "Failed",
            message: "Invalid Shop Name Input"
        })
    } else if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(email)) {
        res.json({
            status: "Failed",
            message: "Invalid email Input"
        })
    } else if (!/^[a-zA-z ]*$/.test(address)) {
        res.json({
            status: "Failed",
            message: "Invalid Address Input"
        })
    } else if (password.length < 8) {
        res.json({
            status: "Failed",
            message: "Invalid password Input"
        })
    } else {
        User.find({ email }).then(result => {
            if (result.length) {
                res.json({
                    status: "Failed",
                    message: "User already exists"
                })
            } else {
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new User({
                        shopname,
                        email,
                        password: hashedPassword,
                        phone,
                        address,
                        verified: false
                    });

                    newUser.save().then(result => {
                        //handle account veryfication
                        sendVerificationEmail(result, res)
                    }).catch(err => {
                        console.log(err)
                        res.json({
                            status: "Failed",
                            message: "Error in saving user"
                        })
                    })
                })
                    .catch(err => {
                        console.log(err)
                        res.json({
                            status: "Failed",
                            message: "Error in hashing password"
                        })
                    })
            }
        }).catch(err => {
            console.log(err)
            res.json({
                status: "Failed",
                message: "Error while checking existing user!"
            })
        })
    }
}

//send verification email
const sendVerificationEmail = ({ _id, email }, res) => {
    //url to be used in the email
    const currentUrl = "http://localhost:2020/";
    const uniqueString = uuidv4() + _id;
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email",
        html: `<p>Verify your email address to complete the singup and login process for get into your account. </p><p>This Link <b>Erpires in 6 hours. </b></p><p>Press <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}> here </a>to proceed.</p>`,

    }
    //hash the unique string
    const saltRounds = 10;
    bcrypt.hash(uniqueString, saltRounds)
        .then((hashedUniqueString) => {
            //set values in user verufication collections
            const newVerification = new UserVerification({
                userId: _id,
                uniqueString: hashedUniqueString,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21600000,
            })
            newVerification.save()
                .then(() => {
                    transporter.sendMail(mailOptions)
                        .then(() => {
                            //email sented and verification recived
                            res.json({
                                status: "Pending",
                                message: "Verification Email sent"
                            })
                        })
                        .catch((error) => {
                            console.log(error)
                            res.json({
                                status: "Failed",
                                message: "Verification email failed!"
                            })
                        })
                })
                .catch((error) => {
                    console.log(error)
                    res.json({
                        status: "Failed",
                        message: "Could Not save verification email data!"
                    })
                })
        })
        .catch((error) => {
            console.log(error)
            res.json({
                status: "Failed",
                message: "An error occured while hashing email data!"
            })
        })

}

//verify email
export const verifyEmail = (req, res) => {
    let { userId, uniqueString } = req.params;
    UserVerification.find({ userId })
        .then((result) => {
            if (result.length > 0) {
                //user verification record exists
                const { expiresAt } = result[0];
                const hashedUniqueString = result[0].uniqueString;

                if (expiresAt < Date.now()) {
                    //record has expired so we deleted it
                    UserVerification.deleteOne({ userId })
                        .then(result => {
                            User.deleteOne({ _id: userId })
                                .then(() => {
                                    let message = "Link has been expired. please signup again"
                                    res.redirect(`user/verified/error=true&message=${message}`);
                                })
                                .catch(error => {
                                    let message = "Clearing user with expired unique string failed"
                                    res.redirect(`user/verified/error=true&message=${message}`);
                                })
                        })
                        .catch((error) => {
                            console.log(error)
                            let message = "An error occurred while clearing expired user verification record"
                            res.redirect(`user/verified/error=true&message=${message}`);
                        })
                } else {
                    //valid record exists so we validate the user
                    //first compare the hashed unique string
                    bcrypt.compare(uniqueString, hashedUniqueString)
                        .then(result => {
                            if (result) {
                                //string match
                                User.updateOne({ _id: userId }, { verified: true })
                                    .then(() => {
                                        UserVerification.deleteOne({ userId })
                                            .then(() => {
                                                res.sendFile(path.join(__dirname, "./../views/verified.html"));
                                            })
                                            .catch(error => {
                                                console.log(error)
                                                let message = "An error occured while finalized successful verification"
                                                res.redirect(`user/verified/error=true&message=${message}`);
                                            })
                                    })
                                    .catch(error => {
                                        console.log(error)
                                        let message = "An error occured while updating user record to show verified"
                                        res.redirect(`user/verified/error=true&message=${message}`);
                                    })
                            } else {
                                //existing record but incorrect verifications details
                                let message = "Invalid user verification details. check your inbox"
                                res.redirect(`user/verified/error=true&message=${message}`);

                            }
                        })
                        .catch(error => {
                            let message = "An error occurred while comparing unique string"
                            res.redirect(`user/verified/error=true&message=${message}`);
                        })

                }
            } else {
                let message = "Account record doesn't exist or has been verified already. please login"
                res.redirect(`user/verified/error=true&message=${message}`);
            }
        })
        .catch((error) => {
            console.log(error);
            let message = "An error occurred while for existing user verification record"
            res.redirect(`user/verified/error=true&message=${message}`);
        })
}
// redirecting if verified
export const verified = (req, res) => {
    res.sendFile(path.join(__dirname, "./../views/verified.html"))
}

//login controller
// export const loginController = (req, res) => {
//     let { email, password } = req.body;
//     email = email.trim()
//     password = password.trim()

//     if (email == "" || password == "") {
//         res.json({
//             status: "Failed",
//             message: "Empty Input field!"
//         })
//     } else {
//         User.find({ email })
//             .then(data => {
//                 if (data.length) {

//                     //check if user is verified

//                     if (!data[0].verified) {
//                         res.json({
//                             status: "Failed",
//                             message: "Email hasn't been verified. check your inbox",
//                         })
//                     } else {
//                         const hashedPassword = data[0].password;
//                         bcrypt.compare(password, hashedPassword).then(result => {
//                             if (result) {
//                                 res.json({
//                                     status: "success",
//                                     message: "Signin successfully",
//                                     user: data
//                                 })
//                             } else {
//                                 res.json({
//                                     status: "Failed",
//                                     message: "Invalid Password",
//                                 })
//                             }
//                         })
//                             .catch(err => {
//                                 res.json({
//                                     err,
//                                     status: "Failed",
//                                     message: "An error while camparing Password",
//                                 })
//                             })
//                     }



//                 } else {
//                     res.json({
//                         status: "Failed",
//                         message: "Invalid credentials",
//                     })
//                 }

//             })
//             .catch(err => {
//                 console.log(err)
//                 res.json({
//                     status: "Failed",
//                     message: "An error occurred while checking existing user",
//                 })
//             })
//     }
// }

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        //check user
        const user = await User.findOne({ email })
        .sort({ createdAt: -1 });;
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }

        const verified = await user.verified
        if (!verified == true) {
            return res.status(200).send({
                success: false,
                message: "User not registered",
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                shopname: user.shopname,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                verified: user.verified
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};