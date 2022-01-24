import { Formik, FormikHelpers } from 'formik';
import type { NextPage } from 'next';
import React from 'react';
import styled from 'styled-components';

import Button from '../../src/components/Button';
import ColorListItem from '../../src/components/ColorListItem';
import Column from '../../src/components/Column';
import Loader from '../../src/components/Loader';
import Row from '../../src/components/Row';
import Spacer from '../../src/components/Spacer';
import TextInput from '../../src/components/TextInput';
import Typography from '../../src/components/Typography';
import { useColorContract } from '../../src/hooks/useColorContract';
import { validationSchema } from './validation';

const Container = styled(Column)`
  flex: 1 1 auto;
  padding: 0 16px;
`;

const FormContainer = styled(Column)`
  width: 400px;
  @media screen and (max-width: 800px) {
    padding: 16px;
    width: calc(100% - 32px);
  }
`;

const ColorContainer = styled(Row)`
  flex-wrap: wrap;
`;

type FormValues = {
  color: string;
};

const initialValues: FormValues = {
  color: '',
};

const Desktop: NextPage = () => {
  const { colors, mintColor, loading } = useColorContract();

  const submit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    const { color } = values;
    await mintColor(color);
    resetForm();
  };

  return (
    <Container alignItems="center">
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={submit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <FormContainer alignItems="center">
            <TextInput
              onChange={handleChange('color')}
              onBlur={handleBlur('color')}
              value={values.color}
              placeholder="#000000"
              fullWidth
            />
            {errors.color && (
              <>
                <Spacer height={4} />
                <Typography as="p" color="red">
                  {errors.color}
                </Typography>
              </>
            )}
            <Spacer height={16} />
            {loading ? (
              <Loader />
            ) : (
              <Button
                onClick={handleSubmit as () => void}
                type="submit"
                fullWidth
              >
                Mint
              </Button>
            )}
          </FormContainer>
        )}
      </Formik>
      <Spacer height={24} />
      <ColorContainer alignItems="center" fullWidth>
        {colors.map((color, index) => (
          <ColorListItem key={index} color={color} />
        ))}
      </ColorContainer>
    </Container>
  );
};

export default Desktop;
