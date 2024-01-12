const { Schema, model } = require("mongoose");

const mailInfoSchema = new Schema(
  {
    uesr: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    date: Date,
    status: String,
  },
  { timestamps: true }
);

const MailInfo = model("MailInfo", mailInfoSchema);

module.exports = MailInfo;
