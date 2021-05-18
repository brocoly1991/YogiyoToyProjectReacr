import React , { useState } from "react";
import moment from "moment";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import './RegisterPage.css';
import "antd/dist/antd.css";
import {Radio,Form,Input,Button} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const formItemLayoutRadio = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const StyleButton = {
  backgrounColor: 'red',
  color : 'black'
}

function RegisterPage(props) {


const [RadioValue, setRadioValue] = useState(0)

const regex = /^[0-9\b -]{0,13}$/;    

const radioChangeHandler = (values) => {
  setRadioValue(values.target.value)
}


const phoneRegExp = /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/

  const dispatch = useDispatch();
  return (

    <Formik
      initialValues={{
        email: '',
        hpNumner: '',
        name: '',
        password: '',
        confirmPassword: ''
      }}

      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('Name is required'),
        hpNumner: Yup.string()
          .matches(phoneRegExp, 'Phone number is not valid')
          .min(10, 'Password must be at least 6 characters')
          .max(11, 'Password must be at least 6 characters')
          .required('hp is required'),
        email: Yup.string()
          .email('Email is invalid')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], 'Passwords must match')
          .required('Confirm Password is required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {

          let dataToSubmit = {
            email: values.email,
            password: values.password,
            name: values.name,
            hpNumner: values.hpNumner,
            role: RadioValue,
            image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
          };
          dispatch(registerUser(dataToSubmit)).then(response => {
            if (response.payload.success) {
              props.history.push("/login");
            } else {
              alert(response.payload.err.errmsg)
            }
          })

          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;

        return (
          <div className="app">
            <h2>Sign up</h2>
            <Form style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit} >

              <Form.Item required label="이메일주소" hasFeedback validateStatus={errors.email && touched.email ? "error" : 'success'}>
                <Input
                  id="email"
                  placeholder="Enter your Email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.email && touched.email ? 'text-input error' : 'text-input'
                  }
                />
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </Form.Item>

              <Form.Item required label="비밀번호" hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? 'text-input error' : 'text-input'
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>

              <Form.Item required label="비밀번호 확인" hasFeedback>
                <Input
                  id="confirmPassword"
                  placeholder="Enter your confirmPassword"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="input-feedback">{errors.confirmPassword}</div>
                )}
              </Form.Item>

              <Form.Item required label="닉네임">
                <Input
                  id="name"
                  placeholder="Enter your name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.name && touched.name ? 'text-input error' : 'text-input'
                  }
                />
                {errors.name && touched.name && (
                  <div className="input-feedback">{errors.name}</div>
                )}
              </Form.Item>

              <Form.Item required label="휴대폰번호">
                <Input
                  id="hpNumner"
                  placeholder="Enter your Last Name"
                  type="number"
                  value={values.hpNumner}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.hpNumner && touched.hpNumner ? 'text-input error' : 'text-input'
                  }
                />
                {errors.hpNumner && touched.hpNumner && (
                  <div className="input-feedback">{errors.hpNumner}</div>
                )}
              </Form.Item>

              <Form.Item required label="회원가입 유형"  {...formItemLayoutRadio}>      
                <Radio.Group 
                  defaultValue = '0'
                  buttonStyle="solid" style={{color:'black'}}
                  onChange={radioChangeHandler}  
                >
                  <Radio.Button  value="0">일반회원가입</Radio.Button>
                  <Radio.Button  value="1">사장님회원가입</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};


export default RegisterPage
