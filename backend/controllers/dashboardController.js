const Campaign = require("../models/Campaign");
const CreditCard = require("../models/CreditCard");
const MailInfo = require("../models/MailInfo");
const Notice = require("../models/Notice");

// get all dashboard information controller
const geAllDashboardInformationController = async (req, res) => {
  try {
    const { _id } = req.user || {};
    const totalCreditCards = await CreditCard.countDocuments();
    const totalNotices = await Notice.countDocuments();
    const totalCreditCardCampaigns = await Campaign.countDocuments({
      type: "credit-card",
    });
    const totalNoticeCampaigns = await Campaign.countDocuments({
      type: "notice",
    });

    const mailInfo = await MailInfo.find().sort({
      createdAt: "desc",
    });

    res.status(200).json({
      totalCreditCards,
      totalNotices,
      totalCreditCardCampaigns,
      totalNoticeCampaigns,
      mailInfo,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

module.exports = {
  geAllDashboardInformationController,
};
