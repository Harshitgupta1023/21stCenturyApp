const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const generateCheckSum = require("../utils/generateCheckSum");
const verifyToken = require("../utils/verifyToken");
const calculateAmount = require("../utils/calcaluteAmount");

exports.verify = async (req, res, next) => {
  try {
    const { orderID, token, txnAmount } = req.query;
    const uid = await verifyToken(token);
    if (uid === false) throw new Error("Invalid Token");
    const amount = await calculateAmount(uid);
    if (amount != txnAmount) throw new Error("Amount Mismatch");

    var paytmParams = {};
    paytmParams.body = {
      mid: process.env.MID,
      orderId: orderID,
    };

    const checkSum = await generateCheckSum(paytmParams.body);

    paytmParams.head = {
      signature: checkSum,
    };
    var axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(paytmParams).length,
      },
    };
    const resp = await axios.post(
      `https://securegw-stage.paytm.in//v3/order/status`,
      paytmParams,
      axiosConfig
    );
    if (
      resp.data.body.resultInfo.resultStatus === "TXN_SUCCESS" &&
      resp.data.body.orderId === orderID
    )
      res.status(200).json({ valid: true });
    else res.status(200).json({ valid: false });
  } catch (err) {
    res.status(400).json({ error: true });
  }
};
