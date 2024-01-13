/* eslint-disable react/jsx-key */
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
  useGetCampaignQuery,
  useSendMailMutation,
} from "../../../app/features/campaign/campaignApi";
import DashboardLayout from "../../../components/shared/DashboardLayout";
import Table from "../../../components/shared/Table";
import Button from "../../../components/ui/Button";

const CreditCardSinglePage = () => {
  const { id } = useParams();

  const [selectedItems, setSelectedItems] = useState([]);

  // get credit card campaign
  const { data: campaign } = useGetCampaignQuery(id);

  // select item handler
  const selectItemHandler = (id, type = "single") => {
    const { creditCards } = campaign || {};

    if (type === "single") {
      let haveItem;
      const selectedItemsUpdated = selectedItems?.filter((item) => {
        if (item !== id) {
          return true;
        } else {
          haveItem = true;
          return false;
        }
      });

      if (haveItem) {
        setSelectedItems(selectedItemsUpdated);
      } else {
        setSelectedItems([...selectedItems, id]);
      }
    } else {
      if (selectedItems?.length === campaign?.creditCards?.length) {
        setSelectedItems([]);
      } else {
        const items = creditCards?.map((item) => item?._id);
        setSelectedItems(items);
      }
    }
  };

  // send mail
  const [sendMail, { data, isLoading, isError }] = useSendMailMutation();

  useEffect(() => {
    if (!isLoading && isError) {
      toast.error("Something went wrong!!");
    }
    if (!isLoading && data?.success) {
      toast.success("Send Mail Successfully.");
    }
  }, [data, isError, isLoading]);
  return (
    <DashboardLayout>
      <Table
        headers={[
          <input
            checked={selectedItems?.length === campaign?.creditCards?.length}
            onClick={() => selectItemHandler("", "")}
            type="checkbox"
          />,
          "No.",
          "Name",
          "Date",
        ]}
        cols="grid-cols-4"
        button={
          <Button
            onClick={() => {
              if (selectedItems?.length === 0) {
                toast.error("Please select Items");
              } else {
                sendMail({ data: selectedItems, type: "credit-card" });
              }
            }}
            loading={isLoading}
          >
            Send Mail
          </Button>
        }
      >
        {campaign?.creditCards?.map((creditCard, idx) => (
          <>
            <div className="py-3 pl-4">
              <input
                onClick={() => selectItemHandler(creditCard?._id)}
                checked={selectedItems?.includes(creditCard?._id)}
                type="checkbox"
              />
            </div>
            <span className="py-3">{idx + 1}</span>
            <span className="py-3">{creditCard?.custName}</span>
            <span className="py-3">
              {moment(new Date(campaign?.date)).format("MMM Do YY")}
            </span>
          </>
        ))}
      </Table>
    </DashboardLayout>
  );
};

export default CreditCardSinglePage;
