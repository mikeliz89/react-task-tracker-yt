import React from 'react'
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'

const GoBackButton = () => {
  const navigate = useNavigate();
  return (
    <Button text='Go Back' onClick={() => navigate(-1) } /> 
  )
}

export default GoBackButton