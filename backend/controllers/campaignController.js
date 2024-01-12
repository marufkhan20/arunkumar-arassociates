const Campaign = require("../models/Campaign");
const axios = require("axios");
const sendMail = require("../services/emailService");
const campaignMailTemplate = require("../templates/email-template/campaignMailTemplate");
const CreditCard = require("../models/CreditCard");
const Notice = require("../models/Notice");
const MailInfo = require("../models/MailInfo");

// get all compaign controller
const getAllCampaignController = async (req, res) => {
  try {
    const { _id } = req.user || {};
    const { type } = req.params || {};

    const campaigns = await Campaign.find({
      user: _id,
      type,
    }).sort({
      createdAt: "desc",
    });
    res.status(200).json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// get single campign controller
const getSingleCampaignController = async (req, res) => {
  try {
    const { id } = req.params || {};
    const campaign = await Campaign.findById(id).populate([
      "creditCards",
      "notices",
    ]);
    res.status(200).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

// send mail controller
const sendMailController = async (req, res) => {
  try {
    const { data, type } = req.body || {};
    const { _id } = req.user || {};

    for (const item of data) {
      if (type === "credit-card") {
        const creditCard = await CreditCard.findById(item);

        if (creditCard?._id && creditCard?.emailId) {
          await sendMail({
            to: creditCard?.emailId,
            subject: "Credit Card Notice",
            html: campaignMailTemplate({
              data: creditCard,
            }),
          });
        }

        if (creditCard?._id && creditCard?.custMobileNo) {
          // send whatsapp messages
          const url = "https://api.interakt.ai/v1/public/message/";
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Basic ${process.env.INTERAKT_SECRET_KEY}`, // Add your authorization header if needed
          };
          const requestBody = {
            countryCode: "+91",
            phoneNumber: `${creditCard?.custMobileNo}`,
            callbackData: "some text here",
            type: "Template",
            template: {
              name: "common",
              languageCode: "en",
              bodyValues: [
                creditCard?.custName,
                creditCard?.maskNo,
                creditCard?.noticeDate,
                creditCard?.noticeBalance,
                creditCard?.clmName,
                creditCard?.clmNo,
                `${process.env.SERVER_URL}${creditCard?.pdfLink}`,
              ],
            },
          };
          await axios.post(url, requestBody, { headers });
        }
      } else if (type === "notice") {
        if (type === "credit-card") {
          const notice = await Notice.findById(item);

          if (
            notice?._id &&
            notice?.email &&
            notice?.mode?.toLowerCase().includes("email")
          ) {
            await sendMail({
              to: notice?.email?.toLowerCase(),
              subject: "Credit Card Notice",
              html: campaignMailTemplate({ data: notice }),
            });
          }

          if (
            notice?._id &&
            notice?.mobile &&
            notice?.mode?.toLowerCase().includes("whatsapp")
          ) {
            // send whatsapp messages
            const url = "https://api.interakt.ai/v1/public/message/";
            const headers = {
              "Content-Type": "application/json",
              Authorization: `Basic ${process.env.INTERAKT_SECRET_KEY}`, // Add your authorization header if needed
            };
            const requestBody = {
              countryCode: "+91",
              phoneNumber: `${notice?.mobile}`,
              callbackData: "some text here",
              type: "Template",
              template: {
                name: "common",
                languageCode: "en",
                bodyValues: [
                  notice?.arqnName,
                  notice?.maskCard,
                  notice?.noticeDate,
                  notice?.noticeBalance,
                  notice?.clmName,
                  notice?.clmNo,
                  `${process.env.SERVER_URL}${notice?.pdfLink}`,
                ],
              },
            };
            await axios.post(url, requestBody, { headers });
          }
        }
      }
    }

    // create new mail info
    const newMailInfo = new MailInfo({
      user: _id,
      name: "Email And Whatsapp",
      date: new Date(),
      status: "success",
    });

    await newMailInfo.save();

    res.status(200).json({ success: true });
  } catch (err) {
    const { _id } = req.user || {};

    // create new mail info
    const newMailInfo = new MailInfo({
      user: _id,
      name: "Email And Whatsapp",
      date: new Date(),
      status: "failed",
    });

    await newMailInfo.save();

    console.error(err);
    res.status(500).json({
      error: "Server error occurred!!",
    });
  }
};

module.exports = {
  getAllCampaignController,
  getSingleCampaignController,
  sendMailController,
};
