import { useEffect, useRef } from "react";
import React from "react";
import purchaseApi from "../api/purchase.api";

function PayPal({ schedulingDetailId, purchase }) {
  const paypal = useRef();

  useEffect(() => {
    if (window.paypal) {
      window.paypal
        .Buttons({
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "10.00", // Giá sản phẩm
                  },
                },
              ],
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(async function (details) {
              const result = await purchaseApi.approve(schedulingDetailId);
              if (result.success) {
                purchase();
              }
            });
          },
          onError: function (err) {},
        })
        .render(paypal.current);
    }
  }, []);

  return (
    <div className="mt-[20px]">
      <div ref={paypal}></div>
    </div>
  );
}

export default PayPal;
