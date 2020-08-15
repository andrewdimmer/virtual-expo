import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { PageProps } from ".";
import LoginUi from "../Content/LoginUi";
import { createNewUserDatabaseObjects } from "../../Scripts/firebaseUserDatabaseCalls";

const LoginPage: React.FunctionComponent<PageProps> = ({
  setPageKey,
  setLoadingMessage,
  setNotification,
  handleLoadUserData,
  setUserMode,
  userMode,
  currentUser,
  classes,
}) => {
  const newUserCallback = (authResult: firebase.auth.UserCredential) => {
    if (authResult.user) {
      const user = authResult.user;
      setLoadingMessage("Creating Account...");
      createNewUserDatabaseObjects({
        userId: user.uid,
        displayName: user.displayName ? user.displayName : "",
        email: user.email ? user.email : "",
        photoUrl: user.photoURL ? user.photoURL : "",
      })
        .then((value) => {
          if (value) {
            setNotification({
              type: "info",
              message:
                "Almost there! Please complete the form below to finish creating your account.",
              open: true,
            });
            handleLoadUserData(user.uid);
            setPageKey("profile");
            setLoadingMessage("");
          } else {
            setNotification({
              type: "error",
              message:
                "Unable to finish creating your account. Please try again later.",
              open: true,
            });
            setPageKey("logout");
            setLoadingMessage("");
          }
        })
        .catch((err) => {
          console.log(err);
          setNotification({
            type: "error",
            message:
              "Unable to finish creating your account. Please try again later.",
            open: true,
          });
          setPageKey("logout");
          setLoadingMessage("");
        });
    } else {
      setNotification({
        type: "error",
        message:
          "Unable to finish creating your account. Please try again later.",
        open: true,
      });
    }
  };

  const existingUserCallback = (authResult: firebase.auth.UserCredential) => {
    handleLoadUserData(authResult.user?.uid ? authResult.user.uid : "");
    setPageKey("events");
    setNotification({
      type: "success",
      message: "Successfully Signed In",
      open: true,
    });
  };

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h3">
          Join or Login{" "}
          {userMode
            ? userMode === "organizer"
              ? "as an Event Organizer"
              : "as an Attendee"
            : ""}
        </Typography>
      </Container>
      {!userMode ? (
        <Fragment>
          <Button
            color={currentUser ? "inherit" : "primary"}
            fullWidth
            variant="contained"
            size="large"
            className={classes.marginedTopBottom}
            onClick={() => {
              setUserMode("attendee");
            }}
          >
            <Typography variant="h4">I'm an Attendee or Speaker</Typography>
          </Button>
          <p> </p>
          <Button
            color={currentUser ? "inherit" : "primary"}
            fullWidth
            variant="contained"
            size="large"
            className={classes.marginedTopBottom}
            onClick={() => {
              setUserMode("organizer");
            }}
          >
            <Typography variant="h4">I'm an Event Organizer</Typography>
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          <LoginUi
            allowEmailAuth={true}
            allowPhoneAuth={false}
            allowAnonymousAuth={false}
            newUserCallback={newUserCallback}
            existingUserCallback={existingUserCallback}
            classes={classes}
          />
          <Container className={classes.pageTitle}>
            <Button
              color={currentUser ? "inherit" : "primary"}
              variant="outlined"
              size="medium"
              className={classes.marginedTopBottom}
              onClick={() => {
                userMode === "organizer"
                  ? setUserMode("attendee")
                  : setUserMode("organizer");
              }}
            >
              <Typography variant="h6">
                {userMode === "organizer"
                  ? "I'm an Attendee or Speaker"
                  : "I'm an Event Organizer"}
              </Typography>
            </Button>
          </Container>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginPage;
