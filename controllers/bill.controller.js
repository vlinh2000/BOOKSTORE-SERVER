const billModel = require("../models/bill.model")

module.exports = {
    bill_getAll: async (req, res) => {

        try {
            const { key, id } = req.user;

            // default Is user
            let bills = await billModel.find({ uid: id });
            //Is Admin
            if (key === 0) bills = await billModel.find();

            return res.status(200).json({ message: "Fetch successfully!", bills })

        } catch (error) {
            return res.status(500).json({ message: "Faild to fetch bills !", error })
        }
    },
    bill_get: async (req, res) => {

        try {
            const { billId } = req.params;
            const bill = await billModel.findById(billId);

            return res.status(200).json({ message: "Fetch successfully!", bill })
        } catch (error) {
            return res.status(500).json({ message: "Faild to fetch bills !", error })
        }

    },
    bill_post: async (req, res) => {

        try {
            // const { totalPrice } = req.body;
            const { id } = req.user;
            const products = [{ name: "book test", prices: [{ color: "Red", price: 19000 }], num: 10 }]
            const fakeData = { totalPrice: 190000, uid: id, products }

            const newBill = new billModel({ ...fakeData });
            await newBill.save()
            return res.status(200).json({ message: "Add bill successfully" })

        } catch (error) {
            return res.status(500).json({ message: "Faild to add bills !", error: error.message })

        }
    },
    bill_patch: async (req, res) => {

        try {
            let status = "Đang vận chuyển";

            const statusFromUser = req.body.status;

            const { billId } = req.params;
            const { key } = req.user

            const bill = await billModel.findById(billId);
            if (!bill) return res.status(400).json({ message: "Bill already not exists !" })

            if (key !== 0 && (statusFromUser == 'Đã hủy' || statusFromUser == 'Đã nhận hàng')) status = statusFromUser;

            await billModel.updateOne({ _id: billId }, { $set: { status: status } })
            return res.status(200).json({ message: "Confirmed bill !" })
        } catch (error) {
            return res.status(500).json({ message: "Faild to update bill !" })

        }

    }

}