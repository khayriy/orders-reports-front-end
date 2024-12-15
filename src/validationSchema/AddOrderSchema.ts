/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from "yup";

const addOrderSchema = Yup.object().shape({
  name: Yup.string()

    .min(3, "هذا الاسم صغير")
    .max(50, "السم كبير")
    .required("السم مطلوب"),
  price: Yup.number().required("سعر الطلب مطلوب"),
  phone: Yup.string()
    .min(11, "لابد ان يكون رقم الهاتف 11 رقم")
    .max(11, "لابد ان يكون رقم الهاتف 11 رقم")
    .required("رقم الهاتف مطلوب")
    .test(
      "startWith",
      "لابد ان يبدأ رقم الهاتف ب 011  أو 012 أو 010 أو 015",
      (value) => {
        return (
          value.startsWith("010") ||
          value.startsWith("011") ||
          value.startsWith("012") ||
          value.startsWith("015") ||
          value.startsWith("٠١١") ||
          value.startsWith("٠١٢") ||
          value.startsWith("٠١٥") ||
          value.startsWith("٠١٠")
        );
      }
    ),
  phoneT: Yup.string()
    .min(11, "لابد ان يكون رقم الهاتف 11 رقم")
    .max(11, "لابد ان يكون رقم الهاتف 11 رقم")
    .optional()
    .test(
      "startWith",
      "لابد ان يبدأ رقم الهاتف ب 011  أو 012 أو 010 أو 015",
      (value) => {
        return (
          !value ||
          value === "" ||
          value.startsWith("010") ||
          value.startsWith("011") ||
          value.startsWith("012") ||
          value.startsWith("015") ||
          value.startsWith("٠١١") ||
          value.startsWith("٠١٢") ||
          value.startsWith("٠١٥") ||
          value.startsWith("٠١٠")
        );
      }
    ),
  address: Yup.string()

    .min(8, "هذا العنوان صغير")
    .required("لابد ان تكتب العنوان التفصيلي"),
  details: Yup.string().optional(),
  city: Yup.array().required("لابد ان تختار المحافظة والمدينة"),
  ship: Yup.array().required("لابد ان تختار مسئول الشحن"),
  status: Yup.array().optional(),
});

export const yupSync = {
  async validator({ field }: any, value: any) {
    await addOrderSchema.validateSyncAt(field, { [field]: value });
  },
};

export default addOrderSchema;
