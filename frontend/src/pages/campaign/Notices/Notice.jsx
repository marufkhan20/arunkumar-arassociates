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

const NoticeSinglePage = () => {
  const { id } = useParams();

  const [selectedItems, setSelectedItems] = useState([]);

  // get credit card campaign
  const { data: campaign } = useGetCampaignQuery(id);

  // select item handler
  const selectItemHandler = (id, type = "single") => {
    const { notices } = campaign || {};

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
      if (selectedItems?.length === campaign?.notices?.length) {
        setSelectedItems([]);
      } else {
        const items = notices?.map((item) => item?._id);
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
            checked={selectedItems?.length === campaign?.notices?.length}
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
                sendMail({ data: selectedItems, type: "notice" });
              }
            }}
            loading={isLoading}
          >
            Send Mail
          </Button>
        }
      >
        {campaign?.notices?.map((notice, idx) => (
          <>
            <div className="py-3 pl-4">
              <input
                onClick={() => selectItemHandler(notice?._id)}
                checked={selectedItems?.includes(notice?._id)}
                type="checkbox"
              />
            </div>
            <span className="py-3">{idx + 1}</span>
            <span className="py-3">{notice?.name || notice?.arqnName}</span>
            <span className="py-3">
              {moment(new Date(campaign?.date)).format("MMM Do YY")}
            </span>
          </>
        ))}
      </Table>
    </DashboardLayout>
  );
};

export default NoticeSinglePage;
