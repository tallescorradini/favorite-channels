import Head from "next/head";
import { useRouter } from "next/router";
import useForm from "../hooks/useForm";
import * as yup from "yup";
import axios from "axios";
import { useState } from "react";

import styles from "../styles/Home.module.css";
import { Box } from "../components/Box/Box";
import { Form } from "../components/Form/Form";
import { TextField } from "../components/TextField/TextField";
import { Button } from "../components/Button/Button";
import { Alert } from "../components/Alert/Alert";

const formFields = {
  url: {
    attribute: { name: "url", label: "Url", type: "text" },
    initialValue: "",
    validation: yup
      .string()
      .required("Campo obrigatório")
      .matches(/www.youtube.com\/c/, "URL fornecida é inválida"),
  },
};

const errorMessages = {
  invalid_id: "Desculpe, não encontramos o canal informado. ",
  unknown: "Desculpe, algo deu errado. ",
};

export default function Home() {
  const router = useRouter();
  const { subscribe, onSubmit, values } = useForm(yup);
  const [showAlert, setShowAlert] = useState({ message: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const channelId = getChannelId(values.url);

    try {
      const { data } = await axios.get("/api/favorites", {
        params: { channelId: channelId },
      });

      router.push({
        pathname: "/favorites",
        query: { channelId: channelId },
      });
    } catch (error) {
      const errorCode = error.response.data?.code;

      setShowAlert({
        message: errorMessages[errorCode] || errorMessages["unknown"],
      });
    }
  }

  function getChannelId(url) {
    if (!url) return;
    const [channelId] = url.split("/").slice(-1);

    return channelId;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Favorite Channels</title>
        <meta
          name="description"
          content="Organize your favorite Youtube channels"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Organize your favorite <br />
          Youtube channels
        </h1>

        <Box style={{ width: "400px" }}>
          <h2 style={{ margin: "0 0 2rem 0" }}>
            Insert any Youtube channel URL to start
          </h2>

          {showAlert.message ? (
            <Alert
              message={showAlert.message}
              onDismiss={() => setShowAlert(false)}
              style={{ marginBottom: "2rem" }}
            />
          ) : null}

          <Form {...onSubmit(handleSubmit)}>
            <TextField {...subscribe(formFields.url)} />

            <Button variant="primary" type="submit">
              Continue
            </Button>
          </Form>
        </Box>

        {/* <Login/> */}
      </main>
    </div>
  );
}
