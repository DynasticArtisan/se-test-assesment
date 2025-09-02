import React, { useEffect } from "react";
import * as Yup from "yup";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const userSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});
type SchemaType = Yup.InferType<typeof userSchema>;

interface UserCreateProps {
  open: boolean;
  onSubmit: (input: SchemaType) => void;
  onClose: () => void;
}

const UserCreateDialog: React.FC<UserCreateProps> = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SchemaType>({
    resolver: yupResolver(userSchema),
  });

  useEffect(reset, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>CREATE USER</DialogTitle>
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserCreateDialog;