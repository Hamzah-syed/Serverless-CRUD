import React, {  useEffect,useState } from "react"
import {  Formik, Form, ErrorMessage, Field } from 'formik';
import TextField from '@material-ui/core/TextField';


export default function Home() {
  const [data, setData] = useState()
  const [messages, setmessages] = useState()
  const [updateData,setUpdateData] = useState()
  const [isUpdating,setIsUpdating] = useState(false)
  const[isloading,setIsLoading] = useState(false)

  useEffect(() => {
    (async() => {
      await fetch("/.netlify/functions/todos-read-all").then((res) => res.json()).then((data) => {
        setmessages(data)
     
      })
    })()
  },[data,setmessages,isUpdating])
  
 

 const handleDelete = (id) => {
  console.log(id)
 }
 const handleUpdate = (id) => {
  const msgUpdate = messages.find(msg => (
    msg.ref["@ref"].id === id
  ))
  setIsUpdating(true)
  setUpdateData(msgUpdate)
  

 }


  return (
    <div>
      <Formik
      enableReinitialize = {true}
       initialValues={ {
            id:!updateData?"":updateData.ref["@ref"].id,
            message: !updateData?"":updateData.data.message,  
        }} 
        onSubmit={(values)=>{
          if (!isUpdating) {
            
              fetch(`/.netlify/functions/todos-create`, {
                method: 'post',
                body: JSON.stringify(values)
              })
            .then(response => response.json())
            .then(data => {
              setData(data);
              console.log(data)
              
            });
          }
        else{
          setIsLoading(true)
            fetch(`/.netlify/functions/todos-update`,{
            method:'put',
            body: JSON.stringify(values)
    
  }).then(res => res.json()).then(data => {
    console.log(data.message)
    setIsUpdating(false)
    setUpdateData(undefined)
    setIsLoading(false)
    setmessages()
  })
        }

        }}  >
        {
          (formik)=>(
          

                <Form onSubmit={formik.handleSubmit}>
                <div>
                    <Field type="text" as={TextField} variant="outlined" label="Name::"  name="message"  id="message" />
                    <ErrorMessage name="message" render={(msg)=>(
                        <span style={{color:"red"}}>{msg}</span>
                    )} />
                </div>
               
                <div>
                    <button type="submit">{isUpdating?"Update":"Add"}</button>
                </div>
            </Form>


            )
        }


    </Formik>
<div>
{
  isloading ? 
<h1>loading..</h1>:
null
}
{!messages ?"loading" : messages.map((msg) => (
  <div  key={msg.ref["@ref"].id}>

    <h1>{msg.data.message}</h1>
    <button onClick = {() => handleDelete(msg.ref['@ref'].id)}>
      Delete
    </button>
    <button onClick = {() => handleUpdate(msg.ref['@ref'].id)}>
      Edit
    </button>
  </div>
))}</div>
    </div>
  )
}
