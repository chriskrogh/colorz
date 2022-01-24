import { Formik, FormikHelpers } from 'formik';
import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';

import Button from '../../components/Button';
import ColorListItem from '../../components/ColorListItem';
import Column from '../../components/Column';
import Loader from '../../components/Loader';
import Row from '../../components/Row';
import Spacer from '../../components/Spacer';
import TextInput from '../../components/TextInput';
import Typography from '../../components/Typography';
import { useColorContract } from '../../hooks/useColorContract';
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

const Landing: NextPage = () => {
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
    <>
      <Head>
        <title>Colorz</title>
        <meta
          name="description"
          content="Colorz is a color NFT generator. You can mint colors as NFTs to your address."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
    </>
  );
};

export default Landing;
