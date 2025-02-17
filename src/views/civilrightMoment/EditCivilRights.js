import React, {useState, useEffect, useCallback} from 'react';
// @material-ui/core components

import {useDropzone} from 'react-dropzone';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import GridItem from 'components/Grid/GridItem.js';
import Button from 'components/CustomButtons/Button.js';
import Card from 'components/Card/Card.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardBody from 'components/Card/CardBody.js';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import baseUrl from '../../api/baseUrl';

const styles = {
  typo: {
    paddingLeft: '25%',
    marginBottom: '40px',
    position: 'relative',
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: '10px',
    color: '#c0c1c2',
    display: 'block',
    fontWeight: '400',
    fontSize: '13px',
    lineHeight: '13px',
    left: '0',
    marginLeft: '20px',
    position: 'absolute',
    width: '260px',
  },
  cardCategoryWhite: {
    color: 'rgba(255,255,255,.62)',
    margin: '0',
    fontSize: '14px',
    marginTop: '0',
    marginBottom: '0',
  },
  cardTitleWhite: {
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
  },
};

const useStyles = makeStyles(styles);

export default function Editnews({match}) {
  const id = match.params.id;
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files

    // const reader = new FileReader();
    // reader.readAsArrayBuffer(acceptedFiles[0])
    // console.log(reader,acceptedFiles[0]);
    setSelectedFile(acceptedFiles);
    setUploadedUrl(acceptedFiles.map((file) => URL.createObjectURL(file)));
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  const classes = useStyles();

  const [title, setTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [body1, setBody1] = useState('');
  const [body2, setBody2] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState([]);

  useEffect(async () => {
    let result = await fetch(baseUrl + 'civilrights/' + id);
    result = await result.json();
    console.log(result);
    setTitle(result.data.civilRights.title);
    setIntroduction(result.data.civilRights.introduction);
    setBody1(result.data.civilRights.body1);
    setBody2(result.data.civilRights.body2);
    setSummary(result.data.civilRights.summary);
    setUploadedUrl(result.data.civilRights.photos);
  }, []);

  const history = useHistory();

  const handleUpload = (e) => {
    e.preventDefault();
    setSubmissionLoading(true);
    const token = JSON.parse(localStorage.getItem('userInfo')).token;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('introduction', introduction);
    formData.append('body1', body1);
    formData.append('body2', body2);
    selectedFile?.map((file) => formData.append('photos', file));
    formData.append('summary', summary);

    axios({
      method: 'PUT',
      url: baseUrl + 'civilrights/' + id,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        //handle success
        alert('Contents edited successfully');
        setSubmissionLoading(false);
        history.push('/admin/civilrights');
      })
      .catch(function (response) {
        //handle error
        // console.log(response);
        // console.log(response.message);
        setError(response.message);
        setSubmissionLoading(false);
      });
  };

  return (
    <Card>
      <CardHeader color="danger">
        <h4 className={classes.cardTitleWhite}>Add News Screen</h4>
        <p className={classes.cardCategoryWhite}>
          For uplaoding Published news of Hami Nepal
        </p>
        <p className={classes.cardCategoryWhite}>
          Please check the information properly before submitting as it cannot
          be manipulated again for security reasons !
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleUpload}>
          <GridItem xs={12} sm={12} md={12}>
            <TextField
              id="standard-basic"
              label="Enter the Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              required
              style={{width: '500px', margin: '30px 0'}}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <TextareaAutosize
              aria-label="minimum height"
              rowsMin={5}
              placeholder="Enter the Introduction content"
              value={introduction}
              onChange={(e) => {
                setIntroduction(e.target.value);
              }}
              required
              style={{
                width: '500px',
                margin: '30px 0',
                padding: '20px',
                fontSize: '16px',
                fontFamily: 'Roboto',
                color: 'black',
                fontWeight: '400',
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <TextareaAutosize
              aria-label="minimum height"
              rowsMin={5}
              placeholder="Enter the body content[part1]"
              value={body1}
              onChange={(e) => {
                setBody1(e.target.value);
              }}
              required
              style={{
                width: '500px',
                margin: '30px 0',
                padding: '20px',
                fontSize: '16px',
                fontFamily: 'Roboto',
                color: 'black',
                fontWeight: '400',
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <TextareaAutosize
              aria-label="minimum height"
              rowsMin={5}
              placeholder="Enter the body content[part2]"
              value={body2}
              onChange={(e) => {
                setBody2(e.target.value);
              }}
              required
              style={{
                width: '500px',
                margin: '30px 0',
                padding: '20px',
                fontSize: '16px',
                fontFamily: 'Roboto',
                color: 'black',
                fontWeight: '400',
              }}
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
            <TextareaAutosize
              aria-label="minimum height"
              rowsMin={5}
              placeholder="Enter the Summary of the content"
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
              }}
              required
              style={{
                width: '500px',
                margin: '30px 0',
                padding: '20px',
                fontSize: '16px',
                fontFamily: 'Roboto',
                color: 'black',
                fontWeight: '400',
              }}
            />
          </GridItem>
          <div></div>
          <GridItem xs={12} sm={12} md={12}>
            <h5>Please upload the content photos (at max 10)</h5>
            <div
              {...getRootProps()}
              required
              style={{
                cursor: 'pointer',
                border: '1px solid gray',
                padding: '20px',
                marginBottom: '20px',
                minHeight: '200px',
              }}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the cover photo here or...</p>
              ) : (
                <p>
                  Drag 'n' drop a cover photo here, or click to select cover
                  photo
                </p>
              )}

              <div style={{display: 'flex', gap: '1rem'}}>
                {uploadedUrl.length &&
                  uploadedUrl.map((url) => (
                    <img src={url} style={{height: '80px'}} />
                  ))}
              </div>
            </div>
          </GridItem>
          {error ? (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              Something bad happened — <strong>{error}</strong>
              <br></br>
            </Alert>
          ) : (
            ''
          )}
          <GridItem xs={12} sm={12} md={4}>
            {submissionLoading ? (
              <CircularProgress />
            ) : (
              <Button color="danger" type="submit">
                Update
              </Button>
            )}
          </GridItem>
        </form>
      </CardBody>
    </Card>
  );
}
