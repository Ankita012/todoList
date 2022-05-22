import { useState, useEffect } from 'react';
import { db} from './firebase-config';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where} from 'firebase/firestore';
import { AddCircleOutlineRounded, DeleteOutlineRounded,InsertComment, Edit, InsertDriveFile } from '@material-ui/icons';
import { Button, Grid, Checkbox, Typography, TextField, Container, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Dialog, DialogContent, DialogActions } from '@material-ui/core';
import './TodoDashboard.css';

function TodoDashboard({ user }) {
  const [newNote, setNewNote] = useState('')
  const [notes, setNotes] = useState([]);
  const [commentsArray, setCommentsArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [fileAttachOpen, setFileAttachOpen] = useState(false);
  const [updateNote, setUpdate] = useState('');
  const [toUpdateId, setToUpdateId] = useState('')
  const [date, setDate] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [userSignnedIn, setUserSignIn] = useState('')
  const [comment, setComment] = useState('');
  const [fileUrl, setFileUrl] = useState(null)
  const [fileName, setFileName] = useState('')
  const usersCollectionRef = collection(db,"users")

  var today = new Date().toISOString().substring(0,16);

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserSignIn(user.email)
      } else {
        setIsLoaded(false);
      }
  });

  //Read todo list
  useEffect(()=>{
    console.log("Dashboard")
    console.log("user.email",userSignnedIn)
      if(userSignnedIn) {
        try {
          const queryStm = query(usersCollectionRef, where("email", "==",userSignnedIn))
          const getUsers = async () => {
            const querySnapshot = await getDocs(queryStm);
            setIsLoaded(true);
            setNotes(querySnapshot.docs.map((doc) => (
              {...doc.data(), id:doc.id}
            )));
          }
          getUsers()
        }
        catch(error){
          console.log("error",error)
        }
      }
      else{
        setIsLoaded(false);
      }
      getUsers() 
  },[userSignnedIn])

  const getUsers = async () => {
    if(userSignnedIn) {
      const queryStm = query(usersCollectionRef, where("email", "==", userSignnedIn))
      const data = await getDocs(queryStm)
      setNotes(data.docs.map((doc) => (
        {...doc.data(), id:doc.id}
      )));
    }
  }

  //Create todo list
  const saveNote = async (event) => {
    event.preventDefault(); //stop refresh
    
    if(newNote==='' || newNote.match(/^\s+$/)) {
      alert('Empty/BlankSpace are not allowed!!')
    }
    else {
      await addDoc(usersCollectionRef, {
        note:newNote,
        email:userSignnedIn,
        deadline:'',
        complete: false,
        comments: [],
        fileUrl:'',
        fileName:''
      });
      setNewNote('')
      getUsers()
    }
  };

  //Update todo list
  const editNote = async () => {
    const userNote = doc(db,"users",toUpdateId)
    if(updateNote || date) {
      await updateDoc(userNote, {note:updateNote,deadline:date})
      setOpen(false)
      setFileAttachOpen(false)
      alert('Update Successfully!!')
    } 
    else {
      alert('Empty Field!!')
    }  
    getUsers()
  }

  //Delete todo list
  const deleteNote = async (id) => {
    const userNote = doc(db,"users",id)
    await deleteDoc(userNote)
    getUsers()
  }

  //Modal Open
  const openUpdateDialog = (todo) => {
    setOpen(true);
    setToUpdateId(todo.id);
    setUpdate(todo.note);
    setDate(todo.deadline);
    setComment(todo.comment);
  }

  //Modal Close
  const handleClose = () => {
    setOpen(false);
  };

  //Comment Modal Open
  const openCommentDialog = (todo) => {
    setCommentOpen(true)
    setToUpdateId(todo.id)
    setCommentsArray(todo.comments)
  }

  //Comment Modal Close
  const commentClose = () => {
    setCommentOpen(false);
  };
  //Adding Comments
  const addComments = async () => {
    if(comment) {
      const userNote = doc(db,"users",toUpdateId)
      commentsArray.push(comment)
      await updateDoc(userNote, {comments:commentsArray})
      setCommentOpen(false);
      setComment('')
    }
    else {
      alert("Empty Field!!")
    }
    getUsers()
  }

  //Task Completion
  const taskCompleted = async (id, done) => {
    const userNote = doc(db,"users",id)
    var taskComplete = {complete:!done}
    await updateDoc(userNote, taskComplete)
    getUsers()
  }

  //File modal open
  const openFileDialog = (todo) => {
    setFileAttachOpen(true)
    setToUpdateId(todo.id)
    // setCurrentFile(todo.fileUrl)
    setFileUrl(todo.fileUrl)
    setFileName(todo.fileName)
  } 

  //File Modal Close
  const closeFileDialog = () => {
    setFileAttachOpen(false)
  } 
  
  //uploading file and getting URL
  const onFileChange = async (e) => {
    const file = e.target.files[0]
    const storage = getStorage()
    const fileRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(fileRef)
    try{
      await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        setFileUrl(downloadURL)
        console.log("file.name",file.name)
        setFileName(file.name)
        console.log("File upload Successfully!!")
      });
    }catch(error){
      alert('File not uploaded.Please Try again!!')
    }
  }
  
  //File Attach
  const fileAttach = async()=>{
    const userNote = doc(db,"users",toUpdateId)
    if(fileUrl) {
      await updateDoc(userNote, {fileUrl:fileUrl,fileName:fileName})
      setFileAttachOpen(false)
      alert('File Attach Successfully!!')
    } 
    else {
      alert('No File Attached!!')
    }  
    getUsers()
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">
        <Container maxWidth="sm">
          <h1>Todo List</h1>

          <form noValidate>
              <TextField variant="outlined" margin="normal" label="Enter ToDo Item"  autoFocus autoComplete="off"
                inputProps={{ maxLength: 50 }} value={newNote} onChange={(event)=>{setNewNote(event.target.value)}}
                helperText={`${newNote.length}/50`} required fullWidth/>
              
              <Button type="submit" variant="contained" color="primary" fullWidth onClick={saveNote}
              disabled = {!newNote} startIcon={<AddCircleOutlineRounded />}> Add Todo </Button>
          </form>
          </Container>

      <Container maxWidth="md" className='list-container'>

          <List dense={true}>
            {notes.map(note => (
              <ListItem key={note.id} >
                <Checkbox checked={note.complete} inputProps={{ 'aria-label': 'controlled' }}
                  onChange={() => taskCompleted(note.id,note.complete)}/>

                <ListItemText primary={note.note}
                secondary= {
                  <Typography>{note.deadline}</Typography>
                }
              />
                <ListItemSecondaryAction>

                  <IconButton edge="end" aria-label="File attach" onClick={() => openFileDialog(note)}>
                    <InsertDriveFile/>
                  </IconButton>

                  <IconButton edge="end" aria-label="Comment" onClick={() => openCommentDialog(note)}>
                    <InsertComment />
                  </IconButton>

                  <IconButton edge="end" aria-label="Edit" onClick={() => openUpdateDialog(note)}>
                    <Edit />
                  </IconButton>

                  <IconButton edge="end" aria-label="delete" onClick={() => deleteNote(note.id)}>
                    <DeleteOutlineRounded />
                  </IconButton>

                </ListItemSecondaryAction>
              </ListItem>
              ))
            }
          </List>
     
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Grid container>
          <Grid item xs={12} style={{textAlign:"center"}}><h3>Update Todo List</h3></Grid>
            <Grid item xs={10}>
              <TextField autoFocus margin="normal" label="Update Todo" type="text" name="updateTodo" autoComplete="off" fullWidth
              value={updateNote} onChange={event => setUpdate(event.target.value)}/>
            </Grid>
            <Grid item xs={10} style={{marginTop: "1rem"}}>
              <TextField id="datetime-local" label="Deadline" type="datetime-local" inputProps={{ min: today }} fullWidth
               value={date} onChange={event=>setDate(event.target.value)}
              InputLabelProps={{ shrink: true }} />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className='dialog-actions'>
          <Button variant="contained" onClick={() => editNote()}> Update</Button>
          <Button onClick={handleClose} className='cancel-btn'>Cancel</Button>
        </DialogActions>

      </Dialog>

      <Dialog open={commentOpen} onClose={commentClose}>

        <DialogContent>
          <Grid container>
            <Grid item xs={12} style={{textAlign:"center"}}><h3>Add Comments</h3></Grid>
            <Grid item xs={10}>
              <TextField autoFocus margin="normal" label="Add Comments" type="text" name="addCommentsField" autoComplete="off" fullWidth
              value={comment} onChange={event => setComment(event.target.value)}/>
            </Grid>
            <Grid item xs={12} >
              {commentsArray.length > 0 && commentsArray.map(data=>(
                  <p key={data}>{data}</p>
              ))}
            </Grid>
          </Grid>  
        </DialogContent>

        <DialogActions className='dialog-actions'>
          <Button variant="contained" onClick={addComments}>Add</Button>
          <Button onClick={commentClose} className='cancel-btn'>Cancel</Button>
        </DialogActions>

      </Dialog>

      <Dialog open={fileAttachOpen} onClose={closeFileDialog}>

        <DialogContent>
          <Grid container>
            <Grid item xs={12} style={{textAlign:"center"}}><h3>Attach the File</h3></Grid>
            <Grid item xs={10} style={{marginTop: "1rem"}}>
              <TextField name="upload-file" type="file" label="FileAttach" onChange={onFileChange}/>
              <p>{fileName}</p>
            </Grid>
          </Grid>  
        </DialogContent>

        <DialogActions className='dialog-actions'>
          <Button variant="contained" onClick={fileAttach}>Upload</Button>
          <Button onClick={closeFileDialog} className='cancel-btn'>Cancel</Button>
        </DialogActions>

      </Dialog>

      </Container>
      </div>
    );
  }
}

export default TodoDashboard;
