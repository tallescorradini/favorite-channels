import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import styles from "./Favorites.module.css";
import { useFavorites } from "../../contexts/favorites-context";
import { useAuth, withAuth } from "../../contexts/auth-context";
import { ButtonLink } from "../../components/ButtonLink/ButtonLink";
import { Button } from "../../components/Button/Button";

function getSortedChannelsByNotificationPresent(
  channels = [],
  notifications = []
) {
  return channels.slice().sort((currrentChannel, nextChannel) => {
    const currentHasLessNotificationsThanNext =
      notifications[currrentChannel.id]?.totalNotifications <
      notifications[nextChannel.id]?.totalNotifications;
    const currentHasMoreNotificationsThanNext =
      notifications[currrentChannel.id]?.totalNotifications >
      notifications[nextChannel.id]?.totalNotifications;

    const currentAfterNext = 1;
    const currentBeforeNext = -1;
    const sameOrder = 0;

    if (currentHasLessNotificationsThanNext) return currentAfterNext;
    if (currentHasMoreNotificationsThanNext) return currentBeforeNext;
    return sameOrder;
  });
}

function FavoritesPage() {
  const { userId, logout } = useAuth({ privateRoute: true });
  const { folders, notifications } = useFavorites();
  const { t } = useTranslation("favoritesPage");

  function handleLogout() {
    logout({ redirectUri: "/" });
  }

  return (
    <div className={styles.page}>
      <Head>
        <title>{t("My Favorites")}</title>
        <meta name="description" content={t("Favorite's pannel")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 style={{ display: "inline-block", margin: "0" }}>
          {t("My Favorites")}
        </h1>
        <ButtonLink href="/add" variant="primary">
          {t("Add Folder")}
        </ButtonLink>

        {userId ? (
          <Button onClick={handleLogout} variant="neutral">
            {t("Logout")}
          </Button>
        ) : null}
      </header>

      <main>
        {!userId ? (
          <section
            role="alert"
            className={styles.alert}
            style={{ marginTop: "2rem" }}
          >
            <p>
              {t(
                "Make sure to sign up or all progress will be lost when you leave the page."
              )}
            </p>
            <ButtonLink href="/signup" variant="secondary">
              {t("Sign Up")}
            </ButtonLink>
          </section>
        ) : null}

        {[...folders].reverse().map((folder) => (
          <section
            key={folder.name}
            className={styles.folder}
            style={{ marginTop: "6rem" }}
          >
            <header className={styles.folderHeader}>
              <h2 clasname={styles.folderTitle}>
                {folder.name !== "Uncategorized"
                  ? folder.name
                  : t("Uncategorized")}
              </h2>
              {folder.name !== "Uncategorized" ? (
                <ButtonLink href={`/edit/${folder.slug}`} variant="neutral">
                  {t("Edit")}
                </ButtonLink>
              ) : null}
            </header>

            <ul className={styles.channelList}>
              {folder.channels?.length < 1 ? (
                <li className={styles.channel}>{t("List is empty")}</li>
              ) : (
                getSortedChannelsByNotificationPresent(
                  folder.channels,
                  notifications
                ).map((channel) => (
                  <li key={channel.id} className={styles.channel}>
                    <Link href={`favorites/${channel.id}`} passHref>
                      <div>
                        <div>
                          <Image
                            src={channel.thumbnailUrl}
                            alt={t("Channel thumbnail")}
                            width="80px"
                            height="80px"
                            className={`${styles.channelImage} ${
                              !!!notifications[channel.id]?.totalNotifications
                                ? styles.fadeChannel
                                : ""
                            }`}
                          />
                          {!!notifications[channel.id]?.totalNotifications ? (
                            <span className={styles.badge}>
                              {notifications[channel.id].totalNotifications > 9
                                ? "9+"
                                : notifications[channel.id].totalNotifications}
                            </span>
                          ) : null}
                        </div>
                        <p
                          className={`${styles.channelName} ${
                            !!!notifications[channel.id]?.totalNotifications
                              ? styles.fadeChannel
                              : ""
                          }`}
                          style={{ marginTop: "0.5rem" }}
                        >
                          {channel.title}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </section>
        ))}
      </main>
    </div>
  );
}

export default withAuth({ privateRoute: true })(FavoritesPage);

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["favoritesPage"])),
  },
});
