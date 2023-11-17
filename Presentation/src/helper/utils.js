// utils.js
import moment from "moment";
import "moment/locale/tr";

export const dateFormatter = (date) => {
  return moment(date).format("YYYY-MM-DD HH:MM:SS");
};

export const dateFormatter2 = (date) => {
  return moment(date).format("YYYY-MM-DD");
};