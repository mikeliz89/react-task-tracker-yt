import React, {useState} from 'react'
import GoBackButton from '../GoBackButton'
import { useTranslation } from 'react-i18next';
import { Form, Table } from 'react-bootstrap';
import Button from '../Button';

const BmiCalculator = () => {

  const { t } = useTranslation();

  //states
  const [BMI, setBMI] = useState(0)
  const [weight, setWeight] = useState(0)
  const [height, setHeight] = useState(0)
    
  async function onSubmit(e) {
    e.preventDefault()

    let BMITemp = 0;
    let heightInMeters = height / 100;
    BMITemp = weight / (heightInMeters * heightInMeters);
    let BMIRounded = Math.round(BMITemp*10)/10;
    setBMI(BMIRounded);
  }

  return (
    <div>
        <h3 className="page-title">{t('bmi_calculator_title')}</h3>
        <GoBackButton />
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addTaskFormTaskName">
                <Form.Label>{t('height')}</Form.Label>
                <Form.Control type='number' placeholder={t('height')} value={height} onChange={(e) => setHeight(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addTaskFormTaskName">
                <Form.Label>{t('weight')}</Form.Label>
                <Form.Control type='number' placeholder={t('weight')} value={weight} onChange={(e) => setWeight(e.target.value)} />
            </Form.Group>
            <Button type='submit' text={t('calculate_bmi')} className='btn btn-block' />
        </Form>
        { BMI > 0 &&
        <div class="alert alert-primary">
         {t('your_bmi_is')} : {BMI}
        </div>
        }
        <Table>
            <tbody>
            <tr>
                <td>{t('bmi_1')}</td>
                <td>0 - 14,9</td>
            </tr>
            <tr>
                <td>{t('bmi_2')}</td>
                <td>15 - 17,9</td>
            </tr>
            <tr>
                <td>{t('bmi_3')}</td>
                <td>18 - 18,9</td>
            </tr>
            <tr>
                <td>{t('bmi_4')}</td>
                <td>19 - 24,9</td>
            </tr>
            <tr>
                <td>{t('bmi_5')}</td>
                <td>25,0 - 29,9</td>
            </tr>
            <tr>
                <td>{t('bmi_6')}</td>
                <td>30,0 - 34,9</td>
            </tr>
            <tr>
                <td>{t('bmi_7')}</td>
                <td>35,0 - 39,9</td>
            </tr>
            <tr>
                <td>{t('bmi_8')}</td>
                <td>40,0 {t('bmi_ormore')}</td>
            </tr>
            </tbody>
        </Table>
    </div>
  )
}

export default BmiCalculator