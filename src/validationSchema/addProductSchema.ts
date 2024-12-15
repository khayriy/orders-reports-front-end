/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from "yup";

const addProductSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[ء-ي\s]+$/, "اكتب اسم المنتج  بالعربي فقط ")
    .min(3, "هذا الاسم صغير")
    .max(50, "السم كبير")
    .required("السم مطلوب"),

 subName : Yup.string()
 .matches(/^[ء-ي\s]+$/, "اكتب الاسم الفرعي للمنتج بالعربي فقط ")
 .min(3, "هذا الاسم صغير")
 .max(50, "السم كبير")
   
  
});

export const yupSync = {
    async validator({ field  }: any, value: any) {
      await addProductSchema.validateSyncAt(field, { [field]: value });
    },
  };

export default addProductSchema;
