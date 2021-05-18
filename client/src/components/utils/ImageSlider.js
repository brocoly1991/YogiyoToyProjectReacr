import React from 'react'
import { Icon, Col, Card, Row, Carousel } from 'antd';

function ImageSlider(props) {
    return (
        <div>
            <Carousel autoplay dotPosition='none'>
                {props.images.map((image, index) => (
                    <div key={index}>
                        <img style={{ maxHeight: '300px' ,height:'100px',float:'right' ,border:'1px solid'}}
                            src={`http://localhost:5000/${image}`} />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}


export default ImageSlider
