/* eslint-disable react-hooks/exhaustive-deps */
import { Input, Form } from "antd";
import React, { useState, useEffect }from "react";

import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';

import "./CreateForm.css";
import { CloseCircleFilled, PlusOutlined } from "@ant-design/icons";

const CreateForm = ({ type, nameChange, descriptionChange, royaltyChange, supplyChange, confirmCreateItem, propertiesChange, categoryChange, confirming }) => {

  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, [categories]);

  function fetchCategories() {        
    axios.get(`/api/categories`)
    .then((res) => {            
        setCategories(res.data.categories);  
        selectCategory(res.data.categories[0].name)                   
    })
    .catch((err) => {
        console.log("err: ", err.message);
        setCategories([]);
    });
  }

  function createProperty() {
    if (properties.length < 10) {
      setProperties((props) => [...props, ["", ""]]);
      propertiesChange(properties)
    }
  }

  function selectCategory(value) {
    categoryChange(value)
    setCategory(value)  
  }

  function editProperties(propIndex, nameValIndex, newVal) {
    let props = [...properties];
    let prop = props[propIndex];
    prop[nameValIndex] = newVal;
    setProperties(props);
    propertiesChange(props)
  }

  function deleteProperty(index) {
    let props = [...properties];
    props.splice(index, 1);
    setProperties(props);
    propertiesChange(props)
  }

  return (
    <Form className="single-form">
      <Form.Item>
        <div>
          <h3>Name</h3>
          <Input onChange={nameChange} placeholder="e.g. 'Redeemable T-Shirt'" />
        </div>
      </Form.Item>
      <Form.Item>
        <h3> Description <span>(Optional)</span> </h3>
        <Input onChange={descriptionChange} placeholder="e.g. 'After purchasing you will be able to get the real T-Shirt'" />
      </Form.Item>
      <Form.Item>
        <div className="single-multiple-copy">
          <div className="royalti-input">
            <h3>Royalties</h3>
            <Input onChange={royaltyChange} type="number" placeholder="e.g. 10%" />
          </div>
          {type === "S" ? "" :
            <div className="copy-input">
              <h3>Number of copies</h3>
              <Input onChange={supplyChange} type="number" placeholder="E.g. 10" />
            </div>
          }
        </div>
      </Form.Item>
      <Form.Item>
        <h3> Select Category </h3>
        <select
          defaultValue={category}
          className="select-category"
          onChange={event => selectCategory(event.target.value)}          
        >
          {
            categories.map((categoryItem, index)=> {                             
              return ( <option value={categoryItem.name}>{categoryItem.name}</option>)               
            })
          }                             
        </select>        
      </Form.Item>

      <Form.Item>
        <h3 style={{marginTop:'10px'}}>
          Properties <span>(Optional)</span>
          <button className="property-add-button" onClick={createProperty}><PlusOutlined/></button>
        </h3> 

        {
          properties.map((value, index) => {
            return (
              <div style={{display:'flex', marginBottom:'10px', flexWrap:'nowrap'}}>
                <Input.Group className="input-group">
                  <Input value={value[0]}
                    onChange={(e) => { editProperties(index, 0, e.target.value) }}
                    placeholder="Name" />
                  <Input value={value[1]}
                    onChange={(e) => { editProperties(index, 1, e.target.value) }}
                    placeholder="Value" />       
                </Input.Group>
                <button className="property-remove-button" 
                  onClick={(e) => { deleteProperty(index) }}>
                    <CloseCircleFilled style={{fontSize: '26px'}}/>
                </button>                
              </div>
            );
          })
        }       

      </Form.Item>

      <Form.Item>
        <button className="single-form-button" onClick={confirmCreateItem} htmlType="submit">          
          {
            confirming? <CircularProgress style={{width: "16px", height: "16px", color: "white"}}/>
            :
            <> Submit </>
          }
        </button>
      </Form.Item>      
    </Form>
  );
};

export default CreateForm;
