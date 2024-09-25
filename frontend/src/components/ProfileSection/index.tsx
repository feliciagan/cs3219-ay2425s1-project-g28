import { Avatar, Box, Button, Divider, Stack, Typography } from "@mui/material";
import React from "react";

type ProfileSectionProps = {
  firstName: string;
  lastName: string;
  username: string;
  biography?: string;
  isCurrentUser: boolean;
};

const ProfileSection: React.FC<ProfileSectionProps> = (props) => {
  const { firstName, lastName, username, biography, isCurrentUser } = props;

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={(theme) => ({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
          })}
        >
          <Avatar sx={{ width: 56, height: 56 }} />
          <Box sx={(theme) => ({ marginLeft: theme.spacing(2) })}>
            <Typography fontSize={"h6.fontSize"}>
              {firstName} {lastName}
            </Typography>
            <Typography>@{username}</Typography>
          </Box>
        </Box>
        <Typography
          sx={(theme) => ({
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
          })}
        >
          {biography}
        </Typography>
      </Box>
      {isCurrentUser && (
        <>
          <Divider />
          <Stack
            spacing={2}
            sx={(theme) => ({
              marginTop: theme.spacing(4),
              marginBottom: theme.spacing(4),
            })}
          >
            <Button variant="contained">Edit profile</Button>
            <Button variant="contained" color="secondary">
              Edit password
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default ProfileSection;