import { useRouter } from "next/router";
import Head from "next/head";
import * as yup from "yup";

import styles from "./AddFolder.module.css";
import { TextField } from "../../components/TextField/TextField";
import { Button } from "../../components/Button/Button";
import useForm from "../../hooks/useForm";
import { useState } from "react";
import { useFavorites } from "../../contexts/favorites-context";
import { ButtonLink } from "../../components/ButtonLink/ButtonLink.jsx";

const formFields = {
  folderName: {
    attribute: {
      name: "folderName",
      label: "Name",
      type: "text",
    },
    initialValue: "",
    validation: yup
      .string()
      .ensure()
      .trim()
      .required("Campo obrigatório")
      .matches(/^[\w ]+$/g, "Deve conter somente letras e números"),
  },
};

export default function Add() {
  const router = useRouter();
  const { addFolder } = useFavorites();
  const { subscribe, onSubmit, values, changed, resetField } = useForm(yup);

  async function handleSubmit() {
    const folder = await addFolder(
      values[formFields.folderName.attribute.name]
    );
    router.replace(`/edit/${folder.slug}`);
  }

  return (
    <div>
      <Head>
        <title>{`Add Folder`}</title>
        <meta name="description" content="Page for editing folder details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.page}>
        <section className={styles.container}>
          <header
            className={styles.containerHeader}
            style={{ marginBottom: "3rem" }}
          >
            <ButtonLink variant="neutral" href="/favorites">{`<`}</ButtonLink>
            <h1 className={styles.title}>Add Folder</h1>
          </header>

          <form {...onSubmit(handleSubmit)}>
            <TextField
              {...subscribe(formFields.folderName)}
              style={{ marginBottom: "1rem" }}
            />

            <Button
              type="submit"
              variant="primary"
              style={{ marginTop: "1rem" }}
              fullWidth
            >
              Continue
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}