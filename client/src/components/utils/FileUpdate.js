import React, { useState, useEffect } from 'react'
import Dropzone from 'react-dropzone'

import { Icon ,Button} from 'antd';
import axios from 'axios';

function FileUpdate(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {
        setImages(props.img)
    }, [props.img])

    const dropHandler = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/fomr-data' }
        }
        formData.append("file", files[0])

        axios.post('/api/product/image', formData, config)
            .then(response => {
                if (response.data.success) {
                    setImages([...Images, response.data.filePath])
                    // props.refreshFunction([...Images, response.data.filePath])
                    props.refreshImg([...Images, response.data.filePath])
                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }


    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image);
        let newImages = [...Images]
        newImages.splice(currentIndex, 1)
        setImages(newImages)
        props.refreshImg(newImages)
        //props.refreshFunction(newImages)
    }


    return (
        <div>

                <Dropzone onDrop={dropHandler}>
                    {({ getRootProps, getInputProps }) => (
                        <div
                            style={{
                                width: 470, height: 140, border: '1px solid lightgray',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: '3rem' }} />
                        </div>
                    )}
                </Dropzone>

                <div style={{ display: 'flex', width: '470px', height: '240px', overflowX: 'scroll' }}>
                {Images.map((image, index) => (
                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                            src={`http://localhost:5000/${image}`}
                        />
                    </div>
                ))}
                </div>

           

        </div>
    )
}

export default FileUpdate
