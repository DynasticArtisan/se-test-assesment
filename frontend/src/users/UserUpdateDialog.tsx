import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from "@mui/material";
import { useGetUserQuery } from "../../__generated__/graphql";

interface UserUpdateProps {
  open: boolean;
  userId: string;
  onSubmit: (input: SchemaType) => void;
  onClose: () => void;
}

const userSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

type SchemaType = Yup.InferType<typeof userSchema>;

const UserUpdateDialog: React.FC<UserUpdateProps> = ({ open, onClose, userId, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SchemaType>({
    resolver: yupResolver(userSchema),
  });
  const { data, loading } = useGetUserQuery({
    variables: { id: userId },
    skip: !userId,
  });

  useEffect(() => reset({ 
    name: data?.user.name, 
    email: data?.user.email 
  }), [data]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {
        loading 
          ? <CircularProgress/>
          : (
          <>
            <DialogTitle>UPDATE USER</DialogTitle>
            <DialogContent>
              <form id="user-form" onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 8 }}>
                <TextField
                  label="Name"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <TextField
                  label="Email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" form="user-form" variant="contained" color="primary">
                Update
              </Button>
            </DialogActions>
          </>
          )
      }
    </Dialog>
  );
};

export default UserUpdateDialog;
