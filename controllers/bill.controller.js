const billModel = require("../models/bill.model")
const moment = require("moment")




module.exports = {
    bill_getAll: async (req, res) => {

        try {
            const { key, id } = req.user;

            // default Is user

            let bills = []
            bills = await billModel.find({ uid: id });
            //Is Admin
            if (key === 0) bills = await billModel.find();

            return res.status(200).json({ message: "Fetch successfully!", bills })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Fetch bills failed", error })
        }
    },
    bill_get: async (req, res) => {

        try {
            const { billId } = req.params;
            const bill = await billModel.findById(billId);

            return res.status(200).json({ message: "Fetch successfully!", bill })
        } catch (error) {
            return res.status(500).json({ message: "Fetch bills failed", error })
        }

    },
    bill_post: async (req, res) => {

        try {
            // const { totalPrice } = req.body;
            const { id } = req.user;
            const {
                products,
                totalPrice,
                pay,
                traddingCode,
                address,
                receiver,
                phoneReceiver,
            } = req.body;
            let newBill;
            if (pay) {
                newBill = new billModel({ products, totalPrice, pay, traddingCode, address, receiver, phoneReceiver, uid: id, createAt: moment().format() });

            } else {
                newBill = new billModel({ products, totalPrice, address, receiver, phoneReceiver, uid: id, createAt: moment().format() });

            }
            await newBill.save()
            return res.status(200).json({ message: "Add bill successfully" })

        } catch (error) {
            return res.status(500).json({ message: "Add bill failed ", error: error.message })
        }
    },
    bill_patch: async (req, res) => {

        try {
            const { status } = req.body;
            const { billId } = req.params;
            const { key, id } = req.user

            const bill = await billModel.find({ _id: billId, uid: id });
            if (!bill) return res.status(400).json({ message: "Bill does not exist !" })

            if (key !== 0 && (status !== 'Canceled' && status !== 'Delivered')) return res.status(500).json({ message: "Not permission!" })

            switch (status) {
                case 'Delivered': {
                    await billModel.updateOne({ _id: billId }, { $set: { status, pay: true, receivedDate: moment().format() } });
                }
                case 'Canceled': {
                    await billModel.updateOne({ _id: billId }, { $set: { status, canceledDate: moment().format() } });
                }
                default: {
                    await billModel.updateOne({ _id: billId }, { $set: { status } });
                }
            }
            return res.status(200).json({ message: "Update bill successfully! !" })
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({ message: "Update bill failed!" })
        }

    }, bill_delele: async (req, res) => {

        try {
            // const { totalPrice } = req.body;
            const { id, key } = req.user;
            const { billId } = req.params;


            const bill = billModel.find({ _id: billId });
            if (!bill) return res.status(400).json({ message: "Bill does not exist !" })

            if (id !== bill.uid && key !== 0) return res.status(400).json({ message: "Not permission !" })

            await billModel.deleteOne({ _id: billId });
            return res.status(200).json({ message: "Delete bill successfully" })

        } catch (error) {
            return res.status(500).json({ message: "Delete bill failed ", error: error.message })
        }
    },

}