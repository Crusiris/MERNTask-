import React, { Fragment, useContext, useState, useEffect} from 'react';
import projectContext  from '../../context/projects/projectContext';
import taskContext from '../../context/tasks/taskContext';
// @Material-UI imports
import { Grid, Button, FormControl, InputAdornment, InputLabel, OutlinedInput, Container, FormHelperText } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import useStyles from './style';

const FormTask = () => {
    const classes = useStyles();
    //Guardando el context en una constante
    const projectsContext = useContext(projectContext );

    //Extrayendo valores del context
    const {projselected} = projectsContext;

     //Destructurin del context para obtener el state de projecSelecte 
     const tasksContext = useContext(taskContext);
     const { hideFormTask, showFormTask, taskselect, addTask, errortask,  validateFormTask, getTasks, updateTask, cleanTask, formTask } = tasksContext;

     useEffect(()=>{
         if(taskselect !== null){
            saveTask(taskselect)

         }else{
            saveTask({
                name:''
            })
         }
     },[taskselect])

    //State del formulario
    const [ task, saveTask ] = useState({
        name:'',
    });
    const [helper, setHelper] = useState('');

    //extraer el nombre de tarea
    const { name } = task

    //Condicion para cuando no hay ningun proyecto seleccionado
    if(!projselected) return null;

    //Destructuring del state projselected
    const [ projectCurrent ] = projselected;

    //Leer los valores del formulario
    const handleChange = e =>{
        saveTask({
            ...task,
            [e.target.name]:e.target.value
        });
        
        setHelper('');
    }

    //Mostrar formulario de task
    const handleShowForm = () => {
        showFormTask();
    }

    //Ocultar formulario de task
    const handleCancel = () => {
        saveTask({ name: '' })
        setHelper('');
        hideFormTask();
    }

    const onSubmitTask = e =>{
        e.preventDefault();

        //validar
        if(name.trim() === ''){
            validateFormTask();
            return
        }

        //Validando que no este ninguna tarea seleccionada para editar
        if (taskselect === null){

          //agregar la nueva tarea
            task.projectcreate = projectCurrent._id; //Añadiendo id del proyecto a la tarea, para relacionar
            addTask(task);

        }else{
            updateTask(task)
            //Eliminamos la tarea seleccionada
            cleanTask();
        }

        //Obtener y filtrar las tareas del proyecto actual,pasando el id del proyecto seleccionado
       getTasks(projectCurrent._id);
        //reiniciar el form
        saveTask({
            name:''
        })
    
    }

    return ( 

        <Fragment>
            <Container className={classes.container}>
            {formTask ?
               <Grid container justify="center" direction="column" spacing={1} >
                    <Grid item>
                            <form onSubmit={onSubmitTask}>
                                <FormControl fullWidth variant="outlined" error={errortask}>
                                    <InputLabel htmlFor="outlined-adornment-password">Task's name</InputLabel>
                                    <OutlinedInput
                                        size="small"
                                        autoFocus
                                        multiline
                                        rowsMax={4}
                                        id="name-of-the-task"
                                        type='text'
                                        value={name}
                                        name="name"
                                        onChange={handleChange}
                                        autoComplete="off"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <Button type="submit">
                                                    Add
                                                    </Button>

                                            </InputAdornment>
                                        }
                                        labelWidth={90}
                                    />
                                    <FormHelperText>{helper}</FormHelperText>
                                </FormControl>
                            </form>
                    </Grid> 
                    <Grid item>
                            <Grid container justify="flex-end">

                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<CloseIcon />}
                                    onClick={handleCancel}
                                >cancel </Button>

                            </Grid>
                    </Grid>
                </Grid>
                :
                <Grid>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleShowForm}
                        >New task</Button>
                </Grid>
                }
            </Container>
        </Fragment>

        // <div className="formulario">
        //     <form
        //       onSubmit={onSubmitTask}
        //     >
        //         <div className="contenedor-input">
        //             <input
        //             type="text"
        //             className="input-text"
        //             placeholder="Nombre tarea..."
        //             name="name"
        //             value={name}
        //             onChange={handleChange}
        //             />
        //         </div>
        //         <div className="contenedor-input">
        //             <input 
        //             type="submit"
        //             className="btn btn-primario btn-submit btn-block"
        //             value={taskselect ? 'Editar Tarea ': 'Agregar Tarea'}
        //             />
        //         </div>
        //     </form>
        //     {errortask ? <p className="mensaje error"> El nombre de la tarea es obligatorio </p>:null}
        // </div>
     );
}
 
export default FormTask;