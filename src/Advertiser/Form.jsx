import React, { useState } from "react";
import { Box, Button, TextField, FormHelperText, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Admin/Header";

const Form = () => {
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [errorMessage, setErrorMessage] = useState("");

    const handleFormSubmit = async (values, { resetForm }) => {
        console.log("Form values:", values);

        const formData = new FormData();
        formData.append("siteName", values.siteName);
        formData.append("title", values.title);
        formData.append("linkToOrigin", values.link);
        formData.append("startDate", values.startDate);
        formData.append("endDate", values.endDate);
        formData.append("priority", values.priority);
        formData.append("file", values.file);

        try {
            const response = await fetch(
                "http://localhost:8000/api/v1/advertisement/create-advertisement",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            console.log("API response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 400 && errorText.includes("Start date cannot later than end date")) {
                    throw new Error("End date must be at least two days after start date.");
                }
                throw new Error(`Failed to add account: ${response.statusText}. ${errorText}`);
            }

            const data = await response.json();
            if (data.details) {
                console.log("API response data:", data.details);
                window.alert("User already exists");
            } else {
                console.log("Advertisement added successfully:", data);
                window.alert("Advertisement added successfully");
                // Clear the error message after successful submission
                setErrorMessage("");
                // Reset form values
                resetForm();
            }
        } catch (error) {
            console.error("Error adding account:", error);
            setErrorMessage(error.message);
        }
    };

    const validationSchema = yup.object().shape({
        siteName: yup
            .string()
            .min(15, "siteName must be longer than or equal to 15 characters")
            .required("siteName should not be empty"),
        title: yup
            .string()
            .min(15, "title must be longer than or equal to 15 characters")
            .required("title should not be empty"),
        link: yup
            .string()
            .url("Invalid URL")
            .required("Link is required"),
        startDate: yup
            .date()
            .min(new Date(), "Start Date cannot be in the past")
            .required("Start Date is required"),
        endDate: yup
            .date()
            .min(
                yup.ref("startDate"),
                "End Date must be at least two days after Start Date"
            )
            .required("End Date is required")
            .typeError("End Date must be a Date instance"),
        priority: yup
            .string()
            .required("Priority is required"),
        file: yup
            .mixed()
            .required("File is required"),
    });

    const initialValues = {
        siteName: "",
        title: "",
        link: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        priority: "",
        file: null,
    };

    return (
        <Box m="20px">
            <Header title="CREATE ADVERTISEMENT" subtitle="Create a New Item" />

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    console.log("Form values:", values);
                    handleFormSubmit(values, actions);
                }}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      setFieldValue,
                      resetForm
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
                                label="Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.siteName}
                                name="siteName"
                                error={Boolean(touched.siteName && errors.siteName)}
                                helperText={touched.siteName && errors.siteName}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Title"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.title}
                                name="title"
                                error={Boolean(touched.title && errors.title)}
                                helperText={touched.title && errors.title}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="url"
                                label="Link"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.link}
                                name="link"
                                error={Boolean(touched.link && errors.link)}
                                helperText={touched.link && errors.link}
                                sx={{ gridColumn: "span 4" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="date"
                                label="Start Date"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.startDate}
                                name="startDate"
                                error={Boolean(touched.startDate && errors.startDate)}
                                helperText={touched.startDate && errors.startDate}
                                InputLabelProps={{ shrink: true }}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                type="date"
                                label="End Date"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.endDate}
                                name="endDate"
                                error={Boolean(touched.endDate && errors.endDate)}
                                helperText={touched.endDate && errors.endDate}
                                InputLabelProps={{ shrink: true }}
                                sx={{ gridColumn: "span 2" }}
                            />
                            <TextField
                                fullWidth
                                variant="filled"
                                label="Priority"
                                name="priority"
                                value={values.priority}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={Boolean(touched.priority && errors.priority)}
                                helperText={touched.priority && errors.priority}
                                sx={{ gridColumn: "span 4" }}
                            />

                            <Box gridColumn="span 4">
                                <input
                                    type="file"
                                    accept="image/*, video/*"
                                    onChange={(event) => {
                                        setFieldValue("file", event.currentTarget.files[0]);
                                    }}
                                />
                                {touched.file && errors.file && (
                                    <FormHelperText error>{errors.file}</FormHelperText>
                                )}
                            </Box>
                            <Box
                                gridColumn="span 4"
                                display="flex"
                                justifyContent="space-between"
                            >
                                <Button type="submit" color="secondary" variant="contained">
                                    Create Advertisement
                                </Button>
                                <Button type="button" color="primary" variant="contained" onClick={() => setErrorMessage("")}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                        {errorMessage && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {errorMessage}
                            </Typography>
                        )}
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default Form;
