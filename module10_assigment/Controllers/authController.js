import { comparePassword, hashPassword } from "../Helpers/authHelper.js"
import userModel from "../Models/userModel.js"


export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body
        //validation
        if (!name) {
            return res.send({ message: 'Name is Required' })
        }
        if (!email) {
            return res.send({ message: 'Email is Required' })
        }
        if (!password) {
            return res.send({ message: 'Password is Required' })
        }
        if (!phone) {
            return res.send({ message: 'Phone Number is Required' })
        }
        if (!address) {
            return res.send({ message: 'Address is Required' })
        }

        //check user
        const existinguser = await userModel.findOne({ email })

        //existing user
        if (existinguser) {
            return res.status(200).send({
                success: false,
                message: 'Already Registered please login'
            })
        }
        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
        }).save()

        //final
        res.status(201).send({
            success: true,
            message: 'User Registered Successfully',
            user
        })







    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Register',
            error
        })
    }
}


//POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid Email or Password'
            })
        }

        //check user existing or not
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Invalid Email or Password'
            })
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password'
            })
        }

        //token creating

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).send({
            success: true,
            message: 'Login succesfull',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error
        })

    }
}