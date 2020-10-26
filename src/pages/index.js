import React, { useEffect, useState } from "react"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import {
  TextField,
  makeStyles,
  withStyles,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@material-ui/core"
//css
import "../assets/css/main.css"

const useStyle = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    padding: "100px 0",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
  },
  container: {
    background: "#2d3748",
    width: "100%",
    maxWidth: "600px",
    padding: "30px",
    borderRadius: "8px",
  },
  mainHeader: {
    color: "white",
  },
  TextField: {
    width: "100%",
    color: "#cbd5e0",
  },
  conetentContainer: {
    background: "#1a202c",
    margin: "3px 0",
    borderRadius: "4px",
  },
  content: {
    color: "#a0aec0",
  },
  loader: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "10px 0",
  },
}))

const CssTextField = withStyles({
  root: {
    "& label": {
      color: "#718096",
    },

    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#718096",
      },
      "&:hover fieldset": {
        borderColor: "#a0aec0",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#f50057",
      },
    },
  },
})(TextField)

//validation scehema
const validationSchema = Yup.object().shape({
  message: Yup.string().required("Message is Required"),
})

export default function Home() {
  const classes = useStyle()
  const [data, setData] = useState()
  const [messages, setmessages] = useState()
  const [updateData, setUpdateData] = useState()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isloading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    ;(async () => {
      await fetch("/.netlify/functions/todos-read-all")
        .then(res => res.json())
        .then(data => {
          setmessages(data)
        })
    })()
  }, [data, isloading, isUpdating, isDeleting])

  const handleDelete = id => {
    console.log(JSON.stringify(id))
    setIsDeleting(true)
    fetch("/.netlify/functions/todos-delete", {
      method: "delete",
      body: JSON.stringify(id),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.message)
        setIsDeleting(false)
        setmessages(undefined)
        // setIsUpdating(false)
      })
  }
  const handleUpdate = id => {
    const msgUpdate = messages.find(msg => msg.ref["@ref"].id === id)
    setIsUpdating(true)
    setUpdateData(msgUpdate)
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Box pb={4}>
          <Typography
            align="center"
            variant="h5"
            className={classes.mainHeader}
          >
            Serverless CRUD
          </Typography>
        </Box>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={{
            id: !updateData ? "" : updateData.ref["@ref"].id,
            message: !updateData ? "" : updateData.data.message,
          }}
          onSubmit={(values, actions) => {
            if (!isUpdating) {
              setIsLoading(true)
              fetch(`/.netlify/functions/todos-create`, {
                method: "post",
                body: JSON.stringify(values),
              })
                .then(response => response.json())
                .then(data => {
                  setData(data)
                  console.log(data)
                  setIsLoading(false)
                  setmessages(undefined)
                  //resetForm
                  actions.resetForm({
                    values: {
                      id: "",
                      message: "",
                    },
                  })
                })
            } else {
              setIsLoading(true)
              fetch(`/.netlify/functions/todos-update`, {
                method: "put",
                body: JSON.stringify(values),
              })
                .then(res => res.json())
                .then(data => {
                  console.log(data.message)
                  setIsUpdating(false)
                  setUpdateData(undefined)
                  setIsLoading(false)
                  setmessages(undefined)
                })
            }
          }}
        >
          {formik => (
            <Form onSubmit={formik.handleSubmit}>
              <div>
                <Field
                  className={classes.TextField}
                  type="text"
                  as={CssTextField}
                  multiline
                  rows={4}
                  color="secondary"
                  variant="outlined"
                  label="Message"
                  name="message"
                  id="message"
                  InputProps={{
                    className: classes.TextField,
                  }}
                />
                <Box pt={1}>
                  <ErrorMessage
                    name="message"
                    render={msg => <span style={{ color: "red" }}>{msg}</span>}
                  />
                </Box>
              </div>

              <div>
                <Box mt={2}>
                  <Button
                    disableElevation
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={isloading ? true : false}
                    style={{ color: "white" }}
                  >
                    {isUpdating
                      ? isloading
                        ? "Updating..."
                        : "Update"
                      : isloading
                      ? "Adding..."
                      : "Add"}
                  </Button>
                </Box>
              </div>
            </Form>
          )}
        </Formik>
        <div>
          <Box mt={3}>
            {!messages ? (
              <div className={classes.loader}>
                <CircularProgress color="secondary" />
              </div>
            ) : (
              messages.map(msg => (
                <div
                  className={classes.conetentContainer}
                  key={msg.ref["@ref"].id}
                >
                  <Box py={2} px={3}>
                    <Typography className={classes.content}>
                      {msg.data.message}
                    </Typography>
                    <Box p={1}></Box>
                    <Button
                      style={{ margin: "0 4px 0 0px " }}
                      variant="contained"
                      color={"primary"}
                      size="small"
                      onClick={() => handleUpdate(msg.ref["@ref"].id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color={"secondary"}
                      onClick={() => handleDelete(msg.ref["@ref"].id)}
                      size="small"
                      disabled={isDeleting ? true : false}
                      style={{ color: "white" }}
                    >
                      {/* {isDeleting && msg.ref["@ref"].id ? "Deleting..." : "Delete"} */}
                      Delete
                    </Button>
                  </Box>
                </div>
              ))
            )}
          </Box>
        </div>
      </div>
    </div>
  )
}
