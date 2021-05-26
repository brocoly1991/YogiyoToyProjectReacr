import React, { useEffect,useState } from 'react'
import { Form, Input} from 'antd';
import { useDispatch  } from 'react-redux';
import FileUpload from '../../utils/FileUpload'
import SaveMenuGroupModal from './SaveMenuGroupModal.js'
import { getUserInfo } from '../../../_actions/user_actions';
import { getMenuGroupItems } from '../../../_actions/menu_action';
import NumberFormat from 'react-number-format';
import Axios from 'axios';

const { TextArea } = Input;

function SaveMenuPage(props) {
    const _id = localStorage.getItem("userId")
    const dispatch = useDispatch();
    const [Continents, setContinents] = useState([])
    const [busNumber, setbusNumber] = useState()
    const [visible, setVisible] = useState(false);
    let contList = [] 
    /*=========이미등록되어진 메뉴그룹이 있다면 해당 정보를 가져오는 함수=========*/
    useEffect(() => {

        if(props.location.state  == undefined){
            dispatch(getUserInfo(_id)).then( response => 
                getUserFunk(response.payload.userInfo.BusinessNumber )
            )  
            const getUserFunk=(value)=>{
                groupFuck(value) 
            }
        }else{  
            groupFuck(props.location.state.BusinessNumber)          
        }
    }, [Continents])
   
    const groupFuck = (value) =>{
        dispatch(getMenuGroupItems(value)).then(response => {
            if (response.payload.success) {
               
               response.payload.menuGroup.map(item => {
                contList.push({
                        key: item._id,
                        value: item.MenuGropName
                    })
                })
                setContinents(contList)
                setbusNumber(value)
            } else {
                alert('실패')
            }
        })
    }
    /* ================================================================== */
   
    
    /* =============메뉴그룹 추가시 모달창  SaveMenuGroupModal컴퍼넌트에서 해당등록 로직확인============== */
    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };
    /* ==================================================== */

    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState()
    const [Continent, setContinent] = useState(1)
    const [Images, setImages] = useState([])
    
    /* =========이름 / 설명 / 가격 /메뉴그룹 셋팅 changeHandler ==============*/
    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)
    }

    const descriptionChangeHandler = (event) => {
        setDescription(event.currentTarget.value)
    }

    const priceChangeHandler = (val) => {
        setPrice(val.floatValue)
    }

    const continentChangeHandler = (event) => {
        if(event.currentTarget.value === '100'){
            setVisible(true)        
        }else{
            setContinent(event.currentTarget.value)
        }
        
    }
    /* ======================================================================= */

    // FileUpload 컴퍼넌트에서 리턴받은 image 정보를 셋팅
    const updateImages = (newImages) => {
        setImages(newImages)
    }
    /* ==================================메뉴등록 함수=================================*/ 
    const submitHandler = (event) => {

        event.preventDefault();

        if(!Title){
            return alert("이름을 입력하여 주세요")
        }
        if(!Description){
            return alert("설명을 입력하여 주세요")
        }
        if(!Price){
            return alert("가격을 입력하여 주세요")
        }
        if(Continent === 1 || Continent === '0'){
            return alert("메뉴그룹을 선택하여 주세요")
        }

        //서버에 채운 값들을 request로 보낸다.
        const body = {
            //로그인 된 사람의 ID 
            writer: props.user.userData._id,
            title: Title,
            description: Description,
            price: Price,
            images: Images,
            MenuGroup: Continent,
            BusinessNumber : busNumber
        }

        Axios.post('/api/menus/insert', body)
            .then(response => {
                if (response.data.success) {
                    alert('상품 업로드에 성공 했습니다.')
                    props.history.push('/AdminPage')
                } else {
                    alert('상품 업로드에 실패 했습니다.')
                }
            })

    }
    /*======================================================================== */

    return (
        <div>
            <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <br></br>
                    <h2> 메뉴 상품 업로드</h2>
                    <hr></hr>
                </div>

                <Form onSubmit={submitHandler}>
                    {/* DropZone */}
                    
                    <FileUpload refreshFunction={updateImages} />
                    
                    <br />
                    <br />
                    <label>이름</label><br />
                    <input onChange={titleChangeHandler} value={Title} style={{width:'100%',border:'1px solid #beb9b9bd',height:30}}/>
                    <br />
                    <br />
                    <label>설명</label><br />
                    <textarea onChange={descriptionChangeHandler} value={Description} style={{width:'100%',border:'1px solid #beb9b9bd',height:30}}/>
                    <br />
                    <br />
                    <label>가격</label>
                    <br />
                    <NumberFormat 
                        value={Price}
                        onValueChange={priceChangeHandler}
                        thousandSeparator={true} 
                        style={{width:'100%',border:'1px solid #beb9b9bd',height:30}}
                    />
                    <br />
                    <br />

                    <label>메뉴그룹</label>
                    <br></br>
                    <select onChange={continentChangeHandler} value={Continent} style={{width:'40%'}}>
                        <option key='0' value='0'>메뉴그룹을 선택하여 주세요</option>
                            
                            {Continents.map(item => (
                                <option key={item.key} value={item.key}> {item.value}</option>   
                            ))}
                        <option key='100' value='100' style={{color:'red'}}> 메뉴 그룹 추가</option>  
                    </select>


                    <br />
                    <br />
                    <button type="submit">
                        확인
                    </button>
                </Form>

                <SaveMenuGroupModal 
                    visible={visible} 
                    onOk={handleOk} 
                    onCancel={handleCancel}
                    props = {props}
                />                 
            </div>
        </div>
    )
}

export default SaveMenuPage
