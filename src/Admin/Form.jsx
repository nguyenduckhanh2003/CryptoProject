import { Box, Button, FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Admin/Header";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values) => {
    console.log("Sending values to API:", values);
    try {
      const response = await fetch('http://localhost:8000/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        credentials: 'include',
        body: JSON.stringify(values),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error('Failed to add account');
      }

      const data = await response.json();
      if (data.details) {
        console.log("API response data:", data.details);
        window.alert("User already exists");
      } else{
        console.log('Account added successfully:', data);
        setTimeout(() => {
          window.location.href = "/admin/users";
          window.alert("Account added successfully");
        },1000)
      }
      
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <Formik
        onSubmit={(values) => {
          console.log("Form values:", values);
          handleFormSubmit(values);
        }}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl component="fieldset" sx={{ gridColumn: "span 4" }} error={Boolean(touched.gender && errors.gender)}>
                <FormLabel component="legend" sx={{ textAlign: "left" }}>Gender</FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="gender"
                  value={values.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel value="MALE" control={<Radio />} label="MALE" />
                  <FormControlLabel value="FEMALE" control={<Radio />} label="FEMALE" />
                </RadioGroup>
                {touched.gender && errors.gender && (
                  <FormHelperText>{errors.gender}</FormHelperText>
                )}
              </FormControl>
              <FormControl component="fieldset" sx={{ gridColumn: "span 4" }} error={Boolean(touched.role && errors.role)}>
                <FormLabel component="legend" sx={{ textAlign: "left" }}>Role</FormLabel>
                <RadioGroup
                  aria-label="role"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ display: "flex", flexDirection: "row" }}
                >
                  <FormControlLabel value="FOLLOWER" control={<Radio />} label="FOLLOWER" />
                  <FormControlLabel value="ADVERTISER" control={<Radio />} label="ADVERTISER" />
                </RadioGroup>
                {touched.role && errors.role && (
                  <FormHelperText>{errors.role}</FormHelperText>
                )}
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
              />
              <Box gridColumn="span 4" display="flex" justifyContent="space-between">
                <Button type="submit" color="secondary" variant="contained">
                  Create New User
                </Button>
                <Button type="button" color="primary" variant="contained">
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,23}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  gender: yup.string().required("required"),
  role: yup.string().required("required"),
  password: yup.string().matches(regexPassword, "invalid password").required("required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  role: "",
  password: "",
};

export default Form;
