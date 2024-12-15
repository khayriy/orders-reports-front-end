/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from "yup";

const addShipSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[ء-ي\s]+$/, "اكتب اسم المسئول  بالعربي فقط ")
    .min(3, "هذا الاسم صغير")
    .max(50, "السم كبير")
    .required("السم مطلوب"),
    price: Yup.string().required("سعر الطلب مطلوب"),
  phone: Yup.string()
    .min(11, "لابد ان يكون رقم الهاتف 11 رقم")
    .max(11, "لابد ان يكون رقم الهاتف 11 رقم")
    .required("رقم الهاتف مطلوب")
    .test("startWith", "لابد ان يبدأ رقم الهاتف ب 011  أو 012 أو 010 أو 015", (value) => {
      return (
        value.startsWith("010") ||
        value.startsWith("011") ||
        value.startsWith("012") ||
        value.startsWith("015")
      );
    }),
   

});

export const yupSync = {
    async validator({ field  }: any, value: any) {
      await addShipSchema.validateSyncAt(field, { [field]: value });
    },
  };

export default addShipSchema;
