import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  color: yup
    .string()
    .length(7)
    .matches(/^#[a-fA-F0-9]{6}$/, 'Invalid color')
    .required('A color is required'),
});
