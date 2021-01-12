import React, { useState, useEffect } from 'react'
import { Field, Form, Formik, ErrorMessage } from "formik"
import * as yup from "yup"
import { Button, TextField, Container, Modal } from "@material-ui/core"
import style from "./Todo.module.css"
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import UpdateIcon from '@material-ui/icons/Update';



// MODAL

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            position: 'absolute',
            width: 400,
            backgroundColor: theme.palette.background.paper,
            border: '2px solid #000',
            boxShadow: theme.shadows[5],
            padding: theme.spacing(2, 4, 3),
            height : 250,
        },
       
    }),
);

const Todo = () => {
    const classes = useStyles();

    const [mydata, setData] = useState();
    const [checkFunction, setCheckFunction] = useState<boolean>()
    const [allData, setAllData] = useState([])
    const [currentId, setCurrentId] = useState(null)
    const [updateId , setUpdateId] = useState(null)


    // FOR MODAL
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Update Todo</h2>
            <TextField variant="outlined" label="Update Todo" />
            <Button style={{ marginTop: "0.50rem", marginLeft: "1rem" }} color="secondary" variant="outlined" >Update</Button>
        </div>
    );






    // get allTodos
    const getAllTodos = async () => {
        return await fetch(`.netlify/functions/getAllTodos`)
            .then((res) => res.json())
            .then((data) => {
                return data
            })
    }

    const deleteTodo = async (id: any) => {
        console.log(id)
        await fetch(`.netlify/functions/deleteTodo`, {
            method: "DELETE",
            body: JSON.stringify(id)
        })
            .then((res) => { res.json() })
            .then((data) => {
                return data
            })
            .catch(error => `error here : ${error}`)
    }

    // update todo
    const updateTodo = async (todo, id) => {
        console.log(`TODO : ${todo} |||| ID : ${id}`)
        await fetch(`.netlify/functions/updateTodo`, {
            method: "PUT",
            body: JSON.stringify({ todo, id })
        })
            .then((res) => { res.json() })
            .then((data) => {
                return data
            }).catch(err => console.log(err))

        setCurrentId(null)
    }




    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllTodos()
            console.log("DATA", data)
            setAllData(data)
            setCheckFunction(false)

        }
        fetchData()
    }, [checkFunction])







    return (
        <div>
            <Formik
                initialValues={{
                    todo: ""
                }}
                onSubmit={(values) => {
                    console.log(values)
                    fetch(`.netlify/functions/addTodo`, {
                        method: "post",
                        body: JSON.stringify(values)
                    }).then(res => res.json()).then(data => {
                        setData(data)
                    }).catch(error => console.log(error))
                    setCheckFunction(true)
                    setCurrentId("")



                }}

                validationSchema={yup.object({
                    todo: yup.string().required("required")
                })}
            >
                {(formik) => {
                    return (
                        <Form autoComplete="off" autoCapitalize="on"  >
                            <Container maxWidth="md" >

                                <div className={style.Todo_wrapper} >
                                    <div className={style.Todo_field} >

                                        <Field className={style.Todo_input} as={TextField} variant="outlined" label="Add Todo" name="todo" />
                                    </div>
                                    <div className={style.Todo_submit} >
                                        <Button className={style.Todo_button} color="primary" variant="outlined" type="submit" > Submit
                                        </Button>

                                    </div>



                                </div>
                            </Container>
                        </Form>

                    )
                }}
            </Formik>

            <ul>

                <li>{allData.map((item, i) => {
                    console.log("item", item)
                    return (
                        <Container maxWidth="sm" key={i} >
                            <div className={style.Todo_container}>

                                <div className={style.Todo_listwrapper} >

                                    <div className={style.Todo_list}>
                                        <p>{item.data.todo}</p>
                                    </div>



                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="simple-modal-title"
                                        aria-describedby="simple-modal-description"

                                    >

                                        <div style={modalStyle} className={classes.paper} >
                                            <Formik
                                                initialValues={{
                                                    todo: ""
                                                }}
                                                onSubmit={(values) => {

                                                    updateTodo(values.todo, updateId)
                                                    setCheckFunction(true)
                                                    setCurrentId(null)


                                                }}
                                                validationSchema={yup.object({
                                                    todo: yup.string().required("Required").min(4).max(20)
                                                })}
                                            >
                                                {(formik) =>
                                                (
                                                    <Form autoComplete = "off" onSubmit={formik.handleSubmit} >
                                                        <div className = {style.container} >
                                                            <h2 className = {style.title}>Update Todo</h2>
                                                            <Field
                                                                as={TextField}
                                                                variant="outlined"
                                                                name="todo"
                                                                label="Update Todo" 
                                                                
                                                                />
                                                            <ErrorMessage   name="todo" />
                                                            <Button type="submit" style={{ marginTop: "1.4rem", marginLeft: "1rem" }} color="secondary" variant="outlined"
                                                                onClick={() => {
                                                                    setCurrentId(item.ref['@ref'].id)
                                                                    setCheckFunction(true)
                                                                }}  >Update</Button>
                                                        </div>
                                                    </Form>
                                                )
                                                }

                                            </Formik>
                                        </div>


                                    </Modal>

                                    <   div className={style.Todo_buttonContainer} >

                                        <div className={style.Todo_button1} >
                                            <Button onClick={async () => {
                                                const data = await deleteTodo(item.ref['@ref'].id)
                                                setCurrentId(item.ref["@ref"].id)

                                                setCheckFunction(true)

                                            }}
                                            ><DeleteIcon />
                                            </Button>
                                        </div  >

                                        <div className={style.Todo_button2} >
                                            <Button type="submit" onClick={() => {
                                                handleOpen()
                                                setUpdateId(item.ref['@ref'].id)
                                            }}>
                                                
                                                <UpdateIcon />
                                            </Button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </Container>

                    )
                })}</li>
            </ul>



        </div>
    )
}

export default Todo
