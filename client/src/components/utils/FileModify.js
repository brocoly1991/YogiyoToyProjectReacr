import React, { useState, useEffect } from 'react'
import Dropzone from 'react-dropzone'
import { useDispatch} from "react-redux";
import { Icon ,Button} from 'antd';
import axios from 'axios';
import { modifyMenuInfo } from '../../_actions/menu_action';

function FileModify(props) {
    const dispatch = useDispatch();
    const [Images, setImages] = useState([])

    useEffect(() => {
        setImages(props.img)
    }, [])
    
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
        //props.refreshFunction(newImages)
    }

    const modifyImgHandler = ()=>{

        let body ={
            images  : Images,
            _id : props.menuId,
            type : 'img'
         }

         dispatch(modifyMenuInfo(body))
         .then(response => {
            if (response.payload.success) {
                alert('정보 저장에 성공 했습니다.')
                props.refreshFunction(response.payload.menu)
            }else{
                alert('정보 저장에 실패 했습니다.')
            } 
        })
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
            <div>
                <br></br>
                <Button style={{width:'50%'}} onClick={modifyImgHandler}>이미지수정</Button>
            </div>
            
                        
        </div>
    )
}

export default FileModify
