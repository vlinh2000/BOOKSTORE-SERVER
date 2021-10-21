const billModel = require("../models/bill.model")

module.exports = {
    bill_getAll: async (req, res) => {

        try {
            const { key, id } = req.user;

            // default Is user

            let bills = []
            bills = await billModel.find({ uid: id });
            //Is Admin
            if (key === 0) bills = await billModel.find({ $or: [{ status: "Đang vận chuyển" }, { status: "Đã giao" }] });

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

            const newBill = new billModel({ ...req.body, uid: id });
            await newBill.save()
            return res.status(200).json({ message: "Add bill successfully" })

        } catch (error) {
            return res.status(500).json({ message: "Add bill failed ", error: error.message })
        }
    },
    bill_patch: async (req, res) => {

        try {
            let status = "Đang vận chuyển";

            const statusFromUser = req.body.status;

            const { billId } = req.params;
            const { key } = req.user

            const bill = await billModel.findById(billId);
            if (!bill) return res.status(400).json({ message: "Bill does not exist !" })

            if (key !== 0 && (statusFromUser == 'Đã hủy' || statusFromUser == 'Đã nhận hàng')) status = statusFromUser;

            await billModel.updateOne({ _id: billId }, { $set: { status: status } })
            return res.status(200).json({ message: "Confirmed bill !" })
        } catch (error) {
            return res.status(500).json({ message: "Update bill successfully!" })

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