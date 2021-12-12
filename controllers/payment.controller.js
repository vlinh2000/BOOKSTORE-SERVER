const paymentModel = require("../models/payment.model");
const { handleDeleteFile } = require("../utils/fs");


module.exports = {
    payment_getAll: async (req, res) => {
        try {
            //
            const payments = await paymentModel.find({});
            res.status(200).json({ message: "Fetch success!", payments });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    payment_get: async (req, res) => {
        try {
            const { paymentId } = req.params;
            const payment = await paymentModel.findOne({ _id: paymentId });

            if (!payment) return res.status(401).json({ message: "Payment does not exists" });

            res.status(200).json({ message: "Fetch success!", payment });
        } catch (error) {
            res.status(409).json({ message: "Faild to fetch data", error })
        }
    },
    payment_post: async (req, res) => {
        try {
            const { holder, accountNumber } = req.body;
            const paymentLogo = req.file.path.split("\\").slice(1).join("/");
            console.log(paymentLogo);

            if (!holder || !accountNumber) return res.status(409).json({ message: "Lack infomation" });

            if (isNaN(req.body.accountNumber)) return res.status(409).json({ message: "Account number is invalid" })
            const newPayment = new paymentModel(
                {
                    holder,
                    accountNumber,
                    paymentLogo
                });

            await newPayment.save();
            res.status(200).json({ message: "Insert a payment successful!" });
        } catch (error) {
            res.status(409).json({ message: "Faild to insert payment", error })
        }
    },
    payment_delete: async (req, res) => {
        try {
            const { paymentId } = req.params;
            const payment = await paymentModel.findOne({ _id: paymentId });
            if (!payment) return res.status(404).json({ message: "Color is not exists!" });


            await paymentModel.deleteOne({ _id: paymentId })
            await handleDeleteFile(payment.paymentLogo);
            res.status(200).json({ message: "Delete a payment successful!" });
        } catch (error) {
            res.status(409).json({ message: "Faild to delete payment", error })
        }
    },
    payment_patch: async (req, res) => {
        try {
            const { paymentId } = req.params;
            console.log(paymentId)
            const payment = await paymentModel.findOne({ _id: paymentId });
            if (!payment) return res.status(404).json({ message: "Payment does not exists!" });

            const { holder, accountNumber } = req.body;
            const paymentLogo = req.file?.split("\\").slice(1).join("/");

            const fields = [
                {
                    key: "holder",
                    value: holder
                },
                {
                    key: "accountNumber",
                    value: accountNumber
                },
                {
                    key: "paymentLogo",
                    value: paymentLogo
                }
            ];
            let fieldUpdate = {};

            fields.forEach(field => {
                if (field.value !== undefined) fieldUpdate = { ...fieldUpdate, [field.key]: field.value }
            })

            console.log(fieldUpdate);
            if (Object.keys(fieldUpdate).length < 1) return res.status(404).json({ message: "No infomation" });

            if (fieldUpdate.paymentLogo) {
                await handleDeleteFile(payment.paymentLogo);
            }

            await paymentModel.updateOne({ _id: paymentId }, { $set: { ...fieldUpdate } })
            res.status(200).json({ message: "Update a payment successful!" });
        } catch (error) {
            console.log({ error })
            res.status(409).json({ message: "Faild to update payment", error })
        }
    }
}