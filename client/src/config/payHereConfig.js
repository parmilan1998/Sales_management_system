import PayHere from "payhere-js-sdk";

export const initPayHere = () => {
  PayHere.init({
    merchantId: 1227883,
    sandbox: true,
  });
};
